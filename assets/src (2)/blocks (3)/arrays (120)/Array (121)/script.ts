// arrays can be used both as lists(index:number) or as maps(index:string)

class ArraySet extends AbstractBlock {
    public getValue(){
        // we copy the array
        let array = this.inputs["ARRAY"].value.slice(0);
        let index = this.inputs["INDEX"].value;
        let value = this.inputs["VALUE"].value;
        if(index != null && value != null) array[index] = value;
        return array;
    }
    public interact(){}
}
class ArrayGet extends AbstractBlock {
    public getValue(){
        return this.inputs["ARRAY"].value[this.inputs["INDEX"].value];
    }
    public interact(){}
}

// allow to append an array to the end of an other one
class MergeGate extends AbstractBlock {
    public getValue(){
        return this.inputs["A"].value.concat(this.inputs["B"].value);
    }
    public interact(){}
}
// takes 16 values and make a array with them
class ConvergeGate extends AbstractBlock {
    public getValue(){
        let array = [];
        for( let id in this.inputs ){
            let value = this.inputs[id].value;
            if(value != null) array[array.length] = value;
        }
        return array;
    }
    public interact(){}
}
// takes an array and extract it's first 16 values
class DivergeGate extends AbstractBlock {
    // outputs should have names going from 0 to 15
    public getValue( output : OutPin ){
        let id = output.actor.getName();
        return this.inputs["IN"].value[id];
    }
    public interact(){}
}

/* REGISTER */
Sup.registerBehavior(ArraySet);
Sup.registerBehavior(ArrayGet);

Sup.registerBehavior(   MergeGate);
Sup.registerBehavior(ConvergeGate);
Sup.registerBehavior( DivergeGate);