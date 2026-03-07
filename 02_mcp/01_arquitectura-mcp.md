# 🏗️ Arquitectura MCP en Profundidad

---

## El Ciclo de Vida de un MCP Server

```
1. INICIO
   └── El MCP Client lanza el servidor como proceso
       $ node mi-servidor-mcp.js

2. HANDSHAKE (saludo inicial)
   └── Client envía: initialize (con versión del protocolo)
   └── Server responde: capabilities (qué puede hacer)

3. DESCUBRIMIENTO
   └── Client pide: tools/list
   └── Server responde: lista de todas sus herramientas con esquemas

4. USO (repetido según necesidad)
   └── Client pide: tools/call { name, arguments }
   └── Server ejecuta y responde: result

5. CIERRE
   └── El proceso termina (o el cliente desconecta)
```

---

## Ciclo de Vida de las Capacidades

### Lista de herramientas (tools/list)
```json
// Client pregunta:
{ "method": "tools/list" }

// Server responde con sus herramientas:
{
  "tools": [
    {
      "name": "obtener_clima",
      "description": "Consulta el clima actual de una ciudad",
      "inputSchema": {
        "type": "object",
        "properties": {
          "ciudad": {
            "type": "string",
            "description": "Nombre de la ciudad"
          },
          "unidad": {
            "type": "string",
            "enum": ["celsius", "fahrenheit"],
            "default": "celsius"
          }
        },
        "required": ["ciudad"]
      }
    }
  ]
}
```

### Llamada a herramienta (tools/call)
```json
// Client llama la herramienta:
{
  "method": "tools/call",
  "params": {
    "name": "obtener_clima",
    "arguments": {
      "ciudad": "Lima",
      "unidad": "celsius"
    }
  }
}

// Server ejecuta y responde:
{
  "result": {
    "content": [{
      "type": "text",
      "text": "Lima: 24°C, Parcialmente nublado, Humedad 78%"
    }]
  }
}
```

---

## Tipos de Respuesta de un MCP Server

Un servidor puede devolver diferentes tipos de contenido:

```json
// Texto plano:
{ "type": "text", "text": "El resultado es 42" }

// Imagen (base64):
{ "type": "image", "data": "iVBORw0...", "mimeType": "image/png" }

// Recurso (referencia):
{ "type": "resource", "resource": { "uri": "file:///datos.json" } }

// Error:
{ "isError": true, "content": [{ "type": "text", "text": "Error: DB no disponible" }] }
```

---

## Seguridad en MCP

### Principio de mínimo privilegio
Un MCP Server debe tener acceso **solo** a lo que necesita:

```json
// MAL ❌ - acceso a todo el sistema de archivos
{
  "command": "npx",
  "args": ["@modelcontextprotocol/server-filesystem", "/"]
}

// BIEN ✅ - acceso solo a la carpeta del proyecto
{
  "command": "npx",
  "args": ["@modelcontextprotocol/server-filesystem", "/proyectos/mi-app"]
}
```

### Consideraciones de seguridad
1. **Sandboxing**: Los servidores MCP locales corren como procesos separados
2. **Sin red por defecto**: stdio no tiene acceso a red
3. **Aprobación del usuario**: Claude Code pide permiso antes de acciones destructivas
4. **Variables de entorno**: Las credenciales van en `env`, no en los argumentos

---

## Configuración Completa en Claude Code

```json
// .claude/settings.json
{
  "mcpServers": {

    // Servidor de archivos (local, stdio)
    "archivos": {
      "command": "npx",
      "args": [
        "@modelcontextprotocol/server-filesystem",
        "/d/PROYECTOS/mi-proyecto"
      ]
    },

    // Base de datos PostgreSQL (local, stdio)
    "base-de-datos": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_URL": "postgresql://user:pass@localhost:5432/midb"
      }
    },

    // Búsqueda web (requiere API key)
    "busqueda": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-brave-search"],
      "env": {
        "BRAVE_API_KEY": "tu-api-key-aqui"
      }
    },

    // Servidor HTTP remoto
    "mi-api": {
      "url": "http://localhost:3000/mcp",
      "transport": "http"
    }
  }
}
```

---

## Cómo Depurar un MCP Server

### Ver los logs
```bash
# En Claude Code, los logs de MCP aparecen en:
# ~/.claude/logs/mcp-*.log

# Ver en tiempo real:
tail -f ~/.claude/logs/mcp-servidor.log
```

### Probar un servidor manualmente
```bash
# Instalar MCP Inspector (herramienta oficial de debug)
npx @modelcontextprotocol/inspector

# Conectar a tu servidor:
npx @modelcontextprotocol/inspector node mi-servidor.js
```

El inspector muestra una interfaz web donde puedes:
- Ver todas las herramientas disponibles
- Llamar herramientas manualmente
- Ver los mensajes JSON-RPC en tiempo real

---

## 🎯 TIC para recordar la arquitectura

**"IHDU" = Inicio, Handshake, Descubrimiento, Uso**

Como cuando llamas a alguien:
1. **I**nicio → Marcas el número (lanzas el servidor)
2. **H**andshake → "Hola, ¿con quién hablo?" (initialize)
3. **D**escubrimiento → "¿Qué puedes hacer por mí?" (tools/list)
4. **U**so → "Necesito que hagas X" (tools/call)

**Recuerda**: IHDU suena como "¡Uh, dú!" (sorpresa al descubrir las capacidades)

---

## ✅ Ejercicio Práctico

Ve a la carpeta `practica_01_primer-servidor-mcp/` para crear tu primer servidor MCP.

**→ Siguiente: [practica_01_primer-servidor-mcp/README.md](./practica_01_primer-servidor-mcp/README.md)**
