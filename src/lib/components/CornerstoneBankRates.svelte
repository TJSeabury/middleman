<script lang="ts">
	import { dev } from '$app/environment';
	import Spinner from '$lib/components/Spinner.svelte';
	import RatesContainer from './RatesContainer.svelte';
	import type { Rates, RatesMatrix } from '$lib/typesAndInterfaces';
	import { atob } from '$lib/general';

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

	function extractFragmentHTML(frag: DocumentFragment | HTMLElement) {
		return [].map.call(frag.children, (element: HTMLElement) => element.outerHTML).join('\n');
	}

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
		const nodes = new DOMParser().parseFromString(data, 'text/html');
		if (nodes == null) {
			throw new Error('Failed to parse data!');
		}
		const fragment = new DocumentFragment();
		fragment.append(nodes.firstChild || 'No nodes!');

		const title = fragment.querySelector('.widgetHeaderTitle')?.innerHTML || '';

		const widgetDate = fragment.querySelector('.widgetDate')?.innerHTML || '';

		const rawTables = Array.from(
			fragment.querySelectorAll('.panel-body.widgetContainerBody .panel.innerContainer')
		);
		const tables = rawTables.map((element): RatesMatrix => {
			const heading =
				element.querySelector('.panel-heading.innerContainerHeader .innerHeadingTitle_small')
					?.innerHTML || '';

			const ratesTableRows = Array.from(element.querySelectorAll('.table.ratesTable tr.datarow'));
			const ratesRows: Rates[] = ratesTableRows.map((row) => {
				let td: Element[] | number[] = Array.from(row.querySelectorAll('td'));
				td = td.map((td) => {
					let maybeAnchor = td.querySelector('a');
					if (maybeAnchor != null) {
						return parseFloat(maybeAnchor.innerText);
					}
					return parseFloat(td.innerHTML);
				});

				const rateDetails = row.querySelector('td:last-of-type a')?.getAttribute('data-html-b64');
				if (!rateDetails) {
					throw new Error('No rate details found!');
				}

				const detailNodes = new DOMParser().parseFromString(atob(rateDetails), 'text/html');
				if (detailNodes == null) {
					throw new Error('Failed to parse rate details!');
				}

				const rateDetailsFrag = new DocumentFragment();
				rateDetailsFrag.append(detailNodes.body.firstChild || 'No nodes!');
				const modalFooter = rateDetailsFrag.querySelector('.modal-footer');
				if (modalFooter != null) {
					modalFooter.parentElement?.removeChild(modalFooter);
				}

				return {
					rate: td[0],
					points: td[1],
					apr: td[2],
					details: extractFragmentHTML(rateDetailsFrag)
				};
			});

			return {
				title: heading,
				rates: ratesRows
			};
		});

		const disclaimer = fragment.querySelector('.disclaimer')?.innerHTML || '';

		const externalButton = fragment.querySelector('.btn.btn-block.externalLink');
		const button = {
			url: externalButton?.getAttribute('href') || '',
			text: externalButton?.innerHTML || ''
		};

		return {
			title: title,
			ratesDate: widgetDate,
			tables: tables,
			disclaimer: disclaimer,
			button: button
		};
	};

	let APIRequest = apiRequest();
</script>

<div class="flex-container">
	<iframe
		src="https://consumer.optimalblue.com/FeaturedRates?GUID=b61565e4-69f1-4e5e-94cf-c9500181ed78"
		frameborder="0"
		title="data master"
	/>
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
		align-items: flex-start;
	}
	iframe {
		width: fit-content;
		height: 100vw;
	}
</style>
