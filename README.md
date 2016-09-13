# replacement-brunch

Perform generic replacements on your compiled files or assets. In production mode plays well with `digest-brunch`.

## Note

Version 2.0.3 should be used with `brunch` versions from 2.6.3 to 2.7.7, anything later can use 2.0.4 of this plugin.

## Config Options

If you add a `replacement` property to the plugins object in your brunch config you can configure this plugin.

There are two config options.

### `environment`

This simply states which environments to run the replacements in. By default it does all of them. But if you set this to `"production"` then it will only run the replacements when doing a production build.

### `replacements`

This is an array filled with objects which look this this:

```js
{
  files: /\.js$/,
  matches: [
    {
      find: 'SOME_TOKEN',
      replace: 'My Name'
    }
  ]
}
```

The `files` property is an `anymatch` matcher for the files in your public output directory.

The `matches` property is an array of match objects, each with a find and replace property. The `find` value can be a string or a RegExp. Replace can be a function just like accepted by `string.replace` only with the first parameter set to the contents of the package.config.

## Examples

By default this plugin comes pre-configured with a single replacement. That replacement will replace any instance of `@@VERSION@@` inside any JavaScript or HTML file with the version specified in your `package.json` file. So if that is what you need, then you don't need to add any configuration at all to your `brunch-config` file.

However, if you want to specify different or additional replacements, you will lose this default one. To specify it yourself, you can configure it like so: (in your `brunch-config.js` file)

```js
{
  plugins: {
    replacement: {
      replacements: [{
        files: [/\.js$/, /\.html$/],
        match: {find: '@@VERSION@@', replace: p => p.version}
      }]
    }
  }
}
```

Another potential use is to do a simple find and replace only when building for production. Like a reference to an offline cache manifest.

```js
replacement: {
  environment: 'production',
  replacements: [{
    files: /index\.html$/,
    match: {find: 'data-offline-manifest', replace: 'manifest="offline.appcache"'}
  }]
}
```

You may even be able to use the plugin to set some basic config values in the `package.json` file and inject them into various pages/scripts. However, there are likely more suitable plugins for configuration.
