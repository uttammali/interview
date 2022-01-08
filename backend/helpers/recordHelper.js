import http from 'http';

async function getData() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3030,
            path: '/records',
            method: 'GET'
        }

        const req = http.request(options, res => {
            console.log(`statusCode: ${res.statusCode}`)

            res.on('data', d => {
                // process.stdout.write(d);
                try {
                    resolve(JSON.parse(d));
                } catch (error) {
                    reject(error);
                }

            });
        });
        req.on('error', error => {
            console.error(error)
            reject(error);
        });
        req.end()
    })

}

export async function getFilteredData(currentPage = 0) {
    return new Promise((resolve, reject) => {
        getData()
            .then((rawRecordsData) => {
                const rawRecords = rawRecordsData.data.records;
                let start = currentPage * 10;
                start = rawRecords.length < start ? end : 0;
                let end = start + 10;
                end = rawRecords.length > end ? end : rawRecords.length;
                const records = rawRecords.slice(start, end);
                const allIds = records.map(record => record.id);
                const allOpenRecords = [];
                records.forEach(record => {
                    if (record.disposition === 'open') allOpenRecords.push(record);
                });
                let closedRecordsCount = 0;
                records.map(record => {
                    if (
                        record.disposition === 'closed' &&
                        (
                            record.color === 'red' ||
                            record.color === 'blue' ||
                            record.color === 'yellow'
                        )
                    ) closedRecordsCount++;
                });
                const result = {
                    ids: allIds,
                    Open: allOpenRecords,
                    ClosedCount: closedRecordsCount,
                    PreviousPage: currentPage === 0 ? null : currentPage - 1,
                    NextPage: rawRecords.length > end ? currentPage + 1 : null,
                };
                console.log(result);
                resolve(result);
            })
            .catch((error) => {
                console.log(error);
                reject(error);
            })

    })
}