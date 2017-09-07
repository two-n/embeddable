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
  for(var scriptTag, i = 0; i < scriptTags.length; i++) {
    scriptTag = scriptTags[i];
    if (isOwnScriptTag(scriptTag)) { return scriptTag; }
  }
  throw new Error('Could not find own script tag')
}

function isOwnScriptTag(scriptTag) {
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
