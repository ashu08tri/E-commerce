const mongoose = require('mongoose');
const schema = mongoose.Schema;
const Review = require('./review');

const ImageSchema = new schema({
    url:String,
    filename:String
});

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('upload', '/upload/w_200');
})

const productSchema = new schema({
    name:{type:String,required:true},
    price:{type:Number,min:100},
    description:String,
    user:{type:schema.Types.ObjectId,ref:'User'},
    review:[{type:schema.Types.ObjectId,ref:'Review'}],
    image:[ImageSchema],
    stock:{type:Number,min:0,max:20},
    qty:{type:Number,min:1}
})

productSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await Review.deleteMany({
            _id:{
                $in : doc.review
            }
        })
    }
});

module.exports = mongoose.model('Product',productSchema);