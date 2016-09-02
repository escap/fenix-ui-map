
if(typeof define === 'function' && define.amd) {
//AMD
    define(FM);
} else if(typeof module !== 'undefined') {
// Node/CommonJS
    module.exports = FM;
} else {
// Browser globals
    window.FM = FM
}
