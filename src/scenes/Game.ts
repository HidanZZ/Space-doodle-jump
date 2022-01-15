import Phaser from 'phaser';
import config from '../config';
import Meteor from '../objects/Meteor';
import Slime from '../objects/Slime';
import Highscore from '../objects/Highscore';

export default class Demo extends Phaser.Scene {
  background:Phaser.GameObjects.TileSprite;
  platformPool:Phaser.GameObjects.Group
  platformGroup:Phaser.GameObjects.Group
  platformAdded:number = 0;
  nextPlatformDistance:number = 0;
  slime:Slime;
  startText:Phaser.GameObjects.Text;
  started:boolean = false;
  highscoreContainer:Highscore;
  highscoreVisible:boolean = false;
  highscoreButton:Phaser.GameObjects.Image;
  scoreCounter:Phaser.Time.TimerEvent;
  score:number = 0;
  scoreText:Phaser.GameObjects.Text;
  error:Phaser.GameObjects.Text;
  gameoverText:Phaser.GameObjects.Text;
  gameOver:boolean = false;
  userInput:Phaser.GameObjects.DOMElement
  username:string|null;
  uinput:HTMLInputElement|null;
  userText:Phaser.GameObjects.Text;
  highscoreText:Phaser.GameObjects.Text;
  data:any;
  constructor() {
    super('GameScene');
  }

  preload() {
    // this.load.image('logo', 'assets/phaser3-logo.png');
  }
  init(data:any=null){
    this.username=localStorage.getItem('username')
    // console.log(this.isEmpty({score:0}));
    this.data=data
    if (!this.isEmpty(data)) {
      console.log('ddd');
      
      let high=localStorage.getItem('highscore')
      if (high) {
        localStorage.setItem('highscore', this.score>parseInt(high)?this.score.toString():high)
      }else{
        localStorage.setItem('highscore',this.score.toString())
      }
      
    }
  }
   isEmpty(obj:any):boolean {
    return Object.keys(obj).length === 0;
}
  create() {
    this.cameras.main.fadeIn(1000, 0, 0, 0);

    this.background=this.add.tileSprite(0,0,0,0,'stars').setOrigin(0)
    this.gameOver=false
    this.started=false
    
    this.highscoreButton=this.add.image(config.scale.width-30,20,'high').setScale(2).setInteractive({ useHandCursor: true }).on('pointerdown',()=>{
      if (this.highscoreVisible) {
        console.log('sss');
        
        this.tweens.add({
          targets: this.highscoreContainer,
          x: 500, // '+=100'
          ease: "Cubic", // 'Cubic', 'Elastic', 'Bounce', 'Back'
          duration: 1000,
          repeat: 0,
          yoyo: false,
          onComplete:()=>{
            this.highscoreVisible=false
          }
          });
          
      }else{
        this.tweens.add({
          targets: this.highscoreContainer,
          x: 0, // '+=100'
          ease: "Cubic", // 'Cubic', 'Elastic', 'Bounce', 'Back'
          duration: 1000,
          repeat: 0,
          yoyo: false,
          onComplete:()=>{

          this.highscoreVisible=true

          }
          });

         
      }
       
    })
    let high=localStorage.getItem('highscore')
    this.highscoreText=this.add.text(20,20,'Highscore : '+(high? high:0),{
      fontFamily:'kong', 
      fontSize:'10px',
      color:'white'
    }).setOrigin(0).setDepth(99)
    if (this.username) {
      this.userText=this.add.text(20,35,'Username : '+this.username,{
        fontFamily:'kong', 
        fontSize:'10px',
        color:'white'
      }).setOrigin(0).setDepth(99)
    }
    
    this.platformGroup = this.add.group({
      removeCallback: (platform) => {
          platform.scene.platformPool.add(platform);
      },
  });

  this.platformPool = this.add.group({
      removeCallback: (platform) => {
          platform.scene.platformGroup.add(platform);
      },
  });
  this.initPlatform()
    
    
   
    this.input.keyboard.on('keydown', (event) => {
      if(event.code=='Space'){
        console.log(this.gameOver);

        
        if (!this.started && !this.highscoreVisible) {
        
          this.start()
        }
        if (this.gameOver) {
          this.inputCheck()
       
          
        }
      }
     
  });
  this.startText=this.add.text(config.scale.width/2,config.scale.height/2,'Press space to start',{
    fontFamily:'kong', 
    fontSize:'16px',
    color:'white'
  }).setOrigin(0.5).setDepth(99)
  this.highscoreContainer = new Highscore(this, 500,0,this.username,this.data.score).setDepth(500)
  
  this.add.existing(this.highscoreContainer)
    // this.add.image(200,200,'meteor')
   

  
  }
  inputCheck () {
    var letterNumber = /.*\B@(?=\w{5,64}\b)[a-zA-Z0-9]+(?:_[a-zA-Z0-9]+)*.*/;
   if (this.username) {
    this.cameras.main.fadeOut(1000, 0, 0, 0);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      this.scene.start('GameScene',{score: this.score});
    });
   }else{
    if (this.uinput?.value.trim() === "") {
      this.showError('username cannot be empty')
  } else if (!this.uinput?.value.match(letterNumber)) {
      this.showError('invalid telegram username')
  } else {
      // if (error) error.destroy()
      console.log('sss');
      
      localStorage.setItem('username', this.uinput.value.trim())
       this.cameras.main.fadeOut(1000, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
          this.scene.start('GameScene',{score: this.score});
        });
      
    
  }
   }
    
  }
  showError(text:string) {
    if (this.error) this.error.destroy()
    this.error = this.add.text(config.scale.width/2,config.scale.height-100,text,{
      fontFamily:'kong', 
      fontSize:'16px',
      color:'red'
    }).setOrigin(0.5).setDepth(99)
}
  start(){
    this.score=0
    this.gameOver=false
    this.startText.setVisible(false)
    if(this.username)this.userText.setVisible(false)
    this.highscoreText.setVisible(false)
    this.highscoreButton.setVisible(false)
    this.scoreText=this.add.text(config.scale.width-30,20,`SCORE: ${this.score}`,{ 
      fontFamily:'kong', 
    fontSize:'10px',
    color:'white'}
    ).setOrigin(0)
    this.slime=new Slime(this,200,50,this.input.keyboard.createCursorKeys());
    this.add.existing(this.slime)
    this.physics.add.existing(this.slime)
    this.slime.body.setSize(this.slime.width*0.8,this.slime.height*0.8)
    this.slime.body.setGravityY(100)
    let rect=this.add.rectangle(-20,0,config.scale.width*2,1,0xff0000,0).setDepth(99).setOrigin(0,0)
    this.physics.add.existing(rect,true)
    this.physics.add.collider(this.slime,rect)
    
    // this.slime.body.setCollideWorldBounds(true)
    // this.slime.body.onWorldBounds = true;

    // this.physics.world.on("worldbounds",()=>{
    //   if (this.slime.y+this.slime.height>this.physics.world.bounds.bottom) {
    //     this.slime.body.setCollideWorldBounds(false)
    //   }
    //     // console.log(,this.slime.y+this.slime.height/2,this.slime.height);
        
    // })
    this.scoreCounter = this.time.addEvent({
      delay: 500,
      callback: () => {
          this.score += 1;
      },
      callbackScope: this,
      loop: true,
  });
    this.physics.add.overlap(this.slime, this.platformGroup, (s, s1) => {
      if (s.body.touching.down && s1.body.touching.up && s.isFalling())
                  {
                    s1.explode();
                    s.jump()
                  }
      
  });
  this.started=true
  }
  initPlatform(){
    let startPos=100
    for (let index = 0; index < 8; index++) {
      this.addPlatform(startPos,Phaser.Math.Between(40, 340))
      startPos+=Phaser.Math.Between(70, 120);
    }
    
  }
  update(time: number, delta: number): void {
      
      this.background.tilePositionX+=0.5
      if(!this.gameOver)this.platformSpawner()
      if (this.started) {
        this.scoreText.setText(`SCORE: ${this.score}`);

        this.scoreText.x = config.scale.width - this.scoreText.width - 50;
        if (this.slime.y>config.scale.height && !this.gameOver) {
          console.log('dead');
          this.stopGame()
          this.gameOver = true;

          
          
        }
      }
  }
  stopGame(){
    this.scoreCounter.destroy()
    this.platformGroup.getChildren().forEach(child => {
      child.body.setVelocityX(0);
      child.explode()
    })
    this.gameoverText=this.add.text(config.scale.width/2,600,'\t\t\t\t\t\t\tGame Over\n\nPress space to continue',{ 
      fontFamily:'kong', 
    fontSize:'16px',
    color:'white'}).setOrigin(0.5)

    this.tweens.add({
      targets: this.gameoverText,
      y: config.scale.height/2-50, // '+=100'
      ease: "Cubic", // 'Cubic', 'Elastic', 'Bounce', 'Back'
      duration: 1000,
      repeat: 0,
      yoyo: false
      })
      if (!this.username) {
        this.userInput = this.add.dom(config.scale.width/2,700).createFromHTML('<input class="playerInput" type="text" placeholder="username" name="player">').setDepth(66).setOrigin(0.5);
        this.uinput = document.querySelector('input');
        
        this.uinput?.addEventListener('input',()=>{
          if(this.error) this.error.destroy()
        })
        this.tweens.add({
          targets: this.userInput,
          y: config.scale.height-60, // '+=100'
          ease: "Cubic", // 'Cubic', 'Elastic', 'Bounce', 'Back'
          duration: 1000,
          repeat: 0,
          yoyo: false
          });
      }
    
  }
  addPlatform(posX: number, posY: number) {
    
    this.platformAdded += 1;
    let platform;
    if (this.platformPool.getLength()) {
        platform = this.platformPool.getFirst();
        platform.reset();
        platform.x = posX;
        platform.y = posY;
        platform.active = true;
        platform.visible = true;
        this.platformPool.remove(platform);
    } else {
      
        platform = new Meteor(this,posX, posY);
        
        this.add.existing(platform);
        this.physics.add.existing(platform);
        
        platform.body.setImmovable();
        platform.body.setVelocityX(100 * -1);
        platform.body.setSize(platform.width*0.8,1)
        platform.body.setOffset(0,5)
        this.platformGroup.add(platform);
        
    }

    this.nextPlatformDistance = Phaser.Math.Between(70, 120);

   
}

platformSpawner() {
    let minDistance = config.scale.width;
    
    this.platformGroup.getChildren().forEach((platform,i) => {
      // console.log('here');
      minDistance= config.scale.width;
        const platformDistance = minDistance - platform.x ;
        if (platformDistance < minDistance) {
            minDistance = platformDistance;
        }
        // console.log(i);
        
        if (platform.x < -platform.width / 2) {
            this.platformGroup.killAndHide(platform);
            this.platformGroup.remove(platform);
        }
    }, this);

    if (minDistance > this.nextPlatformDistance) {
        const nextPlatformWidth = 48;

        let platformRandomHeight;
       
        platformRandomHeight = Phaser.Math.Between(40, 340);
      

        this.addPlatform(config.scale.width + nextPlatformWidth / 2, platformRandomHeight);
    }
}
}
