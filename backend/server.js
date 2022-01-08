import express from 'express';
import { getFilteredData } from './helpers/recordHelper.js';
const PORT = process.env.PORT || 4040;
const app = express();

app.get('/', (_req, res) => {
    return res.status(200).json({
        message: 'welcome to our backend.'
    });

});

app.get('/api/managed-records', async (req, res) => {
    // TODO: validate for -ve numbers
    const page = Number(req.query.page);
    await getFilteredData(isNaN(page) ? 0 : page)
        .then(records => {
            return res.status(200).json({
                status: true,
                message: '10 filterd records.',
                data: {
                    records
                }
            })
        })
        .catch(error => {
            return res.status(200).json({
                status: false,
                message: 'can not get records',
            })
        })

});

app.listen(PORT, () => {
    console.log(`express server running on port '${PORT}'.`);
});