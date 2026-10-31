#!/usr/bin/env python3
"""Flag risky SEO changes in a unified diff.

Use this before publishing or opening a PR that changes SEO-sensitive files or
markup. It is a pre-check: human review and a rollback plan are still required
for risky changes.

Usage:
    git diff | python diff_gate.py -
    python diff_gate.py patch.diff

Exit codes:
    0 = no blocking risky change detected
    1 = risky change detected; human approval and rollback plan required
"""
import re
import sys
from typing import List

RISK_PATTERNS = [
    ("robots_txt", re.compile(r"(^\+.*User-agent:|^\+.*Disallow:|^\+.*Allow:|robots\.txt)", re.I | re.M)),
    ("noindex", re.compile(r"^\+.*(noindex|X-Robots-Tag)", re.I | re.M)),
    ("canonical", re.compile(r"^\+.*rel=[\"']canonical[\"']|^\+.*canonical", re.I | re.M)),
    ("redirect", re.compile(r"^\+.*(redirect|RewriteRule|RewriteCond|return\s+301|return\s+302)", re.I | re.M)),
    ("hreflang", re.compile(r"^\+.*hreflang", re.I | re.M)),
    ("sitemap", re.compile(r"sitemap|^\+.*<loc>", re.I | re.M)),
    ("structured_data", re.compile(r"^\+.*application/ld\+json|^\+.*@type|^\+.*aggregateRating|^\+.*reviewRating", re.I | re.M)),
    ("hidden_text", re.compile(r"^\+.*(display\s*:\s*none|visibility\s*:\s*hidden|font-size\s*:\s*0|text-indent\s*:\s*-\d{3,})", re.I | re.M)),
]

HIGH_RISK_TYPES = {
    "robots_txt",
    "noindex",
    "canonical",
    "redirect",
    "hreflang",
    "structured_data",
    "hidden_text",
}


def read_input(path: str) -> str:
    return sys.stdin.read() if path == "-" else open(path, encoding="utf-8").read()


def main() -> int:
    path = sys.argv[1] if len(sys.argv) > 1 else "-"
    diff = read_input(path)
    findings: List[str] = []
    blockers: List[str] = []

    for name, pattern in RISK_PATTERNS:
        if pattern.search(diff):
            msg = f"{name}: SEO-sensitive change detected"
            findings.append(msg)
            if name in HIGH_RISK_TYPES:
                blockers.append(msg)

    if not findings:
        print("PASS no SEO-sensitive diff patterns detected. Human review still recommended.")
        return 0

    for finding in findings:
        level = "BLOCK" if finding in blockers else "WARN"
        print(f"{level} {finding}")

    if blockers:
        print("\nDO_NOT_SHIP until a human confirms intent and a rollback plan is documented.")
        return 1

    print("\nWARN review recommended before shipping.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
