/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
    if(string=='')return '';
    if(size===0)return '';
    if(size==undefined)return string;
    let newString = '';
    let count = 0;
    for(let i = 0; i < string.length; i++){
        if (string[i] !== string[count]) {
          count = i;
        }
        if (i - count < size) {
          newString += string[i];
        }
    }
    return newString;
}
