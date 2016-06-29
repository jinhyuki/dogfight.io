sc_require('obj');

Df.Bullet = Df.Obj.extend({

    width: 5,
    height: 5,
    color: "#DD7777",

    pixelage: 0,

    // active
    isActive: false,

    next: null,

    init: function () {
        console.log('bullet init');
    }
});
