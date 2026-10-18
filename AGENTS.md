<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep shift state and progress calculations in the existing shared shift module; presentation components consume it without duplicating persistence logic.
- Use global semantic CSS tokens and existing UI controls across shift-planner screens for consistent presentation and accessible interactions.
- Import the office-cat illustration as a bundled asset; it must not depend on an external image host.
- Keep CSAT library content and filtering in a separate browser-safe module; the existing topic route renders the library without changing shift state or public URLs.
- Keep unified library content and combined search in browser-safe library modules, reusing original CSAT memos; this preserves existing content and topic URLs.
- Use a separate browser storage key and shared hook for library favorites and recents; library actions must never mutate shift persistence.
- Reuse the same memo body and favorite controls for CSAT and the unified library; this keeps copying and saved-state behavior consistent across views.
