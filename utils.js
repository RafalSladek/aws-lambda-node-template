"use strict";

String.prototype.format = function () {
    var a = this;
    for (var k in arguments) {
        a = a.replace("{" + k + "}", arguments[k])
    }
    return a
}

exports.fold = (reducer, init, xs) => {
    let acc = init;
    for (const x of xs) {
        acc = reducer(acc, x);
    }
    return acc;
};