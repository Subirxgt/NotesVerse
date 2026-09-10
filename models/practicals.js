const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const PracticalSchema=new Schema({
    semester:{
        type:String,
    },
    subjects:[
        {
            type:Schema.Types.ObjectId,ref:"Unit"
        }
    ],
});
const Practical=mongoose.model("Practical",PracticalSchema);
module.exports=Practical;