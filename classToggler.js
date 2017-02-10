;(function() {
    /*----------  Class Toggler  ----------*/
    /*
        To avoid waiting for jquery, or any other bundles to load,
        we want hamburger menus or dropdowns to be working straight away.
        This kind of stuff is generally achieved with a simple toggling of CSS
        so we can create a wrapper here. Most browsers will happily use
        vanilla JS classList and querySelectorAll - but for those that don't, we can just defer to when
        jQuery loads for simplicity.

        Comment to test updating
    */

    /*----------  USAGE  ----------*/
    /*

        // when <button class="hamburger"> is clicked, will toggle '.js-open' to <body>, and '.js-open' to <div id="#sidebar">
        // it will toggle because no action was passed. But <div class="modal js-visible"> will have '.js-visible' removed
        // because action was set to remove, all the time - this is so you can always ensure that certain states are deactivated
        // when interacting with an element.

        APP.clickbind('.hamburger', [
            { selector: 'body', className: 'js-open' },
            { selector: '#sidebar', className: 'js-open' },
            { selector: '.modal', className: 'js-visible', action: remove }
        ]);

        // Call this AFTER the elements in question. To keep things speedy we don't have to wait
        // for DOMReady because why wait for the rest of the dom, for the hamburger to work (etc)

     */


    var _forEach = function (array, callback, scope) {
        for (var i = 0; i < array.length; i++) {
            callback.call(scope, i, array[i]); // passes back stuff we need
        }
    };

    APP.clickbind = function(selector, targets, callback ) {


        var _action = function( target ) {

            // decide on classList method:
            var method = target.action || 'toggle';

            // get a dom collection of the target:
            var targetEls = document.querySelectorAll( target.selector );

            // loop through these DOM elements, and apply the classList
            // method:
            _forEach( targetEls, function( i, e ) {
                e.classList[ method ]( target.className );
            });
        };

        if (document.querySelectorAll) {

            // Find the elements to listen to:
            var clickElements = document.querySelectorAll( selector );

            // for each element...
            _forEach(clickElements, function (index, element ) {

                // bind a click handler...
                element.addEventListener('click', function() {


                    // to trigger the targets and their assigned
                    // classes, and actions
                    targets.forEach( function( target ) {
                        _action( target );
                    });

                    if (typeof callback === "function") {
                        callback( clickElements, targets );
                    }

                }, false);
            });

        } else {
            // Rubbish browser fallback - actually much simpler!
            // We let jQuery handle old browsers when its' run
            // and it defers thanks to pushtoq
            $(function() {
                $(selector).on('click', function() {

                    if (target) {
                        $(target).toggleClass( classToToggle );
                    } else {
                        $(this).toggleClass( classToToggle );
                    }

                });
            });
        }
    }


})();
