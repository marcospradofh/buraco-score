import { useState } from "react";
import { CARDS, countSum, roundScore, warnings } from "../scoring.js";
import { signed, TEAM_CLASS, toInt } from "../format.js";

const emptyDraft = () => ({ mesa: "", mao: "", limpas: 0, sujas: 0, bateu: false, morto: true });
const emptyCounts = () => Object.fromEntries(CARDS.map((c) => [c.key, 0]));

function toEntry(d) {
  return {
    mesa: Math.max(0, toInt(d.mesa)),
    mao: Math.max(0, toInt(d.mao)),
    limpas: Math.max(0, toInt(d.limpas)),
    sujas: Math.max(0, toInt(d.sujas)),
    bateu: d.bateu,
    morto: d.morto,
  };
}

function Stepper({ id, value, onChange, label, labelledBy }) {
  const set = (v) => onChange(Math.max(0, toInt(v)));
  return (
    <div className="stepper" role="group" aria-labelledby={labelledBy}>
      <button type="button" aria-label={`Menos ${label}`} onClick={() => set(toInt(value) - 1)}>−</button>
      <input
        type="number" id={id} min="0" inputMode="numeric" value={value}
        aria-label={labelledBy ? undefined : label} aria-labelledby={labelledBy}
        onChange={(ev) => set(ev.target.value)}
      />
      <button type="button" aria-label={`Mais ${label}`} onClick={() => set(toInt(value) + 1)}>+</button>
    </div>
  );
}

function PointsField({ id, label, value, onChange, counts, onCounts }) {
  const open = counts != null;
  const setCount = (key, n) => {
    const next = { ...counts, [key]: n };
    onCounts(next);
    onChange(String(countSum(next) || ""));
  };
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="with-btn">
        <input
          type="number" id={id} min="0" inputMode="numeric" placeholder="0" value={value}
          onChange={(ev) => {
            // Valor digitado à mão substitui a contagem.
            onCounts(null);
            onChange(ev.target.value);
          }}
        />
        <button
          type="button" aria-expanded={open}
          onClick={() => {
            if (open) return onCounts(null);
            onCounts(emptyCounts());
            onChange("");
          }}
        >
          Contar
        </button>
      </div>
      {open && (
        <div className="counter">
          {CARDS.map((card) => (
            <div className="counter-row" key={card.key}>
              <span>{card.label} <small>× {card.value}</small></span>
              <Stepper
                id={`${id}-${card.key}`} label={card.label} value={counts[card.key]}
                onChange={(n) => setCount(card.key, n)}
              />
            </div>
          ))}
          <div className="counter-foot">
            <span>Soma preenchida automaticamente</span>
            <button type="button" className="link" onClick={() => { onCounts(emptyCounts()); onChange(""); }}>
              Limpar contagem
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function EntryCard({ index, team, draft, setDraft, counts, setCounts, score }) {
  const set = (patch) => setDraft(patch);
  const f = (name) => `${name}-${index}`;
  return (
    <fieldset className={`entry ${TEAM_CLASS[index]}`} aria-label={team.name}>
      <div className="entry-head">
        <span className="name">{team.name}</span>
        <span className="live num">{signed(score)}</span>
      </div>
      <PointsField
        id={f("mesa")} label="Cartas na mesa (soma)" value={draft.mesa}
        onChange={(mesa) => set({ mesa })} counts={counts.mesa} onCounts={(c) => setCounts("mesa", c)}
      />
      <PointsField
        id={f("mao")} label="Cartas na mão (subtrai)" value={draft.mao}
        onChange={(mao) => set({ mao })} counts={counts.mao} onCounts={(c) => setCounts("mao", c)}
      />
      <div className="pair">
        <div className="field">
          <span className="label" id={`${f("limpas")}-l`}>Canastras limpas</span>
          <Stepper id={f("limpas")} label="canastras limpas" labelledBy={`${f("limpas")}-l`}
            value={draft.limpas} onChange={(limpas) => set({ limpas })} />
        </div>
        <div className="field">
          <span className="label" id={`${f("sujas")}-l`}>Canastras sujas</span>
          <Stepper id={f("sujas")} label="canastras sujas" labelledBy={`${f("sujas")}-l`}
            value={draft.sujas} onChange={(sujas) => set({ sujas })} />
        </div>
      </div>
      <div className="checks">
        <label className="check">
          <input type="checkbox" id={f("morto")} checked={draft.morto}
            onChange={(ev) => set({ morto: ev.target.checked })} /> Pegou o morto
        </label>
        <label className="check">
          <input type="checkbox" id={f("bateu")} checked={draft.bateu}
            onChange={(ev) => set({ bateu: ev.target.checked })} /> Bateu
        </label>
      </div>
    </fieldset>
  );
}

export default function RoundForm({ state, onSubmit }) {
  const [drafts, setDrafts] = useState(() => [emptyDraft(), emptyDraft()]);
  const [counts, setCounts] = useState(() => [{}, {}]);

  const entries = drafts.map(toEntry);
  const warn = warnings(entries, state.teams);

  const updateDraft = (i, patch) => {
    setDrafts((prev) => prev.map((d, j) => {
      if (j === i) return { ...d, ...patch };
      // Só uma dupla bate por rodada.
      if (patch.bateu) return { ...d, bateu: false };
      return d;
    }));
  };
  const updateCounts = (i, field, c) => {
    setCounts((prev) => prev.map((x, j) => (j === i ? { ...x, [field]: c } : x)));
  };

  const submit = (ev) => {
    ev.preventDefault();
    onSubmit(entries);
    setDrafts([emptyDraft(), emptyDraft()]);
    setCounts([{}, {}]);
  };

  return (
    <form className="round" onSubmit={submit} noValidate>
      <div className="round-head">
        <h2>Rodada {state.rounds.length + 1}</h2>
        <span className="note">Preencha as duas duplas e lance a rodada.</span>
      </div>
      <div className="entries">
        {state.teams.map((team, i) => (
          <EntryCard
            key={i} index={i} team={team} draft={drafts[i]}
            setDraft={(patch) => updateDraft(i, patch)}
            counts={counts[i]} setCounts={(field, c) => updateCounts(i, field, c)}
            score={roundScore(entries[i], state.rules)}
          />
        ))}
      </div>
      <div className="round-foot">
        <p className="warn" role="status">{warn.join(" ")}</p>
        <button type="submit" className="primary">Lançar rodada</button>
      </div>
    </form>
  );
}
