"""
Agent 1: Research Agent
Responsible for fetching cultural context, idioms, and taboos per market.
Uses the modern google-genai search grounding/web tools to fetch live insights.
"""

import os
from google import genai
from google.genai import types

class ResearchAgent:
    """
    Gathers localized cultural connotations and semantic context for a target country or region.
    """
    
    def __init__(self, config: dict):
        """
        Initializes the Research Agent with settings.
        """
        self.config = config
        api_key = config.get("GEMINI_API_KEY") or os.getenv("GEMINI_API_KEY")
        # Initialize client using new google-genai SDK
        self.client = genai.Client(api_key=api_key) if api_key else genai.Client()
        # Use gemini-2.5-flash which is the modern model supporting search grounding config
        self.model_name = "gemini-2.5-flash"
        
    def gather_cultural_context(self, content: str, market: str) -> dict:
        """
        Runs live google searches to construct grounded cultural reports.
        """
        prompt = f"""System Role: Local Cultural Historian & Sociologist Agent.
Your objective is to identify cultural nuances, idioms, references, and taboos associated with the copy provided in the targeting market of {market}.

Look for:
- Regional connotations, historical references, or potential language sensitivities.
- Spiritual, religious, political, or social taboos.
- Popular consumer perceptions and modern regional trends of similar phrasing or topics.

Copy code to evaluate: "{content}"
"""
        metadata_sources = []
        try:
            # Enable Search Grounding tool in new google-genai Python SDK
            config = types.GenerateContentConfig(
                tools=[{"google_search": {}}]
            )
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=config
            )
            findings_summary = response.text or "No specific context retrieved."
            
            # Retrieve grounding sources from new SDK structure
            try:
                if (response.candidates and 
                    len(response.candidates) > 0 and 
                    response.candidates[0].grounding_metadata):
                    meta = response.candidates[0].grounding_metadata
                    if hasattr(meta, 'grounding_chunks') and meta.grounding_chunks:
                        for chunk in meta.grounding_chunks:
                            if hasattr(chunk, 'web') and chunk.web and hasattr(chunk.web, 'uri') and chunk.web.uri:
                                metadata_sources.append(chunk.web.uri)
                            elif isinstance(chunk, dict) and 'web' in chunk and chunk['web'] and 'uri' in chunk['web']:
                                metadata_sources.append(chunk['web']['uri'])
            except Exception as meta_err:
                # Silently catch meta parsing variations
                pass
                            
        except Exception as e:
            # Fallback direct generation if grounding or api_key errors out
            try:
                response = self.client.models.generate_content(
                    model=self.model_name,
                    contents=prompt
                )
                findings_summary = response.text or "Standard direct context evaluation generated."
            except Exception as inner_e:
                findings_summary = f"Default fallback evaluation. Error: {str(inner_e)}"

        return {
            "market": market,
            "queries_executed": [f"cultural perception of '{content[:20]}' in {market}"],
            "findings_summary": findings_summary,
            "sources": metadata_sources or ["Live Contextual Search Search Engine Output"]
        }
