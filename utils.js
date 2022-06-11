const dayjs = require("dayjs"); // for formatting the timestamp
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone'); // dependent on utc plugin
dayjs.extend(utc);
dayjs.extend(timezone);

const intervals = [0, 15, 30, 45];

/**
 * returns the difference of the two values
 * @param {number} val1 - first value
 * @param {number} val2 - second value
 * @returns {number} - the difference
 */
function difference(val1, val2) {
    return Math.abs(val2 - val1);
}

/**
 * finds the correct 15 minute interval between two timestamps
 * @param {String} lowTimestamp - timestamp for first document
 * @param {String} highTimestamp - timestamps for second document
 * @returns {Date} formattedTimestamp - new timestamp
 */
function findFifteenInterval(lowTimestamp, highTimestamp) {
    // convert the timetamps to date objects
    const date1 = new Date(lowTimestamp);
    const date2 = new Date(highTimestamp);

    let foundInterval;
    let validThreshold = isValidThreshold(lowTimestamp, highTimestamp);

    if (validThreshold) {
        // loop through intervals list
        for (const interval of intervals) {
            // check which interval is between the minute values

            // if they are different hours
            if (date1.getHours() !== date2.getHours()) {
                foundInterval = intervals[0];
            }
            // assuming both timestamps are in the same hour
            else if (interval > date1.getMinutes() && interval < date2.getMinutes()) {
                foundInterval = interval;
            }
            // assuming both dates contain valid intervals and are 15 minutes apart.
            else if (
                date1.getMinutes() == interval &&
                date1.getMinutes() + 15 == date2.getMinutes()
            ) {
                foundInterval = date2.getMinutes();
            }
        }
    }

    // if a valid interval was found, proceed with setting the timestamp
    if (typeof foundInterval !== "undefined") {
        // create a timestamp for the found interval
        let tempTimestamp = date2;

        // inject interval as the minutes field for tempTimestamp
        tempTimestamp.setMinutes(foundInterval);

        // set the seconds to 0
        tempTimestamp.setSeconds(0);

        let formattedTimestamp = dayjs.tz(tempTimestamp, "America/Phoenix").format("YYYY-MM-DD HH:mm:ss");
        return formattedTimestamp;
    }
    // Fail state
    else {
        return -1;
    }
}

/**
 * Converts given timestamp to epoch
 * @param {String} timestamp - time to be converted to epoch
 * @returns {number} - epoch time
 */
function normalTimeToEpoch(timestamp) {
    // convert to a Date object
    let newDate = new Date(timestamp);

    // return the epoch time
    return newDate.getTime() / 1000; // converts to seconds
}

/**
 * utility function that calculates value prime
 * @param {number} consumVal - value used to find value prime
 * @param {number} lowerEpoch - lower bound epoch time
 * @param {number} upperEpoch - uppoer bound epoch time
 * @returns {number} - value prime
 */
function valueToBeAdded(consumVal, lowerEpoch, upperEpoch) {
    let numerator = lowerEpoch * consumVal;
    let denominator = upperEpoch;

    // Rounding to the nearest 3rd decimal place.
    return Math.round((numerator / denominator) * 1000) / 1000;
}

/**
 * calculates lower and upper bound epoch values
 * @param {number} epoch1 - first epoch value
 * @param {number} epochMid - middle epoch value
 * @param {number} epoch2 - last epoch value
 * @returns {number[]} - array of epoch differences
 */
function epochDifference(epoch1, epochMid, epoch2) {
    const lowerBound = difference(epochMid, epoch1);
    const upperBound = difference(epoch2, epoch1);

    return [lowerBound, upperBound];
}

/**
 * performs linear interpolation function to find new timestamp and consum val
 * @param {*} document1 - JSON object of document 1
 * @param {*} document2 - JSON object of document 2
 * @param {*} timeToInsert - 15-min timestamp
 * @returns {array} - contains new timestamp and consum val
 */
function linearCalc(document1, document2, timeToInsert) {

    // get the consumption value
    const consumVal = difference(document1.value, document2.value);

    // convert all the timestamps to epoch
    let lowerEpoch = normalTimeToEpoch(document1.timestamp);
    let midEpoch = normalTimeToEpoch(timeToInsert);
    let upperEpoch = normalTimeToEpoch(document2.timestamp);

    // get the difference of the epoch times
    let epochDifferences = epochDifference(lowerEpoch, midEpoch, upperEpoch);

    // calculate the value to be added to document1.value
    let value = valueToBeAdded(
        consumVal,
        epochDifferences[0],
        epochDifferences[1]
    );

    // get the new consum value
    let newConsum = document1.value + value;

    return newConsum;
}

/**
 *
 * @param {number} unmodifiedDate - date in ISO format
 * @returns {Object[]} - dayjs object in YYYY-MM-DD HH:mm:ss
 */
 function formatDate(unmodifiedDate) {
    return dayjs.tz(unmodifiedDate, "America/Phoenix").format("YYYY-MM-DD HH:mm:ss");
}

// If timestamps are more than 45 minutes apart, that means we have an invalid threshold.
// At that point, a repair is needed due to an outage.
/**
 * checks that an outage hasn't happened by referencing A 45 minute threshold
 * @param {String} timestamp1 - timestamp for first document
 * @param {String} timestamp2 - timestamp for second document
 * @returns {boolean} - indicates valid threshold
 */
function isValidThreshold(timestamp1, timestamp2) {
    const date1 = new Date(timestamp1);
    const date2 = new Date(timestamp2);
    const threshold = 18;

    let diffMin = Math.round((date2 - date1) / 60000);

    // Check to see if date2 - date1 < 18 minutes apart
    return diffMin < threshold;
}

/**
 * helper function that does the work of creating a document
 * @param {Object} document1 - JSON object of document 1
 * @param {Object} document2 - JSON object of document 2
 * @param {number} timeToInsert - 15-min timestamp
 * @returns {Object} - newly created document
 */
function documentBuilderHelper(document1, document2, timeToInsert) {
    // delcare new document
    let newDocument;

    // perform linear calc operation
    const result = linearCalc(document1, document2, timeToInsert);

    // create document template
    newDocument = {
        value: result,
        id: document1.id,
        building: document1.building,
        utility: document1.utility,
        type: document1.type,
        meterIndex: document1.meterIndex,
        timestamp: timeToInsert,
    };

    // return new document
    return newDocument;
}
module.exports = {
    difference,
    findFifteenInterval,
    normalTimeToEpoch,
    valueToBeAdded,
    epochDifference,
    formatDate,
    linearCalc,
    isValidThreshold,
    documentBuilderHelper
}