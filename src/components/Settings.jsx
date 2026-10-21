import { useState } from "react";
import { DEFAULT_NAMES } from "../scoring.js";
import { toInt } from "../format.js";

const RULES = [
  ["target", "Partida termina em"],
  ["batida", "Batida"],
  ["limpa", "Canastra limpa"],
  ["suja", "Canastra suja"],
  ["morto", "Não pegou o morto"],
];

export default function Settings({ state, onTeams, onRules, onNewGame, onReset }) {
  const [confirm, setConfirm] = useState(null);
  // Texto dos campos de regra fica local para aceitar "" ou "-" enquanto a pessoa digita.
  const [ruleText, setRuleText] = useState(() => Object.fromEntries(RULES.map(([k]) => [k, String(state.rules[k])])));
  const [names, setNames] = useState(() => state.teams.map((t) => ({ ...t })));

  const setTeam = (i, field, value) => {
    const next = names.map((t, j) => (j === i ? { ...t, [field]: value } : t));
    setNames(next);
    onTeams(next.map((t, j) => ({
      name: t.name.trim() || DEFAULT_NAMES[j],
      players: t.players.trim(),
    })));
  };

  const setRule = (key, text) => {
    setRuleText((prev) => ({ ...prev, [key]: text }));
    if (text === "" || text === "-") return;
    const v = toInt(text);
    if (key === "target" && v <= 0) return;
    onRules({ ...state.rules, [key]: v });
  };

  const ask = (text, action) => setConfirm({ text, action });

  return (
    <details className="panel">
      <summary>Duplas e regras</summary>
      <div className="panel-body">
        <div className="grid-2">
          {[0, 1].map((i) => (
            <div className="field" key={`n${i}`}>
              <label htmlFor={`name-${i}`}>Nome da dupla {i + 1}</label>
              <input type="text" id={`name-${i}`} maxLength={30} value={names[i].name}
                onChange={(ev) => setTeam(i, "name", ev.target.value)} />
            </div>
          ))}
          {[0, 1].map((i) => (
            <div className="field" key={`p${i}`}>
              <label htmlFor={`players-${i}`}>Jogadores da dupla {i + 1}</label>
              <input type="text" id={`players-${i}`} maxLength={50} value={names[i].players}
                placeholder={i === 0 ? "Ex.: Ana e Beto" : "Ex.: Caio e Duda"}
                onChange={(ev) => setTeam(i, "players", ev.target.value)} />
            </div>
          ))}
        </div>
        <div className="grid-2">
          {RULES.map(([key, label]) => (
            <div className="field" key={key}>
              <label htmlFor={`rule-${key}`}>{label}</label>
              <input type="number" id={`rule-${key}`} inputMode="numeric" step={key === "target" ? 100 : 1}
                value={ruleText[key]} onChange={(ev) => setRule(key, ev.target.value)} />
            </div>
          ))}
        </div>
        <p className="note">As regras valem para toda a partida e recalculam as rodadas já lançadas.</p>
        <div className="actions">
          <button type="button" onClick={() => ask(
            "Apagar as rodadas e começar outra partida? As partidas vencidas continuam contando.", onNewGame,
          )}>
            Nova partida
          </button>
          <button type="button" className="danger" onClick={() => ask(
            "Apagar tudo: rodadas, partidas vencidas, nomes e regras?",
            () => {
              const fresh = onReset();
              setNames(fresh.teams.map((t) => ({ ...t })));
              setRuleText(Object.fromEntries(RULES.map(([k]) => [k, String(fresh.rules[k])])));
            },
          )}>
            Zerar tudo
          </button>
        </div>
        {confirm && (
          <div className="confirm">
            <span>{confirm.text}</span>
            <button type="button" className="primary" autoFocus
              onClick={() => { confirm.action(); setConfirm(null); }}>
              Confirmar
            </button>
            <button type="button" onClick={() => setConfirm(null)}>Cancelar</button>
          </div>
        )}
      </div>
    </details>
  );
}
