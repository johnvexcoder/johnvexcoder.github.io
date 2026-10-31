# Geographic asset credits

The decorative About globe uses Natural Earth 1:110m land geography, redistributed in world-atlas 2.0.2. Coastal rings are simplified for a small on-screen globe; this is a recognizable geographic illustration, not a navigational map or live network monitor.

- Source data: https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/land-110m.json
- Publisher/reference: https://github.com/topojson/world-atlas
- Natural Earth data is public domain: https://www.naturalearthdata.com/about/terms-of-use/
- World Atlas distribution license is retained at public/illustrations/world-atlas-LICENSE.txt.

The shared coastline/land-point dataset generates both the orthographic canvas world and the still SVG fallback. Latitude/longitude are converted to unit vectors once; visible coastlines, projected network paths and particles are drawn at a bounded frame rate. Skill glyphs reuse the existing local SVG assets and their original asset/license records. No runtime map provider or external texture is contacted.
