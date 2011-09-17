/*
**	Version 0.1.1
**	2011.09.15
**	Jason Hinebaugh
*/

var TIME_INTERVAL = 6; // Controls game time (frames per interval)

Crafty.c('Fighter', {
	//	Fighter constants
	
	//	Attributes inherent in a character, largely immutable
	// 		complements: used to determine defense against an attack based on this attribute
	//		key: the metered mind, body, or spirit linked to this attribute
	ATTRIBUTES: {
		acuity: {
			complements: ['power', 'toughness'],
			key: 'mind'
		},
		guile: {
			complements: ['quickness', 'toughness'],
			key: 'mind'
		},
		power: {
			complements: ['guile', 'toughness'],
			key: 'body'
		},
		quickness: {
			complements: ['guile', 'stamina'],
			key: 'body'
		},
		stamina: {
			complements: ['quickness', 'acuity'],
			key: 'spirit'
		},
		toughness: {
			complements: ['quickness', 'guile'],
			key: 'spirit'
		}
	},

	//	Modes are states of being, whose modifers are .applied each round at a rate of 1/30th of 
	//	the global time interval.
	MODES: {
		idle: {
			toString: function() {
				return 'idle';
			},
			modifiers: {
				mind: 0.2,
				body: 0.2,
				spirit: 0.1
			}
		},
		rest: {
			toString: function() {
				return 'rest';
			},
			modifiers: {
				mind: 1,
				body: 0.5,
				spirit: 1
			}
		},
		observe: {
			toString: function() {
				return 'observe';
			},
			modifiers: {
				mind: -0.25,
				body: 0,
				spirit: 0
			}
		},
		defend: {
			toString: function() {
				return 'defend';
			},
			modifiers: {
				mind: -1,
				body: -0.5,
				spirit: 0
			}
		},
		move: {
			toString: function() {
				return 'move';
			},
			modifiers: {
				mind: 0,
				body: -0.5,
				spirit: 0
			}
		},
		bleeding: {
			toString: function() {
				return 'idle';
			},
			modifiers: {
				mind: -0.5,
				body: -1,
				spirit: -1
			}
		}
	},

	//	Actions are like modes, but finite in time. They also contain logic to determine their 
	//	effects when executed.
	ACTIONS: {
		attack: {
			toString: function() {
				return 'attack';
			},
			time: {
				execute: 0.2,
				recover: 0.6
			},
			modifiers: {
				mind: -2,
				body: -2,
				spirit: 0.5
			},
			execute: function(params) {
				var attacker = params.attacker;
				var target = params.target;
				
				//	Make an initial roll of 1 - 10
				//	Higher level characters have more consistent results that tend to be higher
				var roll = Math.floor(Math.random() * (11 - attacker.level)) + attacker.level;
				console.log('initial roll: ' + roll);

				//	Compare attacker's top attriubtes against defender’s complements
				var topAttributes = [null, null, null];
				for (var a in attacker.attributes) {
					if (attacker.attributes.hasOwnProperty(a)) {
						for (var i = 0; i < topAttributes.length; i++) {
							if (null == topAttributes[i] 
								|| attacker.attributes[a] > attacker.attributes[topAttributes[i]]) {
								topAttributes[i] = a;
								break;
							}
						}
					}
				}

				//	Set meterModifiers, rewarding or penalizing character based on meters 
				//	+1 for > 75%, -1 for < 50% and -2 for < 25%
				//	Meter values are divided by 25.01 instead of 25.00 so that 100 yields 3, not 4
				var attackerMeterModifiers = {
					mind: Math.floor(attacker.meters.mind / 25.01) - 2,
					body: Math.floor(attacker.meters.body / 25.01) - 2,
					spirit: Math.floor(attacker.meters.spirit / 25.01) - 2,
				};
				var targetMeterModifiers = {
					mind: Math.floor(target.meters.mind / 25.01) - 2,
					body: Math.floor(target.meters.body / 25.01) - 2,
					spirit: Math.floor(target.meters.spirit / 25.01) - 2,
				};

				//	Loop through the attacker’s top 3 attributes
				for (var i = 0; i < topAttributes.length; i++) {
					//	Modified attack score
					var attack = attacker.attributes[topAttributes[i]] 
						+ attackerMeterModifiers[attacker.ATTRIBUTES[topAttributes[i]].key];
						
					//	Determine defender’s attributes based on complements of attacker’s
					var complement1 = target.ATTRIBUTES[topAttributes[i]].complements[0];
					var key1 = target.ATTRIBUTES[topAttributes[i]].key;
					var complement2 = target.ATTRIBUTES[topAttributes[i]].complements[1];
					var key2 = target.ATTRIBUTES[topAttributes[i]].key;
					
					// Average defender’s complementary attributes
					var rollModifier = 0;
					var defense = (
						target.attributes[complement1] + targetMeterModifiers[key1]
						+ target.attributes[complement2] + targetMeterModifiers[key2]
					) / 2;
					// Set roll modifier
					if (attack >= defense) rollModifier = 1;
					else rollModifier = -1;
					// Weight the second and third top attributes lower
					if (i > 0) rollModifier *= 0.5;
					roll += rollModifier;

					console.log(topAttributes[i] + ': ' + attack + ' vs ' + defense);
				}
				// Does defender see the attack coming? +0 : +3
				/* Need to write this! */
				
				// Is the defender in a defensive mode? -2 : +0
				if ('defend' == target.mode) {
					roll -= 2;
				}

				// Is the defender moving rapidly? -1 : +0
				/* Need to write this! */

				roll = Math.max(0, Math.min(10, roll));
				console.log('final roll: ' + roll);

				switch (roll) {
					case 10:
					case 9:
						target.status = 'dead';
						target.meters.mind = 0;
						target.meters.body = 0;
						target.meters.spirit = 0;
						break;
					case 8:
						if (-1 == 'dead'.indexOf(target.status)) {
							target.status = 'dying';
							target.mode = 'bleeding';
						}
						target.meters.mind = Math.max(0, target.meters.mind - 40);
						target.meters.body = Math.max(0, target.meters.body - 60);
						target.meters.spirit = Math.max(0, target.meters.spirit - 40);
						target.meterTempo = 4;
						break;
					case 7:
						if (-1 == 'dead dying'.indexOf(target.status)) {
							target.status = 'maimed';
							target.mode = 'bleeding';
						}
						target.meters.mind = Math.max(0, target.meters.mind - 20);
						target.meters.body = Math.max(0, target.meters.body - 60);
						target.meters.spirit = Math.max(0, target.meters.spirit - 40);
						target.meterTempo = 4;
					case 6:
						if (-1 == 'dead dying maimed'.indexOf(target.status)) {
							target.status = 'wounded';
							target.mode = 'bleeding';
						}
						target.meters.mind = Math.max(0, target.meters.mind - 20);
						target.meters.body = Math.max(0, target.meters.body - 40);
						target.meters.spirit = Math.max(0, target.meters.spirit - 20);
						target.meterTempo = 2;
						break;
					case 5:
						if (-1 == 'dead dying maimed wounded'.indexOf(target.status)) {
							target.status = 'hurt';
						}
						target.meters.mind = Math.max(0, target.meters.mind - 20);
						target.meters.body = Math.max(0, target.meters.body - 20);
						target.meters.spirit = Math.max(0, target.meters.spirit - 10);
						break;
					case 4:
						if (-1 == 'dead dying maimed wounded hurt'.indexOf(target.status)) {
							target.status = 'grazed';
						}
						target.meters.mind = Math.max(0, target.meters.mind - 10);
						target.meters.body = Math.max(0, target.meters.body - 10);
						target.meters.spirit = Math.max(0, target.meters.spirit - 10);
					case 3:
						if (-1 == 'dead dying maimed wounded hurt grazed'.indexOf(target.status)) {
							target.status = 'blocked';
						}
						target.meters.mind = Math.max(0, target.meters.mind - 10);
						target.meters.spirit = Math.max(0, target.meters.spirit - 10);
						break;
					case 2:
						if (-1 == 'dead dying maimed wounded hurt grazed'.indexOf(target.status)) {
							target.status = 'blocked';
						}
						target.meters.mind = Math.max(0, target.meters.mind - 10);
						target.meters.spirit = Math.max(0, target.meters.spirit - 5);
					case 1:
						if (-1 == 'dead dying maimed wounded hurt grazed'.indexOf(target.status)) {
							target.status = 'blocked';
						}
						target.meters.spirit = Math.max(0, target.meters.spirit - 5);
				}
			}
		}
	},
	

	init: function() {
		// Components and their default values
		this.addComponent('2D, DOM, Color, HTML, Text');
		this.h = 20;
		this.w = 20;
		this.color('rgb(127,127,140)');
		
		// Fighter defaults
		this.name = 'Fighter';
		this.level = 1;
		this.meterTempo = 1;
		this.meters = {
			mind: 100,
			body: 100,
			spirit: 100
		};
		this.meterModifiers = {
			mind: 1,
			body: 1,
			spirit: 1		
		};
		this.attributes = {
			acuity: 0,
			guile: 0,
			power: 0,
			quickness: 0,
			stamina: 0,
			toughness: 0
		};
		
		this.status = 'ready';
		this.mode = 'idle';
		this.action = null;
		
		this.mindPara = Crafty.e('HTML, Text').text('mind: ' + this.meters.mind);
		$(this.mindPara._element).addClassName('info mind');
		this.bodyPara = Crafty.e('HTML, Text').text('body: ' + this.meters.body);
		$(this.bodyPara._element).addClassName('info body');
		this.spiritPara = Crafty.e('HTML, Text').text('spirit: ' + this.meters.spirit);
		$(this.spiritPara._element).addClassName('info spirit');
		
		this.statusPara = Crafty.e('HTML, Text').text('status: ' + this.status);
		$(this.statusPara._element).addClassName('info status');	
		
		// EnterFrame loop
		this.bind('EnterFrame', function(e) {
			if ('dead' != this.status) {
				for (var m in this.meters) {
					var meterMod = this.meterModifiers[m];
					if (this.MODES[this.mode].modifiers[m] < 0) meterMod = 1 / meterMod;					
					
					this.meters[m] += this.MODES[this.mode].modifiers[m] 
						* this.meterTempo 
						* meterMod 
						/ (TIME_INTERVAL * 30);
					this.meters[m] = Math.min(100, Math.max(0, this.meters[m]));
					if (this.action) {
						meterMod = this.meterModifiers[m];
						if (this.MODES[this.mode].modifiers[m] < 0) meterMod = 1 / meterMod;

						this.meters[m] += this.ACTIONS[this.action].modifiers[m] 
						* this.meterTempo 
						* meterMod
						/ TIME_INTERVAL;
						this.meters[m] = Math.min(100, Math.max(0, this.meters[m]));			
					}
					if ('dying' == this.status && 0 == this.meters.spirit) this.status = 'dead';
				}
			}
			
			// Info text elements
			// Mind
			this.mindPara.x = this.x + 24;
			this.mindPara.y = this.y;
			this.mindPara.text('mind: ' + Math.round(this.meters.mind));
			// Body
			this.bodyPara.x = this.x + 24;
			this.bodyPara.y = this.y + 10;
			this.bodyPara.text('body: ' + Math.round(this.meters.body));
			// Mind
			this.spiritPara.x = this.x + 24;
			this.spiritPara.y = this.y + 20;
			this.spiritPara.text('spirit: ' + Math.round(this.meters.spirit));
			// Status
			this.statusPara.x = this.x + 24;
			this.statusPara.y = this.y + 30;
			this.statusPara.text('status: ' + this.status);
		});
	},
	
	startAction: function(actionName, params) {
		if (this.executionTimeout) clearTimeout(this.executionTimeout);
		if (this.recoverTimeout) clearTimeout(this.recoverTimeout);
		this.action = actionName;
		
		var thisFigther = this;
		this.executionTimeout = setTimeout(function(){thisFigther.executeAction(params);}, this.ACTIONS[actionName].time.execute * 1000);
		
		this.recoverTimeout = setTimeout(function(){thisFigther.endAction();}, this.ACTIONS[actionName].time.recover * 1000);
	},
	executeAction: function(params) {
		if ('function' == typeof this.ACTIONS[this.action].execute) {
			this.ACTIONS[this.action].execute(params);
		}
	},
	endAction: function() {
		console.log('ended ' + this.action);
		this.action = '';
	},
	
	changeAttribute: function (a, s) {
		this.attributes[a] = s;
		if (-1 != 'acuity power stamina'.indexOf(a)) {
			// For a full score of 10 the key meter’s rate is reduced by half.
			// Otherwise, it’s reduced proportionally between 1.0 and 0.5.
			this.meterModifiers[this.ATTRIBUTES[a].key] = (s / 10) + 1;
		}
	}
});

var dude;
var bro;

window.onload = function(e) {
	Crafty.init(800, 600);
	dude = Crafty.e('Fighter').attr({x: 100, y: 100});
	dude.changeAttribute('guile', 10);
	dude.changeAttribute('acuity', 10);
	dude.changeAttribute('quickness', 10);

	bro = Crafty.e('Fighter').attr({x: 400, y: 100});
	bro.changeAttribute('power', 10);
	bro.changeAttribute('quickness', 10);
	bro.changeAttribute('toughness', 10);
}