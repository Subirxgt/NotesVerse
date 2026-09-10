const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const contributorSchema=new Schema({
    username:{
        type:String,
    },
    email:{
        type:String,
    },
    type:{
        type:String,
    },
    semester:{
        type:String,
    },
    subject:{
        type:String,
    },
    title:{
        type:String,
    },
    file:{
        type:String,
    },
    status:{
        type:String,
    }
});
const Contributor=mongoose.model("Contributor",contributorSchema);
module.exports=Contributor;