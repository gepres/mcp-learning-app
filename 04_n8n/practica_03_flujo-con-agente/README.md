# 🛠️ Práctica 3: Flujo n8n con Agente de IA

> **Objetivo**: Crear un flujo n8n que use un agente de IA para clasificar y responder mensajes automáticamente.

---

## Lo que vas a construir

Un sistema que:
1. Recibe mensajes via webhook
2. Un agente de IA los clasifica
3. Según la clasificación, responde diferente
4. Guarda el historial en un archivo JSON

---

## Prerequisitos

- n8n instalado y corriendo (ver `01_que-es-n8n.md`)
- API Key de Anthropic (o clave de OpenAI)
- Postman o curl para probar

---

## Paso 1: Importar el flujo base

En n8n, ve a **Workflows → Import from JSON** y pega:

```json
{
  "name": "Agente Clasificador de Mensajes",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "clasificar-mensaje",
        "responseMode": "responseNode"
      },
      "name": "Webhook Entrada",
      "type": "n8n-nodes-base.webhook",
      "position": [240, 300]
    },
    {
      "parameters": {
        "model": "claude-3-5-sonnet-20241022",
        "messages": {
          "messageType": "text",
          "message": "Clasifica este mensaje en una de estas categorías: [consulta, queja, elogio, spam].\nMensaje: {{ $json.message }}\n\nResponde SOLO con la categoría, nada más."
        }
      },
      "name": "Clasificador IA",
      "type": "@n8n/n8n-nodes-langchain.lmChatAnthropic",
      "position": [460, 300]
    }
  ]
}
```

---

## Paso 2: Construir el flujo manualmente

### Nodo 1: Webhook (Trigger)
- Tipo: **Webhook**
- Method: POST
- Path: `clasificar-mensaje`
- Response Mode: Using 'Respond to Webhook' node

### Nodo 2: Clasificador IA
- Tipo: **Anthropic Chat Model** (o OpenAI)
- Prompt del sistema:
```
Eres un clasificador de mensajes de soporte.
Clasifica el mensaje en exactamente una categoría:
- consulta: pregunta sobre producto/servicio
- queja: problema o insatisfacción
- elogio: felicitación o satisfacción
- spam: irrelevante o automatizado

Responde SOLO con la categoría en minúsculas.
```

### Nodo 3: Switch (Condicional)
- Basado en la respuesta de la IA
- Ramas: consulta, queja, elogio, spam

### Nodo 4-7: Respuestas por categoría
Para cada rama, un nodo **Set** con la respuesta apropiada:

```
consulta → "Gracias por tu consulta. Un asesor te contactará en 24h."
queja    → "Lamentamos los inconvenientes. Escalamos tu caso como URGENTE."
elogio   → "¡Muchas gracias! Tu opinión nos motiva a mejorar."
spam     → "Mensaje no procesado."
```

### Nodo 8: Respond to Webhook
Devuelve la respuesta al cliente.

---

## Paso 3: Probar el webhook

### Con curl (universal)

```bash
# Envía una consulta:
curl -X POST http://localhost:5678/webhook/clasificar-mensaje \
  -H "Content-Type: application/json" \
  -d '{"message": "¿Cuánto cuesta el plan premium?"}'

# Espera recibir:
# {"categoria": "consulta", "respuesta": "Gracias por tu consulta..."}

# Envía una queja:
curl -X POST http://localhost:5678/webhook/clasificar-mensaje \
  -H "Content-Type: application/json" \
  -d '{"message": "El producto llegó roto y nadie me atiende"}'
```

### Con Python

```python
# probar_webhook.py
import requests
import json

URL = "http://localhost:5678/webhook/clasificar-mensaje"

mensajes_prueba = [
    "¿Cuánto cuesta el plan premium?",
    "El producto llegó roto y nadie me atiende",
    "¡Excelente servicio, muy satisfecho!",
    "OFERTA ESPECIAL GANE DINERO RÁPIDO",
]

for mensaje in mensajes_prueba:
    resp = requests.post(URL, json={"message": mensaje})
    resultado = resp.json()
    print(f"📨 Mensaje : {mensaje[:40]}...")
    print(f"🏷️  Categoría: {resultado.get('categoria', 'N/A')}")
    print(f"💬 Respuesta: {resultado.get('respuesta', 'N/A')}")
    print("-" * 50)
```

```bash
# Instalar requests si no lo tienes:
pip install requests

# Ejecutar:
python probar_webhook.py
```

### Con JavaScript (Node.js)

```javascript
// probar_webhook.js
const URL = "http://localhost:5678/webhook/clasificar-mensaje";

const mensajesPrueba = [
  "¿Cuánto cuesta el plan premium?",
  "El producto llegó roto y nadie me atiende",
  "¡Excelente servicio, muy satisfecho!",
  "OFERTA ESPECIAL GANE DINERO RÁPIDO",
];

async function probarWebhook() {
  for (const mensaje of mensajesPrueba) {
    const resp = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: mensaje }),
    });

    const resultado = await resp.json();
    console.log(`📨 Mensaje  : ${mensaje.slice(0, 40)}...`);
    console.log(`🏷️  Categoría: ${resultado.categoria ?? "N/A"}`);
    console.log(`💬 Respuesta: ${resultado.respuesta ?? "N/A"}`);
    console.log("-".repeat(50));
  }
}

probarWebhook();
```

```bash
# Ejecutar (Node.js v18+ tiene fetch nativo):
node probar_webhook.js
```

---

## Paso 4: Agregar memoria de conversación

Modifica el flujo para que recuerde conversaciones:

1. Agrega nodo **Read File** para leer historial
2. Inyecta el historial en el prompt
3. Agrega nodo **Write File** para guardar la interacción

```json
// Estructura del archivo historial.json
{
  "conversaciones": [
    {
      "id": "uuid-123",
      "timestamp": "2026-03-04T10:30:00",
      "mensaje": "¿Cuánto cuesta?",
      "categoria": "consulta",
      "respuesta": "Gracias por..."
    }
  ]
}
```

---

## Desafíos Opcionales

1. **Agrega extracción de datos**: Extrae nombre y email del mensaje si los incluye
2. **Integra con Slack**: Notifica en Slack cuando llegue una queja
3. **Dashboard**: Crea un workflow que genere estadísticas de mensajes por categoría
4. **Agente complejo**: Usa el nodo "AI Agent" con herramientas para que pueda consultar precios en una base de datos

---

## 🎯 ¿Qué aprendiste?

- Cómo crear un webhook en n8n
- Cómo usar un modelo de IA en un nodo
- Cómo enrutar según la respuesta de IA
- El patrón Clasificador + Router

**→ Siguiente módulo: [05_ia_local/01_por-que-ia-local.md](../../05_ia_local/01_por-que-ia-local.md)**
