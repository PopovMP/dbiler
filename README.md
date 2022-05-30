## DBil

DBiler is a http client to DBil.


## Installation

```
npm install @popovmp/dbiler
```

## Usage

```javascript
const {getDbiler} = require('@popovmp/dbiler')

const url    = 'http://example.com/api/dbil'
const secret = 'foo-bar'

const userDb = getDbiler(url, secret, 'user')

const query      = {email: 'john@example.com'}
const projection = {name: 1, email: 1, _id: 0}

userDb.findOne(query, projection, (user) => {
	if (user) // Object or undefined
		console.log(`User name: ${user.name}, email: ${user.email}`)
	else
		console.log('Cannot find such a user!')
})
```


## API

*DBiler* connects to a DBil client by url, secret, and DB name.

```javascript
const dbiler = getDbiler(url, secret, dbName)
```

The `dbiler` object provides the same method as `DBil` plus a callback.
The callback accepts a parameter corresponding to the DBil native return value. 

For example DBil's `count` returns count of object, but DBiler's `count` accepts a callback, which accepts a parameter count.

```javascript
// DBil
const dbil  = dbil.getDb(user)
const count = dbil.count({foo: 42})

// DBiler
const dbiler = dbiler.getDbiler(url, secret, user)
dbiler.count({foo: 42}, (count) => {
})
```

### Inserting documents

A document is of type `Object`.

```javascript
const doc     = {...}
const options = {skipSave: false}
dbiler.insert(doc, options, (id) => {
	console.log(typeof id) // string or undefined
})
```
### Finding documents

Use `find` or `findOne` to look for one or multiple documents matching you query.

* `find` returns an array of documents. If no matches, it returns an empty array.
* `findOne` returns the first found document or `undefined`.

```javascript
dbiler.find(query, projection, (docs) => {
	console.log( Array.isArray(docs) ) // => true
})

dbiler.findOne(query, projection, (doc) => {
	console.log(typeof doc) // => Object or undefined
})
```

### Counting documents

You can use `count` to count documents. It accepts the same query as `find`.

```javascript
dbiler.count(query, (count) => {
	console.log(typeof count) // => number
})
```

### Updating documents

`update` returns the `id` of the inserted doc or `undefined`:

```javascript
dbiler.update(query, update, options, (id) => {
	console.log(typeof id) // => string or undefined
})
```

### Removing documents

```javascript
dbiler.remove(query, options, (numRemoved) => {
	console.log(typeof numRemoved) // => number
})
```

### Saving DB

Yuo can force the DB save with the `save` method.
It is useful only if the previous `insert`, `update`, or `remove` were sent with option `{skipSave: true}`

```javascript
dbiler.save((isSaved) => {
	console.log(typeof isSaved) // => boolean
})
```
