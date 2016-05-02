class NumberOutput extends AbstractBlock {

    public update() {
        this.labels["LABEL"].setText( this.inputs["IN"].value ? this.inputs["IN"].value : 0 );
    }
    
    public getValue(){}
    public interact(){}
}

/* REGISTER */
Sup.registerBehavior(NumberOutput);
