const db = require('../db');
const { contactUs }  = db.models;

// Contact Us
const defaultContactUsAttributes = [
  'id',
  'name',
  'email',
  'message',
  'status',
];

exports.getContactUs = (query) => {
  const { Page, Limit, SortBy, Order } = query;
  
  let page = (!Page || Page < 1) ? 1 : Page;
  let limit = Limit;
  
  let offset = page - 1;
  offset *= limit;
  
  let sortOrder = [];
  if (SortBy && Order) {
    sortOrder.push([SortBy, Order]);
  } else {
    sortOrder.push(['name']);
  }
  
  return contactUs.findAndCountAll({
    attributes: defaultContactUsAttributes,
    where: { status: 1 },
    offset,
    limit,
    order: sortOrder
  });
};

exports.createContactUs = (payload) => contactUs.create(payload);

exports.updateContactUs = (payload, id) => contactUs.update(payload, { where: { id } });

exports.deleteContactUs = (id) => contactUs.destroy({ where: { id } });
