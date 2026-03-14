// Paleta de colores reutilizable
const C = {
  purple: '#818cf8', green: '#34d399', amber: '#f59e0b',
  pink:   '#f472b6', blue:  '#38bdf8', violet:'#a78bfa',
  orange: '#fb923c', teal:  '#2dd4bf', red:   '#f87171',
  lime:   '#a3e635', cyan:  '#22d3ee', rose:  '#fb7185',
}

// ── Primitivas ─────────────────────────────────────────────────────────────
function Box({ label, sub, color, icon, wide }) {
  return (
    <div
      className={`flex flex-col items-center gap-1 ${wide ? 'min-w-[140px]' : 'min-w-[110px]'} px-4 py-2.5 rounded-xl text-center`}
      style={{ background: color + '18', border: `1.5px solid ${color}55`, boxShadow: `0 2px 16px ${color}15` }}
    >
      {icon && <span className="text-xl">{icon}</span>}
      <span className="text-sm font-bold leading-snug" style={{ color }}>{label}</span>
      {sub && <span className="text-xs leading-tight" style={{ color: 'var(--text-muted)' }}>{sub}</span>}
    </div>
  )
}

function Arr({ dir = 'r', color = '#818cf8', label }) {
  const sym = { r: '▶', d: '▼', l: '◀', u: '▲', loop: '↺' }
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-lg leading-none font-bold" style={{ color }}>{sym[dir]}</span>
      {label && <span className="text-xs px-1.5 rounded" style={{ color, background: color + '15' }}>{label}</span>}
    </div>
  )
}

function Tag({ text, color }) {
  return (
    <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: color + '18', color, border: `1px solid ${color}40` }}>
      {text}
    </span>
  )
}

function Wrapper({ children, note }) {
  return (
    <div className="p-6 flex flex-col items-center gap-5">
      {children}
      {note && <p className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>{note}</p>}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// 1. REACT LOOP
// ══════════════════════════════════════════════════════════════════════════
export function DiagReactLoop() {
  const steps = [
    { n: 1, label: 'OBSERVAR', color: C.blue,   desc: 'Qué hay disponible' },
    { n: 2, label: 'PENSAR',   color: C.purple,  desc: 'Razonar (Thought)'  },
    { n: 3, label: 'ACTUAR',   color: C.green,   desc: 'Ejecutar (Action)'  },
  ]
  return (
    <Wrapper note="ReAct = Reasoning + Acting">
      <div className="flex items-start gap-3 flex-wrap justify-center">
        {steps.map((s, i) => (
          <div key={s.n} className="flex items-center gap-3">
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black" style={{ background: s.color + '25', color: s.color, border: `2px solid ${s.color}` }}>{s.n}</div>
              <Box label={s.label} color={s.color} sub={s.desc} />
            </div>
            {i < steps.length - 1 && <Arr color={s.color} />}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 px-5 py-2 rounded-full" style={{ background: C.purple + '12', border: `1px solid ${C.purple}35` }}>
        <span className="text-base" style={{ color: C.purple }}>↺</span>
        <span className="text-xs font-semibold" style={{ color: C.purple }}>repite hasta terminar</span>
      </div>
    </Wrapper>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// 2. MCP PROBLEM — SIN vs CON
// ══════════════════════════════════════════════════════════════════════════
export function DiagMcpProblem() {
  const apps  = ['App A', 'App B']
  const tools = ['Tool 1', 'Tool 2', 'Tool 3']
  return (
    <Wrapper>
      <div className="grid grid-cols-2 gap-8 w-full max-w-xl">
        {/* SIN MCP */}
        <div className="flex flex-col gap-3">
          <div className="text-center text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: C.red + '18', color: C.red, border: `1px solid ${C.red}35` }}>
            SIN MCP — caos
          </div>
          <div className="flex flex-col gap-2">
            {apps.map(a => (
              <div key={a} className="flex flex-col gap-1">
                <Box label={a} color={C.red} />
                <div className="flex gap-1 flex-wrap justify-center">
                  {tools.map(t => (
                    <div key={t} className="flex flex-col items-center">
                      <Arr dir="d" color={C.red} />
                      <Tag text={t} color={C.red} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center text-xs font-bold" style={{ color: C.red }}>N × M conexiones 😱</div>
        </div>

        {/* CON MCP */}
        <div className="flex flex-col gap-3">
          <div className="text-center text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: C.green + '18', color: C.green, border: `1px solid ${C.green}35` }}>
            CON MCP — orden
          </div>
          <div className="flex flex-col items-center gap-2">
            {apps.map(a => <Box key={a} label={a} color={C.blue} />)}
            <Arr dir="d" color={C.green} />
            <Box label="MCP" color={C.green} sub="protocolo estándar" wide />
            <Arr dir="d" color={C.green} />
            <div className="flex gap-1 flex-wrap justify-center">
              {tools.map(t => <Tag key={t} text={t} color={C.green} />)}
            </div>
          </div>
          <div className="text-center text-xs font-bold" style={{ color: C.green }}>N + M conexiones 🎉</div>
        </div>
      </div>
    </Wrapper>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// 3. MCP — 3 ELEMENTOS
// ══════════════════════════════════════════════════════════════════════════
export function DiagMcpElements() {
  return (
    <Wrapper>
      <div className="w-full max-w-md flex flex-col gap-4">
        {/* HOST */}
        <div className="rounded-2xl p-4" style={{ border: `2px solid ${C.blue}50`, background: C.blue + '08' }}>
          <div className="text-xs font-black uppercase mb-3" style={{ color: C.blue }}>🖥️ MCP HOST — el programa que usas</div>
          <div className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>Claude Desktop, Claude Code, Cursor…</div>
          {/* CLIENT dentro */}
          <div className="rounded-xl p-3 ml-4" style={{ border: `1.5px solid ${C.purple}50`, background: C.purple + '10' }}>
            <div className="text-xs font-black uppercase mb-1.5" style={{ color: C.purple }}>🔌 MCP CLIENT — intermediario</div>
            <div className="flex flex-col gap-0.5 text-xs" style={{ color: 'var(--text-muted)' }}>
              <span>• Inicia conexiones con servers</span>
              <span>• Gestiona protocolo JSON-RPC 2.0</span>
              <span>• Viene incluido — no lo instalas</span>
            </div>
          </div>
        </div>

        {/* Flecha */}
        <div className="flex flex-col items-center gap-1">
          <Arr dir="d" color={C.amber} label="stdio / HTTP" />
        </div>

        {/* SERVERS */}
        <div className="rounded-2xl p-4" style={{ border: `2px solid ${C.green}50`, background: C.green + '08' }}>
          <div className="text-xs font-black uppercase mb-3" style={{ color: C.green }}>⚙️ MCP SERVERS — los configuras tú</div>
          <div className="grid grid-cols-3 gap-2">
            {[['📁', 'Archivos', C.green], ['🐘', 'PostgreSQL', C.teal], ['🐙', 'GitHub', C.blue]].map(([ic, lb, cl]) => (
              <Box key={lb} icon={ic} label={lb} color={cl} />
            ))}
          </div>
        </div>
      </div>
    </Wrapper>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// 4. MCP SAMPLING FLOW
// ══════════════════════════════════════════════════════════════════════════
export function DiagMcpSampling() {
  const flow = [
    { label: 'Usuario', color: C.blue },
    { label: 'Host (Claude)', color: C.purple },
    { label: 'Servidor MCP', color: C.green },
    { label: 'Cliente MCP', color: C.violet, note: 'sampling request' },
    { label: 'LLM', color: C.amber, note: 'completion' },
    { label: 'Servidor MCP', color: C.green, note: 'texto generado' },
  ]
  return (
    <Wrapper note="El servidor puede pedir al LLM que genere texto sin tener su propio modelo">
      <div className="flex flex-col items-center gap-1.5">
        {flow.map((f, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <Box label={f.label} color={f.color} sub={f.note} />
            {i < flow.length - 1 && <Arr dir="d" color={flow[i + 1].color} />}
          </div>
        ))}
      </div>
    </Wrapper>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// 5. AGENT SIMPLE — loop completo LLM → Tool → LLM
// ══════════════════════════════════════════════════════════════════════════
export function DiagAgentSimple() {
  return (
    <Wrapper note="El LLM decide cuándo usar herramientas y procesa el resultado">
      <div className="flex flex-col gap-3 w-full max-w-sm">
        {/* Entrada */}
        <div className="flex items-center gap-2">
          <Box label="👤 Usuario" color={C.blue} sub="hace una pregunta" />
          <Arr color={C.blue} />
          <Box label="🧠 LLM" color={C.purple} sub="decide qué hacer" />
        </div>
        {/* Tool call */}
        <div className="flex justify-end pr-2">
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full" style={{ color: C.amber, background: C.amber + '15', border: `1px solid ${C.amber}35` }}>
              <span>→ tools/call</span>
            </div>
            <div className="w-px h-3 self-center" style={{ background: C.amber }} />
          </div>
        </div>
        <div className="flex items-center gap-2 justify-end">
          <div className="flex flex-col items-center gap-0.5">
            <Arr dir="u" color={C.amber} />
            <span className="text-xs px-2 rounded-full" style={{ color: C.amber, background: C.amber + '12' }}>resultado</span>
          </div>
          <Box label="🔧 Herramienta" color={C.amber} sub="ejecuta la acción" />
        </div>
        {/* Respuesta */}
        <div className="flex items-center gap-2">
          <Box label="🧠 LLM" color={C.purple} sub="procesa el resultado" />
          <Arr color={C.purple} />
          <Box label="💬 Respuesta" color={C.green} sub="responde al usuario" />
        </div>
      </div>
    </Wrapper>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// 6. AGENT WITH MEMORY — acceso bidireccional a historial
// ══════════════════════════════════════════════════════════════════════════
export function DiagAgentMemory() {
  return (
    <Wrapper note="Recuerda conversaciones anteriores — corto y largo plazo">
      <div className="flex gap-4 items-start justify-center">
        {/* Flujo principal */}
        <div className="flex flex-col gap-2 items-center">
          <Box label="👤 Usuario" color={C.blue} />
          <Arr dir="d" color={C.blue} />
          <Box label="🧠 LLM" color={C.purple} sub="razona con memoria" wide />
          <Arr dir="d" color={C.purple} />
          <Box label="🔧 Herramientas" color={C.amber} />
          <Arr dir="d" color={C.amber} />
          <Box label="💬 Respuesta" color={C.green} />
        </div>
        {/* Memoria lateral */}
        <div className="flex flex-col items-center gap-1 mt-10">
          <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: C.violet }}>
            <span>↔</span><span>acceso</span>
          </div>
          <div className="rounded-xl px-3 py-3 text-center" style={{ background: C.violet + '12', border: `1.5px dashed ${C.violet}50` }}>
            <div className="text-base mb-1">🗄️</div>
            <div className="text-xs font-bold" style={{ color: C.violet }}>Memoria</div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>corto plazo</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>historial BD</div>
          </div>
        </div>
      </div>
    </Wrapper>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// 7. AGENT PLANNER — 2 fases: PLANIFICAR → EJECUTAR
// ══════════════════════════════════════════════════════════════════════════
export function DiagAgentPlanner() {
  return (
    <Wrapper note="Primero planifica todos los pasos, luego los ejecuta en orden">
      <div className="flex flex-col gap-3 w-full max-w-sm">
        {/* Input */}
        <div className="flex items-center gap-2">
          <Box label="📋 Tarea" color={C.blue} sub="objetivo recibido" />
          <Arr color={C.blue} />
          {/* Fase 1 */}
          <div className="rounded-xl px-3 py-2.5 flex flex-col gap-1" style={{ background: C.purple + '12', border: `1.5px solid ${C.purple}40` }}>
            <div className="text-xs font-black uppercase" style={{ color: C.purple }}>🧠 Fase 1: Planificar</div>
            {['Paso 1', 'Paso 2', 'Paso 3'].map((s, i) => (
              <div key={i} className="text-xs flex items-center gap-1" style={{ color: 'var(--text-dim)' }}>
                <span style={{ color: C.purple }}>→</span> {s}
              </div>
            ))}
          </div>
        </div>
        <Arr dir="d" color={C.purple} label="ejecuta en orden" />
        {/* Fase 2 */}
        <div className="flex items-center gap-2 justify-center">
          {[
            { label: 'Paso 1', color: C.violet },
            { label: 'Paso 2', color: C.amber },
            { label: 'Paso 3', color: C.orange },
          ].map((s, i, arr) => (
            <div key={i} className="flex items-center gap-2">
              <Box label={s.label} color={s.color} />
              {i < arr.length - 1 && <Arr color={s.color} />}
            </div>
          ))}
        </div>
        <Arr dir="d" color={C.orange} />
        <Box label="✅ Resultado final" color={C.green} wide />
      </div>
    </Wrapper>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// 8. MULTI-AGENT — orquestador + agentes especializados
// ══════════════════════════════════════════════════════════════════════════
export function DiagAgentMulti() {
  const agents = [
    { icon: '🔍', label: 'Agente A', sub: 'Investigar', color: C.blue },
    { icon: '✍️', label: 'Agente B', sub: 'Escribir',   color: C.green },
    { icon: '✅', label: 'Agente C', sub: 'Revisar',    color: C.amber },
  ]
  return (
    <Wrapper note="Cada agente es especialista en una sola tarea">
      <div className="flex flex-col items-center gap-3 w-full max-w-sm">
        <div className="w-full px-4 py-2.5 rounded-2xl text-center" style={{ background: C.purple + '15', border: `2px solid ${C.purple}45` }}>
          <div className="text-base mb-0.5">🎯</div>
          <div className="text-xs font-black uppercase" style={{ color: C.purple }}>Orquestador</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>coordina · asigna · evalúa</div>
        </div>
        <div className="flex gap-3 w-full">
          {agents.map((a, i) => (
            <div key={i} className="flex flex-col items-center gap-1 flex-1">
              <Arr dir="d" color={C.purple} />
              <div className="rounded-xl px-2 py-2 text-center w-full" style={{ background: a.color + '12', border: `1.5px solid ${a.color}40` }}>
                <div className="text-base">{a.icon}</div>
                <div className="text-xs font-bold" style={{ color: a.color }}>{a.label}</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{a.sub}</div>
              </div>
              <Arr dir="u" color={a.color} />
            </div>
          ))}
        </div>
        <div className="w-full px-3 py-1.5 rounded-xl text-center text-xs font-semibold" style={{ background: C.violet + '12', border: `1px solid ${C.violet}35`, color: C.violet }}>
          🔀 Combina resultados → Respuesta final
        </div>
      </div>
    </Wrapper>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// 9. PATTERN SEQUENTIAL — salida de uno = entrada del siguiente
// ══════════════════════════════════════════════════════════════════════════
export function DiagPatternSequential() {
  const agents = [
    { n: 1, label: 'Agente 1', color: C.blue },
    { n: 2, label: 'Agente 2', color: C.purple },
    { n: 3, label: 'Agente 3', color: C.green },
  ]
  return (
    <Wrapper note="Patrón Pipeline: la salida de cada agente es la entrada del siguiente">
      <div className="flex flex-col gap-2 w-full max-w-xs">
        {agents.map((a, i) => (
          <div key={a.n} className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0" style={{ background: a.color + '25', color: a.color }}>{a.n}</div>
              <div className="flex-1 px-3 py-2 rounded-xl" style={{ background: a.color + '12', border: `1.5px solid ${a.color}40` }}>
                <div className="text-xs font-bold" style={{ color: a.color }}>{a.label}</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>procesa · genera output</div>
              </div>
            </div>
            {i < agents.length - 1 && (
              <div className="flex items-center gap-2 ml-7">
                <div className="flex-1 border-l-2 border-dashed h-4" style={{ borderColor: a.color + '60' }} />
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ color: a.color, background: a.color + '12' }}>output → input</span>
              </div>
            )}
          </div>
        ))}
        <div className="flex items-center gap-2 mt-1 ml-7">
          <Box label="🏁 Resultado Final" color={C.teal} wide />
        </div>
      </div>
    </Wrapper>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// 10. PATTERN PARALLEL — todos al mismo tiempo
// ══════════════════════════════════════════════════════════════════════════
export function DiagPatternParallel() {
  const agents = [
    { icon: '🌐', label: 'Agente A', sub: 'busca en internet',  color: C.blue },
    { icon: '🗄️', label: 'Agente B', sub: 'consulta base de datos', color: C.green },
    { icon: '📄', label: 'Agente C', sub: 'lee documentos',      color: C.amber },
  ]
  return (
    <Wrapper note="Todos los agentes corren al mismo tiempo — más rápido que secuencial">
      <div className="flex flex-col items-center gap-3 w-full max-w-sm">
        <div className="w-full px-4 py-2 rounded-2xl text-center" style={{ background: C.purple + '15', border: `2px solid ${C.purple}45` }}>
          <div className="text-xs font-black uppercase" style={{ color: C.purple }}>🎯 Orquestador</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>lanza todos en paralelo simultáneamente</div>
        </div>
        {/* Simultaneous launch indicator */}
        <div className="flex gap-1 items-center">
          {agents.map((_, i) => (
            <div key={i} className="flex-1 border-t-2 border-dashed" style={{ borderColor: C.purple + '50' }} />
          ))}
        </div>
        <div className="flex gap-2 w-full">
          {agents.map((a) => (
            <div key={a.label} className="flex-1 flex flex-col items-center gap-1">
              <div className="rounded-xl p-2 text-center w-full" style={{ background: a.color + '12', border: `1.5px solid ${a.color}40` }}>
                <div className="text-base">{a.icon}</div>
                <div className="text-xs font-bold" style={{ color: a.color }}>{a.label}</div>
                <div className="text-xs leading-tight" style={{ color: 'var(--text-muted)' }}>{a.sub}</div>
              </div>
              <Arr dir="d" color={a.color} />
            </div>
          ))}
        </div>
        <div className="w-full px-3 py-2 rounded-xl text-center text-xs font-semibold" style={{ background: C.violet + '12', border: `1.5px solid ${C.violet}35`, color: C.violet }}>
          🔀 Orquestador combina todos los resultados
        </div>
      </div>
    </Wrapper>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// 11. PIPELINE 2 AGENTES (practica2)
// ══════════════════════════════════════════════════════════════════════════
export function DiagPipeline2Agents() {
  return (
    <Wrapper>
      <div className="flex flex-col items-center gap-3 w-full max-w-sm">
        <Box label='👤 Tú' color={C.blue} sub='"Investiga: MCP y Agentes de IA"' wide />
        <Arr dir="d" color={C.blue} />
        <div className="rounded-2xl p-4 w-full" style={{ background: C.purple + '10', border: `1.5px solid ${C.purple}40` }}>
          <div className="text-xs font-black mb-1" style={{ color: C.purple }}>AGENTE 1 — Investigador Senior</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>10 años de experiencia</div>
          <div className="mt-2 text-xs font-semibold" style={{ color: C.purple }}>→ Produce: informe detallado (500+ palabras)</div>
        </div>
        <Arr dir="d" color={C.purple} label="output → input" />
        <div className="rounded-2xl p-4 w-full" style={{ background: C.green + '10', border: `1.5px solid ${C.green}40` }}>
          <div className="text-xs font-black mb-1" style={{ color: C.green }}>AGENTE 2 — Redactor Ejecutivo</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>síntesis y estilo</div>
          <div className="mt-2 text-xs font-semibold" style={{ color: C.green }}>→ Produce: reporte Markdown (max 800 palabras)</div>
        </div>
        <Arr dir="d" color={C.green} />
        <Box label="✅ Reporte final listo" color={C.amber} wide />
      </div>
    </Wrapper>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// 12. N8N EMAIL FLOW
// ══════════════════════════════════════════════════════════════════════════
export function DiagN8nEmail() {
  return (
    <Wrapper>
      <div className="flex flex-col items-center gap-2 w-full max-w-xs">
        {[
          { icon: '📧', label: 'Nuevo email llega a Gmail',    color: C.blue },
          { icon: '⚙️', label: 'n8n lo captura automáticamente', color: C.purple },
          { icon: '🤖', label: 'Claude: ¿Es urgente?',          color: C.violet, sub: 'Nodo IA' },
          { icon: '🔀', label: '¿Urgencia alta?',               color: C.amber,  sub: 'Condición' },
        ].map((s, i) => (
          <div key={i} className="flex flex-col items-center gap-1 w-full">
            <Box icon={s.icon} label={s.label} color={s.color} sub={s.sub} wide />
            {i < 3 && <Arr dir="d" color={s.color} />}
          </div>
        ))}
        <div className="flex gap-4 mt-1">
          <div className="flex flex-col items-center gap-1">
            <Tag text="✅ Sí" color={C.red} />
            <div className="text-xs text-center" style={{ color: C.red }}>Jira + Slack</div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Tag text="❌ No" color={C.green} />
            <div className="text-xs text-center" style={{ color: C.green }}>Respuesta automática</div>
          </div>
        </div>
      </div>
    </Wrapper>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// 13. ECOSYSTEM LAYERS
// ══════════════════════════════════════════════════════════════════════════
export function DiagEcosystemLayers() {
  const layers = [
    { num: 1, title: 'MODELOS — el cerebro',       color: C.purple, items: ['Cloud: Claude, GPT-4, Gemini', 'Local: Llama, Phi, DeepSeek'] },
    { num: 2, title: 'FRAMEWORKS — el esqueleto',  color: C.blue,   items: ['LangChain', 'LangGraph', 'CrewAI', 'AutoGen'] },
    { num: 3, title: 'PROTOCOLOS — el idioma',     color: C.green,  items: ['MCP: estándar para conectar LLMs con tools'] },
    { num: 4, title: 'HERRAMIENTAS — los músculos',color: C.amber,  items: ['Claude Code', 'n8n', 'LM Studio'] },
    { num: 5, title: 'INFRAESTRUCTURA — la base',  color: C.teal,   items: ['Ollama', 'Docker', 'APIs Cloud'] },
  ]
  return (
    <Wrapper>
      <div className="flex flex-col gap-2 w-full max-w-md">
        {layers.map((l) => (
          <div key={l.num} className="rounded-xl px-4 py-2.5 flex items-start gap-3" style={{ background: l.color + '10', border: `1.5px solid ${l.color}35` }}>
            <span className="text-xs font-black w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: l.color + '25', color: l.color }}>{l.num}</span>
            <div>
              <div className="text-xs font-bold mb-1" style={{ color: l.color }}>{l.title}</div>
              <div className="flex flex-wrap gap-1">
                {l.items.map(it => <Tag key={it} text={it} color={l.color} />)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Wrapper>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// 14. QA ARCHITECTURE (Proyecto Final)
// ══════════════════════════════════════════════════════════════════════════
export function DiagQaArch() {
  return (
    <Wrapper>
      <div className="flex flex-col items-center gap-2 w-full max-w-sm">
        <Box label="👤 Usuario hace una pregunta" color={C.blue} wide />
        <Arr dir="d" color={C.blue} />
        <div className="rounded-2xl p-3 w-full" style={{ background: C.purple + '10', border: `1.5px solid ${C.purple}40` }}>
          <div className="text-xs font-black text-center mb-1" style={{ color: C.purple }}>🤖 Agente ReAct</div>
          <div className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>llama3.2:latest via Ollama</div>
          <div className="text-xs italic text-center mt-1" style={{ color: C.violet }}>"Necesito buscar en los documentos"</div>
        </div>
        <Arr dir="d" color={C.purple} />
        <div className="rounded-2xl p-3 w-full" style={{ background: C.green + '10', border: `1.5px solid ${C.green}40` }}>
          <div className="text-xs font-black text-center mb-2" style={{ color: C.green }}>⚙️ MCP Server de Documentos</div>
          <div className="flex justify-center gap-3">
            <Tag text="listar_documentos()" color={C.green} />
            <Tag text="buscar_en_documentos()" color={C.teal} />
          </div>
        </div>
        <Arr dir="d" color={C.green} />
        <Box label="📁 carpeta documentos/ (.txt)" color={C.amber} wide />
        <Arr dir="d" color={C.amber} />
        <Box label="💬 Respuesta contextualizada" color={C.blue} wide />
      </div>
    </Wrapper>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// 15. RAG PIPELINE — 2 fases exactas del texto
// ══════════════════════════════════════════════════════════════════════════
export function DiagRagPipeline() {
  return (
    <Wrapper>
      <div className="flex flex-col gap-4 w-full max-w-lg">

        {/* FASE 1 */}
        <div className="rounded-2xl p-4" style={{ background: C.blue + '08', border: `2px solid ${C.blue}40` }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black" style={{ background: C.blue + '25', color: C.blue }}>1</span>
            <div>
              <div className="text-xs font-black uppercase" style={{ color: C.blue }}>INDEXACIÓN</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>se hace una sola vez</div>
            </div>
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            {[
              { ic: '📄', lb: 'Documentos', cl: C.blue },
              { ic: '✂️', lb: 'Chunking',   cl: C.purple },
              { ic: '🔢', lb: 'Embedding',  cl: C.violet },
              { ic: '🗄️', lb: 'Vector DB',  cl: C.green },
            ].map((s, i, arr) => (
              <div key={s.lb} className="flex items-center gap-1">
                <div className="flex flex-col items-center gap-0.5 px-2.5 py-2 rounded-xl" style={{ background: s.cl + '18', border: `1px solid ${s.cl}35` }}>
                  <span className="text-sm">{s.ic}</span>
                  <span className="text-xs font-semibold" style={{ color: s.cl }}>{s.lb}</span>
                </div>
                {i < arr.length - 1 && <span style={{ color: s.cl, fontSize: '1rem' }}>→</span>}
              </div>
            ))}
          </div>
        </div>

        {/* FASE 2 */}
        <div className="rounded-2xl p-4" style={{ background: C.amber + '08', border: `2px solid ${C.amber}40` }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black" style={{ background: C.amber + '25', color: C.amber }}>2</span>
            <div>
              <div className="text-xs font-black uppercase" style={{ color: C.amber }}>CONSULTA</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>en cada pregunta del usuario</div>
            </div>
          </div>
          {/* Fila búsqueda */}
          <div className="flex items-center gap-1 flex-wrap mb-2">
            {[
              { ic: '❓', lb: 'Pregunta',   cl: C.amber },
              { ic: '🔢', lb: 'Embed',      cl: C.orange },
              { ic: '🔍', lb: 'Búsqueda',   cl: C.red },
              { ic: '📋', lb: 'top-K',      cl: C.pink },
            ].map((s, i, arr) => (
              <div key={s.lb} className="flex items-center gap-1">
                <div className="flex flex-col items-center gap-0.5 px-2.5 py-2 rounded-xl" style={{ background: s.cl + '18', border: `1px solid ${s.cl}35` }}>
                  <span className="text-sm">{s.ic}</span>
                  <span className="text-xs font-semibold" style={{ color: s.cl }}>{s.lb}</span>
                </div>
                {i < arr.length - 1 && <span style={{ color: s.cl, fontSize: '1rem' }}>→</span>}
              </div>
            ))}
          </div>
          {/* Flecha baja + LLM + respuesta */}
          <div className="flex items-center gap-3 justify-end">
            <Arr dir="d" color={C.pink} />
            <div className="flex items-center gap-1">
              <div className="flex flex-col items-center gap-0.5 px-2.5 py-2 rounded-xl" style={{ background: C.purple + '18', border: `1px solid ${C.purple}35` }}>
                <span className="text-sm">🤖</span>
                <span className="text-xs font-semibold" style={{ color: C.purple }}>LLM + Contexto</span>
              </div>
              <span style={{ color: C.purple, fontSize: '1rem' }}>→</span>
              <div className="flex flex-col items-center gap-0.5 px-2.5 py-2 rounded-xl" style={{ background: C.green + '18', border: `1px solid ${C.green}35` }}>
                <span className="text-sm">💬</span>
                <span className="text-xs font-semibold" style={{ color: C.green }}>Respuesta</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// 16. CICLO DE VIDA MCP SERVER
// ══════════════════════════════════════════════════════════════════════════
export function DiagMcpLifecycle() {
  const steps = [
    { n: 1, label: 'INICIO',         color: C.blue,   desc: 'Client lanza el proceso del servidor' },
    { n: 2, label: 'HANDSHAKE',      color: C.purple,  desc: 'initialize ↔ capabilities' },
    { n: 3, label: 'DESCUBRIMIENTO', color: C.violet,  desc: 'tools/list → lista de herramientas' },
    { n: 4, label: 'USO',            color: C.green,   desc: 'tools/call → ejecuta → result (se repite)' },
    { n: 5, label: 'CIERRE',         color: C.amber,   desc: 'proceso termina' },
  ]
  return (
    <Wrapper note="Ciclo de vida completo de una sesión MCP">
      <div className="flex flex-col items-center gap-1.5 w-full max-w-sm">
        {steps.map((s, i) => (
          <div key={s.n} className="flex flex-col items-center gap-1 w-full">
            <div className="flex items-center gap-3 w-full px-3 py-2 rounded-xl" style={{ background: s.color + '12', border: `1.5px solid ${s.color}35` }}>
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0" style={{ background: s.color + '25', color: s.color }}>{s.n}</span>
              <div>
                <div className="text-xs font-bold" style={{ color: s.color }}>{s.label}</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.desc}</div>
              </div>
            </div>
            {i < steps.length - 1 && <Arr dir="d" color={s.color} />}
          </div>
        ))}
      </div>
    </Wrapper>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// 17. FLUJO COMPLETO (juntos)
// ══════════════════════════════════════════════════════════════════════════
export function DiagFlowComplete() {
  const pasos = [
    { n: 1, label: 'TÚ hablas',     color: C.blue,   desc: 'Tu mensaje → Claude Code' },
    { n: 2, label: 'PLANIFICA',     color: C.purple,  desc: 'LLM decide qué tools usar' },
    { n: 3, label: 'EJECUTA tool 1',color: C.green,   desc: 'LLM → MCP → PostgreSQL' },
    { n: 4, label: 'RAZONA',        color: C.violet,  desc: 'Analiza los datos obtenidos' },
    { n: 5, label: 'EJECUTA tool 2',color: C.amber,   desc: 'LLM → MCP → Slack' },
    { n: 6, label: 'RESPONDE',      color: C.teal,    desc: 'Respuesta final al usuario' },
  ]
  return (
    <Wrapper>
      <div className="grid grid-cols-2 gap-3 w-full max-w-md">
        {pasos.map((p) => (
          <div key={p.n} className="rounded-xl px-3 py-2.5 flex items-start gap-2" style={{ background: p.color + '10', border: `1.5px solid ${p.color}35` }}>
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0" style={{ background: p.color + '25', color: p.color }}>{p.n}</span>
            <div>
              <div className="text-xs font-bold" style={{ color: p.color }}>{p.label}</div>
              <div className="text-xs leading-snug" style={{ color: 'var(--text-muted)' }}>{p.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </Wrapper>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// 18. SAMPLING FLOW — back-and-forth
// ══════════════════════════════════════════════════════════════════════════
export function DiagSamplingFlow() {
  return (
    <Wrapper note="El servidor pide prestada la inteligencia del LLM — sin API key propia">
      <div className="flex flex-col gap-2 w-full max-w-sm">
        {/* Fase 1: llamada inicial */}
        <div className="flex items-center gap-2">
          <Box label="Usuario" color={C.blue} />
          <Arr color={C.blue} />
          <Box label="Host (Claude)" color={C.purple} />
          <Arr color={C.purple} />
          <Box label="Servidor MCP" color={C.green} />
        </div>

        {/* Servidor necesita texto */}
        <div className="flex justify-end">
          <div className="flex flex-col items-center gap-0.5">
            <Arr dir="d" color={C.green} />
            <span className="text-xs italic px-2 py-1 rounded-lg" style={{ color: C.green, background: C.green + '12', border: `1px solid ${C.green}30` }}>
              "necesito generar texto"
            </span>
          </div>
        </div>

        {/* Sampling request */}
        <div className="flex items-center gap-2 justify-end">
          <Box label="Cliente MCP" color={C.violet} sub="sampling request" />
          <Arr dir="l" color={C.green} label="pide" />
          <Box label="Servidor MCP" color={C.green} />
        </div>

        {/* LLM genera */}
        <div className="flex justify-start">
          <div className="flex flex-col items-center gap-0.5">
            <Arr dir="d" color={C.violet} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Box label="LLM" color={C.amber} sub="completion" />
          <Arr dir="l" color={C.violet} />
          <Box label="Cliente MCP" color={C.violet} />
        </div>

        {/* Devuelve al servidor */}
        <div className="flex justify-end">
          <Arr dir="d" color={C.amber} />
        </div>
        <div className="flex items-center gap-2 justify-end">
          <Box label="Servidor MCP" color={C.green} sub="continúa su tarea" />
          <Arr dir="l" color={C.amber} label="texto generado" />
          <Box label="LLM → Cliente" color={C.amber} />
        </div>
      </div>
    </Wrapper>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// 19. RESTAURANT ANALOGY
// ══════════════════════════════════════════════════════════════════════════
export function DiagRestaurant() {
  return (
    <Wrapper>
      <div className="flex flex-col items-center gap-2 w-full max-w-xs">
        <div className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl" style={{ background: C.blue + '12', border: `1.5px solid ${C.blue}35` }}>
          <span className="text-2xl">👤</span>
          <div>
            <div className="text-xs font-bold" style={{ color: C.blue }}>Tú (el usuario)</div>
            <div className="text-xs italic" style={{ color: 'var(--text-muted)' }}>"Quiero saber cuántos clientes hay"</div>
          </div>
        </div>
        <Arr dir="d" color={C.blue} />
        <div className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl" style={{ background: C.purple + '12', border: `1.5px solid ${C.purple}35` }}>
          <span className="text-2xl">🍽️</span>
          <div>
            <div className="text-xs font-bold" style={{ color: C.purple }}>Mesero — MCP CLIENT</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Vive DENTRO de Claude Code</div>
            <div className="text-xs font-mono mt-0.5" style={{ color: C.violet }}>tools/call: contar_clientes()</div>
          </div>
        </div>
        <Arr dir="d" color={C.purple} />
        <div className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl" style={{ background: C.green + '12', border: `1.5px solid ${C.green}35` }}>
          <span className="text-2xl">👨‍🍳</span>
          <div>
            <div className="text-xs font-bold" style={{ color: C.green }}>Cocina — MCP SERVER</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Proceso SEPARADO, tú lo configuras</div>
            <div className="text-xs font-mono mt-0.5" style={{ color: C.teal }}>SELECT COUNT(*) FROM clientes</div>
          </div>
        </div>
        <Arr dir="d" color={C.green} />
        <div className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl" style={{ background: C.amber + '12', border: `1.5px solid ${C.amber}35` }}>
          <span className="text-2xl">📦</span>
          <div>
            <div className="text-xs font-bold" style={{ color: C.amber }}>Resultado</div>
            <div className="text-xs font-mono" style={{ color: C.orange }}>{`{ total: 1432 }`}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>→ Mesero → LLM → Claude responde</div>
          </div>
        </div>
      </div>
    </Wrapper>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// 20. FILESYSTEM EXAMPLE — Claude Code + ventas.csv
// ══════════════════════════════════════════════════════════════════════════
export function DiagFilesystemExample() {
  return (
    <Wrapper>
      <div className="flex flex-col gap-3 w-full max-w-sm">
        {/* HOST box */}
        <div className="rounded-2xl p-3" style={{ border: `2px solid ${C.blue}40`, background: C.blue + '08' }}>
          <div className="text-xs font-black uppercase mb-2" style={{ color: C.blue }}>🖥️ CLAUDE CODE — el Host</div>
          <div className="flex flex-col gap-1.5 ml-2">
            <div className="rounded-xl px-3 py-2" style={{ background: C.purple + '12', border: `1px solid ${C.purple}35` }}>
              <div className="text-xs font-bold" style={{ color: C.purple }}>🧠 Claude (LLM)</div>
              <div className="text-xs italic" style={{ color: 'var(--text-muted)' }}>"Necesito leer ventas.csv"</div>
            </div>
            <div className="flex justify-center"><Arr dir="d" color={C.purple} /></div>
            <div className="rounded-xl px-3 py-2" style={{ background: C.violet + '12', border: `1px solid ${C.violet}35` }}>
              <div className="text-xs font-bold" style={{ color: C.violet }}>🔌 MCP CLIENT (integrado)</div>
              <div className="text-xs font-mono" style={{ color: C.violet }}>tools/call "read_file"</div>
            </div>
          </div>
        </div>

        <div className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>↓ proceso separado</div>

        {/* SERVER box */}
        <div className="rounded-2xl px-3 py-2.5" style={{ border: `2px solid ${C.green}40`, background: C.green + '08' }}>
          <div className="text-xs font-black uppercase mb-1" style={{ color: C.green }}>⚙️ MCP SERVER: server-filesystem</div>
          <div className="text-xs font-mono" style={{ color: C.teal }}>fs.readFileSync(path)</div>
          <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>→ "fecha,monto,cliente…"</div>
        </div>
      </div>
    </Wrapper>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// 21. GITHUB EXAMPLE — Claude Desktop + GitHub API
// ══════════════════════════════════════════════════════════════════════════
export function DiagGithubExample() {
  return (
    <Wrapper>
      <div className="flex flex-col gap-2 w-full max-w-sm">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl" style={{ background: C.blue + '12', border: `1.5px solid ${C.blue}35` }}>
          <span className="text-lg">👤</span>
          <div className="text-xs" style={{ color: C.blue }}>
            <span className="font-bold">Tú escribes:</span>
            <span className="italic ml-1">"¿Cuántos issues abiertos tiene mi repo?"</span>
          </div>
        </div>
        <Arr dir="d" color={C.blue} />
        <div className="px-3 py-2 rounded-xl" style={{ background: C.purple + '12', border: `1.5px solid ${C.purple}35` }}>
          <div className="text-xs font-bold mb-1" style={{ color: C.purple }}>🔌 CLIENT — dentro de Claude Desktop</div>
          <div className="text-xs font-mono" style={{ color: C.violet }}>tools/call "list_issues" {`{ repo: "mi-repo" }`}</div>
        </div>
        <Arr dir="d" color={C.purple} />
        <div className="px-3 py-2 rounded-xl" style={{ background: C.green + '12', border: `1.5px solid ${C.green}35` }}>
          <div className="text-xs font-bold mb-1" style={{ color: C.green }}>⚙️ SERVER — server-github (proceso aparte)</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>→ Llama a la API de GitHub</div>
          <div className="text-xs font-mono mt-0.5" style={{ color: C.teal }}>{`[{ id:1, title:"Bug login" }, ...]`}</div>
        </div>
        <Arr dir="d" color={C.green} />
        <div className="px-3 py-2 rounded-xl" style={{ background: C.amber + '12', border: `1.5px solid ${C.amber}35` }}>
          <div className="text-xs font-bold mb-0.5" style={{ color: C.amber }}>💬 Claude responde</div>
          <div className="text-xs italic" style={{ color: 'var(--text-muted)' }}>"Tu repo tiene 7 issues. El más antiguo es 'Bug login' de hace 3 semanas."</div>
        </div>
      </div>
    </Wrapper>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// 22. MULTI-SERVER — 1 Client + 3 Servers
// ══════════════════════════════════════════════════════════════════════════
export function DiagMultiServer() {
  const servers = [
    { icon: '📁', label: 'server-filesystem', sub: 'proceso 1', color: C.green },
    { icon: '🐘', label: 'server-postgres',   sub: 'proceso 2', color: C.blue },
    { icon: '🐙', label: 'server-github',     sub: 'proceso 3', color: C.purple },
  ]
  return (
    <Wrapper note="Claude elige automáticamente cuál usar según la tarea">
      <div className="flex flex-col items-center gap-3">
        <div className="px-5 py-2.5 rounded-2xl" style={{ background: C.violet + '12', border: `2px solid ${C.violet}40` }}>
          <div className="text-xs font-black" style={{ color: C.violet }}>🖥️ Claude Code</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>HOST + CLIENT (integrado)</div>
        </div>
        <div className="flex gap-3">
          {servers.map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <Arr dir="d" color={s.color} />
              <div className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl text-center" style={{ background: s.color + '12', border: `1.5px solid ${s.color}35` }}>
                <span className="text-lg">{s.icon}</span>
                <div className="text-xs font-bold" style={{ color: s.color }}>{s.label}</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Wrapper>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// 23. HOST ELEMENT — definición del Host
// ══════════════════════════════════════════════════════════════════════════
export function DiagHostElement() {
  return (
    <Wrapper note="HOST ≈ CLIENT en la práctica — van siempre juntos">
      <div className="flex flex-col gap-3 w-full max-w-sm">
        <div className="rounded-2xl p-4" style={{ background: C.blue + '08', border: `2px solid ${C.blue}40` }}>
          <div className="text-xs font-black uppercase mb-3" style={{ color: C.blue }}>🖥️ MCP HOST = El programa que abre el usuario</div>
          <div className="flex flex-col gap-1.5 ml-3">
            <div className="flex items-start gap-2 text-xs" style={{ color: 'var(--text-dim)' }}>
              <span style={{ color: C.purple }}>└──</span>
              <span>Contiene al <span className="font-bold" style={{ color: C.purple }}>CLIENT integrado</span></span>
            </div>
            <div className="flex items-start gap-2 text-xs" style={{ color: 'var(--text-dim)' }}>
              <span style={{ color: C.purple }}>└──</span>
              <span>Gestiona conexiones con <span className="font-bold" style={{ color: C.green }}>Servers</span></span>
            </div>
          </div>
        </div>
        <div className="text-xs font-semibold mb-1 px-1" style={{ color: 'var(--text-muted)' }}>Ejemplos de HOST:</div>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Claude Desktop', color: C.purple },
            { label: 'Claude Code', color: C.blue },
            { label: 'Cursor', color: C.green },
            { label: 'Tu propia app', color: C.amber },
          ].map(({ label, color }) => (
            <Tag key={label} text={label} color={color} />
          ))}
        </div>
      </div>
    </Wrapper>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// 24. JUNTOS TECHNICAL — HOST completo con USER + LLM + CLIENT
// ══════════════════════════════════════════════════════════════════════════
export function DiagJuntosTechnical() {
  return (
    <Wrapper>
      <div className="flex flex-col gap-3 w-full max-w-sm">
        {/* HOST container */}
        <div className="rounded-2xl p-3" style={{ border: `2px solid ${C.blue}40`, background: C.blue + '06' }}>
          <div className="text-xs font-black uppercase mb-2 text-center" style={{ color: C.blue }}>MCP HOST</div>
          <div className="flex items-center gap-2 justify-center flex-wrap">
            <div className="px-3 py-1.5 rounded-xl text-xs font-bold" style={{ background: C.blue + '20', color: C.blue, border: `1px solid ${C.blue}40` }}>👤 USUARIO</div>
            <span style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>↔</span>
            <div className="px-3 py-1.5 rounded-xl text-xs font-bold" style={{ background: C.purple + '20', color: C.purple, border: `1px solid ${C.purple}40` }}>🧠 LLM (Claude)</div>
          </div>
          <div className="flex justify-center mt-1"><Arr dir="d" color={C.purple} /></div>
          <div className="flex justify-center">
            <div className="px-3 py-1.5 rounded-xl text-xs font-bold" style={{ background: C.violet + '20', color: C.violet, border: `1px solid ${C.violet}40` }}>🔌 MCP CLIENT</div>
          </div>
        </div>

        {/* Arrow down */}
        <div className="flex justify-center gap-10">
          <Arr dir="d" color={C.green} />
          <Arr dir="d" color={C.green} />
          <Arr dir="d" color={C.green} />
        </div>

        {/* 3 servers */}
        <div className="flex justify-center gap-2">
          {[
            { icon: '📁', label: 'Filesystem', color: C.green },
            { icon: '🐘', label: 'PostgreSQL', color: C.blue },
            { icon: '💬', label: 'Slack', color: C.purple },
          ].map(({ icon, label, color }) => (
            <div key={label} className="flex flex-col items-center gap-0.5 px-2.5 py-2 rounded-xl text-center" style={{ background: color + '12', border: `1.5px solid ${color}35` }}>
              <span className="text-base">{icon}</span>
              <span className="text-xs font-bold" style={{ color }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </Wrapper>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// 25. STDIO TRANSPORT
// ══════════════════════════════════════════════════════════════════════════
export function DiagStdio() {
  return (
    <Wrapper note="Sin red = sin vectores de ataque. Ideal para herramientas locales.">
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <div className="flex items-center gap-3">
          <div className="flex-1 flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl" style={{ background: C.blue + '12', border: `1.5px solid ${C.blue}40` }}>
            <span className="text-base">🖥️</span>
            <span className="text-xs font-bold" style={{ color: C.blue }}>Cliente</span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>proceso local</span>
          </div>

          {/* Flechas bidireccionales */}
          <div className="flex flex-col gap-2 items-center">
            <div className="flex items-center gap-1">
              <span className="text-xs font-mono font-bold" style={{ color: C.green }}>stdin</span>
              <span style={{ color: C.green, fontSize: '1.1rem' }}>▶</span>
            </div>
            <div className="flex items-center gap-1">
              <span style={{ color: C.purple, fontSize: '1.1rem' }}>◀</span>
              <span className="text-xs font-mono font-bold" style={{ color: C.purple }}>stdout</span>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl" style={{ background: C.green + '12', border: `1.5px solid ${C.green}40` }}>
            <span className="text-base">⚙️</span>
            <span className="text-xs font-bold" style={{ color: C.green }}>Servidor</span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>proceso separado</span>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex-1 text-center px-2 py-1 rounded-lg text-xs" style={{ background: C.green + '10', color: C.green }}>
            stdin → envía petición
          </div>
          <div className="flex-1 text-center px-2 py-1 rounded-lg text-xs" style={{ background: C.purple + '10', color: C.purple }}>
            stdout ← devuelve resultado
          </div>
        </div>
      </div>
    </Wrapper>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// 26. HTTP STREAMABLE TRANSPORT
// ══════════════════════════════════════════════════════════════════════════
export function DiagHttpStreamable() {
  return (
    <Wrapper note="Reemplazó al SSE puro en la versión 2025-11-25. Requiere TLS + autenticación.">
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <div className="flex items-center gap-3">
          <div className="flex-1 flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl" style={{ background: C.blue + '12', border: `1.5px solid ${C.blue}40` }}>
            <span className="text-base">💻</span>
            <span className="text-xs font-bold" style={{ color: C.blue }}>Cliente</span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>local / remoto</span>
          </div>

          {/* Flechas bidireccionales */}
          <div className="flex flex-col gap-2 items-center">
            <div className="flex items-center gap-1">
              <span className="text-xs font-mono font-bold" style={{ color: C.amber }}>HTTP POST</span>
              <span style={{ color: C.amber, fontSize: '1.1rem' }}>▶</span>
            </div>
            <div className="flex items-center gap-1">
              <span style={{ color: C.orange, fontSize: '1.1rem' }}>◀</span>
              <span className="text-xs font-mono font-bold" style={{ color: C.orange }}>SSE/HTTP</span>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl" style={{ background: C.amber + '12', border: `1.5px solid ${C.amber}40` }}>
            <span className="text-base">🌐</span>
            <span className="text-xs font-bold" style={{ color: C.amber }}>Servidor</span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>puede ser remoto</span>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <div className="flex-1 text-center px-2 py-1 rounded-lg text-xs" style={{ background: C.amber + '10', color: C.amber }}>
            HTTP POST → petición
          </div>
          <div className="flex-1 text-center px-2 py-1 rounded-lg text-xs" style={{ background: C.orange + '10', color: C.orange }}>
            SSE ← streaming respuesta
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs px-3 py-1.5 rounded-lg" style={{ background: C.red + '10', color: C.red }}>
          🔒 Requiere TLS + autenticación
        </div>
      </div>
    </Wrapper>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// 27. LANGCHAIN PROGRESSION — simple → rag → agent
// ══════════════════════════════════════════════════════════════════════════
export function DiagLangChainProgression() {
  return (
    <Wrapper note="LangChain = piezas modulares que se conectan con el operador |">
      <div className="flex flex-col gap-4 w-full max-w-lg">

        {/* Nivel 1 */}
        <div className="rounded-xl p-3" style={{ background: C.blue + '08', border: `1.5px solid ${C.blue}35` }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black" style={{ background: C.blue + '25', color: C.blue }}>1</span>
            <span className="text-xs font-bold uppercase" style={{ color: C.blue }}>LLM directo — 2 líneas</span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <Box label="❓ Pregunta" color={C.blue} />
            <Arr color={C.blue} />
            <Box label="🧠 LLM" color={C.purple} />
            <Arr color={C.purple} />
            <Box label="💬 Respuesta" color={C.green} />
          </div>
        </div>

        {/* Nivel 2 */}
        <div className="rounded-xl p-3" style={{ background: C.purple + '08', border: `1.5px solid ${C.purple}35` }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black" style={{ background: C.purple + '25', color: C.purple }}>2</span>
            <span className="text-xs font-bold uppercase" style={{ color: C.purple }}>Chain: Prompt | LLM | Parser</span>
          </div>
          <div className="flex items-center gap-1 justify-center flex-wrap">
            {[
              { lb: '📝 Prompt Template', cl: C.blue },
              { lb: '🧠 LLM', cl: C.purple },
              { lb: '✂️ Output Parser', cl: C.violet },
              { lb: '📄 Texto limpio', cl: C.green },
            ].map((s, i, arr) => (
              <div key={s.lb} className="flex items-center gap-1">
                <div className="px-2 py-1.5 rounded-lg text-xs font-semibold text-center" style={{ background: s.cl + '18', color: s.cl, border: `1px solid ${s.cl}35` }}>{s.lb}</div>
                {i < arr.length - 1 && <span style={{ color: s.cl }}>|</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Nivel 3 */}
        <div className="rounded-xl p-3" style={{ background: C.green + '08', border: `1.5px solid ${C.green}35` }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black" style={{ background: C.green + '25', color: C.green }}>3</span>
            <span className="text-xs font-bold uppercase" style={{ color: C.green }}>RAG Chain — con documentos propios</span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 justify-center">
              <Box label="❓ Pregunta" color={C.amber} />
              <Arr color={C.amber} />
              <div className="flex flex-col items-center gap-0.5">
                <Box label="🔍 Retriever" color={C.green} sub="busca en Vector DB" />
              </div>
              <Arr color={C.green} />
              <Box label="📋 Contexto" color={C.teal} />
            </div>
            <div className="flex items-center gap-2 justify-center">
              <Box label="📝 Prompt + Contexto" color={C.purple} wide />
              <Arr color={C.purple} />
              <Box label="🧠 LLM" color={C.purple} />
              <Arr color={C.purple} />
              <Box label="💬 Respuesta" color={C.green} />
            </div>
          </div>
        </div>

        {/* Nivel 4 */}
        <div className="rounded-xl p-3" style={{ background: C.amber + '08', border: `1.5px solid ${C.amber}35` }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black" style={{ background: C.amber + '25', color: C.amber }}>4</span>
            <span className="text-xs font-bold uppercase" style={{ color: C.amber }}>Agent — LLM autónomo con herramientas</span>
          </div>
          <div className="flex items-center gap-2 justify-center flex-wrap">
            <Box label="❓ Pregunta" color={C.blue} />
            <Arr color={C.blue} />
            <Box label="🧠 LLM decide" color={C.purple} sub="ReAct loop" />
            <Arr color={C.purple} label="tool_call" />
            <Box label="🔧 Tool" color={C.amber} />
            <Arr dir="l" color={C.amber} label="result" />
            <Box label="💬 Respuesta" color={C.green} />
          </div>
        </div>

      </div>
    </Wrapper>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// 28. LANGGRAPH FLOW — grafo de estados con ciclos condicionales
// ══════════════════════════════════════════════════════════════════════════
export function DiagLangGraphFlow() {
  return (
    <Wrapper note="LangGraph = agentes como grafos de estado — ciclos, condiciones, multi-agente">
      <div className="flex flex-col gap-4 w-full max-w-md">

        {/* Nivel 1: lineal */}
        <div className="rounded-xl p-3" style={{ background: C.blue + '08', border: `1.5px solid ${C.blue}35` }}>
          <div className="text-xs font-bold uppercase mb-2" style={{ color: C.blue }}>Nivel 1 — Grafo lineal</div>
          <div className="flex items-center gap-2 justify-center">
            {['START', 'Nodo A', 'Nodo B', 'END'].map((n, i, arr) => (
              <div key={n} className="flex items-center gap-2">
                <div className="px-2 py-1 rounded-lg text-xs font-bold" style={{ background: i === 0 || i === arr.length - 1 ? C.blue + '25' : C.purple + '18', color: i === 0 || i === arr.length - 1 ? C.blue : C.purple, border: `1px solid ${i === 0 || i === arr.length - 1 ? C.blue : C.purple}35` }}>{n}</div>
                {i < arr.length - 1 && <Arr color={C.blue} />}
              </div>
            ))}
          </div>
        </div>

        {/* Nivel 2: con ciclo */}
        <div className="rounded-xl p-3" style={{ background: C.purple + '08', border: `1.5px solid ${C.purple}35` }}>
          <div className="text-xs font-bold uppercase mb-2" style={{ color: C.purple }}>Nivel 2 — Con ciclo y condición</div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 justify-center">
              <div className="px-2 py-1 rounded-lg text-xs font-bold" style={{ background: C.blue + '25', color: C.blue }}>START</div>
              <Arr color={C.blue} />
              <Box label="🧠 LLM" color={C.purple} />
              <Arr color={C.purple} label="¿tool?" />
              <Box label="🔧 Tool" color={C.amber} />
            </div>
            <div className="flex items-center gap-2 justify-end pr-4">
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ color: C.amber, background: C.amber + '15' }}>resultado → vuelve al LLM</span>
              <Arr dir="l" color={C.amber} />
            </div>
            <div className="flex items-center gap-2 justify-center">
              <Box label="🧠 LLM" color={C.purple} />
              <Arr color={C.purple} label="¿final?" />
              <div className="px-2 py-1 rounded-lg text-xs font-bold" style={{ background: C.green + '25', color: C.green }}>END ✅</div>
            </div>
          </div>
        </div>

        {/* Nivel 3: multi-agente supervisado */}
        <div className="rounded-xl p-3" style={{ background: C.green + '08', border: `1.5px solid ${C.green}35` }}>
          <div className="text-xs font-bold uppercase mb-2" style={{ color: C.green }}>Nivel 3 — Multi-agente supervisado</div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="px-2 py-1 rounded-lg text-xs font-bold" style={{ background: C.blue + '25', color: C.blue }}>START</div>
              <Arr color={C.blue} />
              <Box label="🎯 Supervisor" color={C.purple} sub="decide quién actúa" />
            </div>
            <div className="flex gap-4">
              {[
                { label: '🔍 Investigador', color: C.blue },
                { label: '✍️ Redactor', color: C.green },
              ].map(a => (
                <div key={a.label} className="flex flex-col items-center gap-1">
                  <Arr dir="d" color={C.purple} />
                  <div className="px-2 py-1.5 rounded-xl text-xs font-bold text-center" style={{ background: a.color + '18', color: a.color, border: `1px solid ${a.color}35` }}>{a.label}</div>
                  <Arr dir="u" color={a.color} />
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Box label="🎯 Supervisor" color={C.purple} sub="¿terminado?" />
              <Arr color={C.purple} />
              <div className="px-2 py-1 rounded-lg text-xs font-bold" style={{ background: C.green + '25', color: C.green }}>END ✅</div>
            </div>
          </div>
        </div>

      </div>
    </Wrapper>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// 29. CREWAI STRUCTURE — agentes con roles, tareas y proceso
// ══════════════════════════════════════════════════════════════════════════
export function DiagCrewStructure() {
  return (
    <Wrapper note="CrewAI = define quiénes son tus agentes, no cómo programarlos">
      <div className="flex flex-col gap-4 w-full max-w-md">

        {/* Nivel 1: 1 agente */}
        <div className="rounded-xl p-3" style={{ background: C.blue + '08', border: `1.5px solid ${C.blue}35` }}>
          <div className="text-xs font-bold uppercase mb-2" style={{ color: C.blue }}>Nivel 1 — 1 Agente, 1 Tarea</div>
          <div className="flex items-center gap-2 justify-center">
            <div className="px-3 py-2 rounded-xl text-center" style={{ background: C.blue + '18', border: `1px solid ${C.blue}35` }}>
              <div className="text-xs font-black" style={{ color: C.blue }}>🔍 Investigador</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>role + goal + backstory</div>
            </div>
            <Arr color={C.blue} />
            <div className="px-3 py-2 rounded-xl text-center" style={{ background: C.purple + '18', border: `1px solid ${C.purple}35` }}>
              <div className="text-xs font-black" style={{ color: C.purple }}>📋 Tarea</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>description + output</div>
            </div>
            <Arr color={C.purple} />
            <Box label="📄 Resultado" color={C.green} />
          </div>
        </div>

        {/* Nivel 2: 2 agentes secuencial */}
        <div className="rounded-xl p-3" style={{ background: C.purple + '08', border: `1.5px solid ${C.purple}35` }}>
          <div className="text-xs font-bold uppercase mb-2" style={{ color: C.purple }}>Nivel 2 — Pipeline Secuencial</div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 justify-center">
              <div className="px-2 py-1.5 rounded-lg text-xs font-bold" style={{ background: C.blue + '18', color: C.blue, border: `1px solid ${C.blue}35` }}>🔍 Investigador</div>
              <Arr color={C.blue} label="informe" />
              <div className="px-2 py-1.5 rounded-lg text-xs font-bold" style={{ background: C.green + '18', color: C.green, border: `1px solid ${C.green}35` }}>✍️ Redactor</div>
              <Arr color={C.green} />
              <div className="px-2 py-1 rounded-lg text-xs font-bold" style={{ background: C.amber + '18', color: C.amber }}>📰 Artículo</div>
            </div>
            <div className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>process=Process.sequential — el output de uno es contexto del siguiente</div>
          </div>
        </div>

        {/* Nivel 3: Jerarquía con manager */}
        <div className="rounded-xl p-3" style={{ background: C.amber + '08', border: `1.5px solid ${C.amber}35` }}>
          <div className="text-xs font-bold uppercase mb-2" style={{ color: C.amber }}>Nivel 3 — Jerarquía con Manager Agent</div>
          <div className="flex flex-col items-center gap-2">
            <div className="px-4 py-2 rounded-2xl text-center" style={{ background: C.amber + '20', border: `2px solid ${C.amber}45` }}>
              <div className="text-xs font-black" style={{ color: C.amber }}>🎯 Manager Agent</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>process=Process.hierarchical</div>
            </div>
            <div className="flex gap-3">
              {[
                { icon: '🔍', label: 'Investigador', color: C.blue },
                { icon: '📊', label: 'Analista', color: C.purple },
                { icon: '✍️', label: 'Redactor', color: C.green },
              ].map(a => (
                <div key={a.label} className="flex flex-col items-center gap-1">
                  <Arr dir="d" color={C.amber} />
                  <div className="px-2 py-1.5 rounded-xl text-center" style={{ background: a.color + '18', border: `1px solid ${a.color}35` }}>
                    <div className="text-base">{a.icon}</div>
                    <div className="text-xs font-bold" style={{ color: a.color }}>{a.label}</div>
                  </div>
                  <Arr dir="u" color={a.color} />
                </div>
              ))}
            </div>
            <div className="text-xs px-3 py-1 rounded-full" style={{ color: C.amber, background: C.amber + '12' }}>
              Manager delega, evalúa y combina resultados
            </div>
          </div>
        </div>

      </div>
    </Wrapper>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// 30. FRAMEWORKS COMPARISON
// ══════════════════════════════════════════════════════════════════════════
export function DiagFrameworksComparison() {
  const rows = [
    { label: 'Metáfora',       lc: 'LEGO modular',      lg: 'Mapa de metro',      cr: 'Empresa con RRHH' },
    { label: 'Curva aprendizaje', lc: 'Media',           lg: 'Alta',               cr: 'Baja' },
    { label: 'Mejor para',     lc: 'Apps + RAG',         lg: 'Agentes complejos',  cr: 'Equipos de agentes' },
    { label: 'Control',        lc: '🟡 Alto',            lg: '🟢 Muy alto',        cr: '🟠 Medio' },
    { label: 'Prototipo',      lc: '⚡ Rápido',          lg: '🐢 Lento',           cr: '⚡ Muy rápido' },
  ]
  return (
    <Wrapper>
      <div className="w-full max-w-lg overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="text-left pb-2 pr-3" style={{ color: 'var(--text-muted)' }}></th>
              <th className="pb-2 px-2 text-center rounded-t-lg" style={{ color: C.blue, background: C.blue + '10' }}>🔗 LangChain</th>
              <th className="pb-2 px-2 text-center" style={{ color: C.purple, background: C.purple + '10' }}>🕸️ LangGraph</th>
              <th className="pb-2 px-2 text-center rounded-t-lg" style={{ color: C.green, background: C.green + '10' }}>👥 CrewAI</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} style={{ borderTop: `1px solid rgba(255,255,255,0.05)` }}>
                <td className="py-1.5 pr-3 font-semibold" style={{ color: 'var(--text-dim)' }}>{r.label}</td>
                <td className="py-1.5 px-2 text-center" style={{ background: C.blue + '06', color: C.blue }}>{r.lc}</td>
                <td className="py-1.5 px-2 text-center" style={{ background: C.purple + '06', color: C.purple }}>{r.lg}</td>
                <td className="py-1.5 px-2 text-center" style={{ background: C.green + '06', color: C.green }}>{r.cr}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Wrapper>
  )
}
