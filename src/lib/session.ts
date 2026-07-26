export type Role = "investigator" | "analyst" | "supervisor" | "policymaker";

const KEY = "sentinel:role";

export const roleMeta: Record<Role, { label: string; kn: string; desc: string; badge: string }> = {
  investigator: { label: "Investigator", kn: "ತನಿಖಾಧಿಕಾರಿ", desc: "Full FIR + accused, case timelines", badge: "SI · Zone 4" },
  analyst: { label: "Analyst", kn: "ವಿಶ್ಲೇಷಕ", desc: "Patterns, hotspots, network clusters", badge: "Crime Analytics" },
  supervisor: { label: "Supervisor", kn: "ಮೇಲ್ವಿಚಾರಕ", desc: "Team view + tamper-evident audit", badge: "DCP · South" },
  policymaker: { label: "Policymaker", kn: "ನೀತಿ ನಿರೂಪಕ", desc: "Forecasts + resource simulator", badge: "State HQ" },
};

export function getRole(): Role | null {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(KEY);
  return v && v in roleMeta ? (v as Role) : null;
}

export function setRole(r: Role) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, r);
}

export function clearRole() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}