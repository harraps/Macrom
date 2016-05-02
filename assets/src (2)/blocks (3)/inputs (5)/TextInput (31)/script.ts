class TextInputBlock extends AbstractBlock {
    
    protected value : string = "";
    
    public interact() {
        // TODO
    }
    public getValue() : string{
        return this.value;
    }
}

/* REGISTER */
Sup.registerBehavior(TextInputBlock);
