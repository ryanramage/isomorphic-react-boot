exports.getInitialState = function (React, props) {
  return {
    domId: props.domId || 'widget-' + Math.round(Math.random() * 1000),
    className: props.className || 'widget'
  }
}

exports.getBundleScriptTag = function (React, props, bust_cache) {
  var script_url = props.asset_url + '/bundle.js'
  if (bust_cache) script_url += '?' + Date.now()
  return React.DOM.script({src: script_url})
}

exports.getBundleLink = function (React, props, bust_cache) {
  var asset_url = props.asset_url + '/bundle.css'
  if (bust_cache) asset_url += '?' + Date.now()
  return React.DOM.link({rel: 'stylesheet', type: 'text/css', href: asset_url})
}
