export const plannedPlans = [
  { name: "Freemium", price: 0, agents: 2, tools: 2, requests: 500, scheduled: false },
  { name: "Pro", price: 19, agents: 10, tools: 5, requests: 5000, scheduled: true },
  { name: "Pro Max", price: 49, agents: null, tools: null, requests: 25000, scheduled: true },
] as const;

export const roadmapStages = [
  { letter: "A", title: "Agent yaratish va ishlatish", badge: "Hozir · ishlab chiqilmoqda", items: ["Agent, tool va AI jamoalar", "3 tilda platforma", "Talabalar va biznes uchun shablonlar", "Maqsad: 500+ foydalanuvchi"] },
  { letter: "B", title: "Bozor va savdo", badge: "Keyingi bosqich", items: ["Marketplace faoliyati", "Agent sotish va 25% komissiya", "Onlayn to'lovlar", "Maqsad: 10 000+ foydalanuvchi"] },
  { letter: "C", title: "Mintaqa lideri", badge: "Kelajak maqsadi", items: ["O'zbekiston va Markaziy Osiyo bozori", "Korporativ mijozlar", "Maqsad: #1 Markaziy Osiyo AI platformasi"] },
] as const;