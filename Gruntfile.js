'use strict';

module.exports = function(grunt) {

grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-concat');
grunt.loadNpmTasks('grunt-contrib-clean');
grunt.loadNpmTasks('grunt-contrib-cssmin');
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-contrib-watch');

grunt.initConfig({
	pkg: grunt.file.readJSON('package.json'),
	meta: {
		banner:
		'/* \n'+
		' * <%= pkg.name %> v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> \n'+
		' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> \n'+
		' * <%= pkg.author.email %> \n'+
		' * <%= pkg.author.url %> \n'+
		' * \n'+
		' * Licensed under the <%= pkg.license %> license. \n'+
		' * \n'+
		' * Source: \n'+
		' * <%= pkg.repository.url %> \n'+
		' */\n'
	},
	clean: {
		dist: {
			src: ['dist/*']
		}
	},
	jshint: {
		options: {
			globals: {
				console: true,
				module: true
			},
			"-W099": true,	//ignore tabs and space warning
			"-W044": true,	//ignore regexp
			"-W033": true
		},
		files: ['src/*.js']
	},
	concat: {
		//TODO cut out SearchMarker
		options: {
			banner: '<%= meta.banner %>'
		},
		dist: {
			files: {
//				'dist/fenix-ui-map.src.js': ['src/fenix-ui-map.js'],			
//				'dist/fenix-ui-map.src.css': ['src/fenix-ui-map.css']
			}
		}
	},
	uglify: {
		options: {
			banner: '<%= meta.banner %>'
		},
		dist: {
			files: {
//				'dist/fenix-ui-map.min.js': ['dist/fenix-ui-map.src.js']
			}
		}
	},
	cssmin: {
		combine: {
			files: {
//				'dist/fenix-ui-map.min.css': ['src/fenix-ui-map.css']
			}
		},
		options: {
			banner: '<%= meta.banner %>'
		},
		minify: {
			expand: true,
			cwd: 'dist/',
			files: {
//				'dist/fenix-ui-map.min.css': ['src/fenix-ui-map.css']
			}
		}
	},
	watch: {
		dist: {
			options: { livereload: true },
			files: ['src/*'],
			tasks: ['clean','concat','cssmin','jshint']
		}		
	}
});

grunt.registerTask('default', [
	'clean',
	'concat',	
	'cssmin',
	'jshint',
	'uglify'
]);

};