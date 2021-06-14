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
					@moveBall="onThrowBall(idx)"
				/>
			</div>
		</div>

		<Ball :style="ballStyle" />

		<ScoreBoard :throwNum="score.throwCounts" :score="SortedScore" />

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

let fontSize = 16;
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

export default {
	components: {
		Player,
		Ball,
		NavButton,
		ScoreBoard,
	},
	data() {
		return {
			score: {
				throwCounts: 0,
				playerCounts: [],
			},
			ball: {
				pos: [0, 0],
				moveDur: 0,
				owner: undefined,
			},
			player: {
				num: 4,
				numInput: 4,
				turnDur: 0,
				filter: "sepia(1) saturate(20)",
				hue: 180,
				gray: 0,
				name: ["", "1", "2", "3", "4", "5", "6", "7", "8"],
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
		};
	},
	computed: {
		ballStyle() {
			return `transform:translate(${this.ball.pos[0]}vw, ${this.ball.pos[1]}rem); transition: ${this.ball.moveDur}s linear`;
		},
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
		SortedScore() {
			const result = [
				{ player: undefined, value: 0 },
				{ player: undefined, value: 0 },
				{ player: undefined, value: 0 },
			];
			result[0].player = this.player.name[0];
			result[1].player = this.player.name[1];
			result[2].player = this.player.name[2];
			return result;
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
		// player相关
		setPlayerRef(refItem) {
			if (refItem) {
				this.player.refs.push(refItem.$el.childNodes[0]);
			}
		},
		setPlayerDirection(x, idx){
			let turnLeft;
			if (!this.player.refs[idx]?.offsetLeft) return -1;
			x < this.player.refs[idx].offsetLeft
				? (turnLeft = true)
				: (turnLeft = false);
			if (turnLeft == this.player.isLeftWard[idx]) return -1;
			this.player.isLeftWard[idx] = turnLeft;
			return turnLeft
		},
		onPlayerTurn(e) {
			// 根据鼠标位置的x坐标，让人物控制的玩家转向跟随鼠标
			const x = e.clientX;
			let dx;
			let turnLeft;
			// 未来扩展：让其他player也可以转身，但是这样还要设置他们的this.player.turnDur
			for (let idx of [0]){
				turnLeft = this.setPlayerDirection(x, idx);
	
				// 当转身的player拥有球时，移动球
				if (this.ball.owner == idx) {
					turnLeft ? (dx = -BALL_DX) : (dx = BALL_DX);
					this.shiftBallPos(dx, this.player.turnDur);
				}
			}
		},
		getPlayerPos(idx) {
			const receptor = this.player.refs[idx];
			if (!receptor) {
				console.log("reference error!");
				return [undefined, undefined];
			}
			return [receptor.offsetLeft, receptor.offsetTop];
		},
		getBallDx(idx) {
			let dx = BALL_DX;
			if (this.player.isLeftWard[idx]) {
				dx = 0;
			}
			return dx;
		},

		// ball相关
		shiftBallPos(dx, moveDur) {
			// 根据dx值平移球的位置
			this.ball.moveDur = moveDur;
			this.ball.pos[0] += dx / (window.innerWidth / 100);
		},
		getBallReceptorId() {
			// 根据当前的ball.owner，返回目标的ball.receptor的id。
			let receptorId = -1;
			let drawProb = [];

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
			// 每人获得一个随机数，再乘以每人的概率，对比谁比较大
			drawProb = preferenceMatrix[this.ball.owner].map(
				(x) => x * Math.random()
			);
			receptorId = drawProb.indexOf(Math.max(...drawProb));
			return receptorId;
		},
		async aiThrowBall() {
			let receptorId = this.getBallReceptorId();
			await new Promise((resolve) => {
				setTimeout(() => {
					resolve();
				}, AI_DELAY_T);
			});
			this.throwBall(receptorId);
		},
		onThrowBall(idx) {
			// 只有当[用户持有球]的时候，按钮才起效果
			if (this.ball.owner == 0) {
				this.throwBall(idx);
			}
		},
		throwBall(receptorId = 0, ballMoveDur = 0.5) {
			// 把球从一个玩家扔到另一个玩家手中
			this.ball.moveDur = ballMoveDur;
			if (receptorId == this.ball.owner) return "don't need to move the ball";
			this.setBallPos(receptorId);
			this.ball.owner = receptorId;

			// 如果球到其他玩家手中，执行一个判断...
			if (this.ball.owner > 0) {
				this.aiThrowBall();
			}
		},
		initBallPos() {
			// 初始化球的位置：在中间
			this.ball.pos = [
				50 - 32 / 2 / (window.innerWidth / 100),
				(window.innerHeight - 32) / fontSize / 2,
			];
		},
		// async delayUpdateBallPos(){
		// 	for (let i = 0; i < 3; i++) {
		// 		await new Promise((resolve) => {
		// 			setTimeout(() => {
		// 				resolve();
		// 			}, 50);
		// 		});
		// 		this.updateBallPos();
		// 	}
		// },
		updateBallPos() {
			// 根据窗口变化更新球的位置
			this.ball.moveDur = 0;
			if (!this.ball.owner) {
				this.initBallPos();
			}
			this.setBallPos(this.ball.owner);
		},
		setBallPos(receptorId) {
			// 根据新的player的坐标设置球的位置
			const dx = this.getBallDx(receptorId);
			const [playerX, playerY] = this.getPlayerPos[receptorId];
			if (!playerX || !playerY) return;
			// 设置球相对于player的位置
			let posX = (playerX + dx) / (window.innerWidth / 100);
			let posY = (playerY - BALL_DY) / fontSize;
			this.ball.pos = [posX, posY];
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
	},
	mounted() {
		this.loadConfigs();
		this.initBallPos();
		this.watchWindowResize();
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
