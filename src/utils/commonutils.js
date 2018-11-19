import config from '../config';
import openSocket from 'socket.io-client';
const socket = openSocket(`${config.apiHost}`);

export function getSocket() {
return socket;
}

export const getHashParams = (hash = '') => {
  let hashParams = {};
  let e,
    a = /\+/g,  // Regex for replacing addition symbol with a space
    r = /([^&;=]+)=?([^&;]*)/g,
    d = function (s) {
      return decodeURIComponent(s.replace(a, " "));
    },
    q = hash.toString().substring(1);
  
  while ((e = r.exec(q)))
    hashParams[d(e[1])] = d(e[2]);
  
  return hashParams;
};

export const strictValidObject = obj => obj && obj === Object(obj) &&
Object.prototype.toString.call(obj) !== '[object Array]';

export const strictValidObjectWithKeys = obj => strictValidObject(obj) && Object.keys(obj).length;