---
name: create-tasks
description: Lê um plano em .claude/plans/[N].md e gera tasks granulares em .claude/tasks/[N]/, otimizadas para não exceder o limite de tokens.
---
# Skill: Criar Tasks a partir de um Plano

Esta skill transforma um plano de desenvolvimento em tasks granulares, prontas para execução individual pela skill `run-plan`.

---

## 🛑 REGRA CRÍTICA: Limite de Tokens por Task

Cada task deve ser executável dentro de **~20.000–25.000 tokens de output**. Isso garante que o agente consiga completar a task inteira dentro do limite de 80k tokens da conversa.

### Indicadores de que uma task está grande demais:
- Cria/modifica **mais de 3 arquivos**.
- Envolve **mais de 150 linhas de código novo**.
- Mistura **layout + lógica + testes** na mesma task.
- Exige ler **mais de 5 arquivos existentes** para contexto.

Se qualquer indicador for verdadeiro → **quebre em tasks menores**.

---

## Passo 1 – Leitura do Plano

1. Receba o número do plano (ex: `create-tasks 3` ou "crie as tasks do plano 3").
2. Leia o arquivo `.claude/plans/[N].md`.
3. Leia o `CLAUDE.md` para relembrar as convenções do projeto.
4. Se o plano referencia um fragmento do PRD (ex: `.claude/prd/galeria.md`), leia-o.

---

## Passo 2 – Decompor em Tasks

Analise os entregáveis do plano e decomponha seguindo esta **hierarquia de granularidade**:

### Camada 1: Fundação
- Tokens CSS / Design system / Configuração global (1 task).
- Tipos compartilhados / constantes / fixtures de dados (1 task se simples).

### Camada 2: Componentes Base (UI)
- Componente reutilizável simples (1 task por componente).
- Componentes complexos (1 task por componente, separar se > 100 linhas).

### Camada 3: Componentes de Domínio
- Componente específico do domínio (ex: VideoCard, VideoPlayer) — 1 task por componente.
- Lógica de estado local, hooks customizados — 1 task por hook.

### Camada 4: Páginas / Layouts
- Página/layout principal (1 task por página).
- Integração com API ou geração de IA (1 task por integração).

### Camada 5: Testes e Polimento
- Testes de componentes (1 task por componente/página).
- Animações, responsividade e ajustes visuais (1 task).

### Regras de agrupamento:
- **Pode agrupar:** componente simples + seu CSS (se totalizarem < 100 linhas).
- **Nunca agrupar:** criação de componente + testes desse componente.
- **Nunca agrupar:** 2 componentes de domínio distintos na mesma task.
- **Sempre separar:** lógica de dados/hooks da renderização do componente.

---

## Passo 3 – Gerar os Arquivos de Task

Crie a pasta `.claude/tasks/[N]/` e gere um arquivo por task.

### Nomenclatura dos arquivos:
```
.claude/tasks/[N]/
  [N].1.md    ← primeira task
  [N].2.md    ← segunda task
  ...
```

### Template de cada task:

```markdown
# Task [N].[X] – [Título curto e descritivo]

## Objetivo
[1-2 frases: o que esta task entrega quando concluída]

## Tipo
[design-system | componente-base | componente-dominio | pagina | hook | integracao-ia | teste | config]

## Arquivos a criar/modificar
- `src/components/...jsx` → [criar | modificar]
- `src/index.css` → [modificar]

## Contexto necessário (arquivos para ler antes)
- `src/components/VideoCard.jsx` → [motivo: ex "entender props do card"]
- `src/index.css` → [motivo: ex "ver tokens de cor já definidos"]

## Skills necessárias
- [frontend-design-system | frontend-testing]

## Especificação

### O que fazer:
[Instruções claras e diretas do que implementar]

### Regras visuais aplicáveis:
- [Usar tokens de cor, não hardcode]
- [Seguir padrão dark theme do projeto]

### Critérios de aceitação:
- [ ] [Critério verificável 1]
- [ ] [Critério verificável 2]

## Teste esperado
[Como validar que esta task está completa]
- Build sem erros: `npm run build`
- Verificação visual: [descrever o que deve aparecer]

## Estimativa de complexidade
[baixa | média | alta]
~[N] linhas de código | ~[N] arquivos
```

---

## Passo 4 – Criar Arquivo de Índice das Tasks

Crie (ou atualize) `.claude/tasks/[N]/INDEX.md`:

```markdown
# Tasks do Plano [N] – [Nome do Plano]

> Gerado em: [DATA]

## Legenda
- ✅ Concluída
- 🔄 Em andamento
- ⏳ Pendente

## Tasks

| # | Título | Tipo | Status | Complexidade |
|---|--------|------|--------|-------------|
| [N].1 | [Título] | design-system | ⏳ | baixa |
| [N].2 | [Título] | componente-base | ⏳ | média |
| [N].3 | [Título] | componente-dominio | ⏳ | média |
| [N].4 | [Título] | pagina | ⏳ | alta |
| [N].5 | [Título] | teste | ⏳ | baixa |

## Ordem de execução
[N].1 → [N].2 → [N].3 → [N].4 → [N].5
```

---

## Passo 5 – Atualizar o INDEX.md do Plano

Atualize `.claude/plans/INDEX.md` preenchendo a coluna "Tasks" com o número real de tasks geradas.

---

## Passo 6 – Validação Final

- [ ] Nenhuma task cria/modifica mais de 3 arquivos?
- [ ] Todas as tasks têm "Critérios de aceitação" claros?
- [ ] A ordem de execução respeita as dependências?
- [ ] Todos os entregáveis do plano estão cobertos pelas tasks?

---

## Exemplo de uso

O usuário diz: _"Crie as tasks do plano 2"_ ou _"create-tasks 2"_.

A IA deve:
1. Ler `.claude/plans/2.md`.
2. Decompor em tasks granulares.
3. Criar os arquivos em `.claude/tasks/2/`.
4. Criar o INDEX.md das tasks.
5. Atualizar o INDEX.md dos planos.
6. Informar ao usuário quantas tasks foram criadas e a ordem de execução.
