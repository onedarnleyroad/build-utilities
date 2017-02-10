;(function() {
    var resizeTimer;
    $(window).on('resize', function(e) {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {

            // raise resize end event.
            $(window).trigger('resizeEnd');

        }, 250);
    });
})();
