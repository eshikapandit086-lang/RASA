# Rasa — Cultural Intelligence Agent for Global Creators

Rasa is an AI-powered Multi-Agent team that researches local cultural nuances, flags hidden offensive double-meanings or risks, and calculates resonance ratings for social media copy, ads, taglines, or product statements across global markets (India, South Korea, Japan, USA).

---

## 🤖 Multi-Agent Architecture

Rasa splits the task across three specialized agents powered by **Gemini 2.0 Flash** via the **Google ADK** (Agent Development Kit):

1. **Agent 1 — Research Agent**: Locates and retrieves historical, idiom, and current cultural context, taboos, and references related to your copy in each selected country.
2. **Agent 2 — Analyzer Agent**: Reviews the research, finds potential visual/literal conflict points, and rates the overall local market resonance (0-100) and risk factors.
3. **Agent 3 — Reporter Agent**: Consolidates the technical details, scoring profiles, and highlights into a user-friendly executive summary report.

---

## 📂 Project Directory Structure

```text
rasa/
├── main.py               # Entry point, orchestrating agent execution
├── .env                  # Private API keys and local configuration
├── .env.example          # Public environment configuration blueprint
├── requirements.txt      # Python dependencies (adk, gradio, dotenv)
├── README.md             # Project handbook and walkthrough
├── agents/               # Custom specialized Agent instances
│   ├── __init__.py       
│   ├── research_agent.py # Agent 1: cultural nuance inspector
│   ├── analyzer_agent.py # Agent 2: resonance & controversy rater
│   └── reporter_agent.py # Agent 3: documentation and reports engine
├── tools/                # Extensible MCP tools
│   ├── __init__.py       
│   └── search_tool.py    # Multi-agent Search web tool wrapper
├── prompts/              # Strict persona instructions for each agent 
│   ├── research_prompt.txt   
│   ├── analyzer_prompt.txt   
│   └── reporter_prompt.txt   
└── config/               # Settings loading and config validation
    ├── __init__.py       
    └── settings.py       
```

---

## 🚀 Setting Up the Scaffolding

### 1. Prerequisites
Ensure you have **Python 3.10+** installed on your system.

### 2. Installations
Create a pristine isolated virtual environment and pull down the library requirements:

```bash
# Set up a clean workspace environment
python -m venv venv

# Activate the workspace environment
# On macOS/Linux:
source venv/bin/activate
# On Windows (CMD):
venv\Scripts\activate.bat

# Install Rasa core packages
pip install -r requirements.txt
```

### 3. Setup Secret Keys
Generate your `.env` configuration file:

```bash
cp .env.example .env
```

Open `.env` and configure your credentials:
```env
GEMINI_API_KEY="YOUR_ACTUAL_GEMINI_API_KEY"
```

### 4. Running the Scaffolding
Run the test pipeline entry script to see the scaffolding run outputs:

```bash
python main.py
```
