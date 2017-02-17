;(function(window) {


    /*========================================
    =            Default Settings            =
    ========================================*/
    // Set defaults up here.  It's important to pass every kind of
    // possible setting - the setting has to 'exist' for it to be
    // recognised in the settings passed to the function call

    var pswpElement, captionElement;


    var defaultSettings = {
        container: '.gallery',
        slides: '.gallery__slide',
        callbacks: {},
        photoswipeOptions: {

            showAnimationDuration: 333,
            showHideOpacity:true,
            bgOpacity: 0.88,
            maxSpreadZoom: 2,
            allowUserZoom: true,
            closeOnScroll: false,
            history: false,
            isClickableElement: function(el) {

                return (el.tagName === 'A' || el.tagName === 'BUTTON');
            },

            addCaptionHTMLFn: function( item ) {

                // append to the photo item element because photoswipe is being a bit of a pickle with
                // positioning captions relative to the resulting image...
                 if(!item.title) {
                    captionElement.text('');
                    return false;
                }

                // this just 'pops' the element over.  Add some sort of fade in fade out animation and callback if you
                // want a transition here.
                captionElement.text( item.title );

                // Alternatively, the caption element could be a fixed item outside of the slides, though this keeps the caption
                // inline with the actual slide rather htan fixed from the bottom.

                return true;
            }
        }
    };




    /*=========================================
    =            Internal Functions            =
    =========================================*/

    var uid = 0;

    setUid = function() {
        uid++;

        return uid;
    };

    /*===================================
    =            Constructor            =
    ===================================*/

    // Initialise everything, calling this function should be good to go.
    window.Photoswiper = window.Photoswiper || function( settings ) {



        // because jQuery...
        var self = this;


        this.uid = setUid();

        /*----------  1. Set Defaults on Settings  ----------*/

        // short version is not to pass in full settings, but either a DOM element
        // or a jquery selector string...
        if (typeof settings === 'string' || settings.hasOwnProperty('is') ) {
            settings = {
                container: settings
            };
        }

        this.updateSettings( settings );



        /*----------  2. Select Elements  ----------*/
        this.container = $( this.settings.container );

        if (this.container.length === 0) return false;

        this.slides = this.container.find( this.settings.slides );


        /*----------  3. Find the slides  ----------*/

            // set this now so the property exists...
            this.photoswipe = false;


            // 3.1 - Put into an array,
            this.refresh(); // prototype function, see below, now this.items is set to the elements with data


            // 3.2 - bind the click handlers
            this.slides.on('click', function(e) {

                e.preventDefault();

                var index = parseInt( $(this).attr('data-index') );
                self.open( index );



            });


        // return this, so people can manipulate later.

        return this;
    };



    /*=======================================
    =          4 Prototype Methods          =
    =======================================*/


    /*----------  4.0 Set our defaults, or update our settings  ----------*/
    // Note passing in nothing would reset everything to the defaults.
    Photoswiper.prototype.updateSettings = function( settings ) {

        if (typeof settings != 'object') settings = {};

        for ( var prop in defaultSettings ) {
            if (!settings.hasOwnProperty(prop)) {
                settings[prop] = defaultSettings[prop];
            }
        }

        this.settings = settings;

    };


    /*----------  4.1 Open a Slide  ----------*/
    Photoswiper.prototype.open = function( index ) {

        if (typeof index != 'number') index = 0;

        var self = this;

        var options = this.settings.photoswipeOptions;

        // add and override options (if needed)
        options.galleryUID = this.uid;
        options.index = index;


        if( isNaN(options.index) ) {
            options.index = 0;
        }


        // Pass data to PhotoSwipe and initialize it
        this.photoswipe = new PhotoSwipe( pswpElement, false, this.items, options);

        // hack to stop the zoom in for images that are larger than the viewport.  Should still work for pinchzoom?
        this.photoswipe.options.maxSpreadZoom = this.photoswipe.getZoomLevel();
        this.photoswipe.getDoubleTapZoom = function(isMouseClick, item) {
            return item.initialZoomLevel;
        };

        this.photoswipe.init();

        // bind callbacks
        for (var cbname in this.settings.callbacks) {

            this.photoswipe.listen( cbname, this.settings.callbacks[cbname] );
        }

        var close = function () {
            self.photoswipe.close();
        };

        // listen for image loads to fade in rather than flash-in

        this.photoswipe.listen('imageLoadComplete', function(index, item) {
            // index - index of a slide that was loaded
            // item - slide object
            $(item.container).addClass('js-image-loaded');
        });


        // one off close of the bg...since photoswipe gets reinitiated,
        // let's make sure we don't overlap events.
        $('.pswp__bg').on('click touchstart', close);
        $('.pswp__button--close').on('click touchstart', close );

        $('.pswp__item').on('click touchstart', function(e) {

            if ($(e.target).hasClass('pswp__img')) {
                return;
            } else {
                close();
            }
        })

        // remove it once it's closed, this also works if they close the native X
        this.photoswipe.listen('close', function() {
            $('.pswp__bg').off('click touchstart', close);
            $('.pswp__button--close').off('click touchstart', close);
        });

        $('body').on('click', '.pswp__button--arrow--left', function() {
            self.photoswipe.prev();
        });

        $('body').on('click', '.pswp__button--arrow--right', function() {
            self.photoswipe.next();
        });

        // update UI when slide changes
        if (typeof options.addCaptionHTMLFn === 'function') {

            // add to the opened one
            options.addCaptionHTMLFn( this.items[index] );

            this.photoswipe.listen('beforeChange', function() {
                options.addCaptionHTMLFn( this.currItem );
            });
        }

    };


    /*----------  4.2 Rebuild our list of slides  ----------*/

    Photoswiper.prototype.refresh = function() {

        if (!this.slides || this.slides.length === 0) return false;

        var counter = 0;
        var items = [];

        this.slides.each(function() {

            // set a counter based on its dom order.
            $(this).attr('data-index', counter );

            items.push({
                index: counter,
                src: $(this).find('a').attr('href'),
                w: $(this).attr('data-w'),
                h: $(this).attr('data-h'),
                el: $(this).find('img')[0],
                title: $(this).attr('data-caption')
            });

            counter++;

        });

        this.items = items;

    };

    /*----------  5 Global DOM stuff  ----------*/
    // Set up a bunch of global dom elements.  This should happen before any of the above actually gets initialised, assuming this script
    // came before any other that might use this lib
    $(document).ready(function() {
        // set the photoswipe element.  Should be one for the whole page
        pswpElement = $('.pswp')[0];
        captionElement = $('.pswp__caption__center');
    });






})(window);
