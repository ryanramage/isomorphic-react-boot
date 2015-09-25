
var fs = require('fs'),
    path = require('path'),
    URI = require('URIjs'),
    ua = require('useragent'),
    camelCase = require('camel-case'),
    assign = require('lodash.assign'),
    widget_token = require('widget-token'),
    Mustache = require('mustache'),
    script_template = path.resolve(__dirname, 'loader.mustache.html'),
    app_template = path.resolve(__dirname, 'app-loader.mustache.html'),
    html = fs.readFileSync(script_template).toString(),
    app_html = fs.readFileSync(app_template).toString();

exports.react = function(widgetName, props, React, ReactWidget, reply){

  props.domId = widgetName + '-' + Math.round( Math.random() * 1000 );
  props.className =  widgetName;

  var view = {
    domId: props.domId,
    anonFunction: camelCase(widgetName) + '_' + camelCase(props.domId) + '_load',
    realFunction: camelCase(widgetName),
    props: JSON.stringify(props),
    src: props.asset_url + '/bundle.js?'
  }
  var script = Mustache.render(html, view);
  var myAppHtml = React.renderToString(ReactWidget(props));



  reply(
    [ script,
      myAppHtml,
    ].join('\n')
  )

};

exports.app_react = function(widgetName, props, React, ReactWidget, reply, view_opts){

  if (!view_opts) view_opts = {};

  props.domId = widgetName + '-' + Math.round( Math.random() * 1000 );
  props.className =  widgetName;

  view_opts.domId = props.domId;
  view_opts.realFunction = camelCase(widgetName);
  view_opts.props = JSON.stringify(props);
  view_opts.script_src = props.asset_url + '/bundle.js';
  view_opts.stylesheet_src = props.asset_url + '/bundle.css';
  view_opts.widget = React.renderToString(ReactWidget(props));
  var html = Mustache.render(app_html, view_opts);
  reply(html)

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
