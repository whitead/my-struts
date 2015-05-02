'use strict';

var server = 'http://localhost:4000'

module.exports = function(grunt) {

    //load required grunt plugins
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    // Project configuration.
    grunt.initConfig({

	handlebars: {
	    compile: {
		options: {
		    
		    // configure a namespace for your templates
		    namespace: 'templates',
		    
		    // convert file path into a function name
		    // in this example, I convert grab just the filename without the extension 
		    processName: function(filePath) {
			var pieces = filePath.split('/');
			return pieces[pieces.length - 1].split('.')[0];
		    },
		    
		    //processs ROOT
		    processContent: function(content, srcpath) {
			    content = content.replace(/%ROOT%/g, server);
			    return content;
		    }

		    
		},
		
		// output file: input files
		files: {
		    'build/assets/templates/compiled.js': ['assets/templates/*.hbs']
		}
	    }
	},

	jshint: {
	    all: [
		'Gruntfile.js',
		'build/js/base.js'
	    ],
	    options: {
		jshintrc: '.jshintrc',
	    },
	},

	concat: {
	    build: {
		src: ['js/header.js', 'js/**/WL-*.js'],
		dest: 'build/js/base.js'
	    }
	},	
	copy: {	    
	    assets: {
		cwd: 'assets',
		src: ['**'],
		dest: 'build/assets',
		expand: true
	    },
	    htmltmpcopy: {
		cwd: 'tmp',
		src: [ '**/*.html'],
		dest: 'build',
		expand:true,
		options: {
	            processContent: function(content, srcpath) {
			    content = content.replace(/%ROOT%/g, server);
			    return content;
		    }
		}	
	    },
	    htmlprod: {
		cwd: 'tmp',
		src: [ '**/*.html' ],
		dest: 'build',
		expand: true,
		options: {
		    processContent: function (content, srcpath) {
			content = content.replace('/"js/base.js"/g','"js/base.min.js"');
			content = content.replace(/%ROOT%/g, server);
			return content;
		    }
		}	    
	    },
	    vendor: {
		cwd: 'vendor',
		src: [ '**/*.js' ],
		dest: 'build/js',
		expand: true
	    }

	},

	// Before generating any new files, remove any previously-created files.
	clean: {
	    build: ['build']
	},
	
	//html hints
	htmlhint: {
	    build: {
		options: {
		    'tag-pair': true,
		    'tagname-lowercase': true,
		    'attr-lowercase': true,
		    'attr-value-double-quotes': true,
		    'doctype-first': false,
		    'spec-char-escape': true,
		    'id-unique': true,
		    'head-script-disabled': false,
		    'style-disabled': false
		},
		src: ['index.html', 'html/*.html']
	    }
	},

	//watch mode
	watch: {
	    html: {
		files: ['html/**/*.html'],
		tasks: ['html-dev']
	    },
	    js: {
		files: ['js/**/*.js'],
		tasks: ['js-dev']
	    },
	    css: {
		files: ['assets/css/**/*.less'],
		tasks: ['less:dev']
	    }
	    
	},
	htmlbuild: {
	    dist: {
		src: ['**/*.html'],
		expand: true,
		cwd: 'html',
		dest: 'tmp',
		options: {
		    beautify: true,
		    sections: {
			includes: {
			    header: 'html_include/header.html',
			    navbar: 'html_include/navbar.html',
			    footer: 'html_include/footer.html',
			    scripts: 'html_include/scripts.html'
			}
		    }
		}	     
	    }		 
	},	
	//put together the js
	uglify: {
	    prod: {
		files: {
		    'build/js/base.min.js': ['build/js/base.js']
		}
	    }
	},

	//put together CSS
	less: {
	    dev: {
		options: {
		    paths: ["assets/css", "vendor/bootstrap/less"]
		},
		files: {
		    "build/css/main.css": "assets/css/main.less"
		}
	    },
	    prod: {
		options: {
		    paths: ["assets/css"],
		    cleancss: true,
		    modifyVars: {
			imgPath: '"http://mycdn.com/path/to/images"',
			bgColor: 'red'
		    }
		},
		files: {
		    "build/css/main.css": "assets/css/main.less"
		}
	    }
	},

	shell: {
            target: {
		command: 'echo deploy'
            }
	},

	//host the code
	connect: {
	    server: {
		options: {
		    port: 4000,
		    base: 'build',
		    hostname: '*'
		}
	    }
	}
    });
    
    grunt.registerTask('buildIndex', 'htmlbuild');
    // Actually load this plugin's task(s).
    grunt.registerTask('js-dev', ['concat', 'jshint', 'copy:vendor']);
    grunt.registerTask('js-prod', ['concat', 'uglify', 'copy:vendor']);
    grunt.registerTask('html-dev', ['htmlhint', 'buildIndex', 'copy:htmltmpcopy', 'copy:assets']); 
    grunt.registerTask('html-prod', ['buildIndex', 'copy:htmlprod', 'copy:assets']); 
    grunt.registerTask('default', ['clean:build', 'js-dev', 'html-dev', 'less:dev', 'connect', 'handlebars','watch']);
    grunt.registerTask('production', ['clean:build', 'js-prod', 'html-prod','less:dev', 'handlebars','shell']);
    
};
