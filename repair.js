const dayjs = require("dayjs");
const utils = require("./utils");

function repair(preoutageDoc, postoutage) {

    // iterate through a sequence that fills in the gap between document1.timestamp and document2.timestamp
    let repairedDocs = [];
    let docsToRepair = true;

    let currentDocument = preoutageDoc;
    let nextTimestamp = utils.formatDate(dayjs(currentDocument.timestamp).add(15, 'minute'));
    let normalizedNextTimestamp = utils.findFifteenInterval(currentDocument.timestamp, nextTimestamp);
    
    // loop while there are documents to repair
    while(docsToRepair) {
        // check to see if there are any documents to process
        if (normalizedNextTimestamp < postoutage.timestamp) {
            // Build the document
            documentToInsert = utils.documentBuilderHelper(preoutageDoc, postoutage, normalizedNextTimestamp);

            // Noting that this is a repaired value. Adding repair key.
            documentToInsert["repaired"] = "true";

            // Append the normalized repair document to repairedDocs list
            repairedDocs.push(documentToInsert);

            // Update currentDocument and normalizedNextTimestamp to 'iterate' through the remaining series until there are no more docs to repair.
            currentDocument = documentToInsert;
            normalizedNextTimestamp = utils.formatDate(dayjs(currentDocument.timestamp).add(15, 'minute'));
        }
        else {
            docsToRepair = false;
        }
    }
    // insert repaired docs into quarter_hour collection
    return repairedDocs;
}

module.exports = {
    repair
}