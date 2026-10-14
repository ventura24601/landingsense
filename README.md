# IcomTV × Senses — Landing de parceria

Landing page de captação de leads para clientes IcomTV interessados nos aromatizadores Senses
(comodato + assinatura, garantia eterna do equipamento e essências MoreSenses recorrentes).

Site estático: `index.html`, `styles.css`, `script.js` e `assets/`. Sem build.

## Configuração (topo do `script.js`)

| Campo | O que faz |
|---|---|
| `LEAD_WEBHOOK_URL` | URL que recebe o lead via `POST` JSON (n8n, Zapier, RD Station, Apps Script…). Vazio = envia direto pro WhatsApp. |
| `WHATSAPP_NUMBER` | Número que recebe a conversa (DDI + DDD, só números). |
| `MODELS` | Os 3 modelos exibidos (nome, cobertura, specs, selo de destaque). |

Campos enviados: `nome`, `clinica`, `whatsapp`, `email`, `cidade`, `area`, `modelo`, `consentimento`,
`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `origem`, `pagina`, `enviado_em`.

## Rodar localmente

```bash
npx serve .
```

## Publicar

GitHub Pages: *Settings → Pages → Deploy from branch → `main` / root*.
