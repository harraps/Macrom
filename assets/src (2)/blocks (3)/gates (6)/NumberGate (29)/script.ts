class OperatorGate extends AbstractBlock{
    private static add( a:number, b:number ):number{ return a+b; }
    private static sub( a:number, b:number ):number{ return a-b; }
    private static mul( a:number, b:number ):number{ return a*b; }
    private static div( a:number, b:number ):number{ return a/b; }
    private static mod( a:number, b:number ):number{ return a%b; }
    
    protected mod : number   = 0;
    protected fun : Function = OperatorGate.add;
    
    public getValue() : number{
        return this.fun(this.inputs["A"].value, this.inputs["B"].value);
    }
    public interact(){
        ++this.mod;
        if(this.mod >= 5) this.mod = 0;
        let text : string;
        switch(this.mod){ // +-×÷
            case 0 : this.fun=OperatorGate.add; text="+"  ; break;
            case 1 : this.fun=OperatorGate.sub; text="-"  ; break;
            case 2 : this.fun=OperatorGate.mul; text="×"  ; break;
            case 3 : this.fun=OperatorGate.div; text="÷"  ; break;
            case 4 : this.fun=OperatorGate.mod; text="MOD"; break;
        }
        if(this.labels["LABEL"]) this.labels["LABEL"].setText(text);
    }
}
class CompareGate extends AbstractBlock{
    private static  equals( a:number, b:number):boolean{ return a==b; }
    private static  differ( a:number, b:number):boolean{ return a!=b; }
    private static smaller( a:number, b:number):boolean{ return a<=b; }
    private static SMALLER( a:number, b:number):boolean{ return a< b; }
    private static greater( a:number, b:number):boolean{ return a>=b; }
    private static GREATER( a:number, b:number):boolean{ return a> b; }
    
    protected mod : number   = 0;
    protected fun : Function = CompareGate.equals;
    
    public getValue() : number{
        return this.fun(this.inputs["A"].value, this.inputs["B"].value);
    }
    public interact(){
        ++this.mod;
        if(this.mod >= 6) this.mod = 0;
        let text : string;
        switch(this.mod){
            case 0 : this.fun=CompareGate. equals; text="="; break;
            case 1 : this.fun=CompareGate. differ; text="≠"; break;
            case 2 : this.fun=CompareGate.smaller; text="≤"; break;
            case 3 : this.fun=CompareGate.SMALLER; text="<"; break;
            case 4 : this.fun=CompareGate.greater; text="≥"; break;
            case 5 : this.fun=CompareGate.GREATER; text=">"; break;
        }
        if(this.labels["LABEL"]) this.labels["LABEL"].setText(text);
    }
}
class AbsoluteGate extends AbstractBlock{
    private static nabs( value:number ):number{ return -Math.abs(value); }
    
    protected mod : boolean  = false;
    protected fun : Function = Math.abs;
    
    public getValue() : number{
        return Math.abs(this.inputs["IN"].value);
    }
    public interact(){
        this.mod = !this.mod;
        this.fun = this.mod ? AbsoluteGate.nabs : Math.abs;
        if(this.labels["LABEL"]) this.labels["LABEL"].setText(this.mod ? "-|x|" : "|x|");
    }
}
class RoundGate extends AbstractBlock{
    
    protected mod : number   = 0;
    protected fun : Function = Math.round;
    
    public getValue() : number{
        return this.fun(this.inputs["IN"].value);
    }
    public interact(){
        ++this.mod;
        if(this.mod >= 3) this.mod = 0;
        let text : string;
        switch(this.mod){ // ≈↕↑↓
            case 0 : this.fun=Math.round; text="≈↕"; break;
            case 1 : this.fun=Math.floor; text="≈↓"; break;
            case 2 : this.fun=Math.ceil ; text="≈↑"; break;
        }
        if(this.labels["LABEL"]) this.labels["LABEL"].setText(text);
    }
}
class ExtremeGate extends AbstractBlock{
    
    protected mod : boolean  = false;
    protected fun : Function = Math.min;
    
    public getValue() : number{
        let values = [];
        for( let id in this.inputs ){
            if(this.inputs[id].value != null) values[values.length] = this.inputs[id].value;
        }
        return this.fun.apply(null, values);
    }
    public interact(){
        this.mod = !this.mod;
        this.fun = this.mod ? Math.max : Math.min;
        if(this.labels["LABEL"]) this.labels["LABEL"].setText(this.mod ? "MAX" : "MIN");
    }
}
class TrigonometryGate extends AbstractBlock{
    
    protected mod : number   = 0;
    protected fun : Function = Math.sin;
    
    public getValue() : number{
        return this.fun(this.inputs["IN"].value);
    }
    public interact(){
        ++this.mod;
        if(this.mod >= 6) this.mod = 0;
        let text : string;
        switch(this.mod){
            case 0 : this.fun=Math. sin; text= "SIN"; break;
            case 1 : this.fun=Math. cos; text= "COS"; break;
            case 2 : this.fun=Math. tan; text= "TAN"; break;
            case 3 : this.fun=Math.asin; text="ASIN"; break;
            case 4 : this.fun=Math.acos; text="ACOS"; break;
            case 5 : this.fun=Math.atan; text="ATAN"; break;
        }
        if(this.labels["LABEL"]) this.labels["LABEL"].setText(text);
    }
}
class ATAN2_Gate extends AbstractBlock{
    public getValue() : number{
        return Math.atan2(this.inputs["Y"].value, this.inputs["X"].value);
    }
    public interact(){}
}

class PowerGate extends AbstractBlock{
    public getValue() : number{
        return Math.pow(this.inputs["X"].value, this.inputs["Y"].value);
    }
    public interact(){}
}
class SquareGate extends AbstractBlock{
    private static square( value:number ):number{ return value*value; }
    
    protected mod : boolean  = false;
    protected fun : Function = SquareGate.square;
    
    public getValue() : number{
        return Math.abs(this.inputs["IN"].value);
    }
    public interact(){
        this.mod = !this.mod;
        this.fun = this.mod ? SquareGate.square : Math.sqrt;
        if(this.labels["LABEL"]) this.labels["LABEL"].setText(this.mod ? "x²" : "√x"); // √²
    }
}

/* REGISTER */
Sup.registerBehavior(OperatorGate);
Sup.registerBehavior(AbsoluteGate);

Sup.registerBehavior(  RoundGate);
Sup.registerBehavior(ExtremeGate);

Sup.registerBehavior(TrigonometryGate);
Sup.registerBehavior(      ATAN2_Gate);

Sup.registerBehavior( PowerGate);
Sup.registerBehavior(SquareGate);

