console.log("File UserModel is connected here!");

const mongoose = require( 'mongoose' ); // Mongoose for the queries
const AutoIncrement = require('mongoose-sequence')(mongoose); // Auto-Increment

//const {CommentSchema, CommentModel} = require( './commentModel' ); // Work with a second table
const UserSchema = new mongoose.Schema({
    first_name : {
        type : String,
        required : true,
        minlength : 3,
        maxlength : 20
    },
    last_name : {
        type : String,
        required : true,
        minlength : 3,
        maxlength : 20
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    users_bday : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true,
        minlength : 6,
    }
    //comments : [ CommentSchema ] // line 6
});

UserSchema.plugin(AutoIncrement, {inc_field: 'users_id'});

const User = mongoose.model( 'users', UserSchema );

const UserModel = {
    createUser : function( newUser ){
        return User.create( newUser );
    },
    getUsers : function(){
        return User.find();
    },
    getUserById : function( userName ){
        return User.findOne({ userName });
    },
    getUserByEmail : function( userName ){
        return User.find({ email : userName });
    },
    /*updateUserComment : function( id, newComment ){
        return CommentModel.addComment( newComment )
            .then( result => {
                return User.findByIdAndUpdate({_id: id}, {$push: {comments: result}});
            });
    }*/
};

module.exports = {UserModel};

//------------------------- TEST AUTO INCREMENT ------------
