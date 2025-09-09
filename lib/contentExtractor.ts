import * as cheerio from "cheerio";

export function cleanAndExtractContent(html: string):string{
    const $ = cheerio.load(html);

    // Remove unwanted tages
    $('script, style , noscript,iframe,meta,link,ads,[aria-hidden="true"]').remove();

    // Remove elements by common tracker classes and ids
    $('[class*="tracker"],[id*="tracker"], .ads, .advertisement').remove();

    const bodyText = $('body').text();

    const cleanedText = bodyText.replace(/\s+/g, ' ').trim();

    return cleanedText;

}