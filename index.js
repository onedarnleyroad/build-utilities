
// this is just a helper, a store
// for the node module locations
// so that each time we start adding
// to a project, we don't have to remember
// the node path for an installed file,
// and the result is a leaner, much faster
// configurable

var _1dr = function( keyword ) {
    return './node_modules/1dr-build-utilities/libs/'+keyword+'.js';
};

// @TODO = some kind of function that outputs instructions so we can remember what
// the hell each of these does.
// and obviously to increase this further

var _locations = {

    // ours
        'resizeEnd': _1dr('resizeEnd'),
        'oneModals': _1dr('oneModals'),
        'classToggler': _1dr('classToggler'),
        'class.photoswipe': _1dr('class.photoswipe'),
        'exposure': _1dr('jquery.exposure'),

    // vendor
        'photoswipe': './node_modules/photoswipe/dist/photoswipe.min.js',
        'flickity': './node_modules/flickity/dist/flickity.pkgd.min.js',
        'jquery' : './node_modules/jquery/dist/jquery.min.js',
        'picturefill': './node_modules/picturefill/dist/picturefill.min.js',
        'scrollMonitor' : './node_modules/scrollmonitor/scrollMonitor.js',

};

var _load = function( ids, add ) {

    var fileList = [];

    ids.forEach( ( id ) => {

        if ( _locations.hasOwnProperty( id ) ) {
            fileList.push( _locations[id] )
        } else {
            console.log( "Couldn't Find " + id + " in the file list store!" );
        }

    });
    add = add || [];
    return fileList.concat( add );

}

const   gulpLoadPlugins = require('gulp-load-plugins'),
        $ = gulpLoadPlugins();

module.exports = function( gulp ) {



    // load our script task,
    // we'll make this a bit more extended
    // when we know more

    var _gulpScripts = require('./gulp-tasks/gulp-scripts')( gulp, $ );

    var gulpScripts = function( config, defaultDest ) {



    	var files = [];


        config.forEach(function( group ) {
        	var list = _load( group.packageFiles, group.projectScripts );

        	group.files = list;
        	files.push( group );

        });

        return _gulpScripts( files, defaultDest );

    };

    return {



        locations: _locations,



        load: _load,

        tasks: {
            scripts: gulpScripts
        }

    }
};
