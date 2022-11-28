<script lang="ts">
	import { fly, fade } from 'svelte/transition';

	let visible: boolean = false;

	export function open() {
		visible = true;
	}

	export function close() {
		visible = false;
	}

	export let content: any;
</script>

{#if visible}
	<div class="overlay" transition:fade={{ duration: 500 }} />
	<div id="details-pane" transition:fly={{ y: 100, duration: 400, delay: 300 }}>
		{@html content}
		<!-- svelte-ignore a11y-missing-attribute -->
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<a class="close-button" role="button" on:click={close}> Close </a>
	</div>
{/if}

<style>
	.close-button {
		background-color: var(--cornerstonebank-red);
		color: rgb(255, 255, 255);
		border: var(--cornerstonebank-red);
		padding: 1rem 2rem;
		font-size: 1.2rem;
		text-decoration: none;
		cursor: pointer;
	}

	.overlay {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: hsla(0, 0%, 100%, 0.85);
	}

	#details-pane {
		position: absolute;
		top: 10%;
		left: 50%;
		transform: translateX(-50%);
		width: clamp(250px, 50%, 640px);
		background: hsla(0, 0%, 100%, 0.88);
		display: flex;
		justify-content: center;
		align-items: flex-end;
		flex-direction: column;
		padding: 2rem;
		box-shadow: 0 0.25rem 1.25rem 0.25rem hsl(0deg 0% 0% / 30%);
	}
</style>
