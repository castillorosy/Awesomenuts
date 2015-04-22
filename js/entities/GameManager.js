game.GameTimerManager = Object.extend({
    init: function(x, y, settings) {
        this.now = new Date().getTime();
        this.lastCreep = new Date().getTime();
        this.paused = false;
        this.alwaysUpdate = true;
    },
    update: function() {
        this.now = new Date().getTime();
        this.goldTimerCheck();
        this.creepTimerCheck();
//  the timer for the "hero" and the "creep"
        return true;
    },
    goldTimerCheck: function() {
        if (Math.round(this.now / 1000) % 20 === 0 && (this.now - this.lastCreep >= 1000)) {
            game.data.gold += (game.data.exp1 + 1);
            console.log("Current gold:" + game.data.gold);
        }
//        the timer when the timer is up 
//        the game is over
    },
    creepTimerCheck: function() {
        if (Math.round(this.now / 1000) % 10 === 0 && (this.now - this.lastCreep >= 1000)) {
            this.lastCreep = this.now;
            var creepe = me.pool.pull("EnemyCreep", 1000, 0, {});
            me.game.world.addChild(creepe, 5);
        }
    }

});
game.HeroDeathManager = Object.extend({
    init: function(x, y, settings) {
        this.alwaysUpdate = true;
    },
    update: function() {
        if (game.data.player.dead) {
            this.removePlayer();
        }
        return true;
    },
    removePlayer: function() {
        me.game.world.removeChild(game.data.player);
        me.state.current().resetPlayer(10, 0);
    }
});
game.ExperienceManager = Object.extend({
    init: function(x, y, settings) {
        this.alwaysUpdate = true;
        this.gameOver = false;
    },
    update: function() {
        if (game.data.win === true && !this.gameover) {
            this.gameOver(true);
        } else if (game.data.win === false && !this.gameover) {
            this.gameOver(false);
        }

        return true;
    },
    gameOver: function(win) {
        if (win) {
            alert("You Win"),
                    game.data.exp += 10;
        } else {
            alert("You Lose");
            game.data.exp += 1;
        }

        this.gameover = true;
        me.save.exp = game.data.exp;
//          to save when you are done with the game
    }
//  when the game is over it tells you when or if you win or lose
});
game.SpendGold = Object.extend({
    init: function(x, y, settings) {
        this.now = new Date().getTime();
        this.lastBuy = new Date().getTime();
        this.paused = false;
        this.alwaysUpdate = true;
        this.updateWhenPaused = true;
        this.buying = false;
    },
    update: function() {
        this.now = new Date().getTime();
        if (me.input.isKeyPressed("buy") && this.now - this.lastBuy >= 1000) {
            this.lastBuy = this.now;
            if (!this.buying) {
                this.startBuying();
            } else {
            this.stopBuying();
        }
//           if the key is pressed over a second 2 things will
//             happen buy things will be false and or start 
//             buying stuff
        }
        this.checkBuyKeys();
        return true;
    },
    startBuying: function() {
        this.buying = true;
//        when they start buying
        me.state.pause(me.state.PLAY);
// make sure the pausing is right
        game.data.pausePos = me.viewport.localToWorld(0, 0);
        game.data.buyscreen = new me.Sprite(game.data.pausePos.x, game.data.pausePos.y, me.loader.getImage('gold-screen'));
        game.data.buyscreen = updateWhenPaused = true;
        game.data.buyscreen.setOpacity(0, 8);
        me.game.world.addChild(game.data.buyscreen, 34);
        game.data.player.body.setVelocity(0, 0);
        me.input.bindKey(me.input.KEY.F1, "F1", true);
        me.input.bindKey(me.input.KEY.F2, "F2", true);
        me.input.bindKey(me.input.KEY.F3, "F3", true);
        me.input.bindKey(me.input.KEY.F4, "F4", true);
        me.input.bindKey(me.input.KEY.F5, "F5", true);
        me.input.bindKey(me.input.KEY.F6, "F6", true);
        this.setBuyText();
    },
    setBuyText: function() {
        game.data.buytext = new (me.Renderable.extend({
            init: function() {
                this._super(me.Renderable, "init", [game.data.pausedPos.x, game.pausedPos.y, 300, 50]);
                this.font = new me.Font("Arial", 26, "white");
                this.updateWhenPaused = true;
                this.alwaysUpdate = true;
            },
            draw: function(renderer) {
                this.font.draw(renderer.getContext(), "PRESS F1-F6 TO BUY, B TO EXIT, Current Gold: " + game.data.gold, this.pos.x, this.pos.y);
                this.font.draw(renderer.getContext(), "Skill 1: Increase Damage, Current Level" + game.data.skill1 + " Cost: " + ((game.data.skill1 + 1) * 10), this.pos.x, this.pos.y);
                this.font.draw(renderer.getContext(), "Skill 2: Run Faster: Current Level: " + game.data.skill2 + " Cost: " + ((game.data.skill2 + 1) * 10), this.pos.x, this.pos.y);
                this.font.draw(renderer.getContext(), "Skill 3: Increase Health. Current Level: " + game.data.skill3 + " Cost: " + ((game.data.skill3 + 1) * 10), this.pos.x, this.pos.y);
                this.font.draw(renderer.getContext(), "Q Ability: Speed Burst. Current Level: " + game.data.ability1 + " Cost: " + ((game.data.ability1 + 1) * 10), this.pos.x, this.pos.y);
                this.font.draw(renderer.getContext(), "E Ability: Eat Your Creep For Health: " + game.data.ability2 + " Cost: " + ((game.data.ability2 + 1) * 10), this.pos.x, this.pos.y);
                this.font.draw(renderer.getContext(), "W Ability: Throw Your Spear: " + game.data.ability3 + " Cost: " + ((game.data.ability3 + 1) * 10), this.pos.x, this.pos.y);
            }

        }));
        me.game.world.addChild(game.data.buytext, 35);
    },
    stopBuying: function() {
        this.buying = false;
//         this will make sure witch one they are opening
        me.state.resume(me.state.PLAY);
        game.data.player.body.setVelocity(game.data.playerMoveSpeed, 20);
        me.game.world.removeChild(game.data.buyscreen);
        game.data.player.body.setVelocity(0, 0);
        me.input.unbindKey(me.input.KEY.F1, "F1", true);
        me.input.unbindKey(me.input.KEY.F2, "F2", true);
        me.input.unbindKey(me.input.KEY.F3, "F3", true);
        me.input.unbindKey(me.input.KEY.F4, "F4", true);
        me.input.unbindKey(me.input.KEY.F5, "F5", true);
        me.input.unbindKey(me.input.KEY.F6, "F6", true);
        me.game.world.romvieChile(game.data.buytext);
    },
    checkBuyKeys: function() {
        if (me.input.isKeyPressed("F1")) {
            if (this.checkCost(1)) {
                this.makePurchase(1);
            }
        } else if (me.input.isKeyPressed("F2")) {
            if (this.checkCost(2)) {
                this.makePurchase(2);
            }
        } else if (me.input.isKeyPressed("F3")) {
            if (this.checkCost(3)) {
                this.makePurchase(3);
            }
        } else if (me.input.isKeyPressed("F4")) {
            if (this.checkCost(4)) {
                this.makePurchase(4);
            }
        } else if (me.input.isKeyPressed("F5")) {

            if (this.checkCost(5)) {
                this.makePurchase(5);
            }
        } else if (me.input.isKeyPressed("F6")) {

            if (this.checkCost(6)) {
                this.makePurchase(6);
            }
        }
    },
    checkCost: function(skill) {
        if (skill === 1) {
            return true;
        } else {
            return false;
        }
    },
//    to see if we can afford the cost of the skill purpose 
// if its true it will continue if its not it would fail 
// if we do this we need to make sure that we have enough
// and the golbal amount

    makePurchase: function(skill) {
//        changes base on the purchse
    }

});
// make sure that it stops and it works
//make sure we are also removing