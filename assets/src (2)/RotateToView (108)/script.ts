class RotateToView extends Sup.Behavior {
    public update() {
        this.actor.setOrientation(Game.player.actor.getOrientation());
    }
}
Sup.registerBehavior(RotateToView);
