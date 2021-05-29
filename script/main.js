// rem
let fontSize = 16;
const BALL_DX = 67;
const BALL_DY = 5;
const LOAD_DELAY = 10;

const delay = function delayCallFn(fn, delayTime) {
	return function (...args) {
		let timer = setTimeout(() => {
			fn(...args);
		}, delayTime);
	};
};

const MyGame = {
	data() {
		return {
			// 控制刚加载页面时，各子页面的显示/隐藏
			isShow: {
				pre: true,
				main: false,
				menu: false,
			},
			player: {
				name: "",
				isLeftWard: false,
				turnDur: 0.5,
				// [0]为当前玩家的初始值，后面是其他玩家的随机值
				filter: "sepia(1) saturate(20)",
				hue: 180,
				gray: 0,
			},
			ball: {
				pos: [0, 0],
				moveDur: 0,
				owner: "player0",
				receptor: "player0",
			},
		};
	},
	computed: {
		playerColor() {
			return [
				this.getPlayerColor(this.player.hue, this.player.gray),
				this.getPlayerColor(),
				this.getPlayerColor(),
			];
		},
		playerStyle() {
			return this.getPlayerColor(
				this.player.hue,
				this.player.gray,
				this.player.turnDur
			);
		},
		ballStyle() {
			return `transform:translate(${this.ball.pos[0]}vw, ${this.ball.pos[1]}rem); transition: ${this.ball.moveDur}s linear`;
		},
	},
	methods: {
		getPlayerColor(
			hue = Math.random() * 360,
			gray = Math.random() * 100,
			turnDur = 0
		) {
			return `filter: ${this.player.filter} hue-rotate(${hue}deg) grayscale(${gray}%); transition:${turnDur}s linear`;
		},
		checkInput() {
			let name = this.player.name;
			if (!name) {
				alert("请输入昵称！");
				return -1;
			} else if (name.length > 10) {
				alert("名字太长了！");
				return -1;
			}
		},
		togglePage(ballOwnerId) {
			this.isShow.pre = !this.isShow.pre;
			this.isShow.main = !this.isShow.main;
			if (this.isShow.main) {
				this.player.isLeftWard = false;
			}
			this.delayMoveBall(ballOwnerId);
		},
		enterGame() {
			// if(this.checkInput()) return 0;
			this.togglePage(0);
		},
		openMenu() {
			if (this.isShow.pre) {
				location = "index.html";
			}
			if (this.isShow.main) {
				// this.isShow.menu = true;
				this.togglePage("00");
			}
		},
		getTargetPos(dx) {
			let ballReceptor = this.$refs[this.ball.receptor];
			if (!ballReceptor) return this.ball.pos;
			let scalingSize = window.innerWidth / 100;
			let posX = (ballReceptor.offsetLeft + dx) / scalingSize;
			let posY = (ballReceptor.offsetTop - BALL_DY) / fontSize;
			return [posX, posY];
		},
		moveBall(receptorId = 0, ballMoveDur = 0.5, dx = BALL_DX) {
			// 设置移动参数
			this.ball.moveDur = ballMoveDur;
			this.ball.receptor = "player" + receptorId;
			// 移动
			if (this.ball.receptor == this.ball.owner) return -1;
			this.ball.pos = this.getTargetPos(dx);
			this.ball.owner = this.ball.receptor;
		},
		delayMoveBall(receptorId, ballMoveDur = 0) {
			let moveBall = delay(this.moveBall, LOAD_DELAY);
			moveBall(receptorId, ballMoveDur);
		},
		playerTurn(direction) {
			let turnLeft = direction == "left";
			if (turnLeft == this.player.isLeftWard) return -1;
			this.player.isLeftWard = turnLeft;

			if (this.ball.owner !== "player0") return -1;
			// 移动球
			const moveBall = (dx) => {
				this.ball.pos[0] += dx / (window.innerWidth / 100);
			};

			this.ball.moveDur = this.player.turnDur;
			if (turnLeft) moveBall(-BALL_DX);
			else moveBall(BALL_DX);
		},
	},

	mounted() {
		this.delayMoveBall("00");

		// Safari的filter+transition有问题，取消player_turn的动画
		if (navigator.userAgent.includes("AppleWebKit/6")) {
			this.player.turnDur = 0;
		}
	},
};

myGame = Vue.createApp(MyGame).mount("#game-page");
