## Muammo

Hozirgi `src/routes/agent-yaratish.tsx` da chap tomonda "Agent preview card" oldindan qattiq (hardcoded) qilib chizilgan: agent nomi, tavsifi, tool badge'lari, "Sinab ko'rish" tugmasi. Bu noto'g'ri — chunki foydalanuvchi qanday promt yozishini va Agentus AI qanday agent yaratishini oldindan bilmaymiz. Preview'ni oldindan dizayn qilib bo'lmaydi.

## Yechim

Chap tomondagi Preview panelni "bo'sh sahna" (canvas) ko'rinishiga o'tkazamiz — frontend uni oldindan chizmaydi. U yerda faqat holat ko'rsatiladi:

- **Hero fazasi (promt yozilmagan)**: chap panel yo'q, faqat markazda promt qutisi (hozirgidek qoladi).
- **Building fazasi (promt yuborilgandan keyin)**:
  - Chap: bo'sh preview sahna + jonli status ("Agentus Brain ishlayapti…", oddiy shimmer/loading indikator). Hech qanday soxta agent kartochkasi, tool badge yoki "Sinab ko'rish" tugmasi yo'q.
  - O'ng: chat panel (hozirgidek).
- **Ready fazasi (AI javob tugagach)**: chap panelda AI qaytargan haqiqiy natija render qilinadi. Hozircha bu maydon dinamik bo'sh joy sifatida qoladi (masalan "Natija shu yerda paydo bo'ladi" placeholder yoki keyingi bosqichda backend ulanganda to'ldiriladi).

## O'zgarishlar

`src/routes/agent-yaratish.tsx`:
1. `AgentPreviewCard` (yoki shunga o'xshash oldindan chizilgan komponent) — o'chiriladi.
2. Chap panel oddiy `PreviewStage` bo'ladi: markazda status matni + subtle loading animatsiyasi (Agentus qora fon + qizil nur estetikasida).
3. Tool badge'lari, agent nomi, "Sinab ko'rish", "Sozlash" kabi statik UI elementlar olib tashlanadi.
4. Chat panel (o'ng) va yuqoridagi Share/Publish tugmalari o'zgarishsiz qoladi.
5. Ishlatilmay qolgan importlar va state (`selectedTools`, `agentName` dan preview uchun ishlatilgan qismlar) tozalanadi — lekin chatda kerak bo'lsa saqlanadi.

## Natija

Chap tomon "jonli natija maydoni" bo'ladi — hozircha bo'sh/statuslik, keyinchalik haqiqiy AI natijasi bilan to'ldiriladi. Frontend endi hech narsani soxta ko'rsatmaydi.
