/******************** DEPENDENCIES
npm init -y
npm install express
npm install ejs
npm install mongoose
npm install bcrypt
npm install express-session
npm install express-flash
 */

const express = require( 'express' );
const mongoose = require( 'mongoose' );
const bcrypt = require( 'bcrypt' ); // Encryptar la contraseña
const session = require( 'express-session' ); //
const flash = require( 'express-flash' ); // Error messages
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

app.post( '/register/user', function( request, response ){
    const first_name = request.body.first_name;
    const last_name = request.body.last_name;
    const email = request.body.email;
    const users_password = request.body.users_password;

    bcrypt.hash( users_password, 10 )
        .then( encryptedPassword => {
            const newUser = {
                first_name,
                last_name,
                email,
                password : encryptedPassword
            };
            console.log("This user has been added: " + newUser );
            UserModel
                .createUser( newUser )
                .then( result => {
                    request.session.firstName = result.firstName;
                    request.session.lastName = result.lastName;
                    request.session.userName = result.userName;
                    response.redirect( '/users' );
                })
                .catch( err => {
                    request.flash( 'registration', 'That username is already in use!' );
                    response.redirect( '/' );
                });
        });
});




//--------------------------------------------------------------------------------------------------------------- END OF LOGIN AND REGISTRATION ----------------------------------------------------

//----------------------------------------------------------------------------------- DISPLAY HOME PART ----------------------------------------------------------------------



//------------------------------------------------------------------------------------------------------- END OF HOME PART -----------------------------------------------------------



//----------------------------------------------------------------------------------- SERVER PORT 8080 ---------------------------------------------------
app.listen( 8080, function(){
    console.log( "The users server is running in port 8080." );
});

//------------------------------------------------------------------------------------------------------------------------------------------------------------