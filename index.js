
// this is just a helper, a store
// for the node module locations
// so that each time we start adding
// to a project, we don't have to remember
// the node path for an installed file,
// and the result is a leaner, much faster
// configurable

var _1dr = function( keyword ) {
    return './node_modules/build-utilities/libs/'+keyword+'.js';
};

// @TODO = some kind of function that outputs instructions so we can remember what
// the hell each of these does.
// and obviously to increase this further

var _locations = {

    // ours
        'resizeEnd': _1dr('resizeEnd'),
        'oneModals': _1dr('oneModals'),
        'classToggler': _1dr('classToggler'),
        'exposure': _1dr('jquery.exposure'),

    // vendor
        'jquery' : './node_modules/jquery/dist/jquery.min.js',
        'picturefill': './node_modules/picturefill/dist/picturefill.min.js',
        'scrollMonitor' : './node_modules/scrollmonitor/scrollMonitor.js',

};

module.exports = {

    locations: _locations,

    load: function( ids, add ) {

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

};
