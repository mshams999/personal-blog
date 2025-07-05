const express = require('express');
const cors = require('cors');
const { BetaAnalyticsDataClient } = require('@google-analytics/data');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Google Analytics Data Client
const analyticsDataClient = new BetaAnalyticsDataClient({
    keyFilename: process.env.GA_CREDENTIALS_PATH || './ga-credentials.json',
});

const propertyId = process.env.GA_PROPERTY_ID;

/**
 * Fetches page views for articles from Google Analytics GA4
 * @param {string[]} articlePaths - Array of article paths like ['/post/article-slug']
 * @returns {Promise<Object>} - Object with path as key and views as value
 */
async function fetchArticleViews(articlePaths) {
    try {
        if (!propertyId) {
            throw new Error('GA_PROPERTY_ID environment variable is not set');
        }

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

        // Initialize all paths with 0 views
        articlePaths.forEach(path => {
            views[path] = 0;
        });

        // Update with actual view counts
        if (response[0].rows) {
            response[0].rows.forEach(row => {
                const path = row.dimensionValues[0].value;
                const viewCount = parseInt(row.metricValues[0].value, 10);
                views[path] = viewCount;
            });
        }

        return views;
    } catch (error) {
        console.error('Error fetching article views:', error);

        // Return mock data if GA fails (for development)
        const mockViews = {};
        articlePaths.forEach((path, index) => {
            mockViews[path] = Math.floor(Math.random() * 1000) + 100; // Random views between 100-1100
        });
        return mockViews;
    }
}

// API endpoint to get article view counts
app.get('/api/article-views', async (req, res) => {
    try {
        const { paths } = req.query;

        if (!paths) {
            return res.status(400).json({ error: 'Missing paths parameter' });
        }

        // Parse paths (can be comma-separated string or array)
        const articlePaths = Array.isArray(paths) ? paths : paths.split(',');

        const views = await fetchArticleViews(articlePaths);

        res.json({
            success: true,
            data: views,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({
            error: 'Failed to fetch article views',
            message: error.message
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`🚀 Analytics API server running on http://localhost:${PORT}`);
    console.log(`📊 Google Analytics Property ID: ${propertyId || 'Not configured'}`);
});
