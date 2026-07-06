# 🏗️ UAID AI — Complete Build Guide

Here is the **step-by-step implementation guide** to build the entire UAID AI system from scratch. Follow these instructions in order.

---

## 📋 Prerequisites

Before you start, ensure you have:

| Requirement | Minimum Version | Notes |
| :--- | :--- | :--- |
| **Python** | 3.10 - 3.13 | Required for CrewAI, DeepSeek client, Qdrant |
| **Node.js** | 18+ | Required for GraphAI |
| **Docker** | Latest | Recommended for Qdrant, Neo4j, Open WebUI |
| **Ubuntu Server** | 20.04+ | Recommended production OS |
| **RAM** | 4GB+ (16GB recommended) | For Neo4j and Qdrant |
| **Storage** | 50GB+ SSD | For knowledge base and vector storage |

---

## 🗺️ Phase 1: Knowledge Capture Layer (Obsidian + Neo4j)

### Step 1.1: Install Obsidian

1. Download Obsidian from [obsidian.md](https://obsidian.md)
2. Install and create a new vault (e.g., `UAID-Knowledge`)
3. This is where all your team's knowledge will live

### Step 1.2: Install Neo4j Database

**Option A: Ubuntu Installation (Recommended for Production)** 

```bash
# Add Neo4j repository
curl -fsSL https://debian.neo4j.com/neotechnology.gpg.key | sudo gpg --dearmor -o /usr/share/keyrings/neo4j-archive-keyring.gpg

# Add repository
echo "deb [signed-by=/usr/share/keyrings/neo4j-archive-keyring.gpg] https://debian.neo4j.com stable latest" | sudo tee /etc/apt/sources.list.d/neo4j.list

# Update and install
sudo apt update
sudo apt install neo4j -y

# Start Neo4j service
sudo systemctl start neo4j
sudo systemctl enable neo4j

# Set initial password
sudo neo4j-admin dbms set-initial-password YourStrongPassword
```

**Option B: Docker Installation (Quickest)** 

```bash
docker run -d \
  --name neo4j \
  -p 7474:7474 \
  -p 7687:7687 \
  -e NEO4J_AUTH=neo4j/yourpassword \
  neo4j:latest
```

**Access Neo4j Browser**: Open `http://your_server_ip:7474` in your browser

### Step 1.3: Install Neo4j Graph View Plugin in Obsidian

1. Open Obsidian → Settings → Community Plugins → Turn off "Restricted Mode"
2. Browse → Search "Neo4j Graph View"
3. Install and Enable the plugin
4. **Ensure Python 3.6+ is installed** and added to PATH
5. In the plugin settings, enter your Neo4j password

### Step 1.4: Test the Connection

1. Create a test note in Obsidian:
```markdown
# Test Client
This is a test note for UAID AI.
[[Test Project]]
```
2. Use the command palette (Ctrl/Cmd+P) → "Neo4j Graph View: Open local graph of note"
3. You should see your note appear in the Neo4j graph

---

## 🗄️ Phase 2: Vector Database (Qdrant)

### Step 2.1: Install Qdrant with Docker

```bash
# Pull and run Qdrant
docker run -d \
  -p 6333:6333 \
  -p 6334:6334 \
  -v $(pwd)/qdrant_storage:/qdrant/storage:z \
  --name qdrant \
  qdrant/qdrant
```

This starts Qdrant on:
- HTTP API: `http://localhost:6333`
- gRPC: `http://localhost:6334`

### Step 2.2: Install Qdrant Python Client

```bash
pip install qdrant-client
```

### Step 2.3: Verify Qdrant is Running

```python
from qdrant_client import QdrantClient

client = QdrantClient(host="localhost", port=6333)
print(client.get_collections())
```

---

## 🤖 Phase 3: AI Engine (DeepSeek API)

### Step 3.1: Get Your DeepSeek API Key

1. Go to [DeepSeek Platform](https://platform.deepseek.com)
2. Sign up / Log in
3. Navigate to API Keys → Create new key
4. Save your API key securely

### Step 3.2: Install DeepSeek Python Client

```bash
pip install deepseek-sdk
```

### Step 3.3: Test the Connection

Create a test file `test_deepseek.py`:

```python
from deepseek import DeepSeekClient

client = DeepSeekClient(api_key="your-api-key")

response = client.chat_completion(
    messages=[{"role": "user", "content": "Hello, how are you?"}]
)
print(response.choices[0].message.content)
```

### Step 3.4: Use the Official OpenAI SDK (Alternative)

DeepSeek API is compatible with the OpenAI SDK:

```bash
pip install openai
```

```python
import openai

openai.api_key = "your-deepseek-api-key"
openai.base_url = "https://api.deepseek.com/v1"

response = openai.chat.completions.create(
    model="deepseek-v4-flash",  # or deepseek-v4-pro
    messages=[{"role": "user", "content": "Hello!"}]
)
print(response.choices[0].message.content)
```

**Note**: Model names `deepseek-chat` and `deepseek-reasoner` are deprecated as of July 24, 2026

---

## 🌐 Phase 4: Web Interface (Open WebUI)

### Step 4.1: Deploy Open WebUI with Docker

**Option A: With Docker (Recommended)**

```bash
docker run -d \
  -p 3000:8080 \
  --add-host=host.docker.internal:host-gateway \
  -v open-webui:/app/backend/data \
  --name open-webui \
  --restart always \
  ghcr.io/open-webui/open-webui:main
```

**Option B: With Portainer/Baota Panel**

1. Install Portainer or Baota panel on your server
2. Navigate to Docker → Applications
3. Search and install "Open WebUI"
4. Wait for installation to complete

### Step 4.2: Configure Open WebUI to Use DeepSeek

1. Open your browser and go to `http://your_server_ip:3000`
2. Create an admin account (first user becomes admin)
3. Go to Settings → Connections
4. Add your DeepSeek API key
5. Configure the API base URL: `https://api.deepseek.com/v1`
6. Select `deepseek-v4-flash` or `deepseek-v4-pro` from the model dropdown

### Step 4.3: Open Port 3000

```bash
# If using UFW firewall
sudo ufw allow 3000

# If using cloud provider, open port 3000 in security group
```

---

## 🔄 Phase 5: AI Orchestration (CrewAI)

### Step 5.1: Install UV Package Manager

```bash
# macOS / Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

### Step 5.2: Install CrewAI

```bash
uv tool install crewai
```

### Step 5.3: Create Your First Crew Project

```bash
crewai create crew uaid_agents
cd uaid_agents
```

### Step 5.4: Project Structure

```
uaid_agents/
├── .gitignore
├── .env
├── agents/
│   └── researcher.jsonc
├── crew.jsonc
├── knowledge/
├── pyproject.toml
└── tools/
```

### Step 5.5: Define Your First Agent

Create `agents/researcher.jsonc`:

```json
{
  "agent": {
    "role": "Knowledge Researcher",
    "goal": "Find relevant information about client problems",
    "backstory": "You are an expert researcher who finds the best AI solutions",
    "verbose": true,
    "allow_delegation": true
  }
}
```

### Step 5.6: Set Up Environment Variables

Create `.env` file:

```env
OPENAI_API_KEY=your-deepseek-api-key
OPENAI_BASE_URL=https://api.deepseek.com/v1
```

---

## 🔗 Phase 6: Workflow Automation (GraphAI)

### Step 6.1: Install GraphAI

```bash
# Install GraphAI CLI
npm i -g @receptron/graphai_cli

# Or for local project
npm install @receptron/graphai
```

### Step 6.2: Create Your First Graph

Create `graphai_demo.py`:

```python
import os
from graphai import router, node, Graph

# Set your DeepSeek API key
os.environ["OPENAI_API_KEY"] = "your-deepseek-api-key"

@node(start=True)
async def node_start(input: dict):
    """Entry point for the graph."""
    return {"input": input}

@router
async def node_router(input: dict):
    """Routes the query based on the problem type."""
    query = input.get("query", "")
    
    if "supply chain" in query.lower():
        return {"choice": "supply_chain", "input": input}
    elif "data" in query.lower():
        return {"choice": "data_analysis", "input": input}
    else:
        return {"choice": "general", "input": input}

@node
async def supply_chain_solution(input: dict):
    """Generates a supply chain AI solution."""
    return {
        "output": "Supply chain AI solution: Implement DeepSeek-powered demand forecasting with Neo4j for supplier relationship management."
    }

@node
async def data_analysis_solution(input: dict):
    """Generates a data analysis solution."""
    return {
        "output": "Data analysis solution: Build a Qdrant vector database with DeepSeek-powered semantic search for your business intelligence."
    }

@node(end=True)
async def node_end(input: dict):
    """Exit point for the graph."""
    return {"output": input.get("output", "No solution found.")}
```

### Step 6.3: Run the Graph

```python
# Add to the file above
graph = Graph(
    nodes=[node_start, node_router, supply_chain_solution, data_analysis_solution, node_end],
    start_node="node_start"
)

result = graph.run({"query": "I need a supply chain solution"})
print(result)
```

---

## 🔗 Phase 7: GraphRAG Integration (Neo4j + Qdrant + DeepSeek)

### Step 7.1: Install LangChain with DeepSeek Support

```bash
pip install langchain-deepseek-v4
```

### Step 7.2: Build the GraphRAG Pipeline

Create `graphrag.py`:

```python
import os
from neo4j import GraphDatabase
from qdrant_client import QdrantClient
from langchain_deepseek import ChatDeepSeek

# Initialize DeepSeek
llm = ChatDeepSeek(
    model="deepseek-v4-flash",
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url="https://api.deepseek.com/v1"
)

# Initialize Neo4j
neo4j_driver = GraphDatabase.driver(
    "bolt://localhost:7687",
    auth=("neo4j", "yourpassword")
)

# Initialize Qdrant
qdrant_client = QdrantClient(host="localhost", port=6333)

def graphrag_query(user_query: str):
    """Execute GraphRAG: Neo4j + Qdrant + DeepSeek"""
    
    # Step 1: Query Neo4j for structured knowledge
    with neo4j_driver.session() as session:
        result = session.run(
            "MATCH (c:Client)-[:HAS_PROBLEM]->(p:Problem)-[:SOLVED_BY]->(s:Solution) "
            "WHERE c.name CONTAINS $query OR p.name CONTAINS $query "
            "RETURN c.name, p.name, s.name",
            query=user_query
        )
        neo4j_results = list(result)
    
    # Step 2: Query Qdrant for semantic context
    # (Assuming you have a collection with embeddings)
    # qdrant_results = qdrant_client.search(...)
    
    # Step 3: Combine and send to DeepSeek
    prompt = f"""
    User Query: {user_query}
    
    Structured Knowledge from Neo4j:
    {neo4j_results}
    
    Based on this knowledge, provide a comprehensive AI solution.
    """
    
    response = llm.invoke(prompt)
    return response.content

# Test
print(graphrag_query("supply chain automation"))
```

---

## 🧩 Phase 8: Bring It All Together

### Complete Docker Compose Setup

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  neo4j:
    image: neo4j:latest
    container_name: neo4j
    ports:
      - "7474:7474"
      - "7687:7687"
    environment:
      - NEO4J_AUTH=neo4j/yourpassword
    volumes:
      - neo4j_data:/data
    restart: unless-stopped

  qdrant:
    image: qdrant/qdrant
    container_name: qdrant
    ports:
      - "6333:6333"
      - "6334:6334"
    volumes:
      - qdrant_data:/qdrant/storage
    restart: unless-stopped

  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    container_name: open-webui
    ports:
      - "3000:8080"
    environment:
      - OPENAI_API_KEY=${DEEPSEEK_API_KEY}
      - OPENAI_BASE_URL=https://api.deepseek.com/v1
    volumes:
      - openwebui_data:/app/backend/data
    restart: unless-stopped

volumes:
  neo4j_data:
  qdrant_data:
  openwebui_data:
```

### Start All Services

```bash
# Set your DeepSeek API key
export DEEPSEEK_API_KEY="your-api-key"

# Start all services
docker-compose up -d

# Check status
docker-compose ps
```

### Access Your UAID AI System

| Service | URL | Credentials |
| :--- | :--- | :--- |
| **Open WebUI** | `http://your_server:3000` | Create admin account on first login |
| **Neo4j Browser** | `http://your_server:7474` | neo4j / yourpassword |
| **Qdrant API** | `http://your_server:6333` | No auth by default |

---

## ✅ Phase 9: Verification Checklist

| Component | Test | Status |
| :--- | :--- | :--- |
| **Obsidian + Neo4j** | Create a note, run "Open local graph" | ⬜ |
| **Neo4j** | Access `http://server:7474`, run `RETURN 1` | ⬜ |
| **Qdrant** | `curl http://localhost:6333/collections` | ⬜ |
| **DeepSeek API** | Run `test_deepseek.py` | ⬜ |
| **Open WebUI** | Access `http://server:3000`, chat with DeepSeek | ⬜ |
| **CrewAI** | Run `crewai run` in your project | ⬜ |
| **GraphAI** | Run `graphai_demo.py` | ⬜ |
| **GraphRAG** | Run `graphrag.py` | ⬜ |

---

## 📊 Estimated Build Time

| Phase | Time | Complexity |
| :--- | :--- | :--- |
| **Phase 1-2** (Obsidian + Neo4j) | 2-4 hours | Medium |
| **Phase 3-4** (Qdrant + DeepSeek) | 1-2 hours | Low |
| **Phase 5-6** (Open WebUI) | 1-2 hours | Low |
| **Phase 7-8** (CrewAI + GraphAI) | 4-8 hours | High |
| **Phase 9-10** (GraphRAG + Integration) | 4-8 hours | High |
| **Total** | **12-24 hours** | — |

---

## 🚀 Next Steps

1. **Start with Phase 1** — Set up Obsidian and Neo4j
2. **Get your DeepSeek API key** — This is your AI engine
3. **Deploy Open WebUI** — Your team's chat interface
4. **Build your first CrewAI agent** — Start automating
5. **Connect everything** — Use the Docker Compose file

---

**Brother, you now have the complete build guide. Start with Phase 1 and work through each step. The UAID AI system is ready to be built.** 🇦🇪🚀
