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
					:title="`分数：${score.playerCounts[idx]}`"
					@moveBall="onThrowBall(idx)"
					@playerLoaded="idx===0?throwBall(0, 0):null"
				/>
			</div>
		</div>

		<Ball :posx="ball.pos[0]" :posy="ball.pos[1]" :moveDur="ball.moveDur" />

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
import Utils from "../utils/index.js";

const fontSize = 16;
const BALL_DX = 67;
const BALL_DY = 5;
const AI_DELAY_T = 2000;
const cacheVals = {
	playerPos: {},
};

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
				pos: [-10, -10],
				moveDur: 0,
				owner: undefined,
			},
		};
	},
	computed: {
		scoreRank() {
			const [first, second, third] = Utils.getTopIdx(this.score.playerCounts);
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
				if (Utils.playerLayout.modeMap[this.player.num].includes(i)) {
					return `grid-area: ${Utils.playerLayout.rect.mode2[i]}`;
				} else {
					return `grid-area: ${Utils.playerLayout.rect.mode1[i]}`;
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
			this.player.name[0] =
				this.$store.getters.playerName || this.player.name[0];
			this.player.hue = this.$store.getters.playerHue || this.player.hue;
			this.player.gray = this.$store.getters.playerGray || this.player.gray;
			this.player.num = this.$store.getters.playerNum || this.player.num;
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
					// 暂停游戏（暂停球的移动）
					cacheVals.playerPos = {};       // 清除缓存值（playerPos改变了）
					this.updateBallPosOnResize();   // TODO: 防抖
					// 继续游戏
				},
				false
			);
		},

		// player相关
		onPlayerTurn(e) {
			// 根据鼠标位置的x坐标，让人物控制的玩家转向跟随鼠标
			const x = e.clientX;
			// 未来扩展：让其他player也可以转身，但是这样还要设置他们的this.player.turnDur
			for (const idx of [0]) {
				const turnLeft = this.setPlayerDirection(x, idx);
				if (turnLeft === -1) break;

				// 当转身的player拥有球时，移动球
				if (this.ball.owner == idx) {
					const dx = turnLeft ? -BALL_DX : BALL_DX;
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
			const turnLeft = x < this.player.refs[idx].offsetLeft;
			if (turnLeft == this.player.isLeftWard[idx]) return -1;
			this.player.isLeftWard[idx] = turnLeft;
			return turnLeft;
		},
		getPlayerPos(idx) {
			// 优先读取缓存值
			if (cacheVals.playerPos[idx]) {
				return cacheVals.playerPos[idx];
			}
			// 发生过变化，获取最新的值
			const receptor = this.player.refs[idx];
			if (!receptor) {
				console.log("reference error!");
				return [undefined, undefined];
			}
			let x = receptor.getClientRects()[0]?.left;
			let y = receptor.getClientRects()[0]?.top;
			if (x !== undefined && y !== undefined) {
				cacheVals.playerPos[idx] = [x, y];  // 缓存起来
			}
			return [x, y];
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
			return Utils.getRandomIdx(preferenceMatrix[ballOwnerIdx]);
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
			const receptorId = this.getReceptorId(this.ball.owner);
			await Utils.sleep(AI_DELAY_T);
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
			const posX = (playerX + dx) / (window.innerWidth / 100);
			const posY = (playerY - BALL_DY) / fontSize;
			this.ball.pos = [posX, posY];
		},
		resetBallPos() {
			// 初始化球的位置：在中间
			this.ball.pos = [
				50 - 32 / 2 / (window.innerWidth / 100),
				(window.innerHeight - 32) / fontSize / 2,
			];
		},
		updateBallPosOnResize() {
			// 根据窗口变化更新球的位置
			this.ball.moveDur = 0;
			if (!this.ball.owner) {
				this.resetBallPos();
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
