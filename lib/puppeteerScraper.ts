import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

interface ScrapedWebsite{
    html: string;
    css: string;
    js: string;
    assets: Record<string, string>;
}

export async function scrapeWebsite(url: string): Promise<ScrapedWebsite> {
    const browser = await puppeteer.launch({
        headless: 'new' as any,
        args: ["--no-sandbox","--disable-setuid-sandbox"]
    });

    try {

        const page  = await browser.newPage();
        await page.goto(url,{waitUntil: 'networkidle2',timeout: 30000});

        // SCRAPING RESOURCES
        // HTML Scraping
        const html = await page.content();

        // Extracting css stylesheets and inline CSS
        const cssLinks = await page.$$eval('link[rel="stylesheet"]', links =>
            links.map(link => (link as HTMLLinkElement).href)
        );

        const stylesheets = await Promise.all(
            cssLinks.map( async link => {
                try {
                    const res = await fetch(link);
                    return await res.text();
                } catch {
                    return '';
                }
            })
        );

        const inlineStyles = await page.$$eval('style', styles =>
            styles.map(style => style.textContent || '').join('\n')
        );

        const css = stylesheets.join('\n') + '\n' + inlineStyles;

        // Extracting JS files and inline JS

        const jsLinks = await page.$$eval('script[src]',scripts =>
            scripts.map(script => (script as HTMLScriptElement).src)
        );

        const inlineJS = await page.$$eval('script:not([src])', scripts =>
            scripts.map(script => script.textContent || '').join('\n')
        );

        const externalJS = await Promise.all(
            jsLinks.map( async link => {
                try {
                    const res = await fetch(link);
                    return await res.text();
                } catch  {
                    return '';
                }
            })
        );

        const js =  externalJS.join('\n')+ '\n' + inlineJS;

        // Scrape common assets (images, fonts - isko baadme add karna)

        const assetsLinks = await page.$$eval('img', imgs=>
            imgs.map(img=> (img as HTMLImageElement).src)
        );

        const assets: Record<string,string> = {};

        for(const assetUrl of assetsLinks){
            if(!assetUrl.startsWith('http')) continue;

            try {
                const res = await fetch(assetUrl);
                const buffer = await res.arrayBuffer();
                const base64 = Buffer.from(buffer).toString('base64');
                const mimeType = res.headers.get('content-type') || 'image/png';
                const fileName = assetUrl.split('/').pop() || 'asset.png';
                assets[fileName] = `data:${mimeType};base64,${base64}`;
                
            } catch  {
                continue;
            }

        }

        return {
            html, css, js, assets
        }

    } finally{
        await browser.close();
    }

}