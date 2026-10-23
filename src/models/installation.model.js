const mongoose = require('mongoose');

const installationSchema = new mongoose.Schema({
    isInstalled:{
        type:Boolean,
        required:true,
        default:false
    },
    installedAt:{
        type:Date,
        default:null
    },
    installedByAdminId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
});

module.exports = mongoose.model('Installation',installationSchema);