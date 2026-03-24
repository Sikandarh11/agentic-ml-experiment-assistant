from typing import Any, Dict, List

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from agent import Swarm
from agents import triage_agent, weather_agent
from schemas import ChatRequest, ChatResponse

_ = load_dotenv()

app = FastAPI(title="Agent Studio Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://localhost:5173",
        "http://localhost:4173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> Dict[str, bool]:
    return {"ok": True}


def _sanitize_response_messages(messages: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    sanitized: List[Dict[str, Any]] = []
    for msg in messages:
        role = msg.get("role")
        if role not in {"assistant", "tool"}:
            continue
        sanitized.append(
            {
                "role": role,
                "content": str(msg.get("content") or ""),
                "sender": msg.get("sender"),
                "tool_name": msg.get("tool_name"),
                "tool_call_id": msg.get("tool_call_id"),
            }
        )
    return sanitized


@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest) -> ChatResponse:
    try:
        start_agent = weather_agent if request.mode == "single" else triage_agent
        swarm = Swarm()

        response = swarm.run(
            agent=start_agent,
            messages=[m.model_dump(exclude_none=True) for m in request.messages],
            max_turns=request.max_turns,
            execute_tools=True,
        )

        if response.agent is None:
            raise HTTPException(status_code=500, detail="No active agent returned by Swarm.")

        return ChatResponse(
            activeAgent=response.agent.name,
            messages=_sanitize_response_messages(response.messages),
        )
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Chat execution failed: {exc}")
