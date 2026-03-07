# 🤖 ¿Qué es un Agente de IA?

> **Antes de entender MCP, necesitas entender qué es un agente.**

---

## La Diferencia Fundamental

| Chatbot Simple | Agente de IA |
|----------------|--------------|
| Solo responde texto | Puede *hacer cosas* |
| Stateless (no recuerda) | Tiene memoria y estado |
| Un turno: pregunta → respuesta | Multi-turno: planifica → actúa → evalúa |
| No usa herramientas | Usa herramientas externas |
| Ejemplo: ChatGPT básico | Ejemplo: Claude Code |

---

## Analogía: El Asistente Personal

Imagina que contratas un asistente:

**Asistente SIMPLE** (chatbot):
> "¿Puedes reservar un vuelo?"
> "Sí, para reservar un vuelo necesitas ir a una aerolínea y..."

**Asistente AGENTE**:
> "¿Puedes reservar un vuelo?"
> *[Busca vuelos disponibles] → [Compara precios] → [Reserva el mejor] → [Manda confirmación al email]*
> "Listo, reservé el vuelo Delta a las 14:30, aquí está la confirmación."

---

## Los 4 Componentes de un Agente

### 1. 🧠 Cerebro (LLM)
El modelo de lenguaje que razona y toma decisiones.
- ¿Qué debo hacer?
- ¿Qué herramienta usar?
- ¿Ya terminé la tarea?

### 2. 🔧 Herramientas (Tools)
Funciones que el agente puede llamar para interactuar con el mundo:
- `buscar_en_google(query)`
- `leer_archivo(path)`
- `enviar_email(destinatario, contenido)`
- `consultar_base_de_datos(sql)`

### 3. 💾 Memoria (Memory)
Lo que el agente recuerda:
- **Corto plazo**: el contexto de la conversación actual
- **Largo plazo**: base de datos, vectores, archivos

### 4. 🔄 Loop de Razonamiento
El ciclo que sigue un agente:

```
┌─────────────────────────────────────────┐
│                                         │
│  1. OBSERVAR  ─►  2. PENSAR  ─►  3. ACTUAR
│       ▲                                 │
│       └─────────────────────────────────┘
│            (repite hasta terminar)      │
└─────────────────────────────────────────┘

Técnica: ReAct = Reasoning + Acting
```

---

## Tipos de Agentes

### Por autonomía:
- **Reactivo**: responde a eventos, sin plan propio
- **Deliberativo**: hace un plan antes de actuar
- **Híbrido**: planifica pero adapta según el contexto

### Por estructura:
- **Un solo agente**: hace todo solo
- **Multi-agente**: varios agentes colaboran (el más poderoso)

---

## Ejemplo Real: Claude Code

Claude Code es un agente que:
1. **Recibe** tu instrucción ("arregla este bug")
2. **Lee** el archivo con código
3. **Razona** qué está mal
4. **Edita** el archivo
5. **Ejecuta** tests para verificar
6. **Reporta** el resultado

Todo esto usando **herramientas** (Read, Edit, Bash, Grep...) conectadas via **MCP**.

---

## 🎯 TIC para recordar

**"CHMT" → Chef, Herramientas, Memoria, Tarea**

- Un agente es como un **Chef** (cerebro/LLM)
- Que usa **H**erramientas (cuchillo, horno, etc.)
- Tiene **M**emoria de recetas y técnicas
- Para completar una **T**area (hacer el plato)

Pronuncia: *"CHMT" = "¡El Che eM Te!"*

---

## ✅ Checklist de comprensión

- [ ] Puedo explicar la diferencia entre chatbot y agente
- [ ] Entiendo los 4 componentes de un agente
- [ ] Sé qué es el loop ReAct
- [ ] Puedo dar un ejemplo real de agente

**→ Siguiente: [02_que-es-mcp.md](./02_que-es-mcp.md)**
