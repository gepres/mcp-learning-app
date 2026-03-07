# 🏠 IA Local: Tu Propio Servidor de IA

> **Corre modelos de IA en tu computadora, sin internet, sin costos por uso, sin enviar datos a terceros.**

---

## ¿Por qué IA Local?

```
IA EN LA NUBE                    IA LOCAL
─────────────────                ─────────────────
✅ Muy potente                   ✅ Total privacidad
✅ Siempre actualizada           ✅ Sin costo por token
✅ Sin instalar nada             ✅ Funciona sin internet
✅ Acceso desde cualquier lado   ✅ Datos nunca salen
❌ Pagas por cada token          ❌ Necesitas buen hardware
❌ Tus datos van a terceros      ❌ Modelos menos capaces
❌ Depende de internet           ❌ Configuración inicial
❌ Si sube el precio, problema   ❌ Más lento en hardware bajo
```

### Casos de uso ideales para IA local:
1. Datos confidenciales (médicos, legales, financieros)
2. Desarrollo y testing sin costo
3. Apps offline o en entornos sin internet
4. Volúmenes muy altos de consultas
5. Experimentación sin límites

---

## Hardware Recomendado

```
MÍNIMO (modelos pequeños 1-7B):
  RAM: 8GB
  GPU: No necesaria (CPU lento pero funciona)
  Disco: 10GB libres
  → Llama 3.2 1B, Phi-3 Mini, Gemma 2B

RECOMENDADO (modelos medianos 7-13B):
  RAM: 16GB
  GPU: 8GB VRAM (RTX 3070/4060 o mejor)
  Disco: 30GB libres
  → Llama 3.1 8B, Mistral 7B, Gemma 7B

AVANZADO (modelos grandes 30B+):
  RAM: 32GB+
  GPU: 24GB+ VRAM (RTX 4090, A100)
  Disco: 100GB+
  → Llama 3.1 70B, DeepSeek 33B
```

**Si no tienes GPU**: Los modelos corren en CPU, es más lento pero funciona.
**Apple Silicon (M1/M2/M3)**: Excelente para IA local, usa la RAM unificada eficientemente.

---

## Las Herramientas Principales

### 1. Ollama (⭐ El más popular)
- Descarga y corre modelos con un comando
- API compatible con OpenAI (fácil integración)
- Biblioteca de modelos enorme
- Open source, multiplataforma

### 2. LM Studio
- Interfaz gráfica amigable
- Descarga modelos desde Hugging Face
- Chat integrado para probar modelos
- Modo servidor (expone API local)

### 3. Jan
- Open source
- Interfaz tipo ChatGPT
- Extensiones y plugins
- Modo servidor local

### 4. GPT4All
- Muy fácil de instalar
- Modelos descargables desde la app
- Bueno para principiantes

### 5. text-generation-webui (oobabooga)
- El más flexible/técnico
- Soporta más formatos de modelos
- Extensiones para speech, vision, etc.
- Para usuarios avanzados

---

## Ollama: Guía Rápida

### Instalación
```bash
# En Windows:
# Descarga el instalador desde: https://ollama.ai/download

# En Linux/Mac:
curl -fsSL https://ollama.ai/install.sh | sh
```

### Comandos básicos
```bash
# Descargar y correr un modelo:
ollama run llama3.1

# Descargar sin correr:
ollama pull mistral

# Ver modelos descargados:
ollama list

# Ver modelos disponibles:
# → Ve a https://ollama.ai/library

# Eliminar un modelo:
ollama rm llama3.1

# Ver si está corriendo:
ollama ps
```

### Modelos recomendados para comenzar
```bash
# Muy pequeño y rápido (para probar):
ollama pull phi3:mini        # 2.3GB, Microsoft Phi-3

# Bueno para tareas generales:
ollama pull llama3.1:8b      # 4.7GB, Meta Llama 3.1

# Bueno para código:
ollama pull codellama:7b     # 3.8GB

# En español:
ollama pull llama3.1:8b      # Habla español aceptablemente

# Para análisis y razonamiento:
ollama pull deepseek-r1:7b   # 4.7GB, excelente razonamiento
```

### Usar la API de Ollama
```bash
# Ollama expone una API REST en puerto 11434

# Chat básico:
curl http://localhost:11434/api/generate \
  -d '{
    "model": "llama3.1",
    "prompt": "¿Qué es MCP en el contexto de IA?",
    "stream": false
  }'

# API compatible con OpenAI (para integrar fácilmente):
curl http://localhost:11434/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama3.1",
    "messages": [
      {"role": "user", "content": "Explica MCP en 3 puntos"}
    ]
  }'
```

---

## Conectar Ollama con n8n

En n8n, usa el nodo **Ollama Chat Model**:

```
Configuración:
  Base URL: http://localhost:11434
  Model: llama3.1:8b
```

O usa el nodo **HTTP Request** con la API de Ollama.

---

## Conectar Ollama con Claude Code / Agentes

No puedes usar Ollama directamente como cerebro de Claude Code (ese siempre usa Claude), pero puedes usarlo como herramienta desde tu código:

**Python**
```python
# Usando Ollama como LLM con LangChain:
from langchain_ollama import OllamaLLM

llm = OllamaLLM(model="llama3.1")
respuesta = llm.invoke("¿Qué es MCP?")
print(respuesta)
```

**JavaScript** (Ollama API nativa — no requiere dependencias extra en Node.js v18+)
```javascript
// Usando la API REST de Ollama directamente:
const respuesta = await fetch("http://localhost:11434/api/generate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "llama3.1",
    prompt: "¿Qué es MCP?",
    stream: false,
  }),
});
const data = await respuesta.json();
console.log(data.response);
```

**JavaScript** (con LangChain.js)
```javascript
// npm install @langchain/ollama
import { ChatOllama } from "@langchain/ollama";

const llm = new ChatOllama({ model: "llama3.1", temperature: 0 });
const respuesta = await llm.invoke("¿Qué es MCP?");
console.log(respuesta.content);
```

---

## 🎯 TIC para recordar IA Local

**"POLI = Privado, Offline, Libre, Instantáneo"**

La IA local es como tener un **POLI**clínico propio:
- **P**rivado: los datos no salen de tu consultorio
- **O**ffline: funciona aunque se corte internet
- **L**ibre: sin pagar por cada consulta
- **I**nstantáneo: sin esperar colas del servidor

**Contra**: No es tan "especialista" como el hospital grande (cloud)
**A favor**: Es *tuyo* y siempre está disponible

---

## ✅ Checklist de comprensión

- [ ] Entiendo cuándo conviene IA local vs cloud
- [ ] Sé qué hardware mínimo necesito
- [ ] Instalé Ollama y corrí un modelo
- [ ] Probé la API de Ollama con curl
- [ ] Entiendo cómo integrar con n8n

**→ Práctica: [practica_04_agente-local/README.md](./practica_04_agente-local/README.md)**
