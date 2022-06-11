const dayjs = require("dayjs");  // for formatting the timestamp

const intervals = [00, 15, 30, 45];

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

function main() {
    console.log("findFifteenInterval testing environment");
    console.log("=======================================");

    //let lowTimestamp = '2021-06-21 14:00:53'
    //let highTimestamp = '2021-06-21 14:14:54'

    const testSuite1 = [
        '2021-06-21 14:00:53', // 0
        '2021-06-21 14:02:19', // 1
        '2021-06-21 14:14:54', // 2
        '2021-06-21 14:16:29', // 3
        '2021-06-21 14:30:17', // 4
        '2021-06-21 14:45:18', // 5
        '2021-06-21 14:57:18', // 6
        '2021-06-21 15:00:12', // 7
        '2021-06-21 15:47:19'  // 8
        
    ];

    //const testSuite2;

    // 1. no 15 minute interval
    //    In the event that lowTimestamp - highTimestamp < 15, we should try the function again with highTimestamp.next()
    // 2. multiple 15 minute intervals --> There was an outage here.

    // TODO:
    //   1. See how we can reformat the data to contain a normalized timestamp and consumption value (This means we'll be working on linear calc on this step)

    let newTimestamp = findFifteenInterval(testSuite1[3], testSuite1[4]);
    console.log(newTimestamp);
}

main()