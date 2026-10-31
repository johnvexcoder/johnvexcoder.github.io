---
name: seo-quality-gates
description: >-
  Final guardrail that reviews SEO output before it ships and blocks unsafe or
  low-quality work. Detects and stops keyword stuffing, fabricated structured
  data, fake or self-serving reviews/ratings, unnecessary or fake FAQPage markup,
  thin / doorway / AI-slop content, keyword cannibalization, cloaking/hidden text,
  risky robots/canonical/redirect/hreflang changes, and over-automation that
  violates Google's spam policies. Use as the last step before publishing any SEO
  change, or whenever someone wants a safety/quality review of SEO content,
  markup, or technical edits.
license: MIT
metadata:
  author: gaguero
  pack: seo-agent-skills
  version: "1.0"
---

# SEO Quality Gates

The last line of defense. Other skills produce; this one **blocks**. An AI agent
optimizing for search will, unchecked, drift toward exactly the patterns Google's
spam policies punish. Run this before anything is published. Output a clear
**PASS / BLOCK** per gate with the evidence and the required fix.

## How to run

For each gate below, inspect the proposed change. Mark **BLOCK** if it trips, with
the specific evidence and the fix. Anything BLOCK = do not ship until resolved.
When the agent can run a shell, `scripts/lint.py` flags several of these
heuristically on a draft.

## The gates

### 1. Fabricated data — BLOCK on any invented fact
No invented ratings, review counts, reviews, prices, availability, statistics,
quotes, authors, credentials, or citations. Structured data must describe real,
visible, accurate content. Missing data → "data needed", never a guess.

### 2. Fake / ineligible review & rating markup — BLOCK
No `aggregateRating`/`review` without genuine, customer-provided reviews shown on
the page. No self-serving reviews of your own business/products. No star markup to
fake credibility.

### 3. FAQPage abuse — BLOCK
`FAQPage` only for genuine Q&A actually visible on the page. No FAQs invented to
grab snippets; no promo/ad content as FAQs; no FAQPage on pages where it doesn't
belong.

### 4. Keyword stuffing — BLOCK
Unnatural repetition of keywords, lists of cities/variants, or text written "for
the algorithm". Read it aloud: if a human wouldn't write it that way, it's stuffing.

### 5. Thin / doorway / scaled-content abuse — BLOCK
- Pages with little original value created mainly to rank.
- Near-duplicate location/keyword pages (doorways) with swapped names.
- Bulk AI-generated pages with no added expertise, data, or first-hand value.
Google's "scaled content abuse" and "doorway" policies target exactly this.

### 6. AI slop & people-first failure — BLOCK
Generic, padded, obvious content that restates the query without insight. No
demonstrated experience/expertise. Written for search engines, not people. Disclose
AI assistance where relevant (Who/How/Why).

### 7. Cannibalization — BLOCK (or flag for consolidation)
Two pages targeting the same intent that will compete. Require consolidate /
differentiate / canonicalize before shipping both.

### 8. Cloaking & hidden text — BLOCK
Content shown to crawlers but not users, hidden text/links, sneaky redirects,
schema for invisible content. Always a violation.

### 9. Risky technical edits — REQUIRE confirmation
`noindex`, `robots.txt` disallows, canonical changes, redirects, and hreflang edits
can de-index a site if wrong. Require explicit human confirmation of intent and a
rollback note before applying to live pages.

### 10. Over-automation / no human in the loop — WARN/BLOCK
Mass automated publishing without review, auto-generated metadata at scale without
checks, or schema injected sitewide without per-type verification.

## Output

```
| Gate | Status | Evidence | Required fix |
```
End with an overall verdict: **SHIP** (all pass), or **DO NOT SHIP** with the
blocking list. If risky technical edits are involved, restate the rollback plan.

See [references/google-policies.md](references/google-policies.md) and
[scripts/lint.py](scripts/lint.py).
