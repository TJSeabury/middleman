(async (d, w) => {
  const replacableNode = d.querySelector(`.rates-container.replacable`);
  const target =
    "https://consumer.optimalblue.com/FeaturedRates?GUID=b61565e4-69f1-4e5e-94cf-c9500181ed78";
  const url = `https://middleman.marketmentors.com/cornerstone-rates/?url=${target}`;
  const res = await fetch(url);
  if (!replacableNode || res.status !== 200)
    return console.error("No node or response.");
  const data = await res.json();
  replacableNode.innerHTML = data;
  const panels = replacableNode.querySelectorAll(".panel");
  if (panels) {
    for (const panel of panels) {
      panel.setAttribute("style", "");
    }
  }
  const date = replacableNode.querySelector(".widgetDate");
  if (date) {
    date.innerHTML = new Date().toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      timeZone: "America/New_York",
    });
  }
  const button = replacableNode.querySelector(
    ".panel-body.widgetContainerBody .btn.btn-block.externalLink"
  );
  if (button) {
    button.setAttribute("style", "");
  }
})(document, window);
export { };