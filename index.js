"use strict";
const fileHandler = require('./fileHandling');

const createResponse = (status, statusDescription, filecontent) => ({
    body: filecontent,
    status: status,
    statusDescription: statusDescription
});

exports.handler = async (event, context, callback) => {
    try {
        const filenamesInfo = fileHandler.getFilenamesInfo(event);
        console.log(filenamesInfo);
        if (filenamesInfo.isCombinedFilename) {
            Promise.all(filenamesInfo.splitedFilenames.map(fileHandler.fetchAsset))
                .then(x => createResponse('200', 'OK', x))
                .catch(err => createResponse('401', 'Bad filename', ''));
        } else {
            // fetch one  sinlge file content and return
            const filecontent = await fileHandler.fetchAsset(filenamesInfo.splitedFilenames[0]);
            return createResponse('200', 'OK', filecontent);
        }
    } catch (err) {
        console.error(err);
        return createResponse('401', 'Bad filename', '');
    }
};
