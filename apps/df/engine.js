sc_require("scope/scope")


Df.Engine = SC.Object.extend({

    init: function () {
        this.msStep = Math.floor(1000/30);
        this.scope = Df.Scope.create({});
        this.fuel(this.scope);
    },

    fuel: function (scope) {
        // fuel the scope with data
        this.mach = Df.Mach.create ({});
        this.scope.add(this.mach);
    },

    ignite: function () {
        console.log('Ignite');
        this.worker = setInterval(this.update.bind(this), this.msStep);
    },

    update: function () {
    }

});
