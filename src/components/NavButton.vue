<template>
	<button @click="goTo">{{ text }}</button>
</template>

<script>
export default {
	name: "NavButton",
	props: {
		text: String,
		destination: String,
	},
	methods: {
		goTo() {
			this.$router.push(this.destination);
		},
	},
};
</script>

<style></style>
