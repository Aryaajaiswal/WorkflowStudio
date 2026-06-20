# WorkflowStudio

A config-driven visual pipeline builder with a node-based editor, real-time variable detection, and DAG validation. Built with React Flow, FastAPI, and Zustand.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.135-009688?logo=fastapi)
![React Flow](https://img.shields.io/badge/React_Flow-11.8-FF0072?logo=react)

---

## Overview

WorkflowStudio lets users build data pipelines by dragging, connecting, and configuring nodes on an interactive canvas. It validates pipeline structure (DAG detection) and can be extended with custom node types through a simple config-driven architecture.

<img width="512" height="238" alt="image" src="https://github.com/user-attachments/assets/90014e7a-a678-4044-8f32-f509cd78852f" />


### Key features

- **Config-driven node system** — define a new node in one config object; no component boilerplate
- **Live variable handles** — type `{{ input }}` in the Text node and a handle appears instantly
- **DAG validation** — backend detects cycles using a white/gray/black DFS algorithm
- **Design system** — dark slate theme with 5 category colors, IBM Plex typography, subtle animations
- **Keyboard + UI delete** — select a node and press `Backspace`/`Delete` or click the ✕ button

---

## Quick start

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend (new terminal)
cd frontend
npm i
npm start
```

Open http://localhost:3000. The frontend calls the backend at http://localhost:8000 by default — override with `REACT_APP_BACKEND_URL`.

---

## Architecture

### Frontend

| Layer | Tech | Role |
|-------|------|------|
| Canvas | React Flow | Node/edge rendering, drag-and-drop, minimap |
| State | Zustand | Central store for nodes, edges, and mutations |
| Nodes | Config-driven | `BaseNode` + `nodeConfigs.js` — one config per node type |
| Fields | Registry pattern | `fieldRegistry.js` resolves field type to component |
| UI | CSS custom properties | `theme.css` tokens → `App.css` component styles |

#### Key design decisions

- **BaseNode** (`src/nodes/BaseNode.js`) is the shared shell every config-driven node renders through — handles, header, body fields, footer, all driven by plain data
- **createNodeComponent** (`src/nodes/createNodeComponent.js`) turns a config into a React Flow-compatible component; each node file is one line
- **TextNode** (`src/nodes/textNode.js`) is hand-built because its handles derive from live content parsing, but it shares the same CSS and layout as BaseNode
- **extractVariables** (`src/nodes/extractVariables.js`) parses `{{ identifier }}` tokens using a regex + JS identifier validation

### Backend

- **FastAPI** single-endpoint service at `POST /pipelines/parse`
- Accepts `FormData` with a `pipeline` field containing the serialized node/edge graph
- Computes `num_nodes`, `num_edges`, and `is_dag` via DFS cycle detection
- CORS enabled for local development

---

## Node catalog

| Node | Type | Category | Handles | Fields |
|------|------|----------|---------|--------|
| Input | `customInput` | I/O | 1 output | Name, Type (select) |
| Output | `customOutput` | I/O | 1 input | Name, Type (select) |
| LLM | `llm` | Model | 2 inputs, 1 output | Model (select), Temperature (slider) |
| Text | `text` | Text | Dynamic inputs, 1 output | Text (auto-resize textarea) |
| Filter | `filter` | Data | 1 input, 1 output | Condition (select), Value |
| Merge | `merge` | Data | 2 inputs, 1 output | Strategy (select) |
| Delay | `delay` | Logic | 1 input, 1 output | Seconds (number) |
| Code | `code` | Logic | 1 input, 1 output | Language (select), Snippet (textarea) |
| API Request | `apiRequest` | I/O | 1 input, 1 output | Method (select), URL |

---

## Project structure

```
WorkflowStudio/
├── backend/
│   ├── main.py              # FastAPI server + DAG detection
│   └── requirements.txt
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── nodes/
│   │   │   ├── BaseNode.js           # Shared node shell
│   │   │   ├── createNodeComponent.js # Config → component factory
│   │   │   ├── extractVariables.js    # {{ var }} parser
│   │   │   ├── nodeConfigs.js         # All node type definitions
│   │   │   ├── nodeTypes.js           # Registry + palette entries
│   │   │   ├── textNode.js            # Custom node w/ dynamic handles
│   │   │   └── fields/               # Field components (text, select, etc.)
│   │   ├── store.js                  # Zustand state management
│   │   ├── ui.js                     # React Flow canvas wrapper
│   │   ├── toolbar.js                # App header + draggable palette
│   │   ├── submit.js                 # Pipeline submission logic
│   │   ├── PipelineResultModal.js    # Analysis results modal
│   │   ├── theme.css                 # Design tokens
│   │   └── App.css                   # Component styles
│   └── package.json
└── README.md
```

---

## API

### `POST /pipelines/parse`

**Request** (multipart/form-data):
```
pipeline: JSON string of { nodes: [...], edges: [...] }
```

**Response**:
```json
{
  "num_nodes": 4,
  "num_edges": 3,
  "is_dag": true
}
```
