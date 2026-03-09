# 🔍 RAG: Retrieval-Augmented Generation

> **La memoria externa de los agentes de IA**

---

## 🧠 TIC para recordar RAG para siempre

### **"El Estudiante con Biblioteca"**

> Imagina un estudiante muy inteligente (el LLM) que sabe muchísimo, pero su conocimiento tiene fecha de corte. Antes de responder un examen, puede **ir a la biblioteca** (la base de datos vectorial), **buscar los libros relevantes** (retrieval), **leerlos rápido** (contexto) y luego **escribir su respuesta** (generation).

```
SIN RAG:  Estudiante responde solo con lo que memorizó → puede alucinar o quedar desactualizado
CON RAG:  Estudiante busca → lee fuente → responde con evidencia → respuesta precisa
```

**RAG = Buscar primero, responder después**

---

## ¿Qué es RAG?

**Retrieval-Augmented Generation** es una técnica que combina:
1. **Retrieval** (Recuperación): buscar información relevante en una base de datos
2. **Augmented** (Aumentada): inyectar esa información al contexto del LLM
3. **Generation** (Generación): el LLM genera la respuesta usando ese contexto extra

### ¿Por qué existe RAG?

Los LLMs tienen **tres problemas fundamentales**:

| Problema | Descripción | RAG lo resuelve |
|----------|-------------|-----------------|
| **Fecha de corte** | El modelo no sabe nada después de su entrenamiento | ✅ Conecta a datos actualizados |
| **Alucinaciones** | Inventa hechos que no sabe | ✅ Ancla respuestas en documentos reales |
| **Contexto limitado** | No puede "leer" millones de documentos | ✅ Recupera solo lo relevante |

---

## 🏗️ Arquitectura del Pipeline RAG

El pipeline tiene **2 fases** principales:

```
╔══════════════════════════════════════════════════════════════════╗
║  FASE 1: INDEXACIÓN (se hace una sola vez o periódicamente)      ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  📄 Documentos → ✂️ Chunking → 🔢 Embedding → 🗄️ Vector DB       ║
║  (PDFs, webs,     (trozos       (texto →        (Pinecone,       ║
║   textos, etc.)    de texto)     vector)         Chroma, etc.)   ║
║                                                                  ║
╠══════════════════════════════════════════════════════════════════╣
║  FASE 2: CONSULTA (se hace en cada pregunta del usuario)         ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  ❓ Pregunta → 🔢 Embed query → 🔍 Búsqueda → 📋 Contexto         ║
║  del usuario    (mismos         similitud        (top K           ║
║                  vectores)       vectorial        chunks)         ║
║                      ↓                                           ║
║              🤖 LLM + Contexto → 💬 Respuesta fundamentada        ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## 🔪 Chunking: El Arte de Cortar Documentos

**Chunking** = dividir documentos en piezas manejables antes de almacenarlas.

### TIC: "Los Cubitos de Hielo"

> No metes un bloque de hielo entero en un vaso: lo partes en cubitos. Así el agua (información) es útil. Si el cubo es muy grande, no cabe. Si es muy pequeño, pierde contexto.

### Estrategias de Chunking

| Estrategia | Descripción | Cuándo usar |
|------------|-------------|-------------|
| **Fixed-size** | Cortar cada N caracteres | Textos homogéneos, rápido |
| **Recursive** | Cortar por párrafos → oraciones → palabras | General purpose, más inteligente |
| **Semantic** | Agrupar por significado similar | Alta precisión (+9% recall) |
| **Sliding window** | Chunks con superposición (overlap) | No perder contexto entre cortes |
| **Document-based** | Respetar estructura (títulos, secciones) | PDFs con estructura clara |

### Parámetros clave

```
chunk_size = 512 tokens  ← tamaño del trozo
chunk_overlap = 50       ← cuántos tokens se repiten entre trozos
                            (evita perder contexto en los bordes)
```

---

## 🔢 Embeddings: Convertir Texto en Números

Un **embedding** es una representación numérica (vector) del significado de un texto.

### TIC: "El GPS del Significado"

> Igual que las coordenadas GPS ubican un lugar en el mapa, los embeddings ubican el significado de un texto en un "mapa de ideas". Textos con significado parecido quedan cerca en ese mapa.

```
"perro"    → [0.2, 0.8, -0.1, 0.5, ...]   ←── cerca de "can", "mascota"
"gato"     → [0.3, 0.7, -0.2, 0.4, ...]   ←── también cerca de "mascota"
"avión"    → [0.9, -0.3, 0.6, -0.1, ...]  ←── lejos de animales
```

### Modelos de embedding populares (2025)

| Modelo | Proveedor | Dimensiones | Notas |
|--------|-----------|-------------|-------|
| `text-embedding-3-large` | OpenAI | 3072 | Muy bueno, de pago |
| `voyage-3-large` | Voyage AI | 1024 | +9.74% vs OpenAI en benchmarks |
| `nomic-embed-text` | Nomic / Ollama | 768 | **Gratis, local** |
| `mxbai-embed-large` | MixedBread | 1024 | Excelente open source |
| `all-MiniLM-L6-v2` | Sentence Transformers | 384 | Ligero, muy usado |

---

## 🗄️ Bases de Datos Vectoriales

Una **vector database** almacena y busca embeddings eficientemente.

### TIC: "El Catálogo de una Biblioteca Musical"

> Las canciones están organizadas por "vibe" (mood), no por título. Si buscas algo "melancolico y con guitarra", el catálogo te trae las más parecidas. Eso hace una vector DB.

### Opciones principales 2025

```
┌─────────────────┬────────────────────────────────────────────────┐
│   Base de datos │ Características                                 │
├─────────────────┼────────────────────────────────────────────────┤
│ 🟢 Chroma       │ Local, gratis, ideal para aprender             │
│ 🔵 Pinecone     │ Cloud managed, producción, serverless          │
│ 🟡 Weaviate     │ Open source, búsqueda híbrida (vector + BM25)  │
│ 🟠 Qdrant       │ Open source, muy rápido, Rust                  │
│ 🔴 Milvus       │ Escala masiva, empresarial                     │
│ 🟣 FAISS        │ Meta, en memoria, sin servidor, para prototipo │
└─────────────────┴────────────────────────────────────────────────┘
```

### Tipos de búsqueda

- **Búsqueda vectorial**: por similitud semántica (significado)
- **Búsqueda BM25/keyword**: por palabras exactas (como Google clásico)
- **Búsqueda híbrida**: combina ambas → mejor resultado (+10-30% precisión)

---

## 🔄 Variantes Avanzadas de RAG (2025/2026)

### 1. 🕸️ GraphRAG (Microsoft)

Construye un **grafo de conocimiento** con entidades y relaciones.

```
Documentos → Extraer entidades → Grafo → Consultar por relaciones

Ejemplo: "¿Cómo se relacionan Einstein y la bomba atómica?"
         → El grafo conecta: Einstein ─── influyó en ──→ Oppenheimer
                             Oppenheimer ─── lideró ──→ Proyecto Manhattan
```

**Ventaja**: precisión hasta 99% en consultas relacionales complejas.

---

### 2. 🔁 Self-RAG

El LLM **decide dinámicamente** si necesita recuperar información o puede responder solo.

```
Pregunta → LLM evalúa: "¿Necesito datos externos?"
           ├── NO → Responde directamente
           └── SÍ → Recupera → Evalúa relevancia → Genera → Autocrítica
```

---

### 3. 🤖 Agentic RAG

Los **agentes** controlan el proceso de recuperación multi-paso.

```
Agente planifica → Busca en fuente 1 → Evalúa → Busca en fuente 2
       → Sintetiza → Verifica → Responde

Útil para: preguntas complejas que requieren combinar múltiples fuentes
```

---

### 4. 🌳 RAPTOR

Construye un **árbol jerárquico** resumiendo chunks de abajo hacia arriba.

```
Nivel 0: chunks originales (detalle máximo)
Nivel 1: resúmenes de grupos de chunks
Nivel 2: resúmenes de resúmenes
Nivel 3: resumen global del documento

→ Búsqueda en múltiples niveles según la pregunta
```

---

### 5. 📄 Long RAG

En vez de chunks pequeños, recupera **unidades largas** (secciones completas).

```
RAG clásico:  chunk de 200 tokens → pierde contexto
Long RAG:     sección entera de 2000 tokens → contexto preservado
```

---

## 💻 Ejemplo de Código: RAG Básico con Python

### Instalación

```bash
pip install langchain langchain-community chromadb sentence-transformers
```

### Paso 1: Indexar documentos

```python
# indexar.py — Fase 1: construir la base de conocimiento

from langchain.document_loaders import TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma

# 1. Cargar documento
loader = TextLoader("mi_documento.txt", encoding="utf-8")
docs = loader.load()

# 2. Chunking: dividir en trozos con overlap
splitter = RecursiveCharacterTextSplitter(
    chunk_size=512,
    chunk_overlap=50,
    separators=["\n\n", "\n", ".", " "]
)
chunks = splitter.split_documents(docs)
print(f"✅ {len(chunks)} chunks creados")

# 3. Embeddings (modelo local, gratuito)
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# 4. Guardar en vector DB (Chroma)
vectordb = Chroma.from_documents(
    documents=chunks,
    embedding=embeddings,
    persist_directory="./mi_vectordb"
)
print("✅ Base vectorial guardada en ./mi_vectordb")
```

### Paso 2: Consultar con RAG

```python
# consultar.py — Fase 2: hacer preguntas con contexto

from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.chains import RetrievalQA
from langchain_community.llms import Ollama

# Cargar vector DB existente
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)
vectordb = Chroma(
    persist_directory="./mi_vectordb",
    embedding_function=embeddings
)

# LLM local con Ollama
llm = Ollama(model="llama3.2")

# Crear cadena RAG
rag_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",           # "stuff" = meter todo el contexto junto
    retriever=vectordb.as_retriever(
        search_kwargs={"k": 3}    # recuperar los 3 chunks más similares
    ),
    return_source_documents=True  # ver de dónde vino la respuesta
)

# Hacer una pregunta
resultado = rag_chain.invoke({"query": "¿Cuáles son los puntos clave del documento?"})

print("💬 Respuesta:", resultado["result"])
print("\n📚 Fuentes usadas:")
for doc in resultado["source_documents"]:
    print(f"  - {doc.page_content[:100]}...")
```

### Paso 3: RAG con reranking (avanzado)

```python
# rag_avanzado.py — Añadir reranker para mejorar precisión +10-30%

from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import CrossEncoderReranker
from langchain_community.cross_encoders import HuggingFaceCrossEncoder

# Modelo de reranking (evalúa relevancia pregunta-chunk)
reranker_model = HuggingFaceCrossEncoder(
    model_name="cross-encoder/ms-marco-MiniLM-L-6-v2"
)
reranker = CrossEncoderReranker(model=reranker_model, top_n=3)

# Recuperar más candidatos (10) y reranquear a los mejores (3)
retriever_base = vectordb.as_retriever(search_kwargs={"k": 10})
retriever_mejorado = ContextualCompressionRetriever(
    base_compressor=reranker,
    base_retriever=retriever_base
)

rag_chain_mejorado = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=retriever_mejorado,
    return_source_documents=True
)

resultado = rag_chain_mejorado.invoke({"query": "Tu pregunta aquí"})
print(resultado["result"])
```

---

## 📊 Métricas para Evaluar tu RAG

| Métrica | Qué mide | Cómo medirla |
|---------|----------|--------------|
| **Faithfulness** | ¿La respuesta se basa en el contexto? | RAGAS framework |
| **Answer Relevancy** | ¿La respuesta responde la pregunta? | RAGAS framework |
| **Context Recall** | ¿Se recuperaron los chunks correctos? | RAGAS framework |
| **Context Precision** | ¿Los chunks recuperados son relevantes? | RAGAS framework |

```bash
# Instalar RAGAS para evaluar tu RAG
pip install ragas
```

---

## 🔧 Mejoras Clave para RAG en Producción

```
Pipeline básico:     Pregunta → Retrieve(k=3) → LLM → Respuesta
                                    ↑
                              (puede mejorar con:)

1. QUERY EXPANSION:  Reformular la pregunta de múltiples formas
2. HYBRID SEARCH:    Vector + BM25 keyword = mejor cobertura
3. RERANKING:        Puntuar y re-ordenar resultados recuperados
4. PARENT-CHILD:     Guardar chunks pequeños pero recuperar los padres grandes
5. HYPOTHETICAL DOC: Generar un doc hipotético y buscarlo (HyDE)
```

---

## 🗺️ RAG en el Ecosistema del Proyecto

```
Tu Agente (Claude / LLM)
        │
        ├── 🔍 Tool: RAG Query
        │          │
        │          ├── Embedding del query
        │          ├── Búsqueda en Vector DB
        │          └── Devuelve chunks relevantes
        │
        ├── 🔧 MCP Server → expone RAG como herramienta MCP
        │
        └── 🤖 n8n → puede disparar re-indexación automática
                      cuando llegan documentos nuevos
```

**RAG + MCP** = Cualquier agente puede acceder a tu base de conocimiento a través de un MCP Server que exponga las funciones `indexar_documento` y `consultar_documentos`.

---

## 💡 TIC Final: El Acrónimo RAG

```
R — Retrieval   = RECUPERAR información relevante de una fuente
A — Augmented   = AUMENTAR el contexto del LLM con esa información
G — Generation  = GENERAR la respuesta fundamentada en evidencia

RAG = "Busca ANTES de hablar"
```

---

## 📚 Recursos para Seguir Aprendiendo

- [LangChain RAG Docs](https://docs.langchain.com/oss/python/langchain/rag)
- [The Ultimate RAG Blueprint 2025/2026 — LangWatch](https://langwatch.ai/blog/the-ultimate-rag-blueprint-everything-you-need-to-know-about-rag-in-2025-2026)
- [RAG in 2026 — Squirro Blog](https://squirro.com/squirro-blog/state-of-rag-genai)
- [From RAG to Context — RAGFlow Review](https://ragflow.io/blog/rag-review-2025-from-rag-to-context)
- [RAGAS — Evalúa tu RAG](https://docs.ragas.io/)

---

## ✅ Checklist: Tu primer RAG

- [ ] Instalar dependencias: `langchain`, `chromadb`, `sentence-transformers`
- [ ] Preparar un documento de prueba (`.txt` o `.pdf`)
- [ ] Ejecutar el script de indexación
- [ ] Hacer 3 preguntas distintas y evaluar respuestas
- [ ] Probar con chunk_size diferente y comparar calidad
- [ ] Añadir reranker y comparar con versión básica
- [ ] (Bonus) Exponer tu RAG como MCP Server

---

*Siguiente: [`03_como-se-conectan.md`](./03_como-se-conectan.md) — Cómo los agentes usan RAG junto a otras herramientas*
