<script lang="ts">
	import { dev } from '$app/environment';
	import { wait } from '$lib/general';
	import Spinner from '$lib/components/Spinner.svelte';

	const host = !dev ? 'https://middleman.marketmentors.com' : 'http://localhost:5173';

	const apiRequest = async () => {
		const target =
			'https://consumer.optimalblue.com/FeaturedRates?GUID=b61565e4-69f1-4e5e-94cf-c9500181ed78';
		const url = `${host}/api/cornerstoneBankRates/?url=${target}`;
		const res = await fetch(url);
		if (res.status !== 200) return console.error('No node or response.');
		const data = await res.json();
		return data;
	};

	let APIRequest = apiRequest();
</script>

{#await APIRequest}
	<Spinner message="Please wait but a moment..." color="rgb(77, 14, 8)" />
	{#await wait(4000)}
		<span>This shouldn't take long.</span>
	{:then a}
		<span>Any second now...</span>
	{/await}
{:then rates}
	<div class="rates-container replacable">{@html rates}</div>
	<style>
		.panel.widgetContainer {
			width: 100% !important;
		}

		.panel-body.widgetContainerBody {
			display: flex;
			flex-wrap: wrap;
			width: 100%;
		}

		.panel.innerContainer {
			width: fit-content;
			padding: 1rem;
		}

		.widgetDate {
			display: block;
			width: 100%;
		}

		.innerHeadingTitle_small {
			background-color: var(--wp--preset--color--secondary);
			color: white;
			padding: 0.25rem 1rem;
		}

		.table.table-condensed.ratesTable {
			margin: 0 !important;
		}

		table.table.table-condensed.ratesTable td {
			min-width: 5vw;
			padding: 4px 12px;
			text-align: center;
		}

		.widgetHeaderTitle {
			padding: 1rem;
			font-size: 2rem;
		}

		.btn.btn-block.externalLink.ng-binding.ng-scope {
			background-color: rgb(77, 14, 8);
			color: rgb(255, 255, 255);
			border: rgb(77, 14, 8);
			padding: 1rem 2rem;
			font-size: 1.2rem;
			text-decoration: none;
		}
	</style>
{/await}
