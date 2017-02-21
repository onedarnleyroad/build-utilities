module.exports = function( gulp, $ ) {

    var requireNew = require('require-new');
    var filesExist = require('files-exist');

    var joinscripts = function (src, dest, target) {

        gulp.src( filesExist(src, { exceptionMessage: ' Files from scriptFiles are missing' }) )
                .pipe($.plumber())
                .pipe($.sourcemaps.init())
                .pipe($.concat( target ))
                .pipe($.sourcemaps.write('maps'))
                .pipe(gulp.dest(dest));

        return gulp.src( filesExist(src, { exceptionMessage: ' Files from scriptFiles are missing' }) )
                .pipe($.plumber())
                .pipe($.concat( target ))
                .pipe($.rename( function(path) {
                    path.extname = ".min.js";
                }))
                .pipe($.uglify())
                .pipe(gulp.dest( dest ));
    };

    // copy an array of scripts over to dest,
    // do not do sourcemaps, but provide
    // both a min and unminified version.
    var movescripts = function (src, dest) {

        src.forEach(function( file ) {
            gulp.src(file)
                .pipe(gulp.dest(dest))

                // if JS then uglify and min
                // but don't assume JS because we can send CSS or whatever
                // to move scripts if we want.
                .pipe( $.if( '*.js', $.uglify() ) )
                .pipe( $.if( '*.js', $.rename( function(path) {
                    path.extname = ".min.js";
                })))
                .pipe(gulp.dest(dest));
        });

    };

    return {


        task: function( srcFile, scriptsDest ) {

            return function() {
                var getScriptFiles = requireNew( srcFile );

                getScriptFiles( scriptsDest ).forEach(function( scripts ) {

                    // set a default destination
                    var thisDest = scriptsDest;

                    // ...and only update it if it was actually set.
                    if (scripts.hasOwnProperty( 'dest') && scripts.dest) {
                        thisDest = scripts.dest;
                    }

                    // avoid throwing errrows....
                    if (scripts.hasOwnProperty('target') && scripts.target) {
                        // concat
                        joinscripts( scripts.files, thisDest, scripts.target );
                    } else {
                        // do not concatenate
                        movescripts( scripts.files, thisDest );
                    }
                });
            }

        }

    };

}
