import Phaser from "phaser";
import config from '../config';

export default class Slime extends Phaser.GameObjects.Sprite {
    falling: boolean=false;
    start: number;
    end: number;
    init: number=-150;
    jumpTimes: number;
	constructor(scene, x, y,cursor) {
		super(scene, x, y, 'slime');
        this.setDepth(99)
       this.createAnims()
       this.cursor=cursor;
       this.start=y
       this.jumpTimes=1
    //    this.anims.play('explo')
		
	}
    preUpdate(t: number,dt: number) {
        super.preUpdate(t,dt);
        if (this.cursor.left.isDown && this.x>0)
        {
            this.body.setVelocityX(-200);
            this.flipX=true;
        }
        else if (this.cursor.right.isDown && this.x<config.scale.width)
        {
            this.body.setVelocityX(200);
            this.flipX=false;
        }else{
            this.body.setVelocityX(0)
        }
        if (this.y<0) {
            console.log('fff');
            
            this.y=0
            
        }
        
    }
    getJumpTimes(){
        return this.jumpTimes
    }
    jump(){
        if (this.jumpTimes<3) {
            this.jumpTimes++
        }
        
        this.end=this.y
        let jump=this.start? this.end-this.start:this.init
       
        
        
        this.body.setVelocityY((jump>0? jump*-1:jump)-20);
        this.anims.play('jump');
        this.start=this.y + (jump>0? jump*-1:jump)
       
    }
    jump2(){
        if (this.jumpTimes>0) {
            
            this.body.setVelocityY(-300)
            this.jumpTimes--
        }
        
    }
    isFalling(){
        return this.body.velocity.y>0
    }
    createAnims() {
        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('slime', {

                start: 0,
                end: 4,
            }),
            frameRate: 15,
            
        });
    }
}