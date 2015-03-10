
var fs = require('fs'),
    path = require('path'),
    sa = require('seaport-advert'),
    URI = require('URIjs'),
    ua = require('useragent'),
    camelCase = require('camel-case'),
    assign = require('lodash.assign'),
    widget_token = require('widget-token'),
    Mustache = require('mustache'),
    p = path.resolve(__dirname, 'loader.mustache.html'),
    html = fs.readFileSync(p).toString(),
    template = Mustache.parse(html);


exports.router_info(config_router, cb){
  if (!config_router.find && config_router.host && config_router.port) {
    return cb(null, {host: config_router.host, port: config_router.port});
  }
  sa.find(cb);
}



exports.react = function(widgetName, props, React, ReactWidget, reply){

  props.domId = widgetName + '-' + Math.round( Math.random() * 1000 );
  props.className =  widgetName;

  var view = {
    domId: props.domId,
    anonFunction: camelCase(widgetName) + '_' + camelCase(props.domId) + '_load',
    realFunction: camelCase(widgetName),
    props: JSON.stringify(props),
    src: props.asset_url + '/bundle.js'
  }
  var script = Mustache.render(html, view);
  var myAppHtml = React.renderToString(ReactWidget(props));



  reply(
    [ script,
      myAppHtml,
    ].join('\n')
  )

};


exports.relative_urls = function(req, widget_path, fallback_proxy_path,  urls) {

  // Get the user agent.
  var agent = ua.parse(req.headers['user-agent']),
      api_host;

  // IE9 and below...
  if (agent.family == 'IE' && parseInt(agent.major, 10) <= 9 && req.headers.referer) {
    // Rewrite host as CORS does not work; take it from referer.
    // append a trailing location to use the widget proxy path on the site
    var referer = req.headers.referer;
    if (!referer.match(/^http/)) referer = 'http://' + referer; // just so can parse as host

    api_host = URI(req.headers.referer).host() + fallback_proxy_path;
  } else {
    // Use host from headers.
    api_host = req.headers.host;
  }

  var rel = {};
  Object.keys(urls).forEach(function(key){
    rel[key] = '//' + api_host + '/' + widget_path + urls[key];
  })

  return rel;
}


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
