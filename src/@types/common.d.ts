type TreeChildObject = { index: number; value: string };

type TreeChildType = (TreeChildObject | TreeChildType)[];

type PositionType = [number, number];

type TreeChildConfigType = {
	position: [number, number];
	level: number;
	index: number;
	left: boolean;
	value: string;
}