// import libraries
const { MongoClient } = require("mongodb");
const dayjs = require("dayjs");  // for formatting the timestamp

// Connection URL
//const url = "mongodb://localhost:27017";
const url = "mongodb://127.0.0.1:27017/";
const client = new MongoClient(url);
// Database Name
const dbName = "IoT";

// holds the documents
const documents = [];

// global array of intervals
const intervals = [00, 15, 30, 45];

//main().catch(console.dir);
// entry point of the script
/*
async function main() {
    try {
        // Use connect method to connect to the server
        await client.connect();
        console.log("Connected successfully to the server");
        const db = client.db(dbName);
        const collection = db.collection("bacnetgw1");

        const sort = {"lastModified": 1};

        // gets all of the ids
        const idArray = await collection.distinct("id"); 
        
        // loop through all of the ids
        for (let i = 0; i < idArray.length; i++) { //TODO change to idArray.length or 15
            let data = await collection
                .find({"id":`pe:DA_AI_01/${i}`})
                .sort(sort)
                .toArray();
            let docs = normalizationProcedure(data);
            documents.push(docs);
        }
        
        // implicitly creates the quarter hour collection
        const quarterHour = db.collection("test_quarterHour");
        const estimate = await quarterHour.estimatedDocumentCount();

        // this will only run once to populate the collection
        if (estimate == 0) {
            for (let i = 0; i < documents.length; i++) {
                await quarterHour.insertMany(documents[i]);
            }

            console.log("success on creating quarterHour collection");
        }

        // will add the newest document
        else if (estimate != 0) {
            console.log("inside new document code");
            for (let i = 0; i < documents.length; i++) { // TODO change to documents.length or 15
                // gets the most recent document in each array
                let dataPoints = await quarterHour
                    .find({"id":`pe:DA_AI_01/${i}`})
                    .sort({"timestamp":-1})
                    .toArray();
                //console.log("recent timestamps\n");
                let latestDataPoint = dataPoints[0];
                //console.log(latestDataPoint);
                let mostRecentTimestamp = latestDataPoint.timestamp;
                let newDatapoints = await collection
                     // gets all data points greater than the mostRecentTimestamp
                    .find({"id":`pe:DA_AI_01/${i}`,
                        lastModified: {$gt: mostRecentTimestamp}})
                    .toArray();
                    
                let docs = normalizationProcedure(newDatapoints);
                //`:`console.log(mostRecentTimestamp);
                //console.log(newDatapoints);
                //console.log("new docs\n");
                //console.log(docs);
                // pull in fresh bacnetgw1 and quarterHour from cscap1
                // test code on that
                //console.log(docs);
                await quarterHour.insertMany(docs.slice(1));
                //console.log("added new documents"); 
            }
        }:

    } finally {
        await client.close();    
    }
}
*/

testing().catch(console.dir);

async function testing() {
    try {
        // Use connect method to connect to the server
        await client.connect();
        //console.log("Connected successfully to the server");
        const db = client.db(dbName);
        const collection = db.collection("bacnetgw1");

        // get all of the ids
        const idArray = await collection.distinct("id");

        // loop through all of the ids
        for (let i = 3; i < 4; i++) { // TODO change to idArray.length
            let data = await collection
                .find({ "id": `pe:DA_AI_01/${i}` })
                .toArray();
            //let docs = normalizationProcedure(data);
            //documents.push(docs);
            documents.push(data);
        }
        // NOTE: using 1 ID for testug purposes will switch later to all of them

        console.log(documents);
    } finally {
        await client.close();
    }
}
/**
 * normalizes the given documents
 * @param {Object[]} documents - array of documents in collection
 * @return {Object[]} normalizedDocs - normalized documents
 */
function normalizationProcedure(documents) {
    const normalizedDocs = [];

    // gets the quarter hours in the collection
    const quarterHours = getQuarterHours(documents);
    //console.log(quarterHours);

    // get the linear consum values in the collection
    const consumptionValues = linearCalc(documents);
    //console.log(consumptionValues);

    // combine fields to create document
    for (let i = 0; i < consumptionValues.length; i++) {
        let current = {
            building: documents[i].building,
            timestamp: quarterHours[i],
            consumption: consumptionValues[i],
            utility: documents[i].utility,
            type: documents[i].type,
            id: documents[i].id,
            meterIndex: documents[i].meterIndex
        }
        normalizedDocs.push(current);
    }
    return normalizedDocs;
}

/**
 * returns the difference of the two values
 * @param {number} a - first value
 * @param {number} b - second value
 * @return {number} - the difference
 */
function consumptionHelper(a, b) {
    return Math.abs(a - b);
}

/**
 * converts timestamp into epoch unix time
 * @param {Obhect[]} timestamp - time to be converted
 * @return {number} - timestamp in unix time
 */
function normalTimeToEpoch(timestamp) {
    // convert to a Date object
    let newDate = new Date(timestamp);

    // return the epoch time 
    return (newDate.getTime() / 1000); // converts to seconds
}

/**
 * handles the work of getting the quarter hours from the collection
 * @param {Object[]} documents - array of documents in collection
 * @return {Object[]} quarterHours - array of quarter hours
 */
function getQuarterHours(documents) {
    const quarterHours = [];

    for (let i = 1; i < documents.length; i++) {
        let result;

        // without this it'll be an undefined error
        if (typeof documents[i] !== 'undefined') {
            if (documents[i - 1] === null) {
                quarterHours.push(0);
            }
            result = findFifteenInterval(documents[i - 1].value, documents[i].value);
            //console.log(result);
        }
        quarterHours.push(result);
    }
    return quarterHours;

}
/**
 * finds the correct 15 minute interval between two timestamps
 * @param {string} timestamp1 - timestamp for first document
 * @param {string} timestamp2 - timestamp for second document
 * @return (Date) new timestamp with correct interval
 */
function findFifteenInterval(lowTimestamp, highTimestamp) {
    // convert the timetamps to date objects
    const date1 = new Date(lowTimestamp);
    const date2 = new Date(highTimestamp);

    let foundInterval;

    // loop through intervals list
    for (const interval of intervals) {
        // check which interval is between the minute values
        //console.log(`checking interval: ${interval}`)

        // if they are different hours
        if (date1.getHours() !== date2.getHours()) {
            foundInterval = intervals[0];
        }

        // assumoing both timestamps are in the same hour
        else if (interval > date1.getMinutes() && interval < date2.getMinutes()) {
            foundInterval = interval;
        }
    }

    // create a timestamp for the found interval
    let tempTimestamp = date2;

    // inject interval as the minutes field for tempTimestamp
    tempTimestamp.setMinutes(foundInterval);

    // set the seconds to 0
    tempTimestamp.setSeconds(0);

    // return tempTimestamp
    // return dayjs(tempTimestamp).format('YYYY-MM-DD HH:mm:ss');
    let foo = dayjs(tempTimestamp).format('YYYY-MM-DD HH:mm:ss');
    console.log(foo);

}


/**
 * calculate the lower bound epoch and upper bound epoch given 3 epoch values
 * @param {number} epoch1 - value of first epoch
 * @param {number} epochMid - value of mid bound epoch
 * @param {number} epoch2 - value of second epoch
 * @return {array} - list that contains upper bound and lower bound epoch
 */
function epochDifference(epoch1, epochMid, epoch2) {
    const lowerBound = Math.abs(epochMid - epoch1);
    const upperBound = Math.abs(epoch2 - epoch1);
    return [lowerBound, upperBound];

}

/**
 * finds the value to be added to the lower bound consum
 * @param {number} consumVal - difference in consum from two documents
 * @param {number} lowerEpoch - lower bound epoch value
 * @param {number} upperEpoch - upper bound epoch value
 * @return {number} - value to be added
 */
function valueToBeAdded(consumVal, lowerEpoch, upperEpoch) {
    let numerator = lowerEpoch * consumVal;
    let denominator = upperEpoch;

    return Math.floor((numerator / denominator));
}

/**
 * linearly calculates the consumption values from the colection
 * @param {Object[]} documents - array of documents in collection
 * @return {number[]} consumptionValues - list of consumption values
 */
function linearCalc(documents) {
    const consumptionValues = [];

    for (let i = 1; i < documents.length; i++) {
        let result;

        // without this it'll be an undefined error
        if (typeof documents[i] !== 'undefined') {
            if (documents[i - 1] === null) {
                consumptionValues.push(0);
            }
            result = linearCalcHelper(documents[i - 1].value, documents[i].value);
        }
        consumptionValues.push(result);
    }
    return consumptionValues;
}
/**
 * Helper function that does the work of the linear calc algorithm
 * @param {Object} document1 - JSON object of document 1
 * @param {Object} document2 - JSON object of document 2
 * @return {number} - number containing the new consum value
 */
function linearCalcHelper(document1, document2) {
    // get the consumption value
    const consumVal = consumptionHelper(document1.value, document2.value);

    // find the fifteen minute interval between the two documents
    let timeToInsert = findFifteenInterval(document1.timestamp, document2.timestamp);

    // convert all the timestamps to epoch
    let lowerEpoch = normalTimeToEpoch(document1.timestamp);
    let midEpoch = normalTimeToEpoch(timeToInsert);
    let upperEpoch = normalTimeToEpoch(document2.timestamp);

    // get the differences of the epoch times
    let epochDifferences = epochDifference(lowerEpoch, midEpoch, upperEpoch);

    // calculate the value to be added to the document 1 value
    let value = valueToBeAdded(consumVal, epochDifferences[0], epochDifferences[1]);

    // get the new consum value
    let newConsum = document1.value + value;

    return newConsum;

    //return [midEpoch, newConsum]; // time and consum

}

