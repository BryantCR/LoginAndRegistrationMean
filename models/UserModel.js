console.log("File UserModel is connected here!");

const mongoose = require( 'mongoose' ); // MOngoose for the queries
//const {CommentSchema, CommentModel} = require( './commentModel' ); // Work with a second table
const UserSchema = new mongoose.Schema({
    users_id : {
        type : Number,
        required : true,
        unique : true
    },
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
    password : {
        type : String,
        required : true
    }
    //comments : [ CommentSchema ] // line 4
});

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
    autoIncrement : function(users_id){
        return User.findAndModify({
            query: { users_id: seqName },
            update: { $inc: { seqValue: 1 } },
            new: true
            
        });
    }
    /*updateUserComment : function( id, newComment ){
        return CommentModel.addComment( newComment )
            .then( result => {
                return User.findByIdAndUpdate({_id: id}, {$push: {comments: result}});
            });
    }*/
};

module.exports = {UserModel};

//------------------------- TEST AUTO INCREMENT ----------

// UserModel.getSequenceNextValue.function(seqName) {
//     var seqDoc = db.users.findAndModify({
//         query: { users_id: seqName },
//         update: { $inc: { seqValue: 1 } },
//         new: true
//     });
//     return seqDoc.seqValue;
// }