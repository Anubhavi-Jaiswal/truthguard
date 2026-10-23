import { 
  VerificationResult, 
  VerificationStage, 
  ExecutionMode, 
  Passage 
} from '../../shared/types';
import { retrieverAgent } from '../agents/retriever';
import { synthesizerAgent } from '../agents/synthesizer';
import { criticAgent } from '../agents/critic';
import { resolverAgent } from '../agents/resolver';
import { llmService } from './llmService';

export class PipelineService {
  public async executeVerification(question: string): Promise<VerificationResult> {
    const startTime = Date.now();
    const stages: VerificationStage[] = [
      { id: 'retriever', name: 'Passage Retrieval', agent: 'Retriever Agent', status: 'pending' },
      { id: 'synthesizer', name: 'Claim Synthesis', agent: 'Synthesizer Agent', status: 'pending' },
      { id: 'critic', name: 'Adversarial Contradiction Analysis', agent: 'Critic Agent', status: 'pending' },
      { id: 'resolver', name: 'Conflict Resolution & Proof', agent: 'Resolver Agent', status: 'pending' }
    ];

    let executionMode: ExecutionMode = llmService.isConfigured() ? 'LIVE_AI' : 'DEMO_DETERMINISTIC';

    // Stage 1: Retriever
    stages[0].status = 'running';
    stages[0].startedAt = Date.now();
    const retrievedPassages: Passage[] = retrieverAgent.search(question, 8);
    stages[0].status = 'completed';
    stages[0].completedAt = Date.now();
    stages[0].summary = `Retrieved ${retrievedPassages.length} relevant passages via BM25 retrieval.`;

    // Try live AI execution if key is present
    if (executionMode === 'LIVE_AI') {
      try {
        stages[1].status = 'running';
        stages[1].startedAt = Date.now();
        const llmResult = await llmService.callLLM({ question, passages: retrievedPassages });
        stages[1].status = 'completed';
        stages[1].completedAt = Date.now();
        stages[1].summary = `Synthesized ${llmResult.claims.length} claims.`;

        stages[2].status = 'completed';
        stages[2].summary = `Identified ${llmResult.conflicts.length} conflict(s).`;

        stages[3].status = 'completed';
        stages[3].summary = `Final status resolved as ${llmResult.overallStatus}.`;

        return {
          question,
          answer: llmResult.answer,
          overallStatus: llmResult.overallStatus,
          claims: llmResult.claims,
          conflicts: llmResult.conflicts,
          citedSources: retrievedPassages.map(p => ({
            documentId: p.documentId,
            documentTitle: p.documentTitle,
            version: p.version,
            effectiveFrom: p.effectiveFrom,
            effectiveTo: p.effectiveTo,
            passageId: p.id,
            quote: p.text.slice(0, 150)
          })),
          resolutionExplanation: llmResult.resolutionExplanation,
          unresolvedQuestions: llmResult.unresolvedQuestions,
          verificationStages: stages,
          executionMode: 'LIVE_AI',
          metadata: {
            retrievedPassageCount: retrievedPassages.length,
            processingTimeMs: Date.now() - startTime,
            ...llmService.getProviderInfo()
          }
        };
      } catch (err: any) {
        console.warn(`[Pipeline] Live AI failed (${err.message}). Falling back to Deterministic Demo Engine.`);
        executionMode = 'DEMO_DETERMINISTIC';
      }
    }

    // Stage 2: Synthesizer (Deterministic)
    stages[1].status = 'running';
    stages[1].startedAt = Date.now();
    const synthOutput = synthesizerAgent.synthesize(question, retrievedPassages);
    stages[1].status = 'completed';
    stages[1].completedAt = Date.now();
    stages[1].summary = `Synthesized ${synthOutput.claims.length} candidate claim(s).`;

    // Stage 3: Critic / Adversary
    stages[2].status = 'running';
    stages[2].startedAt = Date.now();
    const criticOutput = criticAgent.review(question, retrievedPassages, synthOutput);
    stages[2].status = 'completed';
    stages[2].completedAt = Date.now();
    stages[2].summary = criticOutput.findingsSummary;

    // Stage 4: Resolver
    stages[3].status = 'running';
    stages[3].startedAt = Date.now();
    const resolverOutput = resolverAgent.resolve(question, retrievedPassages, synthOutput, criticOutput);
    stages[3].status = 'completed';
    stages[3].completedAt = Date.now();
    stages[3].summary = `Resolution determined: ${resolverOutput.overallStatus}.`;

    return {
      question,
      answer: resolverOutput.finalAnswer,
      overallStatus: resolverOutput.overallStatus,
      claims: criticOutput.reviewedClaims,
      conflicts: resolverOutput.updatedConflicts,
      citedSources: resolverOutput.citedSources,
      resolutionExplanation: resolverOutput.resolutionExplanation,
      unresolvedQuestions: criticOutput.unresolvedQuestions,
      verificationStages: stages,
      executionMode: 'DEMO_DETERMINISTIC',
      metadata: {
        retrievedPassageCount: retrievedPassages.length,
        processingTimeMs: Date.now() - startTime,
        ...llmService.getProviderInfo()
      }
    };
  }
}

export const pipelineService = new PipelineService();
