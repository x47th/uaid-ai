"""UAID AI — Main entry point for the CrewAI orchestration system."""

import os
from dotenv import load_dotenv
from crewai import Agent, Task, Crew, Process

load_dotenv()


def create_agents():
    """Create and return the three UAID agents."""
    researcher = Agent(
        role="Knowledge Researcher",
        goal="Find relevant information from the UAID knowledge base about client problems and solutions",
        backstory="You are an expert AI researcher specializing in finding the best AI-driven "
                  "solutions for business problems. You search across structured (Neo4j) and "
                  "semantic (Qdrant) knowledge bases to find the most relevant information.",
        verbose=True,
        allow_delegation=True,
    )

    architect = Agent(
        role="Solution Architect",
        goal="Design comprehensive AI solutions based on research findings",
        backstory="You are an experienced AI solution architect who transforms research insights "
                  "into actionable, well-structured AI implementation plans. You specialize in "
                  "DeepSeek, Neo4j, Qdrant, and CrewAI architectures.",
        verbose=True,
        allow_delegation=False,
    )

    writer = Agent(
        role="Technical Writer",
        goal="Create clear, professional documentation and reports from AI solutions",
        backstory="You are a technical writer who transforms complex AI architectures into clear, "
                  "client-ready documentation. Your reports are professional, well-structured, "
                  "and easy for non-technical stakeholders to understand.",
        verbose=True,
        allow_delegation=False,
    )

    return researcher, architect, writer


def run_query(query: str) -> str:
    """Run the UAID agent crew on a user query."""
    researcher, architect, writer = create_agents()

    research_task = Task(
        description=f"Research the following client problem and find relevant AI solutions: {query}",
        expected_output="A detailed research report with findings, relevant technologies, and potential approaches.",
        agent=researcher,
    )

    architecture_task = Task(
        description="Based on the research findings, design a comprehensive AI solution architecture.",
        expected_output="A detailed solution architecture document with components, data flow, "
                        "and implementation approach.",
        agent=architect,
    )

    documentation_task = Task(
        description="Create a client-ready report from the solution architecture.",
        expected_output="A polished, professional report suitable for client presentation, "
                        "with clear sections, diagrams descriptions, and next steps.",
        agent=writer,
    )

    crew = Crew(
        agents=[researcher, architect, writer],
        tasks=[research_task, architecture_task, documentation_task],
        process=Process.sequential,
        verbose=True,
        memory=True,
        cache=True,
    )

    result = crew.kickoff()
    return result


def run():
    """CLI entry point."""
    import sys

    if len(sys.argv) < 2:
        print("Usage: uaid <query>")
        print("Example: uaid 'supply chain automation for a logistics company'")
        sys.exit(1)

    query = " ".join(sys.argv[1:])
    print(f"\n🚀 UAID AI — Processing: {query}\n")
    result = run_query(query)
    print(f"\n✅ Result:\n{result}")


if __name__ == "__main__":
    run()
