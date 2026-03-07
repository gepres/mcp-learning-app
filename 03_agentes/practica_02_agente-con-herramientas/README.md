# 🛠️ Práctica 2: Agente Multi-Herramienta

> Implementa el mismo agente en **Python** y **JavaScript** para entender
> que el patrón es idéntico — solo cambia la sintaxis.

---

## Lo que vas a construir

Un agente con 3 herramientas propias:
1. `buscar_producto(nombre)` → busca en un catálogo falso
2. `calcular_descuento(precio, porcentaje)` → calcula el precio final
3. `generar_resumen(texto)` → pide al LLM resumir (herramienta anidada)

---

## Opción A — Python

### Prerequisitos
```bash
pip install anthropic
```

### Código completo
```python
# agente.py
import anthropic
import json

client = anthropic.Anthropic(api_key="tu-api-key")

# ── Base de datos simulada ──────────────────────
CATALOGO = {
    "laptop hp":    {"precio": 3200, "stock": 5,  "categoria": "computadoras"},
    "mouse logitech": {"precio": 120,  "stock": 20, "categoria": "periféricos"},
    "monitor dell": {"precio": 1800, "stock": 3,  "categoria": "monitores"},
}

# ── Definición de herramientas ──────────────────
HERRAMIENTAS = [
    {
        "name": "buscar_producto",
        "description": "Busca un producto en el catálogo y devuelve precio y stock.",
        "input_schema": {
            "type": "object",
            "properties": {
                "nombre": {
                    "type": "string",
                    "description": "Nombre del producto a buscar"
                }
            },
            "required": ["nombre"]
        }
    },
    {
        "name": "calcular_descuento",
        "description": "Calcula el precio final aplicando un porcentaje de descuento.",
        "input_schema": {
            "type": "object",
            "properties": {
                "precio":      {"type": "number", "description": "Precio original"},
                "porcentaje":  {"type": "number", "description": "Descuento en % (ej: 15 para 15%)"}
            },
            "required": ["precio", "porcentaje"]
        }
    },
    {
        "name": "listar_categoria",
        "description": "Lista todos los productos de una categoría.",
        "input_schema": {
            "type": "object",
            "properties": {
                "categoria": {"type": "string", "description": "Nombre de la categoría"}
            },
            "required": ["categoria"]
        }
    }
]

# ── Implementación de herramientas ──────────────
def ejecutar_herramienta(nombre: str, input_data: dict) -> str:
    if nombre == "buscar_producto":
        clave = input_data["nombre"].lower()
        producto = CATALOGO.get(clave)
        if producto:
            return json.dumps({"encontrado": True, **producto}, ensure_ascii=False)
        return json.dumps({"encontrado": False, "mensaje": "Producto no encontrado"})

    if nombre == "calcular_descuento":
        precio = input_data["precio"]
        pct    = input_data["porcentaje"]
        final  = precio * (1 - pct / 100)
        ahorro = precio - final
        return json.dumps({
            "precio_original": precio,
            "descuento_aplicado": f"{pct}%",
            "precio_final": round(final, 2),
            "ahorro": round(ahorro, 2)
        })

    if nombre == "listar_categoria":
        cat = input_data["categoria"].lower()
        encontrados = {
            nombre: datos for nombre, datos in CATALOGO.items()
            if datos["categoria"] == cat
        }
        return json.dumps(encontrados, ensure_ascii=False)

    return json.dumps({"error": f"Herramienta '{nombre}' no existe"})

# ── Loop del agente (ReAct) ─────────────────────
def agente(pregunta: str) -> str:
    print(f"\n{'='*50}")
    print(f"👤 Pregunta: {pregunta}")
    print('='*50)

    mensajes = [{"role": "user", "content": pregunta}]
    paso = 0

    while True:
        paso += 1
        respuesta = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=1024,
            tools=HERRAMIENTAS,
            messages=mensajes
        )

        print(f"\n[Paso {paso}] stop_reason: {respuesta.stop_reason}")

        # Respuesta final
        if respuesta.stop_reason == "end_turn":
            texto = next(b.text for b in respuesta.content if b.type == "text")
            print(f"\n🤖 Respuesta: {texto}")
            return texto

        # El agente quiere usar herramientas
        if respuesta.stop_reason == "tool_use":
            mensajes.append({"role": "assistant", "content": respuesta.content})
            resultados = []

            for bloque in respuesta.content:
                if bloque.type == "tool_use":
                    print(f"  🔧 Usando: {bloque.name}({bloque.input})")
                    resultado = ejecutar_herramienta(bloque.name, bloque.input)
                    print(f"  📦 Resultado: {resultado}")

                    resultados.append({
                        "type": "tool_result",
                        "tool_use_id": bloque.id,
                        "content": resultado
                    })

            mensajes.append({"role": "user", "content": resultados})

# ── Pruébalo ────────────────────────────────────
if __name__ == "__main__":
    agente("¿Cuánto cuesta una laptop HP con 20% de descuento?")
    agente("¿Qué periféricos tienes en stock?")
    agente("Compara el precio de la laptop y el monitor, ¿cuál conviene más?")
```

---

## Opción B — JavaScript

### Prerequisitos
```bash
npm init -y
# Agrega "type": "module" en package.json  ← obligatorio
npm install @anthropic-ai/sdk
```

### `package.json`
```json
{
  "name": "agente-herramientas",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node agente.js"
  },
  "dependencies": {
    "@anthropic-ai/sdk": "^0.30.0"
  }
}
```

### Código completo
```javascript
// agente.js
import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic({ apiKey: "tu-api-key" })

// ── Base de datos simulada ──────────────────────
const CATALOGO = {
  "laptop hp":     { precio: 3200, stock: 5,  categoria: "computadoras" },
  "mouse logitech": { precio: 120,  stock: 20, categoria: "periféricos"  },
  "monitor dell":  { precio: 1800, stock: 3,  categoria: "monitores"    },
}

// ── Definición de herramientas ──────────────────
const HERRAMIENTAS = [
  {
    name: "buscar_producto",
    description: "Busca un producto en el catálogo y devuelve precio y stock.",
    input_schema: {
      type: "object",
      properties: {
        nombre: { type: "string", description: "Nombre del producto a buscar" }
      },
      required: ["nombre"]
    }
  },
  {
    name: "calcular_descuento",
    description: "Calcula el precio final aplicando un porcentaje de descuento.",
    input_schema: {
      type: "object",
      properties: {
        precio:     { type: "number", description: "Precio original" },
        porcentaje: { type: "number", description: "Descuento en % (ej: 15 para 15%)" }
      },
      required: ["precio", "porcentaje"]
    }
  },
  {
    name: "listar_categoria",
    description: "Lista todos los productos de una categoría.",
    input_schema: {
      type: "object",
      properties: {
        categoria: { type: "string", description: "Nombre de la categoría" }
      },
      required: ["categoria"]
    }
  }
]

// ── Implementación de herramientas ──────────────
function ejecutarHerramienta(nombre, input) {
  if (nombre === "buscar_producto") {
    const clave    = input.nombre.toLowerCase()
    const producto = CATALOGO[clave]
    return producto
      ? JSON.stringify({ encontrado: true, ...producto })
      : JSON.stringify({ encontrado: false, mensaje: "Producto no encontrado" })
  }

  if (nombre === "calcular_descuento") {
    const { precio, porcentaje } = input
    const final  = precio * (1 - porcentaje / 100)
    const ahorro = precio - final
    return JSON.stringify({
      precio_original:    precio,
      descuento_aplicado: `${porcentaje}%`,
      precio_final:       Math.round(final * 100) / 100,
      ahorro:             Math.round(ahorro * 100) / 100
    })
  }

  if (nombre === "listar_categoria") {
    const cat = input.categoria.toLowerCase()
    const encontrados = Object.fromEntries(
      Object.entries(CATALOGO).filter(([, d]) => d.categoria === cat)
    )
    return JSON.stringify(encontrados)
  }

  return JSON.stringify({ error: `Herramienta '${nombre}' no existe` })
}

// ── Loop del agente (ReAct) ─────────────────────
async function agente(pregunta) {
  console.log(`\n${"=".repeat(50)}`)
  console.log(`👤 Pregunta: ${pregunta}`)
  console.log("=".repeat(50))

  const mensajes = [{ role: "user", content: pregunta }]
  let paso = 0

  while (true) {
    paso++
    const respuesta = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      tools: HERRAMIENTAS,
      messages: mensajes
    })

    console.log(`\n[Paso ${paso}] stop_reason: ${respuesta.stop_reason}`)

    // Respuesta final
    if (respuesta.stop_reason === "end_turn") {
      const texto = respuesta.content.find(b => b.type === "text")?.text
      console.log(`\n🤖 Respuesta: ${texto}`)
      return texto
    }

    // El agente quiere usar herramientas
    if (respuesta.stop_reason === "tool_use") {
      mensajes.push({ role: "assistant", content: respuesta.content })
      const resultados = []

      for (const bloque of respuesta.content) {
        if (bloque.type === "tool_use") {
          console.log(`  🔧 Usando: ${bloque.name}(${JSON.stringify(bloque.input)})`)
          const resultado = ejecutarHerramienta(bloque.name, bloque.input)
          console.log(`  📦 Resultado: ${resultado}`)

          resultados.push({
            type: "tool_result",
            tool_use_id: bloque.id,
            content: resultado
          })
        }
      }

      mensajes.push({ role: "user", content: resultados })
    }
  }
}

// ── Pruébalo ────────────────────────────────────
await agente("¿Cuánto cuesta una laptop HP con 20% de descuento?")
await agente("¿Qué periféricos tienes en stock?")
await agente("Compara el precio de la laptop y el monitor, ¿cuál conviene más?")
```

### Ejecutar
```bash
node agente.js
```

---

## Diferencias Python vs JavaScript

| Aspecto | Python | JavaScript |
|---------|--------|------------|
| Llamada al SDK | `client.messages.create(...)` | `await client.messages.create(...)` |
| Iterar bloques | `for bloque in respuesta.content` | `for (const bloque of respuesta.content)` |
| Encontrar texto | `next(b.text for b in ...)` | `.find(b => b.type === "text")?.text` |
| Decorador tool | `@tool` (LangChain) | objeto `{ name, description, input_schema }` |
| Naming | `snake_case` | `camelCase` |
| Módulos | `import anthropic` | `import Anthropic from "@anthropic-ai/sdk"` |
| ES Modules | — | `"type": "module"` en package.json |

**El loop ReAct es estructuralmente idéntico en ambos lenguajes.**

---

## Multi-Agente: Pipeline de 2 Agentes

### Python (pipeline sencillo sin framework)
```python
# Pipeline: Agente 1 investiga → Agente 2 resume

def agente_investigador(tema: str) -> str:
    """Busca información sobre el tema usando herramientas."""
    return agente(f"Investiga y dame datos clave sobre: {tema}")

def agente_redactor(investigacion: str) -> str:
    """Convierte la investigación en un reporte ejecutivo."""
    respuesta = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=1024,
        messages=[{
            "role": "user",
            "content": f"Crea un reporte ejecutivo con esta info:\n\n{investigacion}"
        }]
    )
    return respuesta.content[0].text

# Ejecutar el pipeline
def pipeline(tema: str):
    print("🔍 Paso 1: Investigando...")
    investigacion = agente_investigador(tema)

    print("\n✍️  Paso 2: Redactando reporte...")
    reporte = agente_redactor(investigacion)

    print("\n📄 Reporte Final:")
    print(reporte)
    return reporte

pipeline("productos tecnológicos más vendidos en Perú")
```

### JavaScript (pipeline sencillo sin framework)
```javascript
// Pipeline: Agente 1 investiga → Agente 2 resume

async function agenteInvestigador(tema) {
  return await agente(`Investiga y dame datos clave sobre: ${tema}`)
}

async function agenteRedactor(investigacion) {
  const respuesta = await client.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1024,
    messages: [{
      role: "user",
      content: `Crea un reporte ejecutivo con esta info:\n\n${investigacion}`
    }]
  })
  return respuesta.content.find(b => b.type === "text")?.text
}

// Ejecutar el pipeline
async function pipeline(tema) {
  console.log("🔍 Paso 1: Investigando...")
  const investigacion = await agenteInvestigador(tema)

  console.log("\n✍️  Paso 2: Redactando reporte...")
  const reporte = await agenteRedactor(investigacion)

  console.log("\n📄 Reporte Final:")
  console.log(reporte)
  return reporte
}

await pipeline("productos tecnológicos más vendidos en Perú")
```

---

## 🎯 ¿Qué aprendiste?

- El loop ReAct es el mismo en Python y JavaScript
- En JS necesitas `async/await` y `"type": "module"`
- Las herramientas son objetos JSON en ambos lenguajes
- Un pipeline multi-agente es simplemente llamar funciones en secuencia

**→ Siguiente módulo: [04_n8n/01_que-es-n8n.md](../../04_n8n/01_que-es-n8n.md)**
