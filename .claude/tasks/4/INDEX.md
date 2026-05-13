# Tasks – Plano 4: Webhooks Lastlink + Serviço de E-mail

| Task | Título | Status | Depende de |
|------|--------|--------|------------|
| 4.1 | WebhookLog Model + Migration (event_id) | ✅ | — |
| 4.2 | EmailService: enviarBoasVindas + enviarCancelamento + templates Blade | ✅ | — |
| 4.3 | WebhookController: HMAC + registro + dispatch | ✅ | 4.1 |
| 4.4 | ProcessaWebhookJob + ProcessaEventoService | ✅ | 4.1, 4.3 |
| 4.5 | Rota POST /api/webhooks/lastlink + config services.lastlink | ✅ | 4.3 |
| 4.6 | Testes: WebhookLastlinkTest | ✅ | 4.1–4.5 |
