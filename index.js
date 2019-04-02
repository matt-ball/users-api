const express = require('express')
const bodyParser = require('body-parser')
const _ = require('lodash')
const uuidv4 = require('uuid/v4')
const app = express()
const success = { status: 'success' }
const badRequest = { status: 'invalid request' }
const requiredUserKeys = ['firstName', 'lastName', 'password']
let users = []

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/create', (req, res) => {
  const user = _.pick(req.body, requiredUserKeys)

  if (validUser(user)) {
    Object.assign(user, { id: uuidv4() })
    // users.push(user)
    res.json(strip(user))
  } else {
    res.json(badRequest)
  }
})

app.get('/get', (req, res) => {
  const { query } = req
  const action = Object.keys(req.query)[0]

  const paths = {
    all: users,
    id: filterUsers(query, 'id'),
    firstName: filterUsers(query, 'firstName')
  }

  res.json(strip(paths[action]) || badRequest)
})

app.put('/update', (req, res) => {
  const { id } = req.query

  if (id) {
    const user = _.remove(users, (user) => user.id === id)[0]

    if (user) {
      const updatedUser = Object.assign(user, _.pick(req.body, requiredUserKeys))

      users.push(updatedUser)
      res.json(strip(updatedUser))
    } else {
      res.json({ status: 'no user found', id })
    }
  } else {
    res.json(badRequest)
  }
})

app.delete('/delete', (req, res) => {
  const { id } = req.query

  if (id) {
    const removedUser = _.remove(users, (user) => user.id === id)
    const status = removedUser.length ? 'success' : 'no user found'

    res.json({ status, id })
  } else {
    res.json(badRequest)
  }
})

function validUser (user) {
  return requiredUserKeys.every((key) => user.hasOwnProperty(key))
}

function strip (res) {
  if (Array.isArray(res)) {
    if (!res.length) {
      return { status: 'no user found' }
    }

    let response = res.map(({ password, ...keep }) => keep)
    response.unshift(success)
    return response
  } else {
    let response = _.omit(res, ['password'])
    response = Object.assign({}, success, response)
    return response
  }
}

function filterUsers (query, key) {
  const filteredUsers = users.filter((user) => user[key] === query[key])

  if (filteredUsers.length) {
    return filteredUsers
  } else {
    return { status: 'no user found', [key]: query[key] }
  }
}

app.listen(3000, () => console.log(`Running!`))
