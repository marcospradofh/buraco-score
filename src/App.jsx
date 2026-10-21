import { useEffect, useRef, useState } from "react";
import Board from "./components/Board.jsx";
import RoundForm from "./components/RoundForm.jsx";
import History from "./components/History.jsx";
import Settings from "./components/Settings.jsx";
import { OfflinePanel, OfflinePill, UpdateBanner, useOffline } from "./components/OfflinePanel.jsx";
import { addRound, defaultState, newGame, removeRound, settleWinner, totals } from "./scoring.js";
import { loadState, saveState } from "./storage.js";
import { fmt } from "./format.js";

export default function App() {
  const [state, setState] = useState(loadState);
  const boardRef = useRef(null);
  const offlineRef = useRef(null);
  const offline = useOffline();

  useEffect(() => saveState(state), [state]);

  const t = totals(state);
  const w = state.winner;

  return (
    <main className="wrap">
      <header className="top">
        <div>
          <p className="eyebrow"><span className="suits">♥♦<b>♠♣</b></span>&nbsp; Buraco em duplas</p>
          <h1>Placar do Buraco</h1>
        </div>
        <div className="top-side">
          <p className="eyebrow num">Partida até {fmt(state.rules.target)}</p>
          <OfflinePill offline={offline} panelRef={offlineRef} />
        </div>
      </header>

      <UpdateBanner offline={offline} />

      <div ref={boardRef}>
        <Board state={state} totals={t} />
      </div>

      {w != null ? (
        <section className="winner">
          <h2>{state.teams[w].name} venceu a partida!</h2>
          <p>
            Placar final: {fmt(t[w])} × {fmt(t[1 - w])} em {state.rounds.length}{" "}
            {state.rounds.length === 1 ? "rodada." : "rodadas."}
          </p>
          <button type="button" onClick={() => setState(newGame)}>Começar nova partida</button>
        </section>
      ) : (
        <RoundForm
          state={state}
          onSubmit={(entries) => {
            setState((s) => addRound(s, entries));
            boardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        />
      )}

      <section className="history">
        <h2>Rodadas da partida</h2>
        <History state={state} onDelete={(idx) => setState((s) => removeRound(s, idx))} />
      </section>

      <Settings
        state={state}
        onTeams={(teams) => setState((s) => ({ ...s, teams }))}
        onRules={(rules) => setState((s) => settleWinner({ ...s, rules }))}
        onNewGame={() => setState(newGame)}
        onReset={() => {
          const fresh = defaultState();
          setState(fresh);
          return fresh;
        }}
      />

      <OfflinePanel offline={offline} panelRef={offlineRef} />

      <details className="panel ref">
        <summary>Valor das cartas</summary>
        <div className="panel-body">
          <dl>
            <dt>Coringa (figura)</dt><dd>20 pontos</dd>
            <dt>Ás</dt><dd>15 pontos</dd>
            <dt>2 (curinga)</dt><dd>10 pontos</dd>
            <dt>K, Q, J, 10, 9, 8</dt><dd>10 pontos</dd>
            <dt>7, 6, 5, 4, 3</dt><dd>5 pontos</dd>
          </dl>
          <p className="note">
            Rodada = cartas na mesa − cartas na mão + canastras + batida − morto não pego. Use “Contar” para
            somar as cartas por quantidade.
          </p>
        </div>
      </details>
    </main>
  );
}
