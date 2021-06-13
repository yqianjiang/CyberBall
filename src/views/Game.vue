<template>
	<div class="game-page">
		<h1>CyberBall</h1>
		<div class="main-page">
			<div class="players-wrap" @mousemove="playerTurn">
				<Player
					v-for="(position, idx) in gridArea"
					:key="idx"
					:ref="setPlayerRef"
					:style="position"
					:playerStyle="playerStyle[idx]"
					:playerName="player.name[idx]"
					:isLeftWard="player.isLeftWard[idx]"
					@moveBall="userMoveBall(idx)"
				/>
			</div>
		</div>

		<Ball :style="ballStyle" />

		<div id="menu-btn">
			<NavButton destination="/" text="返回" />
		</div>
	</div>
</template>

<script>
import Player from "../components/Player.vue";
import Ball from "../components/Ball.vue";
import NavButton from "../components/NavButton.vue";

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
	},
	data() {
		return {
			ball: {
				pos: [0, 0],
				moveDur: 0,
				owner: 0,
				receptor: 0,
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
	},
	methods: {
		loadConfigs() {
			this.player.name[0] = this.$store.state.playerName;
			this.player.hue = this.$store.state.playerHue;
			this.player.gray = this.$store.state.playerGray;
			this.player.num = this.$store.state.playerNum;
		},

		// player相关
		setPlayerRef(refItem) {
			if (refItem) {
				this.player.refs.push(refItem.$el.childNodes[0]);
			}
		},
		playerTurn(e) {
			// 挂在"players-wrap"中，根据鼠标位置的x坐标，让人物控制的玩家转向跟随鼠标
			const x = e.clientX;
			let direction;
			if (!this.player.refs[0]?.offsetLeft) return -1;
			x < this.player.refs[0].offsetLeft
				? (direction = "left")
				: (direction = "right");
			const turnLeft = direction == "left";
			if (turnLeft == this.player.isLeftWard[0]) return -1;
			this.player.isLeftWard[0] = turnLeft;
			// this.player.isLeftWard[3] = turnLeft;

			if (this.ball.owner !== 0) return -1;
			// 移动球
			this.moveBallWithinPlayer(turnLeft);
		},

		// ball相关
		moveBallWithinPlayer(turnLeft) {
			const moveBall = (dx) => {
				this.ball.pos[0] += dx / (window.innerWidth / 100);
			};

			this.ball.moveDur = this.player.turnDur;
			if (turnLeft) moveBall(-BALL_DX);
			else moveBall(BALL_DX);
		},
		chooseBallReceptor() {
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
		async aiMoveBall() {
			let receptorId = this.chooseBallReceptor();
			await new Promise((resolve) => {
				setTimeout(() => {
					resolve();
				}, AI_DELAY_T);
			});
			this.moveBall(receptorId);
		},
		userMoveBall(idx) {
			// 只有当[用户持有球]的时候，按钮才起效果
			if (this.ball.owner == 0) {
				this.moveBall(idx);
			}
		},
		async initBallPos() {
			await new Promise((resolve) => {
				setTimeout(() => {
					resolve();
				}, 50);
			});
			this.reactiveBallPos();
		},
		reactiveBallPos() {
			this.$nextTick(() => {
				// 从自身移动到自身，不改变ball owner的值
				let dx = BALL_DX;
				if (this.player.isLeftWard[this.ball.owner]) {
					dx = 0;
				}
				this.ball.moveDur = 0;
				this.ball.pos = this.getTargetPos(dx);
			});
		},
		moveBall(receptorId = 0, ballMoveDur = 0.5) {
			// 设置移动参数
			let dx = BALL_DX;
			if (this.player.isLeftWard[receptorId]) {
				dx = 0;
			}
			this.ball.moveDur = ballMoveDur;
			this.ball.receptor = receptorId;
			// 移动
			if (this.ball.receptor == this.ball.owner)
				return "don't need to move the ball";
			this.ball.pos = this.getTargetPos(dx);
			this.ball.owner = this.ball.receptor;

			// 如果球到其他玩家手中，执行一个判断...
			if (this.ball.owner > 0) {
				this.aiMoveBall();
			}
		},
		getTargetPos(dx) {
			const ballReceptor = this.player.refs[this.ball.receptor];
			if (!ballReceptor) {
				console.log("reference error!");
				return this.ball.pos;
			}
			let posX = (ballReceptor.offsetLeft + dx) / (window.innerWidth / 100);
			let posY = (ballReceptor.offsetTop - BALL_DY) / fontSize;
			return [posX, posY];
		},
		watchWindowResize() {
			//球的位置响应式：当窗口大小改变时，重新获取一下球的位置
			window.addEventListener(
				"resize",
				() => {
					this.reactiveBallPos();
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

<style scoped>
.players-wrap {
	display: grid;
	grid-template-columns: 1fr 1fr 1fr 1fr;
	grid-template-rows: 1fr 1fr 1fr;
	align-items: center;
}
</style>
