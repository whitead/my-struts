My Struts
=====

Website struts

    my-struts/
    |
    |----assets/ #Contains any site assets (images, css, templates, etc)
    |    |
    |	 |----css/ #location of .css and .less files
    |----build/ #where build will be generated
    |----html/ #where html is found
    |----js/
    |	 |
    |	 |----header.js #Will be put on top of all js files
    |----vendor/ #Contains any js libraries
    |
    |----Gruntfile.js #Grunt file for building
    |----.jshintrc #jshint run configuration
    |----package.json #Config file for npm
    
Build Instructions
----
After installing `nodejs` and `npm`:

    npm install grunt-cli
    npm install
    grunt

At this point, a preview should exist at `http://localhost:4000`.

LESS/CSS
----

Put into `main.less` in `assets/css`.

JS
----

Put into possibly separated prefixed files in `js/`. For example,
`WL-Math.js` would be a file. The build puts them alll into a
single file. 

HTML
----

Nothing special, just that it will switch out the `base.js` file with
`base.min.js` when switching to product mode. The un-minified allows
you to debug on Chrome for example.
