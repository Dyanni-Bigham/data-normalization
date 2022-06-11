const {epochDifference} = require('../utils');

//////// Test 1 //////////////////
let test1epoch1 = 1624309193;
let test1epoch2 = 1624309200;
let test1mid = 1624310094;
let expectedOutput1 = [901,7];
let msg1 = "Test 1";

test(msg1, () => {
    expect(epochDifference(test1epoch1, test1mid, test1epoch2))
    .toStrictEqual(expectedOutput1); // toStrictEqual is needed since it is tested for an object
});
//////////////////////////////////

//////// Test 2 //////////////////
let test2epoch1 = 1624323711;
let test2epoch2 = 1624324613;
let test2mid = 1624324500;
let expectedOutput2 = [789, 902];
let msg2 = "Test 2";

test(msg2, () => {
    expect(epochDifference(test2epoch1, test2mid, test2epoch2))
    .toStrictEqual(expectedOutput2);
});
//////////////////////////////////

//////// Test 3 //////////////////
let test3epoch1 = 1624330928;
let test3epoch2 = 1624332635;
let test3mid = 1624332600;
let expectedOutput3 = [1672, 1707];
let msg3 = "Test 3";

test(msg3, () => {
    expect(epochDifference(test3epoch1, test3mid, test3epoch2))
    .toStrictEqual(expectedOutput3);
});
//////////////////////////////////