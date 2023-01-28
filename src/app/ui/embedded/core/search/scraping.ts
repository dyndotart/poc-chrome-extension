import $ from 'jquery';
import axios from 'axios';

export async function scrapSearchedListingsDataFromDOM() {
  const scrapedListingsData: TScrappedListingData[] = [];

  // Find listing entries and extract its attributes
  let divElements = $('a[data-listing-id]');
  divElements.each(function () {
    // Extract attributes
    const listingId = $(this).attr('data-listing-id');
    const shopId = $(this).attr('data-shop-id');
    const url = $(this).attr('href');
    const pageNum = $(this).attr('data-page-num');
    const positionNum = $(this).attr('data-position-num');
    const title = $(this).attr('title');

    if (url != null && listingId != null && title != null) {
      const data: TScrappedListingData = {
        id: listingId,
        shopId,
        url: url.indexOf('?') != -1 ? url.split('?')[0] : url,
        title,
      };
      if (pageNum != null && positionNum != null) {
        data.ranking = {
          pageNum: +pageNum,
          positionNum: +positionNum,
        };
      }

      scrapedListingsData.push(data);
    }
  });

  console.log('Debug: Listings Data', scrapedListingsData);

  // TODO
  // for (const data of listingsData) {
  //   // Fetch additional data
  //   await axios.get(
  //     `https://openapi.etsy.com/v3/application/listings/${data.listingId}`
  //   );
  // }
}

type TScrappedListingData = {
  id: string;
  shopId?: string;
  url: string;
  ranking?: {
    pageNum: number;
    positionNum: number;
  };
  title: string;
};
