"use strict";
const utils = require('./utils');
const aws = require('aws-sdk');
const s3 = new aws.S3({ region: 'eu-central-1', httpOptions: { timeout: 3000 } });

const minifiedAssetBucket = 'as24-static-assets';
const minifiedDir = '_cache';
const singleFilenameLength = 16;

const s3Params = (filename) => ({
    Bucket: minifiedAssetBucket,
    Key: minifiedDir + '/' + filename + '.js',
});

const minifiedValidFilename = RegExp("([a-zA-Z0-9]{" + singleFilenameLength + "})+"); // 8 characters

const getChunksFromString = (str, chunkSize) => {
    const regexChunk = new RegExp(`.{1,${chunkSize}}`, 'g');
    return str.match(regexChunk)
}
const predicateAND = list => utils.fold((acc, x) => acc && minifiedValidFilename.test(x), true, list);

exports.fetchAsset = (filename) => {
    console.log("Fetching file: {0}".format(JSON.stringify(s3Params(filename))));
    return s3.getObject(s3Params(filename)).promise()
    .then(x => x.Body.toString('utf-8'));
}

exports.getFilenamesInfo = (event) => {
    const originalFilename = event.Records[0].cf.request.uri.split("/").pop();
    const originalFilenameLength = originalFilename.length;
    const splitedFilenames = getChunksFromString(originalFilename, singleFilenameLength);
    const splitedFilenamesValid = predicateAND(splitedFilenames);
    const isCombinedFilename = splitedFilenamesValid && originalFilenameLength > 1;
    const result = {
        originalFilename: originalFilename,
        originalFilenameLength: originalFilenameLength,
        countCombinedFiles: splitedFilenames.length,
        splitedFilenames: splitedFilenames,
        isCombinedFilename: isCombinedFilename
    };
    return result;
};