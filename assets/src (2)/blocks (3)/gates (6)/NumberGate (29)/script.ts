abstract class NumberGateBlock extends InteractibleBlock {
    
    protected inA : NumberInPin;
    
    public awake() {
        super.awake();
        this.inA = this.actor.getChild("A").getBehavior(NumberInPin);
        this.inA.init(this);
    }
    public interact(){
        
    }
    public onDestroy(){
        if(this.inA) this.inA.destroyPin();
        super.onDestroy();
    }
}

abstract class NumberGate2Block extends NumberGateBlock{
    
    protected inB : NumberInPin;
    
    public awake(){
        super.awake();
        this.inB = this.actor.getChild("B").getBehavior(NumberInPin);
        this.inB.init(this);
    }
    public onDestroy(){
        if(this.inB) this.inB.destroyPin();
        super.onDestroy();
    }
}

class ABS_Gate extends NumberGateBlock{
    public getValue() : number{
        return Math.abs(this.inA.value);
    }
}

class RoundGate1 extends NumberGateBlock{
    public modifier : number = 0;
    protected func : Function = Math.round;
    public interact(){
        ++this.modifier;
        if(this.modifier > 3) this.modifier = 0;
        let text = this.label ? this.label.textRenderer : {setText(text){}};
        switch(this.modifier){
            case 0 : text.setText("Round"); this.func = Math.round; break;
            case 1 : text.setText("Floor"); this.func = Math.floor; break;
            case 2 : text.setText("Ceil" ); this.func = Math.ceil ; break;
        }
    }
    public getValue() : number{
        return this.func(this.inA.value);
    }
}

class TrigoGate extends NumberGateBlock{
    public modifier : number = 0;
    protected func : Function = Math.sin;
    public interact(){
        ++this.modifier;
        if(this.modifier > 6) this.modifier = 0;
        let text = this.label ? this.label.textRenderer : {setText(text){}};
        switch(this.modifier){
            case 0 : text.setText( "SIN"); this.func = Math. sin; break;
            case 1 : text.setText( "COS"); this.func = Math. cos; break;
            case 2 : text.setText( "TAN"); this.func = Math. tan; break;
            case 3 : text.setText("ASIN"); this.func = Math.asin; break;
            case 4 : text.setText("ACOS"); this.func = Math.acos; break;
            case 5 : text.setText("ATAN"); this.func = Math.atan; break;
        }
    }
    public getValue() : number{
        return this.func(this.inA.value);
    }
}

class ATAN2_Gate extends NumberGate2Block{
    public getValue() : number{
        return Math.atan2(this.inA.value, this.inB.value);
    }
}

class RoundGate extends NumberGateBlock{
    public getValue() : number{
        return Math.round(this.inA.value);
    }
}

class SIN_Gate extends NumberGateBlock{
    public getValue() : number{
        return Math.sin(this.inA.value);
    }
}
class COS_Gate extends NumberGateBlock{
    public getValue() : number{
        return Math.cos(this.inA.value);
    }
}
class TAN_Gate extends NumberGateBlock{
    public getValue() : number{
        return Math.tan(this.inA.value);
    }
}
class ASIN_Gate extends NumberGateBlock{
    public getValue() : number{
        return Math.asin(this.inA.value);
    }
}
class ACOS_Gate extends NumberGateBlock{
    public getValue() : number{
        return Math.asin(this.inA.value);
    }
}
class ATAN_Gate extends NumberGateBlock{
    public getValue() : number{
        return Math.atan(this.inA.value);
    }
}

class ADD_Gate extends NumberGate2Block{
    public getValue() : number{
        return this.inA.value + this.inB.value;
    }
}
class SUB_Gate extends NumberGate2Block{
    public getValue() : number{
        return this.inA.value - this.inB.value;
    }
}
class MUL_Gate extends NumberGate2Block{
    public getValue() : number{
        return this.inA.value * this.inB.value;
    }
}
class DIV_Gate extends NumberGate2Block{
    public getValue() : number{
        return this.inA.value / this.inB.value;
    }
}
class MOD_Gate extends NumberGate2Block{
    public getValue() : number{
        return this.inA.value % this.inB.value;
    }
}

/* REGISTER */
Sup.registerBehavior( SIN_Gate);
Sup.registerBehavior( COS_Gate);
Sup.registerBehavior( TAN_Gate);
Sup.registerBehavior(ASIN_Gate);
Sup.registerBehavior(ACOS_Gate);
Sup.registerBehavior(ATAN_Gate);

Sup.registerBehavior(SUB_Gate);
Sup.registerBehavior(MUL_Gate);
Sup.registerBehavior(DIV_Gate);
Sup.registerBehavior(MOD_Gate);

Sup.registerBehavior(ADD_Gate);
Sup.registerBehavior(SUB_Gate);
Sup.registerBehavior(MUL_Gate);
Sup.registerBehavior(DIV_Gate);
Sup.registerBehavior(MOD_Gate);



