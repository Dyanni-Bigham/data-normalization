const {MongoClient} = require("mongodb");

// Connection URL
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

// Database Name
const dbName = "IoT";

// holds the documents
const documents = [];

main().catch(console.dir);

// entry point of the script
async function main() {
    try {
        // use connect method to connect to the server
        await client.connect();
        //console.log("Connected successfully to server"); 
        const db = client.db(dbName);
        const collection = db.collection("quarterHour");

        // get all documents from the quarterHour collection
        const totalDocuments = await collection.find({}).toArray();

        // TESTING
        //console.log(totalDocuments);

        // removes the first element since we dont need it because its 
        // not a full hour
        const firstElement = totalDocuments.shift();
        
        // get all the hours from quarterHour
        getAllHours(totalDocuments);

        // implicitly creates hour collection
        const hour = db.collection("hour");
        const estimate = await hour.estimatedDocumentCount();

        // this will only run once to populate the collection
        if(estimate == 0){
            await hour.insertMany(documents);

            console.log("Success on creating hour collection");
        }

        // will add the newest documet
        else if(estimate != 0){
            const newDocument = documents[documents.length-1];
            await hour.insertOne(newDocument);
        }

    } finally {
        await client.close();
    }
}

/**
 * get all hour intervals from the collection (quarterHour)
 * @param {Object[]} docs - list of documents in collection
 * @return {Object[]} allHours - array of hourly documents
 */
function getAllHours(docs){
    const hourlyDocuments = [];
    
    for(let i = 0; i < docs.length; i+=4){
        let result;

        // gets the hour for the interval
        result = getForHour(docs.slice(i,i + 4));

        hourlyDocuments.push(result);
        documents.push(result);
    }
    return hourlyDocuments;
}

/**
 * gets an hour with total connsuption for the given interval
 * @param {Object[]} hourInterval - an array of 15-min increments
 * @return {Object[]} hour - the hour for the given interval with total connsuption
 */
function getForHour(hourInterval){
   let totalConsumption = 0;
   
   // loops through to get the total connsuption
   for(let i = 0; i < hourInterval.length; i++){
       totalConsumption += hourInterval[i].consumption;
   }
   
   // The format for how it'll show in the hour collection 
   let hour = {
       building: hourInterval[0].building,
       timestamp: hourInterval[0].timestamp,
       consumption: totalConsumption,
       utility: hourInterval[0].utility,
       type: hourInterval[0].type
   };
   
   return hour; 
}
