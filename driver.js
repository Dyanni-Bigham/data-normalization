const { MongoClient } = require("mongodb");
const documentBuilder = require("./documentBuilder");
const url = "mongodb://127.0.0.1:27017/";

/**
 * gets documents from a collection within a database
 * @param {String} database - name of database
 * @param {String} collectionToQuery - name of collection
 * @param {String} bacnetID - ID for group of documents
 * @returns {Object[]} - array of documents
 */
 async function getDocuments(database, collectionToQuery, bacnetID, mongoClient) {
    // Quarter hour collection  
    const quarterHour = "quarter_hour";

    // array of documents to be inserted
    let collectedDocuments;

    // Array of ids
    const idArray = await mongoClient
    .db(database)
    .collection(quarterHour)
    .distinct("id");

    // Check if bacnetID already exists in quarter_hour
    if(idArray.includes(bacnetID)) {
        console.log("Hey this id exists already!\n");

        // Find the most recently processed timestamp within quarter_hour based on 'bacnetID'
        const mostRecentDocument = await mongoClient
        .db(database)
        .collection(quarterHour)
        .find({"id": bacnetID})
        .sort({"timestamp": -1})
        .toArray();

        // run a $gte query on bacnetgw1 collection
        const newDocuments = await mongoClient
        .db(database)
        .collection(collectionToQuery)
        .find({"id": bacnetID, "timestamp": {"$gte": mostRecentDocument[0].timestamp}})
        .sort({"timestamp": 1})
        

        collectedDocuments = await newDocuments.toArray();

    }
    // This sequence will occur if quarter_hour has never 'bacnetID'
    else {
        const cursor = mongoClient
        .db(database)
        .collection(collectionToQuery)
        .find({ id: bacnetID })
        .sort({ timestamp: 1 });
     
        collectedDocuments = await cursor.toArray(); 
    }

    return collectedDocuments;
};

async function main() {
    // Connection URL
    const client = new MongoClient(url);

    // Database name
    const database = "IoT";

    // Collection name
    const collection = "bacnetgw1";

    try {
        await client.connect();
        
        // array of ids to traverse 
        const ids = await client
        .db(database)
        .collection(collection)
        .distinct("id");

        for(const id of ids ) {
            console.log(`inserting with id: ${id}`);
            let documentsToNormalize = await getDocuments(database, collection, id, client);

            let normalizedDocs = documentBuilder.documentBuilder(documentsToNormalize);

            if (normalizedDocs.length !== 0) {
                await client.db("IoT").collection("quarter_hour").insertMany(normalizedDocs);
            }
        }
    }
    finally {
        await client.close();
    }
};

main();