const {isValidThreshold} = require('../utils');

//////// Test 1 //////////////////
let test1timestamp1 = "2021-06-21 13:59:53";
let test1timestamp2 = "2021-06-21 14:14:54";
let expectedOutput1 = true;
let msg = "Test 1";

 test(msg, () => {
     expect(isValidThreshold(test1timestamp1,test1timestamp2))
     .toBe(expectedOutput1);
 });
//////////////////////////////////

//////// Test 2 //////////////////
let test2timestamp1 = "2021-06-21 15:16:15";
let test2timestamp2 = "2021-06-21 15:45:41";
let expectedOutput2 = false;
let msg2 = "Test 2 - outage";

test(msg2, () => {
    expect(isValidThreshold(test2timestamp1, test2timestamp2))
    .toBe(expectedOutput2);
});
//////////////////////////////////

//////// Test 3 //////////////////
let test3timestamp1 = "2021-06-21 17:16:03";
let test3timestamp2 = "2021-06-21 17:31:03";
let expectedOutput3 = true;
let msg3 = "Test 4";

test(msg3, () => {
    expect(isValidThreshold(test3timestamp1, test3timestamp2))
    .toBe(expectedOutput3);
});
//////////////////////////////////