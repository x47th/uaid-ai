"""
UAID Web Dashboard — Fast web UI for the entire UAID system
"""
import os, sys, json
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from openai import OpenAI
from neo4j import GraphDatabase
from qdrant_client import QdrantClient
import uvicorn

app = FastAPI(title="UAID AI Dashboard")

# ── Clients ────────────────────────────────────────────
llm = OpenAI(api_key=os.getenv("DEEPSEEK_API_KEY"), base_url="https://api.deepseek.com/v1")
try:
    neo4j = GraphDatabase.driver("bolt://localhost:7687", auth=("neo4j", "UAID2026secure!"))
    neo4j_ok = True
except:
    neo4j_ok = False

try:
    qdrant = QdrantClient(host="localhost", port=6333)
    qdrant_ok = True
except:
    qdrant_ok = False

# ── API Routes ─────────────────────────────────────────

@app.get("/api/status")
async def status():
    status = {"deepseek": "connected", "neo4j": "down", "qdrant": "down"}
    if neo4j_ok:
        try:
            with neo4j.session() as s:
                s.run("RETURN 1")
            status["neo4j"] = "connected"
        except:
            pass
    if qdrant_ok:
        try:
            qdrant.get_collections()
            status["qdrant"] = "connected"
        except:
            pass
    return status

@app.get("/api/graph")
async def graph():
    if not neo4j_ok:
        return {"nodes": [], "edges": []}
    with neo4j.session() as s:
        nodes = [{"name": r["c.name"], "type": "Client"} for r in s.run("MATCH (c:Client) RETURN c.name")]
        problems = [{"name": r["p.name"], "type": "Problem"} for r in s.run("MATCH (p:Problem) RETURN p.name")]
        solutions = [{"name": r["s.name"], "type": "Solution"} for r in s.run("MATCH (s:Solution) RETURN s.name")]
        rels = [{"from": r["c"], "to": r["p"], "label": "has"} for r in s.run(
            "MATCH (c:Client)-[:HAS_PROBLEM]->(p:Problem) RETURN c.name AS c, p.name AS p"
        )]
        rels += [{"from": r["p"], "to": r["s"], "label": "solved_by"} for r in s.run(
            "MATCH (p:Problem)-[:SOLVED_BY]->(s:Solution) RETURN p.name AS p, s.name AS s"
        )]
    return {"nodes": nodes + problems + solutions, "edges": rels}

@app.post("/api/chat")
async def chat(request: Request):
    data = await request.json()
    msg = data.get("message", "")
    try:
        r = llm.chat.completions.create(
            model="deepseek-v4-flash",
            messages=[{"role": "user", "content": msg}],
            max_tokens=500
        )
        return {"reply": r.choices[0].message.content}
    except Exception as e:
        return {"reply": f"Error: {e}"}

# ── Web UI ─────────────────────────────────────────────

HTML = """<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>UAID AI Dashboard</title>
<style>
:root{--bg:#0d1117;--card:#161b22;--border:#30363d;--green:#3fb950;--red:#f85149;--cyan:#58a6ff;--text:#c9d1d9}
*{margin:0;padding:0;box-sizing:border-box}
body{background:var(--bg);color:var(--text);font-family:-apple-system,BlinkMacSystemFont,sans-serif;min-height:100vh}
header{background:var(--card);border-bottom:1px solid var(--border);padding:16px 24px;display:flex;justify-content:space-between;align-items:center}
header h1{font-size:20px;color:var(--cyan)}
.status-dot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:6px}
.status-dot.up{background:var(--green)}
.status-dot.down{background:var(--red)}
main{max-width:1200px;margin:0 auto;padding:24px;display:grid;grid-template-columns:1fr 1fr;gap:16px}
@media(max-width:768px){main{grid-template-columns:1fr}}
.card{background:var(--card);border:1px solid var(--border);border-radius:8px;padding:16px}
.card h2{font-size:16px;margin-bottom:12px;color:var(--cyan)}
#graph-container{height:300px;position:relative;overflow:hidden}
#chat-messages{height:300px;overflow-y:auto;margin-bottom:12px}
#chat-messages .msg{margin-bottom:8px;padding:8px;border-radius:6px}
#chat-messages .user{background:#1f6feb22;border:1px solid #1f6feb44}
#chat-messages .ai{background:var(--bg);border:1px solid var(--border)}
#chat-form{display:flex;gap:8px}
#chat-input{flex:1;background:var(--bg);border:1px solid var(--border);color:var(--text);padding:10px;border-radius:6px;font-size:14px}
button{background:var(--cyan);color:#000;border:none;padding:10px 16px;border-radius:6px;cursor:pointer;font-weight:600}
button:hover{opacity:.9}
.node{position:absolute;padding:6px 12px;border-radius:12px;font-size:11px;font-weight:600;transform:translate(-50%,-50%)}
.node.client{background:#58a6ff33;border:1px solid #58a6ff;color:#58a6ff}
.node.problem{background:#f8514933;border:1px solid #f85149;color:#f85149}
.node.solution{background:#3fb95033;border:1px solid #3fb950;color:#3fb950}
svg line{stroke:var(--border);stroke-width:1}
</style>
</head>
<body>
<header>
<h1>🧠 UAID AI Dashboard</h1>
<div id="status-bar">
<span id="s-neo4j"><span class="status-dot"></span>Neo4j</span>&nbsp;&nbsp;
<span id="s-qdrant"><span class="status-dot"></span>Qdrant</span>&nbsp;&nbsp;
<span id="s-deepseek"><span class="status-dot"></span>DeepSeek</span>
</div>
</header>
<main>
<div class="card">
<h2>📊 Knowledge Graph</h2>
<div id="graph-container"><svg id="graph-svg" width="100%" height="100%"></svg></div>
</div>
<div class="card">
<h2>💬 UAID Chat</h2>
<div id="chat-messages"></div>
<form id="chat-form" onsubmit="sendChat(event)">
<input id="chat-input" placeholder="Ask UAID anything..." autocomplete="off">
<button type="submit">Send</button>
</form>
</div>
<div class="card" style="grid-column:1/-1">
<h2>📋 System Info</h2>
<pre id="sys-info" style="font-size:12px;color:var(--text)">Loading...</pre>
</div>
</main>
<script>
async function loadStatus(){
  const r=await fetch('/api/status');const s=await r.json();
  document.getElementById('s-neo4j').querySelector('.status-dot').className='status-dot '+(s.neo4j=='connected'?'up':'down');
  document.getElementById('s-qdrant').querySelector('.status-dot').className='status-dot '+(s.qdrant=='connected'?'up':'down');
  document.getElementById('s-deepseek').querySelector('.status-dot').className='status-dot '+(s.deepseek=='connected'?'up':'down');
  document.getElementById('sys-info').textContent=JSON.stringify(s,null,2);
}
async function loadGraph(){
  const r=await fetch('/api/graph');const g=await r.json();
  const svg=document.getElementById('graph-svg');
  const w=svg.parentElement.clientWidth;const h=300;
  svg.setAttribute('viewBox',`0 0 ${w} ${h}`);
  svg.innerHTML='';
  const all=g.nodes||[];const cols=Math.ceil(Math.sqrt(all.length))||1;
  all.forEach((n,i)=>{
    const col=i%cols;const row=Math.floor(i/cols);
    const x=(col+1)*(w/(cols+1));const y=(row+1)*(h/(Math.ceil(all.length/cols)+1));
    const el=document.createElementNS('http://www.w3.org/2000/svg','circle');
    el.setAttribute('cx',x);el.setAttribute('cy',y);el.setAttribute('r',8);
    el.setAttribute('fill',n.type=='Client'?'#58a6ff':n.type=='Problem'?'#f85149':'#3fb950');
    svg.appendChild(el);
    const txt=document.createElementNS('http://www.w3.org/2000/svg','text');
    txt.setAttribute('x',x+12);txt.setAttribute('y',y+4);txt.setAttribute('fill','#c9d1d9');txt.setAttribute('font-size','11');
    txt.textContent=n.name;
    svg.appendChild(txt);
  });
  (g.edges||[]).forEach(e=>{
    const from=all.findIndex(n=>n.name==e.from);const to=all.findIndex(n=>n.name==e.to);
    if(from>-1&&to>-1){
      const fx=(from%cols+1)*(w/(cols+1)),fy=(Math.floor(from/cols)+1)*(h/(Math.ceil(all.length/cols)+1));
      const tx=(to%cols+1)*(w/(cols+1)),ty=(Math.floor(to/cols)+1)*(h/(Math.ceil(all.length/cols)+1));
      const line=document.createElementNS('http://www.w3.org/2000/svg','line');
      line.setAttribute('x1',fx);line.setAttribute('y1',fy);line.setAttribute('x2',tx);line.setAttribute('y2',ty);
      line.setAttribute('stroke','#30363d');line.setAttribute('stroke-width','1');
      svg.appendChild(line);
    }
  });
}
async function sendChat(e){
  e.preventDefault();
  const inp=document.getElementById('chat-input');const msg=inp.value.trim();if(!msg)return;
  const msgs=document.getElementById('chat-messages');
  msgs.innerHTML+=`<div class="msg user"><b>You:</b> ${msg}</div>`;
  inp.value='';
  const r=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:msg})});
  const d=await r.json();
  msgs.innerHTML+=`<div class="msg ai"><b>UAID:</b> ${d.reply}</div>`;
  msgs.scrollTop=msgs.scrollHeight;
}
loadStatus();loadGraph();setInterval(loadStatus,10000);setInterval(loadGraph,15000);
</script>
</body>
</html>"""

@app.get("/", response_class=HTMLResponse)
async def home():
    return HTML

if __name__ == "__main__":
    print("\n🚀 UAID Dashboard → http://localhost:8000\n")
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
