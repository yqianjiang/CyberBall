<template>
	<router-view></router-view>
</template>

<script>
export default {
	name: "App",
};
</script>

<style>
#menu-btn {
	position: absolute;
	top: 8px;
	right: 8px;
}

#menu-btn > button {
	width: 4rem;
	font-size: 0.8rem;
}

/* 通用样式 */
.row {
	display: flex;
	align-items: flex-end;
	justify-content: center;
}

button {
	height: 2rem;
	width: 8rem;
	font-size: 1rem;
	background: #fff;
	outline: none;
	border: 1px solid #aaa;
	border-radius: 8px;
}
button:hover {
	cursor: pointer;
	background-color: #eee;
}
input {
	border-radius: 8px;
	outline: none;
	border: 1px solid #aaa;
	padding: 4px 8px;
}

/* 包裹游戏页面中的主要内容 */
.game-page {
	width: 100%;
	display: grid;
	grid-template-rows: 1fr 2fr 0.4fr;
	justify-items: center;
	align-items: center;
	text-align: center;
}

/* 页面的共同设置 */
.main-page,
.pre-begin-page {
	width: inherit;
	height: 100%;
}
</style>
