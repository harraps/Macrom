class Board extends Sup.Behavior {
    // minimal position
    public x : number = 0;
    public y : number = 0;
    public z : number = 0;
    // maximal position
    public width  : number = 0;
    public height : number = 0;
    public depth  : number = 0;
    
    // we store our element as actors to optimise raycasts
    public inpins  : Sup.Actor[];
    public outpins : Sup.Actor[];
    public blocks  : Sup.Actor[];
    public interactibles : Sup.Actor[];
    
    protected minPos : Sup.Math.XYZ;
    protected maxPos : Sup.Math.XYZ;
    
    public awake() {
        this.inpins  = [];
        this.outpins = [];
        this.blocks  = [];
        this.interactibles = [];
        
        // we set the borders of the board
        this.minPos = { x: this.x, y: this.y, z: this.z };
        this.maxPos = {
            x: this.x + this.width  - 1,
            y: this.y + this.height - 1,
            z: this.z + this.depth  - 1
        };
        Game.board = this;
        
        let grid = this.actor.getChild("GRID");
        if(grid)
            if(grid.modelRenderer)
                // we enable wireframe mode
                (<any>grid.modelRenderer ).__inner.material.wireframe = true;
    }
    
    /* ADD */
    public addInPin(inpin : InPin){
        if(inpin){
            if(Board.canRayCast(inpin.actor)) Util.listAdd(this.inpins, inpin.actor);
            else Sup.log("Invalid Input Pin, needs an raycastable actor");
        }else Sup.log("Input Pin is null");
    }
    public addOutPin(outpin : OutPin){
        if(outpin){
            if(Board.canRayCast(outpin.actor)) Util.listAdd(this.outpins, outpin.actor);
            else Sup.log("Invalid Output Pin, needs an raycastable actor");
        }else Sup.log("Output Pin is null");
    }
    public addBlock(block : AbstractBlock){
        if(block){
            if(Board.canRayCast(block.actor)) Util.listAdd(this.blocks, block.actor);
            else Sup.log("Invalid Block, needs an raycastable actor");
        }else Sup.log("Block is null");
    }
    public addInteractible(actor : Sup.Actor){
        if(Board.canRayCast(actor))
            Util.listAdd(this.interactibles, actor);
        else Sup.log("Invalid Interactible, needs an raycastable actor");
    }
    
    /* REMOVE */
    public removeInPin(inpin : InPin){
        Util.listRemove(this.inpins, inpin.actor);
    }
    public removeOutPin(outpin : OutPin){
        Util.listRemove(this.outpins, outpin.actor);
    }
    public removeBlock(block : AbstractBlock){
        Util.listRemove(this.blocks, block.actor);
    }
    public removeInteractible(actor : Sup.Actor){
        Util.listRemove(this.interactibles, actor);
    }
    
    public placeBlock( path : IPath, pos : Sup.Math.Vector3, rot : number ){
        // we want whole numbers and not floating point one
        pos.x = Math.round(pos.x);
        pos.y = Math.round(pos.y);
        pos.z = Math.round(pos.z);
        
        rot = Util.clampAngle(rot);
        
        // if the component path of path is set
        if(path.path){
            // if the position is valid and not used yet
            if( this.isValidPosition(pos) && !this.isPositionUsed(pos) ){
                // we create a new block from the path
                let block = Sup.appendScene(path.path)[0];
                // if block is not null
                block.setPosition(pos);
                block.setLocalEulerY(rot);
                
            }
        }
    }
    
    public isPositionUsed( pos : Sup.Math.XYZ ) : boolean{
        for( let block of this.blocks ){
            // if the position is the same as an other block
            if(Util.areEqualsVec3(pos, block.getPosition())) return true;
        }
        // the position is not used
        return false;
    }
    public isValidPosition( pos : Sup.Math.Vector3 ) : boolean{
        // we test each coord
        // if is outside of the interval, then the position is not valid
        if( pos.x < this.minPos.x || this.maxPos.x < pos.x ) return false;
        if( pos.y < this.minPos.y || this.maxPos.y < pos.y ) return false;
        if( pos.z < this.minPos.z || this.maxPos.z < pos.z ) return false;
        return true;
    }
    
    protected static canRayCast( actor : Sup.Actor ) : boolean {
        // if the actor is not null
        if(actor){
            // if it has a component which can be used to perform raycasts
            if(
                actor.modelRenderer ||
                actor.cubicModelRenderer ||
                actor.spriteRenderer ||
                actor.tileMapRenderer ||
                actor.textRenderer
            ) return true;
        }
        return false;
    }
}
Sup.registerBehavior(Board);
