"""
Settings Manager.
Loads, decodes, and validates environment configurations for the Rasa ecosystem safely.
"""

import os
from dotenv import load_dotenv

def load_config() -> dict:
    """
    Loads variables from local '.env' file or container environment.
    
    Returns:
        dict: Safely filtered configuration keys for system APIs.
    """
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
