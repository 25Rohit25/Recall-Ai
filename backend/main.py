import uuid
import asyncio
from fastapi import FastAPI, BackgroundTasks, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional

from routers import meetings, search

app = FastAPI(
    title="FireNotes AI API",
    description="Next-generation Meeting Intelligence Platform Backend",
    version="1.1.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the newly defined routers
app.include_router(meetings.router)
app.include_router(search.router)

# ------------------------------------------------------------------
# Phase 1: Mock Pipeline Endpoints (Kept here for backward compatibility)
# ------------------------------------------------------------------

pipeline_jobs: Dict[str, Dict[str, Any]] = {}

class JobResponse(BaseModel):
    job_id: str
    status: str
    progress: int

class JobStatusResponse(BaseModel):
    job_id: str
    state: str
    progress: int
    result: Optional[Dict[str, Any]] = None

async def run_pipeline(job_id: str):
    stages = [
        ("Validate", 10, 1.0),
        ("Parse Transcript", 30, 2.0),
        ("Detect Speakers", 50, 1.5),
        ("Extract Intelligence", 75, 3.0),
        ("Generate Tasks", 90, 1.0),
        ("Store", 100, 0.5)
    ]
    try:
        for stage_name, progress, delay in stages:
            pipeline_jobs[job_id]["state"] = stage_name
            pipeline_jobs[job_id]["progress"] = progress
            await asyncio.sleep(delay)
            
        pipeline_jobs[job_id]["state"] = "Completed"
        pipeline_jobs[job_id]["progress"] = 100
        pipeline_jobs[job_id]["result"] = {
            "meeting_id": str(uuid.uuid4()),
            "status": "completed",
            "health_score": 85,
            "message": "Pipeline completed successfully"
        }
    except Exception as e:
        pipeline_jobs[job_id]["state"] = "Failed"
        pipeline_jobs[job_id]["result"] = {"error": str(e)}

@app.post("/api/v1/meetings/upload", response_model=JobResponse, tags=["pipeline"])
async def upload_meeting(background_tasks: BackgroundTasks, file: UploadFile = File(None)):
    job_id = str(uuid.uuid4())
    pipeline_jobs[job_id] = {
        "state": "Initializing",
        "progress": 0,
        "result": None
    }
    background_tasks.add_task(run_pipeline, job_id)
    return JobResponse(job_id=job_id, status="Initializing", progress=0)

@app.get("/api/v1/meetings/jobs/{job_id}", response_model=JobStatusResponse, tags=["pipeline"])
async def get_pipeline_status(job_id: str):
    job = pipeline_jobs.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return JobStatusResponse(
        job_id=job_id,
        state=job["state"],
        progress=job["progress"],
        result=job["result"]
    )
