<script lang="ts">
	export let color: string;
	export let size: string;
</script>

<figure class="spinner" style="--color:{color};--size:{size};">
	<div class="spinner-container">
		<div class="spinner-outer" />
		<div class="spinner-inner" />
	</div>
</figure>

<style>
	.spinner {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		margin: 0;
		padding: 8px;
		box-sizing: border-box;
	}
	.spinner-container {
		position: relative;
		width: var(--size);
		height: var(--size);
		margin: 0;
	}
	.spinner-outer,
	.spinner-inner {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 100%;
		height: 100%;
		border-radius: 100%;
		border: calc(var(--size) / 8) solid var(--color);
		transform: translate(-50%, -50%) rotate(0);
	}
	@keyframes rotate {
		100% {
			transform: translate(-50%, -50%) rotate(360deg);
		}
	}
	.spinner-outer {
		border-left-color: transparent;
		border-bottom-color: transparent;
		animation: 2s linear infinite rotate;
		animation-fill-mode: forwards;
		animation-play-state: running;
	}
	.spinner-inner {
		width: 69%;
		height: 69%;
		border-top-color: transparent;
		border-right-color: transparent;
		animation: 1.5s linear infinite rotate;
		animation-fill-mode: forwards;
		animation-play-state: running;
		animation-direction: reverse;
	}
</style>
