# SHIM FOR RENDER DEPLOYMENT
# Render is likely configured to start the server using: `uvicorn main:app --host 0.0.0.0 --port 10000`
# Since we refactored the app into `app/main.py` following Domain Driven Design, 
# this file acts as a bridge so the existing Render deployment does not break.

from app.main import app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
