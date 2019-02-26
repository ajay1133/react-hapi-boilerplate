const db = require('../db');
const constants = require('../constants');

exports.strictValidObject = obj => obj && obj === Object(obj) &&
	Object.prototype.toString.call(obj) !== '[object Array]';

exports.strictValidObjectWithKeys = obj => exports.strictValidObject(obj) && !!Object.keys(obj).length;

exports.strictValidArrayWithLength = arr => arr && Array.isArray(arr) && !!arr.length;

exports.isValidTable = table => {
	let isValidTable = false;
	isValidTable = table && Object.keys(db.models).indexOf(table) > -1;
	console.log(db.models);
	const tableModel = isValidTable ? db.models[table] : {};
	isValidTable = isValidTable && Object.keys(tableModel).indexOf('tableAttributes') > -1 &&
		!!Object.keys(tableModel.tableAttributes).length;
	return isValidTable;
};

exports.getTableData = async (table, query) => {
	try {
		let isValidTable = exports.isValidTable(table);
		let isValidPageAndLimit = true;
		let isValidAttributes = true;
		let isValidFilter = true;
		let isValidSortBy = true;
		let isValidOrder = true;
		let isMatchingSortByOrder = true;
		let { page, limit, order, sortBy, filters, attributes } = query;
		let conditionObj = {};
		let queryStr = {};
		let tableModelObj = {};
		/*
		** Check Valid Table {if defined in db.models}
		*/
		if (isValidTable) {
			tableModelObj = db.models[table];
			const fieldNames = Object.keys(tableModelObj.tableAttributes) || [];
			/*
			** Check Valid Filters {if filter's each object's key is defined as a table-attribute}
			*/
			if (filters) {
				if (typeof filters === 'string') {
					filters = JSON.parse(filters);
					isValidFilter = Array.isArray(filters);
				} else {
					isValidFilter = false;
				}
				if (isValidFilter) {
					filters.forEach((filterObj) => {
						const filterKeys = Object.keys(filterObj);
						const toFilterColumn = filterKeys.length ? filterKeys[0] : null;
						if (fieldNames.indexOf(toFilterColumn) <= -1) {
							isValidFilter = false;
						}
					});
					if (isValidFilter) {
						conditionObj = {
							$and: filters.map((filterObj) => {
								const filterKeys = Object.keys(filterObj);
								const toFilterColumn = filterKeys.length ? filterKeys[0] : null;
								const toFilterAction = filterKeys.length > 1 && Object.keys(filterObj).indexOf('action') > -1 &&
								filterObj.action ? filterObj.action.toUpperCase() : null;
								const obj = {};
								const allowedFilterActions = [ 'LIKE', 'NE', 'IN', 'NOTLIKE', 'GREATER_OR_EQUAL' ];
								if (toFilterColumn) {
									if (allowedFilterActions.indexOf(toFilterAction) <= -1) {
										obj[ toFilterColumn ] = filterObj[ toFilterColumn ];
									} else if (toFilterAction === 'LIKE') {
										obj[ toFilterColumn ] = { $like: `%${filterObj[ toFilterColumn ]}%` };
									} else if (toFilterAction === 'NE') {
										obj[ toFilterColumn ] = { $ne: filterObj[ toFilterColumn ] };
									} else if (toFilterAction === 'IN') {
										obj[ toFilterColumn ] = { $in: filterObj[ toFilterColumn ] };
									} else if (toFilterAction === 'NOTLIKE') {
										obj[ toFilterColumn ] = { $notLike: `%${filterObj[ toFilterColumn ]}%` };
									} else if (toFilterAction === 'GREATER_OR_EQUAL') {
										obj[ toFilterColumn ] = { $gte: filterObj[ toFilterColumn ] };
									}
								}
								return obj;
							})
						};
					}
				}
			}
			/*
			** Check Valid SortBy & Order {if SortBy's key is defined as a table-attribute && Order's value is 'ASC'/'DESC'}
			*/
			if (sortBy && order && Array.isArray(sortBy) && Array.isArray(order)) {
				sortBy.forEach((sortByColumn) => {
					if (fieldNames.indexOf(sortByColumn) <= -1) {
						isValidSortBy = false;
					}
				});
				order.forEach((orderType) => {
					if (['ASC', 'DESC'].indexOf(orderType.toUpperCase()) <= -1) {
						isValidOrder = false;
					}
				});
				isMatchingSortByOrder = sortBy.length === order.length;
				if (isValidSortBy && isValidOrder && isMatchingSortByOrder) {
					queryStr.order = sortBy.map((sortByColumn, i) => [ sortByColumn, order[i] ]);
				}
			}
			/*
			** Check & Assign If Page & Limit are passed
			*/
			if (page && limit) {
				isValidPageAndLimit = parseInt(page) >= 1 && parseInt(limit) >= 1;
				if (isValidPageAndLimit) {
					page = parseInt(page);
					limit = parseInt(limit);
					queryStr.offset = (page - 1) * limit;
					queryStr.limit = limit;
				}
			}
			/*
			** Check If Where Condition is defined
			*/
			if (conditionObj && Object.keys(conditionObj).length) {
				queryStr.where = conditionObj;
			}
			/*
			** Check & Assign Valid Attributes {if Attribute's key is defined as a table-attribute}
			*/
			if (attributes) {
				attributes.forEach((attr) => {
					if (fieldNames.indexOf(attr) <= -1) {
						isValidAttributes = false;
					}
				});
				if (isValidAttributes) {
					queryStr.attributes = attributes;
				}
			}
		}
		const isValidFlag = isValidTable && isValidPageAndLimit && isValidAttributes && isValidFilter && isValidSortBy &&
			isValidOrder && isMatchingSortByOrder;
		let errors = [];
		/*
		** Check if all conditions are satisfied
		*/
		if (!isValidFlag) {
			let error = null;
			if (!isValidTable) {
				error = `Error: Table ${table} is not present in db.models`;
				errors.push(error);
			}
			if (!isValidPageAndLimit) {
				error = `Error: Invalid Page: ${page} and Limit ${limit} passed`;
				errors.push(error);
			}
			if (!isValidAttributes) {
				error = 'Error: Invalid attributes: ' + JSON.stringify(attributes) + ` passed to fetch from table ${table}`;
				errors.push(error);
			}
			if (!isValidFilter) {
				error = 'Error: Invalid Filters: ' + JSON.stringify(filters);
				errors.push(error);
			}
			if (!isValidSortBy) {
				error = 'Error: Invalid SortBy: ' + JSON.stringify(sortBy) + ' passed';
				errors.push(error);
			}
			if (!isValidOrder) {
				error = 'Error: Invalid Order: ' + JSON.stringify(order) + ' passed';
				errors.push(error);
			}
			if (!isMatchingSortByOrder) {
				error = 'Error: Number of entries in SortBy: ' + JSON.stringify(sortBy) +
					' do not match the number of entries in Order: ' + JSON.stringify(order);
				errors.push(error);
			}
			throw new Error(JSON.stringify(errors));
		}
		return await tableModelObj.findAndCountAll(queryStr);
	} catch (err) {
		return Promise.reject(err);
	}
};

exports.insertTableData = (table, dataObject) => exports.isValidTable(table) &&
	exports.strictValidObjectWithKeys(dataObject) && db.models[table].create(dataObject);

exports.bulkInsertTableData = (table, dataListOfObjects) => exports.isValidTable(table) &&
	exports.strictValidArrayWithLength(dataListOfObjects) && db.models[table].bulkCreate(dataListOfObjects);

exports.updateTableData = (table, dataObject, where) => exports.isValidTable(table) &&
	exports.strictValidObjectWithKeys(dataObject) && exports.strictValidObject(where) &&
	db.models[table].update(dataObject, { where });

exports.deleteTableData = (table, where) => exports.isValidTable(table) &&
	exports.strictValidObjectWithKeys(where) && db.models[table].destroy({ where });

exports.bulkDeleteTableData = (table, where) => exports.isValidTable(table) &&
	exports.strictValidObjectWithKeys(where) && db.models[table].bulkDelete({ where });

exports.getRelationalMappedData = (queryOnPrimaryTable, queryOnSecondaryTable) => {
	const whereObjOnPrimaryTable = (exports.strictValidObject(queryOnPrimaryTable) && queryOnPrimaryTable) || {};
	const whereObjOnSecondaryTable = (exports.strictValidObject(queryOnSecondaryTable) && queryOnSecondaryTable) || {};
	return Promise
		.all(constants.RELATIONAL_MAPPING_LIST.map(v =>
			db.models[v.primaryTable]
				.findAndCountAll({
					include: { model: db.models[v.secondaryTable], where: whereObjOnSecondaryTable, required: false },
					where: whereObjOnPrimaryTable,
					order: [['id', 'ASC']]
				})
		));
};
