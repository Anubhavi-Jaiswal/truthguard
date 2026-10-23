import { Document, Passage } from '../../shared/types';
import { SYNTHETIC_DOCUMENTS } from '../data/syntheticDocuments';

class DocumentStore {
  private documents: Map<string, Document> = new Map();
  private passages: Passage[] = [];

  constructor() {
    this.resetToDefault();
  }

  public resetToDefault(): void {
    this.documents.clear();
    this.passages = [];
    for (const doc of SYNTHETIC_DOCUMENTS) {
      this.addDocument(doc);
    }
  }

  public getAllDocuments(): Document[] {
    return Array.from(this.documents.values());
  }

  public getDocumentById(id: string): Document | undefined {
    return this.documents.get(id);
  }

  public addDocument(doc: Document): void {
    this.documents.set(doc.id, doc);
    this.indexDocumentPassages(doc);
  }

  public deleteDocument(id: string): boolean {
    if (!this.documents.has(id)) return false;
    this.documents.delete(id);
    this.passages = this.passages.filter(p => p.documentId !== id);
    return true;
  }

  public getAllPassages(): Passage[] {
    return this.passages;
  }

  private indexDocumentPassages(doc: Document): void {
    // Remove existing passages for this doc if any
    this.passages = this.passages.filter(p => p.documentId !== doc.id);

    // Split document content by sections or paragraphs
    const paragraphs = doc.content
      .split(/\n\s*\n/)
      .map(p => p.trim())
      .filter(p => p.length > 20);

    paragraphs.forEach((text, index) => {
      // Extract section title if paragraph begins with Section or Heading
      let section: string | undefined = undefined;
      const sectionMatch = text.match(/^(Section\s+\d+[:\s\w]+|###?\s+[\w\s]+)/i);
      if (sectionMatch) {
        section = sectionMatch[0].trim();
      }

      this.passages.push({
        id: `${doc.id}-p${index + 1}`,
        documentId: doc.id,
        documentTitle: doc.title,
        version: doc.version,
        category: doc.category,
        effectiveFrom: doc.effectiveFrom,
        effectiveTo: doc.effectiveTo,
        section,
        text
      });
    });
  }
}

export const documentStore = new DocumentStore();
