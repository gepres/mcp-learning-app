# ⚡ Cheatsheet: Comandos y Patrones Rápidos

---

## MCP

```bash
# Instalar servidor MCP de archivos:
npx @modelcontextprotocol/server-filesystem /mi/carpeta

# Instalar servidor MCP de PostgreSQL:
npx @modelcontextprotocol/server-postgres

# Debug de MCP con el inspector:
npx @modelcontextprotocol/inspector node mi-servidor.js

# Ver logs de MCP en Claude Code:
# Windows: %APPDATA%\Claude\logs\
# Mac/Linux: ~/.claude/logs/
```

```json
// Configuración MCP en .claude/settings.json:
{
  "mcpServers": {
    "nombre-servidor": {
      "command": "node",
      "args": ["ruta/al/servidor.js"],
      "env": { "CLAVE": "valor" }
    }
  }
}
```

---

## Ollama

```bash
ollama pull llama3.1:8b      # Descargar modelo
ollama run llama3.1          # Correr modelo (chat en terminal)
ollama list                  # Ver modelos instalados
ollama ps                    # Ver modelos corriendo
ollama serve                 # Iniciar servidor API (puerto 11434)
ollama rm llama3.1           # Eliminar modelo

# API REST:
curl http://localhost:11434/api/generate \
  -d '{"model": "llama3.1", "prompt": "Hola", "stream": false}'

# API compatible OpenAI:
curl http://localhost:11434/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model": "llama3.1", "messages": [{"role": "user", "content": "Hola"}]}'
```

---

## Python + LangChain

```python
# Con Claude (cloud):
from langchain_anthropic import ChatAnthropic
llm = ChatAnthropic(model="claude-3-5-sonnet-20241022")

# Con Ollama (local):
from langchain_ollama import ChatOllama
llm = ChatOllama(model="llama3.1:8b")

# Llamada básica:
respuesta = llm.invoke("¿Qué es MCP?")
print(respuesta.content)

# Con historial de chat:
from langchain_core.messages import HumanMessage, SystemMessage
mensajes = [
    SystemMessage(content="Eres un experto en IA"),
    HumanMessage(content="¿Qué es MCP?")
]
respuesta = llm.invoke(mensajes)

# Herramienta simple:
from langchain.tools import tool

@tool
def mi_herramienta(parametro: str) -> str:
    """Descripción de lo que hace la herramienta."""
    return f"Resultado para: {parametro}"
```

---

## n8n

```bash
# Instalar con Docker:
docker run -it --rm \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  docker.n8n.io/n8nio/n8n

# Acceder: http://localhost:5678

# Con Docker Compose (recomendado):
docker-compose up -d
docker-compose logs -f n8n
docker-compose down
```

```bash
# Webhook para recibir datos:
POST http://localhost:5678/webhook/mi-endpoint
Content-Type: application/json
{"mensaje": "hola"}

# Probar con curl:
curl -X POST http://localhost:5678/webhook/mi-endpoint \
  -H "Content-Type: application/json" \
  -d '{"mensaje": "prueba"}'
```

---

## Patrones Comunes

### Patrón 1: Agente ReAct básico
```python
from langchain.agents import create_react_agent, AgentExecutor
from langchain import hub

prompt = hub.pull("hwchase17/react")
agente = create_react_agent(llm, herramientas, prompt)
ejecutor = AgentExecutor(agent=agente, tools=herramientas, verbose=True)
resultado = ejecutor.invoke({"input": "tu pregunta"})
```

### Patrón 2: RAG completo (local, sin costo)
```python
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_ollama import OllamaEmbeddings, OllamaLLM
from langchain_community.vectorstores import Chroma
from langchain.chains import RetrievalQA

# Instalar: pip install langchain langchain-community langchain-ollama chromadb
# Ollama: ollama pull nomic-embed-text && ollama pull llama3.2

# INDEXAR (una vez)
splitter = RecursiveCharacterTextSplitter(chunk_size=512, chunk_overlap=50)
chunks = splitter.split_documents(docs)
embeddings = OllamaEmbeddings(model="nomic-embed-text")
vectordb = Chroma.from_documents(chunks, embeddings, persist_directory="./vectordb")

# CONSULTAR (cada vez)
vectordb = Chroma(persist_directory="./vectordb", embedding_function=embeddings)
rag = RetrievalQA.from_chain_type(
    llm=OllamaLLM(model="llama3.2"),
    retriever=vectordb.as_retriever(search_kwargs={"k": 3}),
    return_source_documents=True
)
resultado = rag.invoke({"query": "tu pregunta"})
print(resultado["result"])
```

### Patrón 2b: RAG con reranker (+10-30% precisión)
```python
from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import CrossEncoderReranker
from langchain_community.cross_encoders import HuggingFaceCrossEncoder

reranker = CrossEncoderReranker(
    model=HuggingFaceCrossEncoder(model_name="cross-encoder/ms-marco-MiniLM-L-6-v2"),
    top_n=3
)
retriever_mejorado = ContextualCompressionRetriever(
    base_compressor=reranker,
    base_retriever=vectordb.as_retriever(search_kwargs={"k": 10})
)
```

### Patrón 3: MCP Server mínimo
```javascript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server({ name: "mi-server", version: "1.0.0" }, { capabilities: { tools: {} } });
// ... definir handlers ...
await server.connect(new StdioServerTransport());
```

---

## TICs de Memoria (resumen)

| Concepto | TIC |
|----------|-----|
| ¿Qué es un Agente? | **CHMT**: Chef, Herramientas, Memoria, Tarea |
| ¿Qué hace MCP? | **El Mesero Universal** (entre chef y tiendas) |
| Loop del agente | **OPERA**: Observa, Planifica, Ejecuta, Razona, Avanza |
| Arquitectura MCP | **IHDU**: Inicio, Handshake, Descubrimiento, Uso |
| IA Local | **POLI**: Privado, Offline, Libre, Instantáneo |
| Todo el ecosistema | **MFPHE**: Modelo, Framework, Protocolo, Herramienta, Ejecución |
| ¿Qué es RAG? | **"El Estudiante con Biblioteca"**: Busca → Lee → Responde |
| Pipeline RAG | **CEVG**: Chunking → Embedding → Vector DB → Generate |
| Chunking | **"Los Cubitos de Hielo"**: ni muy grande ni muy pequeño |
| Embeddings | **"El GPS del Significado"**: texto → coordenadas de significado |

---

## Errores Comunes y Soluciones

| Error | Causa | Solución |
|-------|-------|----------|
| `MCP server not found` | Ruta incorrecta en config | Verificar ruta absoluta en settings.json |
| `Connection refused :11434` | Ollama no está corriendo | `ollama serve` o reiniciar app |
| `Token limit exceeded` | Contexto muy largo | Reducir `max_iterations` o truncar docs |
| `Tool not found` | Nombre de herramienta mal escrito | Verificar exactamente el nombre en tools/list |
| `ENOENT: no such file` | Archivo no existe | Verificar ruta del archivo |

---

## Links Rápidos

- MCP Docs: https://modelcontextprotocol.io
- MCP Servers: https://github.com/modelcontextprotocol/servers
- Ollama Library: https://ollama.ai/library
- n8n Docs: https://docs.n8n.io
- LangChain Python: https://python.langchain.com
- CrewAI Docs: https://docs.crewai.com
- Hugging Face: https://huggingface.co/models
