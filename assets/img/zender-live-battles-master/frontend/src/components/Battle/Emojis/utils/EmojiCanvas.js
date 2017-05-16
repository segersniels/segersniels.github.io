import $ from 'jquery';
import shortid from 'shortid';
import forEach from 'lodash/forEach';

import PowImage from './../../../../../assets/pow.png';

class EmojiCanvas {
	constructor(canvas) {
		this.canvas = canvas;
		this.config = {
			defaultSpeed: -0.75,
			defaultSize: 50,
			maxSize: 70,
			growFactor: 0.1,
			acceleration: 0.04,
		}
		this.emojis = [];
	}

	/* 
	 *	RENDER LOOP CONTROLS 
	 *	--------------------------------------------
	 */

	startRenderLoop() {
		this.stopIntervalToken = setInterval(() => {
			this.renderCanvas();
		}, 10);
	}

	stopRenderLoop() {
		clearInterval(this.stopIntervalToken);
	}

	/* 
	 *	EMOJI FUNCTIONS
	 *	--------------------------------------------
	 */

	addEmoji(emoji) {
		const new_emoji = {
			'id': shortid.generate(),
			'url': emoji.url,
			'isFromChoiceSet': emoji.isFromChoiceSet,
			'x': emoji.coordinates.x,
			'y': emoji.coordinates.y,
			'speed': this.config.defaultSpeed,
			'size': this.config.defaultSize,
		};

		// Add emoji to state
		this.emojis.push(new_emoji);
	}

	addEmojis(emojis) {
		// Add every emoji to list with small delay
		forEach(emojis, ({ emoji, amount }) => {
			(function loop(emoji, amount, parent) {
				setTimeout(() => {
					if (amount--) { 
						emoji.coordinates = {
							x: emoji.isFromChoiceSet ? parent.canvas.width : 0,
							y: parent.getRandomHeight(),
						};
						parent.addEmoji(emoji);
						loop(emoji, amount, parent);
					}
				}, 50);
			})(emoji, amount, this);
		});
	}

	getRandomHeight() {
		const { height } = this.canvas;
		const percent = height * 0.3;
		return (Math.floor(Math.random() * (height - (percent*2))) + percent);
	}

	/* 
	 *	CANVAS FUNCTIONS
	 *	--------------------------------------------
	 */

	renderCanvas() {
		const emojis = this.emojis;
		this.cleanCanvas();
		this.cleanEmojis(emojis);
		this.renderEmojis(emojis);
	}

	cleanCanvas() {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		const context = this.canvas.getContext("2d");
		context.clearRect(0, 0, window.innerWidth, window.innerHeight);
	}

	cleanEmojis(emojis) {
		this.emojis = this.emojis.filter(emoji => !this.emojiIsOutOfView(emoji));	
	}

	emojiIsOutOfView(emoji){
		return (emoji.x < -100) || (emoji.x > (this.canvas.width + 100));
	}

	renderEmojis(emojis) {
		// Draw every emoji in state
		emojis.forEach(emoji => {
			this.drawEmoji(emoji);
			this.checkForCollisions(emoji);
		});
	}

	drawEmoji(e) {
		const context = this.canvas.getContext("2d");
		var emoji = new Image();
		emoji.src = e.url;

		// Gradualy make emoji move faster and grow bigger
		if(e.size < this.config.maxSize) e.size += this.config.growFactor;
		e.speed += this.config.acceleration;
		e.isFromChoiceSet ? e.x-= e.speed : e.x += e.speed;

		context.drawImage(emoji, e.x, e.y, e.size, e.size);
		context.closePath();
		context.fill();
	}

	checkForCollisions(emoji) {
		const friendlyEmojies = this.emojis.filter(e => e.isFromChoiceSet);
		const enemyEmojies = this.emojis.filter(e => !e.isFromChoiceSet);
		
		if(!emoji.isFromChoiceSet) {
			friendlyEmojies.forEach(other => {
				// emoji.x collide met other.x 
				if(emoji.x+emoji.size/2 > other.x && emoji.x < other.x && other.y > emoji.y+10 && other.y < emoji.y+emoji.size-10){
					this.emojis = this.emojis.filter(em => em.id !== emoji.id && em.id !== other.id);					
					this.createCollision(emoji);
				}
			});
		}
		else {
			enemyEmojies.forEach(other => {
				// emoji.x collide met other.x 
				if(emoji.x < other.x+emoji.size/2 && emoji.x > other.x  && other.y > emoji.y+10 && other.y < emoji.y+emoji.size-10){
					this.emojis = this.emojis.filter(em => em.id !== emoji.id && em.id !== other.id);					
					this.createCollision(other);
				}
			});
		}
	}

	createCollision(emoji) {
		var img = document.createElement("img");
		img.setAttribute("id", emoji.id);
		img.src = PowImage;
		img.style.position = "absolute";  
		img.style.width = "125px";
		img.style.height = "110px";    
		img.style.top = emoji.y - emoji.size/5 + "px";  
		img.style.left = emoji.x - emoji.size/5 + "px";

		// Add explosion to hitarea
		this.showCollision(img);
	}

	showCollision(img) {
		// Append emoji
		document.getElementById("EmojiHitArea").appendChild(img);

		// Slowly fade + remove explosion
		$(img).fadeOut('slow', () => {
			$(img).remove();
		});
	}
}

export default EmojiCanvas;