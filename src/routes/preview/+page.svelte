<script lang="ts">
	import CornerstoneBankRates from '$lib/components/CornerstoneBankRates.svelte';
</script>

<svelte:head>
	<title>Preview</title>
	<meta name="description" content="Client script preview" />
</svelte:head>

<section>
	<h1>Preview of the fetched content.</h1>

	<CornerstoneBankRates />
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}
</style>
