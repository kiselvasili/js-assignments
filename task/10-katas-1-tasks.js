'use strict';

/**
 * Returns the array of 32 compass points and heading.
 * See details here:
 * https://en.wikipedia.org/wiki/Points_of_the_compass#32_cardinal_points
 *
 * @return {array}
 *
 * Example of return :
 *  [
 *     { abbreviation : 'N',     azimuth : 0.00 ,
 *     { abbreviation : 'NbE',   azimuth : 11.25 },
 *     { abbreviation : 'NNE',   azimuth : 22.50 },
 *       ...
 *     { abbreviation : 'NbW',   azimuth : 348.75 }
 *  ]
 */
function createCompassPoints() {
    let sides = ['N', 'E', 'S', 'W'];  // use array of cardinal directions only!
    let result = [];
    for (let i = 0; i < sides.length; i++) {
        result[i * 8] = sides[i];
        if (i === sides.length - 1) {
            fourthAzimut(i, -1);
        }
        else {
            fourthAzimut(i, i);
        }
    }
    function halfAzimuth(a, b, i) {
        return i % 2 ? b + a : a + b;
    }
    function fourthAzimut(i, z) {
        result[i * 8 + 4] = halfAzimuth(sides[i], sides[z + 1], i);
        result[i * 8 + 2] = sides[i] + result[i * 8 + 4];
        result[i * 8 + 6] = sides[z + 1] + result[i * 8 + 4];
        result[i * 8 + 1] = `${sides[i]}b${sides[z + 1]}`;
        result[i * 8 + 7] = `${sides[z + 1]}b${sides[i]}`;
        result[i * 8 + 3] = `${result[i * 8 + 4]}b${sides[i]}`;
        result[i * 8 + 5] = `${result[i * 8 + 4]}b${sides[z + 1]}`;
    }
    return result.map((x, i)=> {
        return {
            abbreviation: x,
            azimuth: i * 11.25
        }
    })
}


/**
 * Expand the braces of the specified string.
 * See https://en.wikipedia.org/wiki/Bash_(Unix_shell)#Brace_expansion
 *
 * In the input string, balanced pairs of braces containing comma-separated substrings
 * represent alternations that specify multiple alternatives which are to appear at that position in the output.
 *
 * @param {string} str
 * @return {Iterable.<string>}
 *
 * NOTE: The order of output string does not matter.
 *
 * Example:
 *   '~/{Downloads,Pictures}/*.{jpg,gif,png}'  => '~/Downloads/*.jpg',
 *                                                '~/Downloads/*.gif'
 *                                                '~/Downloads/*.png',
 *                                                '~/Pictures/*.jpg',
 *                                                '~/Pictures/*.gif',
 *                                                '~/Pictures/*.png'
 *
 *   'It{{em,alic}iz,erat}e{d,}, please.'  => 'Itemized, please.',
 *                                            'Itemize, please.',
 *                                            'Italicized, please.',
 *                                            'Italicize, please.',
 *                                            'Iterated, please.',
 *                                            'Iterate, please.'
 *
 *   'thumbnail.{png,jp{e,}g}'  => 'thumbnail.png'
 *                                 'thumbnail.jpeg'
 *                                 'thumbnail.jpg'
 *
 *   'nothing to do' => 'nothing to do'
 */
function* expandBraces(str) {
    let queue = [str],
        val,
        match,
        arr,
        regex = "\{([0-9a-zA-Z\.,]+)\}";

    while (1) {
        val = queue.shift();
        match = val.match(regex);

        if (match == null) {
            queue.push(val);
            break;
        }

        arr = match[1].split(',');

        for (let i = 0; i < arr.length; i++)
            queue.push(val.replace(match[0], arr[i]));
    }

    queue = queue.filter((x, i, queue) => queue.indexOf(x) == i);

    while (queue.length)
        yield queue.pop();
}


/**
 * Returns the ZigZag matrix
 *
 * The fundamental idea in the JPEG compression algorithm is to sort coefficient of given image by zigzag path and encode it.
 * In this task you are asked to implement a simple method to create a zigzag square matrix.
 * See details at https://en.wikipedia.org/wiki/JPEG#Entropy_coding
 * and zigzag path here: https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/JPEG_ZigZag.svg/220px-JPEG_ZigZag.svg.png
 *
 * @param {number} n - matrix dimension
 * @return {array}  n x n array of zigzag path
 *
 * @example
 *   1  => [[0]]
 *
 *   2  => [[ 0, 1 ],
 *          [ 2, 3 ]]
 *
 *         [[ 0, 1, 5 ],
 *   3  =>  [ 2, 4, 6 ],
 *          [ 3, 7, 8 ]]
 *
 *         [[ 0, 1, 5, 6 ],
 *   4 =>   [ 2, 4, 7,12 ],
 *          [ 3, 8,11,13 ],
 *          [ 9,10,14,15 ]]
 *
 */
function getZigZagMatrix(n) {
    let resultArray = Array.from({'length': n}, () => []),
        val = 0,
        diagonal = 2 * n - 1,
        x;
    for (let i = 0; i < diagonal; i++) {
        for (let j = 0; j < n; j++) {
            if (i % 2 === 0) {
                x = i - j;
            }
            else {
                x = i - (n - j - 1);
            }
            if (x >= 0 && x < n) {
                resultArray[x].push(val++);
            }
        }

    }
    return resultArray;
}


/**
 * Returns true if specified subset of dominoes can be placed in a row accroding to the game rules.
 * Dominoes details see at: https://en.wikipedia.org/wiki/Dominoes
 *
 * Each domino tile presented as an array [x,y] of tile value.
 * For example, the subset [1, 1], [2, 2], [1, 2] can be arranged in a row (as [1, 1] followed by [1, 2] followed by [2, 2]),
 * while the subset [1, 1], [0, 3], [1, 4] can not be arranged in one row.
 * NOTE that as in usual dominoes playing any pair [i, j] can also be treated as [j, i].
 *
 * @params {array} dominoes
 * @return {bool}
 *
 * @examplewdd
 *
 * [[0,1],  [1,1]] => true
 * [[1,1], [2,2], [1,5], [5,6], [6,3]] => false
 * [[1,3], [2,3], [1,4], [2,4], [1,5], [2,5]]  => true
 * [[0,0], [0,1], [1,1], [0,2], [1,2], [2,2], [0,3], [1,3], [2,3], [3,3]] => false
 *
 */
function canDominoesMakeRow(dominoes) {
    let doubleBone=[],
        arr=dominoes.filter((x)=>{
        if(x[0]===x[1]){
            doubleBone.push(x[0]);
        }
        else {
            return x;
        }
    });
    let count=0;
    arr=arr.join().split(',').sort();
    doubleBone.forEach((x)=>{
        if(arr.some(z=>(z==x))){
            count++;
        }

    });
    if(count!=doubleBone.length){

        return false;
    }
    let count2=1,
        oddCount=0;
    for (let i=0;i<arr.length-1;i++){
        if(arr[i]===arr[i+1]){
            count2++
        }
        else {
            if(count2%2!=0){
                oddCount++;
                count2=1;
            }
            else{
                count2=1;
            }
        }
    }
    return oddCount<3;
}


/**
 * Returns the string expression of the specified ordered list of integers.
 *
 * A format for expressing an ordered list of integers is to use a comma separated list of either:
 *   - individual integers
 *   - or a range of integers denoted by the starting integer separated from the end integer in the range by a dash, '-'.
 *     (The range includes all integers in the interval including both endpoints)
 *     The range syntax is to be used only for, and for every range that expands to more than two values.
 *
 * @params {array} nums
 * @return {bool}
 *
 * @example
 *
 * [ 0, 1, 2, 3, 4, 5 ]   => '0-5'
 * [ 1, 4, 5 ]            => '1,4,5'
 * [ 0, 1, 2, 5, 7, 8, 9] => '0-2,5,7-9'
 * [ 1, 2, 4, 5]          => '1,2,4,5'
 */
function extractRanges(nums) {
    var result = '';
    for (var i = 0; i < nums.length - 1; i++) {
        var j = i;

        while (nums[j] === nums[j + 1] - 1)
            j++;

        if (nums[i] + 1 !== nums[i + 1] && i !== nums.length - 2) {
            result += `${ nums[i] },`;
        }
        else {
            if (nums[i] + 1 === nums[i + 1] && nums[i] + 2 !== nums[i + 2]) {
                result += `${ nums[i] },${ nums[i + 1] },`;
            }
            else {
                result += `${ nums[i] }-${ nums[j] },`;
            }
        }
        i = j;
    }
    return result.slice(0, -1);
}

module.exports = {
    createCompassPoints: createCompassPoints,
    expandBraces: expandBraces,
    getZigZagMatrix: getZigZagMatrix,
    canDominoesMakeRow: canDominoesMakeRow,
    extractRanges: extractRanges
};
