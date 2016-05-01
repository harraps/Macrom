abstract class BoolGateBlock extends InteractibleBlock {
    
    protected inA : BoolInPin;
    
    public awake() {
        super.awake();
        this.inA = this.actor.getChild("A").getBehavior(BoolInPin);
        this.inA.init(this);
    }
    public interact(){
        
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

class BoolGate1 extends BoolGateBlock{
    public modifier : boolean = false;
    public interact(){
        this.modifier = !this.modifier;
        if(this.label) this.label.textRenderer.setText(this.modifier ? "NOT" : "BUF");
    }
    public getValue() : boolean{
        if(this.modifier) return !this.inA.value;
        return this.inA.value;
    }
}

class BoolGate2 extends BoolGate2Block{
    public modifier : number = 0;
    public interact(){
        ++this.modifier;
        // if we bypass the max value
        if(this.modifier > 6) this.modifier = 0;
        if(this.label){
            let text = this.label.textRenderer;
            switch(this.modifier){
                case 0 : text.setText("AND" ); break;
                case 1 : text.setText("OR"  ); break;
                case 2 : text.setText("XOR" ); break;
                case 3 : text.setText("NAND"); break;
                case 4 : text.setText("NOR" ); break;
                case 5 : text.setText("XNOR"); break;
            }
        }
    }
    public getValue() : boolean{
        switch(this.modifier){
            case 0 : return this.inA.value && this.inB.value;
            case 1 : return this.inA.value || this.inB.value;
            case 2 : return this.inA.value ? !this.inB.value : this.inB.value;
            case 3 : return !(this.inA.value && this.inB.value);
            case 4 : return !(this.inA.value || this.inB.value);
            case 5 : return !(this.inA.value ? !this.inB.value : this.inB.value);
        }
    }
}

class BUF_Gate extends BoolGateBlock{
    public getValue() : boolean{
        return this.inA.value;
    }
}
class NOT_Gate extends BoolGateBlock{
    public getValue() : boolean{
        return !this.inA.value;
    }
}
class AND_Gate extends BoolGate2Block{
    public getValue() : boolean{
        return this.inA.value && this.inB.value;
    }
}
class OR_Gate extends BoolGate2Block{
    public getValue() : boolean{
        return this.inA.value || this.inB.value;
    }
}
class XOR_Gate extends BoolGate2Block{
    public getValue() : boolean{
        return this.inA.value ? !this.inB.value : this.inB.value;
    }
}
class NAND_Gate extends BoolGate2Block{
    public getValue() : boolean{
        return !(this.inA.value && this.inB.value);
    }
}
class NOR_Gate extends BoolGate2Block{
    public getValue() : boolean{
        return !(this.inA.value || this.inB.value);
    }
}
class XNOR_Gate extends BoolGate2Block{
    public getValue() : boolean{
        return !(this.inA.value ? !this.inB.value : this.inB.value);
    }
}

class ToggleLatch extends BoolGateBlock{
    
    protected wasToggled : boolean;
    protected value : boolean;
    
    public interact(){
        
    }
    
    public update(){
        super.update();
        // if the pin A is true
        if( this.inA.value ){
            // if the pin has just changed of value, we toggle the value
            if(!this.wasToggled) this.value = !this.value;
            // the value has already been toggled
            this.wasToggled = true;
        }else{
            // the pin is now false, we can register the next toggle
            this.wasToggled = false;
        }
    }
    public getValue() : boolean{
        return this.value;
    }
}

class RSnorLatch extends AbstractBlock{
    
    protected outQ : BoolOutPin;
    protected outN : BoolOutPin;
    protected inR  : BoolInPin;  // set value to true
    protected inS  : BoolInPin;  // set value to false
    
    protected value : boolean;
    
    public awake(){
        super.awake();
        this.outQ = this.actor.getChild("Q").getBehavior(BoolOutPin);
        this.outN = this.actor.getChild("N").getBehavior(BoolOutPin);
        this.inR  = this.actor.getChild("R").getBehavior(BoolInPin );
        this.inS  = this.actor.getChild("S").getBehavior(BoolInPin );
        this.outQ.init(this);
        this.outN.init(this);
        this.inR .init(this);
        this.inS .init(this);
    }
    
    public update(){
        super.update();
        // if IN_A is true, the value is set to true
        if( this.inR.value ) this.value = true;
        // if IN_B is true, the value is set to false
        else if( this.inS.value ) this.value = false;
    }
    
    public onDestroy(){
        if(this.outQ) this.outQ.destroyPin();
        if(this.outN) this.outN.destroyPin();
        if(this.inR ) this.inR .destroyPin();
        if(this.inS ) this.inS .destroyPin();
        super.onDestroy();
    }
    public getValue( pin : BoolOutPin ) : boolean{
        // if the pin calling the value is OUT_A, we return the value as is
        if( pin == this.outQ ) return this.value;
        // if it's not OUT_A, we return NOT value
        return !this.value;
    }
}

/* REGISTER */
Sup.registerBehavior(BoolGate1);
Sup.registerBehavior(BoolGate2);

Sup.registerBehavior(  BUF_Gate );
Sup.registerBehavior(  NOT_Gate );
Sup.registerBehavior(  AND_Gate );
Sup.registerBehavior(   OR_Gate );
Sup.registerBehavior(  XOR_Gate );
Sup.registerBehavior( NAND_Gate );
Sup.registerBehavior(  NOR_Gate );
Sup.registerBehavior( XNOR_Gate );

Sup.registerBehavior( ToggleLatch );
Sup.registerBehavior(  RSnorLatch );


