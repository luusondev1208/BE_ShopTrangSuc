const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,      
    },
    description:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    // luot xem
    numberViews:{
        type:Number,
        default:0,
    },
    
    likes:[
        {
            type:mongoose.Types.ObjectId,
            ref:'User'
        }
    ],
    dislikes:[
        {
            type:mongoose.Types.ObjectId,
            ref:'User'
        }
    ],
    image :{
        type:String,
        default: 'https://media.istockphoto.com/id/1130150680/photo/blog-and-information-website-concept-workplace-background-with-text.jpg?s=612x612&w=0&k=20&c=BtknpmORYmgMHN5Qty7N0o5mvsk204BG-q4oR8gFl_g='
    },
    //Tac gia bai viet
    author:{
        type:String,
        default :'Admin'
    }
},
    {timestamps:true, toJSON: {virtuals:true}, toObject: {virtuals:true}}
);





//Export the model
module.exports = mongoose.model('Blog', blogSchema);