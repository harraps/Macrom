class NumberOutput extends AbstractBlock {
    
    protected input : NumberInPin;
    
    public awake() {
        super.awake();
        this.input = this.actor.getChild("IN").getBehavior(NumberInPin);
        this.input.init(this);
    }

    public update() {
        super.update();
        this.label.textRenderer.setText( this.input.value ? this.input.value : 0 );
    }
    
    public getValue(){
        return null;
    }
    public onDestroy(){
        if(this.input) this.input.destroyPin();
        super.onDestroy();
    }
}

/* REGISTER */
Sup.registerBehavior(NumberOutput);
