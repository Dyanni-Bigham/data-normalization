const dayjs = require("dayjs");  // for formatting the timestamp
const ObjectId = require('mongodb').ObjectId;

const intervals = [00, 15, 30, 45];

function difference(val1, val2) {
    return Math.abs(val2 - val1);
}

function findFifteenInterval(lowTimestamp, highTimestamp) {
    // convert the timetamps to date objects
    const date1 = new Date(lowTimestamp);
    const date2 = new Date(highTimestamp);

    let foundInterval;

    // loop through intervals list
    for (const interval of intervals) {
        // check which interval is between the minute values

        // if they are different hours
        if (date1.getHours() !== date2.getHours()) {
            console.log("Different hours");
            foundInterval = intervals[0];
        }
        // assuming both timestamps are in the same hour
        else if (interval > date1.getMinutes() && interval < date2.getMinutes()) {
            console.log("same hours");
            foundInterval = interval;
        }
        // assuming both dates contain valid intervals and are 15 minutes apart.
        else if (date1.getMinutes() == interval &&
            date1.getMinutes() + 15 == date2.getMinutes()) {
            console.log("15 minutes apart");
            foundInterval = date2.getMinutes();
        }
    }

    // if a valid interval was found, proceed with setting the timestamp
    if (typeof foundInterval !== 'undefined') {
        // create a timestamp for the found interval
        let tempTimestamp = date2;

        // inject interval as the minutes field for tempTimestamp
        tempTimestamp.setMinutes(foundInterval);

        // set the seconds to 0
        tempTimestamp.setSeconds(0);

        let formattedTimestamp = dayjs(tempTimestamp).format('YYYY-MM-DD HH:mm:ss');
        return formattedTimestamp;
    }
    // Fail state
    else {
        return -1;
    }
}

function normalTimeToEpoch(timestamp) {
    // convert to a Date object
    let newDate = new Date(timestamp);

    // return the epoch time 
    return (newDate.getTime() / 1000); // converts to seconds
}

function valueToBeAdded(consumVal, lowerEpoch, upperEpoch) {
    let numerator = lowerEpoch * consumVal;
    let denominator = upperEpoch;

    // Rounding to the nearest 3rd decimal place.
    return (Math.round((numerator / denominator) * 1000) / 1000);
}

function epochDifference(epoch1,epochMid, epoch2) {
    const lowerBound = difference(epochMid,epoch1);
    const upperBound = difference(epoch2,epoch1);
    return [lowerBound,upperBound];
}

function linearCalc(document1,document2) {
    // get the consumption value
    const consumVal = difference(document1.value, document2.value);
    
    // find the fifteen minute interval between the two documents
    let timeToInsert = 
            findFifteenInterval(document1.timestamp, document2.timestamp);
    
    // convert all the timestamps to epoch
    let lowerEpoch = normalTimeToEpoch(document1.timestamp);
    let midEpoch = normalTimeToEpoch(timeToInsert);
    let upperEpoch = normalTimeToEpoch(document2.timestamp);

    // get the difference of the epoch times
    let epochDifferences = epochDifference(lowerEpoch,midEpoch,upperEpoch);

    // calculate the value to be added to document1.value
    let value = valueToBeAdded(consumVal,epochDifferences[0],epochDifferences[1]);

    // get the new consum value
    let newConsum = document1.value + value;

    return [midEpoch,newConsum];
}

function main() {
    console.log("linearCalc testing environment");
    console.log("==============================");

    document1 = { "_id" : ObjectId("623b595a05aadb0a5215baba"), "value" : 1486180, "id" : "pe:DA_AI_01/0", "building" : "54", "utility" : "h2o", "type" : "consum", "meterIndex" : "0", "timestamp" : "2022-03-23 10:31:03" }
    document2 = { "_id" : ObjectId("623b5cde05aadb0a5215bcae"), "value" : 1486220, "id" : "pe:DA_AI_01/0", "building" : "54", "utility" : "h2o", "type" : "consum", "meterIndex" : "0", "timestamp" : "2022-03-23 10:46:03" }

    console.log(linearCalc(document1, document2));
}

main()