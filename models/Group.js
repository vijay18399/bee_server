var mongoose = require('mongoose');
var GroupSchema = new mongoose.Schema({
    groupname: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    admin: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    memebers: {
        type: Array
    },
    membercheck:{
        type:Array
    }

});


module.exports = mongoose.model('Group', GroupSchema);