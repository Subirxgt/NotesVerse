const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const BookSchema=new Schema({
    semester:{
        type:String,
    },
    subjects:[
        {
            type:Schema.Types.ObjectId,ref:"Unit"
        }
    ],
});
const Book=mongoose.model("Book",BookSchema);
module.exports=Book;