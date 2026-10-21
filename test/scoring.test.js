import { test } from "node:test";
import assert from "node:assert/strict";
import {
  addRound, blankEntry, countSum, defaultState, newGame, removeRound, roundScore, totals, warnings,
} from "../src/scoring.js";

const rules = defaultState().rules;
const entry = (over) => ({ ...blankEntry(), ...over });

test("rodada soma mesa, canastras e batida e desconta mão", () => {
  assert.equal(roundScore(entry({ mesa: 340, limpas: 1, bateu: true }), rules), 640);
  assert.equal(roundScore(entry({ mesa: 120, mao: 35, sujas: 2 }), rules), 285);
});

test("não pegar o morto desconta 100", () => {
  assert.equal(roundScore(entry({ mesa: 45, mao: 45, morto: false }), rules), -100);
});

test("contador de cartas usa o valor de cada carta", () => {
  assert.equal(countSum({ as: 3, dois: 1, alta: 4, baixa: 2 }), 45 + 10 + 40 + 10);
  assert.equal(countSum({ coringa: 2, as: 1 }), 40 + 15);
});

test("partida termina quando alguém passa da meta e conta a vitória", () => {
  let s = { ...defaultState(), rules: { ...rules, target: 500 } };
  s = addRound(s, [entry({ mesa: 340, limpas: 1, bateu: true }), entry({ mesa: 50 })]);
  assert.equal(s.winner, 0);
  assert.deepEqual(s.wins, [1, 0]);
  assert.deepEqual(totals(s), [640, 50]);

  // Rodadas não entram depois do fim.
  assert.equal(addRound(s, [entry({}), entry({})]).rounds.length, 1);

  // Apagar a rodada decisiva desfaz a vitória.
  const undone = removeRound(s, 0);
  assert.equal(undone.winner, null);
  assert.deepEqual(undone.wins, [0, 0]);

  // Nova partida mantém as vitórias.
  const next = newGame(s);
  assert.deepEqual(next.wins, [1, 0]);
  assert.equal(next.rounds.length, 0);
});

test("empate acima da meta continua a partida", () => {
  let s = { ...defaultState(), rules: { ...rules, target: 100 } };
  s = addRound(s, [entry({ mesa: 200 }), entry({ mesa: 200 })]);
  assert.equal(s.winner, null);
});

test("avisos de rodada estranha", () => {
  const teams = defaultState().teams;
  assert.deepEqual(warnings([entry({}), entry({})], teams), ["Ninguém bateu nesta rodada?"]);
  assert.deepEqual(
    warnings([entry({ bateu: true, morto: false, mao: 5 }), entry({})], teams),
    ["Nós bateu sem canastra limpa.", "Nós bateu sem pegar o morto.", "Nós bateu mas tem cartas na mão."],
  );
});
