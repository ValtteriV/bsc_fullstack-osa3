const express = require('express')
const app = express()
const bodyparser = require('body-parser')
const morgan = require('morgan')

morgan.token('body', function (req, res) {return req.body ? JSON.stringify(req.body) : {}})
morgan.token('content-length', function (req, res) { return req.headers['content-type']})
app.use(morgan(':method :url :body :status :content-length - :response-time ms'))

app.use(bodyparser.json())

var persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
        name: "Martti Tienari",
        number: "040-123456",
        id: 2
    },
    {
        name: "Arto Järvinen",
        number: "040-123457",
        id: 3
    },
    {
        name: "Lea Kutvonen",
        number: "040-123456",
        id: 4
    }
]

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(per => per.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(note => note.id !== id)

    res.status(204).end()
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
    if (persons.find(per => per.name === person.name)) {
        errors.errorAlreadyin = "this person is already in our database, you can't have two numbers"
    }
    if (errors.length > 0) {
        return res.status(400).json(errors)
    }
    person.id = Math.floor(Math.random()*100000)
    console.log(person)
    persons = persons.concat(person)
    res.json(person)
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