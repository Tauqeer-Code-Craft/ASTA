import { scrapeWebsite } from "@/lib/puppeteerScraper";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest){
    try {
        
        const { url } = await req.json();

        if(!url || !url.startsWith("http")){
            return NextResponse.json({message: "Invalid URL"}, {status: 400 });
        }

        const scrapedData = await scrapeWebsite(url);

        return NextResponse.json({success: true, data: scrapedData}, {status: 200 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({message: "Scraping failed"}, {status: 500 });
    }
}