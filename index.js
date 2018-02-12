const express = require('express')
const app = express()
const bodyparser = require('body-parser')
const morgan = require('morgan')
const Person = require("./models/Person")
app.use(express.static('build'))
morgan.token('body', function (req, res) {return req.body ? JSON.stringify(req.body) : {}})
morgan.token('content-length', function (req, res) { return req.headers['content-type']})
app.use(morgan(':method :url :body :status :content-length - :response-time ms'))

app.use(bodyparser.json())

persons = []


app.get('/api/persons', (req, res) => {

    Person
        .find({})
        .then(response => {
            res.json(response.map(Person.format))})

})

app.get('/api/persons/:id', (req, res) => {
    Person
        .findById(req.params.id)
        .then(person => {
            res.json(Person.format(person))
        })
})

app.delete('/api/persons/:id', (req, res) => {
    Person
        .findByIdAndRemove(request.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => {
            console.log(error)
            response.status(400).send({error: 'malformatted id'})
        })
})

app.post('/api/persons', (req, res) => {
    const person = req.body
    errors = {}
    if (!person.name) {
        errors.errorNoname = "person must have a name"
    }
    if (!person.number) {
        errors.errorNonumber = "in this day and age people should have a number"
    }
    if (errors.length > 0) {
        return res.status(400).json(errors)
    }
    push = new Person({
        name: person.name,
        number: person.number
    })
    push
        .save()
        .then(savedPerson => {
            res.json(Person.format(savedPerson))
        })
})

app.put('/api/persons/:id', (req, res) => {
    Person.findByIdAndUpdate(req.params.id, res.body)
        .then(response => {res.status(204).json(Person.format(response))})
})

app.get('/info', (req, res) => {
    res.send(`<p>puhelinluettelossa ${persons.length} henkilön tiedot</p> ${Date()}`)
})

const error = (req, res) => {
    res.status(404).send({error:'unknown endpoint'})
}

app.use(error)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})