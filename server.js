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
    const users_bday = request.body.users_bday;

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
                    request.session.first_name = result.first_name;
                    request.session.last_name = result.last_name;
                    request.session.email = result.email;
                    request.session.users_bday = result.users_bday;
                    request.flash( 'registration', 'A new user has been created successfully!' );
                    response.redirect( '/login' );
                })
                .catch( err => {
                    request.flash( 'registration', 'That username is already in use!' );
                    response.redirect( '/login' );
                });
        });
});


//db.users.insert({first_name: "Bryan", last_name:"Cascante", email:"bryancvargaz@gmail.com", password: "pass1234"})

//--------------------------------------------------------------------------------------------------------------- END OF LOGIN AND REGISTRATION ----------------------------------------------------

//----------------------------------------------------------------------------------- DISPLAY HOME PART ----------------------------------------------------------------------



//------------------------------------------------------------------------------------------------------- END OF HOME PART -----------------------------------------------------------



//----------------------------------------------------------------------------------- SERVER PORT 8080 ---------------------------------------------------
app.listen( 8080, function(){
    console.log( "The users server is running in port 8080." );
});

//------------------------------------------------------------------------------------------------------------------------------------------------------------