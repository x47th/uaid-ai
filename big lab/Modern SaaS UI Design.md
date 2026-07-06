# 🎨 Modern SaaS UI Design — Reference

## Design Logic (The "Why")

| Principle | Description |
|-----------|-------------|
| **Zero-State** | Empty screens should educate, not feel blank. Invite action. |
| **Progressive Disclosure** | Show only what's needed now. Hide complexity behind menus/drawers. |
| **Design Tokens** | No hardcoded colors. Use token system for consistency. |

## Technical Implementation (The "How")

| Pattern | What It Solves |
|---------|---------------|
| **Compound Components** | `<Modal.Header>` etc. — composable, maintainable |
| **Skeleton Screens** | Shape-matched loading placeholders |
| **Optimistic UI** | Update UI before server responds, rollback on failure |
| **Tailwind + Radix** | Industry standard for styling + accessibility |
| **Cmd+K Palettes** | Keyboard-first power user navigation |

## Modern SaaS Checklist

- [ ] Sidebar-driven navigation (primary + secondary)
- [ ] Rounded corners (8-12px) + subtle shadows
- [ ] Monospace fonts for data (numbers, dates, IDs)
- [ ] Hover actions on table rows
- [ ] Context-aware slide-out drawers

## Learning Path

1. **Study shadcn/ui source code** — it's a curriculum
2. **Copy-work** — recreate Linear/Vercel/Twenty screens

## Applying to Project Horizon

Project Horizon needs:
- shadcn/ui components (Radix + Tailwind)
- Cmd+K command palette
- Sidebar layout with primary nav + secondary detail view
- Optimistic updates for deal stage changes
- Skeleton loading for company/contact lists
