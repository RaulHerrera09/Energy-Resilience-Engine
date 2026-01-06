# EnergyEngine | Multi-Market Grid Resilience Analytics

**EnergyEngine** is a high-performance analytical platform designed to monitor, visualize, and assess the structural resilience of European power grids. By ingesting live data from the **ENTSO-E Transparency Platform**, the system provides deep insights into the energy transition and grid stability of major European economies, including **Germany (DE), France (FR), and Spain (ES)**.

---

## 📊 Data Analytics & Methodology
This project serves as a technical demonstration of advanced data handling and analytical modeling for the energy sector:

* **Predictive Accuracy (MAE):** The platform implements **Mean Absolute Error** tracking to quantify the variance between Day-Ahead forecasts and actual generation output.
  $$MAE = \frac{1}{n} \sum_{i=1}^{n} |y_i - \hat{y}_i|$$
* **Grid Resilience Index:** A proprietary weighted scoring system ($0-100\%$) based on resource diversity and renewable penetration levels to evaluate market health.
* **Multi-Market Engineering:** Automated ETL pipelines processing over **5,200 records** to ensure data integrity across diverse jurisdictional data formats.
* **Automated Risk Detection:** Algorithmic triggers that identify grid vulnerabilities, providing critical alerts when resource diversity falls below safety thresholds.

## 🛠️ Technical Ecosystem
The application is built on a modular **Full-Stack** architecture optimized for time-series data processing:

* **Frontend:** React.js (Tailwind CSS) featuring a high-performance SPA design and **Recharts** for interactive time-series analysis.
* **Backend:** Django REST Framework providing a robust API for multi-market data filtering.
* **Database:** PostgreSQL for optimized relational storage of granular energy records.
* **Infrastructure:** Fully containerized environment using **Docker** to ensure environment parity and scalable deployment.

## 🚀 Key Features
1. **Interactive Dashboard:** Dynamic multi-market filtering with live KPI updates (Total GW, Renewable Share, MAE).
2. **Regional Analysis:** High-level comparative visualization of resource magnitude and generation shares.
3. **Generation Mix Detail:** A granular auditing tool providing a full breakdown of operational status and resource distribution.
4. **Resilience Center:** A decision-support module monitoring system health and active resilience protocols.

## 🚀 Getting Started: Running the Project

Follow these steps to get the full stack up and running in your local environment.

### 1. Prerequisites
Ensure you have Docker, Python 3.x, and Node.js installed

### 2. Environment Configuration
Create a .env file in the root directory and configure your credentials:
```bash
# Database Config
DB_NAME=energy_db
DB_USER=postgres
DB_PASSWORD=your_secure_password

# External API
ENTSOE_API_KEY=your_entsoe_token_here

# Django Security
SECRET_KEY=your_django_secret_key
DEBUG=True
```

### 3. Execution Commands
Infrastructure:
```bash
docker-compose up -d
```

### 4. Backend Setup (Django)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 3. Frontend Dashboard (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
### 4. Data Ingestion (Real-time Pipeline)
```bash
python data_pipeline/fetch_real_data.py
```

## 📂 Project Structure
```text
Energy_Resilience_Engine/
├── backend/                 # Django Rest Framework API
│   ├── api/                 # Data endpoints & Serializers
│   └── core/                # System configuration
├── data_pipeline/           # Python ETL Logic (Pandas/ENTSO-E)
├── frontend/                # React.js SPA
│   ├── src/components/      # Interactive Recharts UI
│   └── App.jsx              # Main Analytical Logic
└── docker-compose.yml       # Infrastructure Orchestration
```

## 🔮 Future Improvements

To further evolve EnergyEngine into a production-grade predictive tool, the following features are planned:

* **ML-Powered Forecasts:** Integrate `Scikit-learn` models to transition from historical analysis to predictive analytics, forecasting the Resilience Index 24 hours in advance.
* **Expanded Market Coverage:** Scale the ETL pipeline architecture to include additional European energy markets beyond the initial DE, FR, and ES territories.
* **Real-time Alerting System:** Implement an automated notification module (via Email or Slack API) to alert stakeholders when the Resilience Score drops below critical safety thresholds.
* **Cloud Migration:** Transition the current local Docker orchestration to a production-ready cloud environment using **AWS (EC2/RDS)** or **Hetzner Cloud** for global accessibility.


## 🧠 About the Developer
I am a Computer Systems Engineering student at Universidad Lamar (Expected 2026) specializing in the intersection of Data Analysis and Software Engineering. I build tools that transform raw, complex data into actionable business intelligence.

**Portfolio**: raulherrera09.github.io/RaulHerrera.github.io/

**LinkedIn**: @raulherreradelgadillo


