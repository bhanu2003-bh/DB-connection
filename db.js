const mongoose = require('mongoose');
const { type } = require('os');
const Schema = mongoose.Schema;
const objectId = mongoose.Schema.ObjectId

const UserSchema = new Schema({
    "email" : {
        type : String,
        unique : true
    },
    "password" : String,
    "name" : String
})

const TodoSchema = new Schema({
    "task" : String,
    "isDone" : Boolean,
    "User" : objectId
})

const UserDatabase = mongoose.model('Users',UserSchema);
const TodoDatabase = mongoose.model('Todos',TodoSchema);

module.exports = {
    UserDatabase,
    TodoDatabase
}
