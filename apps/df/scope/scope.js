Df.Scope = SC.Object.extend({

    init: function () {
        console.log('Scope init');
        this.objs = [];
    },

    add: function (obj) {
        console.log('Adding ' + obj.toString());
        this.objs.push(obj);
    },

    paint: function (ctx, camera, timestamp) {

        this.objs.forEach(function (obj) {
            obj.paint(ctx, camera, timestamp);
        });
    }

});
