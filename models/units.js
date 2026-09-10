const mongoose=require('mongoose');
const Contributor = require('./contributor');
const Schema=mongoose.Schema;
const UnitSchema=new Schema({
    title:{
        type:String,
    },
    parent:{
        type:String,
    },  
    file:{
        type:String,
    },
    contributor:{
        type:Schema.Types.ObjectId,ref:"Contributor"
    }
});
const Unit=mongoose.model("Unit",UnitSchema);
module.exports=Unit;