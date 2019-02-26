const prefix = '/aws';

module.exports = [
  {
    path: `${prefix}/uploadFile/{dirName}`,
    method: 'GET',
    config: require('./fileUploadSignatureKey')
  }
];
