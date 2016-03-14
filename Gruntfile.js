var fs = require('fs');

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
					port: 1620,
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
		},
		json_to_scss: {
			teams: {
				inputFile: './frontend/js/teams.json',
				varname: 'colors',
				outputFile: 'frontend/styles/__generated-color-map.scss'
			}
		}
	});

	grunt.registerMultiTask('json_to_scss', function () {
		var jsonFile = this.data.inputFile;
		var varName = this.data.varname;
		var outputFile = this.data.outputFile;

		grunt.log.writeln(`Generating ${outputFile} from ${jsonFile}...`);
		var teams = require(jsonFile);
		var scss = '/* THIS FILE IS GENERATED WITH `grunt json-to-scss`. Dont edit it.*/\n';
		scss += `/* GENERATED FROM ${jsonFile} */\n`;
		scss += teams.map((team) => {
			// console.log('TEAM:', team);

			var colorVars = team.colors.map((c,i) => `$${team.team_id}-color-${i+1}: ${c};`).join('\n');

			return `
${colorVars}
.${team.team_id} {
	color: $${team.team_id}-color-1;
	background-color: $${team.team_id}-color-${team.colors.length};
}
`;
		}).join('');
		
		fs.writeFileSync(outputFile, scss);
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