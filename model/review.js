const mongoose = require('mongoose');
const schema = mongoose.Schema;

const reviewSchema = new schema({
    review : String,
    rating : {type : Number, min : 1 },
    user : {type : schema.Types.ObjectId, ref : 'User'}
})


module.exports = mongoose.model( 'Review',reviewSchema);