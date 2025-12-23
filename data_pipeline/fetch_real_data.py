import os
import pandas as pd
from entsoe import EntsoePandasClient
from sqlalchemy import create_engine
from entsoe.exceptions import NoMatchingDataError
from datetime import datetime, timedelta
import pytz
import traceback

API_TOKEN = '4af414aa-5e34-41aa-9e47-30cb1795964f'
DB_URL = "postgresql://admin:secret_password@127.0.0.1:5432/energy_resilience"
COUNTRIES = ['DE', 'FR', 'ES', 'GB']


def fetch_and_store_energy_data(area_code):
    print(f"\n--- Starting Data Ingestion for Market: {area_code} ---")

    client = EntsoePandasClient(api_key=API_TOKEN)
    engine = create_engine(DB_URL)

    # Define Time Range
    end = pd.Timestamp.now(tz='UTC') - pd.Timedelta(days=3)
    start = end - pd.Timedelta(hours=24)

    print(f"Requesting data for {area_code} from {start} to {end}...")

    df_melted = None

    try:
        try:
            # PLAN A: Fetch Detailed Generation
            print(f"Attempting Plan A: Detailed Generation for {area_code}...")
            df = client.query_generation(
                area_code, start=start, end=end, psr_type=None)

            if df is None or df.empty:
                raise NoMatchingDataError("Empty detailed generation")

            # Data Transformation
            df = df.reset_index()
            df.columns = ['timestamp'] + list(df.columns[1:])
            df_melted = df.melt(
                id_vars='timestamp', var_name='resource_type', value_name='actual_generation_mw')
            print(
                f"✅ Plan A Success: Detailed data processed for {area_code}.")

        except NoMatchingDataError:
            # PLAN B: Fallback to Total Load if Plan A fails
            print(
                f"⚠️ Plan A failed. Attempting Plan B: Total Load Fallback for {area_code}...")
            df_load = client.query_load(area_code, start=start, end=end)

            if df_load is None or df_load.empty:
                raise NoMatchingDataError("Empty total load data")

            df_melted = df_load.reset_index()
            df_melted.columns = ['timestamp', 'actual_generation_mw']
            df_melted['resource_type'] = 'Total Load (Fallback)'
            print(f"✅ Plan B Success: Total Load processed for {area_code}.")

    except NoMatchingDataError:
        # If BOTH plans fail, we catch it here and skip the country
        print(
            f"❌ SKIPPING {area_code}: No data found for Plan A or Plan B in this range.")
        return
    except Exception:
        print(f"❌ CRITICAL ERROR FETCHING {area_code}:")
        traceback.print_exc()
        return

    # 3. Database Storage Section (Only executes if df_melted exists)
    try:
        df_melted['country_code'] = area_code
        df_melted['forecast_generation_mw'] = None
        df_melted['timestamp'] = pd.to_datetime(
            df_melted['timestamp'], utc=True)

        rows_to_insert = len(df_melted)
        print(f"DEBUG: Rows ready for {area_code}: {rows_to_insert}")

        # Storing in the table managed by Django
        df_melted.to_sql('api_energygeneration', engine,
                         if_exists='append', index=False)
        print(
            f"✅ FINAL SUCCESS: {rows_to_insert} records stored for {area_code}.")

    except Exception:
        print(f"❌ DATABASE STORAGE ERROR FOR {area_code}:")
        traceback.print_exc()


if __name__ == "__main__":
    print("Initializing Multi-Country Energy Ingestion Pipeline...")
    for country in COUNTRIES:
        fetch_and_store_energy_data(country)
    print("\n--- Pipeline execution finished ---")
