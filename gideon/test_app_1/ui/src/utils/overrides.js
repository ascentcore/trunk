/* eslint-disable no-extend-native */
function extendStringWithSuffix(suffix) {
    return function(str) {
        if (!str) {
            str = this;
        }
        return str + '_' + suffix;
    };
}

String.prototype.success = extendStringWithSuffix('SUCCESS');
String.prototype.failure = extendStringWithSuffix('FAILURE');
