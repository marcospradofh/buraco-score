import { fmt, TEAM_CLASS } from "../format.js";

export default function Board({ state, totals }) {
  const { target } = state.rules;
  const lead = totals[0] === totals[1] ? -1 : totals[0] > totals[1] ? 0 : 1;

  return (
    <section className="board" aria-live="polite">
      {state.teams.map((team, i) => {
        const pct = Math.max(0, Math.min(100, (totals[i] / target) * 100));
        const falta = target - totals[i];
        const classes = ["score", TEAM_CLASS[i], lead === i && state.rounds.length ? "lead" : ""];
        return (
          <article key={i} className={classes.join(" ").trim()}>
            <div className="name">{team.name}</div>
            {team.players && <div className="players">{team.players}</div>}
            <div className={`total num${totals[i] < 0 ? " neg" : ""}`}>{fmt(totals[i])}</div>
            <div className="bar" aria-hidden="true">
              <span style={{ width: `${pct.toFixed(1)}%` }} />
            </div>
            <div className="meta num">
              <span>{falta > 0 ? `Faltam ${fmt(falta)}` : "Meta batida"}</span>
              <span>Partidas: {state.wins[i]}</span>
            </div>
          </article>
        );
      })}
    </section>
  );
}
