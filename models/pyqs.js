const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const PyqSchema=new Schema({
    semester:{
        type:String,
    },
    subjects:[
        {
            type:Schema.Types.ObjectId,ref:"Unit"
        }
    ],
});
const Pyq=mongoose.model("Pyq",PyqSchema);
module.exports=Pyq;