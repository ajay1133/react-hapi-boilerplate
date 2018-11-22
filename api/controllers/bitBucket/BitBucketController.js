const prefix = '/bitBucket';

module.exports = [
  {
    path: `${prefix}/listing`,
    method: 'GET',
    config: require('./repoListing'),
  },
  {
    path: `${prefix}/view`,
    method: 'GET',
    config: require('./repoView'),
  },
	{
		path: `${prefix}/updateFile`,
		method: 'POST',
		config: require('./fileUpdate'),
	},
  {
		path: `${prefix}/deleteFile`,
		method: 'POST',
		config: require('./fileDelete'),
	}
];
