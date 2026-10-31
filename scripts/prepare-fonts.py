"""Optional asset authoring: requires fonttools[woff]; release builds use checked-in files."""
from pathlib import Path
from fontTools import subset
from fontTools.ttLib import TTFont
import json

# Latin, extended Latin, common punctuation/currency/arrows, plus actual source characters.
characters = set(range(0x20, 0x250)) | set(range(0x1E00, 0x1F00)) | set(range(0x2000, 0x2070)) | set(range(0x20A0, 0x20D0)) | set(range(0x2190, 0x2200))
for folder, pattern in [("content", "*.json"), ("components", "*.tsx"), ("app", "*.tsx")]:
    for file in Path(folder).rglob(pattern):
        characters.update(map(ord, file.read_text()))
report = []
for name in ["SignatureSans", "SignatureMono"]:
    original = Path(f"public/fonts/{name}.woff2")
    output = original.with_name(name + "-latin.woff2")
    font = TTFont(original)
    available = set(font.getBestCmap())
    options = subset.Options()
    options.flavor = "woff2"
    options.layout_features = ["*"]
    options.recalc_timestamp = False
    processor = subset.Subsetter(options=options)
    processor.populate(unicodes=characters)
    processor.subset(font)
    font.flavor = "woff2"
    font.save(output)
    result = TTFont(output)
    assert (characters & available) <= set(result.getBestCmap())
    report.append({"font": name, "originalBytes": original.stat().st_size, "subsetBytes": output.stat().st_size, "glyphs": len(result.getBestCmap())})
Path("docs/seo/FONT-ASSETS.json").write_text(json.dumps(report, indent=2) + "\n")
print(json.dumps(report, indent=2))
