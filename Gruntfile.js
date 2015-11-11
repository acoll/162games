module.exports = function (grunt) {
	grunt.initConfig({
		clean: { build: ['build'] },
		jade: {
			html: {
				options: { 
					pretty: true,
					data: {}
				},
				files: { 
					'build/index.html': ['frontend/index.jade']
				}
			}
		},
		connect: {
			server: {
				options: {
					port: 9192,
					base: 'build',
					livereload: 35000
				}
			}
		},
		sass: {
			options: {
				sourceMap: true
			},
			styles: {
				files: { 
					'build/css/style.css': 'frontend/styles/style.scss'
				}
			}
		},
		watch: {
			options: { livereload: 35000 },
			jade: {
				files: ['frontend/*.jade'],
				tasks: ['jade']
			},
			sass: {
				files: ['frontend/styles/**/*'],
				tasks: ['sass']
			},
			js: {
				files: ['frontend/js/**/*.js'],
				tasks: ['jshint']
			},
			builds: {
				files: ['build/*.js'],
				tasks: []
			}
		},
		jshint: {
			options: { jshintrc: '.jshintrc' },
			code: {
				files: { src: ['frontend/js/**/*.js'] }
			}
		},
		browserify: {
			options: {
				browserifyOptions: { debug: true },
				watch: true
			},
			app: {
				files: { 'build/app.js':'frontend/js/app.js' },
				options: {
					transform: [
						['wrapify', {
							wrappers: [
								{ pattern: "\\.jade", prefix: "- console.log('RENDERING TEMPLATE: $filename')" },
								{ 
									pattern: "\\.jade",
									prefix: "// BEGIN TEMPLATE: $filename",
									suffix: "// END TEMPLATE: $filename"
								}
							]
						}],
						'jadeify',
						'babelify'
					]
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.registerTask('default', ['clean', 'jade', 'sass', 'jshint', 'browserify', 'connect', 'watch']);
	grunt.registerTask('build', ['clean', 'jade', 'sass', 'copy', 'jshint', 'browserify']);
};