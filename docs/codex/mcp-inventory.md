# MCP inventory — 1 November 2026

| Server | Configuration and source | Verified result | Scope/auth |
| --- | --- | --- | --- |
| chrome_devtools | Local chrome-devtools-mcp 1.12.0, ChromeDevTools official repository | Initialize, tool discovery, isolated local-page DOM read and saved performance trace passed. Heap/memory analysis tools are exposed; a full heap investigation was not performed in Phase 0. | Project config; no credentials; headless, temporary profile, usage statistics off, CrUX calls off. |
| context7 | Existing https://mcp.context7.com/mcp; upstash/context7 | Server 4.4.3 initialized; Next.js library resolution and query-docs returned documentation. | Public access worked; future quota/auth not guaranteed. Never send private source/keys in queries. |
| playwright | Existing @playwright/mcp 0.0.83 definition | Definition/version retained from prior setup; this Phase 0 validates CLI automation rather than claiming a fresh MCP interactive session. | Project; isolated headless profile; optional complementary interface. |
| Desktop-managed node/browser/app services | Existing managed configuration and connected tools | Already supplied by host; no global changes. | Host-owned; no new account permissions. |

Project TOML parsed successfully. Current projectless chat does not automatically advertise newly configured MCP servers. Reload/open the trusted `/home/j0hn/Projects/My-Portfolio-v2` project to refresh discovery; Phase 0 explicitly connected using an MCP SDK client to validate the servers now. The diagnostic client supplies a scoped workspace root for saved traces; unrestricted file access is not enabled. Browser launch uses the existing cached Chromium executable; update that path deliberately if browser installations change.

The CLI's initial project listing did not load these project definitions in this projectless/untrusted context. A configured server, verified standalone connection and an advertised current-chat tool are distinct states. No global trust or policy was changed.
