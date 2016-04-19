abstract class BoolGateBlock extends AbstractBlock {
    
    protected inA : BoolInPin;
    
    public awake() {
        super.awake();
        this.inA = this.actor.getChild("A").getBehavior(BoolInPin);
        this.inA.init(this);
    }
    
    public onDestroy(){
        if(this.inA) this.inA.destroyPin();
        super.onDestroy();
    }
}

abstract class BoolGate2Block extends BoolGateBlock{
    
    protected inB : BoolInPin;
    
    public awake(){
        super.awake();
        this.inB = this.actor.getChild("B").getBehavior(BoolInPin);
        this.inB.init(this);
    }
    
    public onDestroy(){
        if(this.inB) this.inB.destroyPin();
        super.onDestroy();
    }
}

class NOTGate extends BoolGateBlock{
    public getValue() : boolean{
        return !this.inA.value;
    }
}
class ANDGate extends BoolGate2Block{
    public getValue() : boolean{
        return this.inA.value && this.inB.value;
    }
}
class ORGate extends BoolGate2Block{
    public getValue() : boolean{
        return this.inA.value || this.inB.value;
    }
}
class XORGate extends BoolGate2Block{
    public getValue() : boolean{
        return this.inA.value ? !this.inB.value : this.inB.value;
    }
}
class NANDGate extends BoolGate2Block{
    public getValue() : boolean{
        return !(this.inA.value && this.inB.value);
    }
}
class NORGate extends BoolGate2Block{
    public getValue() : boolean{
        return !(this.inA.value || this.inB.value);
    }
}
class XNORGate extends BoolGate2Block{
    public getValue() : boolean{
        return !(this.inA.value ? !this.inB.value : this.inB.value);
    }
}

/* REGISTER */
Sup.registerBehavior(  NOTGate );
Sup.registerBehavior(  ANDGate );
Sup.registerBehavior(   ORGate );
Sup.registerBehavior(  XORGate );
Sup.registerBehavior( NANDGate );
Sup.registerBehavior(  NORGate );
Sup.registerBehavior( XNORGate );
