<script lang="ts" context="module">
	let visible: boolean = false;

	export function open() {
		visible = true;
	}

	export function close() {
		visible = false;
	}
</script>

<script lang="ts">
	import { fly } from 'svelte/transition';

	export let content: any;
</script>

{#if visible}
	<div id="details-pane" transition:fly={{ y: 100, duration: 500 }}>
		{content}
	</div>
{/if}

<style>
	.btn.btn-primary[type='button'] {
		background-color: var(--cornerstonebank-red);
		color: rgb(255, 255, 255);
		border: var(--cornerstonebank-red);
		padding: 1rem 2rem;
		font-size: 1.2rem;
		text-decoration: none;
		cursor: pointer;
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
		align-items: center;
		padding: 2rem;
		box-shadow: 0 0.25rem 1.25rem 0.25rem hsl(0deg 0% 0% / 30%);
	}
</style>
