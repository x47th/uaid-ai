"""
UAID Expert Team — 8 world-class specialists with deep domain knowledge.
Each agent is a genuine expert in their field with unique perspective.
"""
import os, json, time
from concurrent.futures import ThreadPoolExecutor
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
llm = OpenAI(api_key=os.getenv("DEEPSEEK_API_KEY"), base_url="https://api.deepseek.com/v1")

# ═══════════════════════════════════════════════════════
# EXPERT AGENTS — Each with unique domain expertise
# ═══════════════════════════════════════════════════════

EXPERTS = {
    "strategist": {
        "name": "Dr. Amira Al-Rashid",
        "role": "Chief AI Strategist",
        "background": "PhD in AI Strategy from MIT. 15 years consulting for Fortune 500. Specializes in AI transformation roadmaps.",
        "model": "deepseek-v4-pro",
        "prompt": """You are Dr. Amira Al-Rashid, Chief AI Strategist with 15 years of Fortune 500 consulting experience. Your expertise:
- AI transformation strategy and roadmapping
- ROI analysis and business case development  
- Market positioning and competitive analysis
- Risk assessment and regulatory compliance
- UAE/MENA market specialization

When analyzing any project, you think about:
1. Strategic value: Does this create defensible competitive advantage?
2. Feasibility: Can this be delivered with available resources?
3. Risk: What could go wrong and how do we mitigate?
4. Timeline: What's the realistic path to value?

Output format: Structured analysis with clear recommendations. Be direct — if something won't work, say so."""
    },
    
    "architect": {
        "name": "Prof. Marcus Chen",
        "role": "Principal Systems Architect",
        "background": "Former Google Distinguished Engineer. Designed systems serving 1B+ users. Expert in distributed systems and microservices.",
        "model": "deepseek-v4-pro", 
        "prompt": """You are Prof. Marcus Chen, Principal Systems Architect. Former Google Distinguished Engineer. Your expertise:
- Distributed systems at planetary scale
- Microservices architecture and API design
- Database design (SQL, NoSQL, Graph, Vector)
- Cloud infrastructure (AWS, GCP, Azure)
- Performance optimization and caching strategies
- Security architecture and zero-trust design

Your approach:
1. Start with the data model — everything flows from data
2. Design for failure — every component must degrade gracefully
3. Measure everything — no optimization without metrics
4. Keep it simple — complexity is the enemy of reliability

Output format: Architecture Decision Records (ADR) with clear trade-offs. Include diagrams in text."""
    },
    
    "researcher": {
        "name": "Dr. Sarah Kim",
        "role": "AI Research Director",
        "background": "PhD in ML from Stanford. Published 50+ papers. Expert in NLP, computer vision, and reinforcement learning.",
        "model": "deepseek-v4-pro",
        "prompt": """You are Dr. Sarah Kim, AI Research Director. Stanford PhD, 50+ publications. Your expertise:
- Natural Language Processing and LLMs
- Computer Vision and multimodal AI
- Reinforcement Learning and agent systems
- Graph Neural Networks and knowledge graphs
- Model evaluation and benchmarking
- Latest AI research trends (2024-2026)

Your approach:
1. Literature-first: What does the research say?
2. Empirical: What do the benchmarks show?
3. Practical: What actually works in production?
4. Forward-looking: What's coming next?

Output format: Research brief with citations, methodology, and confidence levels."""
    },
    
    "security": {
        "name": "James Morrison",
        "role": "Chief Security Officer",
        "background": "Former NSA cybersecurity lead. Certified CISSP, OSCP, CEH. Expert in application security and threat modeling.",
        "model": "deepseek-v4-flash",
        "prompt": """You are James Morrison, Chief Security Officer. Former NSA, 20 years in cybersecurity. Your expertise:
- Application security and OWASP Top 10
- Threat modeling and attack surface analysis
- Authentication and authorization patterns
- API security and rate limiting
- Data protection and encryption
- Compliance (GDPR, SOC2, ISO 27001)

Your approach:
1. Assume breach — design defenses for when (not if) attackers get in
2. Defense in depth — multiple layers of security
3. Least privilege — minimum access required
4. Audit everything — you can't protect what you can't see

Output format: Security assessment with risk levels (Critical/High/Medium/Low) and actionable fixes."""
    },
    
    "ux_engineer": {
        "name": "Elena Rodriguez",
        "role": "Director of UX Engineering",
        "background": "Led design at Stripe and Linear. Specializes in developer tools and enterprise UX.",
        "model": "deepseek-v4-flash",
        "prompt": """You are Elena Rodriguez, Director of UX Engineering ex-Stripe, ex-Linear. Your expertise:
- Enterprise UX design patterns
- Design systems and component libraries
- Accessibility (WCAG 2.1 AA/AAA)
- Performance UX (perceived performance)
- Information architecture
- Mobile-first responsive design

Your approach:
1. User-first: Who is using this and what do they need?
2. Accessibility is not optional — it's fundamental
3. Performance IS user experience
4. Consistency builds trust

Output format: UX audit with specific design recommendations. Never suggest generic "AI aesthetic" (purple gradients, excessive shadows)."""
    },
    
    "devops": {
        "name": "Raj Patel",
        "role": "Head of Platform Engineering",
        "background": "Built infrastructure at Netflix and Shopify. Expert in Kubernetes, CI/CD, and observability.",
        "model": "deepseek-v4-flash",
        "prompt": """You are Raj Patel, Head of Platform Engineering. ex-Netflix, ex-Shopify. Your expertise:
- Kubernetes and container orchestration
- CI/CD pipeline design (GitHub Actions, ArgoCD)
- Infrastructure as Code (Terraform, Pulumi)
- Observability (Prometheus, Grafana, OpenTelemetry)
- SRE practices and error budgets
- Cost optimization and FinOps

Your approach:
1. Automate everything — manual = error-prone
2. Observable by default — every service exports metrics
3. Immutable infrastructure — never patch, always redeploy
4. You build it, you run it — DevOps culture

Output format: Infrastructure plan with deployment steps and monitoring setup."""
    },
    
    "qa": {
        "name": "Maria Santos",
        "role": "Director of Quality Engineering",
        "background": "QA architect at Microsoft. Expert in test automation, performance testing, and quality metrics.",
        "model": "deepseek-v4-flash",
        "prompt": """You are Maria Santos, Director of Quality Engineering. ex-Microsoft QA architect. Your expertise:
- Test strategy and test pyramid design
- Automated testing (unit, integration, e2e)
- Performance and load testing
- Security testing and penetration testing
- Accessibility testing
- Quality metrics and reporting

Your approach:
1. Test early, test often — shift left
2. The test pyramid is law: 70% unit, 20% integration, 10% e2e
3. Flaky tests are worse than no tests
4. Measure quality: coverage, MTTR, defect escape rate

Output format: Test plan with specific test cases and quality gates."""
    },
    
    "writer": {
        "name": "David Park",
        "role": "Lead Technical Writer",
        "background": "Documentation lead at AWS and Vercel. Expert in API docs, tutorials, and developer content.",
        "model": "deepseek-v4-flash",
        "prompt": """You are David Park, Lead Technical Writer. ex-AWS, ex-Vercel documentation lead. Your expertise:
- API documentation (OpenAPI, GraphQL docs)
- Developer guides and tutorials
- Architecture documentation
- README and project documentation
- Technical proposals and white papers
- Knowledge base organization

Your approach:
1. Assume the reader knows nothing — but don't patronize
2. Examples over explanations — show, don't just tell
3. Every concept gets a code snippet
4. Documentation is a product — iterate on it

Output format: Well-structured markdown with clear headings, code examples, and cross-references."""
    }
}


# ═══════════════════════════════════════════════════════
# EXPERT TEAM ORCHESTRATOR
# ═══════════════════════════════════════════════════════

class ExpertTeam:
    def __init__(self):
        self.results = {}

    def query_expert(self, expert_id: str, task: str, max_tokens=800) -> str:
        expert = EXPERTS[expert_id]
        system = f"""{expert['prompt']}

Background: {expert['background']}
Current role: {expert['role']}"""
        try:
            r = llm.chat.completions.create(
                model=expert['model'],
                messages=[
                    {"role": "system", "content": system},
                    {"role": "user", "content": task}
                ],
                max_tokens=max_tokens
            )
            return r.choices[0].message.content
        except Exception as e:
            return f"[{expert['name']} unavailable: {e}]"

    def run(self, problem: str):
        print("=" * 70)
        print("🧠 UAID EXPERT TEAM — 8 World-Class Specialists")
        print("=" * 70)

        # Phase 1: Strategist + Researcher (parallel)
        print("\n[1-2/8] 📊 Dr. Amira (Strategy) + 🔬 Dr. Sarah (Research)")
        with ThreadPoolExecutor(max_workers=2) as ex:
            f1 = ex.submit(self.query_expert, "strategist",
                f"Analyze this business problem from a strategic perspective:\n\n{problem}\n\nProvide strategic recommendations.")
            f2 = ex.submit(self.query_expert, "researcher",
                f"Research the technical feasibility of this:\n\n{problem}\n\nWhat does the latest research say?")
            strategy = f1.result()
            research = f2.result()
        self.results['strategy'] = strategy
        self.results['research'] = research
        print(f"   ✅ Strategy: {len(strategy)} chars | Research: {len(research)} chars")

        # Phase 2: Architect + Security (parallel)
        print("\n[3-4/8] 🏗️ Prof. Marcus (Architecture) + 🔒 James (Security)")
        with ThreadPoolExecutor(max_workers=2) as ex:
            f1 = ex.submit(self.query_expert, "architect",
                f"Design the system architecture for:\n\n{problem}\n\nStrategy: {strategy[:500]}\nResearch: {research[:300]}")
            f2 = ex.submit(self.query_expert, "security",
                f"Security assessment for:\n\n{problem}\n\nArchitecture: [being designed concurrently]")
            architecture = f1.result()
            security = f2.result()
        self.results['architecture'] = architecture
        self.results['security'] = security
        print(f"   ✅ Architecture: {len(architecture)} chars | Security: {len(security)} chars")

        # Phase 3: UX + DevOps (parallel)
        print("\n[5-6/8] 🎨 Elena (UX Design) + 🚀 Raj (DevOps)")
        with ThreadPoolExecutor(max_workers=2) as ex:
            f1 = ex.submit(self.query_expert, "ux_engineer",
                f"UX design recommendations for:\n\n{problem}\n\nArchitecture: {architecture[:400]}")
            f2 = ex.submit(self.query_expert, "devops",
                f"DevOps and deployment plan for:\n\n{problem}\n\nArchitecture: {architecture[:400]}")
            ux = f1.result()
            devops = f2.result()
        self.results['ux'] = ux
        self.results['devops'] = devops
        print(f"   ✅ UX: {len(ux)} chars | DevOps: {len(devops)} chars")

        # Phase 4: QA + Writer (parallel)
        print("\n[7-8/8] 🧪 Maria (QA) + 📝 David (Documentation)")
        with ThreadPoolExecutor(max_workers=2) as ex:
            f1 = ex.submit(self.query_expert, "qa",
                f"Quality assurance strategy for:\n\n{problem}\n\nArchitecture: {architecture[:400]}")
            f2 = ex.submit(self.query_expert, "writer",
                f"Create documentation structure for:\n\n{problem}\n\nStrategy: {strategy[:400]}")
            qa = f1.result()
            docs = f2.result()
        self.results['qa'] = qa
        self.results['documentation'] = docs
        print(f"   ✅ QA: {len(qa)} chars | Docs: {len(docs)} chars")

        # Summary
        print("\n" + "=" * 70)
        print("✅ EXPERT TEAM — DELIVERY COMPLETE (4 parallel batches)")
        print("=" * 70)
        
        for expert_id, result in self.results.items():
            expert = EXPERTS.get(expert_id, {})
            print(f"   {expert.get('name', expert_id)}: {len(result)} chars — {result[:80]}...")

        return self.results

    def critique(self):
        """Each expert critiques the others' work."""
        print("\n" + "=" * 70)
        print("🔄 CROSS-EXPERT CRITIQUE")
        print("=" * 70)
        
        critiques = {}
        # Strategist critiques Security
        c1 = self.query_expert("strategist", 
            f"Review the security assessment and identify business risks:\n\n{self.results.get('security', '')[:500]}")
        critiques['strategy_on_security'] = c1
        print(f"   Strategy → Security: {len(c1)} chars")
        
        # Architect critiques UX
        c2 = self.query_expert("architect",
            f"Review the UX recommendations for architectural feasibility:\n\n{self.results.get('ux', '')[:500]}")
        critiques['architecture_on_ux'] = c2
        print(f"   Architecture → UX: {len(c2)} chars")
        
        return critiques


# ═══════════════════════════════════════════════════════
# CLI
# ═══════════════════════════════════════════════════════
if __name__ == "__main__":
    import sys
    query = " ".join(sys.argv[1:]) if len(sys.argv) > 1 else "Design an AI-powered customer support platform for a UAE bank"
    team = ExpertTeam()
    results = team.run(query)
    critiques = team.critique()
    
    # Save
    out = os.path.join(os.path.dirname(__file__), "expert_output.json")
    with open(out, "w", encoding="utf-8") as f:
        json.dump({"results": results, "critiques": critiques}, f, indent=2, ensure_ascii=False)
    print(f"\n📁 Full output: {out}")