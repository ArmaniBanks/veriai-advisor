
Goal: make the app feel “awake” instead of forcing the first user action to hit the full inference path cold.

What I found
- The page itself is already renderable; the fragile part is the `analyze` edge function path.
- `src/components/QueryDemo.tsx` only calls the heavy `analyze` function when the user presses Send.
- `supabase/functions/analyze/index.ts` has no lightweight health/warmup route, so the first request always does the full wallet/RPC/contract flow.
- There is no frontend timeout, retry, or “warming up backend” state, so the app can feel stuck when the function is cold or the chain call is slow.

Plan
1. Add a lightweight warmup/health path to the edge function
- Update `supabase/functions/analyze/index.ts` to support a cheap request mode such as:
  - `GET` health check, or
  - `POST { mode: "warmup" }`
- In that mode, only verify essentials:
  - function is reachable
  - `OG_PRIVATE_KEY` exists
  - RPC client can initialize / optionally fetch chain id or latest block
- Return a small JSON payload like:
  - `{ status: "ready" | "degraded", walletConfigured: boolean, chainReachable: boolean }`
- Do not run inference during warmup.

2. Wake the backend automatically from the UI
- In `src/components/QueryDemo.tsx`, trigger warmup on mount.
- Track a small status state:
  - `idle`
  - `waking`
  - `ready`
  - `degraded`
- While waking, show a subtle status row above or below the textarea:
  - “Waking up verifiable inference backend…”
- If warmup succeeds, change to:
  - “Backend ready”
- If warmup is degraded, still allow Send but explain that first request may be slower or fallback-only.

3. Add a manual “Wake app” retry control
- Add a small secondary button near the query box for manual retry if warmup fails.
- Reuse the same warmup function instead of mixing it with the real analyze flow.

4. Make Send more resilient
- Keep Send disabled only while the actual analyze request is running, not permanently after a failed warmup.
- Wrap the analyze call with:
  - client-side timeout handling
  - clearer error messaging for cold starts / temporary backend unavailability
- If warmup is still running, either:
  - queue Send after warmup finishes, or
  - allow Send but show “Backend is still waking up…”

5. Preserve existing fallback UX
- Keep the current `tx_hash === null` banner in `src/pages/Index.tsx`.
- Expand the wording slightly so users can distinguish:
  - backend waking / temporary availability issue
  - unfunded devnet wallet / no on-chain verification

Technical details
```text
Page load
  -> warmup request
      -> edge function health path
          -> check secret + RPC reachability
          -> return ready/degraded
  -> UI status updates

User clicks Send
  -> real analyze request
      -> existing inference logic
      -> tx_hash or fallback
```

Files to update
- `supabase/functions/analyze/index.ts`
- `src/components/QueryDemo.tsx`
- optionally `src/pages/Index.tsx` for slightly clearer degraded-state messaging

Expected outcome
- The app starts “warming” as soon as the page loads.
- Users see backend readiness before pressing Send.
- The first interaction feels responsive instead of broken.
- Slow cold starts and temporary backend issues become understandable, not silent failures.

Validation after implementation
- Load the page and confirm warmup starts automatically.
- Confirm the UI shows ready/degraded state before Send.
- Verify Send still works after warmup.
- Verify degraded cases still surface the existing `tx_hash: null` banner cleanly.
