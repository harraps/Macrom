interface IBlock {
    getValue() : any;
}
interface IInteract {
    interact();
}

abstract class AbstractBlock extends Sup.Behavior implements IBlock{
    
    protected label : Sup.Actor;
    
    public awake(){
        // we activate wireframe mode
        //(<any>this.actor.modelRenderer).__inner.material.wireframe = true;
        // we initialize the output pin
        let output = this.actor.getChild("OUT").getBehavior(OutPin);
        output.init(this);
        
        this.label = this.actor.getChild("LABEL");
    }
    public update(){
        // if a label is set, we rotate the label toward the player
        if( this.label ) this.label.setOrientation(Game.player.view.getOrientation());
    }
    public abstract getValue() : any;
}

abstract class InteractBlock extends AbstractBlock implements IInteract{
    
    protected interactible : Sup.Actor; // the actor with which we can interact
    
    public awake(){
        super.awake();
        this.interactible = this.actor.getChild("INTERACT");
        //(<any>this.interactible.modelRenderer).__inner.material.wireframe = true;
        Game.interacts[Game.interacts.length] = this.interactible;
    }
    public abstract interact();
    
    public destroy(){
        super.destroy();
        let index = Game.interacts.indexOf(this.interactible);
        if(index > -1) Game.interacts.splice(index, 1);
    }
}