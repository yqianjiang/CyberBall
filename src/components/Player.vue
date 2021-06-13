<template>
	<div>
		<PlayerImg
			:class="isLeftWard ? 'player-leftWard' : 'player-rightWard'"
			:style="playerStyle"
			@click="$emit('moveBall')"
		/>
		<p>{{ playerName }}</p>
	</div>
</template>

<script>
import PlayerImg from "./PlayerImg.vue";
export default {
	name: "Player",
	components: { PlayerImg },
	props: {
		isLeftWard: Boolean,
		playerStyle: String,
		playerName: String,
	},
	emits: ["moveBall"],
};
</script>

<style scoped>
.player-leftWard {
	transform: scale(-1, 1);
}

.player-rightWard {
	transform: scale(1, 1);
}
</style>
