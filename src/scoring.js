export const CARDS = [
  { key: "as", label: "Ás", value: 15 },
  { key: "dois", label: "2 (curinga)", value: 10 },
  { key: "alta", label: "K a 8", value: 10 },
  { key: "baixa", label: "7 a 3", value: 5 },
];

export const DEFAULT_NAMES = ["Nós", "Eles"];

export function defaultState() {
  return {
    teams: [
      { name: DEFAULT_NAMES[0], players: "" },
      { name: DEFAULT_NAMES[1], players: "" },
    ],
    rules: { target: 3000, limpa: 200, suja: 100, batida: 100, morto: -100 },
    rounds: [],
    wins: [0, 0],
    winner: null,
  };
}

export function blankEntry() {
  return { mesa: 0, mao: 0, limpas: 0, sujas: 0, bateu: false, morto: true };
}

// Pontuação de uma dupla em uma rodada.
export function roundScore(e, rules) {
  return (e.mesa || 0) - (e.mao || 0)
    + (e.limpas || 0) * rules.limpa
    + (e.sujas || 0) * rules.suja
    + (e.bateu ? rules.batida : 0)
    + (e.morto ? 0 : rules.morto);
}

export function totals(state) {
  const t = [0, 0];
  for (const r of state.rounds) {
    t[0] += roundScore(r[0], state.rules);
    t[1] += roundScore(r[1], state.rules);
  }
  return t;
}

export function countSum(counts) {
  return CARDS.reduce((sum, card) => sum + (counts[card.key] || 0) * card.value, 0);
}

// Avisos de rodada improvável; não impedem o lançamento.
export function warnings(entries, teams) {
  const w = [];
  if (!entries.some((e) => e.bateu)) w.push("Ninguém bateu nesta rodada?");
  entries.forEach((e, i) => {
    const nome = teams[i].name;
    if (e.bateu && e.limpas === 0) w.push(`${nome} bateu sem canastra limpa.`);
    if (e.bateu && !e.morto) w.push(`${nome} bateu sem pegar o morto.`);
    if (e.bateu && e.mao > 0) w.push(`${nome} bateu mas tem cartas na mão.`);
  });
  return w;
}

// Recalcula o vencedor depois de qualquer mudança em rodadas ou regras.
// Desfaz a vitória anterior antes, para não contar a mesma partida duas vezes.
export function settleWinner(state) {
  const wins = [...state.wins];
  if (state.winner != null) wins[state.winner] = Math.max(0, wins[state.winner] - 1);
  let winner = null;
  const t = totals(state);
  const { target } = state.rules;
  if ((t[0] >= target || t[1] >= target) && t[0] !== t[1]) {
    winner = t[0] > t[1] ? 0 : 1;
    wins[winner] += 1;
  }
  return { ...state, wins, winner };
}

export function addRound(state, entries) {
  if (state.winner != null) return state;
  return settleWinner({ ...state, rounds: [...state.rounds, entries] });
}

export function removeRound(state, index) {
  return settleWinner({ ...state, rounds: state.rounds.filter((_, i) => i !== index) });
}

export function newGame(state) {
  const wins = [...state.wins];
  return { ...state, rounds: [], winner: null, wins };
}
