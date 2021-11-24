/******************** DEPENDENCIES
npm init -y
npm install express
npm install ejs
npm install mongoose
npm install bcrypt
npm install express-session
npm install express-flash
npm install mongoose-sequence
npm install --save mongoose-sequence

//sudo lsof -iTCP -sTCP:LISTEN | grep node //Ver los procesos de node abiertos

//eliminar procesos = p.kill
*/

const express = require( 'express' );
const mongoose = require( 'mongoose' );
const bcrypt = require( 'bcrypt' ); // Encryptar la contraseña
const session = require( 'express-session' ); //
const flash = require( 'express-flash' ); // Error messages
const { UserModel } = require('./models/UserModel');
const { isValid } = require('ipaddr.js');
const app = express();

mongoose.connect('mongodb://localhost/login_registrations_db1', {useNewUrlParser: true}); // LINK WITH THE DB

//const {UserModel} = require( '/models/UserModel' ); //CREATE A MODEL FILE FIRST

app.set( 'views', __dirname + '/views' ); //Access to the templates, folder "views"
app.set( 'view engine', 'ejs' ); // Allow the code to read ejs

app.use( flash() ); // line 5
app.use( express.urlencoded({extended:true}) ); // ????

app.use(session({ // ???
    secret: 'QwzzH56P2?',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 * 20 }
}));

//------------------------------------------------------------------------------------LOGIN AND REGISTRATION PART----------------------------------------------------

app.get( '/', function( request, response ){ // Redirect to login
    response.redirect( '/login' );
});

app.get( '/login', function(req, res) { // Display login and registration form
    res.render( 'loginAndRegistration' );
});

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

app.post( '/register/user', function( request, response ){
    const first_name = request.body.first_name;
    const last_name = request.body.last_name;
    const email = request.body.email;
    const users_password = request.body.users_password;
    const users_bday = request.body.users_bday;

    let isValid = true;

    if(first_name === '' || last_name === '' || email === '' || users_password === '' || users_bday === ""){
        request.flash('registerBlank', "There is an empty space");
        isValid = false;
    }
    if(first_name.length < 3){
        request.flash( 'firstName', 'The firstname field must be at least 3 characters' );
        isValid = false;
    }
    if(last_name.length < 3){
        request.flash( 'lastName', 'The lastname field must be at least 3 characters' );
        isValid = false;
    }
    if(!validateEmail(email)){
        request.flash( 'email', 'The email field must have valid characters' );
        isValid = false;
    }
    if(users_password.length < 6){
        request.flash('users_password', "The password must be at least than 6 characters");
        isValid = false;
    }
    if(users_bday.length < 6){
        request.flash('registerDate', "You didn't fill your birthday");
        isValid = false;
    }
    /*if(password !== confpassword){
        request.flash('registerPass2', "The passwords didn't match");
        isValid = false;
    }*/

    if(isValid){
        bcrypt.hash( users_password, 10 )
            .then( encryptedPassword => {
                const newUser = {
                    first_name,
                    last_name,
                    email,
                    password : encryptedPassword,
                    users_bday
                };
                console.log("This user wants to be added: " + newUser.first_name );
                console.log("This user wants to be added: " + newUser.last_name );
                console.log("This user wants to be added: " + newUser.email );
                console.log("This user wants to be added: " + newUser.password );
                console.log("This user wants to be added: " + newUser.users_bday );
                UserModel
                    .createUser( newUser )
                    .then( result => {
                        /*request.session.first_name = result.first_name;
                        request.session.last_name = result.last_name;
                        request.session.email = result.email;
                        request.session.users_bday = result.users_bday;*/
                        request.flash( 'registration', 'A new user has been created successfully!' );
                        response.redirect( '/login' );
                    })
                    .catch( err => {
                        request.flash( 'registration', 'That email is already in use!' );
                        response.redirect( '/login' );
                    });
            });
    }
    else{
        response.redirect( '/login' );
    }
});


//db.users.insert({first_name: "Bryan", last_name:"Cascante", email:"bryancvargaz@gmail.com", password: "pass1234"})

//--------------------------------------------------------------------------------------------------------------- END OF LOGIN AND REGISTRATION ----------------------------------------------------

//---------------------------------------------------------------------------------- REGISTRATE PART -------------------------------------------------------------------

app.post( '/login/user', function( request, response ){
    let userName = request.body.loginEmail;
    console.log( "Result: ", userName );
    let password = request.body.loginUsers_password;

    let isValid = true;

    if(userName === '' || password === '' ){
        request.flash('loginBlank', "There is an empty space");
        isValid = false;
    }
    if(userName === '' ){
        request.flash('emailBlank', "There is an empty space");
        isValid = false;
    }
    if(password === '' ){
        request.flash('passwordBlank', "The password must be at least than 6 characters");
        isValid = false;
    }
    if(!validateEmail(userName)){
        request.flash( 'emailBlank', 'The email field must have valid characters' );
        isValid = false;
    }
    if(password.length < 6){
        request.flash('passwordBlank', "The password must be at least than 6 characters");
        isValid = false;
    }

    if(isValid){
        UserModel
            .getUserByEmail( userName )
            .then( result => {
                console.log( "Result: ", result );
                if( result === null ){
                    throw new Error( "That user doesn't exist!" );
                }

                bcrypt.compare( password, result[0].password )
                    .then( flag => {
                        if( !flag ){
                            throw new Error( "Wrong credentials!" );
                        }
                        request.session.first_name = result[0].first_name;
                        request.session.last_name = result[0].last_name;
                        request.session.email = result[0].email;
                        request.session.users_bday = result[0].users_bday;
                        request.session.users_id = result[0].users_id;
                        response.redirect( '/home' );
                    })
                    .catch( error => {
                        request.flash( 'login', error.message );
                        response.redirect( '/' );
                    }); 
            })
            .catch( error => {
                request.flash( 'login', error.message );
                response.redirect( '/' );
            });
    }
    else{
        response.redirect( '/' );
    }

    
});

//-----------------------------------------------------------------------------------------------------------END REGISTER PART --------------------------------------------------

//----------------------------------------------------------------------------------- DISPLAY HOME PART ----------------------------------------------------------------------

app.get( '/home', function( request, response ){ // Redirect to login
    if( request.session.email === undefined ){
        response.redirect( '/' );
    }
    else{
        UserModel
            .getUsers()
            .then( data => {
                console.log( data );
                let currentUser = {
                    first_name : request.session.first_name,
                    last_name : request.session.last_name,
                    email : request.session.email,
                    users_bday : request.session.users_bday,
                    users_id : request.session.users_id
                }
                response.render( 'home', { users : currentUser } );
            }); 
    }
});

//------------------------------------------------------------------------------------------------------- END OF HOME PART -----------------------------------------------------------



//----------------------------------------------------------------------------------- SERVER PORT 8080 ---------------------------------------------------
app.listen( 8080, function(){
    console.log( "The users server is running in port 8080." );
});

//------------------------------------------------------------------------------------------------------------------------------------------------------------