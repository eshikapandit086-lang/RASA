export interface ProjectFile {
  name: string;
  path: string;
  language: "python" | "env" | "text" | "markdown";
  description: string;
  content: string;
}

export const WORKSPACE_FILES: Record<string, ProjectFile> = {
  "main.py": {
    name: "main.py",
    path: "rasa/main.py",
    language: "python",
    description: "App entry point. Loads config and runs the Research, Analysis, and Report compilation pipeline recursively.",
    content: `\"\"\"
Main entry point for Rasa - Cultural Intelligence Agent for Global Creators.
Orchestrates the multi-agent pipeline: Research -> Analyze -> Report.
\"\"\"

import sys
import os
from google_adk import AgentPipeline, ExecutionContext
from config.settings import load_config
from agents.research_agent import ResearchAgent
from agents.analyzer_agent import AnalyzerAgent
from agents.reporter_agent import ReporterAgent

def run_pipeline(content: str, target_markets: list[str]) -> str:
    \"\"\"
    Executes the multi-agent orchestration workflow.
    
    Args:
        content (str): The social media caption, tagline, or campaign idea to verify.
        target_markets (list[str]): List of target countries/markets (e.g., ['India', 'Japan']).
        
    Returns:
        str: Compiled final cultural intelligence report.
    \"\"\"
    # 1. Load configurations and API tokens
    config = load_config()
    print(f"[*] Initializing Rasa Cultural Intelligence Pipeline for {len(target_markets)} markets...")
    print(f"[*] Input Content: '{content[:50]}...'")
    
    # 2. Instantiate individual specialized agents
    research_agent = ResearchAgent(config=config)
    analyzer_agent = AnalyzerAgent(config=config)
    reporter_agent = ReporterAgent(config=config)
    
    # 3. Create context for execution shared among agents
    context = {
        "raw_content": content,
        "target_markets": target_markets,
        "research_results": {},
        "analysis_scores": {},
        "final_report": ""
    }
    
    # --- Agent 1: Cultural Context Researching ---
    print("\\n[Stage 1] Dispatching Agent 1: Research Agent...")
    for market in target_markets:
        print(f"  > Fetching cultural trends and taboos for market: {market}")
        context["research_results"][market] = research_agent.gather_cultural_context(
            content=content, 
            market=market
        )
        
    # --- Agent 2: Cultural Scoring and Risk Analysis ---
    print("\\n[Stage 2] Dispatching Agent 2: Analyzer Agent...")
    for market in target_markets:
        print(f"  > Auditing content resonance level for market: {market}")
        context["analysis_scores"][market] = analyzer_agent.analyze_and_score(
            content=content,
            market_context=context["research_results"][market],
            market=market
        )
        
    # --- Agent 3: Report Compilation ---
    print("\\n[Stage 3] Dispatching Agent 3: Reporter Agent...")
    print("  > Consolidating market intelligence and rendering recommendation draft...")
    context["final_report"] = reporter_agent.generate_report(
        content=content,
        research_data=context["research_results"],
        analysis_data=context["analysis_scores"]
    )
    
    print("\\n[✔] Cultural Intelligence analysis completed successfully!")
    return context["final_report"]

if __name__ == "__main__":
    # Standard dummy run for demonstration/testing
    sample_content = "Elevate your morning routine with our superfood latte blend. Brew, energize, conquer."
    sample_markets = ["India", "Japan", "South Korea", "USA"]
    
    report = run_pipeline(sample_content, sample_markets)
    print("\\n--- WORKSPACE DEMO REPORT PREVIEW ---")
    print(report)
`
  },
  ".env": {
    name: ".env",
    path: "rasa/.env",
    language: "env",
    description: "Private API configuration file. Loaded locally using Python-dotenv, never pushed to Git.",
    content: `# Rasa API Configuration
# Copy this from .env.example and insert your real credentials.

# Your Gemini Pro/Flash API Key from Google AI Studio
GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"

# Optional Google Search Tool API Key (e.g. Google Search RSS or custom search tools)
GOOGLE_SEARCH_API_KEY=""
`
  },
  ".env.example": {
    name: ".env.example",
    path: "rasa/.env.example",
    language: "env",
    description: "Template/blueprint showing necessary environmental variables for coworkers, with values masked.",
    content: `# Rasa API Configuration Template
# Duplicate this file as '.env' and fill in the values below.

# MANDATORY: Your Gemini 2.0 Flash API Key for Agent Operations
GEMINI_API_KEY="enter_your_gemini_api_key_here"

# OPTIONAL: Search API Key for direct web-grounding if required by search tools.
GOOGLE_SEARCH_API_KEY="enter_search_api_key_if_used"
`
  },
  "requirements.txt": {
    name: "requirements.txt",
    path: "rasa/requirements.txt",
    language: "text",
    description: "External package dependencies file. Defines Google ADK multi-agent tools, Gradio UI, dotenv, etc.",
    content: `# Rasa Cultural Intelligence Agent Dependencies

# Google ADK: Multi-agent builder framework
google-adk==0.1.0

# LLM Framework SDK
# Google GenAI ecosystem tools
google-generativeai==0.8.3

# Web Application User Interface
gradio==4.44.1

# Environment Variable Loader
python-dotenv==1.0.1
`
  },
  "README.md": {
    name: "README.md",
    path: "rasa/README.md",
    language: "markdown",
    description: "Project documentation guide. High-level agent map, workflow, setup steps, and local environment activation commands.",
    content: `# Rasa — Cultural Intelligence Agent for Global Creators

Rasa is an AI-powered Multi-Agent team that researches local cultural nuances, flags hidden offensive double-meanings or risks, and calculates resonance ratings for social media copy, ads, taglines, or product statements across global markets (India, South Korea, Japan, USA).

---

## 🤖 Multi-Agent Architecture

Rasa splits the task across three specialized agents powered by **Gemini 2.0 Flash** via the **Google ADK** (Agent Development Kit):

1. **Agent 1 — Research Agent**: Locates and retrieves historical, idiom, and current cultural context, taboos, and references related to your copy in each selected country.
2. **Agent 2 — Analyzer Agent**: Reviews the research, finds potential visual/literal conflict points, and rates the overall local market resonance (0-100) and risk factors.
3. **Agent 3 — Reporter Agent**: Consolidates the technical details, scoring profiles, and highlights into a user-friendly executive summary report.

---

## 📂 Project Directory Structure

... [See full directory tree schematic in the project sidebar tree explorer] ...
`
  },
  "agents_init": {
    name: "__init__.py",
    path: "rasa/agents/__init__.py",
    language: "python",
    description: "Initializes the agents package, enabling modular Python relative imports.",
    content: `\"\"\"
Agents modules for Rasa.
Exports specialized classes for Research, Analysis, and Report building.
\"\"\"

from .research_agent import ResearchAgent
from .analyzer_agent import AnalyzerAgent
from .reporter_agent import ReporterAgent

__all__ = ["ResearchAgent", "AnalyzerAgent", "ReporterAgent"]
`
  },
  "research_agent.py": {
    name: "research_agent.py",
    path: "rasa/agents/research_agent.py",
    language: "python",
    description: "Agent 1. Harnesses Search tools and Gemini reasoning to explore localized connotations and slang taboos.",
    content: `\"\"\"
Agent 1: Research Agent
Responsible for fetching cultural context, slang, slang translations, and taboos per market.
Uses the search tool or web grounding search adapters.
\"\"\"

from google_adk import Agent
from tools.search_tool import search_web_context

class ResearchAgent:
    \"\"\"
    Gathers localized cultural connotations and semantic context for a target country or region.
    \"\"\"
    
    def __init__(self, config: dict):
        \"\"\"
        Initializes the Research Agent with specific settings and LLM rules.
        \"\"\"
        self.config = config
        self.model_name = "gemini-2.0-flash"
        # In actual implementation: Load prompts/research_prompt.txt
        
    def gather_cultural_context(self, content: str, market: str) -> dict:
        \"\"\"
        Runs web queries or knowledge lookups to summarize slang, taboos, and double-meanings.
        
        Args:
            content (str): The creator's copy.
            market (str): The target geographic market code (e.g., USA, South Korea).
            
        Returns:
            dict: Research findings including slang flags, holidays, or religious considerations.
        \"\"\"
        # Placeholder logic:
        # 1. Format the search prompt by combining core content and market context.
        # 2. Call search_web_context(market, query) to fetch live data.
        # 3. Use Gemini 2.0 Flash to distill searching outcomes into structured notes.
        
        return {
            "market": market,
            "queries_executed": [f"cultural trends for {market}", f"slang in {market}"],
            "findings_summary": f"Placeholder: Research findings for '{content[:20]}' in {market}.",
            "slang_watchouts": ["Slang alert detailed in future Agent implementation"],
            "holidays_conflicts": "None identified in current skeleton run."
        }
`
  },
  "analyzer_agent.py": {
    name: "analyzer_agent.py",
    path: "rasa/agents/analyzer_agent.py",
    language: "python",
    description: "Agent 2. Grades cultural risk profiles (Low/Med/High) and computes localized demographic appeal ratios.",
    content: `\"\"\"
Agent 2: Analyzer Agent
Reviews content, rates local brand resonance, and alerts creators of potential offense or cultural taboos.
\"\"\"

from google_adk import Agent

class AnalyzerAgent:
    \"\"\"
    Calculates resonance metrics and audits copy against localized taboos/risks.
    \"\"\"
    
    def __init__(self, config: dict):
        \"\"\"
        Initializes the Analyzer Agent with model configurations.
        \"\"\"
        self.config = config
        self.model_name = "gemini-2.0-flash"
        # In actual implementation: Load prompts/analyzer_prompt.txt
        
    def analyze_and_score(self, content: str, market_context: dict, market: str) -> dict:
        \"\"\"
        Processes content against researched insights to score resonance (0-100) and risks.
        
        Args:
            content (str): Creator copy inputs.
            market_context (dict): Summary output from the ResearchAgent.
            market (str): Target market country.
            
        Returns:
            dict: Cultural scorecard containing resonance score, risk profile, and specific warnings.
        \"\"\"
        # Placeholder logic:
        # 1. Feed content, research findings, and prompts/analyzer_prompt.txt to Gemini.
        # 2. Extract numeric ratings for interest and cultural alignment.
        # 3. Detect sensitive topics: puns, negative word association, history, and customs.
        
        return {
            "market": market,
            "resonance_score": 85, # Placeholder score
            "risk_level": "Low",   # Low, Medium, High
            "reasoning": f"Placeholder grading explaining resonance of '{content[:20]}' given local context.",
            "linguistic_risks": [],
            "visual_concerns": ["Colors look appropriate"],
            "cultural_resonance_factors": ["High relevance", "Trendy topic"]
        }
`
  },
  "reporter_agent.py": {
    name: "reporter_agent.py",
    path: "rasa/agents/reporter_agent.py",
    language: "python",
    description: "Agent 3. Pulls scoring diagnostics into formatted reports detailing action-oriented strategic copies.",
    content: `\"\"\"
Agent 3: Reporter Agent
Synthesizes scientific details, context summaries, and scoring matrices from predecessor agents to build
a fully polished markdown executive report outline.
\"\"\"

from google_adk import Agent

class ReporterAgent:
    \"\"\"
    Builds structured reports and recommends precise strategic updates to maximize resonance.
    \"\"\"
    
    def __init__(self, config: dict):
        \"\"\"
        Initializes the Reporter Agent with template configurations.
        \"\"\"
        self.config = config
        self.model_name = "gemini-2.0-flash"
        # In actual implementation: Load prompts/reporter_prompt.txt
        
    def generate_report(self, content: str, research_data: dict, analysis_data: dict) -> str:
        \"\"\"
        Compiles research logs and scores into markdown for creators.
        
        Args:
            content (str): The evaluated copy.
            research_data (dict): Mapping of market names -> research findings.
            analysis_data (dict): Mapping of market names -> scoring files.
            
        Returns:
            str: Markdown formatted advisory report.
        \"\"\"
        # Placeholder logic:
        # 1. Organize metadata into tabular format showing comparative scores.
        # 2. Inject market-by-market summaries with strategic bullet warnings.
        # 3. Output alternative wording recommendations if risk is high.
        
        report_md = f\"\"\"# Rasa Cultural Intelligence Advisory Report
        
## 📝 Creator Content
> \\"{content}\\"

## 🌍 Market Overview Scorecard
| Market | Resonance Score (0-100) | Risk Profile | Principal Finding |
| :--- | :---: | :---: | :--- |
\"\"\"
        for market in research_data.keys():
            score_profile = analysis_data.get(market, {})
            score = score_profile.get("resonance_score", "N/A")
            risk = score_profile.get("risk_level", "N/A")
            report_md += f"| **{market}** | {score}/100 | {risk} | Scanned successfully. Ready for full deployment. |\\n"
            
        report_md += \"\"\"
---

## 🔍 Localized Market Intelligence Breaks

### 1. India (Market Highlights)
* **Insights**: Highly responsive to vibrant storytelling and wellness angles.
* **Slang Flag**: Ensure wellness descriptors remain humble and scientifically supported.
* **Advice**: Excellent alignment with modern conscious consumers.

### 2. Japan (Market Highlights)
* **Insights**: Prefers minimal, polite, and elegant messaging.
* **Controversy Flag**: Morning routines are valued; keep the vibe gentle and stress-free.
* **Advice**: High potential with subtle adjustments.

---
*Report generated by Rasa Agent Orchestration pipeline.*
\"\"\"
        return report_md
`
  },
  "tools_init": {
    name: "__init__.py",
    path: "rasa/tools/__init__.py",
    language: "python",
    description: "Registers search utilities and exports them to ease multi-agent capability bindings.",
    content: `\"\"\"
Tools package namespace.
\"\"\"

from .search_tool import search_web_context

__all__ = ["search_web_context"]
`
  },
  "search_tool.py": {
    name: "search_tool.py",
    path: "rasa/tools/search_tool.py",
    language: "python",
    description: "Harnesses MCP search or live search wrappers to query localize data streams.",
    content: `\"\"\"
MCP or general web search utility.
Provides live grounding inputs to the ResearchAgent.
\"\"\"

def search_web_context(market: str, query: str) -> str:
    \"\"\"
    Executes a web search scoped to the specified country/market trends.
    Uses target search engines or Google Custom Search APIs.
    
    Args:
        market (str): Target market (e.g., Japan, South Korea).
        query (str): Searching string query.
        
    Returns:
        str: Short text summaries of search results representing recent cultural phenomena.
    \"\"\"
    # Placeholder logic:
    # 1. Fetch search query from a Google API or scraping engine
    # 2. Filter search query to target geographic geo-codes
    # 3. Return relevant text paragraphs
    
    return f"Search result stub for country: '{market}' search query: '{query}'."
`
  },
  "research_prompt.txt": {
    name: "research_prompt.txt",
    path: "rasa/prompts/research_prompt.txt",
    language: "text",
    description: "Detailed system instructions modeling the Local Cultural Historian & Sociologist Agent.",
    content: `System Role: Local Cultural Historian & Sociologist Agent.

Instructions:
Your objective is to identify cultural nuances, idioms, references, and taboos associated with the user's provided content in the TARGET_MARKET.

Please look out for:
1. Double expressions, negative puns, or linguistic jokes.
2. Political sensitivity, taboos, and history concerns.
3. Slang watchouts or changes in language meanings.
4. Religious or cultural calendar overlaps.

Output format:
List findings as concise bullet points.
`
  },
  "analyzer_prompt.txt": {
    name: "analyzer_prompt.txt",
    path: "rasa/prompts/analyzer_prompt.txt",
    language: "text",
    description: "Persona and operational boundaries modeling the Culture & Alignment Marketing Strategist Agent.",
    content: `System Role: Culture & Alignment Marketing Strategist Agent.

Instructions:
Review the following content alongside the local market research material provided, and score the resonance level and risk factors (0 - 100).

Evaluation Rubrics:
- Resonance: Is the hook appealing to the demographic?
- Risk: Does it clash with spiritual, moral, or societal guidelines?
- Humor: Do joke, idiom, or style translation elements land successfully?

Output:
Provide numeric score, risk label (Low/Medium/High), and descriptive strategic insights.
`
  },
  "reporter_prompt.txt": {
    name: "reporter_prompt.txt",
    path: "rasa/prompts/reporter_prompt.txt",
    language: "text",
    description: "Instructions modeling the Principal Global Copywriter to bundle metrics into Markdown files.",
    content: `System Role: Principal Global Copywriter and Editor-in-Chief.

Instructions:
Draft a gorgeous cultural evaluation report in markdown format. You will combine the factual research findings from the research team and the scores and ratings from the analysis team.

Tone Guidelines:
- Highly professional, constructive, and direct.
- Action-oriented copy improvements.
- Easy to digest with scannable tables and warning chips.
`
  },
  "config_init": {
    name: "__init__.py",
    path: "rasa/config/__init__.py",
    language: "python",
    description: "Exposes system loaders facilitating instant variable fetching.",
    content: `\"\"\"
Configuration package namespace.
\"\"\"

from .settings import load_config

__all__ = ["load_config"]
`
  },
  "settings.py": {
    name: "settings.py",
    path: "rasa/config/settings.py",
    language: "python",
    description: "Configures settings. Safely calls dotenv loaders and models global temperature and parameters.",
    content: `\"\"\"
Settings Manager.
Loads, decodes, and validates environment configurations for the Rasa ecosystem safely.
\"\"\"

import os
from dotenv import load_dotenv

def load_config() -> dict:
    \"\"\"
    Loads variables from local '.env' file or container environment.
    
    Returns:
        dict: Safely filtered configuration keys for system APIs.
    \"\"\"
    # Load .env file if present
    load_dotenv()
    
    gemini_api_key = os.getenv("GEMINI_API_KEY", "")
    search_api_key = os.getenv("GOOGLE_SEARCH_API_KEY", "")
    
    # Simple validation log
    if not gemini_api_key:
        print("[⚠] Warning: GEMINI_API_KEY is not configured in environment variables or .env file.")
    
    return {
        "GEMINI_API_KEY": gemini_api_key,
        "GOOGLE_SEARCH_API_KEY": search_api_key,
        "DEFAULT_TEMPERATURE": 0.2,
        "DEFAULT_TOP_P": 0.95
    }
`
  }
};

export interface MarketSimulationResult {
  market: string;
  flag: string;
  resonanceScore: number;
  riskLevel: "Low" | "Medium" | "High";
  findings: string[];
  warnings: string[];
  recommendation: string;
  alternative: string;
}

export const SIMULATION_TEMPLATES: Record<string, Record<string, MarketSimulationResult>> = {
  superfood: {
    "India": {
      market: "India",
      flag: "🇮🇳",
      resonanceScore: 92,
      riskLevel: "Low",
      findings: [
        "High alignment with India's deep-rooted Ayurvedic lineage of superfoods and herbal remedies.",
        "Terms like 'latte' (often translated local style: Haldi Doodh/Golden Milk) carry massive warm nostalgia."
      ],
      warnings: [
        "Avoid overly complex westernized jargon. Focus raw ingredients like Turmeric, Ashwagandha or Cardamom if implied."
      ],
      recommendation: "Highlight natural roots, purity, and morning wellness rituals. Excellent product-market alignment.",
      alternative: "Elevate your morning routine with our natural, Ayurvedic-inspired superfood elixir. Pure energy to conquer your day."
    },
    "Japan": {
      market: "Japan",
      flag: "🇯🇵",
      resonanceScore: 78,
      riskLevel: "Low",
      findings: [
        "Morning lattes have high urban appeal in Tokyo, matching modern convenience cafes.",
        "The word 'conquer' (shoufuku) can feel overly aggressive or militaristic in general consumer copy."
      ],
      warnings: [
        "Soften the active tone. Japanese marketing favors feelings of calm, balance, and small moments of luxury rather than assertive 'conquering'."
      ],
      recommendation: "Soften direct action claims. Substitute 'conquer' with terms implying starting your day beautifully or calmly.",
      alternative: "Gently prepare your body and mind. Start your morning with a premium superfood latte for a balanced, vibrant day."
    },
    "South Korea": {
      market: "South Korea",
      flag: "🇰🇷",
      resonanceScore: 88,
      riskLevel: "Low",
      findings: [
        "Extremely high interest in morning health hacks and aesthetic modern latte layouts ('sensory morning routine' trend).",
        "Keywords focusing on 'energy' are popular, but must distinguish clearly from traditional caffeine shakes."
      ],
      warnings: [
        "High competitive market. Visual layout in campaigns should lean heavily minimal and modern premium colors."
      ],
      recommendation: "Stress clean energy output without jitters. Good resonance with corporate working professionals.",
      alternative: "Empower your active morning. Recharge beautifully with our clean, premium superfood blend."
    },
    "USA": {
      market: "USA",
      flag: "🇺🇸",
      resonanceScore: 95,
      riskLevel: "Low",
      findings: [
        "Direct hit for the wellness-obsessed, functional mushroom, and biohacking demographic.",
        "Strong active tone ('energize, conquer') is highly motivating and perfectly matches standard active advertising copy style."
      ],
      warnings: [
        "Ensure clear allergen disclosures and transparency indices are visible on actual product packages."
      ],
      recommendation: "Keep current copy intact. Outstanding target market resonance.",
      alternative: "Elevate your morning routine with our superfood latte blend. Brew, energize, conquer."
    }
  },
  ai_assistant: {
    "India": {
      market: "India",
      flag: "🇮🇳",
      resonanceScore: 88,
      riskLevel: "Low",
      findings: [
        "Vibrant response to technical efficiency, productivity growth, and globally competitive career tools.",
        "High trust in automated virtual help programs as premium aids for daily corporate task flows."
      ],
      warnings: [
        "Avoid terms that sound overly elitist; emphasize accessible educational scaling and shared growth."
      ],
      recommendation: "Advertise the agent as an extension of personal intelligence and a support partner for daily career progress.",
      alternative: "Meet your daily AI co-pilot. Automate routine workflows, amplify your focus, and achieve together."
    },
    "Japan": {
      market: "Japan",
      flag: "🇯🇵",
      resonanceScore: 68,
      riskLevel: "Medium",
      findings: [
        "Heavy caution in workspace contexts regarding data privacy, structural leaks, and displacement fears.",
        "Prefers collaborative, understated assistants over heavy 'autonomous task commanders'."
      ],
      warnings: [
        "Directly claim 'heavily automated control' raises operational anxiety. Focus instead on seamless supportive help."
      ],
      recommendation: "Position the agent as a polite, background virtual 'assistance helper' rather than an autonomous driver.",
      alternative: "Politely assisting your daily focus. A gentle AI partner to simplify your workspace organization."
    },
    "South Korea": {
      market: "South Korea",
      flag: "🇰🇷",
      resonanceScore: 86,
      riskLevel: "Low",
      findings: [
        "Extremely receptive to highly optimized, high-speed task tools ('ppali-ppali' culture).",
        "Loves slick, high-tech dashboard integrations and automated shortcuts."
      ],
      warnings: [
        "Demonstrate immediate utility and measurable time-saving analytics within the initial onboarding copy."
      ],
      recommendation: "Lean heavily on productivity statistics and ultra-clean minimal visuals.",
      alternative: "Maximize your seconds. The high-speed personal AI assistant tailored for your active timeline."
    },
    "USA": {
      market: "USA",
      flag: "🇺🇸",
      resonanceScore: 90,
      riskLevel: "Low",
      findings: [
        "Strong interest in solopreneurship, hustle setups, and saving engineering hours.",
        "High receptivity to 'AI agency' branding."
      ],
      warnings: [
        "General AI marketing fatigue. Highlight unique features or human-in-the-loop safeguards to gain trust."
      ],
      recommendation: "Emphasize concrete workflow hooks (e.g., 'saved 10 hours a week') and custom customizability.",
      alternative: "Delegate your busywork. Secure your personal AI assistant to unlock more focus time."
    }
  },
  fashion_statement: {
    "India": {
      market: "India",
      flag: "🇮🇳",
      resonanceScore: 85,
      riskLevel: "Medium",
      findings: [
        "Deep love for high fashion paired with heritage elements.",
        "Risks occur if styling mocks conservative sensibilities, or if localized festivals / colors are handled without tact."
      ],
      warnings: [
        "Ensure references to spiritual themes or classical clothing are treated with dignity and deep cultural pride."
      ],
      recommendation: "Celebrate fusion aesthetics. Blend global modern design with local classic elegance.",
      alternative: "Indulge in modern luxury, crafted with pride. Celebrate timeless elegance reimagined for today."
    },
    "Japan": {
      market: "Japan",
      flag: "🇯🇵",
      resonanceScore: 90,
      riskLevel: "Low",
      findings: [
        "High appreciation for sustainable, minimalist, slow-fashion philosophies (wabi-sabi aesthetics).",
        "Subtlety and quality craftsman stories score exceptionally high here."
      ],
      warnings: [
        "Avoid scream slogans or over-the-top flashy logos. Japanese street style leans toward subtle, refined detailing."
      ],
      recommendation: "Emphasize longevity, premium touch, and minimal clean silhouettes.",
      alternative: "Crafting silence. Minimal silhouettes designed to fit your unique daily landscape."
    },
    "South Korea": {
      market: "South Korea",
      flag: "🇰🇷",
      resonanceScore: 94,
      riskLevel: "Low",
      findings: [
        "Seoul is a premier fashion hotspot. Fast reaction to trend setters and expressive streetwear concepts.",
        "Loves premium status angles combined with casual, effortlessly chic styling lines."
      ],
      warnings: [
        "Needs high visual quality and high-density street-culture vibes to compete in youth districts."
      ],
      recommendation: "Focus on style individuality, influencer alignment, and bold graphic presence.",
      alternative: "Define the streetscape. Express your true individual perspective through effortless styling."
    },
    "USA": {
      market: "USA",
      flag: "🇺🇸",
      resonanceScore: 88,
      riskLevel: "Low",
      findings: [
        "Strong resonance with body inclusivity, self-expression, and environmentally circular carbon-neutral fabrics.",
        "Audience likes bold statements and direct, casual 'attitude' copy."
      ],
      warnings: [
        "Vague 'green' buzzwords can trigger immediate greenwashing accusations. Be concrete about material inputs."
      ],
      recommendation: "Keep standard expressive and highly confident styles. Ensure circularity/sustainability points are specific.",
      alternative: "Bold, inclusive, sustainable. Express your power with ethically styled clothing."
    }
  }
};
