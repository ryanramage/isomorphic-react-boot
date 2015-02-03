
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
    getBundleScriptTag: function(){
      return script({src: this.props.asset_url + '/bundle.js'})
    },

    getBundleLink: function(){
      return link({rel:'stylesheet', type:'text/css', href: this.props.asset_url + '/bundle.css'})
    }

  }

}
