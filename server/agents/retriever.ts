import { Passage } from '../../shared/types';
import { documentStore } from '../services/documentStore';

export class RetrieverAgent {
  private k1: number = 1.5;
  private b: number = 0.75;

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s₹$]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 1 && isNaN(Number(w)) && !this.isStopWord(w));
  }

  private isStopWord(word: string): boolean {
    const stopWords = new Set([
      'the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'of', 'for', 'in',
      'to', 'with', 'by', 'as', 'it', 'be', 'are', 'was', 'were', 'that', 'this',
      'from', 'what', 'who', 'how', 'when', 'where', 'does', 'do', 'can', 'should',
      'show', 'me', 'policy', 'guidelines', 'standard', 'rules', 'company', 'employees',
      'with', 'all', 'any', 'per', 'years', 'days', 'service'
    ]);
    return stopWords.has(word);
  }

  /**
   * BM25 Keyword Search over indexed passages
   */
  public search(query: string, topK: number = 6): Passage[] {
    const allPassages = documentStore.getAllPassages();
    if (allPassages.length === 0) return [];

    const queryTokens = this.tokenize(query);
    if (queryTokens.length === 0) return [];

    const N = allPassages.length;
    const docLengths = allPassages.map(p => this.tokenize(p.text).length);
    const avgdl = docLengths.reduce((a, b) => a + b, 0) / N;

    // Document frequencies (DF)
    const dfMap = new Map<string, number>();
    for (const term of queryTokens) {
      let count = 0;
      for (const p of allPassages) {
        const passageTerms = new Set(this.tokenize(p.text + ' ' + p.documentTitle));
        if (passageTerms.has(term)) {
          count++;
        }
      }
      dfMap.set(term, count);
    }

    // Check if the primary subject/entity has 0 matches in the entire corpus
    // If none of the meaningful non-stop query tokens appear anywhere in the corpus, retrieval is empty
    const matchedAnyTermCount = queryTokens.filter(t => (dfMap.get(t) || 0) > 0).length;
    if (matchedAnyTermCount === 0) {
      return [];
    }

    // Score passages
    const scoredPassages = allPassages.map((passage, idx) => {
      const pTokens = this.tokenize(passage.text);
      const titleTokens = this.tokenize(passage.documentTitle);
      const tfMap = new Map<string, number>();
      for (const t of pTokens) {
        tfMap.set(t, (tfMap.get(t) || 0) + 1);
      }

      const docLen = docLengths[idx];
      let score = 0;
      let matchedInPassage = 0;

      for (const term of queryTokens) {
        const tf = tfMap.get(term) || 0;
        const df = dfMap.get(term) || 0;
        const inTitle = titleTokens.includes(term);

        if (inTitle) {
          score += 4.0;
          matchedInPassage++;
        }

        if (df > 0 && tf > 0) {
          const idf = Math.log(1 + (N - df + 0.5) / (df + 0.5));
          const numerator = tf * (this.k1 + 1);
          const denominator = tf + this.k1 * (1 - this.b + this.b * (docLen / avgdl));
          score += idf * (numerator / denominator);
          matchedInPassage++;
        }
      }

      if (matchedInPassage === 0) {
        score = 0;
      }

      return {
        ...passage,
        score: Math.round(score * 100) / 100
      };
    });

    return scoredPassages
      .filter(p => (p.score ?? 0) > 0.5)
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
      .slice(0, topK);
  }
}

export const retrieverAgent = new RetrieverAgent();
