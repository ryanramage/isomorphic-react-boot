# widget-boot

Bootstrap a widget using some common patterns. Not really for public consumption at this point.

```
npm install isomorphic-react-boot
```


## Usage

``` js

var React = require('react')
var ReactDOM = require('react-dom/server')
var isomorphic = require('isomorphic-react-boot')
var YourWidget = React.createFactory(require('./YourWidget'))
var about = require('../package.json')

exports.start = function() {

    var server = new Hapi.Server();
    server.connection({ 'port': 8785 });

    server.route({
      method: 'GET',
      path: '/',
      handler: function(req, reply) {

        var props = {
          list: true,
          itemMode: false,
          asset_url: 'http://localhost:8785/assets'
        }
        isomorphic(about.name, props, ReactDOM, YourWidget, reply);
      })
    })
}

```

## License

MIT
