# FFMPEG must be installed and available in the system PATH for this code to work. You can download it from https://ffmpeg.org/download.html and follow the installation instructions for your operating system.

import os
import subprocess
import tempfile
from typing import List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel

import requests
from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs

load_dotenv()

app = FastAPI()

# Allow requests from the frontend (Next.js dev server)
ORIGINS = [os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")

elevenlabs = ElevenLabs(
    api_key=ELEVENLABS_API_KEY,
)
if not ELEVENLABS_API_KEY:
    raise RuntimeError("ELEVENLABS_API_KEY must be set in the environment")


class PodcastRequest(BaseModel):
    text: str


def _chunk_text(txt: str, max_len: int = 3000) -> List[str]:
    chunks: List[str] = []
    i = 0
    while i < len(txt):
        slice_limit = min(i + max_len, len(txt))
        end = txt.rfind(".", i, slice_limit)
        if end <= i:
            end = slice_limit
        else:
            end += 1
        chunks.append(txt[i:end].strip())
        i = end
    return [c for c in chunks if c]


def _build_podcast_script(resume_text: str) -> str:
    # Simple template-based script generation (free alternative to AI)
    lines = resume_text.split('\n')[:5]  # Take first 5 lines of resume

    script = f"""Host A: Welcome to today's podcast! We're excited to discuss an impressive resume we've come across.

Host B: Absolutely! Let's dive right in. This person has some fascinating experience.

Host A: Looking at their background, I see they have experience in {lines[0] if lines else 'various fields'}.

Host B: That's interesting! It seems like they've worked on {lines[1] if len(lines) > 1 else 'diverse projects'}.

Host A: Their skills include {lines[2] if len(lines) > 2 else 'technical expertise and problem-solving'}.

Host B: I can see they've achieved {lines[3] if len(lines) > 3 else 'significant milestones in their career'}.

Host A: Overall, this resume shows someone who's {lines[4] if len(lines) > 4 else 'dedicated and skilled in their field'}.

Host B: Thanks for joining us for this resume discussion! Remember to check out more career insights.

Host A: That's all for today. Stay tuned for more episodes!"""

    return script



def generate_audio_bytes(text: str, voice_id: str) -> bytes:
    audio_stream = elevenlabs.text_to_speech.convert(
        text=text,
        voice_id=voice_id,
        model_id="eleven_v3",
        output_format="mp3_44100_128",
        voice_settings={
            "stability": 0.35,
            "similarity_boost": 0.85,
            "style": 0.6,
            "use_speaker_boost": True
        }
    )

    audio_bytes = b"".join(audio_stream)
    return audio_bytes

def _synthesize_audio(script: str) -> bytes:
    voice_ids = {
        "Host A": "JBFqnCBsd6RMkjVDRZzb",  # George
        "Host B": "EXAVITQu4vr4xnSDxMaL",  # Bella
    }

    with tempfile.TemporaryDirectory() as tmpdir:
        segment_paths = []

        lines = script.split("\n")

        for idx, line in enumerate(lines):
            line = line.strip()
            if not line:
                continue

            if line.startswith("Host A:"):
                speaker = "Host A"
                text = line.replace("Host A:", "").strip()
            elif line.startswith("Host B:"):
                speaker = "Host B"
                text = line.replace("Host B:", "").strip()
            else:
                continue

            if not text:
                continue

            print(f"[{idx}] {speaker}: {text[:60]}...")

            try:
                audio_bytes = generate_audio_bytes(text, voice_ids[speaker])
            except Exception as e:
                raise HTTPException(status_code=502, detail=f"ElevenLabs SDK failed: {str(e)}")

            seg_path = f"{tmpdir}/seg_{idx:03d}.mp3"
            with open(seg_path, "wb") as f:
                f.write(audio_bytes)

            segment_paths.append(seg_path)

            # 🔥 Add natural pause after each line
            silence_path = f"{tmpdir}/silence_{idx:03d}.mp3"
            subprocess.run(
                [
                    "ffmpeg",
                    "-f", "lavfi",
                    "-i", "anullsrc=r=44100:cl=mono",
                    "-t", "0.3",
                    "-q:a", "9",
                    "-acodec", "libmp3lame",
                    silence_path
                ],
                check=True,
                capture_output=True
            )

            segment_paths.append(silence_path)

        if not segment_paths:
            raise HTTPException(status_code=500, detail="No audio generated")

        # 🔥 Concatenate everything
        concat_file = f"{tmpdir}/concat.txt"
        with open(concat_file, "w") as f:
            for p in segment_paths:
                f.write(f"file '{p}'\n")

        output_path = f"{tmpdir}/final.mp3"

        subprocess.run(
            [
                "ffmpeg",
                "-y",
                "-f", "concat",
                "-safe", "0",
                "-i", concat_file,
                "-c:a", "libmp3lame",
                output_path
            ],
            check=True,
            capture_output=True
        )

        with open(output_path, "rb") as f:
            return f.read()
        

@app.post("/podcast")
async def create_podcast(body: PodcastRequest):
    try:
        if not body.text.strip():
            raise HTTPException(status_code=400, detail="Text is required")

        script = _build_podcast_script(body.text)
        audio = _synthesize_audio(script)

        return Response(content=audio, media_type="audio/mpeg")

    except Exception as e:
        print("🔥 BACKEND ERROR:", str(e))
        raise HTTPException(status_code=500, detail=str(e))