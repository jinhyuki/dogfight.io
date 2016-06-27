Df.Obj = SC.Object.extend({

    width: 20,
    height: 20,

    init: function () {
        console.log('Obj init');
    },

    paint: function (ctx, camera, timestamp) {
        ctx.strokeStyle = "#DDDD55";
        ctx.lineWidth = this.width;
        ctx.beginPath();
        ctx.moveTo(0,-this.height/2);
        ctx.lineTo(0,this.height/2);
        ctx.stroke();
    }

});
