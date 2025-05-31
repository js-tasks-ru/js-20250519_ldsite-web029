/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */

export function createGetter(path) {
    return function (obj) {
        if (path.length == 0 || !path) {
            return undefined;
        }
        const keys = path.split('.');
        let myObj = obj;
        for(const key of keys){
            if(!Object.hasOwn(myObj, key)) return;
            myObj = myObj[key];
        }
        return myObj;
    }
}
