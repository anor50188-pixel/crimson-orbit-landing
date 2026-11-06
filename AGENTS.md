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

- Keep the marketing landing page as flat section components with page-scoped CSS tokens and lightweight CSS/RAF animation; this preserves the existing application theme and makes later template porting straightforward.
- Keep marketing tariffs and roadmap values in a browser-safe data module; the landing shows proposals, never grants subscriptions or simulates backend features.
- Keep the agent-builder prototype self-contained with page-scoped tokens, local React state and lightweight CSS motion; it uses the uploaded static mock flow and makes no API calls.
