#!/usr/bin/env python
"""
DeepSeek TUI — Terminal chat interface for DeepSeek V4
Uses OpenAI SDK (DeepSeek-compatible), rich for terminal UI
"""

import os
import sys
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

# ── Config ──────────────────────────────────────────────
MODEL = "deepseek-v4-flash"
BASE_URL = "https://api.deepseek.com/v1"
API_KEY = os.getenv("DEEPSEEK_API_KEY")

if not API_KEY:
    print("❌ DEEPSEEK_API_KEY not found in .env")
    sys.exit(1)

client = OpenAI(api_key=API_KEY, base_url=BASE_URL)

# ── Rich TUI ─────────────────────────────────────────────
try:
    from rich.console import Console
    from rich.markdown import Markdown
    from rich.panel import Panel
    from rich.live import Live
    from rich.text import Text
    from rich.prompt import Prompt
    RICH = True
except ImportError:
    RICH = False
    print("⚠️  Install 'rich' for better TUI: pip install rich")
    print("   Running in plain mode...\n")

if RICH:
    console = Console()

    console.print(Panel.fit(
        "[bold cyan]🧠 DeepSeek V4 TUI[/bold cyan]\n"
        f"[dim]Model: {MODEL}[/dim]\n"
        "[dim]Type /exit to quit, /clear to reset[/dim]",
        border_style="cyan",
    ))

    messages = [{"role": "system", "content": "You are a helpful AI assistant. Respond concisely."}]

    while True:
        try:
            user_input = Prompt.ask("\n[bold green]You[/bold green]")
        except (KeyboardInterrupt, EOFError):
            console.print("\n[yellow]Goodbye![/yellow]")
            break

        if user_input.strip().lower() in ("/exit", "/quit", "/q"):
            console.print("[yellow]Goodbye![/yellow]")
            break
        if user_input.strip().lower() == "/clear":
            messages = [messages[0]]
            console.print("[dim]Chat cleared.[/dim]")
            continue
        if not user_input.strip():
            continue

        messages.append({"role": "user", "content": user_input})

        # Stream response
        console.print("\n[bold cyan]DeepSeek[/bold cyan] ", end="")
        try:
            stream = client.chat.completions.create(
                model=MODEL,
                messages=messages,
                stream=True,
            )
            full_response = ""
            for chunk in stream:
                if chunk.choices[0].delta.content:
                    text = chunk.choices[0].delta.content
                    full_response += text
                    console.print(text, end="")
            console.print()
            messages.append({"role": "assistant", "content": full_response})
        except Exception as e:
            console.print(f"\n[red]❌ Error: {e}[/red]")

else:
    # Plain fallback
    print("🧠 DeepSeek V4 TUI (plain mode)")
    print(f"Model: {MODEL}")
    print("Type /exit to quit, /clear to reset\n")

    messages = [{"role": "system", "content": "You are a helpful AI assistant."}]

    while True:
        try:
            user_input = input("\nYou: ")
        except (KeyboardInterrupt, EOFError):
            print("\nGoodbye!")
            break

        if user_input.strip().lower() in ("/exit", "/quit", "/q"):
            print("Goodbye!")
            break
        if user_input.strip().lower() == "/clear":
            messages = [messages[0]]
            print("Chat cleared.")
            continue
        if not user_input.strip():
            continue

        messages.append({"role": "user", "content": user_input})

        try:
            response = client.chat.completions.create(
                model=MODEL,
                messages=messages,
                max_tokens=2000,
            )
            reply = response.choices[0].message.content
            print(f"\nDeepSeek: {reply}")
            messages.append({"role": "assistant", "content": reply})
        except Exception as e:
            print(f"\n❌ Error: {e}")
