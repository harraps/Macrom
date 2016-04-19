class NumberInputBlock extends InteractibleBlock {
    
    protected value : number = 0;
    
    public awake(){
        super.awake();
    }
    
    public interact() {
        
    }
    public getValue() : number{
        return this.value;
    }
}
Sup.registerBehavior(NumberInputBlock);
