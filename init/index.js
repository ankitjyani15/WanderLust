const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const Mongo_URL = "mongodb://127.0.0.1:27017/wanderlust"

main().then( ( )=>{
    console.log("Connected to DB ");
    
}).catch((err) =>{
    console.log(err);
    
})

async function main(){
    await mongoose.connect(Mongo_URL);
}
const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) =>({...obj,owner :"67a304b3e2bb49758b6681ea",geometry: obj.geometry || { type: "Point", coordinates: [77.2088,28.6139] } }))
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
    
};


initDB();