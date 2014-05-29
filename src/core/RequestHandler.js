var RequestHandler = function() {

    var result = {

        request: null,

        timeout: 10000,

        init: function() {
            if ( typeof XDomainRequest != "undefined" ) {
                this.request  = new XDomainRequest();
                this.setTimeout(this.timeout)
            }
            else {
                this.request = new XMLHttpRequest();
            }
        },

        open : function(type, url, test) {
            if (!this.request )  this.init();
            if ( typeof XDomainRequest == "undefined" ) {
                if ( test != null ) {
                    this.request.open(type, url, test);
                }
                else
                    this.request.open(type, url, true);
            }
            else
                this.request.open(type, url);
        },

        setTimeout: function (timeout) {
            if (!this.request )  this.init();
            if ( typeof XDomainRequest != "undefined" ) {this.timeout = 10000; }
            else {
            }
        },

        setContentType: function (contentType) {
            if (!this.request ) this.init();
            try {
                this.request.contentType = contentType;
            }catch (e){}

            if ( typeof XDomainRequest != "undefined" ) {
            }
            else {
                this.request.setRequestHeader('Content-Type', contentType)
            }
        },

        onload: function(callback) {
            if (!this.request ) this.init();
            this.request.onload = callback;
        },

        send: function(data) {
            if (!this.request ) this.init();
            this.request.send(data);
        }

    }

    return result;

};