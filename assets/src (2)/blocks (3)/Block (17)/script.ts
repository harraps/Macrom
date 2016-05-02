/**
 * Every blocks has multiple arrays that can be empty:
 * - inputs to receive data from other blocks
 * - outputs to send data to other blocks
 * - labels to display data if necessary
 * - interactibles to change the properties of the block once placed
 */
interface IBlock {
    getValue( pin : OutPin ) : any;
}
interface IInteractible {
    interact( interactible : Sup.Actor );
}
// the most basic block we can create
abstract class AbstractBlock extends Sup.Behavior implements IBlock, IInteractible{
    
    protected inputs  : InPin [];
    protected outputs : OutPin[];
    protected labels  : Sup.TextRenderer[];
    protected interactibles : Sup.Actor [];
    
    // the value returned by the block may vary based on the outpin calling it
    public abstract getValue(pin : OutPin) : any;
    public abstract interact(interactible : Sup.Actor);
    
    public awake(){
        // we create the arrays
        this.inputs  = [];
        this.outputs = [];
        this.labels  = [];
        this.interactibles = [];
        
        // we register the block
        Game.board.addBlock(this);
        let content = this.actor.getChildren();
        for( let element of content ){
            let name = element.getName();
            let interact = false;
            if(name.charAt(0) == "#"){
                name = name.substr(1);
                Sup.log(name);
                interact = true;
            }
            // if the actor is an input pin
            let inpin = element.getBehavior(InPin);
            if(inpin){
                inpin.init(this);
                this.inputs[name] = inpin;
            }
            // if the actor is an out pin
            let outpin = element.getBehavior(OutPin);
            if(outpin){
                outpin.init(this);
                this.outputs[name] = outpin;
            }
            // if the actor is a label
            if(element.textRenderer){
                this.labels[name] = element.textRenderer;
            }
            // if an actor is an interactible if it has a # as the first character
            if(interact){
                Game.board.addInteractible(element);
                this.interactibles[name] = element;
            }
            
        }
    }
    public onDestroy(){
        Game.board.removeBlock(this); // we unregister the block
        for( let id in this. inputs ) this. inputs[id].destroyPin(); // we destroy the  input pins
        for( let id in this.outputs ) this.outputs[id].destroyPin(); // we destroy the output pins
        // we unregister the interactibles
        for( let id in this.interactibles ) Game.board.removeInteractible(this.interactibles[id]);
        //super.onDestroy();
    }
}