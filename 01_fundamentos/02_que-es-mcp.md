# 🔌 ¿Qué es MCP? (Model Context Protocol)

> **MCP es el "USB de la IA" — un estándar que conecta modelos con herramientas.**

---

## El Problema que Resuelve MCP

Antes de MCP, cada empresa hacía su propia integración:
- OpenAI tenía su forma de conectar herramientas (Function Calling)
- Anthropic tenía otra forma
- Cada app que quería usar IA + base de datos = código nuevo desde cero

**Era el caos del año 2000 con los conectores de dispositivos:**
```
¿Te acuerdas cuando cada teléfono tenía su propio cable?
Nokia, Motorola, Sony Ericsson... cada uno diferente 😤

Luego llegó USB y... ¡problema resuelto! 🎉

MCP es el USB de los agentes de IA.
```

---

## ¿Qué es MCP exactamente?

**MCP = Model Context Protocol**

Un **protocolo abierto** (como HTTP, como USB) creado por Anthropic en noviembre 2024 que define:

1. **Cómo** un modelo de IA solicita usar una herramienta
2. **Cómo** una herramienta expone sus capacidades
3. **Cómo** se transfieren datos entre ellos
4. **El formato** de mensajes entre cliente y servidor

---

## Los 3 Elementos de MCP

### 🖥️ MCP Host (el que aloja)
El programa que el usuario usa directamente.
- Claude Desktop
- Claude Code (CLI)
- Cursor (editor de código)
- Continue.dev
- Tu propia aplicación

### 📡 MCP Client (el intermediario)
El componente dentro del host que habla MCP.
- Inicia conexiones con servidores
- Gestiona el protocolo
- Generalmente está embebido en el host

### 🛠️ MCP Server (el que provee herramientas)
Un programa que expone capacidades via MCP:
- Acceso a archivos del sistema
- Conexión a base de datos
- Búsqueda en internet
- Acceso a APIs externas
- Ejecutar código

---

## Cómo Funciona en la Práctica

```
FLUJO DE UNA LLAMADA MCP:

1. Tú preguntas: "¿Cuántas ventas hubo este mes?"

2. El LLM piensa: "Necesito consultar la base de datos"

3. El LLM llama: buscar_ventas(mes="marzo", año="2026")

4. El MCP Client envía la solicitud al MCP Server de base de datos

5. El MCP Server ejecuta: SELECT SUM(total) FROM ventas WHERE...

6. El resultado vuelve al LLM: {"total": 150000, "transacciones": 342}

7. El LLM responde: "Este mes hubo 342 ventas por un total de S/. 150,000"
```

---

## Tipos de Recursos que Expone un MCP Server

### 1. Tools (Herramientas) — El más importante
Funciones que el LLM puede ejecutar:
```json
{
  "name": "buscar_en_base_de_datos",
  "description": "Consulta la base de datos de ventas",
  "inputSchema": {
    "mes": "string",
    "año": "string"
  }
}
```

### 2. Resources (Recursos)
Datos que el LLM puede leer (como archivos, URLs):
```
file:///documentos/reporte.pdf
database://ventas/tabla_productos
```

### 3. Prompts (Plantillas)
Prompts predefinidos que el servidor ofrece:
```
"Genera un resumen ejecutivo de las ventas del período..."
```

---

## MCP Servers Populares (ya existentes)

| Servidor | Qué hace |
|----------|----------|
| `@modelcontextprotocol/server-filesystem` | Lee/escribe archivos |
| `@modelcontextprotocol/server-postgres` | Consulta PostgreSQL |
| `@modelcontextprotocol/server-brave-search` | Búsqueda web |
| `@modelcontextprotocol/server-github` | Maneja repos GitHub |
| `@modelcontextprotocol/server-slack` | Envía mensajes Slack |
| `mcp-server-sqlite` | Consulta SQLite |
| `mcp-pandoc` | Convierte documentos |

**¡Ya hay cientos de servidores MCP creados por la comunidad!**

---

## ¿Dónde se Configura MCP?

En Claude Desktop: `claude_desktop_config.json`
En Claude Code: `settings.json` en `.claude/`

```json
{
  "mcpServers": {
    "mi-base-de-datos": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_URL": "postgresql://localhost/midb"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "@modelcontextprotocol/server-filesystem",
        "/ruta/a/mis/documentos"
      ]
    }
  }
}
```

---

## 🎯 TIC para recordar MCP

**"MCP = El Mesero Universal"**

Imagina un restaurante:
- 🧑‍🍳 **El Chef** (LLM) sabe cocinar pero no va a buscar ingredientes
- 🍽️ **El Mesero** (MCP) lleva los pedidos y trae los ingredientes
- 🏪 **Las Tiendas** (MCP Servers) tienen lo que el chef necesita

Sin el mesero universal (MCP):
- Cada chef tendría que ir a buscar sus propios ingredientes (integración custom)

Con el mesero universal (MCP):
- El mesero habla el mismo idioma con todas las tiendas
- El chef solo pide "necesito tomates" → el mesero sabe cómo conseguirlos

**Recuerda: MCP es el MESERO, no el chef, no la tienda.**

---

## ✅ Checklist de comprensión

- [ ] Puedo explicar por qué existía el problema antes de MCP
- [ ] Entiendo la diferencia entre Host, Client y Server
- [ ] Sé qué tipos de recursos expone un MCP Server
- [ ] Puedo dar ejemplos de MCP Servers reales
- [ ] Entiendo dónde se configura MCP

**→ Siguiente: [03_como-funciona-todo-junto.md](./03_como-funciona-todo-junto.md)**
