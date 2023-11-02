const mongoose = require("mongoose")

const DB = "mongodb+srv://root:root@cluster0.aib2q62.mongodb.net/Authuser?retryWrites=true&w=majority"

mongoose.connect(DB,{
    useUnifiedTopology: true,
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: true,
}).then(()=> console.log("DataBase Connected")).catch((errr)=>{
    console.log(errr);
})