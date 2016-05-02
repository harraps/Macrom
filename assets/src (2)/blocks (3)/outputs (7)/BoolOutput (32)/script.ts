class BoolOutput extends AbstractBlock {
    
    public color_high : string = "1.0,1.0,1.0";
    public color_low  : string = "0.0,0.0,0.0";
    
    protected colorHigh : Sup.Color;
    protected colorLow  : Sup.Color;
    
    public awake() {
        super.awake();
        
        this.colorHigh = Game.getColor(this.color_high);
        this.colorLow  = Game.getColor(this.color_low );
    }
    public update() {
        this.setColor(this.inputs["IN"].value);
    }
    
    public getValue(){}
    public interact(){}
    
    public setColor( ON : boolean ){
        this.actor.modelRenderer.setColor( ON ? this.colorHigh : this.colorLow );
    }
}
Sup.registerBehavior(BoolOutput);
