const db = require('../db');
const { Blogs }  = db.models;

// Blogs
const defaultBlogAttributes = [
  'title',
  'image',
  'draft',
  'description',
  'content',
  'status',
  'fileName'
];

exports.getBlog = (query) => {
  const { Page, Limit, SortBy, Order } = query;
  
  let page = (!Page || Page < 1) ? 1 : Page;
  let limit = Limit;
  
  let offset = page - 1;
  offset *= limit;
  
  let sortOrder = [];
  if (SortBy && Order) {
    sortOrder.push([SortBy, Order]);
  } else {
    sortOrder.push(['title']);
  }
  
  return Blogs.findAndCountAll({
    attributes: defaultBlogAttributes,
    where: { status: 1 },
    offset,
    limit,
    order: sortOrder
  });
};

exports.createBlog = (payload) => Blogs.create(payload);

exports.updateBlog = (payload, fileName) => Blogs.update(payload, { where: { fileName } });

exports.deleteBlog = (fileName) => Blogs.destroy({ where: { fileName } });
