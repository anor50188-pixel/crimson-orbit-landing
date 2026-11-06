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
- Share the workspace cosmos and knowledge carousel as presentation components; draw star layers once and animate transforms with RAF, preserving reduced-motion and the local prototype boundary.
- Keep dashboard glass/elevation styling scoped to the workspace and reuse its command palette for local navigation; this preserves other page themes and the prototype boundary.
- All UI copy uses typed dictionary keys in src/i18n; add Uzbek, Russian and English entries together and run i18n:check so missing translations cannot ship unnoticed.
- Keep route objects stable and translate presentation data at render time; persisted user input and internal state IDs must never change with locale.
- Reuse CosmicEnding and continuous WorkspaceCosmos for scrolling pages; approved top-stage composition remains independent of lower-page atmosphere.
- Keep SSR locale fixed to Uzbek and restore the browser language after hydration; deferred routes use the provider snapshot to avoid translated hydration mismatches.
