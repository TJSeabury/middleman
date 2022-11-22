<script lang="ts">
	import { dev } from '$app/environment';
	import Spinner from '$lib/components/Spinner.svelte';
	import RatesContainer from './RatesContainer.svelte';
	import RateDetails, { open, close } from './RateDetails.svelte';
	import type { Rates, RatesMatrix } from '$lib/typesAndInterfaces';

	const host = !dev ? 'https://middleman.marketmentors.com' : 'http://localhost:5173';

	type Button = {
		url: string;
		text: string;
	};
	type RatesData = {
		title: string;
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
		const template = document.createElement('template');
		template.innerHTML = data;

		const title = template.querySelector('.widgetHeaderTitle')?.innerHTML || '';

		const rawTables = Array.from(
			template.querySelectorAll('.panel-body.widgetContainerBody .panel.innerContainer')
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

				let rateDetails = row.querySelector('td:last-of-type')?.innerHTML;
				if (!rateDetails) {
					throw new Error('No rate details found!');
				}

				return {
					rate: td[0],
					points: td[1],
					apr: td[2],
					details: rateDetails
				};
			});

			return {
				title: heading,
				rates: ratesRows
			};
		});

		const disclaimer = template.querySelector('.disclaimer')?.innerHTML || '';

		const externalButton = template.querySelector('.btn.btn-block.externalLink');
		const button = {
			url: externalButton?.getAttribute('href') || '',
			text: externalButton?.innerHTML || ''
		};

		return {
			title: title,
			tables: tables,
			disclaimer: disclaimer,
			button: button
		};
	};

	let APIRequest = apiRequest();

	/* (() => {
		let expandables = document.querySelectorAll('[data-html-b64]');
		for (const expandable of expandables) {
			let html = atob(expandable.getAttribute('data-html-b64'));
			expandable.addEventListener('click', () => {
				detailsPane.innerHTML = html;
				detailsPane.open();
				const button = detailsPane.querySelector('.btn[type="button"]');
				if (button) {
					button.addEventListener('click', () => {
						detailsPane.close();
					});
				} else {
					console.log('.btn[type="button"] not found rate details.');
				}
			});
		}
	})(); */
</script>

{#await APIRequest}
	<Spinner
		message="Please wait but a moment..."
		color="rgb(77, 14, 8)"
		comment="This shouldn't take long."
		longWaitComment="Any second now..."
	/>
{:then data}
	<div>{JSON.stringify(data)}</div>
	<RatesContainer
		title={data.title}
		disclaimerText={data.disclaimer}
		externalLinkUrl={data.button.url}
		externalLinkText={data.button.text}
		ratesTables={data.tables}
	/>
{/await}
