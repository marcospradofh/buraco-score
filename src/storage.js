import { defaultState } from "./scoring.js";

// Mesma chave da versão em HTML, para quem já tinha placar no aparelho não perder nada.
const STORAGE_KEY = "buraco-placar-v1";

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const s = JSON.parse(raw);
      const d = defaultState();
      return {
        teams: s.teams || d.teams,
        rules: { ...d.rules, ...(s.rules || {}) },
        rounds: s.rounds || [],
        wins: s.wins || [0, 0],
        winner: s.winner ?? null,
      };
    }
  } catch {
    // Sem armazenamento: segue em memória.
  }
  return defaultState();
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignora: o placar continua funcionando nesta sessão.
  }
}
