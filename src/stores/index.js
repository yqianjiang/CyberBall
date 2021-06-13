import { createStore } from "vuex";

const store = createStore({
	state() {
		return {
			playerNum: 4,
			playerName: "",
			playerHue: 180,
			playerGray: 0,
		};
	},

	mutations: {
		setPlayerNum(state, value) {
			state.playerNum = value;
		},
		setPlayerName(state, value) {
			state.playerName = value;
		},
		setPlayerHue(state, value) {
			state.playerHue = value;
		},
		setPlayerGray(state, value) {
			state.playerGray = value;
		},
	},
});

export default store;
