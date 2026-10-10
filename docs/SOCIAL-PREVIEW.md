# Hero-branded sharing image

The 1200 × 630 public/social.png uses the Hero's actual portrait, bundled Adwaita fonts, black/navy palette, blue accent, oversized J0hnvexcoder wordmark, network backdrop and “From interface to infrastructure.” hierarchy. The About philosophy remains in About.

Regenerate with npm run prepare:social. The full asset preparation script also uses this generator, so it cannot revert the branded image to the earlier portrait-only artwork. No raster AI, synthetic portrait or new external font dependency is used.

Production export and social metadata checks passed. The image is included in out/social.png, and homepage Open Graph/Twitter metadata points to https://johnvexcoder.github.io/social.png. Sharing bots can fetch the new image only after a future approved deployment; existing previews can remain cached.
