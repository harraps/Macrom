class TextInputBlock extends AbstractBlock implements IInteract {
    
    protected value : string = "";
    
    public awake(){
        super.awake();
    }
    
    public interact() {
        
    }
    public getValue() : string{
        return this.value;
    }
}
Sup.registerBehavior(NumberInputBlock);
