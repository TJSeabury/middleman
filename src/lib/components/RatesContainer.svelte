<script lang="ts">
	import type { RatesMatrix } from '$lib/typesAndInterfaces';
	import RatesTable from './RatesTable.svelte';
	import RateDetails from './RateDetails.svelte';
	import type { SvelteComponent } from 'svelte';
	import { fly } from 'svelte/transition';
	import SimpleSpinner from './SimpleSpinner.svelte';

	export let title: string;
	export let ratesDate: string;
	export let disclaimerText: string;
	export let externalLinkUrl: string;
	export let externalLinkText: string;
	export let ratesTables: RatesMatrix[];
	export let revalidating: boolean;

	let rateDetails: string = '';
	let rateDetailsComponent: SvelteComponent;

	function showDetails(details: string): void {
		rateDetails = details;
		rateDetailsComponent.open();
	}
</script>

<div class="panel widgetContainer rates-container" transition:fly={{ y: 100, duration: 500 }}>
	<header class="panel-heading widgetHeader">
		<h1 class="widgetHeaderTitle">{title}</h1>
		<div class="widgetDate ">
			{ratesDate}
			{#if revalidating}
				<div class="revalidating-indicator">
					<SimpleSpinner size={'16px'} color={'#ffffff'} />
					<div style="min-width:max-content;color:white;">Checking for updated rates...</div>
				</div>
			{/if}
		</div>
	</header>

	<div class="panel-body widgetContainerBody">
		{#each ratesTables as table}
			<RatesTable data={table} {showDetails} />
		{/each}

		<p class="disclaimer ">
			{disclaimerText}
		</p>
		<a
			class="btn btn-block externalLink"
			href={externalLinkUrl}
			target="_blank"
			rel="noreferrer"
			role="button"
		>
			{externalLinkText}
		</a>
	</div>
	<RateDetails bind:this={rateDetailsComponent} content={rateDetails} />
</div>

<style lang="scss">
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
		display: flex;
		align-items: center;
		@media (max-width: 520px) {
			flex-direction: column;
			align-items: flex-start;
		}
		padding: 1rem;
		background-color: rgb(77, 14, 8);
		color: rgb(0, 0, 0);
	}
	.widgetHeaderTitle {
		width: 100%;
		margin: 0;
		font-size: clamp(1.5rem, 1vmin, 2rem);
		color: rgb(255, 255, 255);
	}

	.revalidating-indicator {
		display: flex;
		align-items: center;
	}

	.widgetDate {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-end;
		width: 100%;
		min-height: 4rem;
		margin: 0;
		padding: 0;
		color: white;
	}

	.disclaimer {
		margin: 0 0 32px 16px;
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
