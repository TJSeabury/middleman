<script lang="ts">
	export let message: string;
	export let color: string;
</script>

<figure class="spinner" style="--color:{color};">
	<p>{message}</p>
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
		padding: 32px;
		box-sizing: border-box;
	}
	.spinner-container {
		position: relative;
		width: 64px;
		height: 64px;
		margin-top: 16px;
	}
	.spinner-outer,
	.spinner-inner {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 100%;
		height: 100%;
		border-radius: 100%;
		border: 8px solid var(--color);
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
