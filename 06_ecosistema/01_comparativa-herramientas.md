# 🌐 El Ecosistema Completo: Comparativa de Herramientas

> **Tu guía de referencia para elegir la herramienta correcta para cada trabajo.**

---

## El Mapa del Ecosistema

```
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
├── Cursor/Continue: editores con IA
├── n8n: automatización visual
└── LM Studio: interfaz local para LLMs

CAPA 5: INFRAESTRUCTURA (la base)
├── Ollama: servidor de modelos locales
├── LM Studio: alternativa con UI
├── Docker: contenedores
└── APIs Cloud: Anthropic, OpenAI, Google
```

---

## Tabla Comparativa de Frameworks

| Framework | Complejidad | Mejor Para | Lenguaje | Stars GitHub |
|-----------|-------------|------------|----------|--------------|
| **LangChain** | Media | Apps generales con LLMs | Python ✅ / JS ✅ | ⭐ 100k+ |
| **LangGraph** | Alta | Agentes con estado complejo | Python ✅ / JS ✅ | ⭐ 15k+ |
| **CrewAI** | Baja-Media | Equipos de agentes por roles | Python ✅ solo | ⭐ 30k+ |
| **AutoGen** | Media | Agentes conversacionales | Python ✅ solo | ⭐ 35k+ |
| **n8n** | Baja | Automatización sin código | Visual 🎨 | ⭐ 50k+ |
| **Haystack** | Media | RAG y pipelines de búsqueda | Python ✅ / JS parcial | ⭐ 18k+ |

---

## LangChain: El más Completo

**¿Qué es?** Framework para construir cualquier app con LLMs.

**Analogía**: Como React para web, pero para apps de IA.

**Python**
```python
# Ejemplo: RAG simple con LangChain
from langchain_anthropic import ChatAnthropic
from langchain_community.vectorstores import FAISS
from langchain.chains import RetrievalQA

llm = ChatAnthropic(model="claude-3-5-sonnet-20241022")
vectorstore = FAISS.from_texts(mis_documentos, embedding)
qa = RetrievalQA.from_chain_type(llm=llm, retriever=vectorstore.as_retriever())

respuesta = qa.invoke("¿Qué dice el contrato sobre devoluciones?")
```

**JavaScript** (LangChain.js)
```javascript
// npm install @langchain/anthropic @langchain/community langchain
import { ChatAnthropic } from "@langchain/anthropic";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";
import { RetrievalQAChain } from "langchain/chains";

const llm = new ChatAnthropic({ model: "claude-3-5-sonnet-20241022" });
const vectorstore = await MemoryVectorStore.fromTexts(
  misDocumentos, [], new OpenAIEmbeddings()
);
const qa = RetrievalQAChain.fromLLM(llm, vectorstore.asRetriever());

const respuesta = await qa.invoke({ query: "¿Qué dice el contrato sobre devoluciones?" });
console.log(respuesta.text);
```

**Usa LangChain cuando:**
- Construyes una app a medida
- Necesitas RAG (preguntas sobre tus documentos)
- Quieres control total del código

---

## LangGraph: Para Agentes Complejos

**¿Qué es?** Extensión de LangChain para crear agentes como grafos de estado.

**Analogía**: Si LangChain es una receta lineal, LangGraph es un diagrama de flujo con decisiones y bucles.

**Python**
```python
# Ejemplo: Agente con estado
from langgraph.graph import StateGraph, END

def decidir(state):
    if "más info" in state["respuesta"].lower():
        return "buscar"
    return "responder"

grafo = StateGraph(dict)
grafo.add_node("analizar", analizar_fn)
grafo.add_node("buscar", buscar_fn)
grafo.add_node("responder", responder_fn)
grafo.add_conditional_edges("analizar", decidir)
```

**JavaScript** (LangGraph.js — mismo paquete, API casi idéntica)
```javascript
// npm install @langchain/langgraph @langchain/core
import { StateGraph, END } from "@langchain/langgraph";
import { Annotation } from "@langchain/langgraph";

// Define el estado del grafo
const Estado = Annotation.Root({
  respuesta: Annotation(),
});

const decidir = (state) =>
  state.respuesta.toLowerCase().includes("más info") ? "buscar" : "responder";

const grafo = new StateGraph(Estado)
  .addNode("analizar", analizarFn)
  .addNode("buscar", buscarFn)
  .addNode("responder", responderFn)
  .addConditionalEdges("analizar", decidir);

const app = grafo.compile();
const resultado = await app.invoke({ respuesta: "" });
```

**Usa LangGraph cuando:**
- El agente necesita tomar decisiones complejas
- Hay múltiples caminos posibles
- Necesitas control preciso del flujo

---

## CrewAI: Equipos de Agentes

**¿Qué es?** Framework para crear "equipos" donde cada agente tiene un rol.

**Analogía**: Como contratar empleados especializados que trabajan juntos.

> ⚠️ **CrewAI solo existe en Python**. Para JavaScript, usa LangGraph con múltiples agentes
> o el patrón pipeline directo con el SDK de Anthropic (ver módulo 03).

```python
# Ejemplo: Equipo de investigación
from crewai import Agent, Task, Crew

investigador = Agent(
    role="Investigador de Mercado",
    goal="Encontrar información sobre competidores",
    backstory="Experto en análisis de mercado peruano",
    tools=[busqueda_web, analisis_datos]
)

redactor = Agent(
    role="Redactor de Informes",
    goal="Crear informes claros y accionables",
    backstory="Especialista en comunicación ejecutiva"
)

tarea1 = Task(
    description="Investiga los 3 principales competidores",
    agent=investigador,
    expected_output="Lista con datos de competidores"
)

tarea2 = Task(
    description="Redacta un informe ejecutivo basado en la investigación",
    agent=redactor,
    expected_output="Informe PDF listo para presentar"
)

equipo = Crew(
    agents=[investigador, redactor],
    tasks=[tarea1, tarea2],
    verbose=True
)

resultado = equipo.kickoff()
```

**Usa CrewAI cuando:**
- La tarea requiere múltiples expertos
- Quieres simular un equipo de trabajo
- Cada sub-tarea es muy especializada

---

## Tabla: ¿Cuándo usar qué?

| Situación | Herramienta Recomendada |
|-----------|------------------------|
| Chatbot simple con documentos propios | LangChain + RAG |
| Agente que navega web y hace tareas | Claude Code |
| Automatizar proceso de negocio existente | n8n |
| Equipo de agentes especializados | CrewAI |
| Agente con lógica de estado compleja | LangGraph |
| Privacidad + sin costos cloud | Ollama + LangChain |
| Prototipo rápido sin código | n8n + nodo AI Agent |
| App de producción escalable | LangGraph + API Cloud |
| Análisis de documentos en masa | Haystack |

---

## El Stack Recomendado para Empezar

```
Para aprender (este orden):
1. Claude Code (ya tienes) → entender agentes con MCP
2. Ollama → modelos locales
3. n8n → automatización visual
4. LangChain básico → primer agente en código
5. CrewAI → multi-agentes
6. LangGraph → flujos complejos

Para producción (stack común):
┌──────────────────────────────────────┐
│            Tu Aplicación             │
│  (React/Next.js frontend + FastAPI)  │
├──────────────────────────────────────┤
│           LangGraph/LangChain        │
│         (Lógica de agentes)          │
├──────────────────────────────────────┤
│        LLM (Claude / GPT-4)          │
│         vía API o Ollama             │
├──────────────────────────────────────┤
│     Vector DB (Pinecone / Chroma)    │
│     Base datos (PostgreSQL)          │
│     Cache (Redis)                    │
└──────────────────────────────────────┘
```

---

## 🎯 TIC para recordar el ecosistema

**"MFPHE" = Modelo, Framework, Protocolo, Herramienta, Ejecución**

Pronunciado: *"¡Mi Familia Prueba Herramientas Especiales!"*

- **M**odelo = el cerebro (Claude, Llama...)
- **F**ramework = el esqueleto (LangChain, CrewAI...)
- **P**rotocolo = el idioma (MCP)
- **H**erramienta = los músculos (MCP servers, tools)
- **E**jecución = el entorno (Claude Code, n8n, tu app)

---

## Recursos para seguir aprendiendo

| Recurso | URL | Para qué |
|---------|-----|----------|
| Docs MCP oficiales | modelcontextprotocol.io | Referencia MCP |
| LangChain docs | python.langchain.com | LangChain |
| n8n docs | docs.n8n.io | n8n |
| Ollama models | ollama.ai/library | Modelos locales |
| Hugging Face | huggingface.co | Modelos y datasets |
| CrewAI docs | docs.crewai.com | Multi-agentes |
| LangGraph | langchain-ai.github.io/langgraph | Grafos de agentes |

---

## ✅ Checklist Final del Módulo 6

- [ ] Entiendo las 5 capas del ecosistema
- [ ] Sé diferenciar LangChain, LangGraph y CrewAI
- [ ] Puedo elegir la herramienta correcta para cada caso
- [ ] Conozco el stack recomendado para producción
- [ ] Tengo el plan para seguir aprendiendo

**→ Siguiente: [practica_05_proyecto-final/README.md](./practica_05_proyecto-final/README.md)**
