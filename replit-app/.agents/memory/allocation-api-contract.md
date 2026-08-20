---
name: Allocation API contract compatibility
description: Notes the workspace's current OpenAPI-to-Zod compatibility constraint for future endpoint changes.
---

The generated API validation package currently uses Zod 3, so OpenAPI schemas should use `type: number` rather than `type: integer`, and avoid `format: email` when generating request/response validators.

**Why:** The installed generator emits Zod 4-only helpers (`zod.int()` and `zod.email()`) for those OpenAPI features, which breaks the workspace library typecheck.

**How to apply:** When extending the allocation API, keep numeric identifiers and counts as `number` in the OpenAPI source unless the workspace's Zod dependency is upgraded and codegen output is verified.