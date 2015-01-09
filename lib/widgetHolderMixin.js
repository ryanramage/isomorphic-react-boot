var React = require('react'),
    DOM = React.DOM,
    div = DOM.div, button = DOM.button, ul = DOM.ul, li = DOM.li, script = DOM.script, link = DOM.link


module.exports = {
   getInitialState: function() {
    return {
      domId: this.props.domId ||  'widget-' +  Math.round( Math.random() * 1000 ),
      className: this.props.className || 'widget'
    }
  },

  getBundleScriptTag: function(){
    return script({src: this.props.asset_url + '/bundle.js'})
  },

  getBundleLink: function(){
    return link({rel:'stylesheet', type:'text/css', href: this.props.asset_url + '/bundle.css'})
  }

}