import Phaser from 'phaser';

export default class Preloader extends Phaser.Scene {
  constructor() {
    super('Preloader');
  }

  preload() {
    this.load.image('logo', 'assets/phaser3-logo.png');
    this.load.image('stars', 'assets/stars.png');
    this.load.image('meteor', 'assets/meteor.png');
    this.load.image('leader', 'assets/leader.png');
    this.load.image('high', 'assets/high.png');
    this.load.spritesheet('slime', 'assets/slimey.png',{frameWidth:32,frameHeight:32});
    this.load.spritesheet('explo', 'assets/explo.png', {frameWidth:100,frameHeight:100});

  }

  create() {
      this.scene.start('GameScene')
  }
}
