# 🗺️ Mapa Visual: Cómo se Conecta Todo

## El Ecosistema Completo

```
┌─────────────────────────────────────────────────────────────────┐
│                    TÚ (el Usuario)                              │
└──────────────────────────┬──────────────────────────────────────┘
                           │ (hablas con...)
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                  CLIENTE / INTERFAZ                             │
│   Claude.ai │ Claude Code │ Tu App │ n8n │ Cursor │ Continue    │
└──────────────────────────┬──────────────────────────────────────┘
                           │ (usa protocolo MCP para llamar a...)
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    LLM / CEREBRO                                │
│         Claude │ GPT-4 │ Gemini │ Llama │ Mistral              │
│                                                                 │
│  El modelo decide: ¿qué herramienta usar? ¿cómo responder?     │
└──────────────────────────┬──────────────────────────────────────┘
                           │ (llama a herramientas via MCP)
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
    ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
    │ MCP Server  │ │ MCP Server  │ │ MCP Server  │
    │  Archivos   │ │  Base Datos │ │  Internet   │
    │  del disco  │ │  Postgres   │ │  Búsqueda   │
    └─────────────┘ └─────────────┘ └─────────────┘
```

---

## ¿Qué es MCP en una imagen?

```
SIN MCP (el caos anterior):
─────────────────────────
  App A ──────► Tool 1
  App A ──────► Tool 2        Cada app tiene su propia
  App A ──────► Tool 3        integración. N apps × M tools
  App B ──────► Tool 1        = N×M conexiones distintas 😱
  App B ──────► Tool 2
  App B ──────► Tool 3

CON MCP (el orden actual):
─────────────────────────
  App A ──► [MCP] ──► Tool 1
  App A ──► [MCP] ──► Tool 2   Un solo protocolo estándar.
  App B ──► [MCP] ──► Tool 3   N apps + M tools = N+M 🎉
  App B ──► [MCP] ──► Tool 1
                 ↑
         (como USB, un estándar
          que conecta todo)
```

---

## Anatomía de un Agente

```
┌──────────────────────────────────────────────────┐
│                  AGENTE DE IA                    │
│                                                  │
│  ┌─────────────┐    ┌─────────────────────────┐  │
│  │   CEREBRO   │    │       MEMORIA           │  │
│  │   (LLM)     │◄──►│  - Contexto actual      │  │
│  │             │    │  - Historial            │  │
│  └──────┬──────┘    │  - Conocimiento base    │  │
│         │           └─────────────────────────┘  │
│         │                                        │
│         ▼                                        │
│  ┌─────────────────────────────────────────────┐ │
│  │              HERRAMIENTAS                   │ │
│  │  🔍 Buscar  │ 📁 Archivos  │ 💾 Base Datos  │ │
│  │  🌐 Web     │ 📧 Email     │ 🐍 Código      │ │
│  └─────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────┘
```

---

## Cómo se Orquesta un Sistema Multi-Agente

```
         [Usuario]
             │
             ▼
    ┌─────────────────┐
    │  AGENTE ORQUES- │  ← Planifica y delega
    │  TADOR/MANAGER  │
    └────────┬────────┘
             │
    ┌────────┼────────┐
    ▼        ▼        ▼
┌───────┐ ┌───────┐ ┌───────┐
│ Agente│ │ Agente│ │ Agente│
│ Invest│ │ Escrib│ │ Revisa│  ← Especialistas
│ igador│ │  idor │ │  dor  │
└───────┘ └───────┘ └───────┘
    │        │        │
    └────────┼────────┘
             ▼
      [Resultado Final]

FRAMEWORKS: CrewAI, LangGraph, AutoGen
```

---

## n8n en el Ecosistema

```
TRIGGER (disparador)
    │  ┌── Nuevo email recibido
    │  ├── Formulario enviado
    │  └── Hora programada
    ▼
┌──────────────────────────────────┐
│           FLUJO n8n              │
│                                  │
│  [Nodo 1] → [Nodo 2] → [Nodo 3] │
│                                  │
│  Cada nodo puede ser:            │
│  - Llamada a API                 │
│  - Transformación de datos       │
│  - Llamada a un AGENTE de IA     │ ← ¡Aquí entra la IA!
│  - Envío de mensaje              │
└──────────────────────────────────┘
    │
    ▼
ACCIÓN FINAL
    ├── Guardar en base de datos
    ├── Enviar notificación
    └── Disparar otro flujo
```

---

## Arquitectura RAG

```
╔══════════════════ PIPELINE RAG ══════════════════╗
║                                                  ║
║  FASE 1 — INDEXACIÓN (off-line, una vez)         ║
║  ─────────────────────────────────────           ║
║  📄 Docs ──► ✂️ Chunks ──► 🔢 Embed ──► 🗄️ VectorDB
║                                                  ║
║  FASE 2 — CONSULTA (on-line, cada pregunta)      ║
║  ─────────────────────────────────────           ║
║  ❓ Query ──► 🔢 Embed ──► 🔍 Similitud           ║
║                               │                  ║
║                         top-K chunks             ║
║                               │                  ║
║                    🤖 LLM + Contexto              ║
║                               │                  ║
║                         💬 Respuesta              ║
╚══════════════════════════════════════════════════╝

  TIC: "El Estudiante con Biblioteca"
  Busca primero → Lee la fuente → Responde con evidencia
```

```
VARIANTES RAG (2025-2026):
──────────────────────────
  RAG Básico:    Query → 1 búsqueda → LLM → Respuesta
  Self-RAG:      LLM decide SI/NO necesita recuperar
  Agentic RAG:   Agente controla múltiples búsquedas
  GraphRAG:      Usa grafo de conocimiento (relaciones)
  RAPTOR:        Árbol jerárquico de resúmenes
```

---

## IA Local vs IA en la Nube

```
┌─────────────────────┐    ┌─────────────────────┐
│     IA EN NUBE      │    │      IA LOCAL        │
├─────────────────────┤    ├─────────────────────┤
│ ✅ Muy potente      │    │ ✅ Privado/sin nube  │
│ ✅ Sin configurar   │    │ ✅ Sin costo x uso   │
│ ✅ Siempre up       │    │ ✅ Funciona offline  │
│ ❌ Cuesta dinero    │    │ ❌ Necesita GPU/RAM  │
│ ❌ Datos a terceros │    │ ❌ Menos potente     │
│ ❌ Necesita internet│    │ ❌ Hay que instalar  │
│                     │    │                     │
│ OpenAI, Anthropic   │    │ Ollama, LM Studio   │
│ Google, Mistral     │    │ Jan, GPT4All        │
└─────────────────────┘    └─────────────────────┘
```
