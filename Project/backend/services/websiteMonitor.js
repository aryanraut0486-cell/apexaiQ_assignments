const axios = require("axios");
const cheerio = require("cheerio");
const https = require("https");

const TIMEOUT = 10000;
const CONCURRENCY_LIMIT = 10;


// -----------------------------
// Check SSL
// -----------------------------
async function checkSSL(url) {
    try {
        const parsedUrl = new URL(url);

        if (parsedUrl.protocol !== "https:") {
            return "N/A";
        }

        const agent = new https.Agent({
            rejectUnauthorized: true
        });

        await axios.get(url, {
            httpsAgent: agent,
            timeout: TIMEOUT,
            validateStatus: () => true
        });

        return "Valid";

    } catch (error) {
        return "Invalid";
    }
}


// -----------------------------
// Get page title
// -----------------------------
function getPageTitle(html) {
    try {
        const $ = cheerio.load(html);

        const title = $("title").first().text().trim();

        return title || "No Title";

    } catch (error) {
        return "Unable to extract";
    }
}


// -----------------------------
// Check one website
// -----------------------------
async function checkWebsite(url) {

    const startTime = performance.now();

    const result = {
        url,
        status: null,
        responseTime: null,
        availability: "DOWN",
        ssl: "N/A",
        title: "N/A",
        error: ""
    };

    try {

        const response = await axios.get(url, {
            timeout: TIMEOUT,

            headers: {
                "User-Agent": "WebsiteHealthMonitor/1.0"
            },

            validateStatus: () => true
        });

        const endTime = performance.now();

        result.status = response.status;

        result.responseTime =
            Number((endTime - startTime).toFixed(2));

        if (
            response.status >= 200 &&
            response.status < 400
        ) {
            result.availability = "UP";
        }

        if (typeof response.data === "string") {
            result.title = getPageTitle(response.data);
        }

        result.ssl = await checkSSL(url);

    } catch (error) {

        const endTime = performance.now();

        result.responseTime =
            Number((endTime - startTime).toFixed(2));

        result.availability = "DOWN";

        if (
            error.code === "ECONNABORTED" ||
            error.code === "ETIMEDOUT"
        ) {
            result.error = "Request Timeout";
        }
        else if (error.code === "ENOTFOUND") {
            result.error = "Domain Not Found";
        }
        else {
            result.error = error.message;
        }
    }

    return result;
}


// -----------------------------
// Sequential monitoring
// -----------------------------
async function sequentialMonitor(urls) {

    const results = [];

    const startTime = performance.now();

    for (const url of urls) {

        const result = await checkWebsite(url);

        results.push(result);
    }

    const endTime = performance.now();

    return {
        results,

        totalTime:
            (endTime - startTime) / 1000
    };
}


// -----------------------------
// Concurrent monitoring
// -----------------------------
async function concurrentMonitor(urls) {

    const startTime = performance.now();

    const results = new Array(urls.length);

    let currentIndex = 0;


    // Worker function
    async function worker() {

        while (true) {

            const index = currentIndex++;

            if (index >= urls.length) {
                break;
            }

            results[index] =
                await checkWebsite(urls[index]);
        }
    }


    // Create maximum 10 workers
    const workers = [];

    const workerCount =
        Math.min(CONCURRENCY_LIMIT, urls.length);


    for (let i = 0; i < workerCount; i++) {

        workers.push(worker());
    }


    await Promise.all(workers);


    const endTime = performance.now();

    return {
        results,

        totalTime:
            (endTime - startTime) / 1000,

        concurrencyLimit:
            CONCURRENCY_LIMIT
    };
}


module.exports = {
    checkWebsite,
    sequentialMonitor,
    concurrentMonitor
};