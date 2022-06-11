const {findFifteenInterval} = require('../utils');

//// TEST 1 - < 15 minutes apart /
let test1Timestamp1 = "2021-06-21 13:46:04";
let test1Timestamp2 = "2021-06-21 13:59:53";
let expectedOutput1 = -1;

test('Less than 15 minutes apart', () => {
    expect(findFifteenInterval(test1Timestamp1, test1Timestamp2)).toBe(expectedOutput1)
});
//////////////////////////////////

/////// TEST 2 - On the hour /////
let test2Timestamp1 = "2021-06-21 14:45:07";
let test2Timestamp2 = "2021-06-21 15:01:25";
let expectedOutput2 = "2021-06-21 15:00:00";

test('On the hour', () => {
    expect(findFifteenInterval(test2Timestamp1, test2Timestamp2)).toBe(expectedOutput2)
});
//////////////////////////////////

/////// TEST 3 - Exact 15-minute intervals ////////////////////
let test3Timestamp1 = "2021-07-26 17:30:51";
let test3Timestamp2 = "2021-07-26 17:45:52";
let expectedOutput3 = "2021-07-26 17:45:00";

test('Exact 15-minute intervals', () => {
    expect(findFifteenInterval(test3Timestamp1, test3Timestamp2)).toBe(expectedOutput3)
});
//////////////////////////////////

/////// TEST 4 - outage ////////////////////
let test4Timestamp1 = "2021-07-14 19:00:20";
let test4Timestamp2 = "2021-07-15 08:27:46";
let expectedOutput4 = -1;

test('Outage', () => {
    expect(findFifteenInterval(test4Timestamp1, test4Timestamp2)).toBe(expectedOutput4)
});
//////////////////////////////////

/////// TEST 5 - More than 15 minutes apart, ordinary use case ////////////////////
let test5Timestamp1 = "2021-07-15 08:27:46";
let test5Timestamp2 = "2021-07-15 08:42:43";
let expectedOutput5 = "2021-07-15 08:30:00";

test('More than 15 minutes apart, ordinary use case', () => {
    expect(findFifteenInterval(test5Timestamp1, test5Timestamp2)).toBe(expectedOutput5)
});
//////////////////////////////////

