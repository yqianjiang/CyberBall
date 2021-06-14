<template>
	<div class="score-board">
		<p>目前球数：{{ throwNum }}</p>
		<p>排行榜：</p>
		<ol>
			<li>
				<div class="grid-row">
					<div>{{ score[0].player }}</div>
					<div>{{ score[0].value }}</div>
				</div>
			</li>
			<li>
				<div class="grid-row">
					<div>{{ score[1].player }}</div>
					<div>{{ score[1].value }}</div>
				</div>
			</li>
			<li>
				<div class="grid-row">
					<div>{{ score[2].player }}</div>
					<div>{{ score[2].value }}</div>
				</div>
			</li>
		</ol>
	</div>
</template>

<script>
export default {
	props: {
		throwNum: Number,
		score: Array,
	},
};
</script>

<style>
.score-board {
	position: absolute;
	width: 12rem;
	height: 20rem;
	text-align: left;
}

.grid-row {
	display: grid;
	grid-template-columns: 1fr 1fr;
}
</style>
