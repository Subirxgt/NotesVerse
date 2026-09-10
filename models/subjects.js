const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const SubjectSchema=new Schema({
    name:{
        type:String,
    },
    title:{
        type:String,
    },
    parent:{
        type:String
    },
    units:[
        {
            type:Schema.Types.ObjectId,ref:"Unit"
        }
    ],
})
const Subject=mongoose.model("Subject",SubjectSchema);
module.exports=Subject;