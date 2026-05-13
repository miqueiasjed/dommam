---
name: run-plan
description: Executa o próximo plano disponível, processando tasks ativamente e atualizando os status e logs após testes.
---
# Skill: Run Plan

Siga os passos abaixo, passo a passo, para executar exatamente UM plano das pendências do projeto:

## 🚀 INÍCIO: CHECAGEM DE HANDOFF
1. **SEMPRE**, antes de começar um plano novo, verifique o arquivo `.claude/handoff.md`.
2. Se o status no handoff for diferente de "Concluído/Vazio" (ou seja, existir um plano em andamento pausado), ignore a busca por novos planos em `/plans/INDEX.md` e **retome o trabalho exatamente a partir das definições do handoff**.

## 🛑 LIMITADOR DE CONTEXTO E PAUSA (HANDOFF)
- **Como pausar com segurança:** Se a sessão atual gastar perto de **80.000 tokens** ou você achar que o chat já se alongou muito:
  1. Sobrescreva o arquivo `.claude/handoff.md` registrando o estado atual:
     ```md
     # Handoff – Último estado
     Plano: [n]
     Task: [m]
     Status: Em andamento (XX%)
     O que foi feito: [lista]
     O que falta: [lista]
     Arquivos modificados: [lista]
     Próxima ação: [O que a IA deve fazer ao iniciar nova conversa]
     ```
  2. Commite as alterações (ex: `wip: handoff do plano X`).
  3. Peça ao usuário para **encerrar este chat, abrir nova janela** e digitar `run-plan`.

---

3. Se não houver handoff pendente, leia `.claude/plans/INDEX.md` e escolha **APENAS UM PLANO NOVO** para executar.
4. Estude o arquivo `.claude/plans/[number].md` e todas as tasks em `.claude/tasks/[number]/`.

## ⚠️ SKILLS OBRIGATÓRIAS ANTES DE CODAR

Antes de escrever qualquer linha de código, identifique o tipo de cada task e leia a skill correspondente:

| Tipo de task | Skill obrigatória | Arquivo |
|---|---|---|
| Qualquer componente, página ou estilo React | **frontend-design-system** | `.claude/skills/frontend-design-system/SKILL.md` |
| Qualquer teste de componente ou página | **frontend-testing** | `.claude/skills/frontend-testing/SKILL.md` |

### Regras invioláveis do frontend (resumo da skill frontend-design-system):
- **NUNCA** usar cores hardcoded como `bg-[#030406]` em componentes novos — usar tokens CSS definidos em `index.css`.
- **NUNCA** usar `bg-blue-500`, `text-gray-700` ou outras cores semânticas genéricas do Tailwind.
- **SEMPRE** seguir o tema escuro do projeto (violeta + zinc).
- **NUNCA** criar lógica de IA ou manipulação de dados em componentes visuais.

5. **EXECUÇÃO COM SUBAGENTES (ECONOMIA DE CONTEXTO E PARALELISMO):**
   - Analise as tasks. **Se existirem tasks independentes entre si, execute várias de uma vez** via subagente(s) paralelos.
   - O subagente nasce "limpo" e **não sabe dos padrões do projeto** se você não incluir explicitamente no prompt.
   - Sempre inclua o caminho da skill obrigatória no prompt do subagente. Exemplo:
     ```
     claude -p --permission-mode bypassPermissions "Leia a skill em .claude/skills/frontend-design-system/SKILL.md e as specs das tasks em .claude/tasks/[N]/[N].1.md e .claude/tasks/[N]/[N].2.md. Execute as implementações aplicando estritamente os padrões da skill. Retorne quando acabar."
     ```
6. Após conclusão das tasks pelo(s) subagente(s), marque-as como feitas. Inicie a próxima bateria somente então.
7. Após finalizar **todas** as tasks do plano e o build passar sem erros:
   - Registre aprendizados em `.claude/progress.txt`.
   - Atualize `.claude/plans/INDEX.md` marcando o plano como concluído.
8. Use a skill `commit-push` para enviar o trabalho finalizado.
