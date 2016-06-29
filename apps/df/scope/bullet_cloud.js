sc_require("obj/bullet")

Df.BulletCloud = SC.Object.extend({

    scope: null,

    init: function () {
        console.log('Bullet cloud init');

        // minimum 2.
        this.maxCount = 5;
        this.count = 0;   
        
        this.dummyHead = Df.Bullet.create({});

        // create bullet pool of maxCount
        var tail = this.dummyHead;
        for (var i=0; i<this.maxCount; i++) {
            var bullet = Df.Bullet.create({
                scope: this.scope
            });
            tail.next = bullet;
            tail = tail.next;
        }

        this.nextAvail = this.dummyHead.next;
    },

    fire: function (x, y, vx, vy) {
        if (!this.nextAvail){
            // pop the first node and push to the end
            this.nextAvail = this.dummyHead.next;
            this.dummyHead.next = this.nextAvail.next;
            this.nextAvail.next = null;
        }

        this.nextAvail.x = x;
        this.nextAvail.y = y;
        this.nextAvail.vx = vx;
        this.nextAvail.vy = vy;
        this.nextAvail.isActive = true;
        this.nextAvail = this.nextAvail.next;
    },

    paint: function (ctx, camera, timestamp) {
        var bullet = this.dummyHead.next;
        while (bullet && bullet.isActive) {
            bullet.paint(ctx, camera, timestamp);
            bullet = bullet.next;
        }
    },

    step: function (elapsedTime) {
        var bullet = this.dummyHead.next;
        while (bullet && bullet.isActive) {
            bullet.step(elapsedTime);
            bullet = bullet.next;
        }
    }

});
