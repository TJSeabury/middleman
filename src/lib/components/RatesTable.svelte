<script lang="ts">
	import type { Rates, RatesMatrix } from '$lib/typesAndInterfaces';

	export let data: RatesMatrix;

	const format = (n: number): string => {
		const formatter = new Intl.NumberFormat('en-US', {
			minimumFractionDigits: 3,
			maximumFractionDigits: 3
		});
		return `${formatter.format(n)}%`;
	};

	export let showDetails: (details: string) => void;

	function clickHandler(details: string): () => void {
		return () => showDetails(details);
	}
</script>

<div class="panel innerContainer">
	<div class="panel-heading innerContainerHeader">
		<div class="innerHeadingTitle_small">
			{data.title}
		</div>
	</div>
	<div class="panel-body innerContainerBody">
		<table class="table table-condensed ratesTable" style="width: 18.6em; color: rgb(0, 0, 0);">
			<thead>
				<tr class="headerRow">
					<th class="headerCell">Rate</th>
					<th class="headerCell">Points</th>
					<th class="headerCell">APR</th>
				</tr>
			</thead>
			<tbody>
				{#each data.rates as rate}
					<tr class="datarow">
						<!-- svelte-ignore a11y-missing-attribute -->
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<td class="rate"
							><a role="button" class="show-details" on:click={clickHandler(rate.details)}
								>{format(rate.rate)}</a
							></td
						>
						<td class="points">{format(rate.points)}</td>
						<!-- svelte-ignore a11y-missing-attribute -->
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<td class="apr"
							><a role="button" class="show-details" on:click={clickHandler(rate.details)}
								>{format(rate.apr)}</a
							></td
						>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<style>
	.panel.innerContainer {
		width: fit-content;
		padding: 1rem;
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

	a.show-details {
		color: var(--cornerstonebank-red);
		cursor: pointer;
		text-decoration: underline;
	}
</style>
