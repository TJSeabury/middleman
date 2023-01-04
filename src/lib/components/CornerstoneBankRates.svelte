<script lang="ts">
	import { dev } from '$app/environment';
	import Spinner from '$lib/components/Spinner.svelte';
	import RatesContainer from './RatesContainer.svelte';
	import type { RatesMatrix } from '$lib/typesAndInterfaces';
	import { onMount } from 'svelte';

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

	let data: RatesData | null = null;
	let revalidating: boolean = false;

	const apiRequest = async (): Promise<RatesData> => {
		const url = `/api/cornerstonebank/rates`;
		const res = await fetch(url);
		if (res.status !== 200) {
			console.error('No node or response.');
			throw new Error('No node or response.');
		}
		const data = await res.json();
		return data;
	};

	const onRevalidate = async () => {
		revalidating = true;
		const response = await fetch(`/api/cornerstonebank/revalidate`);
		const valid = await response.json();

		if (!valid) {
			data = await apiRequest();
		}
		revalidating = false;
	};

	onMount(async () => {
		setInterval(onRevalidate, 1000 * 60 * 5);
		data = await apiRequest();
		await onRevalidate();
	});
</script>

<div class="flex-container">
	{#if data}
		<RatesContainer
			title={data.title}
			ratesDate={data.ratesDate}
			disclaimerText={data.disclaimer}
			externalLinkUrl={data.button.url}
			externalLinkText={data.button.text}
			ratesTables={data.tables}
			{revalidating}
		/>
	{:else}
		<Spinner
			message="Please wait but a moment..."
			color="rgb(77, 14, 8)"
			comment="This shouldn't take long."
			longWaitComment="Any second now..."
		/>
	{/if}
</div>

<style>
	.flex-container {
		display: flex;
		justify-content: center;
		align-items: flex-start;
	}
</style>
