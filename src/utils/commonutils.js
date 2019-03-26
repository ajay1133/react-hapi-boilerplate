import config from '../config';
import { DEFAULT_VALID_BEGIN_FILE_NAME_REG_EXP, DEFAULT_OPTION } from './constants';

/**
 * Checks if a valid string
 * @param val: number/string/object/array != (undefined or null) 
 */
export const validValue = val => typeof(val) !== "undefined" && val !== undefined && val !== null;

/**
 * Checks if a valid string
 * @param str: string 
 */
export const strictValidString = str => !!str && typeof str === 'string';

/**
 * Checks if a valid string which when split with a delimeter will give an array with specified minimum length
 * @param str: string 
 * @param delimeter: string
 * @param minLength: integer
 */
export const strictValidSplittableStringWithMinLength = (str, delimeter, minLength) => strictValidString(str) &&
	strictValidArrayWithMinLength(str.split(delimeter), minLength);

/**
 * Typecast or converts forcefully a string, an object or an array to string else returns null
 * @param str: string 
 */
export const typeCastToString = str =>
	(!!str && ((strictValidString(str) && str) || str.toString() || JSON.stringify(str))) || '';	

/**
 * Checks if a valid array
 * @param arr: array 
 */
export const strictValidArray = arr => arr && Array.isArray(arr);

/**
 * Checks if a valid array with minimum specified length
 * @param arr: array
 * @param minLength: integer 
 */	
export const strictValidArrayWithMinLength = (arr, minLength) => strictValidArray(arr) && arr.length >= minLength;

/**
 * Checks if a valid array with length
 * @param arr: array 
 */
export const strictValidArrayWithLength = arr => strictValidArray(arr) && !!arr.length;

/**
 * Checks if a valid object
 * @param obj: object 
 */
export const strictValidObject = obj => obj && obj === Object(obj) &&
	Object.prototype.toString.call(obj) !== '[object Array]';

/**
 * Checks if a valid object with keys
 * @param obj: object 
 */	
export const strictValidObjectWithKeys = obj => strictValidObject(obj) && !!Object.keys(obj).length;

/**
 * Checks if a valid object with specified keys
 * @param obj: object
 * @param parameterKeys: array 
 */	
export const validObjectWithParameterKeys = (obj, parameterKeys = []) =>
	strictValidObjectWithKeys(obj) &&
	strictValidArrayWithLength(parameterKeys) &&
	Object.keys(obj)
	.filter(k => parameterKeys.indexOf(k) > -1)
	.length === parameterKeys.length;

/**
 * Generates a regular expression from a given list of regular expressions
 * @param regExpList: array of regular expression strings
 */	
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

/**
 * Checks if a valid string fileName with extension in specified list of extensions and starts with a 
 * specifield or default regular expression
 * @param fileName: string
 * @param validExtensionsList: array of valid regular expression strings
 * @param startingRegExp: string
 */ 
export const validFileName = (fileName, validExtensionsList = [], startingRegExp) =>
	strictValidString(fileName) && 
	strictValidArray(validExtensionsList) &&
	!!validExtensionsList.length &&
	concatenateRegularExpressions([
		(strictValidString(startingRegExp) && startingRegExp) || DEFAULT_VALID_BEGIN_FILE_NAME_REG_EXP,
		validExtensionsList.map(v => (strictValidString(v) && `.${v.toLowerCase()}`) || '').join('|'),
		'$'
	]).test(fileName.toLowerCase());

/**
 * Gets file extension
 * @param fileName: string
 */		
export const getFileExtension = fileName => (
	strictValidString(fileName) && 
	fileName.substring(fileName.lastIndexOf('.'), fileName.length)
) || '';

/**
 * Typecasts a relative url to absolute amazon S3Upload url based on 'S3Url' parameter of 'aws' object set in config 
 * @param relativeUrl: string
 */
export const getAbsoluteS3FileUrl = relativeUrl => (
	strictValidString(relativeUrl) &&
	validObjectWithParameterKeys(config, ['aws']) &&
	validObjectWithParameterKeys(config.aws, ['s3Url']) &&
	strictValidString(config.aws.s3Url) && 
	!relativeUrl.includes(config.aws.s3Url) && 
	`${config.aws.s3Url}/${relativeUrl}`
) || typeCastToString(relativeUrl);

/**
 * Typecasts a key value pair (k, v) to string and appends it to or appends a specified string value to it
 * based on appendAfter boolean variable 
 * @param k: string
 * @param v: string
 * @param appendString: string
 * @param appendAfter: boolean
 */
export const addKeyValuePairAsString = (k, v, appendString = '', appendAfter = true) => {
	let str = '';
	if (!appendAfter) {
		str += typeCastToString(appendString);
	}
	if (validValue(v)) {
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
	if (appendAfter) {
		str += typeCastToString(appendString);
	}
	return str;
};

/**
 * Typecasts an array to an pobject with 'text' & 'value' parameters needed for dropdown and add a default option if specified 
 * @param arr: array
 * @param useDefaultOptionFlag: boolean
 * @param defaultOption: string
 */
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

/**
 * Generates an integer array from minValue to maxValue
 * @param minValue: integer
 * @param maxValue: integer
 */
export const numericArrayGenerator = (minValue, maxValue) => {
	const numericArray = [];
	for (let i = minValue; i <= maxValue; i++) {
		numericArray.push(i);
	}
	return numericArray;
};

/**
 * Typecasts an immutable reducer object to its actual values
 * @param immutableObject: object
 * @param toCheckForValidParmeters: array
 */
export const typeCastToKeyValueObject = (immutableObject, toCheckForValidParmeters = []) => (
	strictValidArray(toCheckForValidParmeters) &&
	validObjectWithParameterKeys(immutableObject, toCheckForValidParmeters) &&
	immutableObject
) || (
	strictValidArray(toCheckForValidParmeters) &&
	strictValidObject(immutableObject) &&
	!validObjectWithParameterKeys(immutableObject, toCheckForValidParmeters) &&
	validObjectWithParameterKeys(immutableObject, ['size']) &&
  immutableObject.toJSON()
) || {};