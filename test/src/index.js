var embeddable = require('../../index');

embeddable.createEmbed(
  {
    initPlayer: function(err, embed) {
      embed.el.innerHTML = '<div class="embedded">This is embed #' + embed.params.number + '</div>'
    },
    initApp: function() {
      embeddable.loadStylesheet('index.css')
    }
  }
)
