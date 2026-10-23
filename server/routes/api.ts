import express, { Request, Response } from 'express';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { documentStore } from '../services/documentStore';
import { pipelineService } from '../services/pipeline';
import { testRunnerService } from '../services/testRunner';
import { llmService } from '../services/llmService';
import { TEST_CASES } from '../data/testCases';
import { Document, SourceType, PolicyCategory } from '../../shared/types';

export const apiRouter = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// GET /api/health
apiRouter.get('/health', (req: Request, res: Response) => {
  const providerInfo = llmService.getProviderInfo();
  res.json({
    status: 'ok',
    product: 'TruthGuard',
    version: '1.0.0',
    mode: providerInfo.configured ? 'LIVE_AI' : 'DEMO_DETERMINISTIC',
    provider: providerInfo.provider,
    model: providerInfo.model,
    indexedDocumentsCount: documentStore.getAllDocuments().length,
    indexedPassagesCount: documentStore.getAllPassages().length,
    timestamp: new Date().toISOString()
  });
});

// GET /api/documents
apiRouter.get('/documents', (req: Request, res: Response) => {
  res.json({
    documents: documentStore.getAllDocuments()
  });
});

// POST /api/documents/reset
apiRouter.post('/documents/reset', (req: Request, res: Response) => {
  documentStore.resetToDefault();
  res.json({
    message: 'Document repository reset to default synthetic corpus.',
    count: documentStore.getAllDocuments().length
  });
});

// POST /api/documents/upload
apiRouter.post('/documents/upload', upload.single('file'), async (req: Request, res: Response): Promise<void> => {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({ error: 'No file uploaded.' });
      return;
    }

    const title = (req.body.title as string) || file.originalname;
    const category = (req.body.category as PolicyCategory) || 'GENERAL';
    const version = (req.body.version as string) || '1.0';
    const effectiveFrom = (req.body.effectiveFrom as string) || new Date().toISOString().split('T')[0];
    const supersedesStr = req.body.supersedes as string;
    const supersedes = supersedesStr ? supersedesStr.split(',').map(s => s.trim()) : undefined;

    let content = '';
    let sourceType: SourceType = 'txt';

    const ext = file.originalname.split('.').pop()?.toLowerCase();

    if (ext === 'pdf') {
      sourceType = 'pdf';
      const pdfData = await pdfParse(file.buffer);
      content = pdfData.text;
    } else if (ext === 'docx') {
      sourceType = 'docx';
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      content = result.value;
    } else if (ext === 'txt' || ext === 'md') {
      sourceType = ext;
      content = file.buffer.toString('utf-8');
    } else {
      res.status(400).json({ error: 'Unsupported file format. Please upload PDF, DOCX, TXT, or Markdown.' });
      return;
    }

    if (!content || content.trim().length < 10) {
      res.status(400).json({ error: 'The uploaded file does not contain readable text.' });
      return;
    }

    const newDoc: Document = {
      id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title,
      content,
      version,
      publishedAt: new Date().toISOString().split('T')[0],
      effectiveFrom,
      category,
      sourceType,
      supersedes
    };

    documentStore.addDocument(newDoc);

    res.status(201).json({
      message: 'Document successfully ingested and indexed.',
      document: newDoc
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to process document upload: ' + error.message
    });
  }
});

// DELETE /api/documents/:id
apiRouter.delete('/documents/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = documentStore.deleteDocument(id);
  if (!deleted) {
    res.status(404).json({ error: 'Document not found.' });
    return;
  }
  res.json({ message: 'Document deleted successfully.' });
});

// POST /api/query
apiRouter.post('/query', async (req: Request, res: Response): Promise<void> => {
  try {
    const { question } = req.body;
    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      res.status(400).json({ error: 'Question parameter is required.' });
      return;
    }

    const result = await pipelineService.executeVerification(question.trim());
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: 'Verification pipeline error: ' + error.message });
  }
});

// GET /api/conflicts
apiRouter.get('/conflicts', async (req: Request, res: Response) => {
  // Pre-scan common high-risk questions to discover existing conflicts across the corpus
  const checks = [
    'What is the daily meal reimbursement limit?',
    'What is the annual casual leave entitlement?',
    'Does the policy require password rotation and uppercase?'
  ];

  const allConflicts = [];
  for (const q of checks) {
    const resVer = await pipelineService.executeVerification(q);
    if (resVer.conflicts.length > 0) {
      allConflicts.push(...resVer.conflicts);
    }
  }

  // Deduplicate by conflict ID
  const uniqueMap = new Map();
  for (const c of allConflicts) {
    uniqueMap.set(c.id, c);
  }

  res.json({
    conflicts: Array.from(uniqueMap.values())
  });
});

// GET /api/demo/scenarios
apiRouter.get('/demo/scenarios', (req: Request, res: Response) => {
  res.json({
    testCases: TEST_CASES
  });
});

// POST /api/demo/run-scenario
apiRouter.post('/demo/run-scenario', async (req: Request, res: Response): Promise<void> => {
  try {
    const { scenarioId } = req.body;
    const testCase = TEST_CASES.find(t => t.id === scenarioId);
    if (!testCase) {
      res.status(404).json({ error: 'Scenario not found.' });
      return;
    }

    const verification = await pipelineService.executeVerification(testCase.question);
    res.json({
      scenario: testCase,
      result: verification
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to run scenario: ' + err.message });
  }
});

// POST /api/demo/run-all-tests
apiRouter.post('/demo/run-all-tests', async (req: Request, res: Response) => {
  const suiteResults = await testRunnerService.runAllTests();
  res.json(suiteResults);
});
