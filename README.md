# Flight Booking Scenarios

Projeto de testes end-to-end (E2E) para validar o fluxo de reserva de voos da
[QAPractice](https://www.qapractice.com/flight-booking-scenarios), utilizando
Playwright e TypeScript.

Os cenários estão concentrados em
[tests/flight.spec.ts](tests/flight.spec.ts). A suíte acessa a aplicação
publicada, preenche o formulário de busca, avança pelas etapas da reserva e
confirma os comportamentos esperados por meio de asserções na interface.

## Objetivos

- Validar o fluxo completo de reserva de uma viagem de ida e volta.
- Confirmar a pesquisa de voos somente de ida.
- Garantir que regras de negócio e mensagens de validação sejam exibidas
  corretamente.
- Verificar a progressão visual entre as etapas `Search`, `Select flights`,
  `Passengers`, `Payment` e `Done`.

## Cenários automatizados

O arquivo `flight.spec.ts` organiza os testes no grupo `Reserva de voos`. Antes
de cada caso, o navegador é direcionado para
`/flight-booking-scenarios`.

| Cenário | O que é validado |
| --- | --- |
| Fluxo completo de Reserva de Voo | Pesquisa de Paris para Londres, seleção dos voos de ida e volta, preenchimento dos dados do passageiro, pagamento e conclusão da reserva. |
| Fluxo de pesquisa voo só de ida | Ativação da opção de ida simples e conclusão da pesquisa sem data de retorno. |
| Origem e destino iguais devem ser rejeitados | A busca permanece na etapa inicial e exibe a mensagem de que as cidades de origem e destino não podem ser iguais. |
| Data de ida não pode ser maior ou igual a da volta | Validação de datas de retorno anteriores ou iguais à data de partida. O teste cobre os dois casos em uma lista de entradas. |
| Exibir mensagens de erro com todos os campos vazios | Exibição das mensagens obrigatórias para origem, destino, data de ida e data de volta. |

### Fluxo completo

O cenário principal percorre as seguintes etapas:

1. Seleciona Paris como origem e Londres como destino.
2. Informa as datas de ida e volta, a quantidade de passageiros e a classe
   executiva.
3. Pesquisa os voos e seleciona os voos `AL248` e `BJ311`.
4. Preenche nome, e-mail e telefone do passageiro.
5. Informa número do cartão, validade e CVV.
6. Finaliza a reserva e verifica a etapa `Done`.

Os elementos são localizados principalmente por `data-testid`, por exemplo
`flight-from`, `flight-search` e `flight-book`. Essa abordagem torna os testes
mais estáveis do que seletores baseados apenas em estrutura ou estilo visual.

## Tecnologias

- [Playwright Test](https://playwright.dev/docs/test-intro) `1.64.1`
- TypeScript
- Node.js e npm
- Navegador Chromium

## Pré-requisitos

- Node.js instalado.
- Acesso à internet, pois os testes utilizam a aplicação hospedada em
  `https://www.qapractice.com`.

## Instalação

```bash
npm install
npx playwright install chromium
```

## Execução

Executar todos os testes:

```bash
npx playwright test
```

Executar somente o arquivo de cenários de voo:

```bash
npx playwright test tests/flight.spec.ts
```

Executar com o navegador visível:

```bash
npx playwright test tests/flight.spec.ts --headed
```

Abrir o relatório HTML após a execução:

```bash
npx playwright show-report
```

## Configuração

A configuração está em
[playwright.config.ts](playwright.config.ts) e define:

- `tests` como diretório dos testes;
- `https://www.qapractice.com` como `baseURL`;
- o atributo `data-testid` para localização de elementos;
- o projeto Chromium com viewport de desktop;
- relatório HTML;
- `slowMo` de 1000 ms para tornar a execução observável;
- coleta de trace na primeira tentativa de um teste que falhar em uma nova
  tentativa.

Como a aplicação testada é externa, os resultados podem ser influenciados por
disponibilidade da rede, mudanças na interface e alterações nos dados dos voos.
Os dados de cartão utilizados no teste são dados de demonstração para o
ambiente de prática e não devem ser usados em sistemas reais.

## Estrutura do projeto

```text
.
├── tests/
│   └── flight.spec.ts       # Cenários E2E de reserva de voos
├── playwright.config.ts     # Configuração da execução do Playwright
├── package.json             # Dependências do projeto
└── README.md                # Documentação
```
