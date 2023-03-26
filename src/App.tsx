/**
 * Notes
 * If the nodes are overlapping, hover over the node
 * 
 * 
 * Input
 * [a, b, c, d, e, f, g, h, i]
 * 
 * Output
 * [a, [b, [d, [h, i], e], c, [f, g]]]
 * first child: 2n + 1
 * second child: 2n + 2
 * 
 *      0
 *    /   \
 *   1     2
 *  / \   / \
 * 3   4 5   6
 * 
 * Total hours spent: 11h
 * 2h wednesday
 * 5h thursday
 * 4h friday
 */


import { useState } from 'react';
import { toTree } from 'utils/helper';
import styles from './App.module.css';

const App = () => {
	const [states, setStates] = useState<{ value: string; tree: TreeChildType }>({
		value: "",
		tree: []
	});

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
	};

	const onChangeInput = (value: string) => {
		setStates({
			value,
			tree: toTree(value.split(' ').filter(Boolean))
		});
	}

	const findParent = (nodes: TreeChildConfigType[], nodeId: string): TreeChildConfigType | undefined => {
		const node = nodes.find((node) => node.value === nodeId) as TreeChildConfigType;

		let parentNodeIndex = 0;
		if (node.index % 2 === 0) parentNodeIndex = (node.index - 2) / 2;
		else parentNodeIndex = (node.index - 1) / 2;

		return nodes.find((node) => node.index === parentNodeIndex);
	}

	const treeToNodes = (tree: TreeChildType, level = 0): (TreeChildConfigType & { parentNode: TreeChildConfigType | null })[] => {
		let nodes: (TreeChildConfigType & { parentNode: TreeChildConfigType | null })[] = [];

		/* Flatt nodes */
		for (let i = 0; i < tree.length; i++) {
			const item = tree[i] as TreeChildObject;

			const element: (TreeChildConfigType & { parentNode: TreeChildConfigType | null }) = {
				position: [0, level * 72],
				value: item.value as string,
				index: item.index,
				left: (item.index % 2 === 0) ? false : true,
				parentNode: null,
				level
			};

			if (Array.isArray(item)) nodes = [...nodes, ...treeToNodes(item, level + 1)];
			else nodes.push(element);
		}

		/* Assign parent node */
		for (let i = 0; i < nodes.length; i++) {
			const node = nodes[i];
			const parentNode = findParent(nodes, node.value);
			if (parentNode && i > 0) {
				const [parentX,] = parentNode.position;

				nodes[i].parentNode = parentNode;
				node.position[0] = node.left ? parentX + (96 / node.level) : parentX - (96 / node.level);
			}
		}

		return nodes;
	}

	const createDOM = (tree: TreeChildType) => {
		return treeToNodes(tree).map((node, index) => {
			if (!node.value) return null;

			return (
				<div
					className={styles.node}
					key={`${node.value}_${index}`}
					style={{
						left: `calc(50% - ${node.position[0]}px)`,
						top: `${node.position[1] - ((node.level) * 7.2)}px`,
					}}
				>
					<div
						className={styles.nodeInner}
						style={{
							width: `${72 - ((node.level) * 7.2)}px`,
							height: `${72 - ((node.level) * 7.2)}px`
						}}
					>
						{node.value}
					</div>
				</div>
			);
		})
	}

	return (
		<div className="wrapper">
			<form onSubmit={onSubmit} method='get'>
				<input
					type='text'
					inputMode='text'
					className={styles.input}
					value={states.value}
					onChange={(e) => onChangeInput(e.target.value)}
					placeholder='Separate words with "Space", ex: Ali Mohammad Amir'
				/>
			</form>

			<div className={styles.tree}>
				{createDOM(states.tree)}
			</div>
		</div>
	);
}

export default App;
