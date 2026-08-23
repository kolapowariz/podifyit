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
from google import genai

load_dotenv()

app = FastAPI()

# Allow requests from the frontend (Next.js dev server)
ORIGINS = [
    "http://localhost:3000",
    "https://podifyit.vercel.app",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not ELEVENLABS_API_KEY:
    raise RuntimeError("ELEVENLABS_API_KEY must be set in the environment")

if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY must be set in the environment")


elevenlabs = ElevenLabs(api_key=ELEVENLABS_API_KEY)

gemini_client = genai.Client(api_key=GEMINI_API_KEY)

class PodcastRequest(BaseModel):
    text: str



def _build_podcast_script(resume_text: str) -> str:

    prompt = f"""
You are writing a professional technology and career podcast.

Your job is to transform the document below into a natural,
engaging conversation between two podcast hosts.

The hosts are discussing the PERSON described in the document.

The conversation must feel like a real podcast discussion,
NOT a resume being read aloud and NOT an AI-generated summary.

HOST A:
- Curious
- Analytical
- Leads the discussion
- Notices patterns in the person's career
- Asks thoughtful follow-up questions

HOST B:
- Conversational
- Observant
- Adds a different perspective
- Sometimes challenges or expands on Host A's point
- Responds naturally rather than constantly agreeing

CRITICAL FACTUAL RULES:

1. ONLY use information that is explicitly present in the document.

2. NEVER invent:
   - jobs
   - companies
   - achievements
   - technologies
   - dates
   - education
   - responsibilities
   - career progression
   - motivations
   - personal characteristics

3. Do not assume that one event happened immediately
   after another unless the document explicitly establishes
   that sequence.

4. Do not make unsupported claims such as:
   "he went straight into..."
   "he clearly..."
   "he is destined to..."
   unless the document provides evidence for the statement.

5. When discussing the person's strengths, connect the
   observation to something specific in the document.

PODCAST STYLE:

6. Do NOT read the document word-for-word.

7. Summarize information naturally.

8. Do NOT mechanically list skills.

9. Do NOT mention every single item in the document.

10. Select the most interesting and relevant details.

11. Focus on:
    - background
    - education
    - career development
    - important projects
    - technical work
    - notable achievements
    - interesting skills
    - patterns or connections between experiences

12. The hosts should sound like they are genuinely
    discussing the person's work.

13. Avoid repetitive phrases such as:
    "That's interesting."
    "Exactly."
    "I agree."
    "It definitely..."
    "For sure."

14. These conversational phrases may occasionally be used,
    but do not overuse them.

15. The hosts should NOT agree with every statement.

16. Occasionally let Host B introduce a different
    interpretation or ask a question.

17. Use natural spoken language.

18. Avoid corporate buzzwords and exaggerated praise.

19. Avoid phrases like:
    "a classic example"
    "right out of university"
    "one to keep an eye on"
    unless the document genuinely supports the statement.

20. Do not make the person sound unrealistically impressive.
    Keep the discussion balanced and credible.

    
VOICE AND CONVERSATION RULES:

21. The hosts should sound like experienced podcast presenters,
    not career coaches writing a professional report.

22. Prefer contractions and natural spoken language:
    "it's", "he's", "that's", "doesn't", "didn't", "they're".

23. Avoid formal phrases such as:
    "It is a clear path."
    "It is a focused trajectory."
    "It demonstrates..."
    "This indicates..."
    "This highlights..."
    "It is evident that..."
    "This showcases..."

24. Replace formal analysis with conversational observations.

25. Do not make every Host B response agree with Host A.

26. At least occasionally, Host B should ask a question,
    add a new observation, or provide a different perspective.

27. Do not discuss technologies that are not explicitly mentioned
    in the document.

28. Do not infer technical responsibilities from a technology.
    For example, knowing that someone used Next.js does NOT mean
    they necessarily worked with routing, server components,
    data fetching, authentication, or other Next.js features.

29. Do not infer career progression unless the document explicitly
    establishes it.

30. Avoid generic praise such as:
    "one to keep an eye on"
    "great trajectory"
    "impressive journey"
    "right instincts"
    "stands out"
    unless supported by specific evidence.

31. Every significant observation should be connected to a
    concrete fact from the document.

32. The hosts should occasionally acknowledge when information
    is unavailable instead of filling the gap with assumptions.

33. If the document doesn't provide enough information about
    a project, simply say that the available information is limited.

34. Do not introduce general industry comparisons or claims that
    are not directly relevant to the person described in the document.

35. Do not compare the person with "most developers", "many people",
    "other graduates", or industry averages unless the document
    itself provides information supporting that comparison.

STRUCTURE:

The podcast should approximately follow this flow:

1. ENGAGING OPENING
   Introduce an interesting aspect of the person's background.

2. BACKGROUND
   Discuss their education or starting point.

3. CAREER
   Discuss how their experience developed.

4. PROJECTS
   Discuss one or two particularly interesting projects
   or pieces of work.

5. TECHNICAL EXPERIENCE
   Discuss technologies or technical abilities only when
   supported by the document.

6. DISCUSSION
   Let the hosts interpret what these experiences suggest
   about the person's development.

7. CONCLUSION
   End naturally without exaggerated praise.

IMPORTANT:

The conversation should feel like two knowledgeable people
talking about someone's career, not two people taking turns
reading paragraphs.

Use exactly these speaker labels:

Host A:
Host B:

Do not use any other speaker labels.

Do not include:
- stage directions
- sound effects
- music
- timestamps
- markdown
- bullet points
- analysis outside the conversation

For this development test, generate approximately
60–90 seconds of spoken dialogue.

DOCUMENT:

{resume_text}
"""

    try:

        response = gemini_client.models.generate_content(
            model="gemini-3.1-flash-lite",
            contents=prompt,
        )

        script = response.text.strip()

        if not script:
            raise HTTPException(
                status_code=500,
                detail="AI failed to generate a podcast script."
            )

        return script

    except HTTPException:
        raise

    except Exception as e:

        print("🔥 GEMINI ERROR:", str(e))

        raise HTTPException(
            status_code=502,
            detail=f"AI script generation failed: {str(e)}"
        )


def generate_audio_bytes(text: str, voice_id: str) -> bytes:
    try:
        audio_stream = elevenlabs.text_to_speech.convert(
            text=text,
            voice_id=voice_id,
            model_id="eleven_v3",
            output_format="mp3_44100_128",
            voice_settings={
                "stability": 0.35,
                "similarity_boost": 0.85,
                "style": 0.6,
                "use_speaker_boost": True,
            },
        )

        audio_bytes = b"".join(audio_stream)

        if not audio_bytes:
            raise RuntimeError("ElevenLabs returned empty audio.")

        return audio_bytes

    except Exception as e:
        print("🔥 ELEVENLABS ERROR:", str(e))
        raise HTTPException(
            status_code=502,
            detail=f"ElevenLabs audio generation failed: {str(e)}",
        )


def _synthesize_audio(script: str) -> bytes:
    voice_ids = {
        "Host A": "JBFqnCBsd6RMkjVDRZzb",
        "Host B": "EXAVITQu4vr4xnSDxMaL",
    }

    with tempfile.TemporaryDirectory() as tmpdir:
        segment_paths = []

        lines = script.splitlines()

        for idx, line in enumerate(lines):
            line = line.strip()

            if not line:
                continue

            if line.startswith("Host A:"):
                speaker = "Host A"
                text = line[len("Host A:"):].strip()

            elif line.startswith("Host B:"):
                speaker = "Host B"
                text = line[len("Host B:"):].strip()

            else:
                continue

            if not text:
                continue

            print(
                f"🎙️ [{idx}] {speaker}: "
                f"{text[:80]}..."
            )

            try:
                audio_bytes = generate_audio_bytes(
                    text,
                    voice_ids[speaker],
                )
            except HTTPException:
                raise
            except Exception as e:
                raise HTTPException(
                    status_code=502,
                    detail=f"Failed to synthesize {speaker}: {str(e)}",
                )

            segment_path = os.path.join(
                tmpdir,
                f"segment_{idx:03d}.mp3",
            )

            with open(segment_path, "wb") as f:
                f.write(audio_bytes)

            segment_paths.append(segment_path)

            # Natural pause between speakers
            silence_path = os.path.join(
                tmpdir,
                f"silence_{idx:03d}.mp3",
            )

            try:
                subprocess.run(
                    [
                        "ffmpeg",
                        "-y",
                        "-f",
                        "lavfi",
                        "-i",
                        "anullsrc=r=44100:cl=mono",
                        "-t",
                        "0.3",
                        "-q:a",
                        "9",
                        "-acodec",
                        "libmp3lame",
                        silence_path,
                    ],
                    check=True,
                    capture_output=True,
                )
            except subprocess.CalledProcessError as e:
                print(
                    "🔥 FFMPEG SILENCE ERROR:",
                    e.stderr.decode(errors="ignore"),
                )

                raise HTTPException(
                    status_code=500,
                    detail="FFmpeg failed while creating audio pauses.",
                )

            segment_paths.append(silence_path)

        if not segment_paths:
            raise HTTPException(
                status_code=500,
                detail="No valid speaker dialogue found in generated script.",
            )

        concat_file = os.path.join(
            tmpdir,
            "concat.txt",
        )

        with open(concat_file, "w", encoding="utf-8") as f:
            for path in segment_paths:
                # FFmpeg concat files require escaped paths
                safe_path = path.replace("'", "'\\''")
                f.write(f"file '{safe_path}'\n")

        output_path = os.path.join(
            tmpdir,
            "final.mp3",
        )

        try:
            subprocess.run(
                [
                    "ffmpeg",
                    "-y",
                    "-f",
                    "concat",
                    "-safe",
                    "0",
                    "-i",
                    concat_file,
                    "-c:a",
                    "libmp3lame",
                    "-b:a",
                    "128k",
                    output_path,
                ],
                check=True,
                capture_output=True,
            )

        except subprocess.CalledProcessError as e:
            print(
                "🔥 FFMPEG CONCAT ERROR:",
                e.stderr.decode(errors="ignore"),
            )

            raise HTTPException(
                status_code=500,
                detail="FFmpeg failed while combining the audio.",
            )

        with open(output_path, "rb") as f:
            return f.read()

        

@app.get("/")
def root():
    return {"message": "PodifyIt API is running"}

@app.post("/podcast")
async def create_podcast(body: PodcastRequest):
    try:
        if not body.text.strip():
            raise HTTPException(
                status_code=400,
                detail="Text is required"
            )

        print("📝 Generating AI podcast script...")

        script = _build_podcast_script(body.text)

        print("✅ Script generated successfully.")

        print("🎙️ Generating Host A / Host B voices...")

        audio_bytes = _synthesize_audio(script)

        print("✅ Podcast audio generated successfully.")

        return Response(
            content=audio_bytes,
            media_type="audio/mpeg",
            headers={
                "Content-Disposition": 'inline; filename="podifyit-podcast.mp3"'
            },
        )

    except HTTPException:
        raise

    except Exception as e:
        print("🔥 BACKEND ERROR:", str(e))

        raise HTTPException(
            status_code=500,
            detail=str(e),
        )