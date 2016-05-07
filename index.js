'use strict';
const path = require('path');
const anymatch = require('anymatch');
const fs = require('fs');
const glob = require('glob');

class ReplacePlugin {
  constructor(config) {
    this.config = config && config.plugins && config.plugins.replacement || {};
    this.package = {};
    this.isProduction = false;
    if (this.config.environment) {
      this.defaultEnv = this.config.environment;
    }
    if (config.env && config.env[0] === 'production') {
      this.isProduction = true;
    }
    if (config.paths.packageConfig) {
      const pconf = require(path.resolve(config.paths.packageConfig));
      if (pconf) {
        this.package = pconf;
      }
    }
    this.replacements = this.config.replacements || [{
      files: [/\.js$/, /\.html$/],
      match: {find: '@@VERSION@@', replace: p => p.version}
    }];
    
    // Normalize
    this.replacements.forEach(rep => {
      if (rep.files) {
        rep.files = anymatch(rep.files);
      } else {
        rep.files = () => true;
      }
      if (!rep.matches) {
        rep.matches = [];
      }
      if (rep.match) {
        rep.matches.push(rep.match);
        delete rep.match;
      }
      rep.matches.forEach(m => {
        if (typeof m.find === 'string') {
          m.find = new RegExp(m.find, 'g');
        }
        if (typeof m.replace === 'function') {
          let fn = m.replace;
          m.replace = () => {
            var args = Array.prototype.slice.call(arguments);
            return fn(this.package, ...args);
          };
        }
      });
    });
  }

  onCompile(files, assets) {
    let useFiles = files.map(x => x.path).concat(assets.map(x => x.destPath))
    if (this.isProduction) {
      useFiles = useFiles.reduce((p,f) => {
        if (!f) {
          return p;
        }
        try {
          fs.accessSync(f, fs.R_OK | fs.W_OK);
        } catch (e) {
          const ext = path.extname(f);
          const dir = path.dirname(f);
          const base = path.basename(f, ext);
          const fglob = path.join(dir, base + '*' + ext);
          const additional = glob.sync(fglob);
          return p.concat(additional);
        }
        return p.concat(f);
      }, []);
    };
    this.doReplacement(useFiles);
  }


  doReplacement(allFiles) {
    
    allFiles.forEach(file => {
      if (!file) {
        return;
      }
      let matchers = this.replacements.reduce((p,c) => c.files(file) ? p.concat(c.matches) : p, []);
      if (!matchers.length) {
        return;
      }
      let content = fs.readFileSync(file, 'utf8');
      matchers.forEach(m => {
        content = content.replace(m.find, m.replace);
      });
      fs.writeFileSync(file, content, 'utf8');
    });
  }
}

ReplacePlugin.prototype.brunchPlugin = true;

module.exports = ReplacePlugin;