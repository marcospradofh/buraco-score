import { useEffect, useState } from "react";
import { roundScore } from "../scoring.js";
import { fmt, signed } from "../format.js";

function detail(e) {
  const parts = [`mesa ${fmt(e.mesa)}`];
  if (e.mao) parts.push(`mão −${fmt(e.mao)}`);
  if (e.limpas) parts.push(`${e.limpas} limpa${e.limpas > 1 ? "s" : ""}`);
  if (e.sujas) parts.push(`${e.sujas} suja${e.sujas > 1 ? "s" : ""}`);
  if (e.bateu) parts.push("bateu");
  if (!e.morto) parts.push("sem morto");
  return parts.join(" · ");
}

export default function History({ state, onDelete }) {
  // Apagar pede um segundo toque em até 4 segundos.
  const [armed, setArmed] = useState(null);
  useEffect(() => {
    if (armed == null) return undefined;
    const t = setTimeout(() => setArmed(null), 4000);
    return () => clearTimeout(t);
  }, [armed]);

  if (!state.rounds.length) {
    return (
      <div className="table-wrap">
        <p className="empty">
          Nenhuma rodada lançada ainda. A primeira aparece aqui com o detalhe de mesa, mão, canastras e batida.
        </p>
      </div>
    );
  }

  const run = [0, 0];
  const rows = state.rounds.map((r, idx) => {
    const a = roundScore(r[0], state.rules);
    const b = roundScore(r[1], state.rules);
    run[0] += a;
    run[1] += b;
    return { idx, r, a, b, tot: [...run] };
  }).reverse();

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>{state.teams[0].name}</th>
            <th>{state.teams[1].name}</th>
            <th>Placar</th>
            <th><span hidden>Ações</span></th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ idx, r, a, b, tot }) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              <td><span className="pts">{signed(a)}</span><span className="detail">{detail(r[0])}</span></td>
              <td><span className="pts">{signed(b)}</span><span className="detail">{detail(r[1])}</span></td>
              <td className="tot">{fmt(tot[0])} × {fmt(tot[1])}</td>
              <td className="act">
                <button
                  type="button"
                  className={`link${armed === idx ? " danger" : ""}`}
                  onClick={() => {
                    if (armed === idx) {
                      setArmed(null);
                      onDelete(idx);
                    } else {
                      setArmed(idx);
                    }
                  }}
                >
                  {armed === idx ? "Confirmar?" : "Apagar"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
