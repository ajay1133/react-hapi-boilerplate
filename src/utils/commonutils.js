export const strictValidObject = obj => obj && obj === Object(obj) &&
Object.prototype.toString.call(obj) !== '[object Array]';

export const strictValidObjectWithKeys = obj => strictValidObject(obj) && Object.keys(obj).length;

export const strictValidString = str => str && typeof str === 'string';

export const strictValidSplittableStringWithMinLength = (str, delimeter, minLength) => strictValidString(str) &&
Array.isArray(str.split(delimeter)) && str.split(delimeter).length >= minLength;