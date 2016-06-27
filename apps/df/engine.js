Df.Engine = SC.Object.extend({

    init: function () {
        this.fuel();
    },

    fuel: function () {
        // initial setup
        this.speed = 3;
        this.speedSq = this.speed * this.speed;
        // 1.9997 magic number for speed 3.
        this.hitDistance = this.speed*1.9997;
        this.hitDistanceSq = this.hitDistance * this.hitDistance;
        this.width = 5000;
        this.height = 5000;
        this.count = 10000;
        this.ratio = 0.08;
        this.maxEnergy = 5;
        this.fps = 24;
        this.msStep = Math.ceil(1000/this.fps);
        this.props = ['x', 'y', 'vx', 'vy', 'target', 'isStatic', 'energy'];
        this.buffer = new ArrayBuffer(this.count * this.props.length * 4);
        this.floatBuffer = new Float32Array(this.buffer);
        this.intBuffer = new Int32Array(this.buffer);

        var s = this.props.length;

        for (var i=0; i<this.count; i++) {
            this.floatBuffer[i*s+0] = Math.random() * this.width;
            this.floatBuffer[i*s+1] = Math.random() * this.height;
            this.floatBuffer[i*s+2] = 0;
            this.floatBuffer[i*s+3] = 0;
            this.intBuffer[i*s+4] = this.getRandomTarget(i);
            this.intBuffer[i*s+5] = (Math.random() < this.ratio ? 1 : 0);
            this.intBuffer[i*s+6] = this.maxEnergy;
        }
    },

    ignite: function () {
        console.log('Ignite');
        this.worker = setInterval(this.update.bind(this), this.msStep);
    },

    update: function () {
        var i;
        var s = this.props.length;

        for (i=0; i<this.count; i++) {
            var target = this.intBuffer[i*s+4];
            var isStatic = this.intBuffer[i*s+5];
            var energy = this.intBuffer[i*s+6];
            var targetIsStatic = this.intBuffer[target*s+5];
            var targetEnergy = this.intBuffer[target*s+6];

            if (target === i || isStatic) {
                continue;
            } 

            var x = this.floatBuffer[i*s+0];
            var y = this.floatBuffer[i*s+1];

            var targetX = this.floatBuffer[target*s+0];
            var targetY = this.floatBuffer[target*s+1];

            var dx = targetX - x;
            var dy = targetY - y;

            // if (dx >= this.width / 2) {
            //     dx -= this.width;
            // } else if (dx < -this.width /2) {
            //     dx += this.width;
            // }

            // if (dy >= this.height / 2) {
            //     dy -= this.height;
            // } else if (dy < -this.height /2) {
            //     dy += this.height;
            // }

            var dSq = dx*dx+dy*dy;
            
            if (dSq < this.hitDistanceSq) {

                // weird logic from boom
                if (Math.random() < 0.1) {
                    this.intBuffer[target*s+5] = this.getRandomTarget(target);
                    
                    if (targetEnergy < this.maxEnergy) {
                        this.intBuffer[target*s+5] = targetEnergy + 1;
                    }
                }

                if (energy > 0) {
                    this.intBuffer[i*s+4] = this.getRandomTarget(i);
                    this.intBuffer[i*s+6] = energy - 1;
                    if (energy - 1 == 0) {
                        isStatic = 1;
                        this.intBuffer[i*s+5] = isStatic;
                    } 
                }
                if (targetIsStatic) {
                    // revive
                    if (false && Math.random() < 0.001) {
                        this.intBuffer[target*s+5] = 1;
                        this.intBuffer[target*s+6] = this.maxEnergy;
                    }
                }
            } else {
                var d = Math.sqrt(dSq);
                var vx = dx / d * this.speed;
                var vy = dy / d * this.speed;
                this.floatBuffer[i*s+2] = vx;
                this.floatBuffer[i*s+3] = vy;
            }
        }

        for (i=0; i<this.count; i++) {
            var x = this.floatBuffer[i*s+0];
            var y = this.floatBuffer[i*s+1];
            var vx = this.floatBuffer[i*s+2];
            var vy = this.floatBuffer[i*s+3];
            var target = this.intBuffer[i*s+4];
            var isStatic = this.intBuffer[i*s+5];
            var energy = this.intBuffer[i*s+6];

            x = x + vx;
            y = y + vy;

            // if (x < 0) {
            //     x += this.width;
            // } else if (x >= this.width) {
            //     x -= this.width;
            // }

            // if (y < 0) {
            //     y += this.height;
            // } else if (y >= this.height) {
            //     y -= this.height;
            // }

            if (!isStatic) {
                this.floatBuffer[i*s+0] = x + vx;
                this.floatBuffer[i*s+1] = y + vy;    
            }
        }
    },

    getRandomTarget: function (i) {
        return (i + 1 + Math.floor(Math.random() * (this.count-1))) % this.count;
    }

});
