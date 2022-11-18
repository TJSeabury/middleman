<script lang="typescript">
	const wait = () => new Promise((res) => setTimeout(res, 5000));

	const mode: string = 'development';

	const host =
		mode === 'production' ? 'https://middleman.marketmentors.com' : 'http://127.0.0.1:5173';

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

<svelte:head>
	<title>Preview</title>
	<meta name="description" content="Client script preview" />
</svelte:head>

<section>
	<h1>Preview of the fetched content.</h1>

	{#await APIRequest}
		{#await wait()}
			<span>Not going to take long</span>
		{:then a}
			<span>Taking a while</span>
		{/await}
	{:then rates}
		<div class="rates-container replacable">{@html rates}</div>
		<script>
			const replacableNode = document.querySelector(`.rates-container.replacable`);
			const panels = replacableNode.querySelectorAll('.panel');
			if (panels) {
				for (const panel of panels) {
					panel.setAttribute('style', '');
				}
			}
			const date = replacableNode.querySelector('.widgetDate');
			if (date) {
				date.innerHTML = new Date().toLocaleString('en-US', {
					weekday: 'long',
					year: 'numeric',
					month: 'long',
					day: 'numeric',
					hour: 'numeric',
					minute: 'numeric',
					timeZone: 'America/New_York'
				});
			}
			const button = replacableNode.querySelector(
				'.panel-body.widgetContainerBody .btn.btn-block.externalLink'
			);
			if (button) {
				button.setAttribute('style', '');
			}
		</script>
	{/await}
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

	.welcome {
		display: block;
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048) 0;
	}

	.welcome img {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		display: block;
	}
</style>
