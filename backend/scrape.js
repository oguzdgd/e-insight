const puppeteer = require("puppeteer");

(async () => {
  const url =
    "https://www.hepsiburada.com/msi-thin-15-b12uc-1478xtr-intel-core-i5-12450h-16gb-512gb-ssd-rtx3050-freedos-15-6-fhd-144hz-tasinabilir-bilgisayar-p-HBCV0000658TRD";

  const browser = await puppeteer.launch({ headless: false }); 
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });


  await page.waitForSelector(
    ".hermes-src-universal-components-ReviewCard-ReviewCard-module__review"
  );

  
  const reviews = await page.evaluate(() => {
    return Array.from(
      document.querySelectorAll(
        ".hermes-src-universal-components-ReviewCard-ReviewCard-module__review span"
      )
    ).map((el) => el.innerText.trim());
  });

  console.log(reviews); 

  await browser.close();
})();