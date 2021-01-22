const mongoose = require('mongoose');

const UsersSchema = new mongoose.Schema({
    from:{
        type: String,
        required: true
    },
    stage:{
        type: Number,
        required: true
    },
    criptoMonitoring: {
        type: String,
        required: true
    },
    valorGatilho:{
        type: Number,
        required: false
    }
});

mongoose.model('Users', UsersSchema);