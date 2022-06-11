const {documentBuilderHelper} = require('../utils');
const {ObjectId} = require('mongodb');

let testDocuments = [
    {
        _id: new ObjectId("60d0fe57b198de7b8e8859a2"),
        value: 1311780,
        id: 'pe:DA_AI_01/0',
        building: '54',
        utility: 'h2o',
        type: 'consum',
        meterIndex: '0',
        timestamp: '2021-06-21 13:59:53'
      },
      {
        _id: new ObjectId("60d101dab198de7b8e8859bb"),
        value: 1311780,
        id: 'pe:DA_AI_01/0',
        building: '54',
        utility: 'h2o',
        type: 'consum',
        meterIndex: '0',
        timestamp: '2021-06-21 14:14:54'
      },
      {
        _id: new ObjectId("60d11a79b198de7b8e885aaa"),
        value: 1311840,
        id: 'pe:DA_AI_01/0',
        building: '54',
        utility: 'h2o',
        type: 'consum',
        meterIndex: '0',
        timestamp: '2021-06-21 16:01:33'
      },
      {
        _id: new ObjectId("60d12181b198de7b8e885ae6"),
        value: 1311850,
        id: 'pe:DA_AI_01/0',
        building: '54',
        utility: 'h2o',
        type: 'consum',
        meterIndex: '0',
        timestamp: '2021-06-21 16:30:57'
      },
      {
        _id: new ObjectId("60d144a5b198de7b8e885bf5"),
        value: 1311900,
        id: 'pe:DA_AI_01/0',
        building: '54',
        utility: 'h2o',
        type: 'consum',
        meterIndex: '0',
        timestamp: '2021-06-21 19:02:00'
      },
      {
        _id: new ObjectId("60d14829b198de7b8e885c13"),
        value: 1311900,
        id: 'pe:DA_AI_01/0',
        building: '54',
        utility: 'h2o',
        type: 'consum',
        meterIndex: '0',
        timestamp: '2021-06-21 19:16:52'
      }
];

/////// TEST 1 ////////////////////
let expectedOutput1 = {value:1311780,
id:"pe:DA_AI_01/0",
building:"54",
utility:"h2o",
type:"consum",
meterIndex:"0",
timestamp:"2021-06-21 14:00:00"};
let timestamp1 = "2021-06-21 14:00:00";
let msg = "Test 1";

test(msg, () => {
    expect(documentBuilderHelper(testDocuments[0],testDocuments[1],timestamp1))
    .toStrictEqual(expectedOutput1);
});

//////////////////////////////////

/////// TEST 2 ////////////////////
let expectedOutput2 = {value:1311844.575,
id:"pe:DA_AI_01/0",
building:"54",
utility:"h2o",
type:"consum",
meterIndex:"0",
timestamp:"2021-06-21 16:15:00"};
let timestamp2 = "2021-06-21 16:15:00";
let msg2 = "Test 2";

test(msg2, () => {
    expect(documentBuilderHelper(testDocuments[2], testDocuments[3], timestamp2))
    .toStrictEqual(expectedOutput2);
});
//////////////////////////////////

/////// TEST 3 ////////////////////
let expectedOutput3 = {value:1311900,
id:"pe:DA_AI_01/0",
building:"54",
utility:"h2o",
type:"consum",
meterIndex:"0",
timestamp:"2021-06-21 19:15:00"};
let timestamp3 = "2021-06-21 19:15:00";
let msg3 = "Test 3";
test(msg3, () => {
    expect(documentBuilderHelper(testDocuments[4],testDocuments[5],timestamp3))
    .toStrictEqual(expectedOutput3);
});
//////////////////////////////////