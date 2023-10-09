<template>
	<div class="score-board">
		<p>目前球数：{{ throwNum }}</p>
		<p>排行榜：</p>
		<ol>
			<li v-for="i in 3" :key="i">
				<div class="score-row">
					<div>{{ score[i-1].player }}</div>
					<div>{{ score[i-1].value }}</div>
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
	text-align: left;
	top: 8px;
	left: 8px;
	background: rgba(255,255,255,0.6);
	padding: 8px;
	border-radius: 8px;
	border: 1px solid #bbb;
}

.score-row {
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-column-gap: 1rem;
}
</style>
