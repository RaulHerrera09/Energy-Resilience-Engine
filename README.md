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


## 👨‍💻 Professional Profile

* **Current Status**: Computer Systems Engineering Student at **Universidad Lamar** (Expected 2026).
* **Specialization**: Data Analyst (Python, SQL, Pandas) via **TripleTen Bootcamp** (2025).
* **Location**: Based in Mexico (Available for Remote Global Roles).
* **Technical Background**:
    * **FlexTronics**: 8 months of experience in technical operations and industrial workflows.
    * **Nubir**: Developed an automated support chatbot during a professional internship.
* **Core Focus**: Building data-driven tools that bridge the gap between complex backend engineering and actionable business intelligence.