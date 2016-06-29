sc_require('bullet');

Df.BulletCloud = SC.Object.extend({

    scope: null,

    init: function () {
        console.log('Bullet cloud init');

        // minimum 2.
        this.maxCount = 5;

        this.dummyHead = Df.Bullet.create({});

        // create bullet pool of maxCount
        this.tail = this.dummyHead;
        for (var i=0; i<this.maxCount; i++) {
            this.tail.next = Df.Bullet.create({
                scope: this.scope
            });
            this.tail = this.tail.next;
        }

        this.nextAvail = this.dummyHead.next;
    },

    fire: function (x, y, vx, vy) {
        if (!this.nextAvail){
            // get the first node
            this.nextAvail = this.dummyHead.next;
            // remove it
            this.dummyHead.next = this.dummyHead.next.next;
            // and remove the link
            this.nextAvail.next = null;
            // then make it tail
            this.tail.next = this.nextAvail;
            // update tail ref
            this.tail = this.tail.next;
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
