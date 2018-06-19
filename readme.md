# Emarsys API Wrapper

Promise-based wrapper for the Emarsys API in NodeJS.
[Emarsys API Documentation](https://dev.emarsys.com/v2/before-you-start/overview).

## Installation
```
$ npm i node-emarsys
```

```js
const Emarsys = require('node-emarsys');

const api = new Emarsys('username', 'password');
```
Passing your username and password will generate the WSSE header for your requests automatically.

## Usage

This library will JSON stringify your data object and include the necessary headers. It will also prepend the standard `https://api.emarsys.net/api/v2` uri so you only need to include the specific endpoint.

#### Making a Request

* **Request Type** `[method]` - get, post, put
* **uri** `[string]` - emarsys endpoint path AFTER /api/v2
* **data** `[object]` - data to send to endpoint
* **@returns** `[promise]` - returns a promise, rejecting if a request fails

```js
api[request type](uri, data)
.then(function(res){
    //successful response
})
.catch(function(err){
    // failed response
})
```

#### Example
```js
api.get('/contact/query/', {
    return: '4',
    '33941': '',
    excludeempty: true
}))
.then(function(res){
    // success
    console.log(res.data.result);
})
.catch(function(err){
    // failure
    console.log(err);
})
```