#!/usr/bin/env python3
"""
Test chat logging through the API endpoint
"""

import requests
import json

def test_chat_logging():
    print("🧪 Testing Chat Logging via API")
    print("=" * 50)
    
    # Test chat endpoint
    try:
        response = requests.post('http://localhost:8002/api/chat', 
                               json={'message': 'سلام، چطوری؟'})
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Chat response: {result['answer'][:50]}...")
        else:
            print(f"❌ Chat failed: {response.status_code}")
            print(response.text)
            
    except Exception as e:
        print(f"❌ Chat error: {e}")
    
    print("\n📊 Checking logs...")
    
    # Check logs
    try:
        import sys
        import os
        sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))
        
        from core.db import get_db
        from models.log import ChatLog
        
        db = next(get_db())
        logs = db.query(ChatLog).order_by(ChatLog.timestamp.desc()).limit(3).all()
        
        print(f"Found {len(logs)} logs:")
        for log in logs:
            print(f"  - ID: {log.id}, User: {log.user_text[:30]}...")
            
    except Exception as e:
        print(f"❌ Log check error: {e}")

if __name__ == "__main__":
    test_chat_logging()
