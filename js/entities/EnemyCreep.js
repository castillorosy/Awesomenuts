game.EnemyCreep = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, "init", [x, y, {
                image: "creep1",
                width: 32,
                height: 64,
                spritewidth: "32",
                spriteheight: "64",
                getShape: function() {
                    return (new me.Rect(0, 0, 32, 64)).toPolygon();
                }
//  helps us show how the creep is suppose to look
// and how fast the creep is. 
            }]);

        this.health = game.data.enemyCreepHealth;
        this.alwaysUpdate = true;
        //this.attacking lets us know if the enemy is attacking
        this.attacking = false;
        this.lastAttacking = new Date().getTime();
        this.lastHit = new Date().getTime();
        this.now = new Date().getTime();
        this.body.setVelocity(3, 20);

        this.type = "EnemyCreep";

        this.renderable.addAnimation("walk", [3, 4, 5], 80);
        this.renderable.setCurrentAnimation("walk");
    },
//    this is the actual code for the speed
// and how the animation is suppose to work
    loseHealth: function(damage) {
        this.health = this.health - damage;

    },
    update: function(delta) {
        if (this.health <= 0) {


            me.game.world.removeChild(this);
        }
// when you lose its suppose to make it dissaper
        this.now = new Date().getTime();

        this.body.vel.x -= this.body.accel.x * me.timer.tick;
        me.collision.check(this, true, this.collideHandler.bind(this), true);
        this.body.update(delta);


        this._super(me.Entity, "update", [delta]);
        return true;
    },
    collideHandler: function(response) {
        if (response.b.type === "PlayerBase") {
            this.attacking = true;
            this.body.vel.x = 0;
            this.pos.x = this.pos.x + 1;
            if ((this.now - this.lastHit >= game.data.enemyCreepAttackTimer)) {
                this.lastHit = this.now;
                response.b.loseHealth(game.data.enemyCreepAttack);

            }
        } else if (response.b.type === "PlayerEntity") {
            var xdif = this.pos.x - response.b.pos.x;
            var ydif = this.pos.y - response.b.pos.y;

            this.attacking = true;
// the attack and how man attacks before either or die
            if (xdif > 0) {

                this.pos.x = this.pos.x + 1;
                this.body.vel.x = 0;
            }
            if ((this.now - this.lastHit >= game.data.enemyCreepAttackTimer) && xdif > 0) {
                this.lastHit = this.now;
                response.b.loseHealth(game.data.enemyCreepAttack);

            }
        }
    }
});
