/** 
 * Pins work the following way :
 * one output (arrow) can be connected to multiple input (box) but
 * one input (box) can only be connected to one output (arrow)
 * inputs always ask for the value of the output :
 * input.value get output.value and not the opposite
 */

// define basic interaction with pins
abstract class AbstractPin extends Sup.Behavior{
    
    public value : any; // type of value will change based on the type of pin
    
    protected block : AbstractBlock; // the block to which the pin is attached to (   not null)
    
    public awake() {
        // we activate wireframe mode
        //(<any>this.actor.modelRenderer).__inner.material.wireframe = true;
    }
    public init( block : AbstractBlock ){
        this.block = block;
    }
    public update(){
        // we have used the value for this update
        this.value = null;
    }
    
    public abstract connect( pin : AbstractPin );
    public abstract destroyPin();
}
// define input square pins
abstract class InPin extends AbstractPin {
    
    // pattern to define colors : "RRGGBB" in hexa
    public color_high : string = "FFFFFF";
    public color_low  : string = "000000";
    
    protected outpin : OutPin;    // the connected outpin
    protected wire   : Sup.Actor; // the wire connecting the outpin to the inpin
    
    protected colorHigh : Sup.Color; // color to apply to the wire when value is high
    protected colorLow  : Sup.Color; // color to apply to the wire when value is low
    
    public get Connected() : OutPin{
        return this.outpin;
    }
    
    public awake() {
        super.awake();
        // we add the pin to the list
        Game.board.addInPin(this);
        
        // we recover the colors
        this.colorHigh = Game.getColor(this.color_high);
        this.colorLow  = Game.getColor(this.color_low );
        // we recover the wire attached to the pin
        this.wire = this.actor.getChild("WIRE");
        // we set the wire length to a value very close to 0 (but not 0)
        this.wire.setLocalScaleZ(0.01);
        // we enable wireframe mode
        //(<any>this.wire.modelRenderer ).__inner.material.wireframe = true;
    }

    public update() {
        super.update();
        // we recover the value from the connected outPin
        if( this.outpin ){ // if not null
            this.value = this.outpin.value;
        }
    }
    
    // connect from box to arrow
    public connect( outpin : OutPin ){
        this.outpin = outpin;
        if( this.outpin ){ // if not null
            // we add the pin to the list of pins
            this.outpin.addInPin(this);
            // we recover the position of the pin
            let pos = this.outpin.actor.getPosition();
            // we rotate the wire in the right direction
            this.wire.lookAt(pos);
            // and we extend it
            let distance = this.wire.getPosition().distanceTo(pos);
            this.wire.setLocalScaleZ(distance);
        }
    }
    public disconnect(){
        // we remove the pin from the list
        if(this.outpin) this.outpin.removeInPin(this);
        // we reset the scale of the wire close to 0
        this.wire.setLocalScaleZ(0.01);
        this.outpin = null;
    }

    public setWire( ON : boolean ){
        this.wire.modelRenderer.setColor( ON ? this.colorHigh : this.colorLow );
    }
    
    public destroyPin(){
        //this.disconnect();
        Game.board.removeInPin(this);
    }
}
// define output arrow pins
abstract class OutPin extends AbstractPin {
    
    protected inpins : InPin[];
    
    public awake(){
        super.awake();
        this.inpins = [];
        // we add the pin to the list
        Game.board.addOutPin(this);
    }
    
    public update() {
        super.update();
        // we recover the value from the parent block
        if( this.block ){ // if not null
            this.value = this.block.getValue();
        }
    }
    
    // connect from arrow to box
    public connect(inpin : InPin){
        // we connect the inpin to the outpin
        // and not the other way around
        inpin.connect(this);
    }
    
    // disconnect only the given pin
    public disconnect(inpin : InPin){
        // if in pin is connected to this out pin
        if(inpin.Connected == this) inpin.disconnect();
    }
    
    // disconnect all of the pins
    public disconnectAll(){
        for( let inpin of this.inpins ){
            this.disconnect(inpin);
        }
    }
    
    public addInPin(inpin : InPin){
        Util.listAdd(this.inpins, inpin);
    }
    public removeInPin(inpin : InPin){
        Util.listRemove(this.inpins, inpin);
    }
    
    public destroyPin(){
        this.disconnectAll();
        Game.board.removeOutPin(this);
    }
}
