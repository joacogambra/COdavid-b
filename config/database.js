const mongoose = require('mongoose')

let connection = async() => {
    try{
        mongoose.connect(
            process.env.LINK_DB,
        //     {
        //         useUnifiedTopology:true,
        //         useNewUrlParser:true
        // }
        )
        console.log('connected to database on PORT ' + process.env.PORT)
    } catch (error){
        console.log(error)
    }
}

connection()


