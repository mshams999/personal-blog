// Utility to fetch article views from Google Analytics Data API (GA4)
// Requires service account credentials in a JSON file (e.g., ga-credentials.json)

const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const path = require('path');

const propertyId = process.env.GA_PROPERTY_ID; // Set your GA4 property ID in env
const credentialsPath = path.join(__dirname, '../../ga-credentials.json');

const analyticsDataClient = new BetaAnalyticsDataClient({
    keyFilename: credentialsPath,
});

/**
 * Fetches page views for a list of article paths from Google Analytics
 * @param {string[]} articlePaths - e.g. ['/posts/post-1', '/posts/post-2']
 * @returns {Promise<Object>} - { '/posts/post-1': 123, ... }
 */
async function fetchArticleViews(articlePaths) {
    const response = await analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: '2020-01-01', endDate: 'today' }],
        dimensions: [{ name: 'pagePath' }],
        metrics: [{ name: 'screenPageViews' }],
        dimensionFilter: {
            filter: {
                fieldName: 'pagePath',
                inListFilter: { values: articlePaths },
            },
        },
    });

    const views = {};
    response[0].rows?.forEach(row => {
        views[row.dimensionValues[0].value] = parseInt(row.metricValues[0].value, 10);
    });
    return views;
}

module.exports = { fetchArticleViews };
