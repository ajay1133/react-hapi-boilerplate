const prefix = '/blog';

module.exports = [
  {
    path: prefix,
    method: 'GET',
    config: require('./listBlog'),
  },
  {
    path: `${prefix}`,
    method: 'POST',
    config: require('./addBlog'),
  },
  {
    path: `${prefix}/{id}`,
    method: 'PUT',
    config: require('./updateBlog'),
  },
  {
    path: `${prefix}/{id}`,
    method: 'DELETE',
    config: require('./deleteBlog'),
  },
];
