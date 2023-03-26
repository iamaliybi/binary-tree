export const toTree = (list: string[], index = 0) => {
	const first = list[(2 * index) + 1];
	const seconds = list[(2 * index) + 2];

	const currentChild: TreeChildType = [{
		index: index,
		value: list[index]
	}];

	if (first) currentChild.push(toTree(list, (2 * index) + 1))
	if (seconds) currentChild.push(toTree(list, (2 * index) + 2))

	return currentChild;
};

export const uniqueId = (length = 8) => {
	return parseInt(Math.ceil(Math.random() * Date.now()).toPrecision(length).toString().replace(".", ""))
}
