const aws = require('./aws');
const S3 = aws.S3();

module.exports = (app) => {
  app.options('/bigwig/runId/:objKey', (req, res, next) => {
    const objKey = req.params.objKey || '';
    const bucketReqParams = { Bucket: aws.S3BucketConfig.name, Key: objKey };
    if (req.headers['range'] && req.headers['range'].length) {
      bucketReqParams['Range'] = req.headers['range'];
    }
    S3.headObject(bucketReqParams, (err, data) => {
      if (err) {
        if (err.code === 'NotFound') {
          res.sendStatus(404);
        } else {
          throw err;
        }
      } else {
        res.header('Access-Control-Allow-Headers', 'range');
        res.header('Access-Control-Allow-Methods', 'GET, HEAD');
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Expose-Headers', 'Content-Length, Content-Type, Content-Range');

        res.sendStatus(200);
      }
    });
  });


  app.get('/bigwig/runId/:objKey', (req, res, next) => {
    const objKey = req.params.objKey || '';

    const bucketReqParams = { Bucket: aws.S3BucketConfig.name, Key: objKey };
    var M = null;
    if (req.headers['range'] && req.headers['range'].length) {
      M = req.headers['range'].match(new RegExp('bytes=(\d+)-(\d+)(?:\/(\d+))?', 'g'));
      bucketReqParams['Range'] = req.headers['range'];
    }
    S3.headObject(bucketReqParams, (err, data) => {
      if (err) {
        if (err.code === 'NotFound') {
          res.sendStatus(404);
        } else {
          throw err;
        }
      } else {
        const resHeaders = {};
        res.header('Content-Type', data['ContentType'] || 'application/octet-stream');
        res.header('Content-Length', data['ContentLength']);
        res.header('Accept-Ranges', data['AcceptRange'] || 'bytes');

        if (M != null) {
          res.header('Content-Range', data['ContentRange'] || 'bytes ' + M.group(1) + '-' + M.group(2));
        }

        res.status(206);

        const rstream = S3.getObject(bucketReqParams).createReadStream();
        rstream.pipe(res);
      }
    });
  });
};
