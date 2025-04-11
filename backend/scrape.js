import { launch } from "puppeteer";

(async () => {
  const url =
    "https://www.hepsiburada.com/lego-speed-champions-ferrari-f40-super-araba-76934-9-yas-ve-uzeri-cocuklar-icin-insa-edilebilen-oyuncak-arac-modeli-yapim-seti-318-parca-p-HBCV00006PUL7K-yorumlari";

  const browser = await launch({ 
    headless: false,
    defaultViewport: null
  });
  
  const page = await browser.newPage();
  
  try {
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
    console.log("Page loaded successfully");
    
   
    await page.waitForSelector(".hermes-ReviewCard-module-KaU17BbDowCWcTZ9zzxw", { timeout: 30000 });
    console.log("Reviews loaded successfully");
    
    let allReviews = [];
    let currentPage = 1;
    const maxPages = 10; 
    
    while (currentPage <= maxPages) {
      console.log(`Scraping page ${currentPage}`);
      
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
     
      const pageReviews = await page.evaluate(() => {
        const reviewElements = document.querySelectorAll(".hermes-ReviewCard-module-KaU17BbDowCWcTZ9zzxw");
        return Array.from(reviewElements).map(review => {
         
          const commentText = review.querySelector("span") ? review.querySelector("span").innerText.trim() : "No text";
          return commentText;
        });
      });
      
      console.log(`Found ${pageReviews.length} reviews on page ${currentPage}`);
      allReviews.push(...pageReviews);
      
      
      const nextPageExists = await page.evaluate((currentPage) => {
         
        const paginationButtons = Array.from(document.querySelectorAll('li[class*="hermes-PageHolder-module"]'));
        
        
        for (const button of paginationButtons) {
          const buttonText = button.textContent.trim();
          if (!isNaN(buttonText) && parseInt(buttonText) > currentPage) {
            return true;
          }
        }
        return false;
      }, currentPage);
      
      if (!nextPageExists) {
        console.log("No more pages available");
        break;
      }
      
     
      const nextPageNumber = currentPage + 1;
      
      try {
        
        await page.evaluate((nextPageNumber) => {
          const paginationButtons = Array.from(document.querySelectorAll('li[class*="hermes-PageHolder-module"]'));
          for (const button of paginationButtons) {
            if (button.textContent.trim() === String(nextPageNumber)) {
              button.click();
              return;
            }
          }
          throw new Error(`Could not find button for page ${nextPageNumber}`);
        }, nextPageNumber);
        
        
        await page.waitForNavigation({ waitUntil: "networkidle2", timeout: 30000 }).catch(() => {
          console.log("Navigation timeout, but continuing...");
        });
        
        console.log(`Clicked on page ${nextPageNumber}`);
        currentPage++;
      } catch (error) {
        console.error(`Error clicking next page: ${error}`);
        break;
      }
    }
    
    console.log(`Total reviews collected: ${allReviews.length}`);
    console.log(allReviews);
    
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    await browser.close();
    console.log("Browser closed");
  }
  
})();
