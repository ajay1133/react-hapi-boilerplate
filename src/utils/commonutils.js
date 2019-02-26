import config from '../config';
import { VALID_BEGIN_FILE_NAME, DEFAULT_OPTION } from './constants';

export const strictValidArrayWithLength = arr => arr && Array.isArray(arr) && !!arr.length;

export const strictValidObject = obj => obj && obj === Object(obj) &&
	Object.prototype.toString.call(obj) !== '[object Array]';

export const strictValidObjectWithKeys = obj => strictValidObject(obj) && !!Object.keys(obj).length;

export const strictValidString = str => !!str && typeof str === 'string';

export const strictValidArrayWithMinLength = (arr, minLength) => strictValidArrayWithLength(arr) &&
	arr.length >= minLength;

export const strictValidSplittableStringWithMinLength = (str, delimeter, minLength) => strictValidString(str) &&
	strictValidArrayWithMinLength(str.split(delimeter), minLength);

export const concatenateRegularExpressions = (regExpList = []) => {
	let regExp = new RegExp();
	
	if (strictValidArrayWithLength(regExpList)) {
		try {
			regExp = new RegExp(regExpList.join(''));
		} catch (error) {
			console.log('Error generating regular expression');
		}
	}
	
	return regExp;
};

export const validFileName = (fileName, validExtensionsList = [], startingRegExp) =>
	fileName && Array.isArray(validExtensionsList) &&
	!!validExtensionsList.length &&
	concatenateRegularExpressions([
		(strictValidString(startingRegExp) && startingRegExp) || VALID_BEGIN_FILE_NAME,
		validExtensionsList.map(v => (strictValidString(v) && `.${v.toLowerCase()}`) || '').join('|'),
		'$'
	]).test(fileName.toLowerCase());

export const validObjectWithParameterKeys = (obj, parameterKeys = []) =>
	strictValidObjectWithKeys(obj) &&
	strictValidArrayWithLength(parameterKeys) &&
	Object.keys(obj).filter(k => parameterKeys.indexOf(k) > -1).length === parameterKeys.length;

export const typeCastToString = str =>
(!!str && ((strictValidString(str) && str) || str.toString() || JSON.stringify(str))) || '';

export const getFileExtension = fn => fn.substring(fn.lastIndexOf('.'), fn.length);

export const getAbsoluteS3FileUrl = relativeUrl => (
	strictValidString(relativeUrl) && !relativeUrl.includes(config.aws.s3Url) && `${config.aws.s3Url}/${relativeUrl}`
) || typeCastToString(relativeUrl);

export const addKeyValuePairAsString = (k, v, append) => {
	let str = '';
	
	if (!!v) {
		if (['string', 'number', 'boolean'].indexOf(typeof v) > - 1) {
			str = `${k}: ${typeCastToString(v)}`;
		} else if (strictValidArrayWithLength(v)) {
			str = `${k}: [${v.join(', ')}]`;
		} else {
			str = `${k}: [${JSON.stringify(v)}]`;
		}
	} else {
		str = `${k}: `;
	}
	
	str += strictValidString(append) ? `${append}` : '';
	return str;
};

export const getOptionsListFromArray = (arr, useDefaultOptionFlag = true, defaultOption = DEFAULT_OPTION) => (
	useDefaultOptionFlag &&
	strictValidString(defaultOption) &&
	strictValidArrayWithLength(arr) &&
	[{ text: defaultOption, value: '' }].concat(arr.map(v => { return { text: v, value: v }; }))
) || (
	!useDefaultOptionFlag &&
	strictValidArrayWithLength(arr) &&
	arr.map(v => { return { text: v, value: v }; })
) || (
	useDefaultOptionFlag &&
	strictValidString(defaultOption) &&
	!strictValidArrayWithLength(arr) &&
	[{ text: defaultOption, value: '' }]
) || [];

export const numericArrayGenerator = (minValue, maxValue) => {
	const numericArray = [];
	for (let i = minValue; i <= maxValue; i++) {
		numericArray.push(i);
	}
	return numericArray;
};