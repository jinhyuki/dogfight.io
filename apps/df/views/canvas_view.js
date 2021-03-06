Df.CanvasView = SC.View.extend({
    classNames: ['canvas-view'],
    
    // for key event captures
    acceptsFirstResponder: YES,
    acceptsKeyPane: YES,

    // multi touch
    acceptsMultitouch: YES,

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
        this.worker = setInterval(this.step.bind(this), this.engine.msStep);

        // for key event captures
        this.becomeFirstResponder();
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

        this.paintControl();
    },

    paintControl: function () {

        var cx = this.engine.control.intentX;
        var cy = this.engine.control.intentY;
        var cd = Math.sqrt(cx*cx + cy*cy);
        if (cd > 1) {
            cx = cx / cd;
            cy = cy / cd;
        }
        cx *= 10;
        cy *= 10;

        var ax = 0;
        var ay = 0;

        if (this.engine.aim.isDown) {
            ax = this.engine.aim.intentX;
            ay = this.engine.aim.intentY;
            var ad = Math.sqrt(ax*ax + ay*ay);
            if (ad > 1) {
                ax = ax / ad;
                ay = ay / ad;
            }
            ax *= 10;
            ay *= 10;
        }

        this.ctx.strokeStyle = "rgba(255,255,255,0.4)";
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(70, this.canvas.height-70, 50, 0,2*Math.PI);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(70+cx, this.canvas.height-70+cy, 50, 0,2*Math.PI);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(this.canvas.width-70, this.canvas.height-70, 50, 0,2*Math.PI);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(this.canvas.width-70+ax, this.canvas.height-70+ay, 50, 0,2*Math.PI);
        this.ctx.stroke();
    },

    applyCameraToViewPortTransform: function (ctx) {
        ctx.translate(this.canvas.width/2, this.canvas.height/2);
    },

    step: function () {
        var elapsedTime = this.engine.msStep / 1000;

        this.computeTouchAim(elapsedTime);

        window.requestAnimationFrame(this.paint.bind(this));
    },

    resizeCanvas: function () {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.engine.bound.x0 = -this.canvas.width / 2 / this.camera.zoom - this.camera.x;
        this.engine.bound.x1 = this.canvas.width / 2 / this.camera.zoom - this.camera.x;
        this.engine.bound.y0 = -this.canvas.height / 2 / this.camera.zoom - this.camera.y;
        this.engine.bound.y1 = this.canvas.height / 2 / this.camera.zoom- - this.camera.y;
        console.log(this.engine.bound);
    },

    updateAim: function (evt) {
        this.engine.aim.clientX = evt.clientX;
        this.engine.aim.clientY = evt.clientY;
        this.engine.aim.cameraX = evt.clientX - this.canvas.width/2;
        this.engine.aim.cameraY = evt.clientY - this.canvas.height/2;
        this.engine.aim.x = this.engine.aim.cameraX / this.camera.zoom + this.camera.x;
        this.engine.aim.y = this.engine.aim.cameraY / this.camera.zoom + this.camera.y;
        // this.engine.aim.intentX = this.engine.aim.x - this.engine.mach.x;
        // this.engine.aim.intentY = this.engine.aim.y - this.engine.mach.y;
    },

    computeTouchAim: function (elapsedTime) {

        // if (this.engine.aim.isDown && this.engine.aim.isTouch) {
        //     var intentX = this.engine.aim.intentX;
        //     var intentY = this.engine.aim.intentY;
        //     var intent = Math.sqrt(intentX * intentX + intentY * intentY);
        //     if (intent > 1) {
        //         intentX /= intent;
        //         intentY /= intent;
        //     }
        //     this.engine.aim.x = this.engine.mach.x + intentX*100;
        //     this.engine.aim.y = this.engine.mach.y + intentY*100;
        // }

        var pps = 500;
        var accelFactor = 30;
        var airDragFactor = 0.2;
        
        // drag
        this.engine.aim.vx -= this.engine.aim.vx * airDragFactor;
        this.engine.aim.vy -= this.engine.aim.vy * airDragFactor;
        
        // accel
        if (this.engine.aim.isDown && this.engine.aim.isTouch) {
            var intent = Math.sqrt(this.engine.aim.intentX * this.engine.aim.intentX + this.engine.aim.intentY * this.engine.aim.intentY);

            this.engine.aim.vx += this.engine.aim.intentX * accelFactor;
            this.engine.aim.vy += this.engine.aim.intentY * accelFactor;
            // cap velocity
            var v = Math.sqrt(this.engine.aim.vx * this.engine.aim.vx + this.engine.aim.vy * this.engine.aim.vy);
            if (v > pps) {
                this.engine.aim.vx *= pps / v;
                this.engine.aim.vy *= pps / v;
            } 
        }
        
        // compute position
        this.engine.aim.x += this.engine.aim.vx * elapsedTime;
        this.engine.aim.y += this.engine.aim.vy * elapsedTime;

        // compute viewport position
        // this.engine.aim.cameraX = (this.engine.aim.x - this.camera.x) * this.camera.zoom;
        // this.engine.aim.cameraY = (this.engine.aim.y - this.camera.y) * this.camera.zoom;
        // this.engine.aim.clientX = this.engine.aim.cameraX + this.canvas.width / 2;
        // this.engine.aim.clientY = this.engine.aim.cameraY + this.canvas.height / 2;

        // // cap aim position
        // if (this.engine.aim.x < this.engine.bound.x0) {
        //     this.engine.aim.x = this.engine.bound.x0;
        // } else if (this.engine.aim.x > this.engine.bound.x1) {
        //     this.engine.aim.x = this.engine.bound.x1;
        // }
        // if (this.engine.aim.y < this.engine.bound.y0) {
        //     this.engine.aim.y = this.engine.bound.y0;
        // } else if (this.engine.aim.y > this.engine.bound.y1) {
        //     this.engine.aim.y = this.engine.bound.y1;
        // }
        
        var dx = this.engine.aim.x - this.engine.mach.x;
        var dy = this.engine.aim.y - this.engine.mach.y;
        var d = Math.sqrt(dx*dx + dy*dy);
        if (d > 100) {
            this.engine.aim.x = this.engine.mach.x + dx / d * 100;
            this.engine.aim.y = this.engine.mach.y + dy / d * 100;

        }

    },

    mouseEntered: function (evt) {
        this.updateAim(evt);
        return YES; // so we get other events
    },

    mouseMoved: function (evt) {
        this.updateAim(evt);
        return YES; // so we get other events
    },

    mouseExited: function (evt) {
        this.updateAim(evt);
        return YES; // so we get other events
    },

    mouseDown: function (evt) {
        console.log('Mouse down');
        // var rect = this.canvas.getBoundingClientRect();
        this.updateAim(evt);
        this.engine.aim.isDown = true;

        return YES; // so we get other events
    },

    mouseDragged: function (evt) {
        // no op
        return YES; // so we get other events
    },

    mouseUp: function (evt) {
        console.log('Mouse up');
        if (!this.isFirstResponder) {
            this.becomeFirstResponder();    
        }
        
        this.updateAim(evt);
        this.engine.aim.isDown = false;

        // apply one more time to set final position
        // this.mouseDragged(evt); 
        // this.engine.aim = null; // cleanup info
        return YES; // handled!
    },

    touchStart: function (touch) {
        // no op
        // todo: what is captureTouch

        var forMove = touch.clientX <= this.canvas.width / 2;
        
        if (forMove) {
            this.engine.control.intentX = 0;
            this.engine.control.intentY = 0;
            this.engine.control.touchStartX = touch.clientX;
            this.engine.control.touchStartY = touch.clientY;
            this.engine.control.touchId = touch.identifier;
        } else {
            this.engine.aim.touchStartX = touch.clientX;
            this.engine.aim.touchStartY = touch.clientY;
            this.engine.aim.touchId = touch.identifier;
            this.engine.aim.isDown = true;
            this.engine.aim.isTouch = true;
        }
    },

    touchesDragged: function (evt) {
        
        // in number of pixels.
        // todo: this controller radius must be dependant on the user or the device.
        var radius = 4;
        
        for (var i = 0; i < evt.touches.length; i++) {
            var touch = evt.touches[i];
            if (touch.identifier === this.engine.control.touchId) {
                var dx = touch.clientX - this.engine.control.touchStartX;
                var dy = touch.clientY - this.engine.control.touchStartY;

                this.engine.control.intentX = dx / radius;
                this.engine.control.intentY = dy / radius;
                console.log(this.engine.control.intentX);
            } else if (touch.identifier === this.engine.aim.touchId) {
                var dx = touch.clientX - this.engine.aim.touchStartX;
                var dy = touch.clientY - this.engine.aim.touchStartY;
                this.engine.aim.intentX = dx / radius / 3;
                this.engine.aim.intentY = dy / radius / 3;
            }
        }
    },

    touchEnd: function (touch) {
        // no op
        if (touch.identifier === this.engine.control.touchId) {
            this.engine.control.intentX = 0;
            this.engine.control.intentY = 0;
            this.engine.control.touchId = null;
            this.engine.control.touchStartX = undefined;
            this.engine.control.touchStartY = undefined;
        } else if (touch.identifier === this.engine.aim.touchId) {
            this.engine.aim.touchId = null;
            this.engine.aim.touchStartX = undefined;
            this.engine.aim.touchStartY = undefined;
            this.engine.aim.intentX = 0;
            this.engine.aim.intentY = 0;
            this.engine.aim.isDown = false;
            this.engine.aim.isTouch = false;
        }
    },

    keyDown: function (evt) {
        var timestamp = evt.timeStamp;
        switch (evt.keyCode) {
        case SC.Event.KEY_RETURN: 
            console.log('Enter down at ' + timestamp);
            break;
        case SC.Event.KEY_UP: case 119:
            this.engine.control.up = timestamp;
            break;
        case SC.Event.KEY_DOWN: case 115:
            this.engine.control.down = timestamp;
            break;
        case SC.Event.KEY_LEFT: case 97:
            this.engine.control.left = timestamp;
            break;
        case SC.Event.KEY_RIGHT: case 100:
            this.engine.control.right = timestamp;
            break;
        default: 
            console.log('Key down ' + evt.keyCode + ' at ' + timestamp);
        }

        this.updateControlIntent();

        return YES;
    },

    keyUp: function (evt) {
        var timestamp = evt.timeStamp;

        switch (evt.keyCode) {
        case SC.Event.KEY_RETURN: 
            console.log('Enter up at ' + timestamp);
            break;
        case SC.Event.KEY_UP: case 87:
            this.engine.control.up = false;
            break;
        case SC.Event.KEY_DOWN: case 83: 
            this.engine.control.down = false;
            break;
        case SC.Event.KEY_LEFT: case 65:
            this.engine.control.left = false;
            break;
        case SC.Event.KEY_RIGHT: case 68:
            this.engine.control.right = false;
            break;
        default: 
            console.log('Key up ' + evt.keyCode + ' at ' + timestamp);
        }

        this.updateControlIntent();

        return YES;
    },

    updateControlIntent: function () {

        this.engine.control.intentX = ((this.engine.control.left ? -1 : 0) + (this.engine.control.right ? 1 : 0));
        this.engine.control.intentY = ((this.engine.control.up ? -1 : 0) + (this.engine.control.down ? 1 : 0));

    }

});
