# Google spam policies — what these gates enforce

The gates map to Google Search's official spam policies and structured-data
guidelines. Summary of the relevant policies (see source links):

- **Scaled content abuse** — generating many pages primarily for ranking, with
  little value to users (including unreviewed bulk AI output). Prohibited.
- **Doorway pages** — sites/pages created to rank for similar queries that funnel
  users to the same destination (e.g. near-duplicate city pages). Prohibited.
- **Thin affiliate / low-value content** — pages without original value.
- **Keyword stuffing** — loading pages with keywords/numbers/city lists to
  manipulate ranking. Prohibited.
- **Cloaking** — showing different content to users vs. search engines. Prohibited.
- **Hidden text and links** — content hidden to manipulate ranking. Prohibited.
- **Sneaky redirects** — sending users somewhere other than what they expected.
- **Structured-data spam** — markup that is invisible, irrelevant, misleading, or
  fabricated (fake reviews/ratings, marked-up content not on the page). Can trigger
  manual actions and loss of rich-result eligibility.
- **Misleading / fabricated content** — invented facts, fake authorship. Conflicts
  with E-E-A-T and helpful-content guidance.

Sources:
- Google Search spam policies:
  https://developers.google.com/search/docs/essentials/spam-policies
- Structured data general guidelines:
  https://developers.google.com/search/docs/appearance/structured-data/sd-policies
- Creating helpful, reliable, people-first content:
  https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Review snippet guidelines (self-serving reviews not eligible):
  https://developers.google.com/search/docs/appearance/structured-data/review-snippet

## Why a hard gate for AI agents specifically

An LLM asked to "improve SEO" will, by default, helpfully *produce* — and that
includes producing plausible-looking reviews, ratings, FAQs, stats, and city
pages. Each of those is a policy violation that can cause a manual action or
de-indexing. The cost of a fabricated rich result is far higher than the benefit.
This skill exists to make refusal the default, not the exception.

## Risk tiers for technical edits

| Edit | Worst case if wrong | Require before applying |
|------|---------------------|--------------------------|
| `noindex` / robots disallow | whole sections de-indexed | confirm intent + rollback |
| canonical change | wrong URL consolidated, traffic lost | confirm intent |
| redirect | chains/loops, lost equity, bad UX | map + test |
| hreflang | wrong-language pages served | reciprocity check |

Never apply these silently at scale. Human confirmation is part of the gate.
