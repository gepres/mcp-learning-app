# 🔄 ¿Qué es n8n?

> **n8n = Automatización visual + IA = El pegamento del ecosistema moderno**

---

## La Idea Central

n8n es una plataforma de automatización de flujos de trabajo **open source** que puedes hostear tú mismo.

**Piénsalo como:**
```
Zapier    = cerrado, en la nube, de pago
Make.com  = semi-cerrado, en la nube, costoso en volumen
n8n       = abierto, tú lo hostas, sin límites de operaciones
```

---

## ¿Para qué sirve en el Ecosistema IA?

n8n es el **pegamento** que conecta:
- Tus sistemas existentes (CRM, email, bases de datos)
- Con modelos de IA (Claude, GPT, modelos locales)
- Ejecutando automatizaciones sin escribir código

```
EJEMPLO REAL:
─────────────────────────────────────────────────────
Nuevo email llega a Gmail
        │
        ▼
n8n lo captura automáticamente
        │
        ▼
Nodo IA: "¿Es una queja de cliente?"
Claude responde: "Sí, nivel urgencia: alta"
        │
        ▼
Condición: ¿urgencia alta?
    ├── Sí → Crea ticket en Jira + Notifica en Slack
    └── No → Responde automáticamente con plantilla
```

---

## Conceptos Clave de n8n

### 1. Workflow (Flujo)
El diagrama visual de tu automatización. Tiene nodos conectados por flechas.

### 2. Nodo (Node)
Una acción específica en tu flujo:
- **Trigger**: El disparador (inicio del flujo)
- **Action**: Una acción (enviar email, crear registro)
- **Logic**: Lógica (condiciones, loops, merge)
- **AI**: Llamada a un modelo de IA

### 3. Trigger (Disparador)
¿Qué inicia el flujo?
- Webhook (llamada HTTP)
- Horario (cron)
- Evento (nuevo email, formulario)
- Manual (tú lo ejecutas)

### 4. Credenciales
Las llaves de acceso a servicios externos, guardadas de forma segura en n8n.

---

## Instalación Local con Docker

```yaml
# docker-compose.yml
version: '3.8'

services:
  n8n:
    image: docker.n8n.io/n8nio/n8n
    restart: always
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=tu-password-seguro
      - N8N_HOST=localhost
      - N8N_PORT=5678
      - N8N_PROTOCOL=http
      - WEBHOOK_URL=http://localhost:5678/
    volumes:
      - n8n_data:/home/node/.n8n

volumes:
  n8n_data:
```

```bash
# Iniciar:
docker-compose up -d

# Acceder en: http://localhost:5678
```

---

## Los Nodos de IA en n8n

n8n tiene nodos nativos para trabajar con IA:

### AI Agent
El nodo más poderoso. Crea un agente completo que puede:
- Usar herramientas
- Razonar en múltiples pasos
- Mantener memoria de conversación

```
Configuración del nodo AI Agent:
  ├── Modelo: Claude 3.5 Sonnet / GPT-4 / Llama local
  ├── Herramientas:
  │   ├── Wikipedia
  │   ├── Calculator
  │   ├── HTTP Request (para APIs)
  │   └── Code Execution
  ├── Memoria: Window Buffer Memory
  └── System Prompt: "Eres un asistente..."
```

### Nodos de Chat
- **Chat Trigger**: Crea un endpoint de chat
- **Chat Memory**: Guarda historial de conversación

### Nodos de Modelos
- OpenAI Chat Model
- Anthropic Chat Model
- Ollama Chat Model (local!)
- Google Gemini Chat Model

### Nodos de Utilidad IA
- **Summarize**: Resume texto largo
- **Extract Information**: Extrae datos estructurados
- **Classify**: Clasifica texto en categorías
- **Translate**: Traduce texto

---

## Arquitecturas Comunes con n8n + IA

### Patrón 1: Clasificador + Router
```
Email llega
    │
    ▼
[Claude] Clasifica: ventas/soporte/spam
    │
    ├── ventas → Notifica al equipo de ventas
    ├── soporte → Crea ticket en sistema
    └── spam → Archiva automáticamente
```

### Patrón 2: RAG Simple
```
Pregunta del usuario (webhook)
    │
    ▼
[Búsqueda] Encuentra documentos relevantes
    │
    ▼
[Claude] Responde usando los documentos
    │
    ▼
Respuesta al usuario
```

### Patrón 3: Agente con Herramientas
```
Tarea del usuario
    │
    ▼
[AI Agent]
    ├── Llama herramienta A si necesita X
    ├── Llama herramienta B si necesita Y
    └── Responde cuando tiene la info
```

### Patrón 4: Pipeline de Procesamiento
```
Archivo subido
    │
    ▼
[Extrae texto] del PDF
    │
    ▼
[Claude] Resume el contenido
    │
    ▼
[Extrae] puntos clave como JSON
    │
    ▼
[Guarda] en base de datos
    │
    ▼
[Notifica] vía Slack
```

---

## 🎯 TIC para recordar n8n

**"n8n = Numerito ocho ene" → "El Ochenta"**

- **n** = "nodes" (nodos)
- **8** = hay 8 letras entre n y n en "nodemation" (el nombre original)
- **n** = "nodemation"

Piénsalo como: **"El Orquestador"**
- Un director de orquesta no toca ningún instrumento
- Coordina que cada músico toque en el momento correcto
- n8n coordina que cada servicio/IA actúe cuando debe

**n8n no es el cerebro (eso es el LLM), es el DIRECTOR.**

---

## Comparativa: ¿Cuándo usar qué?

| Necesidad | Herramienta |
|-----------|-------------|
| Agente conversacional simple | Claude Code / Claude Desktop |
| Automatizar proceso de negocio | n8n |
| Agente + automatización | n8n con nodo AI Agent |
| App web personalizada | LangChain + tu propio código |
| Múltiples agentes colaborando | LangGraph / CrewAI |
| Privacidad total | Ollama + n8n local |

---

## ✅ Checklist de comprensión

- [ ] Sé qué es n8n y en qué se diferencia de Zapier
- [ ] Entiendo los conceptos: workflow, nodo, trigger
- [ ] Sé cómo instalar n8n con Docker
- [ ] Conozco los nodos de IA disponibles
- [ ] Entiendo los 4 patrones principales

**→ Práctica: [practica_03_flujo-con-agente/README.md](./practica_03_flujo-con-agente/README.md)**
