import $ from 'jquery';
import axios from 'axios';

export async function scrapListingDataFromDOM() {
  console.log('Debug: Scrap Listing Data');
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

  await new Promise((resolve) => setTimeout(resolve, 3000));

  // Scrap Listing Data
  const listingsData: any[] = [];
  let divElements = $('a[data-listing-id]');
  divElements.each(function () {
    const listingId = $(this).attr('data-listing-id');
    const shopId = $(this).attr('data-shop-id');
    let url = $(this).attr('href');
    if (url != null) {
      url = url.split('?')[0];
    }
    const pageNum = $(this).attr('data-page-num');
    const positionNum = $(this).attr('data-position-num');
    const title = $(this).attr('title');

    const data = {
      listingId,
      shopId,
      url,
      pageNum,
      positionNum,
      title,
    };

    listingsData.push(data);
  });

  console.log('Debug: Listings Data', listingsData);

  for (const data of listingsData) {
    // Fetch additional data
    await axios.get(
      `https://openapi.etsy.com/v3/application/listings/${data.listingId}`
    );
  }
}
