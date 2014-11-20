module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({

		// Metadata.
		pkg : grunt.file.readJSON('package.json')
		// global config
	
		, banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
		'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
		'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
		' Licensed under <%= _.pluck(pkg.license, "type").join(", ") %> */\n'

		// add bower components to requirejs config file
		, bower: {
			target: {
				rjsConfig: 'config.js'
			}
		}

		// Task configuration.
		, clean    : {
			development  : ['dist/b_data-filter.js'],
			production   : ['dist/b_data-filter.min.js']
		}

		, copy : {
			development: {
				files: [
					{expand: true, src: ['b_data-filter.js'], dest: 'dist/'}
				]
			}
			, production: {
				files: [
				]
			}
		}

		, uglify: {
			options: {
				banner: '<%= banner %>'
			},
			dist   : {
				src : 'b_data-filter.js',
				dest: 'dist/b_data-filter.min.js'
			}
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-bower-requirejs');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	/**
	 * ----------------
	 * GRUNT TASKS
	 * ----------------
	 */


		// js build
	grunt.registerTask('jsBuild', ['bower', 'clean:js', 'requirejs', 'concat']);


	// set config
	grunt.registerTask('set_config', 'Set a config property.', function(name, val) {
		grunt.config.set(name, val);
	});

	//Build and compile all vor development
	grunt.registerTask('devRelease', ['clean:development', 'copy:development']);
	grunt.registerTask('release', ['clean:production', 'uglify', 'copy:production']);

};
