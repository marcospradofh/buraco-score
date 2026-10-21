# Placar do Buraco

Micro sistema para marcar a pontuação de duas duplas no buraco. É um único arquivo, `index.html`, que funciona sem internet: abra no navegador do celular e pronto. Os dados ficam salvos no próprio aparelho (localStorage), então dá para fechar e reabrir sem perder o placar.

## Como usar

1. Em **Duplas e regras**, coloque o nome das duplas e dos jogadores e ajuste a meta (padrão: 3.000 pontos).
2. A cada rodada, preencha para cada dupla:
   - **Cartas na mesa**: soma dos pontos das cartas baixadas.
   - **Cartas na mão**: pontos que sobraram na mão (são descontados).
   - **Canastras limpas** e **sujas**.
   - **Pegou o morto** e **Bateu**.
3. Toque em **Lançar rodada**. O placar, a barra até a meta e o histórico atualizam na hora.

O botão **Contar** ao lado dos pontos abre um contador por carta (Ás, 2, K a 8, 7 a 3) e soma sozinho.

Quando uma dupla passa da meta, a partida termina e conta uma vitória no placar de partidas. Um empate acima da meta continua a partida até alguém ficar na frente.

## Regras padrão (editáveis)

| Item | Pontos |
| --- | --- |
| Ás | 15 |
| 2 (curinga) | 10 |
| K, Q, J, 10, 9, 8 | 10 |
| 7, 6, 5, 4, 3 | 5 |
| Canastra limpa | +200 |
| Canastra suja | +100 |
| Batida | +100 |
| Não pegou o morto | −100 |

Rodada = cartas na mesa − cartas na mão + canastras + batida − morto não pego.

## Hospedar na Vercel

O site é estático: não tem build nem dependências. O `vercel.json` só ajusta os cabeçalhos do modo offline.

1. Em [vercel.com/new](https://vercel.com/new), importe o repositório `buraco-score` do GitHub.
2. Em **Framework Preset**, deixe **Other**. Build Command e Output Directory ficam vazios.
3. Clique em **Deploy**.

A Vercel publica em produção o que está no branch `main`. Outros branches ganham um link de prévia.

## Levar para o navio

Abra o link da Vercel no celular enquanto ainda tem internet. Depois disso o app fica guardado no aparelho e abre mesmo sem sinal.

Dá também para instalar como app: no Android, menu do Chrome → **Adicionar à tela inicial**; no iPhone, Safari → Compartilhar → **Adicionar à Tela de Início**.

Sem servidor, também dá para baixar o `index.html` e abrir direto no navegador. Nesse caso o placar funciona, mas não instala como app.
