import express from 'express';

const PORT = process.env.PORT || 3030;
const app = express();

import { getData } from './helpers/recordHelper.js';

app.get('/', (_req, res) => {
    return res.status(200).json({
        message: 'welcome to our record service.'
    });

});

app.get('/records', async (_req, res) => {
    const records = await getData();
    if (!records || records.length === 0) {
        return res.status(200).json({
            status: false,
            message: 'no records found.'
        })
    }
    return res.status(200).json({
        status: true,
        message: 'all available records.',
        data: {
            records
        }
    })
});

app.listen(PORT, () => {
    console.log(`express server running on port '${PORT}'.`);
});