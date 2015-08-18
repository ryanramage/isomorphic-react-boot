
module.exports = function(React){
  var DOM = React.DOM,
      div = DOM.div,
      script = DOM.script,
      link = DOM.link;

  return {
     getInitialState: function() {
      return {
        domId: this.props.domId ||  'widget-' +  Math.round( Math.random() * 1000 ),
        className: this.props.className || 'widget'
      }
    },
    getBundleScriptTag: function(bust_cache){
      var script_url = this.props.asset_url + '/bundle.js'
      if (bust_cache) script_url += '?' + Date.now()
      return script({src: script_url})
    },

    getBundleLink: function(bust_cache){
      var asset_url = this.props.asset_url + '/bundle.css'
      if (bust_cache) asset_url += '?' + Date.now()
      return link({rel:'stylesheet', type:'text/css', href: asset_url})
    }

  }

}
