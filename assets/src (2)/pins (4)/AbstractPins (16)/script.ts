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
    
    protected block : IBlock;    // the block to which the pin is attached to
    
    public awake() {
        // we activate wireframe mode
        //(<any>this.actor.modelRenderer).__inner.material.wireframe = true;
    }
    public init( block : IBlock ){
        this.block = block;
    }
    public update(){
        // we have used the value for this update
        this.value = null;
    }
    
    public abstract connect( pin : AbstractPin );
}
// define input square pins
abstract class InPin extends AbstractPin {
    
    // pattern to define colors : "RRGGBB" in hexa
    public color_high : string = "FFFFFF";
    public color_low  : string = "000000";
    
    protected wire      : Sup.Actor; // the wire connecting the outpin to the inpin
    protected connected : OutPin;    // the connected outpin
    protected colorHigh : Sup.Color; // color to apply to the wire when value is high
    protected colorLow  : Sup.Color; // color to apply to the wire when value is low
    
    public awake() {
        super.awake();
        // we add the pin to the list
        Game.inpins[Game.inpins.length] = this.actor;
        
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
        if( this.connected ){ // if not null
            this.value = this.connected.value;
        }
    }
    
    public connect( outpin : OutPin ){
        this.connected = outpin;
        if( this.connected ){ // if not null
            let pos = this.connected.actor.getPosition();
            // we rotate the wire in the right direction
            this.wire.lookAt(pos);
            let distance = this.wire.getPosition().distanceTo(pos);
            this.wire.setLocalScaleZ(distance);
        }
    }

    public setWire( ON : boolean ){
        this.wire.modelRenderer.setColor( ON ? this.colorHigh : this.colorLow );
    }
    
    public destroy(){
        super.destroy();
        let index = Game.inpins.indexOf(this.actor);
        if(index > -1) Game.inpins.splice(index, 1);
    }
}
// define output arrow pins
abstract class OutPin extends AbstractPin {
    
    public awake(){
        super.awake();
        // we add the pin to the list
        Game.outpins[Game.outpins.length] = this.actor;
    }
    
    public update() {
        super.update();
        // we recover the value from the parent block
        if( this.block ){ // if not null
            this.value = this.block.getValue();
        }
    }
    
    public connect( inpin : InPin ){
        // we connect the inpin to the outpin
        // and not the other way around
        inpin.connect(this);
    }
    
    public destroy(){
        super.destroy();
        let index = Game.outpins.indexOf(this.actor);
        if(index > -1) Game.outpins.splice(index, 1);
    }
}
