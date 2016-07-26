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
