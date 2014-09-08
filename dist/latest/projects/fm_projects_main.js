require(['jquery',
    'mustache',
    'backbone',
    'loglevel',
    'chosen',
    'bootstrap',,
    'domReady!'], function($, Mustache, Backbone, log) {

    log.setLevel(0);


    var ApplicationRouter = Backbone.Router.extend({

        lang: "en",

        placeholder_container : "fm_projects_container",

        isRendered: false,

        initialize: function (options) {
            Backbone.history.start();
        },


        routes: {
            '(/)scatter(/):poverty_analysis': 'poverty_analysis',
            '(/)distribution(/):lang': 'distribution',
            '(/)scatter_analysis(/):lang': 'scatter_analysis',
            '': 'generic'
        },

        poverty_analysis: function() {
            console.log("here");
            var placeholder_container = this.placeholder_container
            require(['fm_poverty_analysis'], function() {
                FMPovertyAnalysis().build( { "placeholder" : placeholder_container});
            });
        },

        _init: function (lang) {

            if (lang) {
                this._initLanguage(lang)
            }

            if (!this.isRendered) {
                this.isRendered = true;
                var template = $(templates).filter('#structure').html();
                var view = {};
                var render = Mustache.render(template, view);
                $('#js_geo_placeholder').html(render);
                var navbar = new Navbar({lang: lang});
                navbar.build();
            }

        },

        _initLanguage: function (lang) {
            require.config({"locale": lang});
        }

    });

    new ApplicationRouter();

});