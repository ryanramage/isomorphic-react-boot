var fs = require('fs')
var path = require('path')
var camelCase = require('camel-case')
var Mustache = require('mustache')
var template = path.resolve(__dirname, 'loader.mustache.html')
var html = fs.readFileSync(template).toString()

exports.app_react = function (widgetName, props, React, ReactWidget, reply, view_opts) {
  if (!view_opts) view_opts = {}

  props.domId = widgetName + '-' + Math.round(Math.random() * 1000)
  props.className = widgetName

  view_opts.domId = props.domId
  view_opts.realFunction = camelCase(widgetName)
  view_opts.props = JSON.stringify(props)
  view_opts.script_src = props.asset_url + '/bundle.js'
  view_opts.stylesheet_src = props.asset_url + '/bundle.css'
  view_opts.widget = React.renderToString(ReactWidget(props))
  reply(Mustache.render(html, view_opts))
}
