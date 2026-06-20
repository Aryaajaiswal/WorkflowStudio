# VectorShift Frontend Technical Assessment

## Running it

**Backend**
```
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend**
```
cd frontend
npm i
npm start
```

The frontend calls the backend at `http://localhost:8000` by default. Override with
`REACT_APP_BACKEND_URL` if you run the backend elsewhere.

---

## Part 1 — Node abstraction

Every node used to be its own hand-written component duplicating the same box,
header, and field markup. That's replaced with a config-driven system:

- **`nodes/BaseNode.js`** — the shared shell. Renders a header, left/right
  handles (auto-spaced evenly along the edge), a body of fields, and an
  optional footer, all driven by a plain config object.
- **`nodes/fields/`** — one component per field type (`text`, `select`,
  `textarea`, `number`, `slider`, `checkbox`, `note`), resolved through
  `fieldRegistry.js`. A node config just writes `{ type: 'select', ... }`;
  it never imports JSX.
- **`nodes/nodeConfigs.js`** — every node type as data: title, icon,
  category (drives accent color), handles, fields. No component code.
- **`nodes/createNodeComponent.js`** — `createNodeComponent(config)` turns
  a config into a component React Flow can register. Each node file
  (`inputNode.js`, `filterNode.js`, etc.) is now a one-line wrapper.
- **`nodes/nodeTypes.js`** — single registry mapping type keys to
  components and palette metadata, so the canvas and the toolbar palette
  can never drift out of sync.

**Five new nodes** demonstrating the abstraction (each just a config entry +
one-line wrapper file): **Filter**, **Merge**, **Delay**, **Code**, **API
Request**.

The Text node (`nodes/textNode.js`) is hand-built rather than config-driven,
since its handles depend on live parsing of its own content — but it reuses
the same CSS classes and handle layout pattern as `BaseNode` so it's visually
indistinguishable from a "generated" node.

## Part 2 — Styling

Design concept: a **signal board** — pipelines are circuits, nodes are
components, edges are traces. Dark slate canvas, IBM Plex Sans/Mono for a
technical-schematic feel, and a five-color category system so node families
are visually distinguishable at a glance (I/O blue, model violet, text mint,
logic amber, data rose). Tokens live in `theme.css`; component styling is in
`App.css`.

## Part 3 — Text node logic

- **Auto-resize**: the textarea grows its height to fit content
  (`scrollHeight`-based), and the node's width grows with the longest line,
  within sane min/max bounds.
- **Variable detection**: `nodes/extractVariables.js` parses `{{ name }}`
  tokens, keeping only ones that are valid JS identifiers. Each match
  becomes a target Handle on the left edge, labeled with the variable name,
  live as you type — add a token, a handle appears; remove it, the handle
  goes away.

## Part 4 — Backend integration

- **Frontend** (`submit.js`): serializes the current `nodes`/`edges` from
  the Zustand store (stripping the non-serializable `onFieldChange`
  callback) and POSTs them as `pipeline` form data to
  `/pipelines/parse`. Shows the result in an in-app modal
  (`PipelineResultModal.js`) rather than a native `window.alert()`, so it
  fits the rest of the UI — same information, styled.
- **Backend** (`main.py`): the endpoint now accepts `POST`, has CORS
  enabled for the dev server, and computes `num_nodes`, `num_edges`, and
  `is_dag` (a standard white/gray/black DFS cycle check) before returning
  `{num_nodes, num_edges, is_dag}`.
