# Agentic ML Experiment Assistant

A lightweight Python framework for building single and multi-agent AI systems using OpenAI's API. This project implements a custom orchestration layer inspired by swarm intelligence patterns, allowing seamless agent-to-agent handoffs and tool execution.

## 🌟 Features

- **Custom Agent Framework**: Built-from-scratch implementation of an AI agent system
- **Single Agent Support**: Create standalone agents with custom tools and instructions
- **Multi-Agent Orchestration**: Seamlessly transfer conversations between specialized agents
- **Tool/Function Calling**: Automatic conversion of Python functions to OpenAI tool specifications
- **Flexible Architecture**: Easy-to-extend design using Pydantic models
- **Interactive CLI**: Command-line interface for testing agents

## 📋 Prerequisites

- Python 3.11
- OpenAI API Key
- Conda (optional, for environment management)

## 🚀 Installation

### Using Conda (Recommended)

```bash
# Create and activate the environment
conda env create -f environment.yml
conda activate agent-from-scratch

# Install dependencies
pip install -r requirements.txt
```

### Using pip only

```bash
# Install dependencies
pip install -r requirements.txt
```

## ⚙️ Configuration

1. Copy the environment template:
```bash
cp .env.template .env
```

2. Add your OpenAI API key to the `.env` file:
```
OPENAI_API_KEY="your-api-key-here"
```

## 📚 Usage

### Single Agent Example

Run a simple weather agent that can provide weather information and send emails:

```bash
python single_agent_example.py
```

**Example interaction:**
```
User: How is the weather today in Brussels?
Weather Agent: The current temperature in Brussels is 65°F.
```

### Multi-Agent Example

Run a customer service system with multiple specialized agents (Triage, Sales, and Refunds):

```bash
python multi_agent_example.py
```

**Example interaction:**
```
User: I want to return an item
Triage Agent: I'll transfer you to our refunds specialist.
Refunds Agent: I'd be happy to help with your return. Could you provide the item ID?
```

## 🏗️ Architecture

### Core Components

#### **Agent**
Represents an AI agent with specific instructions and capabilities.

```python
from agent import Agent

my_agent = Agent(
    name="My Agent",
    model="gpt-4o",
    instructions="You are a helpful assistant.",
    functions=[my_function1, my_function2]
)
```

#### **Swarm**
Orchestrates agent execution and manages conversation flow.

```python
from agent import Swarm

client = Swarm()
response = client.run(agent=my_agent, messages=messages)
```

#### **Function to JSON Conversion**
Automatically converts Python functions to OpenAI tool specifications:

```python
def get_weather(location: str, time: str = "now") -> str:
    """Get weather information for a location"""
    return json.dumps({"location": location, "temperature": "65", "time": time})
```

### Key Features

- **Agent Handoffs**: Agents can return other agents to transfer conversations
- **Tool Execution**: Automatic execution of function calls with result handling
- **Conversation History**: Maintains context across multiple turns
- **Flexible Instructions**: Support for both static and dynamic instructions

## 🛠️ Creating Custom Agents

### Step 1: Define Tool Functions

```python
def my_tool(param1: str, param2: int) -> str:
    """Description of what this tool does"""
    # Your logic here
    return "result"
```

### Step 2: Create Agent

```python
my_agent = Agent(
    name="Custom Agent",
    instructions="Your agent's instructions here",
    functions=[my_tool],
    model="gpt-4o"
)
```

### Step 3: Run Agent

```python
client = Swarm()
messages = [{"role": "user", "content": "Hello!"}]
response = client.run(agent=my_agent, messages=messages)
```

## 📁 Project Structure

```
agentic-ml-experiment-assistant/
├── agent.py                  # Core agent framework implementation
├── single_agent_example.py   # Single agent demo
├── multi_agent_example.py    # Multi-agent demo
├── requirements.txt          # Python dependencies
├── environment.yml           # Conda environment specification
├── .env.template            # Environment variables template
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

## 🔍 How It Works

1. **Agent Creation**: Define agents with specific instructions and tools
2. **Message Processing**: User messages are sent to the active agent
3. **Tool Execution**: Agent decides which tools to call based on context
4. **Result Handling**: Tool results are processed and added to conversation history
5. **Agent Handoff**: Agents can transfer control to other agents when needed
6. **Response Generation**: Final response is returned to the user

## 🎯 Use Cases

- **Customer Service**: Multi-agent systems for handling different types of inquiries
- **Task Automation**: Agents with specialized tools for specific tasks
- **Research Assistants**: Agents with access to information retrieval tools
- **Workflow Orchestration**: Complex multi-step processes with agent handoffs

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 📄 License

This project is open source and available for educational and commercial use.

## 🔗 Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Pydantic Documentation](https://docs.pydantic.dev/)

## ✨ Acknowledgments

This project demonstrates a custom implementation of agentic AI patterns, providing a foundation for building sophisticated multi-agent systems.