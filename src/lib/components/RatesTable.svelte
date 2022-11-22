<script lang="ts">
	import type { RatesMatrix } from '$lib/typesAndInterfaces';

	export let data: RatesMatrix;
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
						<td class="rate"><a role="button">{rate.rate}</a></td>
						<td class="points">{rate.points}</td>
						<!-- svelte-ignore a11y-missing-attribute -->
						<td class="apr"><a role="button">{rate.apr}</a></td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
