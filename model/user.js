const mongoose = require('mongoose');
const passportLocal = require('passport-local-mongoose');
const schema = mongoose.Schema;

const userSchema = new schema({
    email : {
        type : String,
        required : true,
        unique : true
    },
    role:String
})

userSchema.plugin(passportLocal);
module.exports = mongoose.model('User',userSchema);