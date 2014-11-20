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
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	/**
	 * ----------------
	 * GRUNT TASKS
	 * ----------------
	 */

	//Build and compile all vor development
	grunt.registerTask('devRelease', ['clean:development', 'copy:development']);
	grunt.registerTask('release', ['clean:production', 'uglify', 'copy:production']);

};
