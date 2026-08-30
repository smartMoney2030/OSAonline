---
name: Persistent uploaded media
description: Why user-uploaded media must use durable object storage in this project.
---

Admin-uploaded images and other media must be stored in App Storage, with only stable serving paths saved in PostgreSQL. Do not reintroduce runtime-local upload folders for persistent content.

**Why:** Published runtimes can be replaced, which removes files written to their local filesystem while leaving database URLs pointing to missing images.

**How to apply:** Any future admin or public upload flow should request a protected presigned upload URL, upload bytes directly to App Storage, and save the resulting stable object path.