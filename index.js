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
        .catch(err => createResponse('401', 'Bad request', "Error in processing: {0}. {1}".format(filenamesInfo.originalFilename, err)));
};