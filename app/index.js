'use strict';
var util = require('util');
var fs = require('fs');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _  = require('underscore');

// Import Underscore.string to separate object, because there are conflict functions (include, reverse, contains)
_.str = require('underscore.string');
_.mixin(_.str.exports());
_.str.include('Underscore.string', 'string');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the kickass' + chalk.red('JanusDist') + ' generator!'
    ));

    // Prompt user for the directory, default to 'images'.
    var prompts = [{
      type: 'input',
      name: 'imageDirLoc',
      message: 'Where do your images reside?',
      default: 'images'
    }];

    this.prompt(prompts, function (props) {

      // get the files in the directory
      this.imageDirLoc = props.imageDirLoc;
      var assetImages = [];
      this.assetImages = fs.readdirSync(props.imageDirLoc).forEach(function (val, idx, arr) {
        this.push({
          'id': _.slugify(val),
          'src': val,
          'pos': 'pos', // todo: calc pos, x y z dir
          'xdir': 'xdir',
          'ydir': 'ydir',
          'zdir': 'zdir'
        });
      }, assetImages);
      this.assetImages = assetImages;

      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      this.fs.copyTpl(
        this.templatePath('_index.html'),
        this.destinationPath('public/index.html'),
        {
          title: 'JanusDist',
          description: 'test description',
          assetImages: this.assetImages,
          imageDirLoc: this.imageDirLoc
        }
      );
    }
  }
});
