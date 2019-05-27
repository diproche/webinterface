export interface Edge {
	origin: string;
	target: string;
}

// Uses the Khan Algorithm loosely
export default function getTopologicalOrder(inputGraph: ReadonlySet<Edge>): string[] {
	const graph: Set<Edge> = new Set(inputGraph);

	const order: string[] = [];
	const vertexesWithNoInEdge: Set<string> = getVertexesWithNoInEdge(graph);

	// These are to avoid issues described in following thread by externalizing deletions (from the loop):
	// https://github.com/diproche/webinterface/pull/28/files/4647fd1d5b3e9050a532c5c24f98d14643f1661e#r287705437
	const edgesToRemove: Set<Edge> = new Set();
	const vertexesToRemove: Set<string> = new Set();

 while (vertexesWithNoInEdge.size !== 0) {
		vertexesWithNoInEdge.forEach((vertex: string) => {
			vertexesToRemove.add(vertex);
			order.push(vertex);
			graph.forEach((edge: Edge) => {
					if (edge.origin === vertex) { edgesToRemove.add(edge); }
					vertexesWithNoInEdge.add(edge.target);
				});
			// Externalized Deletion
			edgesToRemove.forEach((edge: Edge) => graph.delete(edge));
		});
		// Externalized Deletion
		vertexesToRemove.forEach((toRemove: string) => vertexesWithNoInEdge.delete(toRemove));
		vertexesToRemove.clear();
	}

	// If there are cycles in the graph the residual graph will be returned (which contains the cycles)
	// This should be regarded as an error case
	if (graph.size !== 0 ) { throw new Error("Cyclic Imports: " + graph.toString); }

	// Returns the order if successful
	return order;
}

function getVertexesWithNoInEdge(graph: Set<Edge>): Set<string> {
	const outgoing: Set<string> = new Set();
	const incoming: Set<string> = new Set();
	graph.forEach((edge: Edge) => {
		outgoing.add(edge.origin);
	 incoming.add(edge.target);
	});

	incoming.forEach((vertex: string) => {
		outgoing.delete(vertex);
	});

	return outgoing;

}
