// Pro obuna holati — hozircha localStorage'da simulyatsiya qilinadi
// (backend hali ulanmagan). Real backend ulangach, bu qatlam
// server orqali tekshiruvga almashadi.
const PRO_KEY = "agentus:pro-active";

export function isProActive(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(PRO_KEY) === "1";
  } catch {
    return false;
  }
}

export function setProActive(active: boolean) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PRO_KEY, active ? "1" : "0");
  } catch {
    /* ignore */
  }
}
