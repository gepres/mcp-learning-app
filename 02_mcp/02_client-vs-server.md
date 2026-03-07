# 🔄 MCP Client vs MCP Server: La Diferencia con Ejemplos

> **Una sola pregunta lo resume: ¿quién PIDE o quién RESPONDE?**

---

## La Regla de Oro

```
MCP CLIENT → el que PIDE / LLAMA / CONSUME
MCP SERVER → el que ESCUCHA / EJECUTA / PROVEE
```

---

## Analogía: Restaurante

```
┌─────────────────────────────────────────────────────┐
│                  RESTAURANTE                        │
│                                                     │
│  👤 Cliente (tú)                                    │
│       │  "Quiero una pizza"                         │
│       ▼                                             │
│  🍽️  Mesero [MCP CLIENT]  ← vive DENTRO del Claude │
│       │  "tools/call: hacer_pizza({tipo: margarita})│
│       ▼                                             │
│  👨‍🍳  Cocina  [MCP SERVER] ← proceso SEPARADO       │
│       │  Ejecuta la receta                          │
│       ▼                                             │
│  📦  Resultado: { pizza: "lista", tiempo: "20min" } │
│       │                                             │
│       └──► de vuelta al Mesero → al Cliente         │
└─────────────────────────────────────────────────────┘

El Mesero (Client) NUNCA cocina.
La Cocina (Server) NUNCA habla con el cliente directo.
```

---

## Definiciones Claras

### MCP Client
- **Vive DENTRO** del programa que usas (Claude Desktop, Claude Code, tu app)
- **Inicia** las conexiones hacia los servidores
- **Traduce** lo que el LLM quiere hacer → llamadas MCP
- **Recibe** los resultados y se los pasa al LLM
- **Tú NUNCA lo instalas por separado** — viene integrado

### MCP Server
- **Vive FUERA**, como proceso independiente
- **Espera** que alguien lo llame (nunca inicia conversación)
- **Expone** herramientas, recursos o prompts
- **Ejecuta** la acción real (leer archivo, consultar BD, etc.)
- **Tú LO INSTALAS/CONFIGURAS** — es lo que agregas en settings.json

---

## Ejemplos Concretos

### Ejemplo 1: Claude Code + Filesystem

```
┌─────────────────────────────────────────────────┐
│              Claude Code (el Host)               │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │  Claude (LLM)                           │    │
│  │  "Necesito leer el archivo ventas.csv"  │    │
│  └────────────────┬────────────────────────┘    │
│                   │ le dice al Client           │
│  ┌────────────────▼────────────────────────┐    │
│  │  MCP CLIENT (integrado en Claude Code)  │    │
│  │  Envía: tools/call "read_file"          │    │
│  └────────────────┬────────────────────────┘    │
└───────────────────┼─────────────────────────────┘
                    │ (stdio / proceso separado)
┌───────────────────▼─────────────────────────────┐
│  MCP SERVER: @modelcontextprotocol/server-filesystem
│                                                 │
│  Recibe: { name: "read_file", args: {           │
│    path: "C:/datos/ventas.csv" } }              │
│                                                 │
│  Ejecuta: fs.readFileSync("C:/datos/ventas.csv")│
│                                                 │
│  Responde: { content: "fecha,monto,cliente\n..." }
└─────────────────────────────────────────────────┘

TÚ instalaste/configuraste: el SERVER (server-filesystem)
TÚ NO tocaste: el CLIENT (viene en Claude Code)
```

### Ejemplo 2: Claude Desktop + GitHub

```
TÚ escribes en Claude Desktop:
"¿Cuántos issues abiertos tiene mi repo gepres/ventas?"

[MCP CLIENT - dentro de Claude Desktop]
  → Manda: tools/call "list_issues" { owner: "gepres", repo: "ventas" }

[MCP SERVER - server-github, proceso aparte]
  → Llama a la API de GitHub
  → Devuelve: [{ id: 1, title: "Bug login", ... }, ...]

[MCP CLIENT]
  → Pasa el resultado al LLM

[Claude responde]:
  "Tu repo tiene 7 issues abiertos. El más antiguo es 'Bug login' de hace 3 semanas."
```

### Ejemplo 3: Tu propia app con un server propio

```
Tu app Python (usa MCP Client via SDK)
  │
  │  tools/call "consultar_stock" { producto: "laptop HP" }
  │
  ▼
Tu servidor MCP propio (conectado a tu ERP)
  │
  │  SELECT stock FROM inventario WHERE producto = 'laptop HP'
  │
  ▼
  Responde: { stock: 15, almacen: "Lima", precio: 2500 }

Aquí TÚ eres tanto el que escribe el CLIENT (tu app)
como el que crea el SERVER (conectado a tu ERP).
```

---

## Tabla Comparativa Definitiva

| | MCP CLIENT | MCP SERVER |
|--|-----------|------------|
| **¿Qué es?** | El que llama / pide | El que escucha / responde |
| **¿Dónde vive?** | Dentro del Host (Claude Code, tu app) | Proceso separado / externo |
| **¿Quién lo inicia?** | Siempre el Client | Nunca inicia, solo espera |
| **¿Lo instalas?** | No, viene integrado | Sí, tú lo configuras |
| **Ejemplos reales** | Claude Code, Claude Desktop, Cursor, tu app | server-filesystem, server-postgres, server-github |
| **Habla con** | El LLM + el Server | Solo el Client |
| **Su trabajo** | Traducir peticiones LLM → MCP | Ejecutar la acción real |

---

## Relación con el Host

Un detalle importante: existe un tercer concepto, el **Host**:

```
HOST = El programa que el usuario abre
  └── Contiene al CLIENT integrado
  └── Gestiona la conexión con los SERVERS

Ejemplos de HOST:
  - Claude Desktop
  - Claude Code (el CLI)
  - Cursor (editor de código)
  - Continue.dev (plugin VSCode)
  - Tu app que usas el SDK de MCP

En la práctica, cuando dices "el CLIENT",
casi siempre te refieres al par HOST+CLIENT juntos.
```

---

## ¿Puedo tener varios Servers a la vez?

Sí, y es lo normal:

```json
{
  "mcpServers": {
    "archivos":   { "command": "npx", "args": ["server-filesystem", "/docs"] },
    "postgres":   { "command": "npx", "args": ["server-postgres"], "env": {...} },
    "github":     { "command": "npx", "args": ["server-github"], "env": {...} },
    "busqueda":   { "command": "npx", "args": ["server-brave-search"], "env": {...} }
  }
}
```

```
Un solo MCP CLIENT en Claude Code
  ├── conectado a server-filesystem  (proceso 1)
  ├── conectado a server-postgres    (proceso 2)
  ├── conectado a server-github      (proceso 3)
  └── conectado a server-brave-search (proceso 4)

Claude elige automáticamente cuál usar según la tarea.
```

---

## 🎯 TIC para recordar

**"C-S = Cliente-Servidor = Camarero-Cocina"**

- **C**amarero (Client): recibe el pedido del cliente (LLM), lo lleva a la cocina, trae el resultado
- **C**ocina (Server): recibe el pedido del camarero, cocina (ejecuta), devuelve el plato

**Regla rápida**:
- ¿Lo configuro en settings.json? → Es un **SERVER**
- ¿Viene integrado y no lo toco? → Es el **CLIENT**

---

## ✅ Checklist de comprensión

- [ ] Sé que el Client vive DENTRO del host (Claude Code, etc.)
- [ ] Sé que el Server es un proceso SEPARADO que yo configuro
- [ ] Puedo nombrar 3 ejemplos de Hosts reales
- [ ] Puedo nombrar 3 ejemplos de Servers reales
- [ ] Entiendo que puedo tener múltiples Servers a la vez
- [ ] Sé que el Server nunca inicia la conversación, solo espera
