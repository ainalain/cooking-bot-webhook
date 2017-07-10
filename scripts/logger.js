const keyPath = './config/key.json';

const gcloud = require('gcloud')({
  keyFilename: keyPath,
  projectId: 'leo-tnoqwg'
});

const logging = gcloud.logging();

exports.logger = function() {
  const log = logging.log('my-custom-log');
  const entry = log.entry('compute.googleapis.com', {
    user: 'my_username'
  });
  return { log, entry };
};
