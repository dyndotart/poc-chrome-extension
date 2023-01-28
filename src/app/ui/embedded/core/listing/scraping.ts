export function scrapListingDataFromDOM() {
  // Get all script tags from the DOM
  const scripts = document.getElementsByTagName('script');

  // Loop through the script tags
  for (let i = 0; i < scripts.length; i++) {
    var script = scripts[i];
    // Check if the script tag has a type attribute of "application/ld+json"
    if (script.getAttribute('type') === 'application/ld+json') {
      // Get the JSON data from the script tag
      var jsonData = script.innerHTML;

      // Parse the JSON data to a JavaScript object
      var jsonObject = JSON.parse(jsonData);

      // Do something with the JSON object
      console.log('Debug: ', { jsonObject });
    }
  }
}
