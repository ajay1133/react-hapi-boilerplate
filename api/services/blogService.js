const db = require('../db');
const { Blogs }  = db.models;

// Blogs
const defaultBlogAttributes = [
  'id',
  'title',
  'image',
  'draft',
  'description',
  'content',
  'status',
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

exports.updateBlog = (payload, id) => Blogs.update(payload, { where: { id } });

exports.deleteBlog = (id) => Blogs.destroy({ where: { id } });
