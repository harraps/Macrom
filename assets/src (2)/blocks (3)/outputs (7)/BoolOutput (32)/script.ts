class BoolOutput extends Sup.Behavior implements IBlock {
    
    public color_high : string = "1.0,1.0,1.0";
    public color_low  : string = "0.0,0.0,0.0";
    
    protected colorHigh : Sup.Color;
    protected colorLow  : Sup.Color;
    
    protected input : BoolInPin;
    
    public awake() {
        this.colorHigh = Game.getColor(this.color_high);
        this.colorLow  = Game.getColor(this.color_low );
        
        this.input = this.actor.getChild("IN").getBehavior(BoolInPin);
        this.input.init(this);
    }

    public update() {
        this.setColor(this.input.value);
    }
    
    public getValue(){
        return null;
    }
    
    public setColor( ON : boolean ){
        this.actor.modelRenderer.setColor( ON ? this.colorHigh : this.colorLow );
    }
}
Sup.registerBehavior(BoolOutput);
