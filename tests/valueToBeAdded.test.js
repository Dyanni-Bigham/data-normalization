const {valueToBeAdded} = require('../utils');

//////// Test 1 //////////////////
let lowerEpoch1 = 784;
let upperEpoch1 = 902;
let consumVal1 = 1651.25;
let expectedOutput1 = 1435.233;
let msg1 = "given 784 and 902 with \
consum val of 1651.25, output should be 1435.233";

test(msg1, () => {
    expect(valueToBeAdded(consumVal1, lowerEpoch1, upperEpoch1))
    .toBe(expectedOutput1);
});
//////////////////////////////////

//////// Test 2 //////////////////
let lowerEpoch2 = 768;
let upperEpoch2 = 916;
let consumVal2 = 8958.46875;
let expectedOutput2 = 7511.031;
let msg2 = "given 760 and 916 with \
consum val of 8958.46875, output should be 7511.031";

test(msg2, () => {
    expect(valueToBeAdded(consumVal2, lowerEpoch2, upperEpoch2))
    .toBe(expectedOutput2);
});
//////////////////////////////////

//////// Test 3 //////////////////
let lowerEpoch3 = 760;
let upperEpoch3 = 901;
let consumVal3 = 12061.03125;
let expectedOutput3 = 10173.567;
let msg3 = "given 760 and 901 with \
consum val of 12061.03125;, output shoulf be 10173.567";

test(msg3, () => {
    expect(valueToBeAdded(consumVal3, lowerEpoch3, upperEpoch3))
    .toBe(expectedOutput3);
});
//////////////////////////////////