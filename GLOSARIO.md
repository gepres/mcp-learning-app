# 📖 Glosario: El Diccionario del Ecosistema IA

> Consulta este archivo cada vez que encuentres un término desconocido.

---

## A

**Agente (AI Agent)**
Un programa de IA que puede tomar decisiones, usar herramientas y completar tareas de forma autónoma. A diferencia de un chatbot simple, el agente *actúa* en el mundo, no solo responde.

**API (Application Programming Interface)**
Un "contrato" entre dos programas que define cómo se pueden comunicar. Ejemplo: cuando le preguntas algo a Claude, tu app usa la API de Anthropic.

---

## C

**Claude**
El modelo de IA de Anthropic. Puede actuar como cerebro de un agente cuando se le dan herramientas.

**Contexto (Context)**
La "memoria de trabajo" de un agente: todo lo que sabe en este momento (conversación, datos, instrucciones). Los agentes tienen un límite de contexto.

**Claude Code**
Herramienta CLI de Anthropic que usa Claude como agente para ayudar con código. Tiene acceso a herramientas como leer archivos, ejecutar comandos, etc.

---

## H

**Herramienta (Tool)**
Una función específica que un agente puede llamar. Ejemplos: buscar en internet, leer un archivo, ejecutar código, consultar una base de datos.

**Hook**
En Claude Code, comandos shell que se ejecutan en respuesta a eventos (antes/después de una herramienta). Permiten personalizar el comportamiento.

---

## L

**LLM (Large Language Model)**
El modelo de lenguaje grande, el "cerebro" de los sistemas de IA. Ejemplos: GPT-4, Claude, Gemini, Llama.

**LangChain**
Framework de Python/JavaScript para construir aplicaciones con LLMs. Facilita encadenar llamadas a modelos con herramientas y memoria.

**LangGraph**
Extensión de LangChain para construir agentes más complejos como grafos de estados.

---

## M

**MCP (Model Context Protocol)**
Un protocolo estándar abierto creado por Anthropic que define cómo los modelos de IA se comunican con herramientas externas. Es como USB pero para IA.

**MCP Server**
Un programa que expone herramientas y datos a través del protocolo MCP. Ejemplo: un servidor MCP que da acceso a tu base de datos.

**MCP Client**
El programa que *usa* los servidores MCP. Ejemplo: Claude Code es un cliente MCP.

---

## N

**n8n**
Plataforma de automatización visual (como Zapier pero open source y self-hosted). Permite crear flujos de trabajo que conectan apps, APIs y ahora también agentes de IA.

---

## O

**Ollama**
Herramienta para ejecutar modelos de IA localmente en tu computadora. Descarga y corre LLMs sin necesidad de internet ni pagar por API.

---

## P

**Prompt**
Las instrucciones que le das a un LLM. El arte de escribir buenos prompts se llama "prompt engineering".

**Protocol**
Un conjunto de reglas que define cómo se comunican dos sistemas. MCP es un protocolo.

---

## R

**RAG (Retrieval-Augmented Generation)**
Técnica para dar a un LLM acceso a documentos específicos. El agente busca información relevante y la incluye en su contexto antes de responder. Pipeline: Documentos → Chunking → Embeddings → Vector DB → Retrieval → LLM → Respuesta. Ver módulo completo: `03_agentes/02_rag-retrieval-augmented-generation.md`

**Reranker**
Modelo que evalúa y re-ordena los documentos recuperados por un RAG según su relevancia real con la pregunta. Mejora la precisión un 10-30% adicional.

**Retriever**
Componente del sistema RAG que busca y devuelve los chunks más relevantes de la base vectorial dada una consulta.

**RAG Híbrido**
Combinación de búsqueda vectorial (semántica) con búsqueda por palabras clave (BM25). Mejora la cobertura y precisión respecto a usar solo una.

**GraphRAG**
Variante de RAG desarrollada por Microsoft que usa grafos de conocimiento para capturar relaciones entre entidades. Permite consultas multi-hop complejas con hasta 99% de precisión.

**Agentic RAG**
RAG controlado por un agente autónomo que decide dinámicamente cuándo recuperar, de qué fuentes, y cuántas iteraciones hacer. Útil para preguntas complejas.

---

## S

**Sistema Multi-Agente**
Arquitectura donde varios agentes de IA colaboran. Cada agente tiene un rol especializado. Ejemplo: un agente planifica, otro ejecuta, otro revisa.

---

## T

**Token**
La unidad básica de procesamiento de los LLMs. Aproximadamente 1 token = 0.75 palabras. Los modelos tienen límites de tokens (contexto).

**Tool Calling / Function Calling**
La capacidad de un LLM de decidir cuándo llamar a una función externa y con qué parámetros.

---

## W

**Workflow**
Un flujo de trabajo automatizado. En n8n, los workflows definen qué pasa cuando ocurre un evento.
