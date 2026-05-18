import assemblyai as aai
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import asyncio
import httpx

import os
aai.settings.api_key = os.environ.get("2fe45585274e41509e6182d3ada7c0e3", "")



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/v1/models")
def models():
    return {
        "object": "list",
        "data": [{"id": "assemblyai/base", "object": "model", "owned_by": "assemblyai"}]
    }

@app.post("/v1/audio/transcriptions")
async def transcribe_audio(request: Request):
    form = await request.form()
    audio_file = form.get("file")
    if not audio_file:
        return {"text": ""}

    audio_bytes = await audio_file.read()
    headers = {"authorization": aai.settings.api_key}

    async with httpx.AsyncClient() as client:
        # Step 1 - upload audio
        upload_response = await client.post(
            "https://api.assemblyai.com/v2/upload",
            headers=headers,
            content=audio_bytes,
            timeout=60
        )
        upload_url = upload_response.json()["upload_url"]
        print(f"Uploaded audio: {upload_url}")

        # Step 2 - request transcription
        transcript_response = await client.post(
            "https://api.assemblyai.com/v2/transcript",
            headers=headers,
            json={
                "audio_url": upload_url,
                "speaker_labels": True,
                "speakers_expected": 2,
                "speech_models": ["universal-2"]
            },
            timeout=60
        )
        transcript_data = transcript_response.json()
        print(f"Transcript response: {transcript_data}")

        if "id" not in transcript_data:
            print(f"Error: {transcript_data}")
            return {"text": "transcription error"}

        transcript_id = transcript_data["id"]

        # Step 3 - poll until done
        while True:
            poll = await client.get(
                f"https://api.assemblyai.com/v2/transcript/{transcript_id}",
                headers=headers,
                timeout=30
            )
            result = poll.json()
            status = result["status"]
            print(f"Status: {status}")

            if status == "completed":
                utterances = result.get("utterances", [])
                if utterances:
                    labeled_text = ""
                    for u in utterances:
                        speaker = "Doctor" if u["speaker"] == "A" else "Patient"
                        labeled_text += f"{speaker}: {u['text']}\n"
                    print(f"Done:\n{labeled_text}")
                    return {"text": labeled_text}
                else:
                    return {"text": result.get("text", "")}

            elif status == "error":
                print(f"Transcription failed: {result}")
                return {"text": ""}

            await asyncio.sleep(2)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)