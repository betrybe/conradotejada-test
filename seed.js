// colocar query do MongoDB
const mongoose = require('mongoose');

const User = require('./src/models/userModel')

/*const dotenv = require('dotenv');;

dotenv.config();

mongoose
    .connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    })
    .then(() => {
        console.log('MONGODB CONNECTED');
    })
    .catch((err) => {
        console.log(err)
    });*/

const seedAdmin = [
        { 
            name: 'admin', 
            email: 'root@email.com', 
            password: 'admin', 
            role: 'admin',
        }
    ];

const seedDB = async () => {
    
    await User.insertMany(seedAdmin);
    console.log('USER ADMIN CREATED');
};

/* seedDB().then(() => {
    mongoose.connection.close()
})*/

module.exports = seedDB; 