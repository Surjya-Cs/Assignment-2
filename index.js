import  fetch from "node-fetch"
import cheerio from "cheerio"
import {URL} from "url"
import path from "path";
import fs from 'fs'

const data = {
  "categories": [
    "Medical Journal",
    "Blog",
    "News",
    "Orthopedic",
    "Gynecology"
  ],
  "geography": [
    "India",
    "US",
    "Europe",
    "Latin America"
  ],
  "dates": [
    "2022",
    "2022-23",
    "Sep 22"
  ]
}

const visitedUrl = {};
const __dirname = path.resolve();

const saveCsvFile = path.join(__dirname,"Result.csv");

const refine = (fullUrl)=>{
  if(!fullUrl.includes("#")) {
    return fullUrl;;
  }else{
    return `the link is containing  #, so it not included`
  }
}


const crawling = async ({url})=>{
    if(visitedUrl[url]) return;
    visitedUrl[url] = true;
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    const baseurl =response.url;
    const links =$("a").map((i,link)=> link.attribs.href).get();
    links.forEach((link)=>{
        const fullUrl = new URL(link,baseurl).href;
        if((data.categories)||(data.geography)||(data.dates).some(word => fullUrl.includes(word))){
            console.log(fullUrl);
        }
        
        const refinedUrl = refine(fullUrl);
        if(refinedUrl){
            console.log(refinedUrl);
        }
       
       fs.mkdirSync(path.dirname(saveCsvFile), { recursive: true });
       fs.appendFileSync(saveCsvFile, `${refinedUrl}\n`, "utf-8");
    }); 
};

crawling({
    url: "https://rxefy.com/"
})
