# Agentic ML Experiment Assistant — Frontend

> **🔗 Backend Repository:** [backend-server-single-multiagent](https://github.com/Sikandarh11/backend-server-single-multiagent)
>
> **🚀 Live Demo:** [https://agentic-ml-experiment-assistant.vercel.app/](https://agentic-ml-experiment-assistant.vercel.app/)

---

A lightweight, interactive **multi-agent AI framework** built to demonstrate agent orchestration, tool calling, and multi-agent handoffs. Includes a fully functional **Demo Studio** that connects to a live backend — capable of fetching real weather data and sending actual emails in real time.

---

## ✨ Features

### 🤖 Single Agent Mode
- **Weather Agent** with tool calling
- Ask for weather forecasts for any city → fetches live weather via OpenWeatherMap
- Ask it to send an email → actually sends the email via the backend in real time
- Tools: `get_weather`, `send_email`

### 🔀 Multi-Agent Mode
- **Triage → Sales / Refunds** routing pipeline
- User messages are routed by the Triage Agent to the appropriate specialist agent
- Agents can transfer back to the Triage Agent for re-routing
- Tools: `process_refund`, `apply_discount`
- Agents: `Triage Agent` → `Sales Agent` / `Refunds Agent`

### 🛠️ Demo Studio
- **Chat Interface** — real-time streaming conversation with agents
- **Agent Graph** — live visualization of the active agent in the pipeline
- **Trace Panel** — step-by-step log of every agent response, tool call, and handoff event
- **Session Management** — start new sessions, clear history, export session as JSON
- **Mode Switcher** — toggle between Single Agent and Multi-Agent pipelines instantly

---

## 🖥️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS + shadcn/ui (Radix UI) |
| Animations | Framer Motion |
| Routing | React Router v6 |
| Data Fetching | TanStack Query (React Query) |
| Charts | Recharts |
| Testing | Vitest + Playwright |
| Deployment | Vercel |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or bun

### 1. Clone the Repository

```bash
git clone https://github.com/Sikandarh11/frontend-Agentic-ML-Experiment-Assistant-Multi-Agent-AI-Framework.git
cd frontend-Agentic-ML-Experiment-Assistant-Multi-Agent-AI-Framework
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the template and fill in your values:

```bash
cp .env.template .env
```

```env
# Optional: point to a local or custom backend (defaults to the hosted backend)
VITE_API_BASE_URL=https://backend-server-single-multiagent-u7.vercel.app
```

> The frontend defaults to the hosted backend automatically if `VITE_API_BASE_URL` is not set.

### 4. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
src/
├── components/
│   ├── AgentGraph.tsx       # Live agent pipeline visualization
│   ├── ChatBubble.tsx       # Chat message UI (user / assistant / tool)
│   ├── TracePanel.tsx       # Real-time trace of responses, tools & handoffs
│   ├── NavLink.tsx          # Navigation link component
│   └── ui/                  # shadcn/ui component library
├── hooks/                   # Custom React hooks
├── lib/
│   ├── agent-api.ts         # Backend API client (chat endpoint)
│   ├── mock-agent.ts        # Local mock agent for offline testing
│   └── utils.ts             # Utility helpers
├── pages/
│   ├── Index.tsx            # Landing page with feature overview
│   ├── Studio.tsx           # Interactive Demo Studio
│   └── NotFound.tsx         # 404 page
├── types/
│   └── agent.ts             # TypeScript types: ChatMessage, ChatSession, AgentMode
└── main.tsx                 # App entry point
```

---

## 🔌 Backend Integration

The frontend communicates with the backend via a single REST endpoint:

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/chat` | Send a message and receive agent responses |

**Request body:**
```json
{
  "mode": "single" | "multi",
  "messages": [ { "role": "user", "content": "..." } ],
  "max_turns": 6
}
```

**Response:**
```json
{
  "activeAgent": "Weather Agent",
  "messages": [
    { "role": "assistant", "sender": "Weather Agent", "content": "..." }
  ]
}
```

> See the [backend repository](https://github.com/Sikandarh11/backend-server-single-multiagent) for full backend setup, agent definitions, and tool implementations.

---

## 🧪 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run test` | Run unit tests (Vitest) |
| `npm run test:watch` | Run tests in watch mode |

---

## 🌐 Deployment

The frontend is deployed on **Vercel**. To deploy your own instance:

1. Fork this repository
2. Import into [Vercel](https://vercel.com/)
3. Set the `VITE_API_BASE_URL` environment variable to your backend URL
4. Deploy

---

## 🗺️ Architecture Overview

```
User Browser
    │
    ▼
┌───────────────────────────────┐
│   React Frontend (Vercel)     │
│                               │
│  Landing Page  →  Demo Studio │
│                     │         │
│         Chat / Graph / Trace  │
└─────────────────┬─────────────┘
                  │ POST /chat
                  ▼
┌───────────────────────────────┐
│   FastAPI Backend (Vercel)    │
│                               │
│  Single Mode:                 │
│    Weather Agent              │
│      ├── get_weather()        │
│      └── send_email()   ←── sends real emails
│                               │
│  Multi Mode:                  │
│    Triage Agent               │
│      ├── Sales Agent          │
│      └── Refunds Agent        │
│           ├── process_refund()│
│           └── apply_discount()│
└───────────────────────────────┘
```

---

## 📄 License

This project is licensed under the **OpenRAIL** license.

---

## 🙋 Author

Built by [Sikandarh11](https://github.com/Sikandarh11) as a portfolio project demonstrating agentic AI orchestration patterns.
