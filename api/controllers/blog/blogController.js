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
    path: `${prefix}/{fileName}`,
    method: 'PUT',
    config: require('./updateBlog'),
  },
  {
    path: `${prefix}/{fileName}`,
    method: 'DELETE',
    config: require('./deleteBlog'),
  },
];
