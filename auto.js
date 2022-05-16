/** @param {NS} ns */

/**
 * create a program that will automatically run the initial setup after a soft reset/aug reset
 * 1/ run the one.js program
 * 2/ study at university until brutessh is available to create
 * 3/ write the brutessh program is we do not have it
 * 4/ buy the TOR router
 * 5/ work for carman sec until we have enough money to travel to aveum for bachman's
 * 6/ continuously purchase the darkweb programs until we have them all
 *
 * level requirements are: * BruteSSH.exe: 50 * FTPCrack.exe: 100 * relaySMTP.exe: 250
 * * HTTPWorm.exe: 500 * SQLInject.exe: 750 * DeepscanV1.exe: 75 * DeepscanV2.exe: 400
 * * ServerProfiler.exe: 75 * AutoLink.exe: 25
 */

// darkwebprograms we'll need
let darkwebPrograms = ['BruteSSH.exe', 'FTPCrack.exe', 'relaySMTP.exe', 'HTTPWorm.exe', 'SQLInject.exe']

export async function main(ns) {
	let player = ns.getPlayer();

	// INITIAL STARTUP
	// execute our main hack cycle
	await ns.exec("one.js", "home", 1)
	ns.singularity.universityCourse('rothman university', 'study computer science')


	// try to create brutessh.exe
	try { ns.singularity.createProgram('BruteSSH.exe'); } catch { }

	// create a check to see if we have completed stage 2
	while (!ns.fileExists('BruteSSH.exe')) {
		ns.print('waiting on BruteSSH.exe to finish...')
		await ns.sleep(100);
	}


	// DARKWEB STAGE
	let filesOwned = []
	// continue to loop until we have access to all darkweb files, also start working at bachmans if we can
	while (filesOwned.length != darkwebPrograms.length) {
		// check to see which files we have and add them to the counter
		for (let i = 0; i < darkwebPrograms.length; i++) {
			if (ns.fileExists(darkwebPrograms[i]) && !filesOwned.includes(darkwebPrograms[i])) {
				filesOwned.push(darkwebPrograms[i])
			}
		}
		// if we have enough money to purchase the TOR router, do so
		if (ns.getServerMoneyAvailable("home") >= 200000 && !player.tor) {
			ns.singularity.purchaseTor()
		}
		// if we're not working somewhere get us to work

		// GET HACK FILES
		// if we do not have the server hack files yet, continue to purchase them
		// trigger the above code again, setting us to work there
		for (let i = 0; i < darkwebPrograms.length; i++) {
			if (!filesOwned.includes(darkwebPrograms[i])) {
				if (ns.getServerMoneyAvailable("home") >= ns.singularity.getDarkwebProgramCost(darkwebPrograms[i])) {
					ns.singularity.purchaseProgram(darkwebPrograms[i]);
				}
			}
		}
		if (filesOwned.length == darkwebPrograms.length) {
			break
		}
		await ns.sleep(100)
	}

	// STAGE 3
	while (ns.getServerMaxRam("home") < 512) {
		// if we have not reached 512 ram on home then continue purchasing home ram
		if (ns.getServerMoneyAvailable("home") >= ns.singularity.getUpgradeHomeRamCost()) {
			ns.singularity.upgradeHomeRam();
		}
		await ns.sleep(100);
	}
	// setup is complete, execute the server purchasing
	await ns.exec("three.js", "home", 1)
}
