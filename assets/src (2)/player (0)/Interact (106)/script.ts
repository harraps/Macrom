class PlayerInteract {
    
    public player : Player;
    
    private ray : Sup.Math.Ray;
    // interactions
    protected currentInPin : InPin;
    public buildMode : boolean;
    public invenMode : boolean;
    
    public constructor(player : Player) {
        this.player = player;
        this.ray = new Sup.Math.Ray();
        this.currentInPin = null;
        this.buildMode = true;
        this.invenMode = false;
    }

    public update() {
        // if the player want to switch of mode, we toggle the value
        if(this.player.input.getInventory()){
            this.invenMode = ! this.invenMode;
            this.player.hud.InventoryVisible = this.invenMode;
            // if we are in inventory mode, we want to display the palette
            if(this.invenMode)       this.player.hud.PaletteVisible = true;
            else if(!this.buildMode) this.player.hud.PaletteVisible = false;
            // if we are in menumode, we want to be able to select elements in the menu
            if(this.invenMode) Sup.Input.unlockMouse();
            else               Sup.Input.  lockMouse();
        }
        if(this.player.input.getSwitch() && !this.invenMode){
            this.buildMode = !this.buildMode;
            this.player.hud.PaletteVisible = this.buildMode;
        }
        
        this.ray.setFromCamera(this.player.view.camera, {x:0, y:0});
        
        if(this.invenMode) this.player.hud.updateHUD();
        else if(this.buildMode) this.updateBuild();
        else this.updateInteract(); // we interact with the world
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
        let path = this.player.inven.getCurrent();
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
        let path = this.player.inven.getCurrent();
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
        let rot = this.player.move.angle.x;
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
            if(hit) hit.actor.getParent().getBehavior(AbstractBlock).interact(hit.actor);
        }
    }
}
