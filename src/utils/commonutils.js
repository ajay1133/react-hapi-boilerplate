export const strictValidArrayWithLength = arr => arr && Array.isArray(arr) && !!arr.length;

export const strictValidObject = obj => obj && obj === Object(obj) &&
Object.prototype.toString.call(obj) !== '[object Array]';

export const strictValidObjectWithKeys = obj => strictValidObject(obj) && Object.keys(obj).length;

export const strictValidString = str => str && typeof str === 'string';

export const strictValidSplittableStringWithMinLength = (str, delimeter, minLength) => strictValidString(str) &&
Array.isArray(str.split(delimeter)) && str.split(delimeter).length >= minLength;

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

export const validFileName = (fileName, validExtensionsList = []) => fileName && Array.isArray(validExtensionsList) &&
!!validExtensionsList.length &&
concatenateRegularExpressions(['^[_|0-9|a-z|A-Z]+.', validExtensionsList.join('|'), '$']).test(fileName);

export const validObjectWithParameterKeys = (obj, parameterKeys = []) => strictValidObjectWithKeys(obj) &&
strictValidArrayWithLength(parameterKeys) && !!Object.keys(obj).filter(k => parameterKeys.indexOf(k) > -1).length;