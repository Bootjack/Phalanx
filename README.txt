Phalanx
by Jason Hinebaugh

*** INTRODUCTION ***

Foreword ---

Phalanx is a web-based realtime tactical game built on the Crafty and Prototype javascript frameworks. Its initial gameplay concept is very much inspired by the Bungie series of Myth games (http://www.bungie.net/Projects/MythUniverse.aspx). This is in no way an attempt to recreate those titles, but their unique and largely unimitated gameplay makes them an excellent jumping off point for this project. This is a very ambitious undertaking for one person with a lot of new technical challenges to overcome.

---

About the Project ---

[Write something here, eventually.]

---

Overview of Gameplay ---

[Write something here, eventually.]

---

*** DEVELOPMENT LOG ***

0.1.1	manual 1 vs 1 combat
	2011.09.15 Moslty Complete---
	Two figthers on stage ("bro" and "dude") with console-based attack function specifying attacker and target.
	
	Not sure about the structure of having MODES, ACTIONS, and ATTRIBUTES as class constants, given Crafty's cloaking of classes inside of the Crafty object. Maybe better to move attributes to the init function? I like the convention, though.
	
	Next to add: meterTempos (rename that variable!) need to apply separately to each of mind, body, and spirit. Also need to receive a benefit for high acuity, power, and stamina ability scores, respectively. (score of 10 yields 0.5 modifier)
	
	---
	
	2011.09.16 Logic Testing ---
	
	Alternate attribute sets definitely interact differently with one another. Still seems like serious injuries aren’t debilitating enough. A maimed soldier can still attack at a -1 more often than not. Maybe roll modifier rules should favor the defender more.
	
	Realized that I need to specify rate modifier bonuses such that they diminish negative affects and boost positive ones. [Done!]
	
	MODES and ACTIONS need some further thought. Are multiple modes allowed? Is bleeding a mode or an action? How do weapons affect attacks? Is there a better place for the action.execute() function? Can a fighter defend while moving? Is it less effective and when do we determine that?
	
	---

0.1.2	1 vs 1 AI combat
0.1.3	2D movement
0.1.4	multiple combatants
0.1.5	user interface
0.1.6	playtesting and refactoring
0.2.1	unit types
0.2.2	formations
0.2.3	tactical AI
0.2.4	user interface
0.2.5	playtesting and refactoring
0.3.1	topography
0.3.2	obstacles and playtesting
0.3.3	user interface
0.3.4	playtesting and refactoring
0.4.1	map design
0.4.2	mission scenarios
0.4.3	user interface
0.4.4	playtesting and refactoring
0.5.1	character persistence
0.5.2	player rewards
0.5.3	specialization
0.5.4	user interface
0.5.5	playtesting and refactoring
0.6.1	strategic AI
0.6.2	user interface
0.6.3	playtesting and refactoring
0.7.1	story development
0.7.2	character design
0.7.3	user interface
0.7.4	playtesting and refactoring
0.8.1	art
0.8.2	sound
0.8.3	music
0.8.4	user interface
0.8.5	playtesting and refactoring
0.9.1	full game review