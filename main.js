import { Player } from './player.js';
import { InputHandler } from './input.js';
import { Background } from './background.js';
import {FlyingEnemy, ClimbingEnemy, GroundEnemy, TerroEnemy } from './enemies.js';
import {UI} from './UI.js';
import { Rolling } from './playerStates.js';


window.addEventListener("load", function(){

	const canvas = document.getElementById('canvas1');
	const ctx = canvas.getContext('2d');
	canvas.width = 900;
	canvas.height = 500;

	class Game {
		constructor(width, height){
			this.width = width;
			this.height = height;
			this.groundMargin = 40;
			this.speed = 0;
			this.maxSpeed =3;
			this.background = new Background(this);
			this.player = new Player(this);
			this.input = new InputHandler(this);
			this.UI = new UI(this);
			this.enemies = [];
			this.particles = [];
			this.collisions = [];
			this.floatingMessages = [];
			this.maxParticles = 200; 
			this.enemyTimer = 0;
			this.enemyInterval = 1000;
			this.debug = false;//
			this.score = 0;
			this.winningScore = 30;
			this.time = 0;//
			this.maxTime = 150000;
			this.gameOver = false;
			this.lives = 10;
			this.fontColor = 'black';
			this.player.currentState = this.player.states[0];
        	this.player.currentState.enter();
			this.spinTime = 0;
			this.spinnable = true;
		}
		update(deltaTime){
			this.time += deltaTime;
			if(this.time > this.maxTime) this.gameOver = true;//
			this.background.update();
			this.player.update(this.input.keys, deltaTime);
			//spinable
			if(this.spinTime > 100){
				this.spinnable = false;
				}else if (this.spinTime <10){
					this.spinnable = true;}
				
			//spinTime
			if(this.player.currentState === this.player.states[4]){
				this.spinTime ++;
				}else if (this.spinTime > 0){
					this.spinTime -= 0.5;
				}else {
					this.spinTime =0;
				}
				//console.log(this.spinTime);
			
			//handleEnemies
			if (this.enemyTimer > this.enemyInterval){
				this.addEnemy();
				this.enemyTimer = 0;
			} else {
				this.enemyTimer += deltaTime;
			}
			this.enemies.forEach(enemy => {
				enemy.update(deltaTime);
			});
			//handle messages
			this.floatingMessages.forEach(message => {
				message.update();
			});
			//handle particles
			this.particles.forEach((particle, index) => {
				particle.update();
				if (particle.markedForDeletion) this.particles.splice(index, 1);
			});
			if(this.particles.length > this.maxParticles){
				this.particles.length  = this.maxParticles; //slice() returns a shallow copy of a portion of an array into a new array object
			}
			//handle collision sprites
			this.collisions.forEach((collision, index) =>{
				collision.update(deltaTime);
				
			});
			this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
			this.particles = this.particles.filter(particle => !particle.markedForDeletion);
			this.collisions = this.collisions.filter(collision => !collision.markedForDeletion);
			this.floatingMessages = this.floatingMessages.filter(message => !message.markedForDeletion);
		}
		draw(context){
			this.background.draw(context);
			this.player.draw(context);	
			this.enemies.forEach(enemy => {
				enemy.draw(context);
			});
			this.particles.forEach(particle => {
				particle.draw(context);
			});
			this.collisions.forEach(collision => {
				collision.draw(context);
			});
			this.floatingMessages.forEach(message => {
				message.draw(context);
			});

			this.UI.draw(context);
		}
		addEnemy(){
			if (this.speed > 0 && Math.random()< 0.5) this.enemies.push(new GroundEnemy(this));
			else if (this.speed > 0) this.enemies.push(new ClimbingEnemy(this));
			else if(this.score > 10) this.enemies.push(new TerroEnemy(this));//
			this.enemies.push(new FlyingEnemy(this));
			console.log(this.enemies);
		}
	}
	const game = new Game(canvas.width, canvas.height);
	let lastTime = 0;
	
	function animate(timeStamp){
		const deltaTime = timeStamp - lastTime;
		lastTime = timeStamp;
		ctx.clearRect(0,0,canvas.width, canvas.height);
		game.update(deltaTime);
		game.draw(ctx);
		if (!game.gameOver) requestAnimationFrame(animate);
	}
	animate(0);
});