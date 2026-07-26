## Maqsad
Agent yaratish sahifasida `phase === "building"` bo'lgan vaqtda chap sidebarni yashirib, jonli preview maydoniga ko'proq joy berish.

## O'zgarish
`src/routes/agent-yaratish.tsx` — bitta fayl:

- `<aside>` (116-satr) `className`iga shart qo'shiladi: `phase === "building"` bo'lsa `hidden` klassi qo'llanadi, aks holda hozirgi `lg:flex` xatti-harakati saqlanadi.
- Top bar'dagi mobil wordmark (258-satr) va layout `lg:hidden` shartlariga tegilmaydi — sidebar yashirilganda ham asosiy joylashuv buzilmaydi, chunki `main` allaqachon `flex-1`.
- Ixtiyoriy: top bar'da kichik "Sidebar'ni ko'rsatish" tugmasi qo'shilmaydi (foydalanuvchi so'ramagan). "Hero" holatga qaytilganda (masalan, kelajakda) sidebar avtomatik qaytadi.

## Xulq-atvor
- Hero (promt kiritish) fazasi: sidebar oldingidek ko'rinadi.
- Building fazasi (promt yuborilgandan keyin): sidebar butunlay yashirin, preview + chat butun ekran kengligini oladi.

Boshqa fayllar va biznes-logika o'zgarmaydi.