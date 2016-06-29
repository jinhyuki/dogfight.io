sc_require("obj/obj")

Df.Mach = Df.Obj.extend({

    color: "#DDDD55",

    // speed in pixels per second
    pps: 400,

    accelFactor: 30,

    airDragFactor: 0.1,

    init: function () {

        this.recoil = 0;

        this.control = {
            intentX: 0,
            intentY: 0
        };
        this.aim = {
            x: undefined,
            y: undefined
        };
        console.log('Mach init');
    },

    applyControl: function (control) {
        this.control.intentX = control.intentX;
        this.control.intentY = control.intentY;
    },

    applyAim: function (aim) {
        this.aim.x = aim.x;
        this.aim.y = aim.y;
        this.aim.isDown = aim.isDown;
    },

    beforeStep: function (elapsedTime) {
        sc_super();

        this.drag(elapsedTime);
        this.accel(this.control.intentX, this.control.intentY, elapsedTime);
        
        if (this.aim.isDown && this.recoil-- <= 0) {
            this.shoot();    
        }
        this.steer(elapsedTime);
        
    },

    shoot: function () {
        this.recoil = 4;
        // console.log("Shoot");

    },

    steer: function (elapsedTime) {
        var dx = this.aim.x - this.x;
        var dy = this.aim.y - this.y;
        var dSq = dx*dx + dy*dy;
        var d = Math.sqrt(dSq);
        if (d > 0) {
            this.rotation = Math.atan2(dy, dx);
            // console.log(dy/d, dx/d, this.rotation);
        }
    },

    accel: function (intentX, intentY, elapsedTime) {
        var intentSq = intentX * intentX + intentY * intentY;
        var intent = Math.sqrt(intentSq);

        if(intent > 1) {
            intentX = intentX/intent;
            intentY = intentY/intent;
        }

        this.vx += intentX * this.accelFactor;
        this.vy += intentY * this.accelFactor;

        var vSq = this.vx * this.vx + this.vy * this.vy;

        if (vSq > 0) {
            var v = Math.sqrt(vSq);
            if(v > this.pps){
                this.vx *= this.pps / v;
                this.vy *= this.pps / v;
            }
        }
    },

    drag: function (elapsedTime) {
        this.vx -= this.vx * this.airDragFactor;
        this.vy -= this.vy * this.airDragFactor;
    }

});
