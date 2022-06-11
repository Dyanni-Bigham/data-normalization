const { linearCalc } = require('../utils');
const { ObjectId } = require('mongodb');

//////// Test 1 //////////////////
let test1document1 = {
    _id: new ObjectId("60d0fe57b198de7b8e8859a2"),
    value: 1311780,
    id: 'pe:DA_AI_01/0',
    building: '54',
    utility: 'h2o',
    type: 'consum',
    meterIndex: '0',
    timestamp: '2021-06-21 13:59:53'
};

let test1document2 = {
    _id: new ObjectId("60d101dab198de7b8e8859bb"),
    value: 1311780,
    id: 'pe:DA_AI_01/0',
    building: '54',
    utility: 'h2o',
    type: 'consum',
    meterIndex: '0',
    timestamp: '2021-06-21 14:14:54'
};

let timeToInsert1 = "2021-06-21 14:00:00";
let expectedOutput1 = 1311780;
let msg1 = "Test 1";

test(msg1, () => {
    expect(linearCalc(test1document1, test1document2, timeToInsert1))
        .toBe(expectedOutput1);
});
//////////////////////////////////

//////// Test 2 //////////////////
let test2document1 = {
    _id: new ObjectId("60d10c69b198de7b8e885a32"),
    value: 1311800,
    id: 'pe:DA_AI_01/0',
    building: '54',
    utility: 'h2o',
    type: 'consum',
    meterIndex: '0',
    timestamp: '2021-06-21 15:01:25'
};

let test2document2 = {
    _id: new ObjectId("60d10feab198de7b8e885a33"),
    value: 1311830,
    id: 'pe:DA_AI_01/0',
    building: '54',
    utility: 'h2o',
    type: 'consum',
    meterIndex: '0',
    timestamp: '2021-06-21 15:16:15'
};

let timeToInsert2 = "2021-06-21 15:15:00";
let expectedOutput2 = 1311827.472;
let msg2 = "Test 2";

test(msg2, () => {
    expect(linearCalc(test2document1, test2document2, timeToInsert2))
        .toBe(expectedOutput2);
});
//////////////////////////////////

//////// Test 3 //////////////////

let test3document1 = {
    _id: new ObjectId("60d108e2b198de7b8e8859f7"),
    value: 1311790,
    id: 'pe:DA_AI_01/0',
    building: '54',
    utility: 'h2o',
    type: 'consum',
    meterIndex: '0',
    timestamp: '2021-06-21 14:45:07'
}

let test3document2 = {
    _id: new ObjectId("60d10c69b198de7b8e885a32"),
    value: 1311800,
    id: 'pe:DA_AI_01/0',
    building: '54',
    utility: 'h2o',
    type: 'consum',
    meterIndex: '0',
    timestamp: '2021-06-21 15:01:25'
}
let timeToInsert3 = "2021-06-21 15:00:00";
let expectedOutput3 = 1311799.131;
let msg3 = "Test 3";

test(msg3, () => {
    expect(linearCalc(test3document1, test3document2, timeToInsert3))
        .toBe(expectedOutput3);
});
