import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "public/**",
    "tests/fixtures/**",
    "next-env.d.ts",
  ]),
  {
    files: [
      "components/Header.tsx",
      "components/ReviewForm.tsx",
      "hooks/useIntroPlayback.ts",
      "hooks/useMedia.ts",
    ],
    rules: {
      // Existing effects reconcile client-only storage, bootstrap state, media preferences,
      // and CAPTCHA reset. Preserve their bounded lifecycle rather than rewriting it for SEO.
      "react-hooks/set-state-in-effect": "off",
    },
  },
  {
    files: [
      "components/Hero.tsx",
      "components/Preview.tsx",
      "components/Projects.tsx",
      "components/Testimonials.tsx",
    ],
    rules: {
      // Static export: explicit responsive hero assets and measured native screenshot refs.
      "@next/next/no-img-element": "off",
    },
  },
]);
