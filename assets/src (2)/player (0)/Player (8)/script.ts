class Player extends Sup.Behavior {
    
    // actor = anchor
    public view : Sup.Actor;
    public grab : Sup.Actor;
    
    public input : IInput;
    public move  : PlayerMove;
    public inven : Inventory;
    public inter : PlayerInteract;
    public hud   : HUD;
    
    public sensitivity_x : number = 0.6;
    public sensitivity_y : number = 0.5;
    public speed : number = 0.3;
    
    public awake(){
        Sup.Input.lockMouse();
        this.input = new KeyboardInput (this);
        this.move  = new PlayerMove    (this);
        this.inven = new Inventory     (this);
        this.inter = new PlayerInteract(this);
        this.hud   = new HUD           (this);
        
        this.view = this.actor.getChild("VIEW");
        this.grab = this.actor.getChild("GRAB");
        Game.player = this;
    }
    public update(){
        // Mouse button :
        // 0 = Left
        // 1 = Middle
        // 2 = Right
        if(!this.inter.invenMode){ // if we're not in inventory mode
            this.move .updateLook();    // we rotate the player
            this.inven.updatePointed(); // update the selected block type
        }
        this.move .updateMove();   // we move the player
        this.hud  .update(); // update the inventory display
        this.inter.update();
        
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
