# bitburner
This is a collection of scripts I have written for the game BitBurner.

The scripts are pretty simple in my eyes as I've been mainly using the game as a learning tool for JavaScript.

I've still got to put in some descriptive comments at the top of some of the scripts but I hope you can get the gist of what it does from the name of the script for now.

I'm planning on going through and updating stuff as I get further into the game and develop my skills a bit more.

You're welcome to give them a shot. Any feedback is very welcome, just be sure to link your code if you post it somewhere!

ROUGH OUTLINE OF SCRIPTS:
-------------------------
<strong>basicCycle.js:</strong>
This is a simple hack, grow, weaken cycle which checks if the security needs to be weakened first before growing and hacking. The step order is: weaken>grow>hack

<strong>filePull.js:</strong>
This pulls all .lit files from the network back to the "home" computer while also scanning the network for any contracts that maybe available and lists them in a text file with the hostname and contract title. Once I've started working on contract bots I'll probably come back to this and seperate the two into seperate functions.

<strong>grow.js / hack.js / weaken.js:</strong>
These files will run their respective tasks once at a hostname written into target.txt.

<strong>networkMap.js:</strong>
Scans every server in the network and writes to a file named map.txt the hostname and all the servers it is attached to. It can sometimes make finding certain faction servers a little quicker.

<strong>setup.js:</strong>
Runs through every server, uses the port files (if you have them) and nukes to gain root access. Once you have root access it will then copy and run some basic files to get you started before running serverStartup.js to begin purchasing some base servers and hackFileManager.js on the "home" computer.

<strong>targetManager.js:</strong>
Generates a list of targets every 30 minutes for the hackFileManager.js script. It will only run hackFileManager.js on the server provided it has enough ram to be useful. This baseline can be changed in the script editor.

<strong>upgradeCheck.js:</strong>
Checks purchased server ram and upgrades all of them at the same time to the next tier until max is hit and only if money is available. Just a background uprgader.

<strong>hackFileManager.js:</strong>
Runs the basic hack, grow, weaken scripts depending on what needs to be done. I've set the max ram useage at around 90% so the server will always be able to lend threads to hack, grow or weaken attacks on the server. It could be tweaked a bit more for more optomization, but I'm happy with where it's at for now and want to work on other game projects.

<strong>serverStartup.js:</strong>
Checks how many servers the player has and will purchase base servers until the max purchased server count is hit. Once a server is purchased it runs basicCycle.js to make sure it is doing something when it comes online.
