import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useTheme } from '../context/ThemeContext'

const TABS = [
  { id: 'mcp', label: '🔌 MCP', color: '#3b82f6' },
  { id: 'ollama', label: '🏠 Ollama', color: '#14b8a6' },
  { id: 'python', label: '🐍 Python', color: '#f59e0b' },
  { id: 'n8n', label: '🔄 n8n', color: '#10b981' },
  { id: 'tics', label: '💡 TICs', color: '#8b5cf6' },
]

const SNIPPETS = {
  mcp: [
    {
      title: 'Instalar servidor MCP de archivos',
      lang: 'bash',
      code: `npx @modelcontextprotocol/server-filesystem /mi/carpeta`,
    },
    {
      title: 'Instalar servidor MCP de PostgreSQL',
      lang: 'bash',
      code: `npx @modelcontextprotocol/server-postgres`,
    },
    {
      title: 'Abrir el MCP Inspector (debug)',
      lang: 'bash',
      code: `npx @modelcontextprotocol/inspector node mi-servidor.js`,
    },
    {
      title: 'Configuración en .claude/settings.json',
      lang: 'json',
      code: `{
  "mcpServers": {
    "nombre-servidor": {
      "command": "node",
      "args": ["ruta/al/servidor.js"],
      "env": { "CLAVE": "valor" }
    },
    "postgres": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-postgres"],
      "env": { "POSTGRES_URL": "postgresql://..." }
    }
  }
}`,
    },
    {
      title: 'Estructura mínima de un MCP Server (Node.js)',
      lang: 'javascript',
      code: `import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js"

const server = new Server(
  { name: "mi-server", version: "1.0.0" },
  { capabilities: { tools: {} } }
)

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [{
    name: "mi_herramienta",
    description: "Descripción de la herramienta",
    inputSchema: {
      type: "object",
      properties: { param: { type: "string" } },
      required: ["param"]
    }
  }]
}))

server.setRequestHandler(CallToolRequestSchema, async ({ params }) => {
  const { name, arguments: args } = params
  if (name === "mi_herramienta") {
    return { content: [{ type: "text", text: \`Resultado: \${args.param}\` }] }
  }
  throw new Error(\`Herramienta desconocida: \${name}\`)
})

await server.connect(new StdioServerTransport())`,
    },
  ],
  ollama: [
    {
      title: 'Comandos básicos de Ollama',
      lang: 'bash',
      code: `ollama pull llama3.1:8b      # Descargar modelo
ollama run llama3.1          # Chat en terminal
ollama list                  # Ver modelos instalados
ollama ps                    # Ver modelos corriendo
ollama serve                 # Iniciar servidor API (puerto 11434)
ollama rm llama3.1           # Eliminar modelo`,
    },
    {
      title: 'Modelos recomendados para empezar',
      lang: 'bash',
      code: `ollama pull phi3:mini        # 2.3GB - Muy rápido
ollama pull llama3.1:8b      # 4.7GB - Balance potencia/velocidad
ollama pull codellama:7b     # 3.8GB - Para código
ollama pull deepseek-r1:7b   # 4.7GB - Mejor razonamiento`,
    },
    {
      title: 'API de Ollama (curl)',
      lang: 'bash',
      code: `# Completar texto:
curl http://localhost:11434/api/generate \\
  -d '{"model": "llama3.1", "prompt": "Hola", "stream": false}'

# Chat (compatible OpenAI):
curl http://localhost:11434/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -d '{"model": "llama3.1", "messages": [{"role": "user", "content": "¿Qué es MCP?"}]}'`,
    },
    {
      title: 'Ollama con LangChain (Python)',
      lang: 'python',
      code: `from langchain_ollama import ChatOllama

llm = ChatOllama(
    model="llama3.1:8b",
    temperature=0,
    base_url="http://localhost:11434"
)

respuesta = llm.invoke("¿Qué es MCP en el contexto de IA?")
print(respuesta.content)`,
    },
    {
      title: 'Ollama en n8n',
      lang: 'text',
      code: `Nodo: Ollama Chat Model
  Base URL: http://localhost:11434
  Model: llama3.1:8b

(Requiere que Ollama esté corriendo en el mismo servidor que n8n)`,
    },
  ],
  python: [
    {
      title: 'LLM Cloud (Claude) con LangChain',
      lang: 'python',
      code: `from langchain_anthropic import ChatAnthropic

llm = ChatAnthropic(model="claude-3-5-sonnet-20241022")
respuesta = llm.invoke("¿Qué es MCP?")
print(respuesta.content)`,
    },
    {
      title: 'Agente ReAct básico',
      lang: 'python',
      code: `from langchain.agents import create_react_agent, AgentExecutor
from langchain.tools import tool
from langchain import hub

@tool
def mi_herramienta(parametro: str) -> str:
    """Descripción de lo que hace la herramienta."""
    return f"Resultado para: {parametro}"

prompt = hub.pull("hwchase17/react")
agente = create_react_agent(llm, [mi_herramienta], prompt)
ejecutor = AgentExecutor(agent=agente, tools=[mi_herramienta], verbose=True)

resultado = ejecutor.invoke({"input": "tu pregunta aquí"})
print(resultado['output'])`,
    },
    {
      title: 'RAG simple con FAISS',
      lang: 'python',
      code: `from langchain_community.vectorstores import FAISS
from langchain_anthropic import AnthropicEmbeddings, ChatAnthropic
from langchain.chains import RetrievalQA

documentos = ["texto 1...", "texto 2...", "texto 3..."]
embeddings = AnthropicEmbeddings()
vectorstore = FAISS.from_texts(documentos, embeddings)

llm = ChatAnthropic(model="claude-3-5-sonnet-20241022")
qa = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=vectorstore.as_retriever(search_kwargs={"k": 3})
)

respuesta = qa.invoke({"query": "tu pregunta"})
print(respuesta['result'])`,
    },
    {
      title: 'Equipo CrewAI',
      lang: 'python',
      code: `from crewai import Agent, Task, Crew, Process
from langchain_anthropic import ChatAnthropic

llm = ChatAnthropic(model="claude-3-5-sonnet-20241022")

investigador = Agent(
    role="Investigador", goal="Encontrar información",
    backstory="Experto en investigación.", llm=llm
)
redactor = Agent(
    role="Redactor", goal="Crear reportes claros",
    backstory="Especialista en comunicación.", llm=llm
)

tarea1 = Task(description="Investiga {tema}", agent=investigador,
              expected_output="Reporte de investigación")
tarea2 = Task(description="Redacta un resumen ejecutivo", agent=redactor,
              expected_output="Resumen en Markdown")

equipo = Crew(agents=[investigador, redactor], tasks=[tarea1, tarea2],
              process=Process.sequential, verbose=True)

resultado = equipo.kickoff(inputs={"tema": "MCP Protocol"})`,
    },
  ],
  n8n: [
    {
      title: 'Instalar n8n con Docker Compose',
      lang: 'yaml',
      code: `version: '3.8'
services:
  n8n:
    image: docker.n8n.io/n8nio/n8n
    restart: always
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=tu-password-seguro
      - WEBHOOK_URL=http://localhost:5678/
    volumes:
      - n8n_data:/home/node/.n8n
volumes:
  n8n_data:`,
    },
    {
      title: 'Comandos Docker para n8n',
      lang: 'bash',
      code: `docker-compose up -d          # Iniciar n8n
docker-compose logs -f n8n   # Ver logs en tiempo real
docker-compose down           # Detener
docker-compose restart n8n   # Reiniciar

# Acceder en: http://localhost:5678`,
    },
    {
      title: 'Probar webhook con curl',
      lang: 'bash',
      code: `# Enviar datos a un webhook de n8n:
curl -X POST http://localhost:5678/webhook/mi-endpoint \\
  -H "Content-Type: application/json" \\
  -d '{"mensaje": "Hola desde curl", "usuario": "Carlos"}'

# Con autenticación básica:
curl -X POST http://localhost:5678/webhook/mi-endpoint \\
  -u admin:password \\
  -H "Content-Type: application/json" \\
  -d '{"data": "test"}'`,
    },
  ],
  tics: null, // will render special
}

const TICS_DATA = [
  {
    acronym: 'CHMT',
    full: 'Chef, Herramientas, Memoria, Tarea',
    concept: '¿Qué es un Agente?',
    analogy: 'Un agente es como un Chef que usa Herramientas, tiene Memoria de recetas y completa una Tarea.',
    emoji: '👨‍🍳',
    color: '#f59e0b',
  },
  {
    acronym: 'MESERO',
    full: 'Modelo, Estándar, Servidor, Ejecuta, Responde, Orquesta',
    concept: '¿Qué es MCP?',
    analogy: 'MCP es el Mesero Universal que habla el mismo idioma con todas las "tiendas" sin importar qué "chef" hace el pedido.',
    emoji: '🍽️',
    color: '#3b82f6',
  },
  {
    acronym: 'OPERA',
    full: 'Observa, Planifica, Ejecuta, Razona, Avanza',
    concept: 'Loop del Agente',
    analogy: 'El agente OPERA como director de orquesta: coordina cada músico (herramienta) en el momento correcto.',
    emoji: '🎼',
    color: '#06b6d4',
  },
  {
    acronym: 'IHDU',
    full: 'Inicio, Handshake, Descubrimiento, Uso',
    concept: 'Arquitectura MCP',
    analogy: 'Como una llamada: marcas (Inicio) → "¿Quién eres?" (Handshake) → "¿Qué puedes hacer?" (Descubrimiento) → "Hazme esto" (Uso).',
    emoji: '📞',
    color: '#6366f1',
  },
  {
    acronym: 'SMMP',
    full: 'Simple, Memoria, Multi, Planificador',
    concept: 'Tipos de Agentes',
    analogy: 'Tipos de empleados: Simple (recién contratado), Memoria (con experiencia), Multi (equipo), Planificador (gerente).',
    emoji: '👥',
    color: '#7c3aed',
  },
  {
    acronym: 'POLI',
    full: 'Privado, Offline, Libre, Instantáneo',
    concept: 'IA Local',
    analogy: 'La IA local es como tu propio POLIclínico: Privado, Offline (siempre disponible), Libre (sin pagar), Instantáneo.',
    emoji: '🏥',
    color: '#14b8a6',
  },
  {
    acronym: 'MFPHE',
    full: 'Modelo, Framework, Protocolo, Herramienta, Ejecución',
    concept: 'El Ecosistema Completo',
    analogy: 'Mi Familia Prueba Herramientas Especiales — 5 capas del ecosistema IA.',
    emoji: '🗺️',
    color: '#f43f5e',
  },
]

function CodeSnippet({ title, lang, code }) {
  const [copied, setCopied] = useState(false)
  const { isDark } = useTheme()

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="glass rounded-xl overflow-hidden">
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{ borderBottom: '1px solid var(--border-subtle)' }}
      >
        <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>{title}</span>
        <button onClick={handleCopy} className="copy-btn static top-auto right-auto">
          {copied ? <><Check size={11} className="inline mr-1" />Copiado</> : <><Copy size={11} className="inline mr-1" />Copiar</>}
        </button>
      </div>
      <SyntaxHighlighter
        language={lang}
        style={isDark ? oneDark : oneLight}
        customStyle={{
          margin: 0,
          borderRadius: 0,
          fontSize: '0.78rem',
          lineHeight: '1.6',
          background: isDark ? '#0d1117' : '#f8f7ff',
          padding: '1rem',
        }}
        wrapLongLines
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}

export default function CheatsheetPage() {
  const [activeTab, setActiveTab] = useState('mcp')
  const snippets = SNIPPETS[activeTab]

  return (
    <div className="page-enter max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-black mb-2 gradient-text">
          ⚡ Cheatsheet
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Comandos y patrones rápidos de referencia</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={activeTab === tab.id ? {
              background: `${tab.color}20`,
              color: tab.color,
              border: `1px solid ${tab.color}40`,
            } : {
              background: 'var(--glass-bg)',
              color: 'var(--text-dim)',
              border: '1px solid var(--glass-border)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'tics' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TICS_DATA.map(tic => (
            <div
              key={tic.acronym}
              className="glass rounded-2xl p-5"
              style={{ border: `1px solid ${tic.color}20` }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{tic.emoji}</span>
                <div>
                  <span
                    className="text-2xl font-black"
                    style={{ color: tic.color }}
                  >
                    {tic.acronym}
                  </span>
                  <span className="text-xs ml-2" style={{ color: 'var(--text-dim)' }}>— {tic.concept}</span>
                </div>
              </div>
              <p className="text-xs mb-2 font-medium" style={{ color: 'var(--text-muted)' }}>{tic.full}</p>
              <p className="text-xs italic leading-relaxed" style={{ color: 'var(--text-dim)' }}>{tic.analogy}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {snippets && snippets.map((s, i) => (
            <CodeSnippet key={i} {...s} />
          ))}
        </div>
      )}

      {/* Error reference */}
      {activeTab === 'mcp' && (
        <div className="mt-8">
          <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>🔴 Errores comunes</h3>
          <div className="glass rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'rgba(99,102,241,0.1)' }}>
                  <th className="text-left px-4 py-3 text-indigo-400 font-semibold">Error</th>
                  <th className="text-left px-4 py-3 text-indigo-400 font-semibold">Causa</th>
                  <th className="text-left px-4 py-3 text-indigo-400 font-semibold">Solución</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['MCP server not found', 'Ruta incorrecta', 'Verificar ruta absoluta en settings.json'],
                  ['Connection refused :11434', 'Ollama no corre', 'Ejecutar ollama serve'],
                  ['Token limit exceeded', 'Contexto muy largo', 'Reducir max_iterations'],
                  ['Tool not found', 'Nombre mal escrito', 'Verificar nombre exacto en tools/list'],
                  ['ENOENT: no such file', 'Archivo no existe', 'Verificar ruta del archivo'],
                ].map(([err, cause, fix], i) => (
                  <tr key={i} className="transition-colors" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                    <td className="px-4 py-3 font-mono text-xs text-rose-400">{err}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-muted)' }}>{cause}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>{fix}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
