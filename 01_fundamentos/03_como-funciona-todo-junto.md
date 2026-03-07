# 🔗 Cómo Funciona Todo Junto

> **El cuadro completo: Tú → Agente → MCP → Herramientas**

---

## El Flujo Completo Paso a Paso

Usemos un ejemplo real: *"Analiza mis ventas de enero y manda el resumen por Slack"*

```
PASO 1: TÚ hablas con el Agente
────────────────────────────────
Tu mensaje → Claude Code / Claude Desktop / Tu App

PASO 2: El Agente PLANIFICA
────────────────────────────────
El LLM piensa:
  "Para esto necesito:
   1. Leer datos de ventas (tool: consultar_db)
   2. Analizar los datos (lo hago yo)
   3. Enviar a Slack (tool: enviar_slack)"

PASO 3: El Agente EJECUTA herramienta 1
────────────────────────────────
LLM → [MCP Client] → [MCP Server: PostgreSQL]
      "consultar_ventas(mes=enero)"
                           ↓
                    Retorna: [{ventas...}]

PASO 4: El Agente RAZONA con los datos
────────────────────────────────
"Las ventas de enero fueron: Total S/.45,000
 Mejor producto: Laptop HP (150 unidades)
 Crecimiento vs diciembre: +12%"

PASO 5: El Agente EJECUTA herramienta 2
────────────────────────────────
LLM → [MCP Client] → [MCP Server: Slack]
      "enviar_mensaje(canal='#ventas', texto='...')"
                           ↓
                    Retorna: {ok: true}

PASO 6: El Agente RESPONDE
────────────────────────────────
"Análisis completado. Envié el resumen a #ventas en Slack."
```

---

## Diagrama Técnico del Protocolo

```
┌────────────────────────────────────────────────────────┐
│                   MCP HOST                             │
│                                                        │
│  ┌──────────────┐         ┌──────────────────────┐     │
│  │   USUARIO    │◄───────►│       LLM            │     │
│  └──────────────┘         │  (Claude/GPT/Gemini) │     │
│                           └──────────┬───────────┘     │
│                                      │                 │
│                           ┌──────────▼───────────┐     │
│                           │    MCP CLIENT        │     │
│                           │  (gestiona protocolo)│     │
│                           └──────────┬───────────┘     │
└──────────────────────────────────────┼─────────────────┘
                                       │ (stdio o HTTP/SSE)
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
          ┌─────────▼──────┐  ┌────────▼───────┐  ┌──────▼───────┐
          │  MCP Server 1  │  │  MCP Server 2  │  │ MCP Server 3 │
          │   Filesystem   │  │   PostgreSQL   │  │    Slack     │
          └────────────────┘  └────────────────┘  └──────────────┘
```

---

## Transporte: ¿Cómo viajan los mensajes?

MCP soporta dos formas de comunicación:

### stdio (Standard Input/Output)
- El servidor corre como **proceso local** en tu máquina
- La comunicación es por stdin/stdout (texto plano)
- Ideal para herramientas locales (archivos, bases de datos locales)
- **La forma más común y segura**

```bash
# Así arranca un servidor MCP local:
npx @modelcontextprotocol/server-filesystem /mis/documentos
# El proceso queda escuchando por stdin
```

### HTTP + SSE (Server-Sent Events)
- El servidor corre en **red** (puede ser remoto)
- Comunicación por HTTP con streaming
- Ideal para servicios remotos, microservicios
- Permite servidores compartidos

---

## El Formato de Mensajes (JSON-RPC 2.0)

MCP usa JSON-RPC 2.0. No necesitas memorizarlo, pero ayuda entenderlo:

```json
// El LLM pide ejecutar una herramienta:
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "buscar_ventas",
    "arguments": {
      "mes": "enero",
      "año": "2026"
    }
  }
}

// El servidor responde:
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "{\"total\": 45000, \"transacciones\": 230}"
      }
    ]
  }
}
```

---

## ¿Qué hace Claude Code diferente?

Claude Code es un **agente completo** que ya viene con muchas herramientas built-in:

| Herramienta | Qué hace |
|-------------|----------|
| `Read` | Lee archivos del sistema |
| `Write` | Crea/sobreescribe archivos |
| `Edit` | Modifica partes de un archivo |
| `Bash` | Ejecuta comandos en terminal |
| `Grep` | Busca texto en archivos |
| `Glob` | Busca archivos por patrón |
| `WebFetch` | Obtiene contenido web |
| `WebSearch` | Busca en internet |
| `Agent` | Lanza sub-agentes especializados |

Y **además** puede conectarse a MCP Servers externos para más capacidades.

---

## ¿Cuándo usar qué?

```
¿Qué necesitas?
│
├── Hablar con IA y que haga tareas complejas
│   └── USA: Claude Code, Claude Desktop + MCP Servers
│
├── Automatizar flujos sin código
│   └── USA: n8n + nodo de IA
│
├── Construir tu propia app con IA
│   └── USA: API de Anthropic/OpenAI + LangChain/LangGraph
│
├── Privacidad y sin costo por uso
│   └── USA: Ollama + tu app local
│
└── Sistema de múltiples agentes colaborando
    └── USA: CrewAI, LangGraph, AutoGen
```

---

## 🎯 TIC para recordar el flujo

**"OPERA" = Observa, Planifica, Ejecuta, Razona, Avanza**

1. **O**bserva → el agente recibe tu tarea
2. **P**lanifica → decide qué herramientas usar
3. **E**jecuta → llama las herramientas via MCP
4. **R**azona → procesa los resultados
5. **A**vanza → responde o vuelve al paso 2

**"OPERA como un director de orquesta que dirige músicos (herramientas)"**

---

## ✅ Checklist de comprensión

- [ ] Puedo trazar el flujo completo de una tarea de agente
- [ ] Entiendo la diferencia entre stdio y HTTP/SSE
- [ ] Sé qué herramientas tiene Claude Code built-in
- [ ] Sé cuándo usar agentes vs n8n vs API directa

**→ Siguiente módulo: [02_mcp/01_arquitectura-mcp.md](../02_mcp/01_arquitectura-mcp.md)**
