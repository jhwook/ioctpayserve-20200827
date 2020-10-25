
module.exports = {
  schema: {
    name:         {type:String,required:true}
    , subname:    {type:String,required:true}
    , imagebase64:{type:String,required:true}
    , imageformat:{ type:String,required:false}
    , createdAt:  {type:String,required: false}
    , updatedAt:  {type:String,required: false}
  }
  , methods: { }
  , statics: { }
}
/*
var mongoose = require('mongoose'); 
var imageSchema = new mongoose.Schema({ 
    name: String, 
    desc: String, 
    image: 
    { 
        data: Buffer, 
        contentType: String 
    } 
}); 
//Image is a model which has a schema imageSchema   
module.exports = new mongoose.model('Image', imageSchema);
*/
