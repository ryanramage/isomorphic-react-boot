var React = require('react'),
    ua = require('useragent'),
    camelCase = require('camel-case'),
    assign = require('lodash.assign'),
    widget_token = require('widget-token');


exports.react = function(widgetName, props, ReactWidget, reply){

  props.domId = widgetName + '-' + Math.round( Math.random() * 1000 );
  props.className =  widgetName;

  var myAppHtml = React.renderToString(ReactWidget(props))
  reply(
    [ myAppHtml,
     '<script>',
      // this name below comes from the --standalone flag to browserify to expose it as a global
      camelCase(widgetName) + '('+ JSON.stringify(props) +', "' + props.domId + '")',
     '</script>'
    ].join('\n')
  )

};


exports.relative_urls = function(req, widget_path, fallback_proxy_path,  urls) {

  // Get the user agent.
  var agent = ua.parse(req.headers['user-agent']),
      api_host;

  // IE9 and below...
  if (agent.family == 'IE' && parseInt(agent.major, 10) <= 9) {
    // Rewrite host as CORS does not work; take it from referer.
    // append a trailing location to use the widget proxy path on the site
    api_host = url.parse(req.headers.referer).host + proxy_fallback;
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
