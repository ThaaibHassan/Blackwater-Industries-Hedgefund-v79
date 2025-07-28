#!/usr/bin/env python3

import requests
import json
import time

def test_mt5_api():
    base_url = "http://localhost:8000"
    
    print("🧪 Testing MT5 API...")
    
    # Test health endpoint
    try:
        response = requests.get(f"{base_url}/health", timeout=5)
        if response.status_code == 200:
            print("✅ Health check passed")
            print(f"   Status: {response.json()}")
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Could not connect to API: {e}")
        return False
    
    # Test stats endpoint
    try:
        response = requests.get(f"{base_url}/stats", timeout=5)
        if response.status_code == 200:
            stats = response.json()
            print("✅ Stats endpoint working")
            print(f"   Balance: ${stats['account']['balance']}")
            print(f"   Equity: ${stats['account']['equity']}")
            print(f"   Win Rate: {stats['statistics']['win_rate']}%")
        else:
            print(f"❌ Stats endpoint failed: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"❌ Stats request failed: {e}")
    
    # Test trades endpoint
    try:
        response = requests.get(f"{base_url}/trades", timeout=5)
        if response.status_code == 200:
            trades = response.json()
            print(f"✅ Trades endpoint working ({len(trades)} open trades)")
        else:
            print(f"❌ Trades endpoint failed: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"❌ Trades request failed: {e}")
    
    print("\n🎉 MT5 API test completed!")
    return True

if __name__ == "__main__":
    test_mt5_api() 