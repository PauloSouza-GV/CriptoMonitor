const mongoose = require('mongoose');
const User = mongoose.model('Users');

module.exports = {
    async store( params ){
        const user = await User.create( params );
        return user;
    },
    async find( params ){
        const user = await User.findOne( params );
        return user;
    },
    async update( params, newvalue ){
        const user = await User.findOneAndUpdate( { from: params.from } , newvalue, {new: true});
        return user;
    },
    async showSchedules( ){
        const users = await User.find( { stage: 4 } );
        return users;
    },
    async delete( params ){
        const user = await User.findOneAndDelete( { from: params.from });
        return user;
    }
};