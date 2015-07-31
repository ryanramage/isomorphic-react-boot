
var fs = require('fs'),
    path = require('path'),
    seaport = require('seaport'),
    sa = require('seaport-advert'),
    getPort = require('get-port'),
    URI = require('URIjs'),
    ua = require('useragent'),
    camelCase = require('camel-case'),
    assign = require('lodash.assign'),
    widget_token = require('widget-token'),
    Mustache = require('mustache'),
    p = path.resolve(__dirname, 'loader.mustache.html'),
    html = fs.readFileSync(p).toString(),
    template = Mustache.parse(html);


exports.seaport = function(role, opts, cb) {

  if (!opts.timeout) opts.timeout = 5000;

  exports.service_info(opts, function(err, service_port){
    if (err) return cb(err);

    console.log('service', role);
    console.log('running on port', service_port);

    function doSeaport() {
      console.log('trying to connect to seaport')
      exports.router_info(opts, function(err, router){
        if (err) {
          console.log('Error', err);
          console.log('will retry seaport in ', opts.timeout);
          return setTimeout(doSeaport, opts.timeout);
        }

        if (router.url) console.log('available at', router.url + '/' + role)

        var s = seaport.connect(router.host, router.port);
        s.on('connect', function(){
          console.log('seaport connected');
        })
        s.on('disconnect', function(){
          console.log("seaport disconnected");
          process.nextTick(doSeaport);
          s.close();
        });
        s.on('timeout', function(){
          console.log('seaport timeout');
        })
        s.register(role, {port: service_port});
      })

    }
    process.nextTick(doSeaport)
    cb(null, service_port);
  })
}


exports.router_info = function(opts, cb){
  if (!opts.find && opts.host && opts.port) {
    return cb(null, {host: opts.host, port: opts.port});
  }
  sa.find(opts, cb);
}

exports.service_info = function(opts, cb){
  if (opts.service_port) return cb(null, opts.service_port);
  return getPort(cb);
}


exports.react = function(widgetName, props, React, ReactWidget, reply){

  props.domId = widgetName + '-' + Math.round( Math.random() * 1000 );
  props.className =  widgetName;

  var view = {
    domId: props.domId,
    anonFunction: camelCase(widgetName) + '_' + camelCase(props.domId) + '_load',
    realFunction: camelCase(widgetName),
    props: JSON.stringify(props),
    src: props.asset_url + '/bundle.js?' + Date.now()
  }
  var script = Mustache.render(html, view);
  var myAppHtml = React.renderToString(ReactWidget(props));



  reply(
    [ script,
      myAppHtml,
    ].join('\n')
  )

};


exports.load_settings = function(settings_db, query, host, cb){
  if (!query) query = {};

  if (!query.secure) return cb(null, {});

  try {
    var _secure = JSON.parse(query.secure);
    var settings_id = _secure.settings_id;
    widget_token.load_settings(settings_db, settings_id, host, function(err, settings){
      if (err) return cb(err);
      assign(_secure, settings.general, settings.per_host)
      return cb(null, _secure);
    })
  } catch(e){ return cb({}) }
}
