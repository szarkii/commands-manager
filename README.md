# Commands Manager

GUI and API for managing Linux commands.

# API

### Security

API request is authorized by token that needs to provided in `x-hub-signature` header. Signature is created based on configured secret and request data, e.g:

```
echo "var crypto=require('crypto'); console.log(crypto.createHmac('sha1', 'SECRET').update('REQUEST').digest('hex'));" | node
```

API test:

```
curl -X POST -d "REQUEST" -H "x-hub-signature: SIGNATURE" http://URL
```

The response should be "Commands Manager API works." if the request had been authorized successfully.

Request data can be empty.