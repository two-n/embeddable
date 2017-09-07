# Embeddable

A tiny module that helps make your javascript app embeddable on a web page via a single `<script>` tag. Once loaded, an *Embeddable*-enabled app will locate the very `<script>` tag that embedded it and create and insert an empty `<div>` right before that `<script>` tag's position in the DOM. Next, a callback function that you provide will be called and passed an Object that points to the empty DOM element that was created, along with other useful information such as params that might have been specified via the embedding `<script>` tag. At that point, your app can render itself into that div.

## Installation

    npm install embeddable

## API

**createEmbed**(*options*, *callback*)

**createEmbed**(*callback*)

**createEmbed**(*options*)

`options` is an object that can contain the following properties:

- `initPlayer` (aliased as `callback`) - instead of passing `callback` as a separate param, you can include it in the `options` object.
- `initApp` - a function that gets called **once** — even if the same script is embedded multiple times on the page — and **before** any of the `initPlayer` callbacks are called. This is a good opportunity to instantiate/prepare/load assets that are to be shared by all embeds.

The function you provide as `callback` will get called once the Embeddable's DOM element is created **or** if a problem was encountered in the process. The function's signature is the familiar `function(error, result) {}` where, if successful, `results` will contain the following props:

- `el` - the DOM element that was created
- `params` - an object of key value pairs passed in via the `<script>` tag's `src` attribute following a hash (#) in the url. For example `src="path/to/script.js#foo=bar&baz=5"` will yield a `params: { foo:"bar", baz:"5"}`.


## Example

```js

import { createEmbed, loadStylesheet } from 'embeddable'

createEmbed({
  initPlayer: function(err, embed) {
    // This runs once for each <script> tag that embeds this code
    // If this were a React app, you'd trigger ReactDOM.render(...) from here. But in this
    // simple example, all we'll do is:
    embed.el.innerHTML = '<div class="embedded">This is embed #' + embed.params.number + '</div>'
  },
  initApp: function() {
    // This runs once regardless of how many <script> tags embed this code on the page.
    // A good place to load stylesheet and other assets shared by all embeddable
    loadStylesheet('index.css')
  }
})

```

Once transpiled, you can embed this on your page any number of times, passing any params you'd like:

```html

<body>
  <p>This test embeds 2 players. You should see the first one right below:</p>
  <script src='./embeddable.build.js#number=1' ></script>
  <p>Now, this text block should appear AFTER the first embed and BEFORE the next embed, which you should see right below:</p>
  <script src='./embeddable.build.js#number=2' ></script>
  <p>And this text should appear AFTER everything else</p>
</body>

```


## Testing

Testing is currently semi-complete: running `npm test` will build a simple Embeddable app (see `test/src`) and open it up in an Electron browser. You can then visually check whether or not the page rendered as expected; the program does not make any automated assertions at the moment.
