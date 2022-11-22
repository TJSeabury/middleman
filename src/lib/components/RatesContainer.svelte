<script lang="ts">
	import type { RatesMatrix } from '$lib/typesAndInterfaces';
	import RatesTable from './RatesTable.svelte';

	export let title: string;
	export let disclaimerText: string;
	export let externalLinkUrl: string;
	export let externalLinkText: string;
	let date = new Date().toLocaleString('en-US', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		timeZone: 'America/New_York'
	});

	export let ratesTables: RatesMatrix[];
</script>

<div class="panel widgetContainer rates-container">
	<header class="panel-heading widgetHeader">
		<h1 class="widgetHeaderTitle">{title}</h1>
		<p class="widgetDate ">{date}</p>
	</header>

	<div class="panel-body widgetContainerBody">
		{#each ratesTables as table}
			<RatesTable data={table} />
		{/each}

		<p class="disclaimer ">
			{disclaimerText}
		</p>
		<a
			class="btn btn-block externalLink  "
			href={externalLinkUrl}
			target="_blank"
			rel="noreferrer"
			role="button"
		>
			{externalLinkText}
		</a>
	</div>
</div>

<style>
	:root {
		--cornerstonebank-red: #4d0e08;
		--cornerstonebank-blue: #003b71;
	}
	.rates-container {
		position: relative;
	}
	.panel.widgetContainer {
		width: 100% !important;
	}

	.panel-body.widgetContainerBody {
		display: flex;
		flex-wrap: wrap;
		width: 100%;
	}

	.panel-heading.widgetHeader {
		background-color: rgb(77, 14, 8);
		color: rgb(0, 0, 0);
	}
	.widgetHeaderTitle {
		color: rgb(255, 255, 255);
	}

	.panel.innerContainer {
		width: fit-content;
		padding: 1rem;
	}

	.widgetDate {
		display: block;
		width: 100%;
		margin: 16px;
	}

	.innerHeadingTitle_small {
		background-color: var(--cornerstonebank-blue);
		color: white;
		padding: 0.25rem 1rem;
	}

	.table .headerRow {
		background-color: #ddd;
	}
	.table tr:nth-child(2n) {
		background-color: #ddd;
	}
	.table tr:not(:last-child) {
		border-bottom: 1px solid var(--border-color);
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

	a.ng-binding {
		color: var(--cornerstonebank-red);
	}

	.disclaimer {
		margin: 16px;
	}

	.btn.btn-block.externalLink {
		background-color: var(--cornerstonebank-red);
		color: rgb(255, 255, 255);
		border: var(--cornerstonebank-red);
		padding: 1rem 2rem;
		font-size: 1.2rem;
		text-decoration: none;
		cursor: pointer;
	}
</style>
