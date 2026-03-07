# 🎯 MCP: ¿Usarlo o Crearlo? La Distinción Clave

> **Respuesta corta: el 90% del tiempo solo USAS servidores ya creados.**

---

## Los 3 Niveles de MCP

```
NIVEL 1: EL PROTOCOLO (ya existe — Anthropic lo creó)
  └── Tú no tocas esto. Es como HTTP o USB.
      Solo existe y las herramientas lo hablan.

NIVEL 2: SERVIDORES MCP YA HECHOS (solo configuras)
  └── Cientos de servidores listos para instalar.
      Configuras en un archivo JSON y listo.
      ← AQUÍ vives el 90% del tiempo

NIVEL 3: CREAR TU PROPIO SERVIDOR (opcional / avanzado)
  └── Solo cuando tu sistema específico no tiene
      servidor MCP existente aún.
      ← Solo el 10% de los casos
```

---

## Nivel 2: Usar Servidores Existentes (lo normal)

### Paso 1: Busca el servidor que necesitas
```
Repositorio oficial: github.com/modelcontextprotocol/servers

Servidores oficiales disponibles:
  @modelcontextprotocol/server-filesystem   → archivos del disco
  @modelcontextprotocol/server-postgres     → PostgreSQL
  @modelcontextprotocol/server-github       → repositorios GitHub
  @modelcontextprotocol/server-slack        → mensajes Slack
  @modelcontextprotocol/server-brave-search → búsqueda web
  @modelcontextprotocol/server-google-maps  → mapas y lugares
  @modelcontextprotocol/server-puppeteer    → navegador web
  @modelcontextprotocol/server-sqlite       → SQLite local
  ...y muchos más de la comunidad
```

### Paso 2: Configura en Claude Code

No instalas nada manualmente. Solo edita `.claude/settings.json`:

```json
{
  "mcpServers": {

    "mis-archivos": {
      "command": "npx",
      "args": [
        "@modelcontextprotocol/server-filesystem",
        "C:/mis-documentos"
      ]
    },

    "mi-base-datos": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_URL": "postgresql://user:pass@localhost/mibd"
      }
    },

    "github": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_tutoken"
      }
    }

  }
}
```

### Paso 3: Reinicia Claude Code y úsalo

```
Tú: "Lee el archivo ventas.xlsx de mis documentos"
Claude: [usa el servidor filesystem automáticamente]
        "El archivo contiene 3 hojas: Enero, Febrero, Marzo..."

Tú: "¿Cuántos issues abiertos tiene mi repo?"
Claude: [usa el servidor github automáticamente]
        "El repositorio tiene 12 issues abiertos..."
```

**Sin código. Sin instalación manual. Solo config JSON.**

---

## Analogía: Wi-Fi

```
MCP Protocolo = El estándar Wi-Fi (802.11)
  └── Ya existe, no lo inventas

Servidores MCP = Los routers/dispositivos disponibles
  └── Los compras/descargas ya hechos

Configurar MCP = Conectarte a una red Wi-Fi
  └── Solo ingresas nombre + contraseña (el JSON)

Crear un MCP Server = Fabricar tu propio router
  └── Solo si necesitas algo muy específico
```

---

## ¿Cuándo SÍ necesitas crear tu propio servidor?

Solo en estos casos:

| Situación | ¿Crear servidor? |
|-----------|------------------|
| Quiero que Claude lea mis archivos | ❌ Usa `server-filesystem` |
| Quiero que Claude consulte mi PostgreSQL | ❌ Usa `server-postgres` |
| Quiero que Claude busque en internet | ❌ Usa `server-brave-search` |
| Quiero conectar mi ERP hecho a medida | ✅ Sí, crea un servidor |
| Quiero exponer lógica de negocio propia | ✅ Sí, crea un servidor |
| Quiero aprender cómo funciona por dentro | ✅ (ejercicio educativo) |

---

## Directorio de Servidores MCP

Además de los oficiales, la comunidad ha creado cientos:

```
Búscalos en:
  → github.com/modelcontextprotocol/servers  (oficiales)
  → mcp.so                                   (directorio comunidad)
  → glama.ai/mcp/servers                     (otro directorio)
  → smithery.ai                              (directorio + instalador)

Ejemplos de servidores de la comunidad:
  mcp-server-notion      → Notion
  mcp-server-jira        → Jira
  mcp-server-excel       → Excel/spreadsheets
  mcp-server-discord     → Discord
  mcp-server-linear      → Linear (gestión proyectos)
  mcp-server-airtable    → Airtable
```

---

## 🎯 TIC actualizado: MCP = "El Enchufe Estándar"

```
Antes (sin MCP):
  Cada aparato eléctrico necesitaba su propio
  tipo de enchufe. Caos total.

Con MCP:
  Un estándar único. Cada "aparato" (herramienta)
  ya viene con el enchufe MCP listo.
  Tú solo enchufas (configuras en JSON).

Crear servidor MCP =
  Diseñar un aparato nuevo que use ese estándar.
  Solo necesario si el aparato no existe aún.
```

---

## ✅ Resumen

- MCP **el protocolo** → Ya existe, lo usa el ecosistema
- MCP **servidores** → Ya hay cientos, solo configuras
- MCP **crear servidor** → Solo si tu herramienta específica no existe
- **El 90% del tiempo**: editas un JSON y ya puedes usarlo

**→ Siguiente: [CHEATSHEET.md](../CHEATSHEET.md) para ver todos los servidores disponibles**
