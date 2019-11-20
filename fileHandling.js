"use strict";
const aws = require('aws-sdk');
const s3 = new aws.S3({ region: 'eu-central-1' });

const minifiedAssetBucket = 'as24-static-assets';
const minifiedDir = '_cache';
const singleFilenameLength = 16;

const s3Params = (filename) => ({
    Bucket: minifiedAssetBucket,
    Key: minifiedDir + filename,
});

const minifiedValidFilename = RegExp("([a-zA-Z0-9]{" + singleFilenameLength + "})+"); // 8 characters

const getChunksFromString = (str, chunkSize) => {
    const regexChunk = new RegExp(`.{1,${chunkSize}}`, 'g');
    return str.match(regexChunk)
}

const fold = (reducer, init, xs) => {
    let acc = init;
    for (const x of xs) {
        acc = reducer(acc, x);
    }
    return acc;
};

const predicateAND = list => fold((acc, x) => acc && minifiedValidFilename.test(x), true, list);

exports.fetchAsset = async (filename) => {
    s3.getObject(s3Params(filename), function (err, data) {
        if (err)
            return err; // redirect to s.autoscout24.net
        return objectData = data.Body.toString('utf-8');
    });
};

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
    console.log("fileinfo: " + JSON.stringify(result));
    return result;
};