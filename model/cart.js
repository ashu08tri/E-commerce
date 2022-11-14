const mongoose = require('mongoose');
const schema = mongoose.Schema;

const ImageSchema = new schema({
    url:String,
    filename:String
});

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('upload', '/upload/w_200');
})

const cartSchema = new schema({
    name:{type:String,required:true},
    price:{type:Number,min:100},
    image:[ImageSchema],
    qty:{type:Number,min:0},
    stock:Number
})

module.exports = mongoose.model('Cart',cartSchema);