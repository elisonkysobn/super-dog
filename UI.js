export class UI {
    constructor(game){
        this.game = game;
        this.fontSize = 20;
        this.fontFamily = 'Creepster';
        this.fonts = 'Rubik Gemstones';
        this.liveImage = document.getElementById('hearts');
    }
    draw(context){
        context.save()
        context.shadowOffsetX = 2;//The shadowOffsetY property sets or returns the vertical distance of the shadow from the shape.
        context.shadowOffsetY = 2;
        context.shadowColor = 'white';
        context.shadowBlur = 0;
        
        context.font = this.fontSize + 'px ' + this.fontFamily;
        context.textAlign = 'left';
        context.fillStyle = this.game.fontColor;
        //score
        context.fillText('Score:' + this.game.score, 20, 50); //.fillText() is a method to draw filled text
   
        // timer
        context.font = this.fontSize * 0.8 + 'px ' + this.fontFamily;
        context.fillText('Time: ' + (this.game.time * 0.001).toFixed(1), 20, 80); //millisecond to second
        //lives
        for (let i = 0; i < this.game.lives; i++){
            context.drawImage(this.liveImage, 25*i+20, 95, 25, 25);
        }
        
        // game over messages
        if (this.game.gameOver){
            context.textAlign = 'center';
            context.font = this.fontSize * 2 + 'px ' + this.fontFamily;
            if (this.game.score > this.game.winningScore){
                context.fillText('Boo-yah', this.game.width * 0.5, this.game.height * 0.5 - 20);
                context.font = this.fontSize * 0.7 + 'px ' + this.fonts;
                context.fillText('What are creatures of the night afraid of? YOU!!!', this.game.width * 0.5, this.game.height * 0.5 + 20);
            } else {
                context.fillText('Love at first bite?', this.game.width * 0.5, this.game.height * 0.5 - 20);
                context.font = this.fontSize * 0.7 + 'px ' + this.fonts;
                context.fillText('Nope. Better luck next time!', this.game.width * 0.5, this.game.height * 0.5 + 20);
            }
            
        }
        context.restore();
    }
}