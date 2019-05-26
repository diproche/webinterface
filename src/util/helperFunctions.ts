export function regexGroupToArray(basis: string, pattern: RegExp, group: number): string[] {
	const groupContent: string[] = [];
	let matchGroups: string[] | null;

	while ((matchGroups = pattern.exec(basis)) !== null) {
		groupContent.push(matchGroups[group]);
	}

	return groupContent;
}

export function kahnAlgorithm(graph: Set<string[]>): string[] {
	const order: string[] = [];
	const vertexesWithNoInEdge: Set<string> = getVertexesWithNoInEdge(graph);

 while (vertexesWithNoInEdge.size !== 0) {
		vertexesWithNoInEdge.forEach((vertex: string) => {
			vertexesWithNoInEdge.delete(vertex);
			order.push(vertex);
		 graph.forEach((edge: string[]) => {
				if (edge[0] === vertex) { graph.delete(edge); }
				vertexesWithNoInEdge.add(edge[1]);
			});
		});
	}
 if (graph.size !== 0 ) { throw new Error("Cyclic Import"); }
	return order;
}

function getVertexesWithNoInEdge(graph: Set<string[]>): Set<string> {
	const outgoing: Set<string> = new Set();
	const incoming: Set<string> = new Set();
	graph.forEach((edge: string[]) => {
		outgoing.add(edge[0]);
	 incoming.add(edge[1]);
	});

	incoming.forEach((vertex: string) => {
		outgoing.delete(vertex);
	});

	return outgoing;

}
