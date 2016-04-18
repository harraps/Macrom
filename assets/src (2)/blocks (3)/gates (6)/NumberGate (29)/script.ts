abstract class NumberGateBlock extends AbstractBlock {
    
    protected inA : NumberInPin;
    
    public awake() {
        super.awake();
        this.inA = this.actor.getChild("A").getBehavior(NumberInPin);
        this.inA.init(this);
    }
}

abstract class NumberGate2Block extends NumberGateBlock{
    
    protected inB : NumberInPin;
    
    public awake(){
        super.awake();
        this.inB = this.actor.getChild("B").getBehavior(NumberInPin);
        this.inB.init(this);
    }
    
}

class AddGate extends NumberGate2Block{
    public getValue() : number{
        return this.inA.value + this.inB.value;
    }
}
class SubtractGate extends NumberGate2Block{
    public getValue() : number{
        return this.inA.value - this.inB.value;
    }
}
class MultiplyGate extends NumberGate2Block{
    public getValue() : number{
        return this.inA.value * this.inB.value;
    }
}
class DivideGate extends NumberGate2Block{
    public getValue() : number{
        return this.inA.value / this.inB.value;
    }
}
class ModuloGate extends NumberGate2Block{
    public getValue() : number{
        return this.inA.value % this.inB.value;
    }
}