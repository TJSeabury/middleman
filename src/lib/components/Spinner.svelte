<script lang="ts">
	import { wait } from '$lib/general';
	import { onMount } from 'svelte';

	export let message: string;
	export let color: string;
	export let comment: string;
	export let longWaitComment: string;

	let counter: number = 0;

	onMount(() => {
		let interval = setInterval(() => {
			counter += 10;
		}, 10);
	});
</script>

<figure class="spinner" style="--color:{color};">
	<p>{message}</p>
	<div class="spinner-container">
		<div class="spinner-outer" />
		<div class="spinner-inner" />
		<div class="spinner-counter">{(counter / 1000).toFixed(2)}</div>
	</div>
	{#await wait(6000)}
		<p>{comment}</p>
	{:then}
		<p>{longWaitComment}</p>
	{/await}
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
		margin: 16px 0;
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

	.spinner-counter {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 100%;
		height: 100%;
		transform: translate(-50%, -50%);
		display: flex;
		justify-content: center;
		align-items: center;
		font-family: monospace;
		opacity: 0.5;
	}
</style>
