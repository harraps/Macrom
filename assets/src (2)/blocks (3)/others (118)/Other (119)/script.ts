// if "IF" is true, return "A", else return "B"
class ConditionBlock extends AbstractBlock {
    public getValue() {
        return this.inputs["IF"].value ? this.inputs["A"].value : this.inputs["B"].value;
    }
    public interact() {}
}


/* REGISTER */
Sup.registerBehavior(ConditionBlock);
