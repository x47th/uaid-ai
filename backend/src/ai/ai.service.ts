import { Injectable } from '@nestjs/common';

@Injectable()
export class AIService {
  private apiKey: string;
  private baseUrl = 'https://api.deepseek.com/v1';

  constructor() {
    this.apiKey = process.env.DEEPSEEK_API_KEY || '';
  }

  async enrichCompany(name: string, domain?: string): Promise<{ industry: string; size: string; description: string }> {
    const prompt = `Research the company "${name}"${domain ? ` (domain: ${domain})` : ''}. 
Return a JSON object with: industry, size (e.g. "1-10", "11-50", "51-200", "201-1000", "1000+"), and a 1-sentence description.
Only return valid JSON, no other text. Example: {"industry":"Fintech","size":"201-1000","description":"A payment processing platform for businesses."}`;

    try {
      const res = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${this.apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'deepseek-v4-flash',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 150,
          temperature: 0.3,
        }),
      });
      const data = await res.json() as any;
      const text = data.choices?.[0]?.message?.content || '{}';
      const json = JSON.parse(text.replace(/```json|```/g, '').trim());
      return { industry: json.industry || 'Unknown', size: json.size || 'Unknown', description: json.description || '' };
    } catch {
      return { industry: 'Unknown', size: 'Unknown', description: '' };
    }
  }

  async generateInsight(prompt: string): Promise<string> {
    try {
      const res = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${this.apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'deepseek-v4-flash',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 300,
        }),
      });
      const data = await res.json() as any;
      return data.choices?.[0]?.message?.content || '';
    } catch {
      return '';
    }
  }
}
