const prefix = '/common';

module.exports = [
	{
		path: `${prefix}/getTableData`,
		method: 'GET',
		config: require('./getTableData')
	},
	{
		path: `${prefix}/relationalMappedData`,
		method: 'GET',
		config: require('./getRelationalMappedData')
	},
  {
		path: `${prefix}/insert`,
		method: 'POST',
		config: require('./insertTableData'),
	},
  {
    path: `${prefix}/bulkInsert`,
    method: 'POST',
    config: require('./bulkInsertTableData'),
  },
  {
    path: `${prefix}/update`,
    method: 'POST',
    config: require('./updateTableData'),
  },
  {
    path: `${prefix}/delete`,
    method: 'POST',
    config: require('./deleteTableData'),
  },
	{
		path: `${prefix}/bulkDelete`,
		method: 'POST',
		config: require('./bulkDeleteTableData'),
	}
];
