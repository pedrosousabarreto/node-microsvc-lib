/**
 * Created by pedro.barreto@bynder.com on 15/Jan/2019.
 */
"use strict";

/**
 * Utility function to create a K:V from a list of strings
 * source: https://basarat.gitbooks.io/typescript/docs/types/literal-types.html
 * */
export function strEnum<T extends string>(o: Array<T>): {[K in T]: K} {
	return o.reduce((res, key) => {
		res[key] = key;
		return res;
	}, Object.create(null));
}

const guid_regex: RegExp = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

export function is_guid(str:string):boolean{
	return guid_regex.exec(str) !== null;
}