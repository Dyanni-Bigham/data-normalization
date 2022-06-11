const {difference} = require('../utils');

/////// TEST 1 ////////////////////
let msg = "subtract 3 - 1 to equal 2";
test(msg, () => {
    expect(difference(3,1)).toBe(2)
});
//////////////////////////////////

/////// TEST 2 ////////////////////
let msg2 = "subtract 7 - 3 to equal 4"
test(msg2, () => {
    expect(difference(7,3)).toBe(4);
});
//////////////////////////////////

/////// TEST 3 ////////////////////
let msg3 = "subtract 14 - 9 to equal 5"
test(msg3, () => {
    expect(difference(14,9)).toBe(5);
});
//////////////////////////////////