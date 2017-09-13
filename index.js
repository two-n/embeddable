function createEmbed (opts, callback) {
  // Support various method signatures
  if (!callback) {
    if (typeof opts === 'function') {
      // createEmbed(function() {})
      callback = opts
      opts = {}
    }
    else if (typeof opts === 'object') {
      // createEmbed({ initPlayer: function() {} })
      // createEmbed({ callback: function() {} })
      callback = opts.initPlayer || opts.callback
    }
  }

  // Try to find the script tag that embedded this very code
  // Bail if script tag couldn't be found
  try { var scriptTag = findOwnScriptTag(); }
  catch (err) { return callback(err, null); }

  // Parse params supplied via the script's src attribute, after the hash (#)
  var params = deparam(scriptTag.src.split('#')[1]);

  // Create or (if there are multiple embeds, the first of which was already
  // processed) find the global "App" object, which lets multiple embeddables
  // share information and runs `initApp` once regardless of the number of
  // embeddables present
  var namespace = opts.namespace || 'Embeddable'
  var App = window[namespace]
  if (!App) {
    App = window[namespace] = {}

    if (opts.initApp) {
      opts.initApp(App)
    }
  }

  var el = document.createElement('div');
  scriptTag.parentNode.insertBefore(el, scriptTag);
  callback(null, { el:el, params: params });
}

function loadStylesheet(url, callback) {
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.type = 'text/css';
  l.href = url
  document.getElementsByTagName('head')[0].appendChild(l)
  callback && callback()
}

function findOwnScriptTag() {
  var scriptTags = document.getElementsByTagName('script');
  for(var i = 0; i < scriptTags.length; i++) {
    if (isOwnScriptTag(scriptTags[i])) { return scriptTags[i]; }
  }
  throw new Error('Could not find own script tag')
}

function isOwnScriptTag(scriptTag) {
  if (!document.currentScript) {
    // IE11 and older do not support document.currentScript :(
    // Instead, we check if this is the "bottom-most" script tag on the page
    // in order to determine whether it's the currently running tag.
    // One KNOWN ISSUE with this approach is that it doesn't work with async scripts.
    // For more, see https://stackoverflow.com/questions/403967
    var scriptTags = document.getElementsByTagName('script');
    return scriptTag === scriptTags[scriptTags.length - 1]
  }
  return scriptTag === document.currentScript;
}

function deparam (querystring) {
  var querystring = (querystring || '').split('&')
  var params = {}
  var pair, i = querystring.length
  while (i > 0) {
    pair = querystring[--i].split('=')
    if (pair[0]) {
      params[ decodeURIComponent(pair[0]) ] = decodeURIComponent(pair[1])
    }
  }
  return params
}

module.exports = {
  createEmbed: createEmbed,
  loadStylesheet: loadStylesheet,
};
