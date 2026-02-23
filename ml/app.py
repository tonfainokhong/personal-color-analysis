from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io

from inference import parse_face
from analysis import compute_metrics, classify_season
import numpy as np

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"ok": True}

@app.post("/parse")
async def parse(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")
    result = parse_face(image)
    return result

@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    print("HIT analyze")
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")

    parse_result = parse_face(image)
    print("keys:", parse_result.keys())

    image_array = np.array(image)
    skin_mask = np.array(parse_result["skin_mask_array"], dtype=np.uint8)
    hair_mask = np.array(parse_result["hair_mask_array"], dtype=np.uint8)

    metrics = compute_metrics(
        image_array,
        skin_mask,
        hair_mask=hair_mask
    )
    season = classify_season(metrics)

    return {
        "metrics": metrics,
        "season": season
    }