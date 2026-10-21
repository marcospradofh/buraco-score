# Placar do Buraco

Micro sistema para marcar a pontuação de duas duplas no buraco, feito em React com Vite. É um app instalável (PWA): depois do primeiro acesso com internet, abre e funciona sem sinal. Os dados ficam salvos no próprio aparelho (localStorage), então dá para fechar e reabrir sem perder o placar.

## Rodar localmente

```bash
npm install
npm run dev      # desenvolvimento
npm test         # testes da pontuação
npm run build    # gera a pasta dist/
npm run preview  # serve o build, com modo offline
```

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
| Coringa (figura) | 20 |
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

O `vercel.json` já diz à Vercel para usar Vite, rodar `npm run build` e publicar a pasta `dist`.

1. Em [vercel.com/new](https://vercel.com/new), importe o repositório `buraco-score` do GitHub.
2. Clique em **Deploy**. Não precisa mudar nenhuma configuração.

A Vercel publica em produção o que está no branch `main`. Outros branches ganham um link de prévia.

## Usar sem internet

Abra o link da Vercel no celular enquanto ainda tem internet. O selo no topo muda para **Pronto para jogar sem internet** quando o app já está guardado no aparelho. O painel **Usar sem internet** mostra o passo a passo de instalação para o navegador que está sendo usado.

### iPhone com Chrome

Funciona. No iPhone, o Chrome usa o mesmo motor do Safari, que guarda sites para uso offline, e desde o iOS 16.4 o Chrome também consegue adicionar o site à Tela de Início.

1. Abra o link no Chrome, com internet.
2. Toque em **Compartilhar** (ícone ⬆ na barra de endereço, ou no menu ⋯) → **Adicionar à Tela de Início**.
3. Abra o placar pelo novo ícone, ainda com internet, e espere o selo **Pronto para jogar sem internet**.

Cuidados no iPhone:

- O app da Tela de Início guarda um placar separado do que fica aberto numa aba do Chrome. Depois de instalar, marque sempre pelo ícone.
- O iOS pode apagar dados de sites abertos só no navegador e esquecidos por alguns dias. O app instalado na Tela de Início fica protegido disso.

### Android

No Chrome aparece o botão **Instalar no aparelho** no painel **Usar sem internet** (ou use o menu → **Instalar app**).

## Atualizações

Quando houver uma versão nova publicada, o app mostra um aviso com o botão **Atualizar**. Ele nunca recarrega sozinho no meio de uma rodada, e o placar salvo continua lá depois de atualizar.
