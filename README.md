# RASA: Cultural Intelligence for Global Marketing Copy

RASA is a three-agent pipeline that checks marketing copy against the cultural context of different markets. It was built as my capstone for Kaggle's AI Agents Intensive.

Kaggle notebook: https://www.kaggle.com/code/eshikapandit/rasa-culural-intelligence-agent

## What it does

You give it a caption, tagline or campaign idea and a list of target markets (default: India, Japan, South Korea, USA). For each market it returns:

- a resonance score from 0 to 100
- a risk level (Low, Medium or High)
- key findings and a regional warning
- a localised alternative version of the copy
- a recommendation (Safe, Caution or Avoid)

It then compiles everything into a Markdown advisory report.

## How it works

Three stages, one specialised agent each:

1. **Research agent:** uses Gemini with Google Search grounding to gather idioms, double meanings, taboos and current trends for the market.
2. **Analyzer agent:** reads the research and scores resonance and risk, returning structured JSON (a Pydantic schema in Python, a response schema in TypeScript).
3. **Reporter agent:** turns the market scorecards into the final report.

## What is in this repo

| Path | What it is |
|---|---|
| `rasa/` | Python implementation: three agent classes, prompts, config and a command-line entry point (`main.py`), using the `google-genai` SDK |
| `server.ts`, `src/` | Web app: an Express server exposing `POST /api/pipeline` (the same three stages using `@google/genai`) and a React + Vite front end |

## Run the web app

```bash
npm install
cp .env.example .env      # then set GEMINI_API_KEY
npm run dev               # http://localhost:3000
```

## Run the Python pipeline

```bash
cd rasa
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env      # then set GEMINI_API_KEY
python main.py "Your marketing copy here"
```

## Status and known limitations

- The hosted demo is paused. Run it locally with your own Gemini API key.
- When the Gemini call fails or no key is set, the web server currently returns simulated results (hard-coded for a few sample phrases, otherwise scores derived from the text), and the Python reporter falls back to fixed placeholder text. The Python analyzer now reports the failure instead of inventing a score. Replacing the remaining fallbacks with explicit errors is the next change.
- Google ADK is listed in `rasa/requirements.txt`, but the code calls the `google-genai` SDK directly.
- `rasa/tools/search_tool.py` is a stub. Live search comes from Gemini's built-in Google Search grounding.
- Scores are model judgements. They have not been validated against real audience data.
