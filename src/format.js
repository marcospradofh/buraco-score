export const fmt = (n) => n.toLocaleString("pt-BR");
export const signed = (n) => (n > 0 ? "+" : n < 0 ? "−" : "") + fmt(Math.abs(n));
export const toInt = (v) => {
  const n = parseInt(v, 10);
  return Number.isNaN(n) ? 0 : n;
};
export const TEAM_CLASS = ["team-a", "team-b"];
