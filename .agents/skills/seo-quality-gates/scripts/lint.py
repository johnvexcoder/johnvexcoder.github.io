#!/usr/bin/env python3
"""Heuristic SEO quality linter for the seo-quality-gates skill.

Flags likely spam-policy / quality problems in a content draft or HTML before
publishing. Heuristics only — a human (or the agent) still applies judgment.

Usage:
    python lint.py page.html
    python lint.py article.md
    cat draft.txt | python lint.py -
"""
import re
import sys
from collections import Counter

STOP = set("the a an and or but for to of in on at by with from as is are be this "
           "that it you your we our they i de la el los las y o en con para por un "
           "una que se su lo al".split())


def read(arg):
    return sys.stdin.read() if arg == "-" else open(arg, encoding="utf-8").read()


def strip_html(t):
    t = re.sub(r"<script.*?</script>", " ", t, flags=re.DOTALL | re.IGNORECASE)
    t = re.sub(r"<style.*?</style>", " ", t, flags=re.DOTALL | re.IGNORECASE)
    return re.sub(r"<[^>]+>", " ", t)


def main():
    arg = sys.argv[1] if len(sys.argv) > 1 else "-"
    raw = read(arg)
    findings = []

    # --- structured-data smells (gate 1/2/3) ---
    if re.search(r"aggregateRating|\"review\"|reviewRating", raw):
        findings.append(("WARN", "review/rating markup present — confirm reviews are "
                                  "real, customer-provided, and shown on the page"))
    if re.search(r"FAQPage", raw):
        findings.append(("WARN", "FAQPage markup present — confirm every Q&A is genuine "
                                  "and visible on the page"))
    for ph in ("needs real data", "lorem ipsum", "placeholder", "TODO", "FIXME"):
        if ph.lower() in raw.lower():
            findings.append(("ERROR", f"placeholder text found: '{ph}'"))

    # --- hidden text / cloaking (gate 8) ---
    if re.search(r"(display\s*:\s*none|visibility\s*:\s*hidden|font-size\s*:\s*0|"
                 r"text-indent\s*:\s*-\d{3,})", raw, re.IGNORECASE):
        findings.append(("WARN", "hidden-text CSS detected — ensure no content is "
                                  "hidden from users to manipulate ranking (cloaking)"))

    # --- keyword stuffing (gate 4) ---
    text = strip_html(raw).lower()
    words = re.findall(r"[a-záéíóúñ']{3,}", text)
    total = len(words)
    if total >= 200:
        counts = Counter(w for w in words if w not in STOP)
        for word, n in counts.most_common(5):
            density = n / total
            if density > 0.04:
                findings.append(("WARN", f"possible keyword stuffing: '{word}' is "
                                          f"{density*100:.1f}% of body ({n}/{total})"))
    # city/keyword list smell: long comma runs of capitalized words
    if re.search(r"(?:[A-Z][a-z]+,\s*){6,}", strip_html(raw)):
        findings.append(("WARN", "long comma-separated list (cities/keywords?) — "
                                  "check for doorway/stuffing pattern"))

    # --- thin content (gate 5) ---
    if 0 < total < 150:
        findings.append(("WARN", f"thin content: only {total} body words — confirm the "
                                  "page has real, original value"))

    # --- report ---
    errors = [f for f in findings if f[0] == "ERROR"]
    if not findings:
        print("No heuristic issues found. Human judgment still required on "
              "experience/expertise, intent match, and cannibalization.")
    else:
        for level, msg in findings:
            print(f"{level:5} {msg}")
    print(f"\nBody words analyzed: {total}")
    sys.exit(1 if errors else 0)


if __name__ == "__main__":
    main()
