import superagent from 'superagent';
import { omitBy, isUndefined, isNull } from 'lodash';
import store from 'store2';
import config from '../config';

const methods = ['get', 'post', 'put', 'patch', 'del'];

function formatUrl(path) {
  if (!path) {
    return path;
  }

  if (/^(\/\/|http|https)/.test(path)) {
    return path;
  }
  const adjustedPath = path[0] !== '/' ? `/${path}` : path;
  // Prepend `/api` to relative URL, to proxy to API server.
  return `${config.apiHost}${adjustedPath}`;
}

export default class ApiClient {
  constructor(req) {
    methods.forEach((method) => {
      this[method] = this._req(method);
    });
  }

  _req = method => (path, { params, data, files } = {}) => new Promise((resolve, reject) => {

    const request = superagent[method](formatUrl(path));

    if (params) {
      const emptySting = val => val === '';
      const cleanFromUndefined = omitBy(params, isUndefined);
      const cleanFromNull = omitBy(cleanFromUndefined, isNull);
      const allCleaned = omitBy(cleanFromNull, emptySting);
      request.query(allCleaned);
    }

    request.send(data);

    const token = store('authToken');
    const refreshToken = store('refreshToken');
    if (token) {
      request.set('Authorization', 'bearer '+token);
      request.set('RefreshToken', refreshToken);
    }
    request
      .end((err, { body } = {}) => {
        if (err) {
          reject(Object.assign({}, body, { code: Number(err.status) }));
          return;
        }
        resolve(body);
      });
  });
}
