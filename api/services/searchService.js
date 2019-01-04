const db = require('../db');
const { Search, SearchKeyword }  = db.models;

// Search
const defaultSearchAttributes = [
  'id',
  'userId',
  'searchkeywordId'
];

exports.getAllSearch = () => Search.findAndCountAll({
  attributes: defaultSearchAttributes
});

exports.getSearchByUser = (param) => {
  return new Promise((resolve, reject) => {
    const { userId } = param;
  
    Search.findAndCountAll({
      attributes: defaultSearchAttributes,
      where: { userId }
    }).then(resolve).catch(reject);
  });
};

exports.createSearch = (payload) => Search.create(payload);

exports.updateSearch = (payload, id) => Search.update(payload, { where: { id } });

exports.deleteSearch = (id) => Search.destroy({ where: { id } });

exports.deleteSearchBySearchId = (userId, searchkeywordId) => Search.destroy({ where: { userId, searchkeywordId } });


// Search Keyword
const defaultSearchKeywordAttributes = [
  'id',
  'keyword',
  'status'
];

exports.getAllSearchKeyword = () => SearchKeyword.findAndCountAll({
  attributes: defaultSearchKeywordAttributes,
  where: {
    status: 1
  }
});

exports.createSearchKeyword = (payload) => SearchKeyword.create(payload);

exports.createBulkSearchKeyword = (payload) => payload && Array.isArray(payload) && !!payload.length &&
SearchKeyword.bulkCreate(payload);

exports.updateSearchKeyword = (payload, id) => SearchKeyword.update(payload, { where: { id } });

exports.deleteSearchKeyword = (id) => SearchKeyword.destroy({ where: { id } });

exports.getSearchKeywordAndSearch = (query) => {
  return new Promise((resolve, reject) => {
    const { id } = query;
    
    // Associations
    Search.hasMany(SearchKeyword, { foreignKey: 'id' });
    SearchKeyword.belongsTo(Search, { foreignKey: 'id', targetKey: 'searchkeywordId' });
  
    let condition = { status: 1 };
    if (id) {
      condition.id = id;
    }
  
    SearchKeyword.findAndCountAll({
      include: {
        attributes: defaultSearchAttributes,
        model: Search
      },
      attributes: defaultSearchKeywordAttributes,
      where: condition
    }).then(resolve).catch(reject);
  });
};