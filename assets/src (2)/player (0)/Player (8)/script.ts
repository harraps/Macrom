class Player extends Sup.Behavior {
    
    // actor = anchor
    public view : Sup.Actor;
    public grab : Sup.Actor;
    
    protected input : IInput;
    protected inven : Inventory;
    protected angle : Sup.Math.XY;
    
    // interactions
    protected currentInPin : InPin;
    protected buildMode    : boolean;
    
    public sensitivity : number = 0.5;
    public speed       : number = 0.3;
    
    private ray : Sup.Math.Ray;
    
    public awake(){
        Sup.Input.lockMouse();
        this.input = new KeyboardInput();
        this.inven = new Inventory();
        this.angle = {x:0,y:0};
        
        // we start in build mode
        this.buildMode = true;
        this.ray = new Sup.Math.Ray();
        
        this.view = this.actor.getChild("VIEW");
        this.grab = this.actor.getChild("GRAB");
        Game.player = this;
        
        this.inven.setPrefab(0,{name:"Switch",path:"BLOCKS/BOOLEAN/INPUT/Switch",subs:null});
        this.inven.setPrefab(1,{name:"Button",path:"BLOCKS/BOOLEAN/INPUT/Button",subs:null});
        this.inven.setPrefab(2,{name:"NOT"   ,path:"BLOCKS/BOOLEAN/GATE/NOT"    ,subs:null});
        this.inven.setPrefab(3,{name:"AND"   ,path:"BLOCKS/BOOLEAN/GATE/AND"    ,subs:null});
        this.inven.setPrefab(4,{name:"OR"    ,path:"BLOCKS/BOOLEAN/GATE/OR"     ,subs:null});
        this.inven.setPrefab(5,{name:"XOR"   ,path:"BLOCKS/BOOLEAN/GATE/XOR"    ,subs:null});
        this.inven.setPrefab(6,{name:"NAND"  ,path:"BLOCKS/BOOLEAN/GATE/NAND"   ,subs:null});
        this.inven.setPrefab(7,{name:"NOR"   ,path:"BLOCKS/BOOLEAN/GATE/NOR"    ,subs:null});
        this.inven.setPrefab(8,{name:"XNOR"  ,path:"BLOCKS/BOOLEAN/GATE/XNOR"   ,subs:null});
        this.inven.setPrefab(9,{name:"LED"   ,path:"BLOCKS/BOOLEAN/OUTPUT/LED"  ,subs:null});
    }
    public update(){
        // Mouse button :
        // 0 = Left
        // 1 = Middle
        // 2 = Right
        this.updateLook(); // we rotate the player
        this.updateMove(); // we move the player
        this.updatePointed();
        
        // if the player want to switch of mode, we toggle the value
        if(this.input.getSwitch()) this.buildMode = !this.buildMode;
        
        this.ray.setFromCamera(this.view.camera, {x:0, y:0});
        if( this.buildMode ){
            this.updateBuild();
        }else{
            this.updateInteract(); // we interact with the world
        }
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
    private updatePointed(){
        this.inven.cycle     (this.input.getCycle    ());
        this.inven.setCurrent(this.input.getNumerical());
    }
    private updateBuild(){
        // if the player is pressing the left click
        if(Sup.Input.wasMouseButtonJustPressed(0)){
            // we test the blocks
            let hit = this.ray.intersectActors(Game.board.blocks)[0];
            // if hit is not null, we destroy the block
            if(hit) hit.actor.destroy();
        }
        // if the player has a block selected in his inventory
        let path = this.inven.getCurrent();
        if(path){
            // if the player is pressing the right click
            if(Sup.Input.wasMouseButtonJustPressed(2)){
                // we test the blocks first
                let hit = this.ray.intersectActors(Game.board.blocks)[0];
                // if hit is not null, we create a new block next to it
                if(hit) this.placeBlock(hit, true);
                else{
                    // we test if the player is pointing toward the board
                    hit = this.ray.intersectActor(Game.board.actor, false)[0];
                    // if hit is not null
                    if(hit) this.placeBlock(hit);
                }
            }
        }
    }
    private placeBlock(hit : Sup.Math.ActorRaycastHit, useActor : boolean = false){
        // we recover the path of the block we want to create
        let path = this.inven.getCurrent();
        // we try to find the position of our block relative to the block hit
        let pos  = hit.normal;
        // if we hit an other block, the normal will be relative to the other block orientation
        if(useActor) pos.rotate(hit.actor.getOrientation());
        // we normalize the length of the vector
        pos.normalize();
        // if we hit the board, it is placed with a padding of 0.5 in every direction
        if(!useActor) pos.multiplyScalar(0.5);
        // we make the position global and not relative
        pos.add(useActor ? hit.actor.getPosition() : hit.point);
        // the block will be oriented in the direction of the player view
        let rot = this.angle.x;
        // we can give those info to the board
        Game.board.placeBlock(path, pos, rot);
    }
    private updateInteract(){
        // if the player is pressing the left click
        if(Sup.Input.wasMouseButtonJustPressed(0)){
            // we test for input pins and recover the first hit
            let hit = this.ray.intersectActors(Game.board.inpins)[0];
            // if hit is not null
            if(hit) this.currentInPin = hit.actor.getBehavior(InPin);
        }
        // if the player released the left click
        if(Sup.Input.wasMouseButtonJustReleased(0)){
            // if the current InPin is not null
            if(this.currentInPin){
                // we test for output pins and recover the first hit
                let hit = this.ray.intersectActors(Game.board.outpins)[0];
                // if hit is not null, we connect the pins (connection is proceed if they are of the right type)
                if(hit) this.currentInPin.connect(hit.actor.getBehavior(OutPin));
            }
            // when we release the click we want to be sure that current in pin is null
            this.currentInPin = null;
        }
        // if the player released the right click
        if(Sup.Input.wasMouseButtonJustReleased(2)){
            // we test for interactible objects
            let hit = this.ray.intersectActors(Game.board.interactibles)[0];
            // if hit is not null, we interact with the object
            if(hit) hit.actor.getParent().getBehavior(InteractibleBlock).interact();
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
