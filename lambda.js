"use strict";
const fileHandler = require('./fileHandling');

const createResponse = (status, statusDescription, filecontent) => ({
    body: filecontent,
    status: status,
    statusDescription: statusDescription
});

exports.run = async (params, event, context, callback) => {
    console.log(JSON.stringify(params));
    const filenamesInfo = fileHandler.getFilenamesInfo(event);
    const requests = filenamesInfo.splitedFilenames.map(fileHandler.fetchAsset);
    return Promise.all(requests)
        .then(list => {
            return createResponse('200', 'OK', list.join());
        })
        .catch(err => {
            if (params.shoudlFallback) {
                // try to redirect to s.autoscout24.net
                console.log("Fallback due to {0} with {1}".format(err, filenamesInfo.originalFilename));
                return ({
                    status: '302',
                    statusDescription: 'Found',
                    headers: {
                        location: [{ value: params.fallbackBaseUrl + '/' + params.path + '/' + params.fileType + '/' + filenamesInfo.originalFilename }]
                    }
                });
            } else {
                createResponse('401', 'Bad request', "Error in processing: {0}. {1}".format(filenamesInfo.originalFilename, err))
            }
        });
};