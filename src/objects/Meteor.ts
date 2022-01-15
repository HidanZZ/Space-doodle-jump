import Phaser from "phaser";

export default class Meteor extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, 'meteor');
        this.setScale(1.5)
       this.createAnims()
       this.scene=scene;
    //    this.anims.play('explo')
		
	}
    preUpdate(t: number,dt: number) {
        super.preUpdate(t,dt);
        this.rotation +=0.01
        
    }
    createAnims() {
        this.anims.create({
            key: 'explo',
            frames: this.anims.generateFrameNumbers('explo', {

                start: 0,
                end: 70,
            }),
            frameRate: 60,
            
        });
    }
    explode(){
    this.anims.play('explo')
    this.on('animationcomplete', () => {
        this.scene.platformGroup.killAndHide(this);
        this.scene.platformGroup.remove(this);
        
    })

    }
    reset(){
        this.setTexture('meteor')
    }
}