const mongoose = require('mongoose')

const url = 'mongodb://penetrate:mydatabase@ds229448.mlab.com:29448/fullstack-osa3'

mongoose.connect(url)

var personSchema = new Schema({name : String, number: String})
personSchema.statics.format = function(person) {
    return {
        name: person.name,
        number: person.number,
        id: person._id
    }
}

const Person = mongoose.model('Person', personSchema)

module.exports = Person