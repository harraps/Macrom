interface IInput {
    getMove() : Sup.Math.XYZ;
    getLook() : Sup.Math.XY;
    getCycle() : number;
    
    getInventory() : boolean;
    getConnect  () : boolean;
    getDestroy  () : boolean;
    getBuild    () : boolean;
    getUse      () : boolean;
    getSelect   () : number;
    getCommand  () : string;
}

class KeyboardInput implements IInput {
    public getMove() : Sup.Math.XYZ{
        let move = {x:0,y:0,z:0}
        if(Game.input.isInputDown("moveForward" )) ++move.z;
        if(Game.input.isInputDown("moveBackward")) --move.z;
        if(Game.input.isInputDown("moveLeft"    )) --move.x;
        if(Game.input.isInputDown("moveRight"   )) ++move.x;
        if(Game.input.isInputDown("moveUp"      )) ++move.y;
        if(Game.input.isInputDown("moveDown"    )) --move.y;
        return move;
    }
    public getLook() : Sup.Math.XY{
        let look =  Sup.Input.getMouseDelta() //{x:0,y:0};
        return look;
    }
    public getCycle() : number{
        let cycle = 0;
        if(Game.input.isInputDown("cycleUp"  )) ++cycle;
        if(Game.input.isInputDown("cycleDown")) --cycle;
        return cycle;
    }
    public getInventory() : boolean{
        return Game.input.wasInputJustPressed("inventory");
    }
    public getConnect() : boolean{
        return Game.input.wasInputJustPressed("connect");
    }
    public getDestroy() : boolean{
        return Game.input.isInputDown("destroy");
    }
    public getBuild() : boolean{
        return Game.input.isInputDown("build");
    }
    public getUse() : boolean{
        return Game.input.wasInputJustPressed("use");
    }
    public getSelect() : number{
        let select = 0;
        if(Game.input.isInputDown("select"  )) ++select;
        if(Game.input.isInputDown("unselect")) --select;
        return select;
    }
    public getCommand() : string{
        if(Game.input.wasInputJustPressed("cmdCut"  )) return "cut";
        if(Game.input.wasInputJustPressed("cmdCopy" )) return "copy";
        if(Game.input.wasInputJustPressed("cmdPaste")) return "paste";
        return null;
    }
}

class Player extends Sup.Behavior {
    
    // actor = anchor
    public view : Sup.Actor;
    public grab : Sup.Actor;
    
    protected input : IInput;
    protected angle : Sup.Math.XY;
    protected currentInPin : InPin;
    
    public sensitivity : number = 0.5;
    public speed       : number = 0.3;
    
    public awake(){
        Sup.Input.lockMouse();
        this.input = new KeyboardInput();
        this.angle = {x:0,y:0};
        
        this.view = this.actor.getChild("VIEW");
        this.grab = this.actor.getChild("GRAB");
        Game.player = this;
    }
    public update(){
        this.updateMove(); // we move the player
        this.updateLook(); // we rotate the player
        this.updateInteract(); // we interact with the world
    }
    
    private updateMove(){
        // we recover inputs
        let move = this.input.getMove();
        move.z *= -this.speed;
        move.x *=  this.speed;
        move.y *=  this.speed;
        // we apply them
        this.actor.moveOrientedZ(move.z);
        this.actor.moveOrientedX(move.x);
        this.actor.moveY(move.y);
    }
    private updateLook(){
        // we recover input
        let look = this.input.getLook();
        look.x *= -this.sensitivity;
        look.y *=  this.sensitivity;
        // we rotate horizontally
        this.actor.rotateLocalEulerY(look.x);
        this.angle.x += look.x;
        this.angle.x %= Util.TAU;
        // we rotate vertically
        this.view.rotateLocalEulerX(look.y);
        this.angle.y += look.y;
        if( this.angle.y > Util.halfPI ){
            this.view.setLocalEulerX(Util.halfPI);
            this.angle.y = Util.halfPI;
        }else if( this.angle.y < -Util.halfPI ){
            this.view.setLocalEulerX(Util.halfPI);
            this.angle.y = -Util.halfPI;
        }
    }
    private updateInteract(){
        // Mouse button :
        // 0 = Left
        // 1 = Middle
        // 2 = Right
        let ray = new Sup.Math.Ray();
        ray.setFromCamera(this.view.camera, {x:0, y:0});
        // if the player is pressing the left click
        if(Sup.Input.wasMouseButtonJustPressed(0)){
            // we test for input pins and recover the first hit
            let hit = ray.intersectActors(Game.inpins)[0];
            // if hit is not null
            if(hit) this.currentInPin = hit.actor.getBehavior(InPin);
        }
        // if the player released the left click
        if(Sup.Input.wasMouseButtonJustReleased(0)){
            // if the current InPin is not null
            if(this.currentInPin){
                // we test for output pins and recover the first hit
                let hit = ray.intersectActors(Game.outpins)[0];
                // if hit is not null, we connect the pins (connection is proceed if they are of the right type)
                if(hit) this.currentInPin.connect(hit.actor.getBehavior(OutPin));
            }
            // when we release the click we want to be sure that current in pin is null
            this.currentInPin = null;
        }
        // if the player released the right click
        if(Sup.Input.wasMouseButtonJustReleased(2)){
            // we test for interactible objects
            let hit = ray.intersectActors(Game.interacts)[0];
            // if hit is not null, we interact with the object
            if(hit) hit.actor.getParent().getBehavior(InteractBlock).interact();
        }
    }
    
    private static getForward( q : Sup.Math.Quaternion ) : Sup.Math.Vector3 {
        return new Sup.Math.Vector3(
            2*( q.x*q.z + q.w*q.y ),
            2*( q.y*q.x - q.w*q.x ),
            1 - 2*( q.x*q.x + q.y*q.y )
        );
    }
}
Sup.registerBehavior(Player);
