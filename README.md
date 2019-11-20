# aws-lambda-node-template
minimal project template for aws lamdba in node.js 


## how to setup
* clone repo
* run `npm install`

## how to use this repo

```
npm run setup # setup node-lambda files
npm run test # test your event handler and check output
npm run package # just generate the zip that would be uploaded to AWS
npm run deploy # deploy to AWS
```

# how to test
use `event.json` and `context.json` to provide your test data to lamnda
