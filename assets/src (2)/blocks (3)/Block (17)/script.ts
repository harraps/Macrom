interface IBlock {
    getValue( pin : OutPin ) : any;
}

// the most basic block we can create
abstract class AbstractBlock extends Sup.Behavior implements IBlock{
    
    protected label : Sup.Actor;
    protected out   : OutPin;
    
    public awake(){
        Game.board.addBlock(this);
        
        let output = this.actor.getChild("OUT");
        // we initialize the output pin if it's present
        if(output){
            this.out = output.getBehavior(OutPin);
            this.out.init(this);
        }
        this.label = this.actor.getChild("LABEL");
    }
    public update(){
        // if a label is set, we rotate the label toward the player
        if(this.label) this.label.setOrientation(Game.player.view.getOrientation());
    }
    // the value returned by the block may vary based on the outpin calling it
    public abstract getValue(pin : OutPin) : any;
    
    public onDestroy(){
        Game.board.removeBlock(this);
        if(this.out) this.out.destroyPin();
        //super.onDestroy();
    }
}

// an interact block has a specific method interact
abstract class InteractibleBlock extends AbstractBlock{
    
    public interactible : Sup.Actor; // the actor with which we can interact
    
    public awake(){
        super.awake();
        this.interactible = this.actor.getChild("INTERACT");
        Game.board.addInteractible(this);
        //(<any>this.interactible.modelRenderer).__inner.material.wireframe = true;
    }
    public abstract interact();
    
    public onDestroy(){
        Game.board.removeInteractible(this);
        super.onDestroy();
    }
}