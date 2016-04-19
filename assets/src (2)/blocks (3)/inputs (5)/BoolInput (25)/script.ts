
/* BOOLEAN */
class ButtonBlock extends InteractibleBlock{
    
    protected static TIME : number = Sup.Game.getFPS(); // 1 second
    protected timer : number = 0;
    
    public update(){
        super.update();
        // if timer is set, we decrement it
        if( this.timer > 0 ){
            --this.timer;
            // if timer is over
            if( this.timer <= 0 ) this.interactible.setLocalY(0);
        }
    }
    public interact(){
        this.timer = ButtonBlock.TIME;
        this.interactible.setLocalY(-0.1);
    }
    public getValue() : boolean{
        return this.timer > 0;
    }
    
}
class ToggleBlock extends InteractibleBlock{
    
    protected value : boolean = false;
    public awake(){
        super.awake();
        this.anim(); // toggle the switch
    }
    public interact(){
        this.value = !this.value;
        this.anim(); // toggle the switch
    }
    public getValue() : boolean{
        return this.value;
    }
    private anim(){
        let angle = 0.25*Math.PI;
        if( this.value ) angle = -angle;
        this.interactible.setLocalEulerX(angle);
    }
}

/* REGISTER */
Sup.registerBehavior(ButtonBlock);
Sup.registerBehavior(ToggleBlock);