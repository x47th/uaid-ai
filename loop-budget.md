# UAID AI — Loop Budget

## Token Caps
| Pattern | Daily Limit | Per-Run Limit |
|---------|-------------|---------------|
| Daily Triage | 10,000 | 2,000 |
| GraphRAG Query | 5,000 | 1,000 |
| CrewAI Pipeline | 15,000 | 5,000 |

## Rate Limits
| Service | Calls/Day | Calls/Minute |
|---------|-----------|--------------|
| DeepSeek API | 50 | 5 |
| Neo4j | 500 | 60 |
| Qdrant | 1,000 | 120 |

## Cost Estimates
| Model | Input/1M tokens | Output/1M tokens |
|-------|-----------------|------------------|
| deepseek-v4-flash | ~$0.14 | ~$0.28 |

## Kill Switch
- **Auto-kill:** If 3 consecutive DeepSeek errors
- **Budget kill:** If daily token cap exceeded
- **Timeout kill:** Any loop run > 120s
- **Manual kill:** Set `LOOP_ACTIVE=false` in STATE.md

## Monthly Budget Target
- Max: $50/month on DeepSeek API
- Current estimate: ~$5-10/month (dev usage)
