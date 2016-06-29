Df.Obj = SC.Object.extend({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    width: 30,
    height: 30,
    rotation: 0,
    color: "#DD55DD",
    scope: null,

    init: function () {
        console.log('Obj init');
    },

    paint: function (ctx, camera, timestamp) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation - Math.PI / 2);
        this.paintObj(ctx);
        ctx.restore();
    },

    paintObj: function (ctx) {
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width;
        ctx.beginPath();
        ctx.moveTo(0, -this.height/2);
        ctx.lineTo(0, this.height/2);
        ctx.stroke();
    },

    beforeStep: function (elapsedTime) {
        // template
    },

    afterStep: function (elapsedTime) {
        // template
    },

    step: function (elapsedTime) {
        this.beforeStep(elapsedTime);
        this.x += this.vx * elapsedTime;
        this.y += this.vy * elapsedTime;
        this.afterStep(elapsedTime);
    }



});
