---
name: commit-push
description: Realizar commit e push de todas as alterações para o repositório
---

# Skill: Commit e Push

Este workflow realiza o commit de todas as alterações, gera uma mensagem semântica com base no diff e faz o push para o repositório remoto.

## Fluxo de Execução

**Validações Pré-Commit:**
1. Verifique nos arquivos alterados se há código residual de debug, como `console.log()` ou `debugger`. Remova qualquer ocorrência deixada acidentalmente.
2. **Execute o build** para garantir que nada foi quebrado: rode `npm run build`. Se houver erros, corrija antes de prosseguir.
3. Se o projeto tiver testes configurados, rode `npm test -- --run`. Garanta que passem.

**Commit e Push Automático:**
4. Verifique o status atual do git: `git status`
5. Veja as alterações: `git diff` e `git diff --cached`
6. Adicione os arquivos: `git add .`
7. Crie uma mensagem de commit semântica baseada nas alterações (ex: `feat: galeria de vídeos com filtro por categoria` ou `fix: corrigido overflow no card de vídeo`).
8. Execute o commit: `git commit -m "[mensagem gerada]"`
9. Faça o push: `git push`
10. Informe o usuário se tudo (build, testes, git) passou ou se algo falhou.
