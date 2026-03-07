# 🛠️ Práctica 1: Tu Primer Servidor MCP

> **Objetivo**: Crear un servidor MCP simple que el agente pueda usar.

---

## ¿Qué vas a construir?

Un servidor MCP con 3 herramientas:
1. `saludar(nombre)` → devuelve un saludo personalizado
2. `calcular(operacion, a, b)` → hace operaciones matemáticas
3. `obtener_hora()` → devuelve la hora actual en Lima/Perú

Implementado en **dos versiones**: JavaScript y Python.

---

## Opción A — JavaScript (Node.js)

### Prerequisitos

```bash
# Verifica que tienes Node.js instalado:
node --version  # Necesitas v18+
```

---

## Paso 1: Inicializar el proyecto

```bash
# En esta carpeta:
npm init -y
npm install @modelcontextprotocol/sdk
```

Luego **edita el `package.json`** que se generó y agrega `"type": "module"`.
Sin esto, Node no entiende los `import` y lanzará un error de sintaxis.

```json
{
  "name": "mi-primer-servidor-mcp",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node servidor.js"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0"
  }
}
```

> ⚠️ `"type": "module"` es obligatorio porque el código usa `import` en vez
> de `require`. Si lo omites verás: *SyntaxError: Cannot use import statement
> in a module*.

---

## Paso 2: Crear el servidor

Crea el archivo `servidor.js`:

```javascript
// servidor.js
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// ============================================
// CREAMOS EL SERVIDOR
// ============================================
const server = new Server(
  {
    name: "mi-primer-servidor-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},  // Este servidor tiene herramientas
    },
  }
);

// ============================================
// DEFINIMOS LAS HERRAMIENTAS (tools/list)
// ============================================
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "saludar",
        description: "Saluda a una persona por su nombre",
        inputSchema: {
          type: "object",
          properties: {
            nombre: {
              type: "string",
              description: "El nombre de la persona a saludar",
            },
          },
          required: ["nombre"],
        },
      },
      {
        name: "calcular",
        description: "Realiza operaciones matemáticas básicas",
        inputSchema: {
          type: "object",
          properties: {
            operacion: {
              type: "string",
              enum: ["suma", "resta", "multiplicacion", "division"],
              description: "La operación a realizar",
            },
            a: { type: "number", description: "Primer número" },
            b: { type: "number", description: "Segundo número" },
          },
          required: ["operacion", "a", "b"],
        },
      },
      {
        name: "obtener_hora",
        description: "Obtiene la hora actual en Lima, Perú",
        inputSchema: {
          type: "object",
          properties: {},  // Sin parámetros
        },
      },
    ],
  };
});

// ============================================
// IMPLEMENTAMOS LAS HERRAMIENTAS (tools/call)
// ============================================
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  // HERRAMIENTA 1: saludar
  if (name === "saludar") {
    const { nombre } = args;
    return {
      content: [
        {
          type: "text",
          text: `¡Hola ${nombre}! 👋 Bienvenido al mundo de MCP.`,
        },
      ],
    };
  }

  // HERRAMIENTA 2: calcular
  if (name === "calcular") {
    const { operacion, a, b } = args;
    let resultado;

    switch (operacion) {
      case "suma":         resultado = a + b; break;
      case "resta":        resultado = a - b; break;
      case "multiplicacion": resultado = a * b; break;
      case "division":
        if (b === 0) {
          return {
            isError: true,
            content: [{ type: "text", text: "Error: División por cero" }],
          };
        }
        resultado = a / b;
        break;
    }

    return {
      content: [
        {
          type: "text",
          text: `${a} ${operacion} ${b} = ${resultado}`,
        },
      ],
    };
  }

  // HERRAMIENTA 3: obtener_hora
  if (name === "obtener_hora") {
    const ahora = new Date();
    const horaLima = ahora.toLocaleString("es-PE", {
      timeZone: "America/Lima",
      dateStyle: "full",
      timeStyle: "medium",
    });
    return {
      content: [
        {
          type: "text",
          text: `Hora actual en Lima: ${horaLima}`,
        },
      ],
    };
  }

  // Herramienta no encontrada
  throw new Error(`Herramienta desconocida: ${name}`);
});

// ============================================
// INICIAMOS EL SERVIDOR
// ============================================
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("✅ Servidor MCP iniciado y esperando solicitudes...");
}

main().catch(console.error);
```

---

## Paso 3: Configurar en Claude Code (JavaScript)

Edita `.claude/settings.json` en tu carpeta de usuario:

```json
{
  "mcpServers": {
    "mi-primer-servidor": {
      "command": "node",
      "args": ["D:/PROYECTOS/gepres/entrenamiento/MCP-agentes/02_mcp/practica_01_primer-servidor-mcp/servidor.js"]
    }
  }
}
```

---

## Paso 4: Probar con el Inspector MCP (JavaScript)

```bash
# Instala y abre el inspector:
npx @modelcontextprotocol/inspector node servidor.js

# Se abrirá en: http://localhost:5173
```

---

## Paso 5: Verificar en Claude Code (aplica a ambas versiones)

Reinicia Claude Code y pregunta:
```
"¿Qué herramientas tienes disponibles?"
"Salúdame con mi nombre: Carlos"
"¿Cuánto es 127 multiplicado por 43?"
"¿Qué hora es en Lima ahora?"
```

---

---

## Opción B — Python

### Prerequisitos

```bash
# Verifica que tienes Python 3.10+:
python --version

# Instala el SDK MCP para Python:
pip install mcp pytz
```

---

## Paso 1: Crear el servidor Python

Crea el archivo `servidor.py`:

```python
# servidor.py
from mcp.server.fastmcp import FastMCP
from datetime import datetime
import pytz

# ============================================
# CREAMOS EL SERVIDOR
# ============================================
mcp = FastMCP("mi-primer-servidor-mcp")

# ============================================
# HERRAMIENTA 1: saludar
# ============================================
@mcp.tool()
def saludar(nombre: str) -> str:
    """Saluda a una persona por su nombre"""
    return f"¡Hola {nombre}! 👋 Bienvenido al mundo de MCP."

# ============================================
# HERRAMIENTA 2: calcular
# ============================================
@mcp.tool()
def calcular(operacion: str, a: float, b: float) -> str:
    """Realiza operaciones matemáticas básicas.
    Operaciones disponibles: suma, resta, multiplicacion, division
    """
    if operacion == "suma":
        return f"{a} + {b} = {a + b}"
    elif operacion == "resta":
        return f"{a} - {b} = {a - b}"
    elif operacion == "multiplicacion":
        return f"{a} × {b} = {a * b}"
    elif operacion == "division":
        if b == 0:
            return "Error: División por cero"
        return f"{a} ÷ {b} = {a / b}"
    return f"Operación desconocida: {operacion}"

# ============================================
# HERRAMIENTA 3: obtener_hora
# ============================================
@mcp.tool()
def obtener_hora() -> str:
    """Obtiene la hora actual en Lima, Perú"""
    lima_tz = pytz.timezone("America/Lima")
    ahora = datetime.now(lima_tz)
    return f"Hora actual en Lima: {ahora.strftime('%A, %d de %B de %Y, %H:%M:%S')}"

# ============================================
# INICIAMOS EL SERVIDOR
# ============================================
if __name__ == "__main__":
    print("✅ Servidor MCP Python iniciado...", flush=True)
    mcp.run()
```

> 💡 **Ventaja de Python**: Con `FastMCP` y el decorador `@mcp.tool()`, el código
> es mucho más corto. FastMCP lee el nombre, descripción y parámetros directamente
> del código Python (tipo de dato, docstring).

---

## Paso 2: Configurar en Claude Code (Python)

Edita `.claude/settings.json`:

```json
{
  "mcpServers": {
    "mi-primer-servidor-python": {
      "command": "python",
      "args": ["D:/PROYECTOS/gepres/entrenamiento/MCP-agentes/02_mcp/practica_01_primer-servidor-mcp/servidor.py"]
    }
  }
}
```

---

## Paso 3: Probar con el Inspector MCP (Python)

```bash
# Instala el inspector MCP:
npx @modelcontextprotocol/inspector python servidor.py
```

---

## Diferencias JS vs Python

| Aspecto | JavaScript | Python (FastMCP) |
|---------|-----------|-----------------|
| Instalar | `npm install @modelcontextprotocol/sdk` | `pip install mcp pytz` |
| Definir herramienta | Objeto JSON manual en `ListToolsRequestSchema` | `@mcp.tool()` decorador |
| Implementar herramienta | Handler en `CallToolRequestSchema` | La misma función decorada |
| Archivo config | `"type": "module"` en package.json | No necesita nada extra |
| Verbosidad | ~200 líneas | ~50 líneas |
| Descripción de tool | Escrita manualmente en JSON | Tomada del docstring |
| Tipos de parámetros | JSON Schema manual | Inferidos de type hints |

**Regla**: Ambos funcionan igual con Claude Code. Elige el lenguaje que ya conoces.

---

## 🎯 ¿Qué aprendiste?

- Cómo un servidor MCP expone herramientas (ListTools)
- Cómo implementa la ejecución (CallTool)
- Cómo se configura en Claude Code
- El formato de request/response

---

## 🔍 Experimenta

1. Agrega una nueva herramienta: `convertir_moneda(monto, de, a)`
2. Agrega una herramienta que lea un archivo de texto
3. ¿Qué pasa si tu herramienta tarda 5 segundos? (simula con `await sleep(5000)`)

**→ Siguiente: [02_mcp/02_servidores-mcp.md](../02_servidores-mcp.md)**
