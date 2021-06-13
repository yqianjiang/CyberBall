import { createStore } from "vuex";

var storage = require("store");

function _localStorageWrite(varName, value, isSave) {
	if (isSave && value) {
		storage.set(`CyberBall:${varName}`, value);
		console.log(`存储成功！值为${_localStorageRead(varName)}`)
	}
}

function _localStorageRead(varName) {
	return storage.get(`CyberBall:${varName}`);
}

function _sessionStorageWrite(varName, value) {
	if (value) {
		sessionStorage.setItem(`CyberBall:${varName}`, value);
	}
}

function _sessionStorageRead(varName) {
	return sessionStorage.getItem(`CyberBall:${varName}`);
}


const store = createStore({
	state() {
		return {
			playerNum: undefined,
			playerName: undefined,
			playerHue: undefined,
			playerGray: undefined,
			isSave: false,
		};
	},

	getters: {
		isSave(state) {
			return state.isSave || _sessionStorageRead(`isSave`);
		},
		
		playerNum(state) {
			return state.playerNum || _sessionStorageRead(`playerNum`) || _localStorageRead(`playerNum`);
		},

		playerName(state) {
			return state.playerName || _sessionStorageRead(`playerName`) || _localStorageRead(`playerName`);
		},

		playerHue(state) {
			return state.playerHue || _sessionStorageRead(`playerHue`) || _localStorageRead(`playerHue`);
		},

		playerGray(state) {
			return state.playerGray || _sessionStorageRead(`playerGray`) || _localStorageRead(`playerGray`);
		},
	},

	mutations: {
		setLocalStorage(state, value) {
			state.isSave = value;
			_sessionStorageWrite(`isSave`, value);
		},
		setPlayerNum(state, value) {
			state.playerNum = value;
			_sessionStorageWrite(`playerNum`, value);
			_localStorageWrite(`playerNum`, value, state.isSave);
		},
		setPlayerName(state, value) {
			state.playerName = value;
			_sessionStorageWrite(`playerName`, value);
			_localStorageWrite(`playerName`, value, state.isSave);
		},
		setPlayerHue(state, value) {
			state.playerHue = value;
			_sessionStorageWrite(`playerHue`, value);
			_localStorageWrite(`playerHue`, value, state.isSave);
		},
		setPlayerGray(state, value) {
			state.playerGray = value;
			_sessionStorageWrite(`playerGray`, value);
			_localStorageWrite(`playerGray`, value, state.isSave);
		},
	},
});

export default store;
