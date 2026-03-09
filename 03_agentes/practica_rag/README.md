# 🔬 Práctica RAG: Tu Primer Sistema de Consulta de Documentos

> **Objetivo**: Construir un RAG completo que responda preguntas sobre tus propios documentos, usando modelos 100% locales (sin gastar dinero).

---

## 🎯 Lo que vas a construir

```
mis_docs/          ←── tus documentos (txt, pdf)
    │
    ▼
indexar.py         ←── Fase 1: procesa y guarda embeddings
    │
    ▼
mi_vectordb/       ←── Base de datos vectorial local (ChromaDB)
    │
    ▼
consultar.py       ←── Fase 2: pregunta y recibe respuestas fundamentadas
```

---

## 📋 Pre-requisitos

1. Python 3.10+ instalado
2. Ollama instalado con algún modelo descargado:
   ```bash
   ollama pull llama3.2        # el LLM para generar respuestas
   ollama pull nomic-embed-text # modelo de embeddings local
   ```

---

## 🛠️ Paso 1: Setup del entorno

```bash
# Crear carpeta del proyecto
mkdir practica_rag && cd practica_rag
mkdir mis_docs

# Crear entorno virtual
python -m venv .venv
source .venv/bin/activate    # Linux/Mac
# .venv\Scripts\activate     # Windows

# Instalar dependencias
pip install langchain langchain-community langchain-ollama chromadb
```

---

## 📄 Paso 2: Crear documentos de prueba

Crea `mis_docs/conocimiento.txt` con contenido propio. Ejemplo:

```
# Mi Base de Conocimiento Personal

## Sobre Python
Python es un lenguaje de programación de alto nivel creado por Guido van Rossum.
Es interpretado, multiparadigma y tiene una filosofía de código legible.
Se usa en ciencia de datos, IA, web development y automatización.
El Zen de Python dice: "Simple es mejor que complejo".

## Sobre los Agentes de IA
Un agente de IA es un programa que puede tomar decisiones autónomas.
Los componentes clave son: LLM (cerebro), Herramientas (acciones), Memoria (contexto).
Los agentes pueden usar RAG para acceder a conocimiento externo actualizado.
El patrón ReAct (Reason + Act) es el más común: pensar, actuar, observar.

## Sobre MCP
Model Context Protocol es un estándar de Anthropic para conectar LLMs con herramientas.
Funciona como USB: un conector universal para que cualquier modelo use cualquier herramienta.
Los servidores MCP exponen: Tools (verbos), Resources (sustantivos), Prompts (plantillas).
```

---

## 🔧 Paso 3: Script de indexación

Crea `indexar.py`:

```python
# indexar.py — Construir la base de conocimiento vectorial

from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_ollama import OllamaEmbeddings
from langchain_community.vectorstores import Chroma

print("🚀 Iniciando indexación...")

# 1. Cargar todos los .txt de la carpeta mis_docs
loader = DirectoryLoader(
    "./mis_docs",
    glob="**/*.txt",
    loader_cls=TextLoader,
    loader_kwargs={"encoding": "utf-8"}
)
docs = loader.load()
print(f"📄 {len(docs)} documentos cargados")

# 2. Dividir en chunks
splitter = RecursiveCharacterTextSplitter(
    chunk_size=300,      # 300 tokens por chunk
    chunk_overlap=30,    # 30 tokens de superposición
    separators=["\n\n", "\n", ".", " "]
)
chunks = splitter.split_documents(docs)
print(f"✂️  {len(chunks)} chunks creados")

# Mostrar ejemplo de chunk
print(f"\n📝 Ejemplo de chunk:\n---\n{chunks[0].page_content}\n---")

# 3. Embeddings con modelo local de Ollama
embeddings = OllamaEmbeddings(model="nomic-embed-text")

# 4. Guardar en ChromaDB
vectordb = Chroma.from_documents(
    documents=chunks,
    embedding=embeddings,
    persist_directory="./mi_vectordb"
)

print(f"\n✅ Base vectorial creada: {vectordb._collection.count()} vectores guardados")
print("📁 Ubicación: ./mi_vectordb")
```

---

## 💬 Paso 4: Script de consulta

Crea `consultar.py`:

```python
# consultar.py — Hacer preguntas a tus documentos

from langchain_ollama import OllamaEmbeddings, OllamaLLM
from langchain_community.vectorstores import Chroma
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate

# Cargar base vectorial existente
embeddings = OllamaEmbeddings(model="nomic-embed-text")
vectordb = Chroma(
    persist_directory="./mi_vectordb",
    embedding_function=embeddings
)

# LLM local
llm = OllamaLLM(model="llama3.2", temperature=0)

# Prompt personalizado en español
PROMPT_TEMPLATE = """Usa el siguiente contexto para responder la pregunta en español.
Si no sabes la respuesta basándote en el contexto, di "No encontré información sobre eso en los documentos."
No inventes información.

Contexto:
{context}

Pregunta: {question}

Respuesta:"""

prompt = PromptTemplate(
    template=PROMPT_TEMPLATE,
    input_variables=["context", "question"]
)

# Cadena RAG
rag_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=vectordb.as_retriever(
        search_kwargs={"k": 3}   # recuperar 3 chunks más relevantes
    ),
    chain_type_kwargs={"prompt": prompt},
    return_source_documents=True
)

# Modo interactivo
print("🤖 RAG Local activo. Escribe 'salir' para terminar.\n")
while True:
    pregunta = input("❓ Tu pregunta: ").strip()
    if pregunta.lower() in ["salir", "exit", "quit"]:
        print("👋 ¡Hasta luego!")
        break
    if not pregunta:
        continue

    resultado = rag_chain.invoke({"query": pregunta})

    print(f"\n💬 Respuesta:\n{resultado['result']}")

    print(f"\n📚 Basado en {len(resultado['source_documents'])} fragmentos:")
    for i, doc in enumerate(resultado['source_documents'], 1):
        print(f"  [{i}] {doc.page_content[:80]}...")
    print("\n" + "─"*50 + "\n")
```

---

## ▶️ Paso 5: Ejecutar

```bash
# Primero indexar (solo necesitas hacerlo una vez)
python indexar.py

# Luego consultar (las veces que quieras)
python consultar.py
```

### Preguntas de prueba sugeridas

1. "¿Quién creó Python?"
2. "¿Qué es el patrón ReAct?"
3. "¿Cómo funciona MCP?"
4. "¿Cuántos planetas hay en el sistema solar?" ← debería decir que no sabe

---

## 🔬 Experimentos para profundizar

### Experimento 1: Cambiar chunk_size
```python
# Prueba con 100, 300, 600 tokens
# ¿Cómo cambia la calidad de las respuestas?
chunk_size=100   # muy pequeño: pierde contexto
chunk_size=600   # muy grande: poco específico
```

### Experimento 2: Cambiar k (número de chunks)
```python
search_kwargs={"k": 1}   # solo 1 chunk → más preciso pero puede faltar info
search_kwargs={"k": 5}   # 5 chunks → más contexto pero posible ruido
```

### Experimento 3: Añadir más documentos
Crea `mis_docs/otro_documento.txt`, agrega nueva info y vuelve a indexar.

---

## ✅ Checklist de la práctica

- [ ] Ollama instalado con `llama3.2` y `nomic-embed-text`
- [ ] Entorno virtual creado e instalado
- [ ] Documento de texto propio en `mis_docs/`
- [ ] `indexar.py` ejecutado sin errores
- [ ] `consultar.py` responde correctamente preguntas sobre tus docs
- [ ] Probada una pregunta que NO está en los docs (debe decir que no sabe)
- [ ] (Bonus) Experimentado con diferentes `chunk_size`

---

## 🚀 Siguiente nivel

Una vez que domines esto, el siguiente paso es **exponer tu RAG como un MCP Server** para que cualquier agente (Claude Code, etc.) pueda usarlo como herramienta.

Ver: `../../02_mcp/practica_01_primer-servidor-mcp/`
