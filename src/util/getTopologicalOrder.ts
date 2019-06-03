export interface Edge {
	origin: string;
	target: string;
}

/**
	* Uses the Khan Algorithm (this implementation cannot work with isolated nodes)
	* @param {Set<Edge>} graph - A graph represented as set of edges
	* @return {Array<string>} The topologial oder of the graph
	*/
export default function getTopologicalOrder(inputGraph: ReadonlySet<Edge>): string[] {
	const graph: Set<Edge> = new Set(inputGraph);

	const order: string[] = [];
	const nodesWithNoInEdge: Set<string> = getNodesWithNoInEdge(graph);

	// These are to avoid issues described in following thread by externalizing deletions (from the loop):
	// https://github.com/diproche/webinterface/pull/28/files/4647fd1d5b3e9050a532c5c24f98d14643f1661e#r287705437
	const edgesToRemove: Set<Edge> = new Set();
	const nodesToRemove: Set<string> = new Set();

 while (nodesWithNoInEdge.size !== 0) {
		nodesWithNoInEdge.forEach((node: string) => {
			nodesToRemove.add(node);
			order.push(node);
			graph.forEach((edge: Edge) => {
					if (edge.origin === node) { edgesToRemove.add(edge); }
					nodesWithNoInEdge.add(edge.target);
				});
			// Externalized Deletion
			edgesToRemove.forEach((edge: Edge) => graph.delete(edge));
		});
		// Externalized Deletion
		nodesToRemove.forEach((toRemove: string) => nodesWithNoInEdge.delete(toRemove));
		nodesToRemove.clear();
	}

	// If there are cycles in the graph the residual graph will be returned (which contains the cycles)
	// This should be regarded as an error case
	if (graph.size !== 0 ) { throw new Error("Cyclic Imports: " + graph.toString); }

	// Returns the order if successful
	return order;
}

/**
	*  Gets all nodes which are mentioned in Edge.origin but not in Edge.target
	* @param {Set<Edge>} graph - A graph represented as set of edges
	* @return {Set<string>} Nodes with no in edges assuming no isolated nodes
	*/
function getNodesWithNoInEdge(graph: Set<Edge>): Set<string> {
	const outgoing: Set<string> = new Set();
	const incoming: Set<string> = new Set();
	graph.forEach((edge: Edge) => {
		outgoing.add(edge.origin);
	 incoming.add(edge.target);
	});

	incoming.forEach((node: string) => {
		outgoing.delete(node);
	});

	return outgoing;

}
