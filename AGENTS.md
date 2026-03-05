# Runtime Verification Rule

- For any code change, run launch-level verification before final response:
  - `bash scripts/verify-runtime.sh`
- If `node` is missing in PATH, use the local Windows Node binary fallback already handled by `scripts/verify-runtime.sh`.
- Report pass/fail status in the final message.
