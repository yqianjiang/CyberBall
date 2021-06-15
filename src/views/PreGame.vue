<template>
	<div class="game-page">
		<h1>CyberBall</h1>
		<div class="pre-begin-page">
			<div class="input-name-wrap">
				<label for="input-name">昵称：</label>
				<input
					type="text"
					placeholder="请输入昵称"
					id="input-name"
					v-model="playerName"
				/>
			</div>
			<div>
				<PlayerImg ref="player00" :style="playerStyle" />
			</div>
			<div class="input-color-wrap">
				<div class="row">
					<label for="input-hue">色调：</label>
					<input
						class="color-bar"
						type="range"
						max="360"
						id="input-hue"
						v-model="playerHue"
					/>
				</div>
				<div class="row">
					<label for="input-gray">灰度：</label>
					<input
						class="color-bar"
						type="range"
						id="input-gray"
						v-model="playerGray"
					/>
				</div>
			</div>
			<label class="row">
				请选择玩家数量：
				<input type="number" v-model="playerNumInput" min="3" max="9" />
			</label>
			<div>
				<input type="checkbox" id="cbox1" v-model="isStore" />
				<label for="cbox1">记住我的选项</label>
			</div>
			<div>
				<button @click="onSummit">开始游戏</button>
			</div>
		</div>

		<div id="menu-btn">
			<NavButton destination="/" text="返回" />
		</div>
	</div>
</template>

<script>
import NavButton from "../components/NavButton.vue";
import PlayerImg from "../components/PlayerImg.vue";
export default {
	components: {
		PlayerImg,
		NavButton,
	},
	data() {
		return {
			playerName: "player",
			playerHue: 180,
			playerGray: 0,
			playerNumInput: 4,
			playerNum: 4,
			isStore: false,
		};
	},
	computed: {
		playerStyle() {
			return `filter: sepia(1) saturate(20) hue-rotate(${this.playerHue}deg) grayscale(${this.playerGray}%)`;
		},
	},
	methods: {
		saveConfigs() {
			this.$store.commit("setLocalStorage", this.isStore);
			this.$store.commit("setPlayerName", this.playerName);
			this.$store.commit("setPlayerHue", this.playerHue);
			this.$store.commit("setPlayerGray", this.playerGray);
			this.$store.commit("setPlayerNum", this.playerNum);
		},
		loadConfigs() {
			this.isStore = this.$store.getters.isSave;
			this.playerName = this.$store.getters.playerName || this.playerName;
			this.playerHue = this.$store.getters.playerHue || this.playerHue;
			this.playerGray = this.$store.getters.playerGray || this.playerGray;
			this.playerNumInput = this.$store.getters.playerNum || this.playerNum;
			this.playerNum = this.playerNumInput;
		},
		checkNameInput() {
			let name = this.playerName;
			if (!name) {
				alert("请输入昵称！");
				return true;
			} else if (name.length > 10) {
				alert("名字太长了！");
				return true;
			}
		},
		checkPlayerNum() {
			const num = this.playerNumInput;
			if (num > 9 || num < 3 || num % 1 !== 0) {
				alert("请输入3-9之间的整数！");
				this.playerNumInput = this.playerNum;
				return false;
			} else {
				this.playerNum = this.playerNumInput;
				return true;
			}
		},
		onSummit() {
			if (!this.checkNameInput() && this.checkPlayerNum()) {
				this.saveConfigs();
				this.$router.push("/game");
			}
		},
	},
	mounted() {
		this.loadConfigs();
	},
	updated() {
		if (this.playerNum !== this.playerNumInput && this.playerNumInput) {
			this.checkPlayerNum();
		}
	},
};
</script>

<style scoped>
#input-name {
	width: 5rem;
	font-size: smaller;
}

.pre-begin-page {
	display: flex;
	flex-direction: column;
	row-gap: 2rem;
}
</style>
