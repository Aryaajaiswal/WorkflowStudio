from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
import json

app = FastAPI()

# The React dev server runs on a different origin (localhost:3000) than
# this API (localhost:8000), so the browser blocks the fetch/Form POST
# unless we explicitly allow it. Wide open here since this is a local
# dev assessment, not a deployed service.
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


@app.get('/')
def read_root():
    return {'Ping': 'Pong'}


def is_directed_acyclic_graph(node_ids, edges):
    """
    Standard white/gray/black DFS cycle check. Returns True if the graph
    described by `node_ids` and `edges` (each edge a dict with `source`
    and `target` keys, matching React Flow's edge shape) has no directed
    cycles.

    Edges that reference a node id not present in `node_ids` are ignored
    rather than treated as an error — a pipeline can technically end up
    with a dangling edge if the frontend state gets out of sync, and we'd
    rather answer "is the part we can see acyclic" than crash.
    """
    adjacency = {node_id: [] for node_id in node_ids}
    for edge in edges:
        source, target = edge.get('source'), edge.get('target')
        if source in adjacency and target in adjacency:
            adjacency[source].append(target)

    WHITE, GRAY, BLACK = 0, 1, 2
    color = {node_id: WHITE for node_id in node_ids}

    def has_cycle_from(start):
        stack = [(start, iter(adjacency[start]))]
        color[start] = GRAY
        while stack:
            node, neighbors = stack[-1]
            advanced = False
            for neighbor in neighbors:
                if color[neighbor] == GRAY:
                    return True
                if color[neighbor] == WHITE:
                    color[neighbor] = GRAY
                    stack.append((neighbor, iter(adjacency[neighbor])))
                    advanced = True
                    break
            if not advanced:
                color[node] = BLACK
                stack.pop()
        return False

    for node_id in node_ids:
        if color[node_id] == WHITE:
            if has_cycle_from(node_id):
                return False
    return True


@app.post('/pipelines/parse')
def parse_pipeline(pipeline: str = Form(...)):
    try:
        data = json.loads(pipeline)
    except (json.JSONDecodeError, TypeError):
        data = {}

    nodes = data.get('nodes', []) or []
    edges = data.get('edges', []) or []

    node_ids = [node.get('id') for node in nodes if isinstance(node, dict) and node.get('id') is not None]

    num_nodes = len(node_ids)
    num_edges = len(edges)
    is_dag = is_directed_acyclic_graph(node_ids, edges)

    return {
        'num_nodes': num_nodes,
        'num_edges': num_edges,
        'is_dag': is_dag,
    }
