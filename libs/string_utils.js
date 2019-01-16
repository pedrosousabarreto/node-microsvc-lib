/**
 * Created by pedro.barreto@bynder.com on 15/Jan/2019.
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Utility function to create a K:V from a list of strings
 * source: https://basarat.gitbooks.io/typescript/docs/types/literal-types.html
 * */
// @ts-ignore
function strEnum(o) {
    // @ts-ignore
    // @ts-ignore
    return o.reduce((res, key) => {
        res[key] = key;
        return res;
    }, Object.create(null));
}
exports.strEnum = strEnum;
// @ts-ignore
const guid_regex = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
function is_guid(str) {
    return guid_regex.exec(str) !== null;
}
exports.is_guid = is_guid;
