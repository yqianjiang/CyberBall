<template>
	<div class="game-page">
		<h1>CyberBall</h1>
		<div class="main-page">
			<div class="players-wrap" @mousemove="onPlayerTurn">
				<Player
					v-for="(position, idx) in gridArea"
					:key="idx"
					:ref="setPlayerRef"
					:style="position"
					:playerStyle="playerStyle[idx]"
					:playerName="player.name[idx]"
					:isLeftWard="player.isLeftWard[idx]"
					:title="score.playerCounts[idx]"
					@moveBall="onThrowBall(idx)"
				/>
			</div>
		</div>

		<Ball :style="ballStyle" />

		<ScoreBoard :throwNum="score.throwCounts" :score="scoreRank" />

		<div id="menu-btn">
			<NavButton destination="/" text="返回" />
		</div>
	</div>
</template>

<script>
import Player from "../components/Player.vue";
import Ball from "../components/Ball.vue";
import NavButton from "../components/NavButton.vue";
import ScoreBoard from "../components/ScoreBoard.vue";

const fontSize = 16;
const BALL_DX = 67;
const BALL_DY = 5;
const AI_DELAY_T = 1500;

const _playerLayout = {
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

const _getRandomIdx = (weightArr) => {
	// 输入带权重的数组，返回随机的元素。
	// 方法：数组中每个元素获得一个随机数，再乘以权重，对比谁比较大
	const drawProb = weightArr.map((x) => x * Math.random());
	return drawProb.indexOf(Math.max(...drawProb));
};

const _getTopIdx = (arr) => {
	let arrSort = [...arr]; // 用于排序
	let arrCopy = [...arr]; // 设置一个备份，避免修改原数组

	arrSort.sort((x1, x2) => x2 - x1);

	let first = arrCopy.indexOf(arrSort[0]);
	arrCopy[first] = undefined;
	let second = arrCopy.indexOf(arrSort[1]);
	arrCopy[second] = undefined;
	let third = arrCopy.indexOf(arrSort[2]);
	arrCopy[third] = undefined;
	return [first, second, third];
};

const _delayPromise = (delayTime) =>
	new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, delayTime);
	});

export default {
	components: {
		ScoreBoard,
		NavButton,
		Player,
		Ball,
	},
	data() {
		return {
			score: {
				throwCounts: 0,
				playerCounts: [0, 0, 0, 0, 0, 0, 0, 0, 0],
			},
			player: {
				num: 4,
				numInput: 4,
				turnDur: 0,
				filter: "sepia(1) saturate(20)",
				hue: 180,
				gray: 0,
				name: ["player", "player1", "player2", "player3", "player4", "player5", "player6", "player7", "player8"],
				isLeftWard: [
					false,
					false,
					true,
					false,
					true,
					true,
					false,
					true,
					false,
					true,
				],
				refs: [],
			},
			ball: {
				pos: [0, 0],
				moveDur: 0,
				owner: undefined,
			},
		};
	},
	computed: {
		scoreRank() {
			let [first, second, third] = _getTopIdx(this.score.playerCounts);
			return [
				{
					player: this.player.name[first],
					value: this.score.playerCounts[first],
				},
				{
					player: this.player.name[second],
					value: this.score.playerCounts[second],
				},
				{
					player: this.player.name[third],
					value: this.score.playerCounts[third],
				},
			];
		},

		// player相关
		playerStyle() {
			const getStyleStr = (hue, gray, turnDur) =>
				`filter: ${this.player.filter} hue-rotate(${hue}deg) grayscale(${gray}%); transition:${turnDur}s linear`;

			const newList = [
				getStyleStr(this.player.hue, this.player.gray, this.player.turnDur),
			];

			for (let i = 1; i < this.player.num; i++) {
				newList.push(getStyleStr(Math.random() * 360, Math.random() * 100, 0));
			}

			return newList;
		},
		gridArea() {
			const getGridArea = (i) => {
				if (_playerLayout.modeMap[this.player.num].includes(i)) {
					return `grid-area: ${_playerLayout.rect.mode2[i]}`;
				} else {
					return `grid-area: ${_playerLayout.rect.mode1[i]}`;
				}
			};

			const newList = [];
			for (let i = 0; i < this.player.num; i++) {
				newList.push(getGridArea(i));
			}
			return newList;
		},

		// ball相关
		ballStyle() {
			return `transform:translate(${this.ball.pos[0]}vw, ${this.ball.pos[1]}rem); transition: ${this.ball.moveDur}s linear`;
		},
	},
	methods: {
		loadConfigs() {
			this.player.name[0] =
				this.$store.getters.playerName || this.player.name[0];
			this.player.hue = this.$store.getters.playerHue || this.player.hue;
			this.player.gray = this.$store.getters.playerGray || this.player.gray;
			this.player.num = this.$store.getters.playerNum || this.player.num;
		},
		async gameStart() {
			await _delayPromise(500);
			let preferenceArr = [1, 1, 1, 1, 1, 1, 1, 1, 1].slice(0, this.player.num);
			let receptorId = _getRandomIdx(preferenceArr);
			this.throwBall(receptorId);
		},
		scoreCounter(idx) {
			this.score.throwCounts++;
			this.score.playerCounts[idx]++;
		},
		watchWindowResize() {
			//监听窗口大小的改变，以更新球的位置
			window.addEventListener(
				"resize",
				() => {
					this.updateBallPos();
				},
				false
			);
		},

		// player相关
		onPlayerTurn(e) {
			// 根据鼠标位置的x坐标，让人物控制的玩家转向跟随鼠标
			const x = e.clientX;
			let dx;
			let turnLeft;
			// 未来扩展：让其他player也可以转身，但是这样还要设置他们的this.player.turnDur
			for (let idx of [0]) {
				turnLeft = this.setPlayerDirection(x, idx);
				if (turnLeft === -1) break;

				// 当转身的player拥有球时，移动球
				if (this.ball.owner == idx) {
					dx = turnLeft ? -BALL_DX : BALL_DX;
					this.shiftBallPos(dx, this.player.turnDur);
				}
			}
		},
		setPlayerRef(refItem) {
			if (refItem) {
				this.player.refs.push(refItem.$el.childNodes[0]);
			}
		},
		setPlayerDirection(x, idx) {
			if (!this.player.refs[idx]?.offsetLeft) return -1;
			let turnLeft = x < this.player.refs[idx].offsetLeft;
			if (turnLeft == this.player.isLeftWard[idx]) return -1;
			this.player.isLeftWard[idx] = turnLeft;
			return turnLeft;
		},
		getPlayerPos(idx) {
			const receptor = this.player.refs[idx];
			if (!receptor) {
				console.log("reference error!");
				return [undefined, undefined];
			}
			return [receptor.offsetLeft, receptor.offsetTop];
		},
		getReceptorId(ballOwnerIdx) {
			// 根据当前的ball.owner，返回目标的ball.receptor的id。
			// [step1]初始化preferenceMatrix 【n*n】 (0,0) (0,1) ... 对角线为0，第0行表示从player出发的（可以忽略）
			const preferenceMatrix = ((n) => {
				const matrix = [];
				for (let i = 0; i < n; i++) {
					matrix.push([]);
					for (let j = 0; j < n; j++) {
						if (i == j) {
							matrix[i].push(0);
						} else {
							matrix[i].push(1 / (n - 1));
						}
					}
				}
				return matrix;
			})(this.player.num);

			// [step2]根据概率判断。第i名玩家的选择概率为 preferenceMatrix[i]
			return _getRandomIdx(preferenceMatrix[ballOwnerIdx]);
		},
		getBallDx(idx) {
			let dx = BALL_DX;
			if (this.player.isLeftWard[idx]) {
				dx = 0;
			}
			return dx;
		},

		// ball相关
		onThrowBall(idx) {
			// 只有当[用户持有球]的时候，按钮才起效果
			if (this.ball.owner == 0) {
				this.throwBall(idx);
			}
		},
		async aiThrowBall() {
			let receptorId = this.getReceptorId(this.ball.owner);
			await _delayPromise(AI_DELAY_T);
			this.throwBall(receptorId);
		},
		throwBall(receptorId = 0, ballMoveDur = 0.5) {
			// 把球从一个玩家扔到另一个玩家手中
			this.ball.moveDur = ballMoveDur;
			if (receptorId == this.ball.owner) return "don't need to move the ball";
			this.setBallPos(receptorId);
			this.ball.owner = receptorId;
			this.scoreCounter(receptorId);

			// 如果球到其他玩家手中，执行一个判断...
			if (this.ball.owner > 0) {
				this.aiThrowBall();
			}
		},
		setBallPos(receptorId) {
			// 根据新的player的坐标设置球的位置
			const dx = this.getBallDx(receptorId);
			const [playerX, playerY] = this.getPlayerPos(receptorId);
			if (!playerX || !playerY) return;
			// 设置球相对于player的位置
			let posX = (playerX + dx) / (window.innerWidth / 100);
			let posY = (playerY - BALL_DY) / fontSize;
			this.ball.pos = [posX, posY];
		},
		initBallPos() {
			// 初始化球的位置：在中间
			this.ball.pos = [
				50 - 32 / 2 / (window.innerWidth / 100),
				(window.innerHeight - 32) / fontSize / 2,
			];
		},
		updateBallPos() {
			// 根据窗口变化更新球的位置
			this.ball.moveDur = 0;
			if (!this.ball.owner) {
				this.initBallPos();
			}
			this.setBallPos(this.ball.owner);
		},
		shiftBallPos(dx, moveDur) {
			// 根据dx值平移球的位置
			this.ball.moveDur = moveDur;
			this.ball.pos[0] += dx / (window.innerWidth / 100);
		},
	},
	mounted() {
		this.loadConfigs();
		this.initBallPos();
		this.watchWindowResize();
		this.gameStart();
	},
	beforeUpdate() {
		this.player.refs = [];
	},
};
</script>

<style>
.players-wrap {
	display: grid;
	grid-template-columns: 1fr 1fr 1fr 1fr;
	grid-template-rows: 1fr 1fr 1fr;
	align-items: center;
}
</style>
