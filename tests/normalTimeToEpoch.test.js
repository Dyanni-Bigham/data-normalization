const {normalTimeToEpoch} = require('../utils');

//////// Test 1 //////////////////
let test1Timestamp = "2021-08-13 02:01:58";
let expectedOutput1 = 1628845318;
let msg1 = "epoch of 2021-08-13 02:01:58 is 1628845318";

test(msg1, () => {
    expect(normalTimeToEpoch(test1Timestamp)).toBe(expectedOutput1);
});
//////////////////////////////////

//////// Test 2 //////////////////
let test2Timestamp = "2021-08-13 04:16:58";
let expectedOutput2 = 1628853418;
let msg2 = "epoch of 2021-08-13 04:16:58 is 1628853418"
test(msg2, () => {
    expect(normalTimeToEpoch(test2Timestamp)).toBe(expectedOutput2);
});
//////////////////////////////////

//////// Test 3 //////////////////
let test3Timestamp = "2021-08-13 07:32:12";
let expectedOutput3 = 1628865132;
let msg3 = "epoch of 2021-08-13 07:32:12 is 1628865132";
test(msg3, () => {
    expect(normalTimeToEpoch(test3Timestamp)).toBe(expectedOutput3);
});
//////////////////////////////////