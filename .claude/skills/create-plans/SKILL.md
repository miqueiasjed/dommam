---
name: create-plans
description: Lê um PRD/SRS e gera planos numerados em .claude/plans/, atualizando o INDEX.md automaticamente.
---
# Skill: Criar Planos a partir do PRD

Esta skill transforma um documento de requisitos (PRD/SRS) em planos de desenvolvimento organizados, prontos para serem executados pela skill `run-plan`.

---

## 🛑 REGRA DE OURO: Economia de Contexto

- Cada plano gerado deve ser **autocontido**: conter apenas o contexto mínimo necessário para ser executado, sem depender da leitura do PRD inteiro.
- **NUNCA copie trechos longos do PRD** para dentro do plano. Resuma e referencie.
- Se o PRD for muito grande, fragmente-o primeiro (ver Passo 0).

---

## Passo 0 – Fragmentar o PRD (se necessário)

Se o PRD tiver mais de **2.000 linhas** ou cobrir **5+ módulos distintos**:

1. Crie a pasta `.claude/prd/` (se não existir).
2. Extraia cada módulo/domínio para um arquivo separado:
   ```
   .claude/prd/
     galeria.md
     player.md
     ia-geracao.md
     colecoes.md
     busca-filtros.md
   ```
3. Cada fragmento deve conter regras de negócio, entidades e fluxos do módulo.
4. O PRD original permanece como referência, mas a IA consulta apenas os fragmentos.

---

## Passo 1 – Leitura e Análise do PRD

1. Leia o PRD completo (ou os fragmentos em `.claude/prd/`).
2. Leia `.claude/plans/INDEX.md` para saber quais planos já existem e qual é o próximo número disponível.
3. Leia `.claude/rules.md` (se existir) para respeitar restrições do projeto.

---

## Passo 2 – Identificar Módulos e Dependências

Analise o PRD e identifique:

- **Módulos funcionais** (ex: Galeria, Player, Geração IA, Coleções, Busca).
- **Dependências entre módulos** (ex: Player depende da Galeria existir).
- **Prioridade natural** (fundação antes de funcionalidades dependentes).

Organize em **ordem de execução lógica**:
1. Setup e infraestrutura (estrutura de pastas, design system, componentes base).
2. Módulos independentes (sem dependências externas).
3. Módulos dependentes (na ordem das dependências).
4. Integrações e refinamentos.
5. Polimento, animações e testes E2E.

---

## Passo 3 – Gerar os Planos

Para cada módulo, crie um arquivo `.claude/plans/[N].md`:

```markdown
# Plano [N] – [Nome descritivo do módulo]

## Objetivo
[1-2 frases explicando o que este plano entrega ao final]

## Contexto de Negócio
[Resumo das regras relevantes – máximo 10-15 linhas]

## Escopo

### Inclui
- [Funcionalidade A]
- [Funcionalidade B]

### Não inclui (fica para outro plano)
- [Funcionalidade X → ver Plano M]

## Dependências
- **Requer concluído:** Plano [X] – [nome]
- **Bloqueia:** Plano [Y] – [nome]

## Componentes/Arquivos envolvidos
- `src/components/...` – [breve descrição]
- `src/pages/...` – [breve descrição]

## Entregáveis esperados
- [ ] [Entregável 1]
- [ ] [Entregável 2]

## Estimativa de tasks
~[N] tasks (componentes: ~X, páginas: ~Y, testes: ~Z)

## Skills necessárias
- [lista de skills relevantes para este plano]
```

### Regras ao gerar planos:

- **Granularidade correta:** Um plano deve representar um módulo coerente, completável em **3-8 tasks**.
- **Se um módulo for muito grande**, divida em sub-planos (ex: Plano 3A – Player: Layout, Plano 3B – Player: Controles).
- **Nunca gere planos vagos** como "Melhorias gerais".
- **Cada plano deve ser executável de forma independente** (respeitando dependências).

---

## Passo 4 – Atualizar o INDEX.md

Após gerar todos os planos, atualize (ou crie) `.claude/plans/INDEX.md`:

```markdown
# INDEX – Planos do Projeto IA Videos

> Última atualização: [DATA]

## Legenda
- ✅ Concluído
- 🔄 Em andamento
- ⏳ Pendente
- 🔒 Bloqueado (dependência não concluída)

## Planos

| # | Nome | Status | Depende de | Tasks |
|---|------|--------|------------|-------|
| 1 | Setup e Design System | ⏳ | — | ~4 |
| 2 | Galeria de Vídeos | ⏳ | 1 | ~5 |
| ... | ... | ... | ... | ... |

## Ordem de execução recomendada
1 → 2 → 3 → ...
```

---

## Passo 5 – Validação Final

- [ ] Todos os requisitos do PRD estão cobertos por pelo menos um plano?
- [ ] As dependências formam um grafo sem ciclos?
- [ ] Nenhum plano tem mais de 8 tasks estimadas?
- [ ] O INDEX.md reflete todos os planos gerados?

---

## Exemplo de uso

O usuário diz: _"Leia o PRD e crie os planos"_ ou _"create-plans"_.

A IA deve:
1. Ler o PRD (ou fragmentos).
2. Ler o INDEX.md atual.
3. Gerar os planos em `.claude/plans/`.
4. Atualizar o INDEX.md.
5. Informar ao usuário o que foi criado e a ordem recomendada.
