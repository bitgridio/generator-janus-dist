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
      'Welcome to the kickass ' + chalk.red('JanusDist') + ' generator!'
    ));

    // Prompt user for the directory, default to 'images'.
    var prompts = [{
      type: 'input',
      name: 'imageDirLoc',
      message: 'Where do your images reside?',
      default: 'images'
    }, {
      type: 'input',
      name: 'imageConstraint',
      message: 'How many items per row would you like? (typically 10 or 20)',
      default: 10
    }, {
      type: 'input',
      name: 'docTitle',
      message: 'HTML title for this page:',
      default: 'JanusDist'
    }, {
      type: 'input',
      name: 'docHTML',
      message: 'HTML or text description for this page:',
      default: '<p>Generated with <a href="https://github.com/sirkitree/generator-janus-dist">Janus asset distributor</a>.'
    }];

    this.prompt(prompts, function (props) {

      // get the files in the directory
      this.imageDirLoc = props.imageDirLoc;
      this.imageConstraint = props.imageConstraint;
      this.docTitle = props.docTitle;
      this.docHTML = props.docHTML;

      // we divide by 2 because we will start in the negative
      var c = this.imageConstraint/2,
        x = c * (-1),
        y = 1;

      this.assetImages = [];

      // pass this.assetImages as the context which becomes 'this' inside the forEach();
      fs.readdirSync(props.imageDirLoc).forEach(function (val, idx, arr) {

        if (idx !== 0) {
          // not the first one
          x++;
        }

        this.push({
          'id': _.slugify(val),
          'src': val,
          'pos': {'x' : x, 'y' : y, 'z' : 0},
          'xdir': 'xdir',
          'ydir': 'ydir',
          'zdir': 'zdir'
        });

        // if we're at our contraint
        if (x === c) {
          // reset x to -c+1 because x is incremented above
          x = (c + 1) * (-1);
          // increment y
          y++;
        }

      }, this.assetImages);


      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      this.fs.copyTpl(
        this.templatePath('_index.html'),
        this.destinationPath('public/index.html'),
        {
          title: this.docTitle,
          description: this.docHTML,
          assetImages: this.assetImages,
          imageDirLoc: this.imageDirLoc
        }
      );
    }
  }
});
