## Maqsad
`/agent-yaratish` sahifasidagi **Publish** tugmasi bosilganda modal (kichik oyna) ochilib, foydalanuvchi agent ma'lumotlarini kiritadi. "Yaratish" bosilganda agent `agentus:agents` localStorage'ga saqlanadi va `/agentlarim`da paydo bo'ladi.

## O'zgarishlar

### 1. `src/routes/agent-yaratish.tsx`
- Yangi state: `publishOpen: boolean`, `publishForm: { name, description, iconEmoji, iconFile?, category }`, `iconPreviewUrl`.
- **Publish** tugmasiga `onClick={() => setPublishOpen(true)}` — tugmani `disabled`dan olib tashlash.
- Modal komponenti (sahifa ichida, o'ng-yuqori porta emas, ekran markazida overlay bilan):
  - **Sarlavha**: "Agentni chop etish"
  - **Maydonlar**:
    - Agent nomi (text, majburiy)
    - Qisqa tavsif (textarea, majburiy)
    - Ikonka: `<input type="file" accept="image/*">` — FileReader orqali data URL, yoki emoji tanlash chipi (default 🤖)
    - Kategoriya (select: Communication / Data / Automation / AI / Files)
    - Toollar (readonly ko'rsatish — hozircha bo'sh yoki `[]`)
  - **Tugmalar**: "Bekor qilish" + "Yaratish" (primary)
- "Yaratish" bosilganda:
  - Validatsiya (nom + tavsif bo'sh emas)
  - `SavedAgent` shakliga moslashtirib obyekt yaratish: `{ id: Date.now(), name, description, iconUrl?, category, createdAt, status: "active", tools: [] }`
  - `agentus:agents` localStorage'ga qo'shish (mavjudlarni o'qib, boshiga qo'shish)
  - Toast/success chip, modalni yopish, `useNavigate` orqali `/agentlarim`ga o'tish

### 2. `src/routes/agentlarim.tsx`
- `SavedAgent` type'iga ixtiyoriy `iconUrl?: string` va `category?: string` maydonlarini qo'shish (mavjud yozuvlar buzilmasin).
- Agent kartochkasi ikonka render qiladigan joyda: agar `iconUrl` bo'lsa `<img>` ko'rsatish, aks holda hozirgi default.

## Ko'lam tashqarisida
- Backend/AI integratsiyasi yo'q — barchasi localStorage.
- Marketplace'ga publish qilish yo'q — faqat "Mening agentlarim" ro'yxatiga.
- Share tugmasi tegilmaydi.