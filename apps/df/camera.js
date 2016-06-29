Df.Camera = SC.Object.extend({

    zoom: 1,
    x: 0,
    y: 0,

    applyInverseTransform: function (ctx) {
        ctx.translate(-this.x, -this.y);
        ctx.scale(this.zoom, this.zoom);
    }

});
