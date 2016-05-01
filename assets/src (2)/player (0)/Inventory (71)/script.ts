interface IGroup{
    name  : string,
    paths : IPath[]
}
interface IPath{
    name : string,
    path : string
}
interface IhudElement{
    parent   : Sup.Actor;
    children : Sup.Actor[];
}
class Inventory {
    
    // we define the block available to use
    public static BLOCKS : IGroup[];
    
    public static MAX : number  = 10;
    
    public static initBLOCKS() {
        Inventory.BLOCKS = [];
        let root_name = "BLOCKS";
        // we recover the hierachy of blocks defined in the "BLOCKS" directory
        let root : any = Sup.get(root_name);
        for( let group_name of root.children ){
            let paths = [];
            let group : any = Sup.get(root_name+"/"+group_name);
            if(group.type == "folder"){
                for( let block_name of group.children ){
                    paths.push({name : block_name, path : root_name+"/"+group_name+"/"+block_name});
                }
                Inventory.BLOCKS.push({name: group_name, paths: paths});
            }
        }
    }
    
    public scale   : number = 0.2;
    public space   : number = 0.4;
    public padding : number = 0.05;
    
    // the list of blocks the player can place in the world
    protected prefabs : IPath[] = [];
    protected pointed : number  = 1; // selected block (1 is first, 0 is last)
    // define which group of blocks to display in the menu
    protected currentGroup  : number = 0;
    protected contentLength : number = 0;
    
    protected camera : Sup.Camera;   // HUD camera
    protected ray    : Sup.Math.Ray; // a ray to interact with the interface
    protected holded : number;       // id of the block being dragged
    
    protected palette    : IhudElement; // palette display the blocks, the player can place in the world
    protected categories : IhudElement; // categories of blocks
    protected content    : IhudElement; // content of the selected category
    
    public constructor(){
        let HUD = Sup.getActor("HUD");
        this.camera = HUD.camera;
        this.ray = new Sup.Math.Ray();
        // we create the palette
        this.palette = {
            parent   : HUD.getChild("PALETTE"),
            children : []
        };
        // we create the array of categories
        this.categories = {
            parent   : HUD.getChild("CATEGORIES"),
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
        initElement(this.palette, 0, -this.space * 4.5, false);
        let padding = this.space * 4.5;
        for( let i=1; i<Inventory.MAX; ++i ){
            initElement(this.palette, i, padding, false);
            padding -= this.space;
        }
        this.setColorCurrent("yellow");
        // we create
        padding = this.space * Inventory.BLOCKS.length * 0.5
        for( let i=0; i<Inventory.BLOCKS.length; ++i ){
            initElement(this.categories, i, padding, true);
            padding -= this.space;
        }
        
        this.createContent();
    }
    
    public update(){
        let scale = this.camera.getOrthographicScale();
        let ratio = this.camera.getWidthToHeightRatio();
        let pos = scale * (ratio - this.padding) * 0.5;
        this.palette   .parent.setLocalX(-pos );
        this.categories.parent.setLocalX( pos );
    }
    
    public updateInventory(){
        let cycle = 0;
        // we recover the movement of the mouse wheel
        if(Sup.Input.isMouseButtonDown(5)) --cycle;
        if(Sup.Input.isMouseButtonDown(6)) ++cycle;
        
        this.content.parent.moveY(cycle*0.04);
        let pos = this.content.parent.getLocalY();
        let length = this.contentLength * this.space * 0.5;
        if(pos > length) this.content.parent.setLocalY(length);
        else if(pos < 0) this.content.parent.setLocalY(0);
        
        this.ray.setFromCamera(this.camera, Sup.Input.getMousePosition());
        
        // if the user is dragging a block from content to palette
        if( this.holded != null ){
            if(Sup.Input.wasMouseButtonJustReleased(0)){
                let hit = this.ray.intersectActors(this.palette.children)[0];
                if(hit){
                    let path = Inventory.BLOCKS[this.currentGroup].paths[this.holded];
                    this.setPrefab( parseInt(hit.actor.getName()), path );
                    this.holded = null;
                }
            }
        }else{ // if the player is not dragging anything
            // if the player just pressed the left click
            if(Sup.Input.wasMouseButtonJustPressed(0)){
                let hit = this.ray.intersectActors(this.categories.children)[0];
                if(hit){
                    this.currentGroup = parseInt(hit.actor.getName());
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
        let pos = (scale - this.padding) * 0.5;
        this.content.parent.setLocalPosition(0,pos,-1.1);
        this.content.parent.setLocalScale(this.scale,this.scale,1);
        let padding = 0;
        let group = Inventory.BLOCKS[this.currentGroup];
        for( let i=0; i<group.paths.length; ++i ){
            let actor = new Sup.Actor( ""+i, this.content.parent );
            actor.setLocalPosition(0,padding,0);
            actor.setLocalScale(1,1,1);
            new Sup.TextRenderer( actor, group.paths[i].name, "res/font", {alignment:"center"} );
            this.content.children.push(actor);
            padding -= this.space;
        }
        this.contentLength = -padding;
    }
    
    public setPrefab( id : number, path : IPath ){
        // if the id is within the range [0-9]
        if( 0 <= id && id < Inventory.MAX ){
            this.prefabs[id] = path;
            
            let label = ""+id+". ";  // id of the block
            label += path ? path.name : ""; // if path not null, display block name
            // we display the block name
            this.palette.children[id].textRenderer.setText(label);
        }
    }
    
    public setColorCurrent(color : string){
        this.palette.children[this.pointed].textRenderer.setColor(Game.getColor(color));
    }
    public previous(){
        this.setColorCurrent("white");
        --this.pointed;
        // if we're out of range, we return to the max value (9 <- 0)
        if(this.pointed < 0) this.pointed = Inventory.MAX-1;
        this.setColorCurrent("yellow");
    }
    public next(){
        this.setColorCurrent("white");
        ++this.pointed;
        // if we're out of range, we return to the min value (9 -> 0)
        if(this.pointed >= Inventory.MAX) this.pointed = 0;
        this.setColorCurrent("yellow");
    }
    public cycle( direction : number ){
        this.setColorCurrent("white");
        this.pointed += direction;
        // we keep the value within the range [0-9]
        if(this.pointed < 0) this.pointed = Inventory.MAX-1;
        else if(this.pointed >= Inventory.MAX) this.pointed = 0;
        this.setColorCurrent("yellow");
    }
    public setCurrent( id : number ){
        // if the value is within the range [0-9]
        if( 0 <= id && id < Inventory.MAX ){
            this.setColorCurrent("white");
            this.pointed = id;
            this.setColorCurrent("yellow");
        }
    }
    public getCurrent() : IPath{
        return this.prefabs[this.pointed];
    }
    
    public set PaletteVisible( visible : boolean ){
        this.palette.parent.setVisible(visible);
    }
    public set InventoryVisible( visible : boolean ){
        this.categories.parent.setVisible(visible);
        this.content   .parent.setVisible(visible);
    }
    
}
Inventory.initBLOCKS();