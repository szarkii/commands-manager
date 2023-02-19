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

# GUI

Graphical interface is contained in a singular HTML file. The logic is written in TypeScript and compiled to one file using Webpack.

### Building

For the first time you have to install the dependencies:
```
npm install
```

Then you can build in "production" mode:
```
npm run build
```

or with the "watch" mode which should observe the changes and apply them at runtime (but usually does not work as expected):
```
npm run start
```

### Services

Services are instantiated in `app.ts` file and used in the HTML using global `app` variable, e.g:
```HTML
onchange="app.environmentUrlsService.refreshEnvironmentUrls()"
```

### Views

HTML components are divided to separate files to increase the readability. Files are declared in the `webpack.config.js` file, e.g:
```javascript
const textUtilsView = fs.readFileSync(sourceFilesDir + '/views/text-utils.html');
// ...
module.exports = {
    plugins: [
        new HtmlWebpackPlugin({
            // ...
            textUtilsView
        })
    ]
}
```
Then it's used in the HTML file:
```html
<h2 class="section-header">Text Utils</h2>
<%= htmlWebpackPlugin.options.textUtilsView %>
```
Webpack replaces `<%= htmlWebpackPlugin.options.textUtilsView %>` with the contents of `text-utils.html` file.