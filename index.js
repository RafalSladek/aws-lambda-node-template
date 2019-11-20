"use strict";
const fileHandler = require('./fileHandling');

const createResponse = (status, statusDescription, filecontent) => ({
    body: filecontent,
    status: status,
    statusDescription: statusDescription
});

exports.handler = async (event, context, callback) => {
    const filenamesInfo = fileHandler.getFilenamesInfo(event);
    const requests = filenamesInfo.splitedFilenames.map(fileHandler.fetchAsset);
    return Promise.all(requests)
        .then(list => {
            return createResponse('200', 'OK', list.join());
        })
        .catch(err => {
            // try to redirect to s.autoscout24.net
            console.log("Fallback due to {0} with {1}".format(err, filenamesInfo.originalFilename));
            return ({
                status: '302',
                statusDescription: 'Found',
                headers: {
                    location: [{ value: 'https://s.autoscout24.net/conbine/js/' + filenamesInfo.originalFilename }]
                }
            })
            //createResponse('401', 'Bad request', "Error in processing: {0}. {1}".format(filenamesInfo.originalFilename, err))
        });
};