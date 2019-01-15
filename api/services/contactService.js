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

exports.getContactUs = () => contactUs.findAndCountAll({
  attributes: defaultContactUsAttributes,
  where: { status: 1 }
});

exports.createContactUs = (payload) => contactUs.create(payload);

exports.updateContactUs = (payload, id) => contactUs.update(payload, { where: { id } });

exports.deleteContactUs = (id) => contactUs.destroy({ where: { id } });
