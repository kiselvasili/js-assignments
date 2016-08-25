'use strict';

/**
 * Returns the bank account number parsed from specified string.
 *
 * You work for a bank, which has recently purchased an ingenious machine to assist in reading letters and faxes sent in by branch offices.
 * The machine scans the paper documents, and produces a string with a bank account that looks like this:
 *
 *    _  _     _  _  _  _  _
 *  | _| _||_||_ |_   ||_||_|
 *  ||_  _|  | _||_|  ||_| _|
 *
 * Each string contains an account number written using pipes and underscores.
 * Each account number should have 9 digits, all of which should be in the range 0-9.
 *
 * Your task is to write a function that can take bank account string and parse it into actual account numbers.
 *
 * @param {string} bankAccount
 * @return {number}
 *
 * Example of return :
 *
 *   '    _  _     _  _  _  _  _ \n'+
 *   '  | _| _||_||_ |_   ||_||_|\n'+     =>  123456789
 *   '  ||_  _|  | _||_|  ||_| _|\n'
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '| | _| _|| ||_ |_   ||_||_|\n'+     => 23056789
 *   '|_||_  _||_| _||_|  ||_| _|\n',
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '|_| _| _||_||_ |_ |_||_||_|\n'+     => 823856989
 *   '|_||_  _||_| _||_| _||_| _|\n',
 *
 */
function parseBankAccount(bankAccount) {
    let numberArr={
        ' _ | ||_|':'0',
        '     |  |':'1',
        ' _  _||_ ':'2',
        ' _  _| _|':'3',
        '   |_|  |':'4',
        ' _ |_  _|':'5',
        ' _ |_ |_|':'6',
        ' _   |  |':'7',
        ' _ |_||_|':'8',
        ' _ |_| _|':'9'
    };
    let result='',
        lengthLine = bankAccount.length/3,
        numberCount=(lengthLine-1)/3,
        num='',
        stepNumber=0;
    for (let i=0;i<numberCount;i++)
    {
        let stepLine=0;
        for (let j=0;j<3;j++)
        {
            num+=bankAccount.substring(stepNumber+stepLine, stepNumber+stepLine + 3);
            stepLine+=lengthLine;
        }
        result+=numberArr[num];
        num='';
        stepNumber+=3
    }
    return parseInt(result);
}


/**
 * Returns the string, but with line breaks inserted at just the right places to make sure that no line is longer than the specified column number.
 * Lines can be broken at word boundaries only.
 *
 * @param {string} text
 * @param {number} columns
 * @return {Iterable.<string>}
 *
 * @example :
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 26 =>  'The String global object',
 *                                                                                                'is a constructor for',
 *                                                                                                'strings, or a sequence of',
 *                                                                                                'characters.'
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 12 =>  'The String',
 *                                                                                                'global',
 *                                                                                                'object is a',
 *                                                                                                'constructor',
 *                                                                                                'for strings,',
 *                                                                                                'or a',
 *                                                                                                'sequence of',
 *                                                                                                'characters.'
 */
function* wrapText(text, columns) {
    while (text.length) {
        let val = columns;

        if (text.length > val){
            while (text[val] !== " ")
                val--;
        }

        yield text.slice(0, val);

        val++;
        text = text.slice(val);
    }
}


/**
 * Returns the rank of the specified poker hand.
 * See the ranking rules here: https://en.wikipedia.org/wiki/List_of_poker_hands.
 *
 * @param {array} hand
 * @return {PokerRank} rank
 *
 * @example
 *   [ '4♥','5♥','6♥','7♥','8♥' ] => PokerRank.StraightFlush
 *   [ 'A♠','4♠','3♠','5♠','2♠' ] => PokerRank.StraightFlush
 *   [ '4♣','4♦','4♥','4♠','10♥' ] => PokerRank.FourOfKind
 *   [ '4♣','4♦','5♦','5♠','5♥' ] => PokerRank.FullHouse
 *   [ '4♣','5♣','6♣','7♣','Q♣' ] => PokerRank.Flush
 *   [ '2♠','3♥','4♥','5♥','6♥' ] => PokerRank.Straight
 *   [ '2♥','4♦','5♥','A♦','3♠' ] => PokerRank.Straight
 *   [ '2♥','2♠','2♦','7♥','A♥' ] => PokerRank.ThreeOfKind
 *   [ '2♥','4♦','4♥','A♦','A♠' ] => PokerRank.TwoPairs
 *   [ '3♥','4♥','10♥','3♦','A♠' ] => PokerRank.OnePair
 *   [ 'A♥','K♥','Q♥','2♦','3♠' ] =>  PokerRank.HighCard
 */
const PokerRank = {
    StraightFlush: 8,
    FourOfKind: 7,
    FullHouse: 6,
    Flush: 5,
    Straight: 4,
    ThreeOfKind: 3,
    TwoPairs: 2,
    OnePair: 1,
    HighCard: 0
};

function getPokerHandRank(hand) {
    var cards={'02':0,'03':1,'04':2,'05':3,'06':4,'07':5,'08':6,'09':7,'10':8,'0J':9,'0Q':10,'0K':11,'0A':12};

    function info(hand){

        var count=1;
        var u=[];
        var suitCount=1;
        var row;
        var combo;
        var hand =hand.map(x=>(x[0]!=1?'0'+x:x)).sort((a,b)=>(cards[a[0]+a[1]]>cards[b[0]+b[1]]));
        if ((hand[4].slice(0,2)==='0A' && hand[0].slice(0,2)==='02' && cards[hand[3].slice(0,2)]-cards[hand[0].slice(0,2)]===3) ||
            ((cards[hand[4][0]+hand[4][1]]-cards[hand[0][0]+hand[0][1]])===4)) {
            row=true;
        }
        else{
            row=false;
        }

        hand.reduce((a,b,i)=>{
            if(a[0]+a[1]===b[0]+b[1]){
                count++
            }
            else{
                u.push(count);
                count=1;
            }
            if(i===4){
                u.push(count)
            }
            if (a[2]===b[2]){
                suitCount++
            }
            return b;

        });
        combo=u.sort().join('');

        if(row && suitCount===5 && combo=='11111'){
            return PokerRank.StraightFlush;
        }else{
            if(suitCount!==5 && combo=='14'){
                return PokerRank.FourOfKind;
            }else {
                if(suitCount!==5 && combo=='23'){
                    return PokerRank.FullHouse;
                }else {
                    if(!row && suitCount===5 && combo=='11111'){
                        return PokerRank.Flush;
                    }else {
                        if(row && suitCount!==5 && combo=='11111'){
                            return PokerRank.Straight;
                        }else {
                            if(suitCount!==5 && combo=='113'){
                                return PokerRank.ThreeOfKind;
                            }else {
                                if(suitCount!==5 && combo=='122'){
                                    return PokerRank.TwoPairs;
                                }else {
                                    if(suitCount!==5 && combo=='1112'){
                                        return PokerRank.OnePair;
                                    }else {
                                        if(!row && suitCount!==5 && combo=='11111'){
                                            return PokerRank.HighCard;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return info(hand);
}


/**
 * Returns the rectangles sequence of specified figure.
 * The figure is ASCII multiline string comprised of minus signs -, plus signs +, vertical bars | and whitespaces.
 * The task is to break the figure in the rectangles it is made of.
 *
 * NOTE: The order of rectanles does not matter.
 * 
 * @param {string} figure
 * @return {Iterable.<string>} decomposition to basic parts
 * 
 * @example
 *
 *    '+------------+\n'+
 *    '|            |\n'+
 *    '|            |\n'+              '+------------+\n'+
 *    '|            |\n'+              '|            |\n'+         '+------+\n'+          '+-----+\n'+
 *    '+------+-----+\n'+       =>     '|            |\n'+     ,   '|      |\n'+     ,    '|     |\n'+
 *    '|      |     |\n'+              '|            |\n'+         '|      |\n'+          '|     |\n'+
 *    '|      |     |\n'               '+------------+\n'          '+------+\n'           '+-----+\n'
 *    '+------+-----+\n'
 *
 *
 *
 *    '   +-----+     \n'+
 *    '   |     |     \n'+                                    '+-------------+\n'+
 *    '+--+-----+----+\n'+              '+-----+\n'+          '|             |\n'+
 *    '|             |\n'+      =>      '|     |\n'+     ,    '|             |\n'+
 *    '|             |\n'+              '+-----+\n'           '+-------------+\n'
 *    '+-------------+\n'
 */
function* getFigureRectangles(figure) {
    var lines = figure.split('\n');
    while(lines.length > 2) {
        let buf = lines.shift(),
            high = buf.lastIndexOf('+'),
            counter1 = 0;
        while (counter1 < high) {
            let z = -1;
            do {
                z = buf.indexOf('+', counter1);
                var con1 = lines[0][z],
                    flag = (con1 !== '+') && (con1 !== '|');
                counter1 = z + 1;
            } while(flag);
            if(z === -1) {
                break;
            }
            var c = z;
            do {
                counter1 = buf.indexOf('+',c + 1);
                var con2 = lines[0][counter1];
                var flag = (con2 !== '+') && (con2 !== '|');
                c = counter1;
            } while(flag && (counter1 !== -1));
            if(counter1 === -1) {
                break
            }
            var b = counter1 - z + 1;
            var h = lines.findIndex(x => x[z] === '+' && x[counter1] === '+') + 2;

            yield Figure(b, h);
        }
    }

    function Figure(w, h) {
        var line = `+${'-'.repeat(w - 2)}+\n`,
            result = (`|${' '.repeat(w - 2)}|\n`).repeat(h - 2);
        return line + result + line;
    }
}


module.exports = {
    parseBankAccount : parseBankAccount,
    wrapText: wrapText,
    PokerRank: PokerRank,
    getPokerHandRank: getPokerHandRank,
    getFigureRectangles: getFigureRectangles
};
