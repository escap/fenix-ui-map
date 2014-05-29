FM.UIUtils = {

    fullscreen: function (idButton, idFullscreen) {

        var fsElement = document.getElementById(idFullscreen);

        if (window.fullScreenApi.supportsFullScreen) {
            $('#' + idButton).on('click', function () {
                window.fullScreenApi.requestFullScreen(fsElement);
            });
        } else {
            //alert('is not supported the full screen on your browser')
        }
    },

    loadingPanel: function (id, height) {
        var h = '25px';
        if ( height ) h = height;
        document.getElementById(id).innerHTML = "<div class='fm-loadingPanel' style='height:"+ h +"'><img src='"+ FMCONFIG.BASEURL +'/images/loading.gif' +"'></div>";
    }


};

$.fn.swapWith = function(to) {
    return this.each(function() {
        var copy_to = $(to).clone();
        var copy_from = $(this).clone();
        $(to).replaceWith(copy_from);
        $(this).replaceWith(copy_to);
    });
};


