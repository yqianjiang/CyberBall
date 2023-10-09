<template>
	<img class="ball" src="../images/ball.png" :style="ballStyle" />
</template>

<script>
export default {
	name: "Ball",
	props: {
		posx: Number,
		posy: Number,
		moveDur: Number,
	},
	computed: {
		ballStyle() {
			return `transform:translate(${this.posx}vw, ${this.posy}rem); transition: ${this.moveDur}s ease-out`;
		},
	}
};
</script>

<style>
.ball {
	position: absolute;
	top: 0;
	left: 0;
	width: 2rem;
}
</style>
