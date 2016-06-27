Df.CanvasView = SC.View.extend({
    classNames: ['canvas-view'],
    
    render: function (context, firstTime) {
        if (firstTime) {
            context.push('<canvas style="background:#666;"></canvas>');
        }
    },
    
    didCreateLayer: function () {
        var me = this;
        this.canvas = this.$('canvas')[0];
        this.engine = Df.engine;
        Df.camera = this.camera = Df.Camera.create({
            x: 0,
            y: 0,
            zoom: 1
        });
        this.ctx = this.canvas.getContext("2d");
        this.resizeCanvas();
        
        window.addEventListener('resize', this.resizeCanvas.bind(this), false);
        this.worker = setInterval(this.triggerPaint.bind(this), this.engine.msStep);
    },
    
    didUpdateLayer: function () {
        // no-op;
    },

    paint: function (timestamp) {
        var scope = this.engine.scope;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        this.camera.applyInverseTransform(this.ctx);
        this.applyCameraToViewPortTransform(this.ctx);
        scope.paint(this.ctx, this.camera, timestamp);
        this.ctx.restore();
    },

    applyCameraToViewPortTransform: function (ctx) {
        ctx.translate(this.canvas.width/2, this.canvas.height/2);
    },

    triggerPaint: function () {
        window.requestAnimationFrame(this.paint.bind(this));
    },

    resizeCanvas: function () {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    },

    mouseDown: function (evt) {
        console.log('Mouse down');
        // var rect = this.canvas.getBoundingClientRect();
        this.mouseInfo = {
            x: evt.clientX,
            y: evt.clientY,
            cx: this.camera.get('x'),
            cy: this.camera.get('y')
        };
        return YES; // so we get other events
    },

    mouseDragged: function (evt) {
        var info = this.mouseInfo;
        var zoom = this.camera.get('zoom');
        var dx = evt.clientX - info.x;
        var dy = evt.clientY - info.y;
        var x = info.cx - dx / zoom;
        var y = info.cy - dy / zoom;
        //this.camera.set('x', x);
        //this.camera.set('y', y);
    },

    mouseUp: function (evt) {
        console.log('Mouse up');
        // apply one more time to set final position
        this.mouseDragged(evt); 
        this.mouseInfo = null; // cleanup info
        return YES; // handled!
    },

    touchStart: function (touch) {
        this.touchInfo = {
            x: touch.clientX,
            y: touch.clientY,
            cx: this.camera.get('x'),
            cy: this.camera.get('y')
        };
    },

    touchesDragged: function (touch) {
        var info = this.touchInfo;
        var zoom = this.camera.get('zoom');
        var dx = touch.clientX - info.x;
        var dy = touch.clientY - info.y;
        var x = info.cx - dx / zoom;
        var y = info.cy - dy / zoom;
        //this.camera.set('x', x);
        //this.camera.set('y', y);
    },

    touchEnd: function (touch) {
        console.log('Touch End');
        this.touchesDragged(touch); 
        this.touchInfo = null;
    }

});
