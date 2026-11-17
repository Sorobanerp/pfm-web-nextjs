#!/usr/bin/env python3
"""Falha se a cobertura de linhas for menor que --min. Formatos: xml (JaCoCo/Kover) e lcov."""
import argparse, sys
import xml.etree.ElementTree as ET

ap = argparse.ArgumentParser()
ap.add_argument("--format", choices=["xml", "lcov"], required=True)
ap.add_argument("--file", required=True)
ap.add_argument("--min", type=float, default=95.0)
a = ap.parse_args()

if a.format == "xml":
    root = ET.parse(a.file).getroot()
    c = [x for x in root.findall("counter") if x.get("type") == "LINE"]
    if not c:
        sys.exit("Relatório sem contador LINE: " + a.file)
    covered, missed = int(c[-1].get("covered")), int(c[-1].get("missed"))
    total = covered + missed
else:
    covered = total = 0
    for line in open(a.file, encoding="utf-8"):
        if line.startswith("LF:"):
            total += int(line[3:])
        elif line.startswith("LH:"):
            covered += int(line[3:])

pct = 100.0 * covered / total if total else 0.0
print(f"Cobertura de linhas: {pct:.2f}% ({covered}/{total}) - mínimo {a.min:.1f}%")
sys.exit(0 if pct >= a.min else 1)
