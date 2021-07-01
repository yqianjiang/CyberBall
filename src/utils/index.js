
const playerLayout = {
	rect: {
		mode1: [
			"3 / 2 / auto / 4",
			"2 / 1",
			"2 / 4",
			"1 / 2 / auto / 4",
			"3 / 3",
			"1 / 3",
			"1 / 1 / 3",
			"1 / 4 / 3",
			"3 / 1 / auto / 3",
		],
		mode2: [
			"3 / 2",
			"2 / 1 / 4",
			"2 / 4 / 4",
			"1 / 2",
			"3 / 3 / auto / 5",
			"1 / 4 / 3",
			"1 / 1 / 3",
			"1 / 4 / 3",
			"3 / 1 / auto / 3",
		],
	},
	modeMap: {
		3: [],
		4: [],
		5: [0],
		6: [0, 3],
		7: [0, 1, 2, 5],
		8: [0, 1, 2, 3],
		9: [1, 2, 3, 4],
	},
};

const getRandomIdx = (weightArr) => {
	// 输入带权重的数组，返回随机的元素。
	// 方法：数组中每个元素获得一个随机数，再乘以权重，对比谁比较大
	const drawProb = weightArr.map((x) => x * Math.random());
	return drawProb.indexOf(Math.max(...drawProb));
};

const getTopIdx = (arr) => {
	const arrSort = [...arr]; // 用于排序
	const arrCopy = [...arr]; // 设置一个备份，避免修改原数组

	arrSort.sort((x1, x2) => x2 - x1);

	const first = arrCopy.indexOf(arrSort[0]);
	arrCopy[first] = undefined;
	const second = arrCopy.indexOf(arrSort[1]);
	arrCopy[second] = undefined;
	const third = arrCopy.indexOf(arrSort[2]);
	arrCopy[third] = undefined;
	return [first, second, third];
};

const delayPromise = (delayTime) =>
	new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, delayTime);
	});


export default {
  playerLayout,
  getRandomIdx,
  getTopIdx,
  delayPromise,
}