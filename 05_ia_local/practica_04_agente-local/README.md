# 🛠️ Práctica 4: Agente Local con Ollama

> **Objetivo**: Crear un agente que corre 100% localmente usando Ollama y LangChain.

Implementado en **Python** y **JavaScript**.

---

## Lo que vas a construir

Un agente local que:
- Usa Llama 3.1 (via Ollama) como cerebro
- Puede buscar en Wikipedia
- Puede hacer cálculos
- Puede leer archivos de texto
- Todo sin internet (después de descargar el modelo)

---

## Prerequisito común: Ollama

```bash
# 1. Tener Ollama instalado y corriendo:
ollama pull llama3.1:8b

# 2. Verificar que esté corriendo:
ollama ps
# O probar con:
curl http://localhost:11434/api/generate -d '{"model":"llama3.1:8b","prompt":"Hola","stream":false}'
```

---

## Opción A — Python

### Prerequisitos Python

```bash
# Tener Python 3.10+:
python --version

# Instalar dependencias:
pip install langchain langchain-ollama wikipedia-api
```

---

## El Código Python

```python
# agente_local.py

from langchain_ollama import ChatOllama
from langchain.agents import create_react_agent, AgentExecutor
from langchain.tools import Tool, tool
from langchain import hub
import wikipediaapi
import math

# ============================================
# 1. CONFIGURAR EL LLM LOCAL
# ============================================
llm = ChatOllama(
    model="llama3.1:8b",
    temperature=0,       # 0 = más determinístico
    base_url="http://localhost:11434"
)

# ============================================
# 2. DEFINIR HERRAMIENTAS
# ============================================

@tool
def buscar_wikipedia(consulta: str) -> str:
    """Busca información en Wikipedia sobre un tema específico.
    Usar cuando se necesita información factual o enciclopédica."""
    wiki = wikipediaapi.Wikipedia(
        language='es',
        user_agent='AgenteLLocal/1.0'
    )
    pagina = wiki.page(consulta)
    if pagina.exists():
        # Devuelve solo el resumen (primeros 500 chars)
        return pagina.summary[:500] + "..."
    return f"No encontré información sobre '{consulta}' en Wikipedia."


@tool
def calcular(expresion: str) -> str:
    """Realiza cálculos matemáticos.
    Acepta expresiones como: '25 * 4 + 10' o 'sqrt(144)'
    Usar cuando el usuario necesite hacer cálculos."""
    try:
        # Permitimos math.sqrt, math.pi, etc.
        resultado = eval(expresion, {"__builtins__": {}}, vars(math))
        return f"El resultado de '{expresion}' es: {resultado}"
    except Exception as e:
        return f"Error al calcular '{expresion}': {str(e)}"


@tool
def leer_archivo(ruta: str) -> str:
    """Lee el contenido de un archivo de texto.
    Usar cuando se necesite acceder a información de un archivo local."""
    try:
        with open(ruta, 'r', encoding='utf-8') as f:
            contenido = f.read()
        if len(contenido) > 1000:
            return contenido[:1000] + "\n[... archivo truncado ...]"
        return contenido
    except FileNotFoundError:
        return f"Archivo no encontrado: {ruta}"
    except Exception as e:
        return f"Error al leer archivo: {str(e)}"


# Lista de herramientas disponibles para el agente
herramientas = [buscar_wikipedia, calcular, leer_archivo]

# ============================================
# 3. CREAR EL AGENTE (ReAct)
# ============================================

# ReAct = Reasoning + Acting
# El agente piensa (Thought) → actúa (Action) → observa (Observation) → repite

prompt = hub.pull("hwchase17/react")  # Prompt estándar para ReAct

agente = create_react_agent(
    llm=llm,
    tools=herramientas,
    prompt=prompt
)

ejecutor = AgentExecutor(
    agent=agente,
    tools=herramientas,
    verbose=True,        # Muestra el razonamiento del agente
    max_iterations=5,    # Máximo de pasos para evitar loops
    handle_parsing_errors=True
)

# ============================================
# 4. USAR EL AGENTE
# ============================================

print("🤖 Agente Local Iniciado (usa Ctrl+C para salir)")
print("=" * 50)

while True:
    try:
        pregunta = input("\n👤 Tú: ").strip()
        if not pregunta:
            continue
        if pregunta.lower() in ['salir', 'exit', 'quit']:
            print("👋 ¡Hasta luego!")
            break

        print("\n🤖 Agente:")
        respuesta = ejecutor.invoke({"input": pregunta})
        print(f"\n✅ Respuesta final: {respuesta['output']}")

    except KeyboardInterrupt:
        print("\n👋 ¡Hasta luego!")
        break
    except Exception as e:
        print(f"❌ Error: {e}")
```

---

## Ejecutar el agente Python

```bash
python agente_local.py
```

---

## Pruebas recomendadas (aplican a ambas versiones)

```
👤 Tú: ¿Qué es el Machu Picchu?
→ El agente buscará en Wikipedia

👤 Tú: ¿Cuánto es la raíz cuadrada de 2025?
→ El agente usará la herramienta de cálculo

👤 Tú: ¿Cuál es la capital de Perú y cuántos habitantes tiene?
→ El agente buscará en Wikipedia

👤 Tú: Lee el archivo README.md de este proyecto
→ El agente usará leer_archivo
```

---

## Observa el Razonamiento (verbose=True)

Con `verbose=True` verás algo así:

```
> Entering new AgentExecutor chain...
Thought: Necesito buscar información sobre Machu Picchu en Wikipedia
Action: buscar_wikipedia
Action Input: Machu Picchu
Observation: Machu Picchu es un santuario histórico ubicado en...
Thought: Ya tengo la información que necesito
Final Answer: Machu Picchu es...
```

**Este es el loop ReAct que aprendiste en el Módulo 1.**

---

## Versión con Memoria — Python (Bonus)

```python
from langchain.memory import ConversationBufferWindowMemory

memoria = ConversationBufferWindowMemory(
    memory_key="chat_history",
    k=5,  # Recuerda las últimas 5 interacciones
    return_messages=True
)

# Agrega la memoria al ejecutor:
ejecutor = AgentExecutor(
    agent=agente,
    tools=herramientas,
    memory=memoria,
    verbose=True
)
```

---

## Opción B — JavaScript (Node.js)

### Prerequisitos JavaScript

```bash
# Tener Node.js v18+:
node --version

# Crear proyecto e instalar dependencias:
npm init -y
# Agrega "type": "module" en package.json ← obligatorio
npm install @langchain/ollama @langchain/langgraph @langchain/core zod
```

### `package.json`
```json
{
  "name": "agente-local-js",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node agente_local.js"
  },
  "dependencies": {
    "@langchain/core": "^0.3.0",
    "@langchain/langgraph": "^0.2.0",
    "@langchain/ollama": "^0.1.0",
    "zod": "^3.22.0"
  }
}
```

### El Código JavaScript

```javascript
// agente_local.js
import { ChatOllama } from "@langchain/ollama";
import { tool } from "@langchain/core/tools";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { z } from "zod";
import { readFileSync } from "fs";
import * as readline from "readline";

// ============================================
// 1. CONFIGURAR EL LLM LOCAL
// ============================================
const llm = new ChatOllama({
  model: "llama3.1:8b",
  temperature: 0,       // 0 = más determinístico
  baseUrl: "http://localhost:11434",
});

// ============================================
// 2. DEFINIR HERRAMIENTAS
// ============================================

const buscarWikipedia = tool(
  async ({ consulta }) => {
    // Usa la API REST de Wikipedia (no requiere dependencias extra)
    const url = `https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(consulta)}`;
    try {
      const resp = await fetch(url);
      const data = await resp.json();
      if (data.extract) {
        return data.extract.slice(0, 500) + "...";
      }
      return `No encontré información sobre '${consulta}' en Wikipedia.`;
    } catch {
      return `Error al buscar '${consulta}' en Wikipedia.`;
    }
  },
  {
    name: "buscar_wikipedia",
    description: "Busca información en Wikipedia sobre un tema específico. " +
                 "Usar cuando se necesita información factual o enciclopédica.",
    schema: z.object({
      consulta: z.string().describe("Tema a buscar en Wikipedia"),
    }),
  }
);

const calcular = tool(
  async ({ expresion }) => {
    try {
      // ⚠️ Solo para ejemplos, no usar en producción
      const resultado = Function(`"use strict"; return (${expresion})`)();
      return `El resultado de '${expresion}' es: ${resultado}`;
    } catch {
      return `Error al calcular: ${expresion}`;
    }
  },
  {
    name: "calcular",
    description: "Realiza cálculos matemáticos. " +
                 "Acepta expresiones como: '25 * 4 + 10' o 'Math.sqrt(144)'. " +
                 "Usar cuando el usuario necesite hacer cálculos.",
    schema: z.object({
      expresion: z.string().describe("Expresión matemática a evaluar"),
    }),
  }
);

const leerArchivo = tool(
  async ({ ruta }) => {
    try {
      const contenido = readFileSync(ruta, "utf-8");
      if (contenido.length > 1000) {
        return contenido.slice(0, 1000) + "\n[... archivo truncado ...]";
      }
      return contenido;
    } catch {
      return `Archivo no encontrado: ${ruta}`;
    }
  },
  {
    name: "leer_archivo",
    description: "Lee el contenido de un archivo de texto local. " +
                 "Usar cuando se necesite acceder a información de un archivo.",
    schema: z.object({
      ruta: z.string().describe("Ruta del archivo a leer"),
    }),
  }
);

// ============================================
// 3. CREAR EL AGENTE (ReAct)
// ============================================
// createReactAgent de LangGraph crea un agente que:
// Piensa (Thought) → actúa (Action) → observa (Observation) → repite

const agente = createReactAgent({
  llm,
  tools: [buscarWikipedia, calcular, leerArchivo],
});

// ============================================
// 4. USAR EL AGENTE (loop interactivo)
// ============================================
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("🤖 Agente Local Iniciado (escribe 'salir' para terminar)");
console.log("=".repeat(50));

const preguntar = () => {
  rl.question("\n👤 Tú: ", async (pregunta) => {
    pregunta = pregunta.trim();

    if (!pregunta) {
      preguntar();
      return;
    }

    if (["salir", "exit", "quit"].includes(pregunta.toLowerCase())) {
      console.log("👋 ¡Hasta luego!");
      rl.close();
      return;
    }

    try {
      console.log("\n🤖 Agente pensando...");
      const resultado = await agente.invoke({
        messages: [{ role: "user", content: pregunta }],
      });

      // El último mensaje es la respuesta final del agente
      const ultimoMsg = resultado.messages.at(-1);
      console.log(`\n✅ Respuesta final: ${ultimoMsg.content}`);
    } catch (err) {
      console.error(`❌ Error: ${err.message}`);
    }

    preguntar();
  });
};

preguntar();
```

### Ejecutar el agente JavaScript

```bash
node agente_local.js
```

---

## Versión con Memoria — JavaScript (Bonus)

```javascript
import { MemorySaver } from "@langchain/langgraph";

// Agrega memoria persistente al agente
const memoria = new MemorySaver();

const agenteConMemoria = createReactAgent({
  llm,
  tools: [buscarWikipedia, calcular, leerArchivo],
  checkpointSaver: memoria,   // ← guarda el estado entre llamadas
});

// Usa un thread_id para que el agente recuerde la conversación:
const config = { configurable: { thread_id: "sesion-1" } };

const respuesta1 = await agenteConMemoria.invoke(
  { messages: [{ role: "user", content: "¿Qué es el Machu Picchu?" }] },
  config
);

const respuesta2 = await agenteConMemoria.invoke(
  { messages: [{ role: "user", content: "¿Y cuándo fue construido?" }] },
  config  // mismo thread_id → recuerda el contexto anterior
);
```

---

## Diferencias Python vs JavaScript

| Aspecto | Python (LangChain) | JavaScript (LangGraph.js) |
|---------|--------------------|--------------------------|
| Instalar | `pip install langchain langchain-ollama` | `npm install @langchain/ollama @langchain/langgraph` |
| Definir herramienta | `@tool` decorador + docstring | `tool(fn, { name, description, schema })` |
| Esquema de params | Type hints Python | Zod schema |
| Crear agente | `create_react_agent(llm, tools, prompt)` | `createReactAgent({ llm, tools })` |
| Input agente | `ejecutor.invoke({"input": pregunta})` | `agente.invoke({ messages: [...] })` |
| Verbose/debug | `AgentExecutor(verbose=True)` | Ver mensajes intermedios en `resultado.messages` |
| Memoria | `ConversationBufferWindowMemory` | `MemorySaver` + `thread_id` |
| ES Modules | — | `"type": "module"` en package.json |

**El patrón ReAct (Thought → Action → Observation) es el mismo en ambos.**

---

## 🎯 ¿Qué aprendiste?

- Cómo usar Ollama desde Python y JavaScript con LangChain
- Cómo crear herramientas personalizadas en ambos lenguajes
- Cómo el loop ReAct funciona con verbose/messages
- Cómo agregar memoria persistente a un agente

**→ Siguiente módulo: [06_ecosistema/01_langchain-langgraph.md](../../06_ecosistema/01_langchain-langgraph.md)**
