class ConcatGate extends AbstractBlock{
    
    public getValue() : string{
        let text = "";
        for( let input of this.inputs ){
            text += input.value;
        }
        return text;
    }
    public interact(){}
}

Sup.registerBehavior(ConcatGate);