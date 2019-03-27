import _ from 'lodash';

/**
 * deeply converts keys of an object following converterFunction
 * @param {object} object to convert
 * @param {function} function to convert key.
 * @return converted object
 */
const convertCase = (oldObject: any, converterFunction: any): any => {
  let newObject;

  if (
    !oldObject ||
    typeof oldObject !== 'object' ||
    !Object.keys(oldObject).length
  ) {
    return oldObject;
  }

  if (Array.isArray(oldObject)) {
    newObject = oldObject.map((element) =>
      convertCase(element, converterFunction),
    );
  } else {
    newObject = {};
    Object.keys(oldObject).forEach((oldKey) => {
      const newKey = converterFunction(oldKey);
      newObject[newKey] = convertCase(oldObject[oldKey], converterFunction);
    });
  }

  return newObject;
};

export const ToCamelCase = (obj: any) => convertCase(obj, _.camelCase);
export const ToSnakeCase = (obj: any) => convertCase(obj, _.snakeCase);
