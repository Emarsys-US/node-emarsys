# Emarsys API Wrapper

Promise-based wrapper for the Emarsys API in NodeJS.
[Emarsys API Documentation](https://dev.emarsys.com/docs/core-api-reference).

## Installation
```
$ npm i node-emarsys
```

```js
import  * as Emarsys from 'node-emarsys';

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

## constructor:


    import  * as Emarsys from 'node-emarsys';

    const apiHandler = new Emarsys(user, pass);


Creates a new Api handler object. Calling the methods associated with this handler object will make API requests using the username and password supplied to this constructor.

Parameters:
- **user**: the user name of the Emarsys API user
- **pass**: the password of the Emarsys API user
- **baseUrl**: optional, the base url of the Emarsys API. Defaults to 'https://api.emarsys.net/api/v2'

[Creating a new API user](https://help.emarsys.com/hc/en-us/articles/115004740329#api-users)

---

## Methods:

### **get(uri, data)**

    //Example
    apiHandler.get('/contact/query', {return: 14});


Sends a request to the API method at the given URI with the query strings from *data*. Can be used for any API method listed as a *GET* method.
[Example GET method](https://dev.emarsys.com/v2/contacts/list-contact-data)

Parameters:
- **uri**: The path of the API method to request. *Note that the '/v2' portion of the path is supplied for you by default*
-  **data**: The Query strings to include in the request, in the form of a JSON object.

Response:

This method returns a [Promise](https://www.promisejs.org/) for the response from the API. That promise will resolve to a JSON object that contains the [replyCode and replyText](https://dev.emarsys.com/v2/response-codes/error-codes) of the response as well as the data that was requested.

Error Handling:

In the event of an error, the [Promise](https://www.promisejs.org/) will be rejected and will return a string that contains information on the error. For example:

    TransformError: Error: The segment is currently evaluated.




### **put (uri, data)**


    //Example

    import  * as Emarsys from 'node-emarsys';

    const apiHandler = new Emarsys(user, pass);

    apiHandler.put('/contact', {
      "key_id": "3",
      "contacts": [
       {
          "2": "Selvig",
          "3": "erik.selvig@example.com"
        },
        {
          "2": "Boothby",
          "3": "ian.boothby@example.com"
        }
      ]
    });

Sends a request to the API method at the given URI with the request body from *data*. Can be used for any API method listed as a *PUT* method.
[Example PUT method](https://dev.emarsys.com/v2/contacts/update-contacts)

Parameters:
- **uri**: The path of the API method to request. *Note that the '/v2' portion of the path is supplied for you by default*
-  **data**: The request body to include in the request, in the form of a JSON object.

Response:

This method returns a [Promise](https://www.promisejs.org/) for the response from the API. That promise will resolve to a JSON object that contains the [replyCode and replyText](https://dev.emarsys.com/v2/response-codes/error-codes) of the response as well as the data that was requested.

Error Handling:

In the event of an error, the [Promise](https://www.promisejs.org/) will be rejected and will return a string that contains information on the error. For example:

    TransformError: Error: The segment is currently evaluated.


### **post (uri, data)**


    //Example

    import  * as Emarsys from 'node-emarsys';

    const apiHandler = new Emarsys(user, pass);

    apiHandler.post('/contact', {
          "key_id": "3",
          "contacts": [
        {
          "2": "Selvig",
          "3": "erik.selvig@example.com",
          "source_id": 1234
        },
        {
          "2": "Boothby",
          "3": "ian.boothby@example.com"
        }
      ]
    };

Sends a request to the API method at the given URI with the request body from *data*. Can be used for any API method listed as a *POST* method.
[Example POST method](https://dev.emarsys.com/v2/contacts/create-contacts)

Parameters:
- **uri**: The path of the API method to request. *Note that the '/v2' portion of the path is supplied for you by default*
-  **data**: The request body to include in the request, in the form of a JSON object.

Response:

This method returns a [Promise](https://www.promisejs.org/) for the response from the API. That promise will resolve to a JSON object that contains the [replyCode and replyText](https://dev.emarsys.com/v2/response-codes/error-codes) of the response as well as the data that was requested.

Error Handling:

In the event of an error, the [Promise](https://www.promisejs.org/) will be rejected and will return a string that contains information on the error. For example:

    TransformError: Error: The segment is currently evaluated.


### **batch(uri, method, data, key_id = '3', batch_key = 'contacts')**


    //Example

    import  * as Emarsys from 'node-emarsys';

    const apiHandler = new Emarsys(user, pass);

    apiHandler.batch(
        '/contact', 
        'POST', 
        [{
          "2": "Selvig",
          "3": "erik.selvig@example.com",
          "source_id": 1234
        },
        {
          "2": "Boothby",
          "3": "ian.boothby@example.com"
        },
        {
          "2": "Rhodes",
          "3": "james.rhodes@example.com",
          "source_id": 5678
        },
        {
          "2": "Potts",
          "3": "pepper.potts@example.com"
        }],
        '3',
        'contacts');


Used to send a request to a simple message multiple times, each with up to 1000 items from the data parameter. The method will only work with PUT and POST requests as it places the data into the request body. The body of the request will take this form:


    {
        'key_id': *the key_id parameter*
        *the batch_key parameter*: [
            *Up to the first 1000 records from the data parameter*
        ]
    }


[One case where you would want to use batch is when creating new Contacts](https://dev.emarsys.com/v2/contacts/create-contacts)

Parameters:
- **uri**: The path of the API method to request. *Note that the '/v2' portion of the path is supplied for you by default*
- **method**: The [HTTP Method](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods) to be used in the API requests. *Note that this method places the data in the request body, so only PUT and POST are valid options for this parameter. GET, DELETE, and other request types are not supported.*
- **data**: A JSON array of records to be created, updated, etc. This array will be split into chunks of up to 1000 records, and each chunk will be sent as an individual API request
- **key_id**: The key to identify the contact by field identifier or contact identifier. If not provided, defaults to field identifier 3 (Email).
- **batch_key**: The JSON key that will be used in the request body along with the chunk of records from the data parameter. For example, if you were updating contacts, this parameter would be 'contacts' and it would result in the request body in the above example. This field will be determined by the syntax of API that you're making requests to.

Response:

The response will be a promise for a single JSON object with similar syntax to other API responses. All of the ids in the responses to each individual request will be put into the 'ids' field of the final response object, and the same is true for errors in the 'errors' field.


    //Example
    {
      "replyCode": 0,
      "replyText": "OK",
      "data": {
        "ids": [
          123,
          456
        ],
        "errors": {
          "james.rhodes@example.com": {
            "2009": "Contact with the external id already exists: 3"
          },
          "pepper.potts@example.com": {
            "2009": "Contact with the external id already exists: 3"
          }
        }
      }
    }


Error Handling:

This method will never reject the returned promise. Any fully-erroneous requests will simply be ignored. Any errors that appear from individual items in your dataset will be appended to the final 'errors' object.


## Public packages used:
- [crypto](https://nodejs.org/api/crypto.html)
- [axios](https://www.npmjs.com/package/axios)
