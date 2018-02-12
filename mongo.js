const mongoose = require('mongoose')


mongoose.connect(url)

const Person = mongoose.model('Person', {
    name: String,
    number: String
})

const args = process.argv

if (args.length > 2) {
    const name = args[2]
    const number = args[3]
    const person = new Person({
        name: name,
        number: number
    })

    person
        .save()
        .then(response => {
            console.log(`lisätään henkilö ${response.name} numero ${response.number} luetteloon`)
            mongoose.connection.close()
        })
} else {
    Person
        .find({})
        .then(result => {
            result.forEach(person => {
                console.log(person)
            mongoose.connection.close()
            })
        })
}