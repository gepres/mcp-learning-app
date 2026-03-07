# 🏆 Proyecto Final: Sistema de Análisis de Documentos con IA

> **Integra todo lo aprendido en un proyecto real.**

---

## El Proyecto

Construirás un **Sistema de Q&A sobre documentos de empresa** que:

1. **MCP Server** → expone documentos al agente
2. **Agente con Claude** → responde preguntas sobre los docs
3. **n8n** → automatiza el ingreso de nuevos documentos
4. **IA Local** → opción de usar Ollama en vez de Claude

---

## Arquitectura del Sistema

```
[Documentos nuevos]
        │
        ▼
[n8n: detecta nuevo archivo]
        │
        ▼
[n8n: extrae texto y chunks]
        │
        ▼
[n8n: guarda en base de conocimiento]
        │
        (cuando llega una pregunta)
        │
        ▼
[Usuario hace pregunta]
        │
        ▼
[Claude Code / Tu App]
        │ (usa MCP)
        ▼
[MCP Server: busca docs relevantes]
        │
        ▼
[LLM: responde con contexto]
        │
        ▼
[Respuesta al usuario]
```

---

## Parte 1: El MCP Server de Documentos

Disponible en **JavaScript** y **Python**. Elige uno.

### Opción A: JavaScript — `servidor-docs.js`

```javascript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import fs from "fs";
import path from "path";

const DOCS_DIR = "./documentos";

const server = new Server({ name: "servidor-docs", version: "1.0.0" }, { capabilities: { tools: {} } });

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "listar_documentos",
      description: "Lista todos los documentos disponibles",
      inputSchema: { type: "object", properties: {} }
    },
    {
      name: "leer_documento",
      description: "Lee el contenido de un documento por su nombre",
      inputSchema: {
        type: "object",
        properties: {
          nombre: { type: "string", description: "Nombre del archivo" }
        },
        required: ["nombre"]
      }
    },
    {
      name: "buscar_en_documentos",
      description: "Busca un término en todos los documentos",
      inputSchema: {
        type: "object",
        properties: {
          termino: { type: "string", description: "Término a buscar" }
        },
        required: ["termino"]
      }
    }
  ]
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "listar_documentos") {
    const archivos = fs.readdirSync(DOCS_DIR).filter(f => f.endsWith(".txt") || f.endsWith(".md"));
    return { content: [{ type: "text", text: archivos.join("\n") || "No hay documentos." }] };
  }

  if (name === "leer_documento") {
    const ruta = path.join(DOCS_DIR, args.nombre);
    const contenido = fs.readFileSync(ruta, "utf-8");
    return { content: [{ type: "text", text: contenido }] };
  }

  if (name === "buscar_en_documentos") {
    const archivos = fs.readdirSync(DOCS_DIR);
    const resultados = [];
    for (const archivo of archivos) {
      const contenido = fs.readFileSync(path.join(DOCS_DIR, archivo), "utf-8");
      if (contenido.toLowerCase().includes(args.termino.toLowerCase())) {
        const lineas = contenido.split("\n").filter(l => l.toLowerCase().includes(args.termino.toLowerCase()));
        resultados.push(`📄 ${archivo}:\n${lineas.slice(0, 3).join("\n")}`);
      }
    }
    return { content: [{ type: "text", text: resultados.join("\n---\n") || "Sin resultados." }] };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
```

> Requisitos: `npm init -y` + `"type": "module"` + `npm install @modelcontextprotocol/sdk`

---

### Opción B: Python — `servidor_docs.py`

```python
# servidor_docs.py
from mcp.server.fastmcp import FastMCP
import os
import pathlib

mcp = FastMCP("servidor-docs")
DOCS_DIR = pathlib.Path("./documentos")

@mcp.tool()
def listar_documentos() -> str:
    """Lista todos los documentos disponibles en la base de conocimiento."""
    if not DOCS_DIR.exists():
        return "La carpeta 'documentos' no existe."
    archivos = [f.name for f in DOCS_DIR.iterdir() if f.suffix in (".txt", ".md")]
    return "\n".join(archivos) if archivos else "No hay documentos."

@mcp.tool()
def leer_documento(nombre: str) -> str:
    """Lee el contenido de un documento por su nombre de archivo."""
    ruta = DOCS_DIR / nombre
    if not ruta.exists():
        return f"Documento '{nombre}' no encontrado."
    return ruta.read_text(encoding="utf-8")

@mcp.tool()
def buscar_en_documentos(termino: str) -> str:
    """Busca un término en todos los documentos disponibles.
    Devuelve las líneas que contienen el término, por documento.
    """
    if not DOCS_DIR.exists():
        return "La carpeta 'documentos' no existe."

    resultados = []
    for archivo in DOCS_DIR.iterdir():
        if archivo.suffix not in (".txt", ".md"):
            continue
        contenido = archivo.read_text(encoding="utf-8")
        lineas_match = [
            l for l in contenido.splitlines()
            if termino.lower() in l.lower()
        ]
        if lineas_match:
            resultados.append(f"📄 {archivo.name}:\n" + "\n".join(lineas_match[:3]))

    return "\n---\n".join(resultados) if resultados else "Sin resultados."

if __name__ == "__main__":
    mcp.run()
```

> Requisitos: `pip install mcp`

Configurar en Claude Code:
```json
{
  "mcpServers": {
    "documentos-empresa-python": {
      "command": "python",
      "args": ["./servidor_docs.py"]
    }
  }
}
```

---

## Parte 2: Documentos de Prueba

Crea la carpeta `documentos/` con archivos de ejemplo:

```markdown
# documentos/politicas-empresa.md
# Políticas de la Empresa XYZ

## Vacaciones
Los empleados tienen derecho a 30 días de vacaciones anuales...

## Horarios
El horario de trabajo es de lunes a viernes de 8am a 6pm...
```

```markdown
# documentos/manual-productos.md
# Manual de Productos

## Producto A: Software de Gestión
Precio: S/. 299/mes
Características: módulo de ventas, inventario, reportes...
```

---

## Parte 3: Configurar Claude Code

```json
// .claude/settings.json
{
  "mcpServers": {
    "documentos-empresa": {
      "command": "node",
      "args": ["./servidor-docs.js"]
    }
  }
}
```

---

## Parte 4: El Flujo n8n de Ingesta

Crea un workflow n8n que:
1. **Watch Folder**: Monitorea la carpeta `/documentos`
2. **Filter**: Solo archivos `.txt` y `.md` nuevos
3. **Read File**: Lee el contenido
4. **AI Node**: Extrae metadata (resumen, palabras clave)
5. **Write File**: Guarda el archivo procesado

---

## Parte 5: Probar Todo Junto

Con Claude Code, prueba:

```
"¿Cuántos días de vacaciones tenemos?"
→ Claude busca en documentos y responde

"¿Cuáles son los precios del Producto A?"
→ Claude lee el manual y responde

"Busca todo lo relacionado con 'horarios'"
→ Claude usa buscar_en_documentos
```

---

## Parte 6 (Bonus): Versión Local con Ollama

Reemplaza Claude por Ollama en el stack:

```python
# app_local.py
from langchain_ollama import ChatOllama
from langchain_mcp_adapters.client import MultiServerMCPClient

# Conecta al mismo MCP server
mcp_client = MultiServerMCPClient({
    "documentos": {
        "command": "node",
        "args": ["./servidor-docs.js"],
        "transport": "stdio"
    }
})

# Usa Ollama en vez de Claude
llm = ChatOllama(model="llama3.1:8b")

# El agente usa las mismas herramientas MCP pero con modelo local
```

---

## ✅ Has completado el proyecto si...

- [ ] El MCP Server lista y busca en documentos
- [ ] Claude Code puede hacer preguntas y obtener respuestas correctas
- [ ] n8n ingesta nuevos documentos automáticamente
- [ ] (Bonus) La versión local con Ollama funciona

---

## 🏅 ¡Felicitaciones!

Has construido un sistema real que integra:
- **MCP**: protocolo de herramientas
- **Agente**: razonamiento + herramientas
- **n8n**: automatización de ingesta
- **IA Local/Cloud**: flexibilidad de modelo

**Esto es exactamente lo que usan equipos profesionales en producción.**
