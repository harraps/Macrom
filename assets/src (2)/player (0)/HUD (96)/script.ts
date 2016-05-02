class HUD {
    
    public static scale   : number = 0.2;
    public static space   : number = 0.4;
    public static padding : number = 0.05;
    
    public player : Player;
    
    protected contentLength : number;
    
    protected camera : Sup.Camera;   // HUD camera
    protected ray    : Sup.Math.Ray; // a ray to interact with the interface
    protected holded : number;       // id of the block being dragged
    
    public palette    : IhudElement; // palette display the blocks, the player can place in the world
    public categories : IhudElement; // categories of blocks
    public content    : IhudElement; // content of the selected category
    
    public constructor(player : Player) {
        this.player = player;
        
        let hudActor = Sup.getActor("HUD");
        this.camera = hudActor.camera;
        this.ray = new Sup.Math.Ray();
        // we create the palette
        this.palette = {
            parent   : hudActor.getChild("PALETTE"),
            children : []
        };
        // we create the array of categories
        this.categories = {
            parent   : hudActor.getChild("CATEGORIES"),
            children : []
        };
        // we create a function to place our HUD elements
        let initElement = function( hudElement : IhudElement, id : number, pos : number, rightSide : boolean ){
            let actor = new Sup.Actor( ""+id, hudElement.parent );
            actor.setLocalPosition(0, pos, 0);
            actor.setLocalScale(1,1,1);
            let text = rightSide ? Inventory.BLOCKS[id].name : ""+id+". ";
            let side = rightSide ? "right" : "left";
            new Sup.TextRenderer( actor, text, "res/font", {alignment:side} );
            hudElement.children[id] = actor;
        }
        // we create the labels of the palette, we already know there is 10 of them
        initElement(this.palette, 0, -HUD.space * 4.5, false);
        let padding = HUD.space * 4.5;
        for( let i=1; i<Inventory.MAX; ++i ){
            initElement(this.palette, i, padding, false);
            padding -= HUD.space;
        }
        this.setColorCurrent("yellow");
        // we create the categories pane
        padding = HUD.space * Inventory.BLOCKS.length * 0.5
        for( let i=0; i<Inventory.BLOCKS.length; ++i ){
            initElement(this.categories, i, padding, true);
            padding -= HUD.space;
        }
        // we create the content pane
        this.createContent();
        
        // we start in build mode
        this.PaletteVisible   = true;
        this.InventoryVisible = false;
    }
    
    public update(){
        let scale = this.camera.getOrthographicScale();
        let ratio = this.camera.getWidthToHeightRatio();
        let pos = scale * (ratio - HUD.padding) * 0.5;
        this.palette   .parent.setLocalX(-pos );
        this.categories.parent.setLocalX( pos );
    }
    
    public updateHUD(){
        let cycle = 0;
        // we recover the movement of the mouse wheel
        if(Sup.Input.isMouseButtonDown(5)) --cycle;
        if(Sup.Input.isMouseButtonDown(6)) ++cycle;
        
        this.content.parent.moveY(cycle*0.04);
        let pos = this.content.parent.getLocalY();
        let length = this.contentLength * HUD.space * 0.5;
        if(pos > length) this.content.parent.setLocalY(length);
        else if(pos < 0) this.content.parent.setLocalY(0);
        
        this.ray.setFromCamera(this.camera, Sup.Input.getMousePosition());
        
        // if the user is dragging a block from content to palette
        if( this.holded != null ){
            if(Sup.Input.wasMouseButtonJustReleased(0)){
                let hit = this.ray.intersectActors(this.palette.children)[0];
                if(hit){
                    let path = Inventory.BLOCKS[this.player.inven.currentGroup].paths[this.holded];
                    this.player.inven.setPrefab( parseInt(hit.actor.getName()), path );
                    this.holded = null;
                }
            }
        }else{ // if the player is not dragging anything
            // if the player just pressed the left click
            if(Sup.Input.wasMouseButtonJustPressed(0)){
                let hit = this.ray.intersectActors(this.categories.children)[0];
                if(hit){
                    this.player.inven.currentGroup = parseInt(hit.actor.getName());
                    this.content.parent.destroy();
                    this.createContent();
                    return;
                }
                hit = this.ray.intersectActors(this.content.children)[0];
                if(hit){
                    this.holded = parseInt(hit.actor.getName());
                }
            }
        }
    }
    public createContent(){
        // we create a new array to store our actors
        this.content = {
            parent   : new Sup.Actor("CONTENT"),
            children : []
        };
        this.content.parent.setParent(this.camera.actor);
        let scale = this.camera.getOrthographicScale();
        let ratio = this.camera.getWidthToHeightRatio();
        let pos = (scale - HUD.padding) * 0.5;
        this.content.parent.setLocalPosition(0,pos,-1.1);
        this.content.parent.setLocalScale(HUD.scale,HUD.scale,1);
        let padding = 0;
        let group = Inventory.BLOCKS[this.player.inven.currentGroup];
        for( let i=0; i<group.paths.length; ++i ){
            let actor = new Sup.Actor( ""+i, this.content.parent );
            actor.setLocalPosition(0,padding,0);
            actor.setLocalScale(1,1,1);
            new Sup.TextRenderer( actor, group.paths[i].name, "res/font", {alignment:"center"} );
            this.content.children.push(actor);
            padding -= HUD.space;
        }
        this.contentLength = -padding;
    }
    public setColorCurrent(color : string){
        this.palette.children[this.player.inven.pointed].textRenderer.setColor(Game.getColor(color));
    }
    public set PaletteVisible( visible : boolean ){
        this.palette.parent.setVisible(visible);
    }
    public set InventoryVisible( visible : boolean ){
        this.categories.parent.setVisible(visible);
        this.content   .parent.setVisible(visible);
    }
}
