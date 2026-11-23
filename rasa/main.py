"""
Main entry point for Rasa - Cultural Intelligence Agent for Global Creators.
Orchestrates the multi-agent pipeline: Research -> Analyze -> Report.
Uses the modern google-genai Python library for advanced cultural intelligence pipelines.
"""

import sys
import os
import json
from config.settings import load_config
from agents.research_agent import ResearchAgent
from agents.analyzer_agent import AnalyzerAgent
from agents.reporter_agent import ReporterAgent

def run_pipeline(content: str, target_markets: list[str]) -> str:
    """
    Executes the multi-agent orchestration workflow.
    
    Args:
        content (str): The social media caption, tagline, or campaign idea to verify.
        target_markets (list[str]): List of target countries/markets (e.g., ['India', 'Japan']).
        
    Returns:
        str: Compiled final cultural intelligence report.
    """
    # 1. Load configurations and API tokens
    config = load_config()
    print(f"[*] Initializing Rasa Cultural Intelligence Pipeline for {len(target_markets)} markets...")
    print(f"[*] Input Copy: '{content[:50]}...'")
    
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
    print("\n[Stage 1] Dispatching Agent 1: Research Agent with Search Grounding...")
    for market in target_markets:
        print(f"  > Executing localized crawl/search for market: {market}")
        context["research_results"][market] = research_agent.gather_cultural_context(
            content=content, 
            market=market
        )
        
    # --- Agent 2: Cultural Scoring and Risk Analysis ---
    print("\n[Stage 2] Dispatching Agent 2: Analyzer Agent (Strict Schema Enforcement)...")
    for market in target_markets:
        print(f"  > Auditing brand resonance indexing and risk alerts for market: {market}")
        context["analysis_scores"][market] = analyzer_agent.analyze_and_score(
            content=content,
            market_context=context["research_results"][market],
            market=market
        )
        
    # --- Agent 3: Report Compilation ---
    print("\n[Stage 3] Dispatching Agent 3: Reporter Agent (Synthesizing Report)...")
    print("  > Consolidating market scorecards and compiling final advisory document...")
    context["final_report"] = reporter_agent.generate_report(
        content=content,
        research_data=context["research_results"],
        analysis_data=context["analysis_scores"]
    )
    
    print("\n[✔] Cultural Intelligence analysis completed successfully!")
    return context["final_report"]

if __name__ == "__main__":
    # Use user input if provided, otherwise standard default copy
    sample_content = "Elevate your morning routine with our superfood latte blend. Brew, energize, conquer."
    if len(sys.argv) > 1:
        sample_content = sys.argv[1]
        
    sample_markets = ["India", "Japan", "South Korea", "USA"]
    
    report = run_pipeline(sample_content, sample_markets)
    print("\n" + "="*50)
    print("📋 RASA CULTURAL ADVISORY EXECUTIVE SUMMARY")
    print("="*50)
    print(report)
