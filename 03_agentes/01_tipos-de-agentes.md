# 🤖 Tipos de Agentes y Cómo se Conectan

---

## Clasificación por Capacidad

### Agente Simple (Tool-Using Agent)
- Un solo LLM con acceso a herramientas
- Loop básico: pensar → actuar → observar
- **Ejemplo**: Claude Code, ChatGPT con plugins

```
[Usuario] → [LLM] → [Herramienta] → [LLM] → [Respuesta]
```

### Agente con Memoria
- Igual que el simple, pero recuerda conversaciones pasadas
- **Corto plazo**: contexto de la ventana actual
- **Largo plazo**: base de datos, vectorstore

```
[Usuario] → [LLM + Memoria] → [Herramientas] → [Respuesta]
                  ↑
            [Base de datos histórico]
```

### Agente Planificador
- Antes de actuar, crea un plan de pasos
- Luego ejecuta cada paso
- Más estructurado y predecible

```
[Tarea] → [Planificar] → [Paso 1] → [Paso 2] → [Paso N] → [Resultado]
```

### Sistema Multi-Agente
- Varios agentes especializados que colaboran
- Un agente orquestador coordina

```
           [Orquestador]
          /      |       \
   [Agente A] [Agente B] [Agente C]
   Investigar  Escribir   Revisar
```

---

## Patrones de Orquestación Multi-Agente

### Patrón 1: Jefe-Empleado (Supervisor)
```
[Manager] asigna tarea a [Trabajador A]
[Manager] evalúa resultado
[Manager] asigna siguiente tarea a [Trabajador B]
```

### Patrón 2: Secuencial (Pipeline)
```
[Agente 1] → output → [Agente 2] → output → [Agente 3] → resultado final
```

### Patrón 3: Paralelo
```
[Orquestador] lanza en paralelo:
├── [Agente A] busca en internet
├── [Agente B] consulta base de datos
└── [Agente C] lee documentos
[Orquestador] combina resultados
```

### Patrón 4: Debate/Reflexión
```
[Agente 1] genera → [Agente 2] critica → [Agente 1] refina → resultado mejorado
```

---

## ¿Cómo se Conectan los Agentes entre Sí?

### Via mensajes (el más común)

**Python**
```python
# Un agente pasa su output como input del siguiente
resultado_1 = agente_1.run(tarea_inicial)
resultado_2 = agente_2.run(resultado_1)
resultado_final = agente_3.run(resultado_2)
```

**JavaScript**
```javascript
// Mismo patrón, con async/await
const resultado1 = await agente1.run(tareaInicial)
const resultado2 = await agente2.run(resultado1)
const resultadoFinal = await agente3.run(resultado2)
```

---

### Via herramientas (agente-como-herramienta)

**Python** (LangChain)
```python
from langchain.tools import tool

@tool
def consultar_experto_legal(pregunta: str) -> str:
    """Consulta al agente especializado en leyes peruanas."""
    return agente_legal.run(pregunta)

# El agente principal lo usa como cualquier herramienta
agente_principal = create_react_agent(llm, [consultar_experto_legal], prompt)
```

**JavaScript** (Anthropic SDK — tool_use nativo)
```javascript
// Defines la herramienta como objeto
const herramientas = [
  {
    name: "consultar_experto_legal",
    description: "Consulta al agente especializado en leyes peruanas.",
    input_schema: {
      type: "object",
      properties: {
        pregunta: { type: "string", description: "La pregunta legal" }
      },
      required: ["pregunta"]
    }
  }
]

// Cuando Claude decide usarla, llamas a tu función:
async function ejecutarHerramienta(nombre, input) {
  if (nombre === "consultar_experto_legal") {
    return await agenteLegal.run(input.pregunta)
  }
}
```

---

### Via sistema de colas

**Python** (con asyncio)
```python
import asyncio

cola_tareas = asyncio.Queue()
cola_resultados = asyncio.Queue()

# Agente 1: produce tareas
async def agente_productor():
    await cola_tareas.put({"tarea": "analizar documento X"})

# Agente 2: consume y procesa
async def agente_consumidor():
    tarea = await cola_tareas.get()
    resultado = await procesar(tarea)
    await cola_resultados.put(resultado)
```

**JavaScript** (con promesas)
```javascript
// Patrón productor-consumidor en JS
const colaTareas = []
const colaResultados = []

async function agenteProductor() {
  colaTareas.push({ tarea: "analizar documento X" })
}

async function agenteConsumidor() {
  const tarea = colaTareas.shift()
  const resultado = await procesar(tarea)
  colaResultados.push(resultado)
}
```

---

## Agente con Herramientas: Código Completo

El ejemplo más importante: **un agente que usa herramientas** para responder.

### Python (Anthropic SDK directo)
```python
import anthropic
import json

client = anthropic.Anthropic(api_key="tu-api-key")

# 1. Define las herramientas
herramientas = [
    {
        "name": "obtener_clima",
        "description": "Consulta el clima actual de una ciudad",
        "input_schema": {
            "type": "object",
            "properties": {
                "ciudad": {"type": "string", "description": "Nombre de la ciudad"}
            },
            "required": ["ciudad"]
        }
    },
    {
        "name": "calcular",
        "description": "Realiza operaciones matemáticas",
        "input_schema": {
            "type": "object",
            "properties": {
                "expresion": {"type": "string", "description": "Expresión matemática"}
            },
            "required": ["expresion"]
        }
    }
]

# 2. Implementa las herramientas
def ejecutar_herramienta(nombre, input_data):
    if nombre == "obtener_clima":
        # Aquí iría la llamada real a una API de clima
        return f"Lima: 22°C, soleado, humedad 65%"
    if nombre == "calcular":
        return str(eval(input_data["expresion"]))

# 3. Loop del agente (ReAct)
def agente(pregunta):
    mensajes = [{"role": "user", "content": pregunta}]

    while True:
        respuesta = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=1024,
            tools=herramientas,
            messages=mensajes
        )

        # Si el modelo termina, devuelve la respuesta
        if respuesta.stop_reason == "end_turn":
            return respuesta.content[0].text

        # Si el modelo quiere usar una herramienta
        if respuesta.stop_reason == "tool_use":
            mensajes.append({"role": "assistant", "content": respuesta.content})
            resultados_tools = []

            for bloque in respuesta.content:
                if bloque.type == "tool_use":
                    resultado = ejecutar_herramienta(bloque.name, bloque.input)
                    resultados_tools.append({
                        "type": "tool_result",
                        "tool_use_id": bloque.id,
                        "content": resultado
                    })

            mensajes.append({"role": "user", "content": resultados_tools})

# Uso:
print(agente("¿Qué clima hace en Lima y cuánto es 15% de 2500?"))
```

### JavaScript (Anthropic SDK directo)
```javascript
import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic({ apiKey: "tu-api-key" })

// 1. Define las herramientas
const herramientas = [
  {
    name: "obtener_clima",
    description: "Consulta el clima actual de una ciudad",
    input_schema: {
      type: "object",
      properties: {
        ciudad: { type: "string", description: "Nombre de la ciudad" }
      },
      required: ["ciudad"]
    }
  },
  {
    name: "calcular",
    description: "Realiza operaciones matemáticas",
    input_schema: {
      type: "object",
      properties: {
        expresion: { type: "string", description: "Expresión matemática" }
      },
      required: ["expresion"]
    }
  }
]

// 2. Implementa las herramientas
function ejecutarHerramienta(nombre, input) {
  if (nombre === "obtener_clima") {
    return `Lima: 22°C, soleado, humedad 65%`
  }
  if (nombre === "calcular") {
    return String(eval(input.expresion))   // ⚠️ solo para ejemplos, no producción
  }
}

// 3. Loop del agente (ReAct)
async function agente(pregunta) {
  const mensajes = [{ role: "user", content: pregunta }]

  while (true) {
    const respuesta = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      tools: herramientas,
      messages: mensajes
    })

    // Si el modelo termina, devuelve la respuesta
    if (respuesta.stop_reason === "end_turn") {
      return respuesta.content.find(b => b.type === "text")?.text
    }

    // Si el modelo quiere usar una herramienta
    if (respuesta.stop_reason === "tool_use") {
      mensajes.push({ role: "assistant", content: respuesta.content })
      const resultadosTools = []

      for (const bloque of respuesta.content) {
        if (bloque.type === "tool_use") {
          const resultado = ejecutarHerramienta(bloque.name, bloque.input)
          resultadosTools.push({
            type: "tool_result",
            tool_use_id: bloque.id,
            content: resultado
          })
        }
      }

      mensajes.push({ role: "user", content: resultadosTools })
    }
  }
}

// Uso:
const respuesta = await agente("¿Qué clima hace en Lima y cuánto es 15% de 2500?")
console.log(respuesta)
```

> **Nota**: El loop es idéntico en ambos lenguajes. La diferencia es solo sintáctica
> (`async/await` en JS vs síncrono en Python, `snake_case` vs `camelCase`).

---

## Ejemplo Real: Sistema de Análisis de Contratos

```
TAREA: "Analiza este contrato de arrendamiento"

[Orquestador]
    ├── [Agente Extractor] → lista de cláusulas
    ├── [Agente Legal]     → análisis de riesgos
    └── [Agente Redactor]  → informe ejecutivo final
```

---

## 🎯 TIC para recordar los tipos

**"SMMP" = Simple, Memoria, Multi, Planificador**

- **S**imple → Empleado que hace una sola tarea
- **M**emoria → Empleado con experiencia acumulada
- **M**ulti → Equipo de especialistas
- **P**lanificador → Gerente que define la estrategia

**Regla**: Empieza siempre con el más simple. Solo complejiza si es necesario.

---

## ✅ Checklist de comprensión

- [ ] Distingo los 4 tipos de agentes
- [ ] Entiendo los 4 patrones de orquestación
- [ ] Entiendo el loop ReAct tanto en Python como en JS
- [ ] Sé cómo los agentes se comunican entre sí (mensajes, tools, colas)

**→ Práctica: [practica_02_agente-con-herramientas/README.md](./practica_02_agente-con-herramientas/README.md)**
