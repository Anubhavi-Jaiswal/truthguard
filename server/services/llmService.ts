import { Passage, Claim, Conflict, VerificationStatus, ResolutionStatus } from '../../shared/types';

export interface LLMVerificationPayload {
  question: string;
  passages: Passage[];
}

export interface LLMVerificationResponse {
  answer: string;
  overallStatus: VerificationStatus;
  claims: Claim[];
  conflicts: Conflict[];
  resolutionExplanation: string;
  unresolvedQuestions: string[];
}

export class LLMService {
  private apiKey: string | undefined;
  private provider: string;
  private model: string;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY || process.env.ANTHROPIC_API_KEY;
    if (process.env.GEMINI_API_KEY) {
      this.provider = 'gemini';
      this.model = 'gemini-1.5-flash';
    } else if (process.env.ANTHROPIC_API_KEY) {
      this.provider = 'anthropic';
      this.model = 'claude-3-5-sonnet-20241022';
    } else {
      this.provider = 'openai';
      this.model = 'gpt-4o-mini';
    }
  }

  public isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  public getProviderInfo() {
    return {
      configured: this.isConfigured(),
      provider: this.isConfigured() ? this.provider : 'deterministic-demo-engine',
      model: this.isConfigured() ? this.model : 'TruthGuard-RuleEngine-v1'
    };
  }

  /**
   * Calls the live LLM provider if configured.
   * If not configured or if an error occurs, throws so the pipeline can gracefully fall back to deterministic engine.
   */
  public async callLLM(payload: LLMVerificationPayload): Promise<LLMVerificationResponse> {
    if (!this.isConfigured()) {
      throw new Error('LLM API key not configured. Using deterministic verification engine.');
    }

    const systemPrompt = `You are TruthGuard, an adversarial multi-agent verification system for enterprise policy documents.
Your goal is to answer the user query based ONLY on the provided document passages.
Critically analyze the passages:
1. Identify any contradictions (numeric, date, or rule conflicts) between passages.
2. Check if newer documents explicitly supersede older ones, or if they are unresolved contradictions.
3. Mark claims as SUPPORTED, CONTRADICTED, or UNSUPPORTED.
4. Output STRICT JSON conforming to this schema:
{
  "answer": "string",
  "overallStatus": "VERIFIED" | "CONFLICT_DETECTED" | "INSUFFICIENT_EVIDENCE" | "PARTIALLY_VERIFIED",
  "claims": [{"id": "c1", "text": "...", "supportingPassageIds": ["..."], "status": "SUPPORTED"|"CONTRADICTED"|"UNSUPPORTED", "explanation": "..."}],
  "conflicts": [{"id": "conf1", "description": "...", "involvedPassageIds": ["..."], "severity": "HIGH"|"MEDIUM"|"LOW", "resolutionStatus": "RESOLVED"|"UNRESOLVED", "explanation": "..."}],
  "resolutionExplanation": "string",
  "unresolvedQuestions": ["string"]
}`;

    const userPrompt = `User Question: ${payload.question}\n\nEvidence Passages:\n${payload.passages.map(p => `[ID: ${p.id} | Doc: ${p.documentTitle} | Ver: ${p.version} | Eff: ${p.effectiveFrom}]: ${p.text}`).join('\n\n')}`;

    if (this.provider === 'openai') {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.1
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`OpenAI API call failed (${response.status}): ${errText}`);
      }

      const data = await response.json();
      return JSON.parse(data.choices[0].message.content) as LLMVerificationResponse;
    }

    throw new Error(`Provider ${this.provider} integration pending live keys; falling back to deterministic engine.`);
  }
}

export const llmService = new LLMService();
