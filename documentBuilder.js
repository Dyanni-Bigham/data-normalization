const { repair } = require("./repair");
const utils = require("./utils");

/**
 * creates documents from a given mongo collection
 * @param {Object[]} documents - array of dcouments in collection
 * @param {number} iterator - index that keeps track of position
 */
function documentBuilder(documents) {
    let isValid = true;
    let ranRepaired = false;
    let normalizedDocuments = [];
    let iterator = 0;

    // loop until greater than documents length
    while (iterator < documents.length - 2) {
        // change to documents.length
        let document1 = documents[iterator];
        let document2 = documents[iterator + 1];

        let timeToInsert = utils.findFifteenInterval(
            document1.timestamp,
            document2.timestamp
        );

        if (timeToInsert === -1) {
            isValid = false;
            document2 = documents[iterator + 2];
            let validThreshold = utils.isValidThreshold(
                document1.timestamp,
                document2.timestamp
            );

            if (validThreshold) {
                timeToInsert = utils.findFifteenInterval(
                    document1.timestamp,
                    document2.timestamp
                );
            } else {
                // console.log("Invalid threshold... Calling repair function");
                repairedDocs = repair(document1, document2);
                for (let repairIter = 0; repairIter < repairedDocs.length; repairIter++) {
                    normalizedDocuments.push(repairedDocs[repairIter]);
                }

                ranRepaired = true;
            }
        }

        if(!(ranRepaired)) {
            documentToInsert = utils.documentBuilderHelper(
                document1,
                document2,
                timeToInsert
            );
            normalizedDocuments.push(documentToInsert);
        }
        ranRepaired = false;

        if (!isValid) {
            iterator += 2;
            isValid = true;
        } else {
            iterator++;
        }
    }
    
    return normalizedDocuments;
}

module.exports = {
    documentBuilder
}