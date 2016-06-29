sc_require("scope/scope")


Df.Engine = SC.Object.extend({

    init: function () {
        this.msStep = Math.floor(1000/60);
        this.scope = Df.Scope.create({});
        this.control = {
            intentX: 0,
            intentY: 0,
            up: false,
            down: false,
            left: false,
            right: false
        };
        this.aim = {
            isDown: false,
            x: 0,
            y: 0,
            clientX: undefined,
            clientY: undefined,
            cameraX: undefined,
            cameraY: undefined
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
        this.mach.applyControl(this.control);
        this.mach.applyAim(this.aim);
        this.scope.step(this.msStep / 1000);
    }

});
