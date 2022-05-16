# bitburner
This is a collection of scripts I have written for the game BitBurner.

The scripts are pretty simple in my eyes as I've been mainly using the game as a learning tool for JavaScript.

I've still got to put in some descriptive comments at the top of some of the scripts but I hope you can get the gist of what it does from the name of the script for now.

I'm planning on going through and updating stuff as I get further into the game and develop my skills a bit more.

You're welcome to give them a shot. Any feedback is very welcome, just be sure to cite me if you post it somewhere!

ROUGH OUTLINE OF SCRIPTS:
-------------------------
* I completely re-wrote most of the scripts I was using to try and reduce my code length and try out new ways of automating things. I'll probably go through and rewrite the main cycle again as I could probably improve it further by removing some parts. The next version will probably be an attempt at creating a batcher as well as even more automation for things like factions and augmentation purchasing. I'll also start organising things into folders as things are looking a bit messy and unorganised.

<strong>auto.js:</strong>
Simple automation script for setting up the player computer, purchased servers and hack files. Once the player's home computer reaches 512 gig ram it will start 'three.js' for automate the purchasing of servers before terminating.

<strong>one.js:</strong>
Main controller for the HWGW cycle. Improved on the older version by making sure we're only using the ram needed for each of the HWGW tasks. Also added a counter weaken script for the grow and hack scripts meaning that we can keep security on the servers down for longer periods of time. Also trys to gain root access to servers.

<strong>Two.js:</strong>
Tells each server you have access to to focus fire weaken attacks against the Joesguns server with max available scripts to farm hacking experience.

<strong>Three.js:</strong>
Purchases the initial servers to the max amount then continuously upgrades them until they have reached the max ram.

<strong>four.js:</strong>
A controller for the contract solver scripts (I'm still currently working on figuring these out).

<strong>HWGW files:</strong>
These files will run their respective tasks once at a hostname written into target.txt.

<strong>networkMap.js:</strong>
Scans every server in the network and writes to a file named map.txt the hostname and all the servers it is attached to. It can sometimes make finding certain faction servers a little quicker.

<strong>shareStarter.js / shareComp.js:</strong>
Sends the shareComp.js file to all your servers before executing them with max availble threads for helping with reputation farming.

<strong>intFarm.js / shareComp.js:</strong>
Checks any faction invites you have and automatically joins them before performing a soft reset. This is the fastest way I have found to farm intelligence so far. For maximum experience you need to have joined most or all of the company factions as these are available after a soft reset.
