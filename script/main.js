// rem
let fontSize = 16;
const BALL_DX = 67;
const BALL_DY = 5;
const AI_DELAY_T = 1500;

const MyGame = {
	data() {
		return {
			// 控制刚加载页面时，各子页面的显示/隐藏
			isShow: {
				pre: true,
				next: false,
				main: false,
				menu: false,
			},
			player: {
				num: 4,
				numInput: 4,
				turnDur: 0.5,
				filter: "sepia(1) saturate(20)",
				hue: 180,
				gray: 0,
				name: ["", "1", "2", 3, 4, 5, 6, 7, "8"],
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
			},
			ball: {
				pos: [0, 0],
				moveDur: 0,
				owner: 1,
				receptor: 1,
			},
		};
	},
	computed: {
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
		ballStyle() {
			return `transform:translate(${this.ball.pos[0]}vw, ${this.ball.pos[1]}rem); transition: ${this.ball.moveDur}s linear`;
		},
		gridArea() {
			const getGridArea = (i) => {
				if (this.player.modeMap[this.player.num].includes(i)) {
					return `grid-area: ${this.player.rect.mode2[i]}`;
				} else {
					return `grid-area: ${this.player.rect.mode1[i]}`;
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
		setPlayerRef(refItem) {
			if (refItem) {
				this.player.refs.push(refItem);
			}
		},
		checkPlayerNum() {
			if (this.player.numInput in this.player.modeMap) {
				this.player.num = this.player.numInput;
				this.reactiveBallPos();
			} else if (this.player.numInput !== "") {
				alert("请输入3-9之间的数值！");
				this.player.numInput = this.player.num;
			}
		},
		checkNameInput() {
			let name = this.player.name[0];
			if (!name) {
				alert("请输入昵称！");
				return true;
			} else if (name.length > 10) {
				alert("名字太长了！");
				return true;
			}
		},
		togglePage(pre, next) {
			[this.isShow[pre], this.isShow[next]] = [
				this.isShow[next],
				this.isShow[pre],
			];
		},
		enterGame() {
			this.togglePage("next", "main");
			this.delayMoveBall(0);
		},
		goNextPage() {
			if (!this.checkNameInput()) {
				this.togglePage("pre", "next");
				this.delayMoveBall(0);
			}
		},
		openMenu() {
			if (this.isShow.pre) {
				location = "index.html";
			}
			if (this.isShow.next) {
				this.togglePage("pre", "next");
				this.initPlayer00();
			}
			if (this.isShow.main) {
				this.togglePage("main", "next");
				this.delayMoveBall(0);
			}
		},
		initPlayer00() {
			this.$nextTick(() => {
				this.player.refs = [];
				this.player.refs.push(this.$refs.player00);
				this.delayMoveBall("00");
			});
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
					for (let j=0; j<n; j++){
						if (i == j) {
							matrix[i].push(0)
						} else {
							matrix[i].push(1 / (n - 1))
						}
					}
				}
				return matrix;
			})(this.player.num);

			// [step2]根据概率判断。第i名玩家的选择概率为 preferenceMatrix[i]
			// 每人获得一个随机数，再乘以每人的概率，对比谁比较大
			drawProb = preferenceMatrix[this.ball.owner - 1].map(
				x => x * Math.random()
			);
			receptorId = drawProb.indexOf(Math.max(...drawProb));
			return receptorId;
		},
		async aiMoveBall() {
			if (!this.isShow.main) return "ai not active";
			let receptorId = this.chooseBallReceptor();
			await new Promise((resolve) => {
				setTimeout(() => {
					resolve();
				}, AI_DELAY_T);
			});
			this.moveBall(receptorId);
		},
		userMoveBall(idx) {
			// 只有当[用户持有球]且[处于游戏界面]的时候，按钮才起效果
			if (this.ball.owner == 1 && this.isShow.main) {
				this.moveBall(idx);
			}
		},
		reactiveBallPos() {
			this.$nextTick(() => {
				// 从自身移动到自身，不改变ball owner的值
				let dx = BALL_DX;
				if (this.player.isLeftWard[this.ball.owner - 1]) {
					dx = 0;
				}
				this.ball.moveDur = 0;
				this.ball.pos = this.getTargetPos(dx);
			});
		},
		delayMoveBall(receptorId, ballMoveDur = 0) {
			this.moveBall(receptorId, ballMoveDur);
			this.reactiveBallPos();
		},
		moveBall(receptorId = 0, ballMoveDur = 0.5) {
			// 设置移动参数
			let dx = BALL_DX;
			if (this.player.isLeftWard[receptorId]) {
				dx = 0;
			}
			this.ball.moveDur = ballMoveDur;
			if (receptorId === "00") {
				this.ball.receptor = 0;
			} else {
				this.ball.receptor = receptorId + 1;
			}
			// 移动
			if (this.ball.receptor == this.ball.owner)
				return "don't need to move the ball";
			this.ball.pos = this.getTargetPos(dx);
			this.ball.owner = this.ball.receptor;

			// 如果球到其他玩家手中，执行一个判断...
			if (this.ball.owner > 1) {
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

		playerTurn(e) {
			// 挂在"players-wrap"中，根据鼠标位置的x坐标，让人物控制的玩家转向跟随鼠标
			const x = e.clientX;
			x < this.player.refs[1].offsetLeft
				? (direction = "left")
				: (direction = "right");
			const turnLeft = direction == "left";
			if (turnLeft == this.player.isLeftWard[0]) return -1;
			this.player.isLeftWard[0] = turnLeft;
			// this.player.isLeftWard[3] = turnLeft;

			if (this.ball.owner !== 1) return -1;
			// 移动球
			const moveBall = (dx) => {
				this.ball.pos[0] += dx / (window.innerWidth / 100);
			};

			this.ball.moveDur = this.player.turnDur;
			if (turnLeft) moveBall(-BALL_DX);
			else moveBall(BALL_DX);
		},
	},

	updated() {
		if (this.player.num != this.player.numInput) {
			this.checkPlayerNum();
		}
		while (this.player.refs.length > parseInt(this.player.num) + 1) {
			this.player.refs.splice(0, 1);
		}
	},

	mounted() {
		this.initPlayer00();

		// Safari的filter+transition有问题，取消player_turn的动画
		if (navigator.userAgent.includes("AppleWebKit/6")) {
			this.player.turnDur = 0;
		}
	},
};

myGame = Vue.createApp(MyGame).mount("#game-page");

// 球的位置响应式：当窗口大小改变时，重新获取一下球的位置
window.addEventListener(
	"resize",
	() => {
		myGame.reactiveBallPos();
	},
	false
);
