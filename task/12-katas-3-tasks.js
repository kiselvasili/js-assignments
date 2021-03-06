'use strict';

/**
 * Returns true if word occurrs in the specified word snaking puzzle.
 * Each words can be constructed using "snake" path inside a grid with top, left, right and bottom directions
 *
 * @param {array} puzzle
 * @param {array} searchStr
 * @return {bool}
 *
 * @example
 *   var puzzle = [
 *      'ANGULAR',
 *      'REDNCAE',
 *      'RFIDTCL',
 *      'AGNEGSA',
 *      'YTIRTSP',
 *   ];
 *   'ANGULAR'   => true   (first row)
 *   'REACT'     => true   (starting from the top-right R adn follow the ↓ ← ← ↓ )
 *   'UNDEFINED' => true
 *   'RED'       => true
 *   'STRING'    => true
 *   'CLASS'     => true
 *   'ARRAY'     => true   (first column)
 *   'FUNCTION'  => false
 *   'NULL'      => false
 */
function findStringInSnakingPuzzle(puzzle, searchStr) {
    let height = puzzle.length,
        width = puzzle[0].length,
        repeatedLetters = Array.from({length: width}, () => new Array(height).fill(false));

    function checking(a, b) {
        if ((a.i == b.i && a.j == b.j + 1) ||
            (a.i == b.i && a.j == b.j - 1) ||
            (a.i == b.i + 1 && a.j == b.j) ||
            (a.i == b.i - 1 && a.j == b.j)) {
            return true;
        }
    }

    function findAllLetter(puzzle, letter) {
        let lettersArr = [];

        for (let i = 0; i < puzzle.length; i++) {
            for (let j = 0; j < puzzle[i].length; j++) {
                if (puzzle[i][j] == letter) {
                    lettersArr.push({
                        'i': i,
                        'j': j
                    })
                }
            }
        }
        return lettersArr;
    }

    let firstLetterArray = findAllLetter(puzzle, searchStr[0]);

    for (let i = 0; i < firstLetterArray.length; i++) {
        let counter = 1;
        repeatedLetters[firstLetterArray[i].i][firstLetterArray[i].j] = true;
        if (snakeMethod(firstLetterArray[i], findAllLetter(puzzle, searchStr[1]), counter)) {
            return true;
        }
        else {
            repeatedLetters[firstLetterArray[i].i][firstLetterArray[i].j] = false;
        }
    }

    function snakeMethod(letter, nextLetterArr, finalCounter) {
        let count = finalCounter;

        for (let i = 0; i < nextLetterArr.length; i++) {

            if (checking(letter, nextLetterArr[i]) && !repeatedLetters[nextLetterArr[i].i][nextLetterArr[i].j]) {

                count++;

                repeatedLetters[nextLetterArr[i].i][nextLetterArr[i].j] = true;

                if (count == searchStr.length) {
                    return true;
                }

                if (snakeMethod(nextLetterArr[i], findAllLetter(puzzle, searchStr[count]), count)) {
                    return true;
                }
                else {
                    count--;
                    repeatedLetters[nextLetterArr[i].i][nextLetterArr[i].j] = false;
                }
            }
        }
    }
}


/**
 * Returns all permutations of the specified string.
 * Assume all chars in the specified string are different.
 * The order of permutations does not matter.
 *
 * @param {string} chars
 * @return {Iterable.<string>} all posible strings constructed with the chars from the specfied string
 *
 * @example
 *    'ab'  => 'ab','ba'
 *    'abc' => 'abc','acb','bac','bca','cab','cba'
 */
function* getPermutations(chars) {
    var permArr = [],
        usedChars = [];

    function permute(input) {
        var i, ch;
        for (i = 0; i < input.length; i++) {
            ch = input.splice(i, 1)[0];
            usedChars.push(ch);
            if (input.length == 0) {
                permArr.push(usedChars.slice().join(''));
            }
            permute(input);
            input.splice(i, 0, ch);
            usedChars.pop();
        }
        return permArr
    }

    var results = permute(chars.split(''));
    for (var i = 0; i < results.length; i++) {
        yield results[i];
    }
}


/**
 * Returns the most profit from stock quotes.
 * Stock quotes are stores in an array in order of date.
 * The stock profit is the difference in prices in buying and selling stock.
 * Each day, you can either buy one unit of stock, sell any number of stock units you have already bought, or do nothing.
 * Therefore, the most profit is the maximum difference of all pairs in a sequence of stock prices.
 *
 * @param {array} quotes
 * @return {number} max profit
 *
 * @example
 *    [ 1, 2, 3, 4, 5, 6]   => 15  (buy at 1,2,3,4,5 and then sell all at 6)
 *    [ 6, 5, 4, 3, 2, 1]   => 0   (nothing to buy)
 *    [ 1, 6, 5, 10, 8, 7 ] => 18  (buy at 1,6,5 and sell all at 10)
 */
function getMostProfitFromStockQuotes(quotes) {
    let last = quotes[quotes.length - 1];
    return quotes.reverse().reduce((a, b) => {
        last = Math.max(last, b);
        return a + last - b;
    }, 0);
}


/**
 * Class representing the url shorting helper.
 * Feel free to implement any algorithm, but do not store link in the key\value stores.
 * The short link can be at least 1.5 times shorter than the original url.
 *
 * @class
 *
 * @example
 *
 *     var urlShortener = new UrlShortener();
 *     var shortLink = urlShortener.encode('https://en.wikipedia.org/wiki/URL_shortening');
 *     var original  = urlShortener.decode(shortLink); // => 'https://en.wikipedia.org/wiki/URL_shortening'
 *
 */
function UrlShortener() {
    this.urlAllowedChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
        "abcdefghijklmnopqrstuvwxyz" +
        "0123456789-_.~!*'();:@&=+$,/?#[]";
}

UrlShortener.prototype = {
    encode: function (url) {
        let result = '';
        for (let i = 0; i < url.length; i += 2) {
            result += String.fromCharCode((url.charCodeAt(i) << 8) | url.charCodeAt(i + 1));
        }
        return result;
    },

    decode: function (code) {
        let result = '';
        for (let i = 0; i < code.length; i++) {
            let char = parseInt(code.charCodeAt(i), 10),
                b = char & 255,
                a = (char >> 8) & 255;
            result += !b ? String.fromCharCode(a) : String.fromCharCode(a) + String.fromCharCode(b);
        }
        return result;
    }
};


module.exports = {
    findStringInSnakingPuzzle: findStringInSnakingPuzzle,
    getPermutations: getPermutations,
    getMostProfitFromStockQuotes: getMostProfitFromStockQuotes,
    UrlShortener: UrlShortener
};
