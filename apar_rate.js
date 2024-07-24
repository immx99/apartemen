const puppeteer = require("puppeteer");
const otc = require("objects-to-csv");
const fs = require("fs");

(async () => {
   const browser = await puppeteer.launch();
   const page = await browser.newPage();
   await page.goto("http://localhost/apartemen/apartemen_all.html"); // Replace with the target URL

   const products = await page.$$(".search-building-detail");

   const productData = await Promise.all(
      products.map(async (product) => {
         const name = await product.$eval(".search-building-title", (el) => el.textContent);
         const available = await product.$eval(".search-building-label.orange-gradient", (el) => el.textContent);
         const location = await product.$eval(".search-building-label", (el) => el.textContent);
         const price = await product.$eval(".search-building-detail-price-label", (el) => el.textContent);
         // ... other data points you want to extract

         return { name, available, location, price }; // Or create an object with the desired structure
      })
   );

   console.log(productData);
   fs.writeFile("php/aparts_all.json", JSON.stringify(productData, null, 2), (err) => {
      if (err) {
         console.error(err);
         return;
      }
      console.log("Successfully written data to file");
   });
   await browser.close();
})();
