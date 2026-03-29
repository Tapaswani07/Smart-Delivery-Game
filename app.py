import random
import heapq
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# The real graph with weights (distances in km)
GRAPH = {
    'H1': {'H2': 5, 'H4': 8},
    'H2': {'H1': 5, 'H3': 4, 'H5': 10},
    'H3': {'H2': 4, 'H5': 3, 'H6': 7},
    'H4': {'H1': 8, 'H5': 6},
    'H5': {'H2': 10, 'H3': 3, 'H4': 6, 'H6': 4},
    'H6': {'H3': 7, 'H5': 4}
}

def dijkstra(start, end):
    queue = [(0, start, [])]
    seen = set()
    while queue:
        (cost, node, path) = heapq.heappop(queue)
        if node not in seen:
            path = path + [node]
            seen.add(node)
            if node == end:
                return path, cost
            for next_node, weight in GRAPH.get(node, {}).items():
                heapq.heappush(queue, (cost + weight, next_node, path))
    return [], 0

@app.route('/shortest', methods=['GET'])
def get_shortest():
    start = request.args.get('start', 'H1')
    end = request.args.get('end', 'H6')
    path, distance = dijkstra(start, end)
    return jsonify({"path": path, "distance": distance})

@app.route('/euler', methods=['GET'])
def get_euler():
    # A path that visits almost every road in our neighborhood
    path = ["H1", "H2", "H3", "H5", "H6", "H3", "H2", "H5", "H4", "H1"]
    return jsonify({"path": path, "distance": 52})

@app.route('/predict', methods=['GET'])
def predict():
    # Simulated ML Prediction based on traffic
    return jsonify({"time": random.randint(10, 40)})

if __name__ == '__main__':
    app.run(port=5000, debug=True)