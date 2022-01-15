import Phaser from 'phaser';

export default {
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#33A5E7',
  scale: {
    width: 640,
    height: 360,
    zoom:2,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }, 
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
    
  },
  dom: {
    createContainer: true,
  },
};
