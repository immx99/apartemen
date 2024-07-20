const puppeteer = require("puppeteer");
const otc = require("objects-to-csv");
const fs = require("fs");

async function scrape() {
   const browser = await puppeteer.launch({ headless: false });
   const page = await browser.newPage();

   // await page.goto(
   //    "https://www.travelio.com/search?searchType=monthly&destinationCategory=City&destinationUrlName=tangerang&destination=Tangerang",
   //    {
   //       waitUntil: "networkidle2",
   //    }
   // );
   // await page.goto("http://localhost/apartemen/php/raw_apr.html");
   // await page.goto("http://localhost/apartemen/php/apartemen_bekasi.html");
   // await page.goto("http://localhost/apartemen/php/apartemen_jakarta.html");
   await page.goto("http://localhost/apartemen/php/apartemen_all.html");
   page.setViewport({ width: 800, height: 926 });
   // await scrollUpUntilTop(page);
   await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
   });
   // let data_all = [];

   let data = await page.evaluate(() => {
      let results = [];
      window.scrollBy(0, 1000);

      // Use scroll to scroll Y by another 100 pixels
      // because scroll sets the current scroll coordinates
      window.scroll(0, 1100);

      // Scroll to the bottom of the page
      window.scrollTo(0, document.body.scrollHeight);
      let items = document.querySelectorAll(".search-building-detail");
      items.forEach((item) => {
         results.push({
            apartemen: item
               .querySelector(
                  "div.search-building-detail > div.search-building-detail-info-wrapper > div.search-building-title"
               )
               .textContent.trim(),
            tersedia: item.querySelector(
               "div.search-building-detail > div.search-building-detail-info-wrapper > div.search-building-label-wrapper.smoothening > div.search-building-label.orange-gradient"
            ).textContent,
            lokasi: item.querySelector(
               "div.search-building-detail > div.search-building-detail-info-wrapper > div.search-building-label-wrapper.smoothening > div.search-building-label"
            ).textContent,
            // studio_rate: item.querySelector(
            //    "div.search-building-detail > div.flex-column > div.search-building-detail-price-wrapper>search-building-detail-price-label span"
            // ).textContent,
         });
      });
      return results;
   });
   // console.log(data);
   // data.push(data);

   console.log(data);
   console.dir(data);

   // Write countries array in countries.json file
   fs.writeFile("php/aparts_all.json", JSON.stringify(data, null, 2), (err) => {
      if (err) {
         console.error(err);
         return;
      }
      console.log("Successfully written data to file");
   });
   // const csv = new otc(data_all);
   // await csv.toDisk("apartements180724.csv");
   await page.close();
   await browser.close();
}

scrape();

async function scrollUpUntilTop(page) {
   let lastScrollTop = await page.evaluate(() => document.documentElement.scrollTop);
   while (lastScrollTop > 0) {
      await page.evaluate(() => window.scrollBy(0, -100)); // Scroll up by 100px
      const newScrollTop = await page.evaluate(() => document.documentElement.scrollTop);
      if (newScrollTop === lastScrollTop) {
         break; // Reached the top
      }
      lastScrollTop = newScrollTop;
   }
}
