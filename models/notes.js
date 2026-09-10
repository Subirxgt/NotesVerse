const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const NoteSchema=new Schema({
    semester:{
        type:String,
    },
    subjects:[
        {
            type:Schema.Types.ObjectId,ref:"Subject"
        }
    ],
});
const Note=mongoose.model("Note",NoteSchema);
module.exports=Note;