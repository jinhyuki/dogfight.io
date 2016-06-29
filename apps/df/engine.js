sc_require('scope');


Df.Engine = SC.Object.extend({

    init: function () {
        this.msStep = Math.floor(1000/60);
        this.scope = Df.Scope.create({
            engine: this
        });
        this.bound = {
            x0: -10000,
            x1: 10000,
            y0: -10000,
            y1: 10000
        };
        this.control = {
            intentX: 0,
            intentY: 0,
            up: false,
            down: false,
            left: false,
            right: false,
            touchId: null,
            touchStartX: undefined,
            touchStartY: undefined
        };
        this.aim = {
            isDown: false,
            x: 0,
            y: -1,
            vx: 0,
            vy: 0,
            intentX: 0,
            intentY: 0,
            clientX: undefined,
            clientY: undefined,
            cameraX: undefined,
            cameraY: undefined,
            touchId: null,
            isTouch: false,
            touchStartX: undefined,
            touchStartY: undefined
        };
        this.fuel(this.scope);
    },

    fuel: function (scope) {
        // fuel the scope with data
        this.mach = Df.Mach.create({});
        this.scope.add(this.mach);
        this.scope.add(Df.Bot.create({
            x: 100,
            y: 100
        }));
    },

    ignite: function () {
        console.log('Ignite');
        this.worker = setInterval(this.step.bind(this), this.msStep);
    },

    step: function () {
        var elapsedTime = this.msStep / 1000;

        this.mach.applyControl(this.control);
        this.mach.applyAim(this.aim);
        this.scope.step(elapsedTime);
    }

});
