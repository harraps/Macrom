class PlayerMove {
    
    public player : Player;
    
    public angle : Sup.Math.XY;
    
    public constructor(player : Player) {
        this.player = player;
        this.angle = { x:0, y:0 };
    }
    
    public updateLook(){
        // we recover input
        let look = this.player.input.getLook();
        look.x *= -this.player.sensitivity_x;
        look.y *=  this.player.sensitivity_y;
        // we rotate horizontally
        this.player.actor.rotateLocalEulerY(look.x);
        this.angle.x += look.x;
        this.angle.x %= Util.TAU;
        // we rotate vertically
        this.player.view.rotateLocalEulerX(look.y);
        this.angle.y += look.y;
        if( this.angle.y > Util.hPI ){
            this.player.view.setLocalEulerX(Util.hPI);
            this.angle.y = Util.hPI;
        }else if( this.angle.y < -Util.hPI ){
            this.player.view.setLocalEulerX(Util.hPI);
            this.angle.y = -Util.hPI;
        }
    }
    public updateMove(){
        // we recover inputs
        let move = this.player.input.getMove();
        move.z *= -this.player.speed;
        move.x *=  this.player.speed;
        move.y *=  this.player.speed;
        // we apply them
        this.player.actor.moveOrientedZ(move.z);
        this.player.actor.moveOrientedX(move.x);
        this.player.actor.moveY(move.y);
    }
}
