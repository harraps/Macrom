abstract class TextGateBlock extends AbstractBlock {
    
    protected inA : TextInPin;
    
    public awake() {
        super.awake();
        this.inA = this.actor.getChild("A").getBehavior(TextInPin);
        this.inA.init(this);
    }
}

abstract class TextGate2Block extends TextGateBlock{
    
    protected inB : TextInPin;
    
    public awake(){
        super.awake();
        this.inB = this.actor.getChild("B").getBehavior(TextInPin);
        this.inB.init(this);
    }
    
}

class ConcatGate extends TextGate2Block{
    public getValue() : string{
        return this.inA.value + this.inB.value;
    }
}
