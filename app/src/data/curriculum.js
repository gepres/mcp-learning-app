// ──────────────────────────────────────────────────────────────
// CONTENIDO DE CADA LECCIÓN (markdown embebido)
// ──────────────────────────────────────────────────────────────

const CONTENT = {
  clientVsServer: `# 🔄 MCP Client vs MCP Server

> **Una sola pregunta lo resume: ¿quién PIDE o quién RESPONDE?**

## La Regla de Oro

\`\`\`
MCP CLIENT → el que PIDE / LLAMA / CONSUME
MCP SERVER → el que ESCUCHA / EJECUTA / PROVEE
\`\`\`

## Analogía: Restaurante

\`\`\`viz:restaurant
👤 Tú (el usuario)
     │  "Quiero saber cuántos clientes hay en la BD"
     ▼
🍽️  Mesero  [MCP CLIENT]  ← vive DENTRO de Claude Code
     │  tools/call: contar_clientes()
     ▼
👨‍🍳  Cocina  [MCP SERVER] ← proceso SEPARADO que tú configuras
     │  Ejecuta: SELECT COUNT(*) FROM clientes
     ▼
📦  Resultado: { total: 1432 }
     │
     └──► al Mesero → al LLM → Claude responde
\`\`\`

**El Mesero (Client) nunca cocina.**
**La Cocina (Server) nunca habla directo con el cliente.**

## Definición directa

| | MCP CLIENT | MCP SERVER |
|--|-----------|------------|
| **¿Qué es?** | El que llama / pide | El que escucha / ejecuta |
| **¿Dónde vive?** | Dentro del Host | Proceso separado |
| **¿Lo instalas tú?** | ❌ Viene integrado | ✅ Tú lo configuras |
| **¿Inicia la comunicación?** | Siempre él | Nunca, solo espera |
| **Ejemplos** | Claude Code, Cursor, tu app | server-filesystem, server-postgres |

## Ejemplo 1: Claude Code + Filesystem

\`\`\`viz:filesystem-ex
┌──────────────────────────────────────┐
│  CLAUDE CODE (el Host)               │
│  ┌────────────────────────────────┐  │
│  │  Claude (LLM)                  │  │
│  │  "Necesito leer ventas.csv"    │  │
│  └──────────┬─────────────────────┘  │
│  ┌──────────▼─────────────────────┐  │
│  │  MCP CLIENT (integrado)        │  │
│  │  → tools/call "read_file"      │  │
│  └──────────┬─────────────────────┘  │
└─────────────┼────────────────────────┘
              │ (proceso separado)
┌─────────────▼────────────────────────┐
│  MCP SERVER: server-filesystem       │
│  Ejecuta: fs.readFileSync(path)      │
│  Responde: "fecha,monto,cliente\\n..." │
└──────────────────────────────────────┘
\`\`\`

## Ejemplo 2: Claude Desktop + GitHub

\`\`\`viz:github-ex
Tú escribes: "¿Cuántos issues abiertos tiene mi repo?"

[CLIENT - dentro de Claude Desktop]
  → tools/call "list_issues" { repo: "mi-repo" }

[SERVER - server-github, proceso aparte]
  → Llama a la API de GitHub
  → Devuelve: [{ id:1, title:"Bug login" }, ...]

Claude responde:
  "Tu repo tiene 7 issues abiertos. El más antiguo
   es 'Bug login' de hace 3 semanas."
\`\`\`

## Ejemplo 3: Varios Servers, un Client

\`\`\`json
{
  "mcpServers": {
    "archivos":  { "command": "npx", "args": ["server-filesystem", "/docs"] },
    "postgres":  { "command": "npx", "args": ["server-postgres"], "env": {...} },
    "github":    { "command": "npx", "args": ["server-github"], "env": {...} }
  }
}
\`\`\`

\`\`\`viz:multi-server
Un solo CLIENT en Claude Code conectado a 3 Servers:
  ├── server-filesystem  (proceso 1)
  ├── server-postgres    (proceso 2)
  └── server-github      (proceso 3)

Claude elige automáticamente cuál usar según la tarea.
\`\`\`

## El Host: el tercer elemento

\`\`\`viz:host-element
HOST     = El programa que el usuario abre
             └── Contiene al CLIENT integrado
             └── Gestiona conexiones con Servers

Ejemplos de HOST:
  Claude Desktop, Claude Code, Cursor, tu app propia

En la práctica: HOST ≈ CLIENT (van juntos).
\`\`\`

## Regla práctica rápida

\`\`\`
¿Lo configuro en settings.json?  → Es un SERVER  ✅
¿Viene incluido y no lo toco?    → Es el CLIENT  ✅
\`\`\``,

  mcpUsoVsCreacion: `# 🎯 MCP: ¿Usarlo o Crearlo?

> **El 90% del tiempo solo USAS servidores ya creados. No necesitas programar nada.**

## Los 3 Niveles (y cuál te importa)

\`\`\`
NIVEL 1: EL PROTOCOLO ← Ya existe, Anthropic lo creó. No lo tocas.

NIVEL 2: SERVIDORES YA HECHOS ← Solo configuras en un JSON. ← TÚ ESTÁS AQUÍ

NIVEL 3: CREAR TU PROPIO SERVIDOR ← Solo si tu herramienta no existe aún.
\`\`\`

## Nivel 2: El Uso Normal (sin código)

### Paso 1: Elige el servidor que necesitas

| Servidor | Para qué |
|----------|----------|
| \`server-filesystem\` | Leer/escribir archivos del disco |
| \`server-postgres\` | Consultar PostgreSQL |
| \`server-github\` | Issues, PRs, repos de GitHub |
| \`server-slack\` | Enviar mensajes a Slack |
| \`server-brave-search\` | Búsqueda web |
| \`server-puppeteer\` | Controlar un navegador web |
| \`server-sqlite\` | Base de datos SQLite local |

### Paso 2: Configura en .claude/settings.json

\`\`\`json
{
  "mcpServers": {
    "mis-archivos": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-filesystem", "C:/mis-documentos"]
    },
    "mi-postgres": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-postgres"],
      "env": { "POSTGRES_URL": "postgresql://user:pass@localhost/mibd" }
    }
  }
}
\`\`\`

### Paso 3: Reinicia y úsalo

\`\`\`
Tú: "Lee el archivo ventas.xlsx"
Claude: [usa filesystem automáticamente] "El archivo tiene 3 hojas..."

Tú: "¿Cuántos registros hay en la tabla clientes?"
Claude: [usa postgres automáticamente] "Hay 1,432 clientes registrados..."
\`\`\`
**Sin código. Sin instalación. Solo JSON.**

## Analogía: Wi-Fi

- **MCP protocolo** = El estándar Wi-Fi (802.11) — ya existe
- **Servidores MCP** = Los routers disponibles — ya hechos
- **Configurar MCP** = Conectarte a una red — solo ingresas datos
- **Crear servidor** = Fabricar tu propio router — solo si no existe

## ¿Cuándo SÍ crear tu propio servidor?

| Situación | ¿Crear? |
|-----------|---------|
| Usar archivos, PostgreSQL, GitHub... | ❌ Ya existe |
| Conectar tu ERP hecho a medida | ✅ Sí |
| Exponer tu lógica de negocio específica | ✅ Sí |
| Aprender cómo funciona por dentro | ✅ (ejercicio) |

## Dónde encontrar más servidores

- **Oficiales**: github.com/modelcontextprotocol/servers
- **Comunidad**: mcp.so / smithery.ai / glama.ai/mcp/servers

Hay cientos: Notion, Jira, Excel, Discord, Linear, Airtable...`,

  agente: `# 🤖 ¿Qué es un Agente de IA?

> **Antes de entender MCP, necesitas entender qué es un agente.**

## La Diferencia Fundamental

| Chatbot Simple | Agente de IA |
|----------------|--------------|
| Solo responde texto | Puede *hacer cosas* |
| Stateless (no recuerda) | Tiene memoria y estado |
| Un turno: pregunta → respuesta | Multi-turno: planifica → actúa → evalúa |
| No usa herramientas | Usa herramientas externas |

## Analogía: El Asistente Personal

**Asistente SIMPLE** (chatbot):
> "¿Puedes reservar un vuelo?" → "Para reservar un vuelo necesitas ir a una aerolínea y..."

**Asistente AGENTE** (agente):
> "¿Puedes reservar un vuelo?"
> *[Busca vuelos] → [Compara precios] → [Reserva el mejor] → [Manda confirmación]*
> "Listo, reservé el vuelo Delta a las 14:30."

## Los 4 Componentes de un Agente

### 1. 🧠 Cerebro (LLM)
El modelo de lenguaje que razona y toma decisiones: ¿qué debo hacer? ¿qué herramienta usar? ¿ya terminé?

### 2. 🔧 Herramientas (Tools)
Funciones que el agente puede llamar:
- \`buscar_en_google(query)\`
- \`leer_archivo(path)\`
- \`enviar_email(destinatario, contenido)\`
- \`consultar_base_de_datos(sql)\`

### 3. 💾 Memoria (Memory)
- **Corto plazo**: el contexto de la conversación actual
- **Largo plazo**: base de datos, vectores, archivos

### 4. 🔄 Loop de Razonamiento (ReAct)

\`\`\`viz:react-loop
┌─────────────────────────────────────────┐
│  1. OBSERVAR  ──►  2. PENSAR  ──►  3. ACTUAR
│       ▲                                 │
│       └─────────────────────────────────┘
│            (repite hasta terminar)      │
└─────────────────────────────────────────┘

ReAct = Reasoning + Acting
\`\`\`

## Tipos de Agentes

### Por autonomía:
- **Reactivo**: responde a eventos, sin plan propio
- **Deliberativo**: hace un plan antes de actuar
- **Híbrido**: planifica pero adapta según el contexto

### Por estructura:
- **Un solo agente**: hace todo solo
- **Multi-agente**: varios agentes colaboran (el más poderoso)

## Ejemplo Real: Claude Code

Claude Code es un agente que:
1. **Recibe** tu instrucción ("arregla este bug")
2. **Lee** el archivo con código
3. **Razona** qué está mal
4. **Edita** el archivo
5. **Ejecuta** tests para verificar
6. **Reporta** el resultado

Todo esto usando **herramientas** conectadas via **MCP**.`,

  mcp: `# 🔌 ¿Qué es MCP? (Model Context Protocol)

> **MCP es el "USB de la IA" — un estándar abierto que conecta modelos con cualquier herramienta.**
>
> Versión actual del protocolo: **2025-11-25** (versionado por fecha)

## El Problema que Resuelve MCP

Antes de MCP, cada empresa hacía su propia integración:

\`\`\`viz:mcp-problem
SIN MCP (el caos anterior):
  App A ──────► Tool 1
  App A ──────► Tool 2        N apps × M tools
  App A ──────► Tool 3        = N×M conexiones 😱
  App B ──────► Tool 1

CON MCP (el orden actual):
  App A ──► [MCP] ──► Tool 1
  App A ──► [MCP] ──► Tool 2   N apps + M tools
  App B ──► [MCP] ──► Tool 3   = N+M 🎉
\`\`\`

**¿Te acuerdas cuando cada teléfono tenía su propio cable?**
Nokia, Motorola, Sony Ericsson... luego llegó USB y ¡problema resuelto! 🎉
**MCP es el USB de los agentes de IA.**

## Los 3 Elementos de MCP

\`\`\`viz:mcp-elements
┌──────────────────────────────────────────────┐
│  MCP HOST (el programa que usas)             │
│  Ejemplos: Claude Desktop, Claude Code,      │
│            Cursor, tu propia app             │
│                                              │
│  ┌──────────────────────────────────────┐    │
│  │  MCP CLIENT (intermediario interno)  │    │
│  │  • Inicia conexiones con servers     │    │
│  │  • Gestiona el protocolo JSON-RPC    │    │
│  │  • Viene incluido — no lo instalas   │    │
│  └──────────┬──────────────────────────┘    │
└─────────────┼────────────────────────────────┘
              │  (stdio o HTTP)
    ┌─────────┼─────────────────────────────┐
    ▼         ▼         ▼                   │
[Server 1] [Server 2] [Server 3]  MCP SERVERS
 Archivos  PostgreSQL  GitHub     (tú los configuras)
\`\`\`

## Primitivas del Servidor (lo que puede ofrecer)

### 🔧 Tools — "Los verbos" (el más importante)
Funciones que el LLM puede llamar y ejecutar:
\`\`\`json
{
  "name": "buscar_ventas",
  "description": "Consulta ventas por período",
  "inputSchema": {
    "type": "object",
    "properties": {
      "mes": { "type": "string" },
      "año": { "type": "string" }
    },
    "required": ["mes"]
  }
}
\`\`\`

### 📄 Resources — "Los sustantivos"
Datos que el LLM puede leer (archivos, URLs, datos en vivo):
\`\`\`
file:///documentos/reporte.pdf
database://ventas/tabla_productos
https://api.empresa.com/inventario
\`\`\`

### 📝 Prompts — "Las plantillas"
Prompts predefinidos reutilizables que el servidor ofrece al usuario.

## Primitivas del Cliente (menos conocidas, muy útiles)

### 🎲 Sampling — El poder oculto de MCP

**Sampling** es una de las ideas más elegantes del protocolo: permite que un servidor MCP tome prestada la inteligencia del LLM que ya está corriendo en el cliente, sin necesitar su propia API key ni su propio modelo.

#### El problema que resuelve

Sin Sampling, si un servidor MCP quisiera "razonar" o "generar texto", necesitaría:
- Su propia API key (OpenAI, Anthropic, etc.)
- Su propio código para llamar al LLM
- Gestionar sus propios costos de tokens

Eso rompe la arquitectura. **Sampling lo simplifica radicalmente.**

#### Flujo paso a paso

\`\`\`
1. Usuario activa algo
   └─→ LLM llama a una herramienta del servidor MCP
           (ej: "resumir_documento")

2. Servidor recibe la tarea
   └─→ En lugar de tener su propio modelo, envía una
       solicitud de sampling DE VUELTA al cliente:
       "Oye cliente, ¿puedes pedirle al LLM que genere este texto?"

3. Cliente LLM genera
   └─→ Claude recibe la solicitud interna,
       produce el texto y lo devuelve al servidor

4. Servidor continúa su lógica normal
   └─→ Guarda, procesa o devuelve el texto al usuario
\`\`\`

#### Diagrama de flujo

\`\`\`viz:sampling-flow
Usuario → Host (Claude) → Servidor MCP
                              ↓
                    "necesito generar texto"
                              ↓
              Servidor → Cliente (sampling request)
                              ↓
                    Cliente → LLM (completion)
                              ↓
              LLM → Cliente → Servidor (texto generado)
                              ↓
                    Servidor continúa su tarea
\`\`\`

#### Por qué es poderoso

| Sin Sampling | Con Sampling |
|---|---|
| Servidor necesita API key propia | Reutiliza el LLM del cliente |
| Cada servidor gestiona sus costos | Costos centralizados en el host |
| Complejidad duplicada | Servidor simple y ligero |
| Atado a un modelo específico | Usa cualquier modelo que tenga el cliente |

> **Truco mnemotécnico — "El becario inteligente":**
> El servidor MCP es como un becario que sabe hacer muchas cosas pero no puede "pensar" solo. Cuando necesita inteligencia, le dice a su jefe (el cliente): _"¿Puedes preguntarle a Claude esto?"_. El jefe le trae la respuesta y el becario continúa con su tarea.

#### Ejemplo concreto: Gestor de tareas

Imagina un servidor MCP de gestión de tareas. Cuando creas una tarea sin descripción:

\`\`\`json
// Servidor envía sampling request al cliente
{
  "method": "sampling/createMessage",
  "params": {
    "messages": [{
      "role": "user",
      "content": "Genera una descripción breve para la tarea: 'revisar PR de autenticación'"
    }],
    "maxTokens": 100
  }
}

// LLM responde (vía cliente)
{
  "content": "Revisar el Pull Request #42 que implementa el sistema de autenticación JWT. Verificar seguridad, tests y cobertura de edge cases."
}
\`\`\`

El servidor guarda esa descripción en la tarea — **sin haber tenido nunca una API key propia**.

#### Cuándo se usa Sampling en la práctica

- **Enriquecimiento de datos**: Un servidor de base de datos genera descripciones automáticas de registros
- **Validación inteligente**: Un servidor de formularios detecta si los datos tienen errores lógicos
- **Resúmenes**: Un servidor de archivos resume documentos largos antes de devolverlos
- **Clasificación**: Un servidor de emails categoriza mensajes según su contenido

### 📁 Roots
El cliente informa al servidor qué directorios puede acceder:
\`\`\`json
{ "roots": [{ "uri": "file:///proyectos/mi-app", "name": "Mi Proyecto" }] }
\`\`\`

## Tipos de Transporte

| Transporte | Cuándo usarlo | Seguridad |
|-----------|---------------|-----------|
| **stdio** | Servidor local (proceso en tu máquina) | ✅ Alta — sin red |
| **HTTP Streamable** | Servidor remoto / microservicio | ⚠️ Requiere auth |

> **stdio** es el más común y seguro. **HTTP Streamable** reemplaza al antiguo SSE en v2025-11-25.

## MCP Servers Populares

| Servidor | Qué hace |
|----------|----------|
| \`server-filesystem\` | Lee/escribe archivos |
| \`server-postgres\` | Consulta PostgreSQL |
| \`server-brave-search\` | Búsqueda web |
| \`server-github\` | Maneja repos GitHub |
| \`server-slack\` | Envía mensajes Slack |
| \`server-sqlite\` | BD SQLite local |

> 🔍 Busca más en: **mcp.so**, **smithery.ai**, **glama.ai/mcp/servers**

## Configuración en Claude Code

\`\`\`json
{
  "mcpServers": {
    "mi-base-de-datos": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_URL": "postgresql://localhost/midb"
      }
    },
    "archivos": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-filesystem", "/proyectos"]
    }
  }
}
\`\`\`

## Principios de Seguridad de MCP

> Tomado del repositorio oficial de Microsoft MCP for Beginners

| Principio | Descripción |
|-----------|-------------|
| **Consentimiento explícito** | El usuario debe aprobar cada acceso a datos |
| **Mínimo privilegio** | El servidor accede SOLO a lo que necesita |
| **Privacidad de datos** | Los datos solo se exponen con consentimiento |
| **Seguridad del transporte** | HTTP debe usar TLS + autenticación |`,

  juntos: `# 🔗 Cómo Funciona Todo Junto

> **El cuadro completo: Tú → Agente → MCP → Herramientas**

## El Flujo Completo Paso a Paso

Ejemplo: *"Analiza mis ventas de enero y manda el resumen por Slack"*

\`\`\`viz:flow-complete
PASO 1: TÚ hablas con el Agente
Tu mensaje → Claude Code / Claude Desktop

PASO 2: El Agente PLANIFICA
El LLM piensa:
  "Para esto necesito:
   1. Leer datos de ventas (tool: consultar_db)
   2. Analizar los datos (lo hago yo)
   3. Enviar a Slack (tool: enviar_slack)"

PASO 3: El Agente EJECUTA herramienta 1
LLM → [MCP Client] → [MCP Server: PostgreSQL]
      "consultar_ventas(mes=enero)"
                           ↓
                    Retorna: [{ventas...}]

PASO 4: El Agente RAZONA con los datos
"Las ventas de enero fueron: Total S/.45,000"

PASO 5: El Agente EJECUTA herramienta 2
LLM → [MCP Client] → [MCP Server: Slack]
      "enviar_mensaje(canal='#ventas', texto='...')"

PASO 6: El Agente RESPONDE
"Análisis completado. Envié el resumen a Slack."
\`\`\`

## Diagrama Técnico

\`\`\`viz:juntos-technical
┌────────────────────────────────────────────┐
│                 MCP HOST                   │
│  ┌──────────┐       ┌───────────────────┐  │
│  │ USUARIO  │◄─────►│   LLM (Claude)    │  │
│  └──────────┘       └────────┬──────────┘  │
│                     ┌────────▼──────────┐  │
│                     │   MCP CLIENT      │  │
│                     └────────┬──────────┘  │
└──────────────────────────────┼─────────────┘
            ┌─────────────┬───┴─────┐
            ▼             ▼         ▼
     [Filesystem]  [PostgreSQL] [Slack]
\`\`\`

## ¿Qué hace Claude Code diferente?

Claude Code es un **agente completo** con herramientas built-in:

| Herramienta | Qué hace |
|-------------|----------|
| \`Read\` | Lee archivos del sistema |
| \`Write\` | Crea/sobreescribe archivos |
| \`Edit\` | Modifica partes de un archivo |
| \`Bash\` | Ejecuta comandos en terminal |
| \`Grep\` | Busca texto en archivos |
| \`WebSearch\` | Busca en internet |
| \`Agent\` | Lanza sub-agentes especializados |

Y **además** puede conectarse a MCP Servers externos.

## ¿Cuándo usar qué?

| Necesitas | Usa |
|-----------|-----|
| Agente que hace tareas complejas | Claude Code + MCP Servers |
| Automatizar flujos sin código | n8n + nodo de IA |
| Tu propia app con IA | API + LangChain |
| Privacidad sin costo por uso | Ollama + tu app |`,

  arquitecturaMcp: `# 🏗️ Arquitectura MCP en Profundidad

## El Ciclo de Vida de un MCP Server

\`\`\`viz:mcp-lifecycle
1. INICIO
   └── El MCP Client lanza el servidor como proceso
       $ node mi-servidor-mcp.js

2. HANDSHAKE (saludo inicial)
   └── Client envía: initialize (con versión del protocolo)
   └── Server responde: capabilities (qué puede hacer)

3. DESCUBRIMIENTO
   └── Client pide: tools/list
   └── Server responde: lista de todas sus herramientas

4. USO (repetido según necesidad)
   └── Client pide: tools/call { name, arguments }
   └── Server ejecuta y responde: result

5. CIERRE
   └── El proceso termina
\`\`\`

## Lista de herramientas (tools/list)

\`\`\`json
// El servidor responde con sus herramientas:
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
          }
        },
        "required": ["ciudad"]
      }
    }
  ]
}
\`\`\`

## Tipos de Respuesta

\`\`\`json
// Texto plano:
{ "type": "text", "text": "El resultado es 42" }

// Imagen (base64):
{ "type": "image", "data": "iVBORw0...", "mimeType": "image/png" }

// Error:
{ "isError": true, "content": [{ "type": "text", "text": "Error: DB no disponible" }] }
\`\`\`

## El Protocolo Base: JSON-RPC 2.0

MCP usa **JSON-RPC 2.0** para todos sus mensajes. Es un estándar simple:

\`\`\`json
// Petición del Client al Server:
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "obtener_clima",
    "arguments": { "ciudad": "Lima" }
  }
}

// Respuesta del Server al Client:
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [{ "type": "text", "text": "Lima: 24°C, Parcialmente nublado" }]
  }
}
\`\`\`

> **¿Por qué JSON-RPC 2.0?** Es simple, universal y soporta tanto peticiones síncronas como notificaciones asíncronas (sin ID).

## Transporte: ¿Cómo viajan los mensajes?

### 🔌 stdio (Standard Input/Output) — El más común
\`\`\`viz:stdio
Cliente ──stdin──► Servidor
Cliente ◄─stdout── Servidor
\`\`\`
- El servidor corre como **proceso local** en tu máquina
- Comunicación directa por stdin/stdout
- **Sin red = sin vectores de ataque externos**
- Ideal para herramientas locales (archivos, BDs, Git...)

### 🌐 HTTP Streamable — Para servidores remotos
\`\`\`viz:http-streamable
Cliente ──HTTP POST──► Servidor
Cliente ◄──SSE/HTTP─── Servidor
\`\`\`
- El servidor corre en **red** (puede ser remoto o microservicio)
- Soporte para streaming de respuestas largas
- Requiere autenticación (tokens, TLS)
- **Reemplazó al antiguo SSE puro en la versión 2025-11-25**

| Característica | stdio | HTTP Streamable |
|---------------|-------|-----------------|
| Ubicación | Local | Local o remoto |
| Seguridad | ✅ Alta | ⚠️ Requiere config |
| Setup | Simple | Más complejo |
| Uso típico | 90% de los casos | APIs/microservicios |

## Seguridad en MCP

### Principio de mínimo privilegio:
\`\`\`json
// MAL ❌ - acceso a todo el sistema:
"args": ["server-filesystem", "/"]

// BIEN ✅ - acceso solo al proyecto:
"args": ["server-filesystem", "/proyectos/mi-app"]
\`\`\`

### Los 4 pilares de seguridad:
1. **Sandboxing**: Los servidores corren como procesos separados (aislados)
2. **Sin red por defecto**: stdio no tiene acceso a internet
3. **Aprobación del usuario**: Claude Code pide permiso antes de acciones destructivas
4. **Variables de entorno**: Las credenciales van en \`env\`, nunca en los argumentos`,

  practica1: `# 🛠️ Tu Primer Servidor MCP

> Crea un servidor MCP con 3 herramientas en **JavaScript** o **Python**.
> El código interactivo está abajo — aquí encontrarás la explicación detallada.

## ¿Qué vas a construir?

Un servidor MCP con 3 herramientas reales:

\`\`\`
saludar(nombre)           → "¡Hola Carlos! 👋"
calcular(op, a, b)        → "127 × 43 = 5461"
obtener_hora()            → "Hora en Lima: 14:35:22"
\`\`\`

## Anatomía de un Servidor MCP

Todo servidor MCP necesita exactamente **3 piezas**:

\`\`\`
1. LISTA    → tools/list  → "¿Qué herramientas tienes?"
2. HANDLER  → tools/call  → "Ejecuta esta herramienta"
3. TRANSPORT → StdioServerTransport → Conecta via stdin/stdout
\`\`\`

> **Truco:** Piensa en un chef de restaurante. Primero le preguntas "¿qué platos tienes?" (LIST), luego pides uno (CALL), y el mesero lleva la comunicación (TRANSPORT).

## JS vs Python: ¿cuál elegir?

| Aspecto | JavaScript | Python (FastMCP) |
|---------|-----------|-----------------|
| Descripción de tool | JSON manual en el código | Docstring de la función ← más simple |
| Parámetros | JSON Schema explícito | Type hints automáticos |
| Líneas de código | ~60 | ~30 |
| Instalación | \`npm install @modelcontextprotocol/sdk\` | \`pip install mcp pytz\` |
| Verbosidad | Más explícito (más control) | Más conciso (FastMCP abstrae) |
| Mejor para... | Apps JS existentes | Comenzar rápido |

## Configurar en Claude Code

Edita \`.claude/settings.json\` (o el settings de Claude Desktop):

\`\`\`json
{
  "mcpServers": {
    "mi-servidor-js": {
      "command": "node",
      "args": ["/ruta/absoluta/al/servidor.js"]
    },
    "mi-servidor-python": {
      "command": "python",
      "args": ["/ruta/absoluta/al/servidor.py"]
    }
  }
}
\`\`\`

> ⚠️ Usa **rutas absolutas** siempre. Las rutas relativas causan errores.

## Pasos para ejecutar

\`\`\`bash
# JavaScript:
npm init -y                          # 1. Crear proyecto
# Agregar "type": "module" en package.json
npm install @modelcontextprotocol/sdk # 2. Instalar SDK
node servidor.js                      # 3. Probar manualmente

# Python:
pip install mcp pytz                  # 1. Instalar dependencias
python servidor.py                    # 2. Probar manualmente
\`\`\`

## Probar desde Claude Code

Reinicia Claude Code y escribe estas frases:
- *"¿Qué herramientas tienes disponibles?"* → ve la lista
- *"Salúdame con mi nombre: [tu nombre]"* → prueba \`saludar\`
- *"¿Cuánto es 127 multiplicado por 43?"* → prueba \`calcular\`
- *"¿Qué hora es en Lima?"* → prueba \`obtener_hora\`

## Debug: ¿qué hacer si no funciona?

\`\`\`bash
# Ver logs de MCP en Claude Code:
tail -f ~/.claude/logs/mcp-*.log

# Probar el servidor directamente con MCP Inspector:
npx @modelcontextprotocol/inspector node servidor.js
\`\`\``,

  tiposAgentes: `# 🤖 Tipos de Agentes y Cómo se Conectan

## Clasificación por Capacidad

### Agente Simple (Tool-Using Agent)
Un solo LLM con acceso a herramientas, loop básico.
\`\`\`viz:agent-simple
[Usuario] → [LLM] → [Herramienta] → [LLM] → [Respuesta]
\`\`\`

### Agente con Memoria
Recuerda conversaciones pasadas mediante corto/largo plazo.
\`\`\`viz:agent-memory
[Usuario] → [LLM + Memoria] → [Herramientas] → [Respuesta]
                  ↑
            [Base de datos histórico]
\`\`\`

### Agente Planificador
Crea un plan de pasos antes de actuar.
\`\`\`viz:agent-planner
[Tarea] → [Planificar] → [Paso 1] → [Paso 2] → [Resultado]
\`\`\`

### Sistema Multi-Agente
Varios agentes especializados que colaboran.
\`\`\`viz:agent-multi
           [Orquestador]
          /      |       \\
   [Agente A] [Agente B] [Agente C]
   Investigar  Escribir   Revisar
\`\`\`

## Patrones de Orquestación

### Patrón 1: Jefe-Empleado (Supervisor)
Manager asigna tareas, evalúa resultados, reasigna.

### Patrón 2: Secuencial (Pipeline)
\`\`\`viz:pattern-seq
[Agente 1] → output → [Agente 2] → output → [Agente 3]
\`\`\`

### Patrón 3: Paralelo
\`\`\`viz:pattern-par
[Orquestador] lanza en paralelo:
├── [Agente A] busca en internet
├── [Agente B] consulta base de datos
└── [Agente C] lee documentos
\`\`\`

### Patrón 4: Debate/Reflexión
Agente 1 genera → Agente 2 critica → Agente 1 refina → resultado mejorado

## ¿Cómo se Conectan los Agentes entre Sí?

### Via mensajes (Python):
\`\`\`python
resultado_1 = agente_1.run(tarea_inicial)
resultado_2 = agente_2.run(resultado_1)
resultado_final = agente_3.run(resultado_2)
\`\`\`

### Via mensajes (JavaScript):
\`\`\`javascript
// Mismo patrón, con async/await
const resultado1 = await agente1.run(tareaInicial)
const resultado2 = await agente2.run(resultado1)
const resultadoFinal = await agente3.run(resultado2)
\`\`\`

### Via herramientas (Python — LangChain):
\`\`\`python
@tool
def consultar_experto_legal(pregunta: str) -> str:
    """Consulta al agente especializado en leyes."""
    return agente_legal.run(pregunta)
\`\`\`

### Via herramientas (JavaScript — Anthropic SDK):
\`\`\`javascript
const herramientas = [{
  name: "consultar_experto_legal",
  description: "Consulta al agente especializado en leyes.",
  input_schema: {
    type: "object",
    properties: { pregunta: { type: "string" } },
    required: ["pregunta"]
  }
}]
// Cuando Claude decide usarla:
async function ejecutarHerramienta(nombre, input) {
  if (nombre === "consultar_experto_legal")
    return await agenteLegal.run(input.pregunta)
}
\`\`\`

## Ejemplo Real: Análisis de Contratos

\`\`\`viz:agent-multi
TAREA: "Analiza este contrato de arrendamiento"

[Orquestador]
    ├── [Agente Extractor] → lista de cláusulas
    ├── [Agente Legal]     → análisis de riesgos
    └── [Agente Redactor]  → informe ejecutivo final
\`\`\``,

  practica2: `# 🛠️ Práctica: Equipo de Agentes (Pipeline Multi-Agente)

> Crea un equipo de 2 agentes: uno investiga un tema y otro genera un reporte.
> El código interactivo está abajo con tabs JS y Python.

## ¿Qué vas a construir?

Un **pipeline de 2 agentes** donde el output de uno es el input del otro:

\`\`\`viz:pipeline-2
[Tú]  →  "Investiga: MCP y Agentes de IA"
              │
              ▼
    ┌─────────────────────┐
    │  AGENTE 1           │
    │  Investigador Senior│  → Produce: informe detallado (500+ palabras)
    │  (10 años de exp.)  │
    └──────────┬──────────┘
               │ output → input
               ▼
    ┌─────────────────────┐
    │  AGENTE 2           │
    │  Redactor Ejecutivo │  → Produce: reporte en Markdown (max 800 palabras)
    │  (síntesis y estilo)│
    └──────────┬──────────┘
               │
               ▼
    [Reporte final listo]
\`\`\`

## Cómo funciona en Python (CrewAI) vs JavaScript (SDK)

| Concepto | Python (CrewAI) | JavaScript (SDK Anthropic) |
|----------|----------------|---------------------------|
| Definir agente | \`Agent(role, goal, backstory)\` | Función con \`system\` prompt |
| Definir tarea | \`Task(description, agent)\` | Parámetros de \`messages.create\` |
| Pipeline secuencial | \`Crew(process=sequential)\` | \`await agente1() → await agente2()\` |
| Logs del razonamiento | \`verbose=True\` (automático) | \`console.log\` manual |
| Abstracción | Alta — CrewAI gestiona el flujo | Baja — control total |

> **CrewAI no existe en JavaScript.** Pero el patrón es idéntico: cada agente es una función con su propio \`system prompt\`, y encadenas el output de uno como input del siguiente.

## La clave del diseño multi-agente

Cada agente necesita tener:
1. **Un rol claro** — quién es (Investigador Senior, Redactor...)
2. **Un objetivo específico** — qué debe lograr
3. **Un contexto/backstory** — experiencia que justifica su "expertise"
4. **Una sola tarea** — no hagas que un agente haga todo

> 📌 Principio: **Un agente, una responsabilidad.** Como en programación orientada a objetos.

## Instalación

\`\`\`bash
# Python:
pip install crewai langchain-anthropic

# JavaScript:
npm init -y
# Agrega "type": "module" en package.json
npm install @anthropic-ai/sdk
\`\`\`

## Prueba con estos temas

\`\`\`
"MCP (Model Context Protocol) y su impacto en IA"
"Automatización con IA en empresas latinoamericanas 2025"
"Modelos de IA open source vs propietarios"
"n8n como herramienta de automatización empresarial"
\`\`\``,

  n8n: `# 🔄 ¿Qué es n8n?

> **n8n = Automatización visual + IA = El pegamento del ecosistema moderno**

## La Idea Central

n8n es una plataforma de automatización **open source** que hostas tú mismo.

| Herramienta | Tipo | Precio |
|-------------|------|--------|
| Zapier | Cerrado, nube | De pago |
| Make.com | Semi-cerrado | Costoso en volumen |
| **n8n** | **Abierto, tú lo hostas** | **Sin límites** |

## ¿Para qué sirve en el Ecosistema IA?

\`\`\`viz:n8n-email
EJEMPLO REAL:
Nuevo email llega a Gmail
        │
        ▼
n8n lo captura automáticamente
        │
        ▼
Nodo IA: "¿Es una queja de cliente?"
Claude responde: "Sí, urgencia alta"
        │
        ▼
Condición: ¿urgencia alta?
    ├── Sí → Crea ticket en Jira + Notifica Slack
    └── No → Responde con plantilla automática
\`\`\`

## Conceptos Clave

| Concepto | Definición |
|----------|------------|
| **Workflow** | Diagrama visual de tu automatización |
| **Nodo** | Una acción específica en el flujo |
| **Trigger** | El disparador (inicio del flujo) |
| **Credenciales** | Llaves de acceso a servicios externos |

## Instalación con Docker

\`\`\`yaml
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
      - N8N_BASIC_AUTH_PASSWORD=tu-password
    volumes:
      - n8n_data:/home/node/.n8n
volumes:
  n8n_data:
\`\`\`

\`\`\`bash
docker-compose up -d
# Accede en: http://localhost:5678
\`\`\`

## Los Nodos de IA en n8n

### AI Agent
El nodo más poderoso. Crea un agente completo con herramientas y memoria.

### Modelos disponibles:
- OpenAI Chat Model
- **Anthropic Chat Model** (Claude)
- **Ollama Chat Model** (local!)
- Google Gemini Chat Model

## Arquitecturas Comunes

### Patrón 1: Clasificador + Router
\`\`\`
Email llega → [Claude] Clasifica → enruta según tipo
\`\`\`

### Patrón 2: RAG Simple
\`\`\`
Pregunta → Busca docs → [Claude] Responde con contexto
\`\`\`

### Patrón 3: Pipeline de Procesamiento
\`\`\`
PDF subido → [Extrae texto] → [Claude suma] → [Guarda] → [Notifica]
\`\`\``,

  practica3: `# 🛠️ Flujo n8n con Agente Clasificador

> Crea un flujo que clasifica mensajes automáticamente con IA.

## Lo que vas a construir

Un sistema que:
1. Recibe mensajes via webhook
2. Un agente de IA los clasifica
3. Según la clasificación, responde diferente

## Paso 1: Crear el Workflow

En n8n, crea un nuevo workflow con estos nodos:

### Nodo 1: Webhook (Trigger)
\`\`\`
Tipo: Webhook
Method: POST
Path: clasificar-mensaje
\`\`\`

### Nodo 2: Anthropic Chat Model
\`\`\`
System Prompt:
"Eres un clasificador de mensajes de soporte.
Clasifica el mensaje en exactamente una categoría:
- consulta: pregunta sobre producto/servicio
- queja: problema o insatisfacción
- elogio: felicitación o satisfacción
- spam: irrelevante o automatizado

Responde SOLO con la categoría en minúsculas."
\`\`\`

### Nodo 3: Switch (Condicional)
Basado en la respuesta de la IA, crea 4 ramas.

### Nodos 4-7: Respuestas por categoría
\`\`\`
consulta → "Un asesor te contactará en 24h."
queja    → "Escalamos tu caso como URGENTE."
elogio   → "¡Tu opinión nos motiva a mejorar!"
spam     → "Mensaje no procesado."
\`\`\`

## Paso 2: Probar el webhook

### Con curl

\`\`\`bash
curl -X POST http://localhost:5678/webhook/clasificar-mensaje \\
  -H "Content-Type: application/json" \\
  -d '{"message": "¿Cuánto cuesta el plan premium?"}'
\`\`\`

### Con Python

\`\`\`python
# probar_webhook.py
import requests

URL = "http://localhost:5678/webhook/clasificar-mensaje"
mensajes = [
    "¿Cuánto cuesta el plan premium?",
    "El producto llegó roto y nadie me atiende",
    "¡Excelente servicio!",
]
for msg in mensajes:
    r = requests.post(URL, json={"message": msg})
    data = r.json()
    print(f"📨 {msg[:35]}...")
    print(f"🏷️  {data.get('categoria','N/A')} | {data.get('respuesta','N/A')}")
    print("-" * 50)
\`\`\`

### Con JavaScript (Node.js)

\`\`\`javascript
// probar_webhook.js
const URL = "http://localhost:5678/webhook/clasificar-mensaje";
const mensajes = [
  "¿Cuánto cuesta el plan premium?",
  "El producto llegó roto y nadie me atiende",
  "¡Excelente servicio!",
];
for (const msg of mensajes) {
  const r = await fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: msg }),
  });
  const data = await r.json();
  console.log(\`📨 \${msg.slice(0,35)}...\`);
  console.log(\`🏷️  \${data.categoria ?? "N/A"} | \${data.respuesta ?? "N/A"}\`);
  console.log("-".repeat(50));
}
\`\`\`

## Desafíos Opcionales

1. **Integra con Slack**: Notifica cuando llegue una queja urgente
2. **Agrega extracción**: Extrae nombre y email del mensaje
3. **Dashboard**: Genera estadísticas de mensajes por categoría`,

  iaLocal: `# 🏠 IA Local: Tu Propio Servidor de IA

> **Corre modelos de IA en tu computadora, sin internet, sin costos por uso.**

## ¿Por qué IA Local?

| IA en la Nube | IA Local |
|---------------|----------|
| ✅ Muy potente | ✅ Total privacidad |
| ✅ Siempre actualizada | ✅ Sin costo por token |
| ✅ Sin instalar nada | ✅ Funciona sin internet |
| ❌ Pagas por cada token | ❌ Necesitas buen hardware |
| ❌ Tus datos van a terceros | ❌ Modelos menos capaces |

### Casos de uso ideales:
1. Datos confidenciales (médicos, legales, financieros)
2. Desarrollo y testing sin costo
3. Apps offline o sin internet
4. Volúmenes muy altos de consultas

## Hardware Recomendado

\`\`\`
MÍNIMO (modelos 1-7B):
  RAM: 8GB | Sin GPU | Disco: 10GB
  → Phi-3 Mini, Gemma 2B

RECOMENDADO (modelos 7-13B):
  RAM: 16GB | GPU: 8GB VRAM | Disco: 30GB
  → Llama 3.1 8B, Mistral 7B

AVANZADO (modelos 30B+):
  RAM: 32GB+ | GPU: 24GB+ VRAM
  → Llama 3.1 70B, DeepSeek 33B
\`\`\`

**Apple Silicon (M1/M2/M3)**: Excelente para IA local.

## Ollama: Guía Rápida

\`\`\`bash
# Instalación (Linux/Mac):
curl -fsSL https://ollama.ai/install.sh | sh

# Windows: descarga desde https://ollama.ai/download

# Comandos básicos:
ollama pull llama3.1:8b    # Descargar modelo
ollama run llama3.1        # Chat en terminal
ollama list                # Ver modelos instalados
ollama ps                  # Ver modelos corriendo
ollama serve               # Iniciar servidor API (puerto 11434)
\`\`\`

## Modelos Recomendados

\`\`\`bash
ollama pull phi3:mini        # 2.3GB - Muy pequeño y rápido
ollama pull llama3.1:8b      # 4.7GB - Bueno para tareas generales
ollama pull codellama:7b     # 3.8GB - Especializado en código
ollama pull deepseek-r1:7b   # 4.7GB - Excelente razonamiento
\`\`\`

## Usar la API de Ollama

\`\`\`bash
# Chat básico:
curl http://localhost:11434/api/generate \\
  -d '{
    "model": "llama3.1",
    "prompt": "¿Qué es MCP en IA?",
    "stream": false
  }'

# API compatible OpenAI:
curl http://localhost:11434/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "llama3.1",
    "messages": [{"role": "user", "content": "Explica MCP en 3 puntos"}]
  }'
\`\`\``,

  practica4: `# 🛠️ Agente Local con Ollama

> Crea un agente 100% local con Ollama en **Python** o **JavaScript**.
> El código completo está abajo en los tabs interactivos.

## ¿Qué vas a construir?

Un agente con **3 herramientas** que corre 100% en tu máquina:

\`\`\`
buscar_wikipedia(consulta)  → Busca info factual en Wikipedia en español
calcular(expresion)         → Evalúa expresiones matemáticas
leer_archivo(ruta)          → Lee archivos de texto locales
\`\`\`

## El loop ReAct que verás en acción

\`\`\`viz:react-loop
Thought: "Necesito buscar info sobre Machu Picchu en Wikipedia"
Action: buscar_wikipedia("Machu Picchu")
Observation: "Machu Picchu es un santuario histórico inca..."
Thought: "Ya tengo la información, puedo responder"
Final Answer: "Machu Picchu es..."
\`\`\`

> Activa \`verbose=True\` (Python) para ver este proceso en tiempo real. En JavaScript lo ves en los logs de consola.

## Python vs JavaScript: diferencias clave

| Aspecto | Python | JavaScript |
|---------|--------|------------|
| Definir tool | \`@tool\` decorator + docstring | \`tool(fn, { schema })\` |
| Wikipedia | librería \`wikipediaapi\` | fetch a Wikipedia REST API |
| Calcular | \`eval\` con \`math\` module | \`Function("return (expr)")()\` |
| Loop de chat | \`while True: input()\` | \`readline.createInterface\` |
| ReAct verbose | \`verbose=True\` | logs manuales |

## Preguntas para probar el agente

\`\`\`
"¿Qué es el Machu Picchu?"         → busca en Wikipedia
"¿Cuánto es sqrt(2025)?"           → usa calculadora
"¿Cuánto es 127 * 43 + 500?"       → usa calculadora
"Lee el archivo README.md"         → lee archivo local
"¿Qué es LangChain?"               → busca en Wikipedia
\`\`\`

---

## Estructura del código (Python — LangChain)

\`\`\`python
# Patrón ReAct con LangChain + Ollama:
llm = ChatOllama(model="llama3.2:latest")    # 1. Modelo local

@tool
def mi_herramienta(param: str) -> str:   # 2. Herramientas con @tool
    """Descripción para el LLM"""
    return resultado

agente = create_react_agent(llm, tools)  # 3. Crea el agente ReAct
ejecutor = AgentExecutor(agent, tools,   # 4. Ejecutor con config
                         verbose=True)   #    verbose muestra el razonamiento
ejecutor.invoke({"input": pregunta})     # 5. Corre el agente
\`\`\`

## Estructura del código (JavaScript — LangChain.js)

\`\`\`javascript
// Patrón ReAct con LangChain.js + Ollama:
const llm = new ChatOllama({ model: "llama3.2:latest" })  // 1. Modelo local

const miHerramienta = tool(async ({ param }) => {      // 2. Herramientas con tool()
  return resultado
}, { name: "mi_herramienta",
     description: "Descripción para el LLM",
     schema: z.object({ param: z.string() }) })

const agente = createReactAgent({ llm, tools })         // 3. Agente ReAct
const r = await agente.invoke({ messages: [...] })      // 4. Ejecutar
\`\`\``,

  ecosistema: `# 🌐 El Ecosistema Completo

> **Tu guía para elegir la herramienta correcta para cada trabajo.**

## El Mapa del Ecosistema

\`\`\`viz:ecosystem
CAPA 1: MODELOS (el cerebro)
├── Cloud: Claude, GPT-4, Gemini, Mistral
└── Local: Llama, Phi, DeepSeek, Gemma

CAPA 2: FRAMEWORKS (el esqueleto)
├── LangChain: construcción de apps con LLMs
├── LangGraph: agentes complejos como grafos
├── CrewAI: equipos de agentes colaborativos
└── AutoGen: agentes conversacionales multi-agente

CAPA 3: PROTOCOLOS (el idioma)
└── MCP: estándar para conectar LLMs con herramientas

CAPA 4: HERRAMIENTAS DE EJECUCIÓN (los músculos)
├── Claude Code: agente de código (usa MCP)
├── n8n: automatización visual
└── LM Studio: interfaz local para LLMs

CAPA 5: INFRAESTRUCTURA (la base)
└── Ollama, Docker, APIs Cloud
\`\`\`

## Tabla Comparativa de Frameworks

| Framework | Complejidad | Mejor Para | Stars |
|-----------|-------------|------------|-------|
| **LangChain** | Media | Apps generales con LLMs | ⭐ 100k+ |
| **LangGraph** | Alta | Agentes con estado complejo | ⭐ 15k+ |
| **CrewAI** | Baja-Media | Equipos de agentes por roles | ⭐ 30k+ |
| **AutoGen** | Media | Agentes conversacionales | ⭐ 35k+ |
| **n8n** | Baja | Automatización sin código | ⭐ 50k+ |

## LangChain: El más Completo

\`\`\`python
# Ejemplo: RAG simple con LangChain
from langchain_anthropic import ChatAnthropic
from langchain_community.vectorstores import FAISS
from langchain.chains import RetrievalQA

llm = ChatAnthropic(model="claude-3-5-sonnet-20241022")
vectorstore = FAISS.from_texts(mis_documentos, embedding)
qa = RetrievalQA.from_chain_type(llm=llm, retriever=vectorstore.as_retriever())
respuesta = qa.invoke("¿Qué dice el contrato sobre devoluciones?")
\`\`\`

## CrewAI: Equipos de Agentes

\`\`\`python
investigador = Agent(role="Investigador", goal="Encontrar info", ...)
redactor = Agent(role="Redactor", goal="Crear reportes", ...)

equipo = Crew(
    agents=[investigador, redactor],
    tasks=[tarea1, tarea2],
    process=Process.sequential
)
resultado = equipo.kickoff()
\`\`\`

## ¿Cuándo usar qué?

| Situación | Herramienta |
|-----------|-------------|
| Chatbot con documentos propios | LangChain + RAG |
| Agente que navega web y actúa | Claude Code |
| Automatizar proceso de negocio | n8n |
| Equipo de agentes especializados | CrewAI |
| Agente con lógica compleja | LangGraph |
| Privacidad + sin costos cloud | Ollama + LangChain |
| Prototipo rápido sin código | n8n + AI Agent |`,

  proyectoFinal: `# 🏆 Proyecto Final: Sistema Q&A Local

> **Integra todo lo aprendido: MCP + Agente ReAct + Ollama, sin depender de la nube.**

## El Proyecto

Un sistema de **Q&A sobre documentos de empresa** que corre 100% en tu máquina:
1. **MCP Server** → expone documentos y búsqueda al agente
2. **Agente ReAct con Ollama** → razona y responde preguntas usando las herramientas MCP
3. **Sin APIs externas** → privacidad total, sin costo por token

## Arquitectura

\`\`\`viz:qa-arch
[Usuario hace una pregunta]
        │
        ▼
[Agente ReAct — llama3.2:latest via Ollama]
        │  Thought: "Necesito buscar en los documentos"
        ▼
[MCP Server de Documentos]
   ├── listar_documentos()
   └── buscar_en_documentos(termino)
        │
        ▼
[carpeta documentos/ con archivos .txt]
        │
        ▼
[Respuesta contextualizada al usuario]
\`\`\`

## Parte 1: Crea los documentos de prueba

\`\`\`bash
mkdir documentos
echo "Vacaciones: 30 días al año. Solicitar con 15 días de anticipación." > documentos/rrhh.txt
echo "Producto A: S/.150. Producto B: S/.280. Descuento >10 unidades: 15%." > documentos/precios.txt
echo "Horario: Lunes a Viernes 9:00-18:00. Viernes: salida a las 17:00." > documentos/horarios.txt
\`\`\`

## Parte 2: Construye el MCP Server

El código completo está en los tabs interactivos de abajo (JS o Python).
El servidor expone **2 herramientas**: \`listar_documentos\` y \`buscar_en_documentos\`.

## Parte 3: Configura en Claude Code

\`\`\`json
{
  "mcpServers": {
    "documentos-empresa": {
      "command": "node",
      "args": ["/ruta/absoluta/servidor-docs.js"]
    }
  }
}
\`\`\`

> Reinicia Claude Code y verás las herramientas disponibles automáticamente.

## Parte 4: Conecta el Agente ReAct con Ollama

El código del agente está en los tabs interactivos de abajo (**Agente ReAct** — Python o JavaScript).
Ambos usan \`llama3.2:latest\` y las mismas herramientas que el MCP Server.

## Parte 5: Prueba el sistema completo

\`\`\`
"¿Cuántos días de vacaciones tenemos?"
→ El agente busca en rrhh.txt y responde

"¿Cuál es el precio del Producto B?"
→ El agente encuentra precios.txt y responde

"¿Qué documentos hay disponibles?"
→ El agente lista todos los archivos

"¿A qué hora salimos los viernes?"
→ El agente busca en horarios.txt
\`\`\`

## ✅ Has completado el proyecto si...

- [ ] La carpeta \`documentos/\` tiene al menos 3 archivos .txt
- [ ] El MCP Server lista y busca en documentos correctamente
- [ ] Claude Code responde preguntas usando el MCP Server
- [ ] El agente con Ollama responde preguntas en modo local
- [ ] El loop ReAct muestra el razonamiento paso a paso

## 🏅 ¡Felicitaciones!

Has construido un sistema real que integra **MCP + Agentes + IA Local** sin depender de ningún servicio externo.
**Privacidad total, costo cero, conocimiento tuyo.**`,

  rag: `# 🔍 RAG: Retrieval-Augmented Generation

> **La memoria externa de los agentes de IA**

## 🧠 TIC para recordar RAG

### "El Estudiante con Biblioteca"

> Imagina un estudiante muy inteligente (el LLM) que sabe muchísimo, pero su conocimiento tiene fecha de corte. Antes de responder un examen, puede **ir a la biblioteca** (la base de datos vectorial), **buscar los libros relevantes** (retrieval), **leerlos rápido** (contexto) y luego **escribir su respuesta** (generation).

\`\`\`
SIN RAG:  Estudiante responde solo con lo que memorizó → puede alucinar o quedar desactualizado
CON RAG:  Estudiante busca → lee fuente → responde con evidencia → respuesta precisa
\`\`\`

**RAG = Buscar primero, responder después**

---

## ¿Por qué existe RAG?

Los LLMs tienen **tres problemas fundamentales**:

| Problema | Descripción | RAG lo resuelve |
|----------|-------------|-----------------|
| **Fecha de corte** | El modelo no sabe nada después de su entrenamiento | ✅ Conecta a datos actualizados |
| **Alucinaciones** | Inventa hechos que no sabe | ✅ Ancla respuestas en documentos reales |
| **Contexto limitado** | No puede "leer" millones de documentos | ✅ Recupera solo lo relevante |

---

## 🏗️ Pipeline RAG: Las 2 Fases

\`\`\`viz:rag-pipeline
FASE 1: INDEXACIÓN (se hace una sola vez)
─────────────────────────────────────────
📄 Documentos → ✂️ Chunking → 🔢 Embedding → 🗄️ Vector DB

FASE 2: CONSULTA (en cada pregunta del usuario)
───────────────────────────────────────────────
❓ Pregunta → 🔢 Embed query → 🔍 Búsqueda similitud → 📋 top-K chunks
                                                              │
                                                    🤖 LLM + Contexto
                                                              │
                                                        💬 Respuesta
\`\`\`

---

## ✂️ Chunking: el arte de cortar documentos

### TIC: "Los Cubitos de Hielo"

> No metes un bloque de hielo entero en un vaso: lo partes en cubitos. Si el cubo es muy grande, no cabe. Si es muy pequeño, pierde contexto.

| Estrategia | Descripción | Cuándo usar |
|------------|-------------|-------------|
| **Fixed-size** | Cortar cada N caracteres | Textos homogéneos |
| **Recursive** | Párrafos → oraciones → palabras | General purpose |
| **Semantic** | Agrupar por significado similar | Alta precisión (+9% recall) |
| **Sliding window** | Con superposición (overlap) | No perder bordes |

\`\`\`python
chunk_size = 512    # tamaño del trozo (tokens)
chunk_overlap = 50  # tokens que se repiten entre trozos
\`\`\`

---

## 🔢 Embeddings: el GPS del significado

Un **embedding** transforma texto en un vector numérico que representa su *significado*.

\`\`\`
"perro"  → [0.2, 0.8, -0.1, 0.5, ...]  ← cerca de "mascota", "can"
"avión"  → [0.9, -0.3, 0.6, -0.1, ...] ← lejos de animales
\`\`\`

### Modelos populares 2025

| Modelo | Proveedor | Costo |
|--------|-----------|-------|
| \`nomic-embed-text\` | Ollama | 🆓 Local |
| \`all-MiniLM-L6-v2\` | HuggingFace | 🆓 Local |
| \`text-embedding-3-large\` | OpenAI | 💰 Pago |
| \`voyage-3-large\` | Voyage AI | 💰 +9.74% vs OpenAI |

---

## 🗄️ Bases de Datos Vectoriales

Almacenan y buscan embeddings por similitud semántica.

\`\`\`
🟢 Chroma   — Local, gratis, ideal para aprender
🔵 Pinecone — Cloud managed, producción
🟡 Weaviate — Open source, búsqueda híbrida (vector + BM25)
🟠 Qdrant   — Open source, muy rápido
🔴 FAISS    — Meta, en memoria, para prototipo
\`\`\`

**Búsqueda híbrida** (vectorial + BM25) = mejor cobertura y precisión que cada una sola.

---

## 🔄 Variantes RAG (2025–2026)

| Variante | Descripción | Ventaja |
|----------|-------------|---------|
| **RAG Básico** | 1 búsqueda → LLM | Simple, rápido |
| **GraphRAG** (Microsoft) | Grafo de conocimiento + vectores | Hasta 99% precisión relacional |
| **Self-RAG** | LLM decide si necesita recuperar | Eficiente, menos llamadas |
| **Agentic RAG** | Agente controla múltiples búsquedas | Preguntas complejas |
| **RAPTOR** | Árbol jerárquico de resúmenes | Multi-nivel |
| **Long RAG** | Recupera secciones completas | Preserva contexto |

---

## 📊 Métricas para evaluar RAG (RAGAS)

\`\`\`
Faithfulness      — ¿La respuesta se basa en el contexto recuperado?
Answer Relevancy  — ¿La respuesta responde la pregunta?
Context Recall    — ¿Se recuperaron los chunks correctos?
Context Precision — ¿Los chunks recuperados son relevantes?
\`\`\`

---

## 🔧 Pipeline RAG en Producción

\`\`\`
Básico:       Query → Retrieve(k=3) → LLM → Respuesta

Mejorado:
  + QUERY EXPANSION  → reformular la pregunta de varias formas
  + HYBRID SEARCH    → vector + BM25 keyword
  + RERANKING        → re-ordenar resultados (+10-30% precisión)
  + PARENT-CHILD     → chunks pequeños, recupera el padre grande
\`\`\``,
}

// ──────────────────────────────────────────────────────────────
// ESTRUCTURA DEL CURRÍCULO
// ──────────────────────────────────────────────────────────────
export const MODULES = [
  {
    id: 'fundamentos',
    number: '01',
    title: 'Fundamentos',
    subtitle: 'La base de todo',
    icon: '🧱',
    colorFrom: '#f59e0b',
    colorTo: '#ef4444',
    tailwindGradient: 'from-amber-500 to-red-500',
    tailwindText: 'text-amber-400',
    tailwindBg: 'bg-amber-500/10',
    tailwindBorder: 'border-amber-500/20',
    description: 'Entiende qué son los agentes de IA y el protocolo MCP desde cero.',
    lessons: [
      {
        id: 'agente',
        title: '¿Qué es un Agente de IA?',
        icon: '🤖',
        duration: '15 min',
        content: CONTENT.agente,
        tic: {
          acronym: 'CHMT',
          trigger: '¡El Che eM Te!',
          letters: [
            { letter: 'C', word: 'Chef', desc: 'El cerebro/LLM que decide' },
            { letter: 'H', word: 'Herramientas', desc: 'Las tools que usa' },
            { letter: 'M', word: 'Memoria', desc: 'Lo que recuerda' },
            { letter: 'T', word: 'Tarea', desc: 'El objetivo final' },
          ],
          analogy: 'Un agente es como un Chef que usa Herramientas, tiene Memoria de recetas y completa una Tarea.',
          emoji: '👨‍🍳',
        },
        checklist: [
          'Explico la diferencia entre chatbot y agente: stateless vs stateful, un turno vs multi-turno',
          'Identifico los 4 componentes de un agente: Cerebro (LLM), Herramientas, Memoria y Loop de razonamiento',
          'Describo el ciclo ReAct completo: Observar → Pensar → Actuar → (repetir)',
          'Distingo los 3 tipos de agente por autonomía: reactivo, deliberativo e híbrido',
          'Diferencio agente único de sistema multi-agente y sé cuándo conviene cada uno',
          'Puedo trazar cómo Claude Code actúa como agente en un caso real (leer → razonar → editar → verificar)',
        ],
      },
      {
        id: 'mcp',
        title: '¿Qué es MCP?',
        icon: '🔌',
        duration: '20 min',
        content: CONTENT.mcp,
        tic: {
          acronym: 'MESERO',
          trigger: 'El Mesero Universal',
          letters: [
            { letter: 'M', word: 'Modelo', desc: 'El chef (LLM) que pide' },
            { letter: 'E', word: 'Estándar', desc: 'El protocolo unificado' },
            { letter: 'S', word: 'Servidor', desc: 'Las tiendas con recursos' },
            { letter: 'E', word: 'Ejecuta', desc: 'Las herramientas que actúan' },
            { letter: 'R', word: 'Responde', desc: 'El resultado al agente' },
            { letter: 'O', word: 'Orquesta', desc: 'Todo el flujo' },
          ],
          analogy: 'MCP es el Mesero Universal que habla el mismo idioma con todas las "tiendas" (servidores), sin importar qué "chef" (LLM) hace el pedido.',
          emoji: '🍽️',
        },
        checklist: [
          'Explico el problema N×M que MCP resuelve y la analogía del cable USB',
          'Distingo claramente el rol de Host, Client y Server en la arquitectura MCP',
          'Conozco las 3 primitivas del servidor: Tools (verbos), Resources (sustantivos) y Prompts (plantillas)',
          'Entiendo Sampling: el servidor pide al cliente que el LLM genere texto sin necesitar API key propia',
          'Sé para qué sirve Roots y cómo implementa el principio de mínimo privilegio',
          'Diferencio stdio (local, alta seguridad) de HTTP Streamable (remoto, requiere auth)',
          'Puedo escribir la configuración de un MCP Server en Claude Code (mcpServers en settings.json)',
        ],
      },
      {
        id: 'juntos',
        title: 'Cómo Funciona Todo Junto',
        icon: '🔗',
        duration: '15 min',
        content: CONTENT.juntos,
        tic: {
          acronym: 'OPERA',
          trigger: '¡Como un Director de Orquesta!',
          letters: [
            { letter: 'O', word: 'Observa', desc: 'Recibe la tarea' },
            { letter: 'P', word: 'Planifica', desc: 'Decide herramientas' },
            { letter: 'E', word: 'Ejecuta', desc: 'Llama via MCP' },
            { letter: 'R', word: 'Razona', desc: 'Procesa resultados' },
            { letter: 'A', word: 'Avanza', desc: 'Responde o repite' },
          ],
          analogy: 'El agente OPERA como un director de orquesta: no toca instrumentos, sino que coordina cada músico (herramienta) en el momento correcto.',
          emoji: '🎼',
        },
        checklist: [
          'Trazo el flujo completo de 6 pasos: usuario → planifica → ejecuta herramienta → razona → ejecuta herramienta → responde',
          'Explico cómo Host, LLM, MCP Client y MCP Servers interactúan en el diagrama técnico',
          'Identifico las 7 herramientas built-in de Claude Code: Read, Write, Edit, Bash, Grep, WebSearch y Agent',
          'Sé que Claude Code puede combinar sus herramientas propias con MCP Servers externos simultáneamente',
          'Elijo la herramienta correcta según el caso: Claude Code+MCP, n8n, API+LangChain u Ollama',
        ],
      },
    ],
  },
  {
    id: 'mcp',
    number: '02',
    title: 'MCP en Profundidad',
    subtitle: 'El protocolo USB de la IA',
    icon: '🔌',
    colorFrom: '#3b82f6',
    colorTo: '#6366f1',
    tailwindGradient: 'from-blue-500 to-indigo-600',
    tailwindText: 'text-blue-400',
    tailwindBg: 'bg-blue-500/10',
    tailwindBorder: 'border-blue-500/20',
    description: 'Entiende MCP como estándar, usa servidores existentes y aprende su arquitectura.',
    lessons: [
      {
        id: 'client-vs-server',
        title: 'Client vs Server: La diferencia clave',
        icon: '🔄',
        duration: '15 min',
        content: CONTENT.clientVsServer,
        tic: {
          acronym: 'CS',
          trigger: 'Camarero-Cocina (C-S)',
          letters: [
            { letter: 'C', word: 'Client = Camarero', desc: 'Vive dentro del Host, llama al Server, no lo instalas' },
            { letter: 'S', word: 'Server = Cocina',   desc: 'Proceso separado, ejecuta la acción real, tú lo configuras' },
          ],
          analogy: 'El Camarero (Client) recibe el pedido y lo lleva a la Cocina (Server). El cliente nunca va a la cocina. La cocina nunca atiende mesas. Cada uno en su rol.',
          emoji: '🍽️',
        },
        checklist: [
          'El Client vive DENTRO del host (Claude Code, etc.) y no lo instalo yo',
          'El Server es un proceso SEPARADO que yo configuro en settings.json',
          'Puedo nombrar 2 ejemplos de Host reales',
          'Puedo nombrar 3 ejemplos de Servers reales',
          'Entiendo que puedo tener múltiples Servers con un solo Client',
          'El Server NUNCA inicia la comunicación, solo espera',
        ],
      },
      {
        id: 'uso-vs-creacion',
        title: '🎯 ¿Usar o Crear? La distinción clave',
        icon: '🎯',
        duration: '10 min',
        content: CONTENT.mcpUsoVsCreacion,
        tic: {
          acronym: 'ENCHUFE',
          trigger: 'MCP = El Enchufe Estándar',
          letters: [
            { letter: 'E', word: 'Estándar', desc: 'El protocolo ya existe' },
            { letter: 'N', word: 'No-código', desc: 'Solo configuras JSON' },
            { letter: 'C', word: 'Conectas', desc: 'Al servidor que necesitas' },
            { letter: 'H', word: 'Herramientas', desc: 'Ya vienen hechas' },
            { letter: 'U', word: 'Usas', desc: 'El 90% del tiempo' },
            { letter: 'F', word: 'Fabricas', desc: 'Solo si no existe el servidor' },
            { letter: 'E', word: 'Ecosistema', desc: 'Cientos de servidores' },
          ],
          analogy: 'MCP es el enchufe estándar. Tú no fabricas enchufes — solo conectas tus aparatos. Solo fabricas uno si tu aparato es completamente nuevo.',
          emoji: '🔌',
        },
        checklist: [
          'Entiendo que MCP como protocolo ya existe (no lo creo)',
          'Sé que hay cientos de servidores MCP ya hechos',
          'Sé configurar un servidor MCP en settings.json',
          'Conozco dónde buscar más servidores (mcp.so, smithery.ai)',
          'Entiendo en qué caso SÍ necesitaría crear uno propio',
        ],
      },
      {
        id: 'arquitectura',
        title: 'Arquitectura MCP',
        icon: '🏗️',
        duration: '25 min',
        content: CONTENT.arquitecturaMcp,
        tic: {
          acronym: 'IHDU',
          trigger: '¡Uh, Dú! (sorpresa al descubrir)',
          letters: [
            { letter: 'I', word: 'Inicio', desc: 'Lanzas el servidor' },
            { letter: 'H', word: 'Handshake', desc: '"Hola, ¿qué sabes hacer?"' },
            { letter: 'D', word: 'Descubrimiento', desc: 'tools/list' },
            { letter: 'U', word: 'Uso', desc: 'tools/call' },
          ],
          analogy: 'Como cuando llamas a alguien: marcas (Inicio) → "¿Hola, quién es?" (Handshake) → "¿Qué puedes hacer?" (Descubrimiento) → "Hazme esto" (Uso).',
          emoji: '📞',
        },
        checklist: [
          'Conozco el ciclo de vida de un MCP Server',
          'Entiendo el formato JSON-RPC 2.0',
          'Sé los tipos de respuesta posibles',
          'Entiendo las diferencias de seguridad',
        ],
      },
      {
        id: 'practica1',
        title: '🛠️ Práctica: Tu Primer Servidor MCP',
        icon: '⚡',
        duration: '45 min',
        isPractice: true,
        content: CONTENT.practica1,
        tic: {
          acronym: 'LHT',
          trigger: '¡La Herramienta Transporta!',
          letters: [
            { letter: 'L', word: 'Lista (tools/list)', desc: 'Declara qué herramientas existen' },
            { letter: 'H', word: 'Handler (tools/call)', desc: 'Ejecuta cada herramienta' },
            { letter: 'T', word: 'Transport (stdio)', desc: 'Conecta el servidor al cliente' },
          ],
          analogy: 'Un servidor MCP siempre necesita 3 piezas: Lista (el menú), Handler (la cocina que prepara), Transport (el mesero que lleva y trae).',
          emoji: '🍽️',
        },
        codeExamples: {
          hint: 'Python necesita ~30 líneas vs ~60 de JavaScript gracias a FastMCP y los decoradores de tipo.',
          tabs: [
            {
              lang: 'javascript',
              badge: 'Node.js 18+',
              install: 'npm install @modelcontextprotocol/sdk',
              filename: 'servidor.js',
              code: `import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

const server = new Server(
  { name: "mi-primer-servidor-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// 1️⃣  Lista de herramientas disponibles
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "saludar",
      description: "Saluda a una persona por su nombre",
      inputSchema: {
        type: "object",
        properties: { nombre: { type: "string", description: "Nombre de la persona" } },
        required: ["nombre"]
      }
    },
    {
      name: "calcular",
      description: "Operaciones aritméticas: suma, resta, multiplicacion, division",
      inputSchema: {
        type: "object",
        properties: {
          operacion: { type: "string", enum: ["suma","resta","multiplicacion","division"] },
          a: { type: "number" },
          b: { type: "number" }
        },
        required: ["operacion","a","b"]
      }
    },
    {
      name: "obtener_hora",
      description: "Devuelve la hora actual en Lima, Perú",
      inputSchema: { type: "object", properties: {} }
    }
  ]
}));

// 2️⃣  Ejecutar la herramienta solicitada
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "saludar")
    return { content: [{ type: "text", text: \`¡Hola \${args.nombre}! 👋 Bienvenido al mundo MCP.\` }] };

  if (name === "calcular") {
    const ops = { suma: (a,b)=>a+b, resta: (a,b)=>a-b,
                  multiplicacion: (a,b)=>a*b, division: (a,b)=>b===0?"∞":a/b };
    const r = ops[args.operacion](args.a, args.b);
    return { content: [{ type: "text", text: \`\${args.a} \${args.operacion} \${args.b} = \${r}\` }] };
  }

  if (name === "obtener_hora") {
    const hora = new Date().toLocaleString("es-PE", { timeZone: "America/Lima" });
    return { content: [{ type: "text", text: \`Hora en Lima: \${hora}\` }] };
  }

  throw new Error(\`Herramienta desconocida: \${name}\`);
});

// 3️⃣  Conectar via stdio (el transport más común)
const transport = new StdioServerTransport();
await server.connect(transport);`,
            },
            {
              lang: 'python',
              badge: 'FastMCP',
              install: 'pip install mcp pytz',
              filename: 'servidor.py',
              code: `from mcp.server.fastmcp import FastMCP
from datetime import datetime
import pytz

# FastMCP simplifica todo con decoradores — sin boilerplate
mcp = FastMCP("mi-primer-servidor-mcp")

# 1️⃣  Herramienta 1: Saludar
@mcp.tool()
def saludar(nombre: str) -> str:
    """Saluda a una persona por su nombre"""
    return f"¡Hola {nombre}! 👋 Bienvenido al mundo de MCP."

# 2️⃣  Herramienta 2: Calcular
@mcp.tool()
def calcular(operacion: str, a: float, b: float) -> str:
    """Operaciones: suma, resta, multiplicacion, division"""
    ops = {
        "suma":           f"{a} + {b} = {a + b}",
        "resta":          f"{a} - {b} = {a - b}",
        "multiplicacion": f"{a} × {b} = {a * b}",
        "division":       f"{a} ÷ {b} = {a / b}" if b != 0 else "Error: División por cero",
    }
    return ops.get(operacion, f"Operación desconocida: {operacion}")

# 3️⃣  Herramienta 3: Hora actual
@mcp.tool()
def obtener_hora() -> str:
    """Devuelve la hora actual en Lima, Perú"""
    lima_tz = pytz.timezone("America/Lima")
    ahora = datetime.now(lima_tz)
    return f"Hora en Lima: {ahora.strftime('%A %d/%m/%Y %H:%M:%S')}"

# FastMCP gestiona el protocolo MCP automáticamente
if __name__ == "__main__":
    mcp.run()`,
            },
          ],
        },
        checklist: [
          'Instalé las dependencias del SDK de MCP (npm o pip)',
          'El servidor lista correctamente las 3 herramientas (tools/list)',
          'Cada herramienta responde con el resultado correcto (tools/call)',
          'Configuré el servidor en .claude/settings.json con ruta absoluta',
          'Probé las herramientas desde Claude Code y funcionan',
          '(Bonus) Probé con MCP Inspector para ver los mensajes JSON-RPC',
        ],
      },
    ],
  },
  {
    id: 'agentes',
    number: '03',
    title: 'Agentes',
    subtitle: 'Tipos, patrones y orquestación',
    icon: '🤖',
    colorFrom: '#7c3aed',
    colorTo: '#ec4899',
    tailwindGradient: 'from-violet-600 to-pink-500',
    tailwindText: 'text-violet-400',
    tailwindBg: 'bg-violet-500/10',
    tailwindBorder: 'border-violet-500/20',
    description: 'Aprende los tipos de agentes y cómo crear equipos multi-agente.',
    lessons: [
      {
        id: 'tipos',
        title: 'Tipos de Agentes',
        icon: '📋',
        duration: '20 min',
        content: CONTENT.tiposAgentes,
        tic: {
          acronym: 'SMMP',
          trigger: '¡El SiMple Multi-Planificador!',
          letters: [
            { letter: 'S', word: 'Simple', desc: 'Una tarea, sin estado' },
            { letter: 'M', word: 'Memoria', desc: 'Con experiencia acumulada' },
            { letter: 'M', word: 'Multi', desc: 'Equipo de especialistas' },
            { letter: 'P', word: 'Planificador', desc: 'Gerente que planifica' },
          ],
          analogy: 'Tipos de empleados: Simple (recién contratado), Memoria (con experiencia), Multi (equipo), Planificador (gerente que define la estrategia).',
          emoji: '👥',
        },
        codeExamples: {
          hint: 'Los 4 tipos de agentes en acción: Simple → Memoria → Planificador → Multi-agente. Escoge según la complejidad de tu tarea.',
          tabs: [
            {
              lang: 'javascript',
              badge: 'Anthropic SDK',
              setup: [
                'mkdir mi-agente && cd mi-agente',
                'npm init -y',
                'npm pkg set type=module',
                'npm pkg set scripts.start="node --env-file=.env tipos_agentes.js"',
                'echo "ANTHROPIC_API_KEY=tu-api-key-aqui" > .env',
              ],
              install: 'npm install @anthropic-ai/sdk',
              filename: 'tipos_agentes.js',
              code: `import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const MODEL = "claude-sonnet-4-6"

// ── 1. AGENTE SIMPLE (Tool-Using) ─────────────────────────
// Un LLM + herramientas, sin estado entre llamadas
const herramientas = [{
  name: "buscar_info",
  description: "Busca información sobre un tema",
  input_schema: {
    type: "object",
    properties: { tema: { type: "string", description: "Tema a buscar" } },
    required: ["tema"]
  }
}]

async function agenteSimple(pregunta) {
  const resp = await client.messages.create({
    model: MODEL, max_tokens: 512,
    tools: herramientas,
    messages: [{ role: "user", content: pregunta }]
  })
  console.log("🤖 Agente Simple:", resp.stop_reason)
  return resp
}

// ── 2. AGENTE CON MEMORIA (Conversacional) ────────────────
// Mantiene historial de mensajes como "memoria"
const historial = []

async function agenteConMemoria(mensaje) {
  historial.push({ role: "user", content: mensaje })
  const resp = await client.messages.create({
    model: MODEL, max_tokens: 512,
    system: "Recuerda toda la conversación y úsala para responder.",
    messages: historial           // ← el historial ES la memoria
  })
  const texto = resp.content[0].text
  historial.push({ role: "assistant", content: texto })
  return texto
}

// ── 3. AGENTE PLANIFICADOR ────────────────────────────────
// Genera un plan de pasos antes de ejecutar
async function agentePlanificador(objetivo) {
  // Paso 1: Planificar
  const planResp = await client.messages.create({
    model: MODEL, max_tokens: 512,
    system: "Crea un plan numerado de 3-5 pasos concretos para lograr el objetivo.",
    messages: [{ role: "user", content: \`Objetivo: \${objetivo}\` }]
  })
  const plan = planResp.content[0].text
  console.log("📋 Plan:", plan)

  // Paso 2: Ejecutar según el plan
  const execResp = await client.messages.create({
    model: MODEL, max_tokens: 1024,
    system: "Ejecuta el plan dado y produce el resultado final.",
    messages: [{ role: "user", content: \`Plan a ejecutar:\n\${plan}\` }]
  })
  return execResp.content[0].text
}

// ── 4. MULTI-AGENTE (Pipeline secuencial) ─────────────────
// Cada agente es una función con su propio system prompt
async function agenteInvestigador(tema) {
  const r = await client.messages.create({
    model: MODEL, max_tokens: 1024,
    system: "Eres un investigador experto. Encuentra hechos clave, estadísticas y ejemplos.",
    messages: [{ role: "user", content: \`Investiga: \${tema}\` }]
  })
  return r.content[0].text
}

async function agenteRedactor(investigacion) {
  const r = await client.messages.create({
    model: MODEL, max_tokens: 1024,
    system: "Eres un redactor ejecutivo. Sintetiza la investigación en un reporte claro.",
    messages: [{ role: "user", content: investigacion }]
  })
  return r.content[0].text
}

// ── LLAMADAS DE PRUEBA ────────────────────────────────────

// 1. AGENTE SIMPLE — descomenta para probar
// const respSimple = await agenteSimple("¿Qué es el protocolo MCP?")
// console.log("🤖 Agente Simple stop_reason:", respSimple.stop_reason)

// 2. AGENTE CON MEMORIA — descomenta para probar (puedes encadenar varias llamadas)
// const r1 = await agenteConMemoria("Mi nombre es Genaro")
// console.log("💬 Memoria 1:", r1)
// const r2 = await agenteConMemoria("¿Cómo me llamo?")
// console.log("💬 Memoria 2:", r2)

// 3. AGENTE PLANIFICADOR — descomenta para probar
// const resultado = await agentePlanificador("Crear una API REST con Node.js y Express")
// console.log("✅ Resultado Planificador:\\n", resultado)

// 4. MULTI-AGENTE (Pipeline secuencial) — descomenta para probar
const tema = "Protocolo MCP y el futuro de los agentes IA"
const investigacion = await agenteInvestigador(tema)
const reporte = await agenteRedactor(investigacion)
console.log("📄 Reporte Final:\\n", reporte)`,
              run: 'npm start',
            },
            {
              lang: 'python',
              badge: 'Anthropic SDK',
              setup: [
                'mkdir mi-agente && cd mi-agente',
                'python -m venv venv && source venv/bin/activate',
                'echo "ANTHROPIC_API_KEY=tu-api-key-aqui" > .env',
              ],
              install: 'pip install anthropic python-dotenv',
              filename: 'tipos_agentes.py',
              code: `import os
import anthropic
from dotenv import load_dotenv

load_dotenv()
client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
MODEL = "claude-sonnet-4-6"

# ── 1. AGENTE SIMPLE (Tool-Using) ─────────────────────────
# Un LLM + herramientas, sin estado entre llamadas
herramientas = [{
    "name": "buscar_info",
    "description": "Busca información sobre un tema",
    "input_schema": {
        "type": "object",
        "properties": {"tema": {"type": "string", "description": "Tema a buscar"}},
        "required": ["tema"]
    }
}]

def agente_simple(pregunta: str):
    resp = client.messages.create(
        model=MODEL, max_tokens=512,
        tools=herramientas,
        messages=[{"role": "user", "content": pregunta}]
    )
    print("🤖 Agente Simple:", resp.stop_reason)
    return resp

# ── 2. AGENTE CON MEMORIA (Conversacional) ────────────────
# Mantiene historial de mensajes como "memoria"
historial = []

def agente_con_memoria(mensaje: str) -> str:
    historial.append({"role": "user", "content": mensaje})
    resp = client.messages.create(
        model=MODEL, max_tokens=512,
        system="Recuerda toda la conversación y úsala para responder.",
        messages=historial           # ← el historial ES la memoria
    )
    texto = resp.content[0].text
    historial.append({"role": "assistant", "content": texto})
    return texto

# ── 3. AGENTE PLANIFICADOR ────────────────────────────────
# Genera un plan de pasos antes de ejecutar
def agente_planificador(objetivo: str) -> str:
    # Paso 1: Planificar
    plan_resp = client.messages.create(
        model=MODEL, max_tokens=512,
        system="Crea un plan numerado de 3-5 pasos concretos para lograr el objetivo.",
        messages=[{"role": "user", "content": f"Objetivo: {objetivo}"}]
    )
    plan = plan_resp.content[0].text
    print("📋 Plan:", plan)

    # Paso 2: Ejecutar según el plan
    exec_resp = client.messages.create(
        model=MODEL, max_tokens=1024,
        system="Ejecuta el plan dado y produce el resultado final.",
        messages=[{"role": "user", "content": f"Plan a ejecutar:\\n{plan}"}]
    )
    return exec_resp.content[0].text

# ── 4. MULTI-AGENTE (Pipeline secuencial) ─────────────────
# Cada agente es una función con su propio system prompt
def agente_investigador(tema: str) -> str:
    r = client.messages.create(
        model=MODEL, max_tokens=1024,
        system="Eres un investigador experto. Encuentra hechos clave, estadísticas y ejemplos.",
        messages=[{"role": "user", "content": f"Investiga: {tema}"}]
    )
    return r.content[0].text

def agente_redactor(investigacion: str) -> str:
    r = client.messages.create(
        model=MODEL, max_tokens=1024,
        system="Eres un redactor ejecutivo. Sintetiza la investigación en un reporte claro.",
        messages=[{"role": "user", "content": investigacion}]
    )
    return r.content[0].text

# Pipeline: investigador → redactor (output de uno = input del otro)
tema = "Protocolo MCP y el futuro de los agentes IA"
investigacion = agente_investigador(tema)
reporte = agente_redactor(investigacion)
print("📄 Reporte Final:\\n", reporte)`,
              run: 'python tipos_agentes.py',
            },
          ],
        },
        checklist: [
          'Distingo los 4 tipos de agentes',
          'Entiendo los 4 patrones de orquestación',
          'Sé cómo los agentes se comunican entre sí',
          'Sé cuándo usar cada tipo',
        ],
      },
      {
        id: 'rag',
        title: 'RAG: Retrieval-Augmented Generation',
        icon: '🔍',
        duration: '25 min',
        content: CONTENT.rag,
        tic: {
          acronym: 'RAG',
          trigger: '¡Busca ANTES de hablar!',
          letters: [
            { letter: 'R', word: 'Retrieval', desc: 'Recuperar información relevante de una fuente' },
            { letter: 'A', word: 'Augmented', desc: 'Aumentar el contexto del LLM con esa información' },
            { letter: 'G', word: 'Generation', desc: 'Generar la respuesta fundamentada en evidencia' },
          ],
          analogy: 'El Estudiante con Biblioteca: antes del examen busca libros relevantes, los lee y responde con evidencia. Sin RAG, el estudiante adivina; con RAG, cita la fuente.',
          emoji: '📚',
        },
        codeExamplesGroups: [
          // ── GRUPO 1: PYTHON ──────────────────────────────────────────
          {
            label: '🐍 Python · LangChain + Ollama',
            hint: 'Pipeline RAG completo en Python con modelos 100% locales (Ollama). Sin costo, sin API key.',
            tabs: [
              {
                lang: 'python',
                badge: 'Indexar',
                install: 'pip install langchain langchain-community langchain-ollama chromadb',
                filename: 'rag_indexar.py',
                code: `# rag_indexar.py — FASE 1: construir la base de conocimiento
# Requiere: ollama pull nomic-embed-text

from langchain_community.document_loaders import TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_ollama import OllamaEmbeddings
from langchain_community.vectorstores import Chroma

# 1. Cargar documento
loader = TextLoader("mi_documento.txt", encoding="utf-8")
docs = loader.load()

# 2. Chunking: dividir con overlap para no perder contexto
splitter = RecursiveCharacterTextSplitter(
    chunk_size=512,      # 512 tokens por chunk
    chunk_overlap=50,    # 50 tokens de superposición
    separators=["\\n\\n", "\\n", ".", " "]
)
chunks = splitter.split_documents(docs)
print(f"✅ {len(chunks)} chunks creados")

# 3. Embeddings locales con Ollama (gratis)
embeddings = OllamaEmbeddings(model="nomic-embed-text")

# 4. Guardar en ChromaDB (vector DB local)
vectordb = Chroma.from_documents(
    documents=chunks,
    embedding=embeddings,
    persist_directory="./mi_vectordb"
)
print(f"✅ {vectordb._collection.count()} vectores guardados en ./mi_vectordb")`,
              },
              {
                lang: 'python',
                badge: 'Consultar',
                install: 'pip install langchain langchain-community langchain-ollama chromadb',
                filename: 'rag_consultar.py',
                code: `# rag_consultar.py — FASE 2: hacer preguntas a tus documentos
# Requiere: ollama pull llama3.2 && ollama pull nomic-embed-text

from langchain_ollama import OllamaEmbeddings, OllamaLLM
from langchain_community.vectorstores import Chroma
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate

# Cargar vector DB existente
embeddings = OllamaEmbeddings(model="nomic-embed-text")
vectordb = Chroma(
    persist_directory="./mi_vectordb",
    embedding_function=embeddings
)

# LLM local con Ollama
llm = OllamaLLM(model="llama3.2", temperature=0)

# Prompt personalizado en español
PROMPT = """Usa el contexto para responder en español.
Si no sabes, di "No encontré información sobre eso."
No inventes datos.

Contexto: {context}
Pregunta: {question}
Respuesta:"""

rag_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=vectordb.as_retriever(
        search_kwargs={"k": 3}   # top 3 chunks más relevantes
    ),
    chain_type_kwargs={"prompt": PromptTemplate(
        template=PROMPT,
        input_variables=["context", "question"]
    )},
    return_source_documents=True
)

# Modo interactivo
print("🤖 RAG Local activo. 'salir' para terminar.\\n")
while True:
    pregunta = input("❓ Pregunta: ").strip()
    if pregunta.lower() == "salir": break

    resultado = rag_chain.invoke({"query": pregunta})
    print(f"\\n💬 {resultado['result']}")
    print(f"\\n📚 Basado en {len(resultado['source_documents'])} fragmentos\\n")`,
              },
              {
                lang: 'python',
                badge: 'Reranker',
                install: 'pip install langchain langchain-community sentence-transformers',
                filename: 'rag_reranker.py',
                code: `# rag_reranker.py — RAG avanzado con reranking (+10-30% precisión)
# El reranker evalúa qué tan relevante es cada chunk para la pregunta
# y re-ordena los resultados antes de pasarlos al LLM.

from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import CrossEncoderReranker
from langchain_community.cross_encoders import HuggingFaceCrossEncoder
from langchain_ollama import OllamaEmbeddings, OllamaLLM
from langchain_community.vectorstores import Chroma
from langchain.chains import RetrievalQA

# Cargar vector DB
embeddings = OllamaEmbeddings(model="nomic-embed-text")
vectordb = Chroma(
    persist_directory="./mi_vectordb",
    embedding_function=embeddings
)

# Reranker: modelo cross-encoder (evalúa relevancia par query-chunk)
reranker = CrossEncoderReranker(
    model=HuggingFaceCrossEncoder(
        model_name="cross-encoder/ms-marco-MiniLM-L-6-v2"
    ),
    top_n=3  # quedarse con los 3 mejores tras reranquear
)

# Estrategia: recuperar 10 candidatos, reranquear a top 3
retriever_base = vectordb.as_retriever(search_kwargs={"k": 10})
retriever_mejorado = ContextualCompressionRetriever(
    base_compressor=reranker,
    base_retriever=retriever_base
)

# Cadena RAG con retriever mejorado
llm = OllamaLLM(model="llama3.2", temperature=0)
rag_mejorado = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=retriever_mejorado,
    return_source_documents=True
)

resultado = rag_mejorado.invoke({"query": "¿Cuál es el tema principal?"})
print(resultado["result"])`,
              },
            ],
          },
          // ── GRUPO 2: JAVASCRIPT ──────────────────────────────────────
          {
            label: '⚡ JavaScript · LangChain.js + Ollama',
            hint: 'Pipeline RAG completo en JavaScript con modelos 100% locales (Ollama). Sin costo, sin API key. Orden: ejecuta Indexar primero, luego Consultar.',
            tabs: [
              {
                lang: 'javascript',
                badge: 'Indexar',
                setup: [
                  'mkdir rag-local && cd rag-local',
                  'npm init -y',
                  'npm pkg set type=module',
                  'npm pkg set scripts.indexar="node rag_indexar.js" scripts.consultar="node rag_consultar.js"',
                  'docker run -d -p 8000:8000 chromadb/chroma',
                  'ollama pull nomic-embed-text',
                  'echo "El protocolo MCP conecta LLMs con herramientas externas de forma estándar." > mi_documento.txt',
                ],
                install: 'npm install langchain @langchain/community @langchain/core @langchain/ollama chromadb',
                filename: 'rag_indexar.js',
                code: `// rag_indexar.js — FASE 1: construir la base de conocimiento
// Requiere: ollama pull nomic-embed-text

import { TextLoader } from "langchain/document_loaders/fs/text"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import { OllamaEmbeddings } from "@langchain/ollama"
import { Chroma } from "@langchain/community/vectorstores/chroma"

// 1. Cargar documento
const loader = new TextLoader("./mi_documento.txt")
const docs = await loader.load()
console.log(\`📄 \${docs.length} documento(s) cargado(s)\`)

// 2. Chunking con overlap para no perder contexto en los bordes
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 512,       // 512 caracteres por chunk
  chunkOverlap: 50,     // 50 caracteres de superposición
  separators: ["\\n\\n", "\\n", ".", " "]
})
const chunks = await splitter.splitDocuments(docs)
console.log(\`✅ \${chunks.length} chunks creados\`)

// 3. Embeddings locales con Ollama (gratis, sin API key)
const embeddings = new OllamaEmbeddings({ model: "nomic-embed-text" })

// 4. Guardar en ChromaDB (vector DB local)
const vectordb = await Chroma.fromDocuments(chunks, embeddings, {
  collectionName: "mi-coleccion",
  url: "http://localhost:8000",
})

const count = await vectordb.collection.count()
console.log(\`✅ \${count} vectores guardados en ChromaDB\`)
console.log("🚀 Ahora ejecuta: npm run consultar")`,
                run: 'npm run indexar',
              },
              {
                lang: 'javascript',
                badge: 'Consultar',
                setup: [
                  'ollama pull llama3.2',
                  'npm run indexar',
                ],
                install: 'npm install langchain @langchain/community @langchain/core @langchain/ollama chromadb',
                filename: 'rag_consultar.js',
                code: `// rag_consultar.js — FASE 2: hacer preguntas a tus documentos
// Prerrequisito: haber ejecutado rag_indexar.js al menos una vez

import { OllamaEmbeddings, Ollama } from "@langchain/ollama"
import { Chroma } from "@langchain/community/vectorstores/chroma"
import { RetrievalQAChain } from "langchain/chains"
import { PromptTemplate } from "@langchain/core/prompts"
import * as readline from "node:readline/promises"

// Cargar vector DB existente
const embeddings = new OllamaEmbeddings({ model: "nomic-embed-text" })
const vectordb = await Chroma.fromExistingCollection(embeddings, {
  collectionName: "mi-coleccion",
  url: "http://localhost:8000",
})
console.log("📚 Colección cargada desde ChromaDB")

// LLM local con Ollama
const llm = new Ollama({ model: "llama3.2", temperature: 0 })

// Prompt personalizado en español
const prompt = PromptTemplate.fromTemplate(\`
Usa el contexto para responder en español.
Si no sabes, di "No encontré información sobre eso."
No inventes datos.

Contexto: {context}
Pregunta: {question}
Respuesta:\`)

// Cadena RAG
const ragChain = RetrievalQAChain.fromLLM(llm, vectordb.asRetriever(3), {
  prompt,
  returnSourceDocuments: true,
})

// Modo interactivo
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
console.log("🤖 RAG Local activo. Escribe 'salir' para terminar.\\n")

while (true) {
  const pregunta = await rl.question("❓ Pregunta: ")
  if (pregunta.trim().toLowerCase() === "salir") { rl.close(); break }

  const resultado = await ragChain.invoke({ query: pregunta })
  console.log(\`\\n💬 \${resultado.text}\`)
  console.log(\`\\n📚 Basado en \${resultado.sourceDocuments.length} fragmentos\\n\`)
}`,
                run: 'npm run consultar',
              },
              {
                lang: 'javascript',
                badge: 'Reranker',
                setup: [
                  'npm install @langchain/cohere',
                  'echo "COHERE_API_KEY=tu-key-aqui" >> .env',
                  'npm pkg set scripts.reranker="node --env-file=.env rag_reranker.js"',
                ],
                install: 'npm install langchain @langchain/community @langchain/core @langchain/ollama chromadb @langchain/cohere',
                filename: 'rag_reranker.js',
                code: `// rag_reranker.js — RAG avanzado con reranking (+10-30% precisión)
// El reranker evalúa qué tan relevante es cada chunk para la pregunta
// y reordena los resultados antes de pasarlos al LLM.

import { OllamaEmbeddings, Ollama } from "@langchain/ollama"
import { Chroma } from "@langchain/community/vectorstores/chroma"
import { ContextualCompressionRetriever } from "langchain/retrievers/contextual_compression"
import { CohereRerank } from "@langchain/cohere"
import { RetrievalQAChain } from "langchain/chains"

// Cargar vector DB
const embeddings = new OllamaEmbeddings({ model: "nomic-embed-text" })
const vectordb = await Chroma.fromExistingCollection(embeddings, {
  collectionName: "mi-coleccion",
  url: "http://localhost:8000",
})

// Reranker con Cohere (gratis con plan trial)
const reranker = new CohereRerank({
  apiKey: process.env.COHERE_API_KEY,
  topN: 3,
  model: "rerank-multilingual-v3.0",
})

// Estrategia: recuperar 10 candidatos → reranquear a top 3
const retrieverBase = vectordb.asRetriever(10)
const retrieverMejorado = new ContextualCompressionRetriever({
  baseCompressor: reranker,
  baseRetriever: retrieverBase,
})

// Cadena RAG con retriever mejorado
const llm = new Ollama({ model: "llama3.2", temperature: 0 })
const ragMejorado = RetrievalQAChain.fromLLM(llm, retrieverMejorado, {
  returnSourceDocuments: true,
})

const resultado = await ragMejorado.invoke({
  query: "¿Cuál es el tema principal del documento?"
})
console.log("💬", resultado.text)
console.log(\`📚 Fragmentos usados: \${resultado.sourceDocuments.length}\`)`,
                run: 'npm run reranker',
              },
            ],
          },
        ],
        checklist: [
          'Entiendo las 2 fases del pipeline RAG (indexación y consulta)',
          'Sé qué es chunking y por qué importa el chunk_overlap',
          'Entiendo qué son los embeddings y cómo representan significado',
          'Conozco al menos 3 bases de datos vectoriales',
          'Distingo RAG Básico de GraphRAG, Self-RAG y Agentic RAG',
          'Ejecuté el código de indexación y consulta con Ollama',
        ],
      },
      {
        id: 'practica2',
        title: '🛠️ Práctica: Equipo de Agentes (Python/JS)',
        icon: '⚡',
        duration: '60 min',
        isPractice: true,
        content: CONTENT.practica2,
        tic: {
          acronym: 'ARTC',
          trigger: '¡ARTC = Arte de los Crews!',
          letters: [
            { letter: 'A', word: 'Agente', desc: 'La entidad que trabaja (quién)' },
            { letter: 'R', word: 'Rol', desc: 'Su especialidad (qué es)' },
            { letter: 'T', word: 'Tarea', desc: 'Lo que debe hacer (qué hace)' },
            { letter: 'C', word: 'Crew', desc: 'El equipo que los coordina (orquestador)' },
          ],
          analogy: 'Como armar un equipo de consultores: primero defines quiénes son (Agentes), sus roles (Rol), les asignas proyectos (Tareas) y los coordinas en un equipo (Crew).',
          emoji: '🎯',
        },
        codeExamples: {
          hint: 'CrewAI abstrae roles y backstories. El SDK de Anthropic da control total — cada agente es una función async.',
          tabs: [
            {
              lang: 'python',
              badge: 'CrewAI',
              setup: [
                'mkdir equipo-agentes && cd equipo-agentes',
                'python -m venv venv && source venv/bin/activate',
                'echo "ANTHROPIC_API_KEY=tu-api-key-aqui" > .env',
              ],
              install: 'pip install crewai langchain-anthropic python-dotenv',
              filename: 'equipo_investigacion.py',
              code: `from dotenv import load_dotenv
from crewai import Agent, Task, Crew, Process
from langchain_anthropic import ChatAnthropic

load_dotenv()
llm = ChatAnthropic(model="claude-3-5-sonnet-20241022", temperature=0.1)

# ── Agente 1: Investigador ──────────────────────────────────
investigador = Agent(
    role="Investigador Senior",
    goal="Encontrar información precisa y actualizada sobre el tema",
    backstory="Experto con 10 años investigando tendencias tecnológicas.",
    llm=llm,
    verbose=True
)

# ── Agente 2: Redactor ──────────────────────────────────────
redactor = Agent(
    role="Redactor de Informes Ejecutivos",
    goal="Convertir investigaciones en reportes concisos y accionables",
    backstory="Comunicador empresarial especializado en síntesis estratégica.",
    llm=llm
)

# ── Tarea 1: Investigar ─────────────────────────────────────
tarea_investigacion = Task(
    description="""Investiga exhaustivamente: {tema}
    Cubre: contexto, estado actual, actores clave, ejemplos, desafíos.""",
    expected_output="Informe detallado, mínimo 500 palabras",
    agent=investigador
)

# ── Tarea 2: Redactar reporte ───────────────────────────────
tarea_reporte = Task(
    description="""Crea un reporte ejecutivo basado en la investigación.
    Incluye: resumen, puntos clave, recomendaciones, conclusión.
    Formato Markdown, máximo 800 palabras.""",
    expected_output="Reporte ejecutivo en Markdown",
    agent=redactor
)

# ── Crew: coordina el pipeline secuencial ───────────────────
equipo = Crew(
    agents=[investigador, redactor],
    tasks=[tarea_investigacion, tarea_reporte],
    process=Process.sequential,   # output de tarea1 → input de tarea2
    verbose=True
)

resultado = equipo.kickoff(inputs={"tema": "MCP y Agentes de IA en 2025"})
print(resultado)`,
              run: 'python equipo_investigacion.py',
            },
            {
              lang: 'javascript',
              badge: 'Anthropic SDK',
              setup: [
                'mkdir equipo-agentes && cd equipo-agentes',
                'npm init -y',
                'npm pkg set type=module',
                'npm pkg set scripts.start="node --env-file=.env equipo_investigacion.js"',
                'echo "ANTHROPIC_API_KEY=tu-api-key-aqui" > .env',
              ],
              install: 'npm install @anthropic-ai/sdk',
              filename: 'equipo_investigacion.js',
              code: `import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const MODEL = "claude-sonnet-4-6"

// ── Agente 1: Investigador (función async con system prompt) ─
async function agenteInvestigador(tema) {
  const resp = await client.messages.create({
    model: MODEL,
    max_tokens: 2048,
    system: \`Eres un Investigador Senior con 10 años investigando tendencias tecnológicas.
Tu objetivo: encontrar información precisa y detallada.
Cubre: contexto, estado actual, actores clave, ejemplos y desafíos.\`,
    messages: [{ role: "user", content: \`Investiga exhaustivamente: \${tema}\` }]
  })
  return resp.content.find(b => b.type === "text")?.text ?? ""
}

// ── Agente 2: Redactor (función async con system prompt) ────
async function agenteRedactor(investigacion) {
  const resp = await client.messages.create({
    model: MODEL,
    max_tokens: 2048,
    system: \`Eres un Redactor de Informes Ejecutivos especializado en síntesis estratégica.
Convierte investigaciones en reportes ejecutivos concisos y accionables.
Incluye: resumen ejecutivo, puntos clave, recomendaciones y conclusión.
Formato Markdown, máximo 800 palabras.\`,
    messages: [{
      role: "user",
      content: \`Crea un reporte ejecutivo basado en esta investigación:\\n\\n\${investigacion}\`
    }]
  })
  return resp.content.find(b => b.type === "text")?.text ?? ""
}

// ── Pipeline secuencial: output(agente1) → input(agente2) ───
async function equipoInvestigacion(tema) {
  console.log(\`\\n\${"=".repeat(50)}\`)
  console.log(\`🎯 Tema: \${tema}\`)
  console.log("=".repeat(50))

  console.log("\\n🔍 Agente 1 (Investigador) trabajando...")
  const investigacion = await agenteInvestigador(tema)
  console.log(\`✅ Investigación lista: \${investigacion.length} caracteres\`)

  console.log("\\n✍️  Agente 2 (Redactor) trabajando...")
  const reporte = await agenteRedactor(investigacion)

  console.log("\\n📄 Reporte Final:\\n")
  console.log(reporte)
  return reporte
}

await equipoInvestigacion("MCP y Agentes de IA en 2025")`,
              run: 'npm start',
            },
          ],
        },
        checklist: [
          'Python: instalé CrewAI y definí 2 agentes con roles y backstory únicos',
          'Python: ejecuté el Crew en modo Process.sequential exitosamente',
          'JS: implementé los 2 agentes como funciones async con system prompts distintos',
          'JS: encadené el output del investigador como input del redactor',
          'El reporte final está en formato Markdown y tiene resumen + recomendaciones',
          '(Bonus) Probé con diferentes temas y el pipeline funciona en ambos lenguajes',
        ],
      },
    ],
  },
  {
    id: 'n8n',
    number: '04',
    title: 'n8n',
    subtitle: 'Automatización visual con IA',
    icon: '🔄',
    colorFrom: '#10b981',
    colorTo: '#06b6d4',
    tailwindGradient: 'from-emerald-500 to-cyan-500',
    tailwindText: 'text-emerald-400',
    tailwindBg: 'bg-emerald-500/10',
    tailwindBorder: 'border-emerald-500/20',
    description: 'Automatiza flujos de trabajo complejos sin escribir código.',
    lessons: [
      {
        id: 'concepto',
        title: '¿Qué es n8n?',
        icon: '🔄',
        duration: '20 min',
        content: CONTENT.n8n,
        tic: {
          acronym: 'DIRECTOR',
          trigger: 'n8n = El Director de Orquesta',
          letters: [
            { letter: 'D', word: 'Dirige', desc: 'Coordina sin ejecutar' },
            { letter: 'I', word: 'Integra', desc: 'Conecta servicios' },
            { letter: 'R', word: 'Rutea', desc: 'Decide qué camino seguir' },
            { letter: 'E', word: 'Ejecuta', desc: 'Corre los nodos' },
            { letter: 'C', word: 'Conecta', desc: 'APIs y herramientas' },
            { letter: 'T', word: 'Transforma', desc: 'Datos entre nodos' },
            { letter: 'O', word: 'Orquesta', desc: 'Todo el flujo' },
            { letter: 'R', word: 'Repite', desc: 'Automatizado' },
          ],
          analogy: 'n8n es el Director de Orquesta: no toca ningún instrumento pero coordina que cada músico (servicio/IA) actúe en el momento exacto.',
          emoji: '🎭',
        },
        checklist: [
          'Entiendo la diferencia con Zapier/Make',
          'Instalé n8n con Docker',
          'Conozco los tipos de nodos disponibles',
          'Entiendo los 3 patrones principales',
        ],
      },
      {
        id: 'practica3',
        title: '🛠️ Práctica: Flujo con Agente',
        icon: '⚡',
        duration: '45 min',
        isPractice: true,
        content: CONTENT.practica3,
        tic: null,
        codeExamples: {
          hint: 'El flujo n8n es visual (sin código), pero puedes probarlo y automatizarlo desde Python o JavaScript.',
          tabs: [
            {
              lang: 'python',
              badge: 'Probador webhook',
              install: 'pip install requests',
              filename: 'probar_webhook.py',
              code: `import requests

# ── Configuración ──────────────────────────────────────────
URL = "http://localhost:5678/webhook/clasificar-mensaje"

mensajes_prueba = [
    "¿Cuánto cuesta el plan premium?",          # → consulta
    "El producto llegó roto y nadie me atiende", # → queja
    "¡Excelente servicio, muy contento!",        # → elogio
    "COMPRA YA GANA DINERO FACIL 100%",          # → spam
]

print("🚀 Probando clasificador n8n...\\n")
print("=" * 55)

for msg in mensajes_prueba:
    try:
        r = requests.post(URL, json={"message": msg}, timeout=10)
        data = r.json()
        categoria = data.get("categoria", "N/A")
        respuesta = data.get("respuesta", "N/A")

        icono = {"consulta": "❓", "queja": "😡", "elogio": "🌟", "spam": "🚫"}.get(categoria, "🔹")
        print(f"📨 {msg[:45]}")
        print(f"{icono} Categoría : {categoria.upper()}")
        print(f"💬 Respuesta: {respuesta[:60]}")
        print("-" * 55)

    except requests.exceptions.ConnectionError:
        print("❌ Error: n8n no está corriendo en localhost:5678")
        print("   Ejecuta: docker-compose up -d")
        break

print("\\n✅ Prueba completada")`,
            },
            {
              lang: 'javascript',
              badge: 'Probador webhook',
              install: 'npm install node-fetch',
              filename: 'probar_webhook.js',
              code: `// probar_webhook.js — Probador del clasificador n8n
// Ejecutar: node probar_webhook.js

const URL = "http://localhost:5678/webhook/clasificar-mensaje"

const mensajesPrueba = [
  "¿Cuánto cuesta el plan premium?",           // → consulta
  "El producto llegó roto y nadie me atiende",  // → queja
  "¡Excelente servicio, muy contento!",         // → elogio
  "COMPRA YA GANA DINERO FACIL 100%",           // → spam
]

const ICONOS = { consulta: "❓", queja: "😡", elogio: "🌟", spam: "🚫" }

console.log("🚀 Probando clasificador n8n...\\n")
console.log("=".repeat(55))

for (const msg of mensajesPrueba) {
  try {
    const r = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg }),
      signal: AbortSignal.timeout(10000),
    })

    const data = await r.json()
    const categoria = data.categoria ?? "N/A"
    const respuesta = data.respuesta ?? "N/A"
    const icono = ICONOS[categoria] ?? "🔹"

    console.log(\`📨 \${msg.slice(0, 45)}\`)
    console.log(\`\${icono} Categoría : \${categoria.toUpperCase()}\`)
    console.log(\`💬 Respuesta: \${respuesta.slice(0, 60)}\`)
    console.log("-".repeat(55))

  } catch (err) {
    console.error("❌ Error: n8n no está corriendo en localhost:5678")
    console.error("   Ejecuta: docker-compose up -d")
    break
  }
}

console.log("\\n✅ Prueba completada")`,
            },
          ],
        },
        checklist: [
          'Creé el workflow en n8n',
          'El webhook recibe mensajes correctamente',
          'El nodo de IA clasifica los mensajes',
          'El switch enruta según la clasificación',
          'Probé con curl y obtuve respuestas correctas',
        ],
      },
    ],
  },
  {
    id: 'ia-local',
    number: '05',
    title: 'IA Local',
    subtitle: 'Ollama y modelos sin nube',
    icon: '🏠',
    colorFrom: '#14b8a6',
    colorTo: '#3b82f6',
    tailwindGradient: 'from-teal-500 to-blue-500',
    tailwindText: 'text-teal-400',
    tailwindBg: 'bg-teal-500/10',
    tailwindBorder: 'border-teal-500/20',
    description: 'Corre modelos de IA localmente con privacidad total y sin costos.',
    lessons: [
      {
        id: 'concepto',
        title: '¿Por qué IA Local?',
        icon: '🏠',
        duration: '20 min',
        content: CONTENT.iaLocal,
        tic: {
          acronym: 'POLI',
          trigger: '¡Tienes tu propio POLIclínico!',
          letters: [
            { letter: 'P', word: 'Privado', desc: 'Datos nunca salen' },
            { letter: 'O', word: 'Offline', desc: 'Funciona sin internet' },
            { letter: 'L', word: 'Libre', desc: 'Sin pagar por consulta' },
            { letter: 'I', word: 'Instantáneo', desc: 'Sin colas de servidor' },
          ],
          analogy: 'La IA local es como tener un POLIclínico propio: Privado (tus datos), Offline (siempre disponible), Libre (sin pagar), Instantáneo (sin esperas).',
          emoji: '🏥',
        },
        checklist: [
          'Entiendo cuándo conviene IA local vs cloud',
          'Sé qué hardware mínimo necesito',
          'Instalé Ollama y corrí un modelo',
          'Probé la API de Ollama con curl',
        ],
      },
      {
        id: 'practica4',
        title: '🛠️ Práctica: Agente Local (Python/JS)',
        icon: '⚡',
        duration: '60 min',
        isPractice: true,
        content: CONTENT.practica4,
        tic: {
          acronym: 'LOHA',
          trigger: '¡LOHA! — Local + Ollama + Herramientas + Agente',
          letters: [
            { letter: 'L', word: 'Local', desc: 'Sin internet ni costo por token' },
            { letter: 'O', word: 'Ollama', desc: 'El servidor local de modelos' },
            { letter: 'H', word: 'Herramientas', desc: 'Las tools con @tool / tool()' },
            { letter: 'A', word: 'Agente ReAct', desc: 'El loop Thought→Action→Observation' },
          ],
          analogy: 'LOHA es todo lo que necesitas: un modelo Local (Ollama), las Herramientas que puede usar, y el Agente ReAct que razona y actúa. Sin nube, sin factura.',
          emoji: '🏠',
        },
        codeExamples: {
          hint: 'Python usa @tool decorators y wikipediaapi. JavaScript usa la Wikipedia REST API y Zod para validar parámetros.',
          tabs: [
            {
              lang: 'python',
              badge: 'LangChain',
              setup: [
                'ollama pull llama3.2:latest',
                'ollama serve',
                'mkdir agente-local && cd agente-local',
                'python -m venv venv && source venv/bin/activate',
              ],
              install: 'pip install langchain langchain-ollama wikipedia-api',
              filename: 'agente_local.py',
              code: `from langchain_ollama import ChatOllama
from langchain.agents import create_react_agent, AgentExecutor
from langchain.tools import tool
from langchain import hub
import wikipediaapi, math

# 1️⃣  Modelo local via Ollama
llm = ChatOllama(model="llama3.2:latest", temperature=0)

# 2️⃣  Herramientas con @tool — el docstring es la descripción para el LLM
@tool
def buscar_wikipedia(consulta: str) -> str:
    """Busca en Wikipedia en español. Usar para información factual sobre personas, lugares, conceptos."""
    wiki = wikipediaapi.Wikipedia(language='es', user_agent='AgentLocal/1.0')
    pagina = wiki.page(consulta)
    return (pagina.summary[:500] + "...") if pagina.exists() else f"No encontré '{consulta}'."

@tool
def calcular(expresion: str) -> str:
    """Evalúa expresiones matemáticas. Ejemplos: '25*4+10', 'sqrt(144)', 'pi*2**2'"""
    try:
        r = eval(expresion, {"__builtins__": {}}, vars(math))
        return f"'{expresion}' = {r}"
    except Exception as e:
        return f"Error en cálculo: {str(e)}"

@tool
def leer_archivo(ruta: str) -> str:
    """Lee el contenido de un archivo de texto local."""
    try:
        with open(ruta, 'r', encoding='utf-8') as f:
            c = f.read()
        return c[:1000] if len(c) > 1000 else c
    except FileNotFoundError:
        return f"Archivo no encontrado: {ruta}"

# 3️⃣  Crear agente ReAct (Reasoning + Acting)
herramientas = [buscar_wikipedia, calcular, leer_archivo]
prompt = hub.pull("hwchase17/react")          # Prompt ReAct de LangChain Hub
agente = create_react_agent(llm=llm, tools=herramientas, prompt=prompt)
ejecutor = AgentExecutor(
    agent=agente, tools=herramientas,
    verbose=True,          # Muestra el razonamiento paso a paso
    max_iterations=5       # Evita loops infinitos
)

# 4️⃣  Loop de conversación
print("🤖 Agente Local activo. Escribe 'salir' para terminar.")
while True:
    pregunta = input("\\n👤 Tú: ").strip()
    if pregunta.lower() in ['salir', 'exit']:
        break
    respuesta = ejecutor.invoke({"input": pregunta})
    print(f"\\n✅ {respuesta['output']}")`,
              run: 'python agente_local.py',
            },
            {
              lang: 'javascript',
              badge: 'LangChain.js',
              setup: [
                'ollama pull llama3.2:latest',
                'ollama serve',
                'mkdir agente-local && cd agente-local',
                'npm init -y',
                'npm pkg set type=module',
              ],
              install: 'npm install @langchain/ollama @langchain/langgraph @langchain/core zod',
              filename: 'agente_local.js',
              code: `import { ChatOllama } from "@langchain/ollama";
import { tool } from "@langchain/core/tools";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { z } from "zod";
import { readFileSync } from "fs";
import * as readline from "readline";

// 1️⃣  Modelo local via Ollama
const llm = new ChatOllama({ model: "llama3.2:latest", temperature: 0 });

// 2️⃣  Herramientas — usa Zod para validar parámetros
const buscarWikipedia = tool(
  async ({ consulta }) => {
    const url = \`https://es.wikipedia.org/api/rest_v1/page/summary/\${encodeURIComponent(consulta)}\`;
    const resp = await fetch(url);
    const data = await resp.json();
    return data.extract
      ? data.extract.slice(0, 500) + "..."
      : \`No encontré '\${consulta}'.\`;
  },
  {
    name: "buscar_wikipedia",
    description: "Busca en Wikipedia en español. Usar para info factual.",
    schema: z.object({ consulta: z.string().describe("Término a buscar") }),
  }
);

const calcular = tool(
  async ({ expresion }) => {
    try {
      const r = Function(\`"use strict"; return (\${expresion})\`)();
      return \`'\${expresion}' = \${r}\`;
    } catch {
      return \`Error al calcular: \${expresion}\`;
    }
  },
  {
    name: "calcular",
    description: "Evalúa expresiones matemáticas. Ej: '25*4+10', 'Math.sqrt(144)'",
    schema: z.object({ expresion: z.string() }),
  }
);

const leerArchivo = tool(
  async ({ ruta }) => {
    try {
      const c = readFileSync(ruta, "utf-8");
      return c.length > 1000 ? c.slice(0, 1000) + "..." : c;
    } catch {
      return \`Archivo no encontrado: \${ruta}\`;
    }
  },
  {
    name: "leer_archivo",
    description: "Lee el contenido de un archivo de texto local.",
    schema: z.object({ ruta: z.string() }),
  }
);

// 3️⃣  Crear agente ReAct
const agente = createReactAgent({ llm, tools: [buscarWikipedia, calcular, leerArchivo] });

// 4️⃣  Loop de conversación
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
console.log("🤖 Agente Local activo. Escribe 'salir' para terminar.");

const preguntar = () => {
  rl.question("\\n👤 Tú: ", async (pregunta) => {
    pregunta = pregunta.trim();
    if (!pregunta || ["salir","exit"].includes(pregunta.toLowerCase())) {
      console.log("👋 ¡Hasta luego!"); rl.close(); return;
    }
    try {
      const r = await agente.invoke({ messages: [{ role: "user", content: pregunta }] });
      console.log(\`\\n✅ \${r.messages.at(-1).content}\`);
    } catch (e) {
      console.error(\`❌ Error: \${e.message}\`);
    }
    preguntar();
  });
};
preguntar();`,
              run: 'node agente_local.js',
            },
          ],
        },
        checklist: [
          'Ollama está corriendo y el modelo llama3.2:latest está descargado',
          'Instalé todas las dependencias (langchain-ollama o @langchain/ollama)',
          'El agente conecta con Ollama sin errores',
          'Creé al menos 2 herramientas funcionales',
          'El loop ReAct funciona y veo el razonamiento en consola',
          'Probé con preguntas que requieren Wikipedia, cálculos y archivos',
        ],
      },
    ],
  },
  {
    id: 'ecosistema',
    number: '06',
    title: 'Ecosistema Completo',
    subtitle: 'LangChain, CrewAI y más',
    icon: '🌐',
    colorFrom: '#f43f5e',
    colorTo: '#f59e0b',
    tailwindGradient: 'from-rose-500 to-amber-500',
    tailwindText: 'text-rose-400',
    tailwindBg: 'bg-rose-500/10',
    tailwindBorder: 'border-rose-500/20',
    description: 'Visión completa del ecosistema y proyecto final integrador.',
    lessons: [
      {
        id: 'comparativa',
        title: 'Comparativa de Herramientas',
        icon: '⚖️',
        duration: '25 min',
        content: CONTENT.ecosistema,
        tic: {
          acronym: 'MFPHE',
          trigger: '¡Mi Familia Prueba Herramientas Especiales!',
          letters: [
            { letter: 'M', word: 'Modelo', desc: 'El cerebro (Claude, Llama...)' },
            { letter: 'F', word: 'Framework', desc: 'El esqueleto (LangChain...)' },
            { letter: 'P', word: 'Protocolo', desc: 'El idioma (MCP)' },
            { letter: 'H', word: 'Herramienta', desc: 'Los músculos (MCP servers)' },
            { letter: 'E', word: 'Ejecución', desc: 'El entorno (n8n, tu app)' },
          ],
          analogy: 'Todo el ecosistema en 5 capas: Modelo piensa, Framework estructura, Protocolo comunica, Herramienta actúa, Ejecución integra.',
          emoji: '🗺️',
        },
        checklist: [
          'Entiendo las 5 capas del ecosistema',
          'Distingo LangChain, LangGraph y CrewAI',
          'Puedo elegir la herramienta correcta',
          'Conozco el stack para producción',
        ],
      },
      {
        id: 'proyecto-final',
        title: '🏆 Proyecto Final Integrador',
        icon: '🏆',
        duration: '3 horas',
        isPractice: true,
        isFinal: true,
        content: CONTENT.proyectoFinal,
        tic: {
          acronym: 'MOCA',
          trigger: '¡Tu agente MOCA lo sabe todo!',
          letters: [
            { letter: 'M', word: 'MCP Server', desc: 'Expone los documentos como herramientas' },
            { letter: 'O', word: 'Ollama', desc: 'El modelo local que razona (llama3.2:latest)' },
            { letter: 'C', word: 'Conocimiento', desc: 'Los archivos .txt con la info de empresa' },
            { letter: 'A', word: 'Agente ReAct', desc: 'El loop que piensa, busca y responde' },
          ],
          analogy: 'MOCA = la receta completa: MCP Server expone los docs, Ollama razona, Conocimiento es la carpeta de archivos, y el Agente ReAct lo conecta todo. Sin internet, sin costo.',
          emoji: '🏆',
        },
        codeExamples: {
          hint: 'Selecciona el lenguaje y luego el archivo: MCP Server (el backend de documentos) o Agente ReAct (el que razona y responde).',
          tabs: [
            {
              lang: 'javascript',
              setup: [
                'mkdir proyecto-qa && cd proyecto-qa',
                'npm init -y',
                'npm pkg set type=module',
                'mkdir documentos',
                'ollama pull llama3.2:latest && ollama serve',
              ],
              files: [
                {
                  badge: 'MCP SDK',
                  install: 'npm install @modelcontextprotocol/sdk',
                  filename: 'servidor-docs.js',
                  code: `import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import fs from "fs";
import path from "path";

const DOCS_DIR = "./documentos";
const server = new Server(
  { name: "servidor-docs", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "listar_documentos",
      description: "Lista todos los documentos disponibles",
      inputSchema: { type: "object", properties: {} }
    },
    {
      name: "buscar_en_documentos",
      description: "Busca un término en todos los documentos de la empresa",
      inputSchema: {
        type: "object",
        properties: { termino: { type: "string", description: "Término a buscar" } },
        required: ["termino"]
      }
    },
  ]
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "listar_documentos") {
    const archivos = fs.readdirSync(DOCS_DIR).filter(f => f.endsWith('.txt'));
    return { content: [{ type: "text",
      text: archivos.length ? archivos.map(f => \`📄 \${f}\`).join("\\n") : "Sin documentos."
    }]};
  }

  if (name === "buscar_en_documentos") {
    const { termino } = args;
    const archivos = fs.readdirSync(DOCS_DIR);
    const resultados = [];
    for (const archivo of archivos) {
      const contenido = fs.readFileSync(path.join(DOCS_DIR, archivo), "utf-8");
      if (contenido.toLowerCase().includes(termino.toLowerCase())) {
        const lineas = contenido.split("\\n")
          .filter(l => l.toLowerCase().includes(termino.toLowerCase()))
          .slice(0, 3);
        resultados.push(\`📄 \${archivo}:\\n\${lineas.join("\\n")}\`);
      }
    }
    return { content: [{ type: "text",
      text: resultados.join("\\n---\\n") || \`Sin resultados para: "\${termino}"\`
    }]};
  }

  throw new Error(\`Herramienta desconocida: \${name}\`);
});

await server.connect(new StdioServerTransport());`,
                  run: 'node servidor-docs.js',
                },
                {
                  badge: 'Agente ReAct',
                  install: 'npm install @langchain/ollama @langchain/langgraph @langchain/core zod',
                  filename: 'agente_qa.js',
                  code: `import { ChatOllama } from "@langchain/ollama";
import { tool } from "@langchain/core/tools";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { z } from "zod";
import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import * as readline from "readline";

const DOCS_DIR = "./documentos";

const listarDocumentos = tool(
  async () => {
    const archivos = readdirSync(DOCS_DIR).filter(f => f.endsWith(".txt"));
    return archivos.length
      ? archivos.map(f => \`📄 \${f}\`).join("\\n")
      : "Sin documentos.";
  },
  {
    name: "listar_documentos",
    description: "Lista todos los documentos disponibles en la base de conocimiento.",
    schema: z.object({}),
  }
);

const buscarEnDocumentos = tool(
  async ({ termino }) => {
    const archivos = readdirSync(DOCS_DIR).filter(f => f.endsWith(".txt"));
    const resultados = [];
    for (const archivo of archivos) {
      const contenido = readFileSync(join(DOCS_DIR, archivo), "utf-8");
      if (contenido.toLowerCase().includes(termino.toLowerCase())) {
        const lineas = contenido.split("\\n")
          .filter(l => l.toLowerCase().includes(termino.toLowerCase()))
          .slice(0, 3);
        resultados.push(\`📄 \${archivo}:\\n\${lineas.join("\\n")}\`);
      }
    }
    return resultados.join("\\n---\\n") || \`Sin resultados para: "\${termino}"\`;
  },
  {
    name: "buscar_en_documentos",
    description: "Busca un término en todos los documentos de la empresa.",
    schema: z.object({ termino: z.string().describe("Término a buscar") }),
  }
);

const llm = new ChatOllama({ model: "llama3.2:latest", temperature: 0 });
const agente = createReactAgent({ llm, tools: [listarDocumentos, buscarEnDocumentos] });

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
console.log("🤖 Q&A Local activo. Escribe 'salir' para terminar.");

const preguntar = () => {
  rl.question("\\n👤 Tú: ", async (pregunta) => {
    pregunta = pregunta.trim();
    if (!pregunta || ["salir", "exit"].includes(pregunta.toLowerCase())) {
      console.log("👋 ¡Hasta luego!"); rl.close(); return;
    }
    try {
      const r = await agente.invoke({ messages: [{ role: "user", content: pregunta }] });
      console.log(\`\\n✅ \${r.messages.at(-1).content}\`);
    } catch (e) {
      console.error(\`❌ Error: \${e.message}\`);
    }
    preguntar();
  });
};
preguntar();`,
                  run: 'node agente_qa.js',
                },
              ],
            },
            {
              lang: 'python',
              setup: [
                'mkdir proyecto-qa && cd proyecto-qa',
                'python -m venv venv && source venv/bin/activate',
                'mkdir documentos',
                'ollama pull llama3.2:latest && ollama serve',
              ],
              files: [
                {
                  badge: 'FastMCP',
                  install: 'pip install mcp',
                  filename: 'servidor_docs.py',
                  code: `from mcp.server.fastmcp import FastMCP
from pathlib import Path

DOCS_DIR = Path("./documentos")
mcp = FastMCP("servidor-docs")

@mcp.tool()
def listar_documentos() -> str:
    """Lista todos los documentos disponibles en la base de conocimiento"""
    archivos = list(DOCS_DIR.glob("*.txt"))
    if not archivos:
        return "No hay documentos en la carpeta."
    return "\\n".join([f"📄 {a.name}" for a in archivos])

@mcp.tool()
def buscar_en_documentos(termino: str) -> str:
    """Busca un término en todos los documentos de la empresa.
    Devuelve las líneas que contienen el término con el nombre del archivo.
    """
    resultados = []
    for archivo in DOCS_DIR.glob("*.txt"):
        contenido = archivo.read_text(encoding="utf-8")
        if termino.lower() in contenido.lower():
            lineas = [
                l for l in contenido.split("\\n")
                if termino.lower() in l.lower()
            ][:3]
            resultados.append(f"📄 {archivo.name}:\\n" + "\\n".join(lineas))
    return "\\n---\\n".join(resultados) if resultados else f'Sin resultados para: "{termino}"'

if __name__ == "__main__":
    mcp.run()`,
                  run: 'python servidor_docs.py',
                },
                {
                  badge: 'Agente ReAct',
                  install: 'pip install langchain langchain-ollama',
                  filename: 'agente_qa.py',
                  code: `from langchain_ollama import ChatOllama
from langchain.agents import create_react_agent, AgentExecutor
from langchain.tools import tool
from langchain import hub
from pathlib import Path

DOCS_DIR = Path("./documentos")

@tool
def listar_documentos() -> str:
    """Lista todos los documentos disponibles en la base de conocimiento."""
    archivos = list(DOCS_DIR.glob("*.txt"))
    return "\\n".join([f"📄 {a.name}" for a in archivos]) if archivos else "Sin documentos."

@tool
def buscar_en_documentos(termino: str) -> str:
    """Busca un término en todos los documentos de la empresa."""
    resultados = []
    for archivo in DOCS_DIR.glob("*.txt"):
        contenido = archivo.read_text(encoding="utf-8")
        if termino.lower() in contenido.lower():
            lineas = [l for l in contenido.split("\\n") if termino.lower() in l.lower()][:3]
            resultados.append(f"📄 {archivo.name}:\\n" + "\\n".join(lineas))
    return "\\n---\\n".join(resultados) if resultados else f'Sin resultados para: "{termino}"'

llm = ChatOllama(model="llama3.2:latest", temperature=0)
herramientas = [listar_documentos, buscar_en_documentos]
prompt = hub.pull("hwchase17/react")
agente = create_react_agent(llm=llm, tools=herramientas, prompt=prompt)
ejecutor = AgentExecutor(agent=agente, tools=herramientas, verbose=True, max_iterations=5)

print("🤖 Q&A Local activo. Escribe 'salir' para terminar.")
while True:
    pregunta = input("\\n👤 Tú: ").strip()
    if pregunta.lower() in ["salir", "exit"]:
        break
    respuesta = ejecutor.invoke({"input": pregunta})
    print(f"\\n✅ {respuesta['output']}")`,
                  run: 'python agente_qa.py',
                },
              ],
            },
          ],
        },
        checklist: [
          'Creé la carpeta documentos/ con al menos 3 archivos .txt',
          'El MCP Server lista documentos correctamente',
          'El MCP Server busca por término y devuelve resultados',
          'Claude Code está configurado con el MCP Server y responde preguntas',
          'El agente con Ollama (llama3.2:latest) responde en modo local',
          'El loop ReAct muestra el razonamiento paso a paso en consola',
          '¡Proyecto final completado! 🎉',
        ],
      },
    ],
  },
]

// ──────────────────────────────────────────────────────────────
// GLOSARIO
// ──────────────────────────────────────────────────────────────
export const GLOSSARY = [
  { term: 'Agente (AI Agent)', category: 'Core', def: 'Programa de IA que toma decisiones, usa herramientas y completa tareas de forma autónoma. A diferencia de un chatbot, el agente actúa en el mundo.' },
  { term: 'MCP (Model Context Protocol)', category: 'Core', def: 'Protocolo estándar abierto creado por Anthropic que define cómo los modelos de IA se comunican con herramientas externas. Es como USB pero para IA.' },
  { term: 'MCP Server', category: 'MCP', def: 'Programa que expone herramientas y datos a través del protocolo MCP. Ejemplo: un servidor que da acceso a tu base de datos PostgreSQL.' },
  { term: 'MCP Client', category: 'MCP', def: 'El componente que usa los servidores MCP. Claude Code es un cliente MCP.' },
  { term: 'MCP Host', category: 'MCP', def: 'El programa que el usuario usa directamente (Claude Desktop, Claude Code, Cursor). Contiene el MCP Client.' },
  { term: 'Tool Calling / Function Calling', category: 'Core', def: 'La capacidad de un LLM de decidir cuándo llamar a una función externa y con qué parámetros.' },
  { term: 'ReAct', category: 'Agentes', def: 'Paradigma de agentes: Reasoning + Acting. El agente piensa (Thought) → actúa (Action) → observa (Observation) → repite.' },
  { term: 'LLM (Large Language Model)', category: 'Core', def: 'El modelo de lenguaje grande, el "cerebro" de los sistemas de IA. Ejemplos: GPT-4, Claude, Gemini, Llama.' },
  { term: 'RAG (Retrieval-Augmented Generation)', category: 'Técnica', def: 'Técnica que combina búsqueda de documentos con generación de texto. Pipeline: Documentos → Chunking → Embeddings → Vector DB → Retrieval → LLM → Respuesta. TIC: "El Estudiante con Biblioteca" — busca primero, responde después.' },
  { term: 'Chunking', category: 'RAG', def: 'Dividir documentos en trozos (chunks) antes de crear embeddings. El chunk_size y chunk_overlap determinan la calidad del RAG. TIC: "Los Cubitos de Hielo" — ni muy grandes ni muy pequeños.' },
  { term: 'Embedding', category: 'RAG', def: 'Representación numérica (vector) del significado de un texto. Textos semánticamente similares tienen vectores parecidos. TIC: "El GPS del Significado" — coordenadas en el mapa de ideas.' },
  { term: 'Vector DB (Base de Datos Vectorial)', category: 'RAG', def: 'Base de datos especializada en almacenar y buscar vectores por similitud. Ejemplos: Chroma (local/gratis), Pinecone (cloud), Weaviate, Qdrant, FAISS.' },
  { term: 'Reranker', category: 'RAG', def: 'Modelo que re-evalúa y reordena los chunks recuperados por relevancia real con la pregunta. Mejora la precisión del RAG un 10-30% adicional.' },
  { term: 'Búsqueda Híbrida (Hybrid Search)', category: 'RAG', def: 'Combina búsqueda vectorial (semántica) con búsqueda por palabras clave (BM25). Mejor cobertura que cada una sola.' },
  { term: 'GraphRAG', category: 'RAG', def: 'Variante de RAG creada por Microsoft que usa grafos de conocimiento para capturar relaciones entre entidades. Precisión hasta 99% en consultas relacionales complejas.' },
  { term: 'Agentic RAG', category: 'RAG', def: 'RAG controlado por un agente autónomo que decide cuándo recuperar, de qué fuentes y cuántas iteraciones hacer. Útil para preguntas complejas multi-paso.' },
  { term: 'LangChain', category: 'Framework', def: 'Framework de Python/JavaScript para construir aplicaciones con LLMs. Facilita encadenar llamadas a modelos con herramientas y memoria.' },
  { term: 'LangGraph', category: 'Framework', def: 'Extensión de LangChain para construir agentes más complejos como grafos de estados con lógica condicional.' },
  { term: 'CrewAI', category: 'Framework', def: 'Framework para crear "equipos" de agentes donde cada uno tiene un rol especializado. Ideal para pipelines multi-agente.' },
  { term: 'n8n', category: 'Automatización', def: 'Plataforma de automatización visual open source. Conecta apps, APIs y agentes de IA sin escribir código.' },
  { term: 'Ollama', category: 'IA Local', def: 'Herramienta para ejecutar modelos de IA localmente. Descarga y corre LLMs sin necesidad de internet ni pagar por API.' },
  { term: 'Webhook', category: 'Web', def: 'Endpoint HTTP que recibe datos cuando ocurre un evento. En n8n, es el trigger más común para flujos.' },
  { term: 'Contexto (Context)', category: 'Core', def: 'La "memoria de trabajo" de un agente: todo lo que sabe en este momento. Los agentes tienen un límite de tokens de contexto.' },
  { term: 'Token', category: 'Core', def: 'Unidad básica de procesamiento de los LLMs. ~1 token = 0.75 palabras. Los modelos tienen límites de tokens.' },
  { term: 'Sistema Multi-Agente', category: 'Agentes', def: 'Arquitectura donde varios agentes de IA colaboran. Cada uno tiene un rol especializado.' },
  { term: 'stdio', category: 'MCP', def: 'Standard Input/Output. Forma de comunicación local entre el MCP Client y Server. El más común y seguro — sin red, sin vectores de ataque externos.' },
  { term: 'HTTP Streamable', category: 'MCP', def: 'Nuevo transporte MCP (v2025-11-25) que reemplaza al SSE. Permite servidores remotos con soporte para streaming. Requiere autenticación y TLS.' },
  { term: 'SSE (Server-Sent Events)', category: 'MCP', def: 'Protocolo de streaming previo al HTTP Streamable. Aún soportado pero deprecado en favor de HTTP Streamable en la versión 2025-11-25.' },
  { term: 'JSON-RPC 2.0', category: 'MCP', def: 'El protocolo de mensajería que usa MCP internamente. Define el formato de peticiones (con id) y notificaciones (sin id) entre Client y Server.' },
  { term: 'Sampling', category: 'MCP', def: 'Primitiva del cliente MCP que permite al servidor pedir al cliente que el LLM genere texto. El servidor no necesita su propio modelo de IA.' },
  { term: 'Roots', category: 'MCP', def: 'Primitiva del cliente MCP que informa al servidor qué directorios del filesystem puede acceder. Implementa el principio de mínimo privilegio.' },
  { term: 'FastMCP', category: 'Framework', def: 'Librería Python que simplifica la creación de servidores MCP. Usa decoradores (@mcp.tool()) y type hints en lugar de JSON Schema manual.' },
  { term: 'ReAct (Reasoning + Acting)', category: 'Agentes', def: 'Paradigma de agentes: el LLM alterna entre razonamiento (Thought) y acción (Action), observa el resultado y repite. Visible con verbose=True en LangChain.' },
  { term: 'CrewAI', category: 'Framework', def: 'Framework Python para crear equipos (crews) de agentes con roles especializados. Abstrae la coordinación con Agent, Task y Crew. No existe en JavaScript.' },
  { term: 'LangGraph', category: 'Framework', def: 'Extensión de LangChain para construir agentes complejos como grafos de estado con lógica condicional. Usado por createReactAgent en JavaScript.' },
]
