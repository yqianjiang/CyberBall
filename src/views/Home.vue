<template>
	<div class="start-page">
		<img class="ball-ani" src="../images/ball.png" />
		<div class="menu">
			<h1>CyberBall</h1>
			<NavButton destination="/game" text="快速开始" />
			<NavButton destination="/ready" text="游戏选项" />
		</div>
		<img class="ball-ani" src="../images/ball.png" />
	</div>
</template>

<script>
import NavButton from "../components/NavButton.vue";
export default {
	name: "Home",
	components: {
		NavButton,
	},
};
</script>

<style scoped>
.start-page {
	width: 100%;
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	grid-template-rows: 1fr;
	justify-items: center;
	align-items: center;
	text-align: center;
	font-size: larger;
}
.menu {
	display: grid;
	grid-column: 2;
	justify-items: center;
	grid-gap: 5vh;
}
.ball-ani {
	width: 3rem;
	animation-duration: 0.6s;
	animation-name: my-frame;
	animation-iteration-count: infinite;
	animation-direction: alternate;
}
@keyframes my-frame {
	50% {
		transform: translate(0, -4rem) rotate(180deg);
	}
	to {
		transform: translate(0, -4rem) rotate(-50deg);
	}
}
</style>
