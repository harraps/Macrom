class NumberInputBlock extends InteractibleBlock {
    
    public value : number = 0;
    
    public awake(){
        super.awake();
    }
    public update(){
        super.update();
        this.label.textRenderer.setText(this.value);
    }
    public interact() {
        
    }
    public getValue() : number{
        return this.value;
    }
    public setValue( value : number ){
        this.value = value;
    }
}

class PI_Block extends AbstractBlock{
    public getValue() : number{
        return Math.PI;
    }
}
class EulerBlock extends AbstractBlock{
    public getValue() : number{
        return Math.E;
    }
}
class SQRT2_Block extends AbstractBlock{
    public getValue() : number{
        return Math.SQRT2;
    }
}

/* REGISTER */
Sup.registerBehavior(NumberInputBlock);
Sup.registerBehavior(PI_Block);
Sup.registerBehavior(EulerBlock);
Sup.registerBehavior(SQRT2_Block);
