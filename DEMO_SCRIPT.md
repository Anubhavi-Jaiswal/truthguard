# TruthGuard: 3-Minute Live Hackathon Presentation Script

**Speaker Persona**: Lead AI & Systems Engineer  
**Total Target Time**: ~3 minutes  
**Goal**: Highlight why conventional RAG fails, show TruthGuard's 4-agent verification pipeline in action, and demonstrate 100% test bench reproducibility.

---

### Phase 1: Problem & Vision (30 seconds)
> *"Hello judges! Almost every modern enterprise uses LLMs or RAG for document search. But here is the critical vulnerability: when policies evolve, standard RAG systems hallucinate answers by mixing conflicting documents or blindly picking whichever text was published later.*
> 
> *Our solution is **TruthGuard** — tagline: **Don't Just Trust the Answer. Verify It.** We built an adversarial multi-agent system specifically designed for HR, compliance, and legal teams to detect contradictions, enforce effective dates, and verify exact provenance before answering."*

---

### Phase 2: Demonstration 1 — Explicit Supersession & Dates (45 seconds)
1. **Action**: Open the **Ask TruthGuard** tab. Click:
   `"What is the current casual leave entitlement after April 1, 2025?"`
2. **Talk Track**:
   > *"Notice the 4 verification stages: Retriever finds 3 versions of our HR policy (12 days in v1, 15 days in v2, and 18 days in the 2025 Amendment). Synthesizer generates candidate claims. Critic flags the discrepancy across versions. And our Resolver agent inspects the legal text, identifying an explicit clause stating Amendment 2025-A1 invalidates earlier versions. Status: **VERIFIED (18 days)**."*
3. **Action**: Click:
   `"What was the casual leave entitlement before April 2025?"`
4. **Talk Track**:
   > *"Now look at what happens when we ask about dates before April 2025: TruthGuard respects the chronological boundary. It does not retroactively leak the 18-day rule into earlier dates. It correctly returns 15 days under Policy v2."*

---

### Phase 3: Demonstration 2 — Unresolved Contradictions (45 seconds)
1. **Action**: Click:
   `"What is the daily meal reimbursement limit?"`
2. **Talk Track**:
   > *"Here is where conventional AI fails completely. In our corpus, Corporate Operations Manual A specifies ₹800, while Field Manual B specifies ₹1,200. Neither references the other.*
   > 
   > *A standard RAG system would arbitrarily pick one number. TruthGuard refuses to do that. It triggers **CONFLICT DETECTED (UNRESOLVED)**, highlights both passages side-by-side in our Conflict Explorer, and honestly tells the compliance officer that organizational precedence is missing."*

---

### Phase 4: Demonstration 3 — Test Bench & Provenance (45 seconds)
1. **Action**: Navigate to **Test Bench** and click **Run All Adversarial Tests**.
2. **Talk Track**:
   > *"To prove this isn't hardcoded or superficial, we built an automated Test Bench covering 8 adversarial fixtures: numeric contradictions, missing evidence, irrelevant newer documents, and prompt-injection quarantines. All 8 tests pass with a 100% pass rate.*
   > 
   > *Every single claim links back to exact document IDs and effective dates in our Document Library. TruthGuard is live, completely deterministic in demo mode, and ready for production LLM deployment. Thank you!"*
