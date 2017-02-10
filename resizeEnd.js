;(function() {
    var resizeTimer;
    $(window).on('resize', function(e) {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {

            // Recalculate:
            // search extras top margin
            placeSearchExtras();
            calcStickyElements();

            // Rerun:
            // Flickity has its own internal handler so no need to put it here
            // CustomSelecct
            $('[data-custom-select], .customSelect').trigger('render');

            // raise resize end event.
            $(window).trigger('resizeEnd');


        }, 250);
    });
})();
