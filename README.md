-> Smart Delivery Game: Dijkstra Route Optimizer
A full-stack logistics visualization tool that solves the "Shortest Path" problem in a residential neighborhood. This project uses real mathematical graph theory to move a delivery scooter between houses.

-> Features
Real-time Pathfinding: Uses Dijkstra's Algorithm to calculate the most efficient route based on distance weights (km).

Interactive Neighborhood: A dynamic SVG map with 6 House nodes (H1 to H6).

Animated Dispatch: A scooter icon that physically travels the calculated path across the screen.

Logistics Dashboard: * Distance Tracker: Shows the total kilometers of the selected route.

Time Prediction: Uses simulated data to estimate arrival time.

Eulerian Path: A specialized mode to visit every road in the network.

-> How the Logic Works
The backend is built with Python/Flask. When you click "Shortest Path," the following happens:

The frontend sends the Start and End houses to the Python server.

The Python "Brain" uses a Priority Queue (heapq) to explore all possible roads.

It finds the path with the lowest total weight (shortest distance).

The coordinates are sent back to React to animate the scooter.

-> Tech Stack
Frontend: React.js, Tailwind CSS, Lucide Icons.

Backend: Python 3, Flask, Flask-CORS.

Math: Dijkstra's Graph Theory.
