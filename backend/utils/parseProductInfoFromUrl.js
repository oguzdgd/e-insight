export function parseProductInfoFromUrl(url){

    try{
        const urlObj = new URL(url);
        const hostname = urlObj.hostname;

        let platform ="unknown";
        if(hostname.includes("trendyol"))platform = "trendyol"
        else if ( hostname.includes("hepsiburada")) platform= "hepsiburada";

        const path=urlObj.pathname;
        const parts= path.split("/");

        const productName = parts[2]?.replace(/-/g,"") || "unknown"
        const productId = path.match(/-p-(\d+)/)?.[1]|| "unknown"

        return{productName,productId,platform};
        
    }
    catch(err){
        alert("Geçersiz Url:",err)
        return{
            productName:"unknown",
            productId:"unknown",
            platform:"unknown"
        }
    }


}