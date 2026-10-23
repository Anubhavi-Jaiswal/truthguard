# TruthGuard: Project Understanding & Presentation Script

---

## PAGE 1: DEEP TECHNICAL UNDERSTANDING & ARCHITECTURE

### 1. The Core Problem: Why Conventional RAG Fails in Enterprises
Standard Document Question-Answering and Retrieval-Augmented Generation (RAG) systems have a critical flaw: **they synthesize answers with unearned confidence even when underlying source documents directly contradict each other.**

In real enterprises (HR, Legal, Compliance, IT Security), documentation is rarely clean:
- Amendments supersede previous policies without deleting old files.
- Multiple department manuals establish conflicting limits (e.g., ₹800 vs ₹1,200 meal allowances).
- Policies have non-retroactive effective date boundaries.

A standard semantic search or RAG pipeline blends conflicting chunks together based purely on vector similarity. It either averages values, hallucinates compromise rules, or arbitrarily favors whichever document has higher embedding proximity—often violating compliance regulations.

---

### 2. The Solution: TruthGuard
**Tagline**: *Don't Just Trust the Answer. Verify It.*

TruthGuard is a multi-agent policy verification platform. Instead of a single black-box prompt, it decomposes query resolution into an honest four-agent pipeline with explicit data contracts:

```
User Query
   ↓
[Agent 1: Retriever] ──── Extracts candidate passages preserving exact provenance (Doc ID, version, dates)
   ↓
[Agent 2: Synthesizer] ── Deconstructs candidate answer into atomic claims linked to passage IDs
   ↓
[Agent 3: Critic] ────── Compares passages across versions; detects numeric conflicts & quarantines injections
   ↓
[Agent 4: Resolver] ──── Inspects legal supersession & date boundaries; flags irresolvable ties as UNRESOLVED
   ↓
Verified Output + Precedence Justification + Side-by-Side Comparative Audit
```

---

### 3. Agent Responsibilities & Technology Stack

| Agent / Module | Implementation | Core Responsibility |
|---|---|---|
| **Agent 1: Retriever** | [`retriever.ts`](file:///c:/Users/anubh/Downloads/truthguard/server/agents/retriever.ts) (BM25 Engine) | Tokenizes queries, applies stopword filtering, ranks passages, and retains full provenance (effective dates, supersession references, versions). |
| **Agent 2: Synthesizer** | [`synthesizer.ts`](file:///c:/Users/anubh/Downloads/truthguard/server/agents/synthesizer.ts) | Formulates answers grounded strictly in retrieved passages. Decomposes answers into atomic claims mapped to passage IDs. |
| **Agent 3: Critic** | [`critic.ts`](file:///c:/Users/anubh/Downloads/truthguard/server/agents/critic.ts) (Adversary) | Identifies multi-document contradictions, flags unsupported user assumptions, checks document orthogonality, and neutralizes prompt injections. |
| **Agent 4: Resolver** | [`resolver.ts`](file:///c:/Users/anubh/Downloads/truthguard/server/agents/resolver.ts) | Enforces documented supersession and chronological boundaries. Refuses to pick arbitrary winners when no precedence exists (`CONFLICT_DETECTED`). |

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS (enterprise light-first theme).
- **Backend**: Node.js, Express, ESBuild, `pdf-parse`, `mammoth` (multi-format document ingestion).
- **Execution Engine**: Dual-mode (Deterministic Demo Engine out of the box, or live LLM integration with OpenAI/Gemini via backend env variables).

---

## PAGE 2: DEMO WALKTHROUGH & PRESENTATION SCRIPT

### Act 1: The Hook & Introduction (0:00 – 0:45)
> *"Judges, every company today is adopting RAG for internal policy search. But when policies evolve, traditional AI hallucinates answers by blending conflicting documents or blindly picking whichever text has a later timestamp.*
> 
> *This is **TruthGuard** — tagline: **Don't Just Trust the Answer. Verify It.** TruthGuard is an adversarial multi-agent verification system designed for compliance, legal, and HR operations. Instead of trusting an LLM blindly, TruthGuard audits document provenance, enforces effective dates, and flags unresolvable contradictions."*

---

### Act 2: Live Demonstration of the 3 Critical Scenarios (0:45 – 2:00)

#### Scenario A: Explicit Supersession & Date Boundaries
1. **Action**: In **Verification Console**, click:
   `"What is the current casual leave entitlement after April 1, 2025?"`
2. **Explanation**:
   > *"Notice our four verification stages in action. The Retriever pulls three document versions: v1 (12 days), v2 (15 days), and Amendment 2025-A1 (18 days). Our Critic detects the discrepancy, and our Resolver discovers an express legal clause: Amendment 2025-A1 explicitly invalidates earlier provisions. Status: **VERIFIED (18 days)**."*
3. **Action**: Click `"What was the casual leave entitlement before April 2025?"`
4. **Explanation**:
   > *"Now watch the chronological boundary: TruthGuard does not retroactively leak the 18-day rule into February 2025. It correctly enforces 15 days under Policy v2."*

#### Scenario B: The Unresolved Contradiction (Where Standard AI Fails)
1. **Action**: Click:
   `"What is the daily meal reimbursement limit?"`
2. **Explanation**:
   > *"Here is where normal RAG systems fail dangerously: Corporate Manual A says ₹800/day, while Field Staff Manual B says ₹1,200/day. Neither references the other, and no hierarchy is defined in the corpus.*
   > 
   > *A standard LLM would pick one at random. TruthGuard refuses to do that. It issues **CONFLICT DETECTED (UNRESOLVED)**, displays both passages side-by-side in our Conflict Registry, and tells the auditor that organizational hierarchy must clarify the tie."*

#### Scenario C: Unsupported Query Claims & Injection Defense
1. **Action**: Click:
   `"Does the policy require passwords to be changed every 30 days and require uppercase letters?"`
2. **Explanation**:
   > *"TruthGuard extracts individual claims: it confirms 90-day rotation, directly flags the 30-day assumption as **CONTRADICTED**, and warns that uppercase enforcement is **UNSUPPORTED** because the policy only recommends it as best practice."*

---

### Act 3: Proof of Determinism & Closing (2:00 – 3:00)
1. **Action**: Navigate to **Adversarial Bench** and click **Execute All Benchmarks**.
2. **Explanation**:
   > *"To prove this is genuine multi-agent verification rather than hardcoded UI labels, we built an automated Test Bench running 8 deterministic fixtures covering supersession, date boundaries, numeric contradictions, and prompt injection isolation. All 8 tests pass with a 100% pass rate.*
   > 
   > *TruthGuard operates out of the box with zero external API dependencies, can be containerized with Docker, and seamlessly integrates with live LLMs. TruthGuard ensures you never just trust the answer — you verify it. Thank you!"*

---

## QUICK CHEAT SHEET: ANSWERS TO TOUGH JUDGE QUESTIONS

1. **"How is this different from standard RAG?"**
   *Standard RAG retrieves passages and prompts an LLM to generate an answer. TruthGuard splits synthesis from criticism: Agent 3 acts as an adversary finding flaws in Agent 2's claims, and Agent 4 checks legal supersession metadata before finalizing.*

2. **"Does it require an OpenAI API key to run?"**
   *No. TruthGuard features a dual execution engine. It includes a fully deterministic rule & precedence engine that runs without any API key, making it 100% reliable for demos, while offering plug-and-play LLM backend connectivity.*

3. **"Can users upload their own policies?"**
   *Yes. Under Document Library, TruthGuard supports real-time ingestion of PDF, DOCX, TXT, and Markdown files with automatic text extraction, section splitting, and BM25 index updating.*
