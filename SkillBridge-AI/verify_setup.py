import requests
import sys

def verify_backend():
    base_url = "http://localhost:8000"
    print(f"Verifying backend at {base_url}...")
    
    try:
        # Check health
        resp = requests.get(f"{base_url}/health")
        if resp.status_code == 200:
            print("✅ Health check passed")
        else:
            print(f"❌ Health check failed: {resp.status_code}")
            
        # Check root
        resp = requests.get(f"{base_url}/")
        if resp.status_code == 200:
            print(f"✅ Root endpoint passed: {resp.json().get('message')}")
            
        # Check protected endpoint (should fail with 403 or 401)
        resp = requests.get(f"{base_url}/api/v1/users/me")
        if resp.status_code == 403 or resp.status_code == 401:
            print("✅ Protected endpoint correctly rejected unauthorized request")
        else:
            print(f"❌ Protected endpoint returned unexpected status: {resp.status_code}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to backend. Is it running?")
        print("Run: cd backend && uvicorn app.main:app --reload")

if __name__ == "__main__":
    verify_backend()
