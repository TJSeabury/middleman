<script lang="ts">
	import { dev } from '$app/environment';
	import Spinner from '$lib/components/Spinner.svelte';
	import RatesContainer from './RatesContainer.svelte';
	import type { RatesMatrix } from '$lib/typesAndInterfaces';

	const host = !dev ? 'https://middleman.marketmentors.com' : 'http://localhost:5173';

	type Button = {
		url: string;
		text: string;
	};
	type RatesData = {
		title: string;
		ratesDate: string;
		tables: RatesMatrix[];
		disclaimer: string;
		button: Button;
	};

	const apiRequest = async (): Promise<RatesData> => {
		const target =
			'https://consumer.optimalblue.com/FeaturedRates?GUID=b61565e4-69f1-4e5e-94cf-c9500181ed78';
		const url = `${host}/api/cornerstonebank/rates/?url=${target}`;
		const res = await fetch(url);
		if (res.status !== 200) {
			console.error('No node or response.');
			throw new Error('No node or response.');
		}
		const data = await res.json();
		return data;
	};

	let APIRequest = apiRequest();
</script>

<div class="flex-container">
	<!-- <iframe
		src="https://consumer.optimalblue.com/FeaturedRates?GUID=b61565e4-69f1-4e5e-94cf-c9500181ed78"
		frameborder="0"
		title="data master"
	/> -->
	{#await APIRequest}
		<Spinner
			message="Please wait but a moment..."
			color="rgb(77, 14, 8)"
			comment="This shouldn't take long."
			longWaitComment="Any second now..."
		/>
	{:then data}
		<RatesContainer
			title={data.title}
			ratesDate={data.ratesDate}
			disclaimerText={data.disclaimer}
			externalLinkUrl={data.button.url}
			externalLinkText={data.button.text}
			ratesTables={data.tables}
		/>
	{/await}
</div>

<style>
	.flex-container {
		display: flex;
		justify-content: center;
		align-items: flex-start;
	}
</style>
