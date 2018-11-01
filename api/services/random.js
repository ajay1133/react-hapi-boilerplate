'use strict';

/***
 * Generate a 6 digit random number
 * @returns {number} 6 digits long number
 */
exports.randomNumber  = () => {
  return Math.ceil(Math.random() * 1000000);
};
exports.randomString  = () => {
  return (new Date().getTime()).toString(36);
};
exports.passToken  = () => {
  return Math.random().toString(36).substring(2, 30) +new Date().getTime().toString(36)+ Math.random().toString(36).substring(2, 20);
};
exports.inviteToken  = () => {
  return Math.random().toString(36).substring(2, 30) +new Date().getTime().toString(36)+ Math.random().toString(36).substring(2, 20);
};
