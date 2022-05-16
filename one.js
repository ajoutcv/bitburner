/** @param {NS} ns */

/** contiuously checks to see if we have rootAccess to the NPServer, if not, executes
 * files needed for rootAccess. runs the basic hack/grow/weaken cycle on the computers
 */


// return a server list of all non-player servers
export function getNPServers(ns) {
	let servers = []
	let filters = ns.getPurchasedServers()
	filters.push("home", "darkweb")
	let scanned = ns.scan("home")
	while (scanned.length > 0) {
		let s = scanned.pop()
		if (!servers.includes(s) && !filters.includes(s)) {
			servers.push(s)
			scanned = scanned.concat(ns.scan(s))
		}
	}
	return servers
}


// return a list of player servers
export function getPServers(ns) {
	let servers = ns.getPurchasedServers()
	servers.push("home")
	return servers
}


// return a list of target servers which have a weaken time of less than 10 minutes
export function getTargetServers(ns) {
	let servers = []
	let filters = ns.getPurchasedServers()
	filters.push("home", "darkweb")
	let scanned = ns.scan("home")
	while (scanned.length > 0) {
		let s = scanned.pop()
		if (!servers.includes(s) && !filters.includes(s)) {
			servers.push(s)
			scanned = scanned.concat(ns.scan(s))
		}
	}
	let refinedList = []
	for (let s = 0; s < servers.length; s++) {
		if (ns.getServerMaxMoney(servers[s]) > 0 && ns.hasRootAccess(servers[s]) && ns.getWeakenTime(servers[s]) < 600000) {
			refinedList.push(servers[s])
		}
	}
	return refinedList

}

// get a list of easy targets for early game (hacking level < 1000)
function getEasyTargets(ns) {
	let servers = []
	let filters = ns.getPurchasedServers()
	filters.push("home", "darkweb")
	let scanned = ns.scan("home")
	for (let s = 0; s < scanned.length; s++) {
		let tempScan = ns.scan(scanned[s])
		if (!filters.includes(scanned[s]) && !servers.includes(scanned[s])) {
			servers.push(scanned[s])
		}
		for (let t = 0; t < tempScan.length; t++) {
			let tempScan2 = ns.scan(tempScan[t])
			if (!filters.includes(tempScan[t]) && !servers.includes(tempScan[t])) {
				servers.push(tempScan[t])
			}
			for (let h = 0; h < tempScan2.length; h++) {
				if (!filters.includes(tempScan2[h]) && !servers.includes(tempScan2[h])) {
					servers.push(tempScan2[h])
				}
			}
		}
	}
	// PLACE THIS INTO THE LOOPS ABOVE TO DECREASE THE LINES OF CODE
	let refined = []
	for (let s = 0; s < servers.length; s++) {
		if (!filters.includes(servers[s]) && !refined.includes(servers[s])) {
			if (ns.getServerMaxMoney(servers[s]) > 0)
				refined.push(servers[s])
		}
	}
	return refined
}


// return the max threads for the script
export function getThreads(ns, server, script) {
	let threads = 0
	let availableRam = 0
	if (server == "home") {
		availableRam = (ns.getServerMaxRam(server) * .9) - ns.getServerUsedRam(server)
	}
	else {
		availableRam = (ns.getServerMaxRam(server)) - ns.getServerUsedRam(server)
	}

	threads = availableRam / ns.getScriptRam(script)

	return threads
}


// returns a number of weaken threads against a security level
function getWeakenThreads(ns, secLevel) {
	let weakenPow = ns.weakenAnalyze(1)
	// get the thread count and return an int
	let weakenThreads = 0
	// make sure the division is not under 1
	if (Math.ceil(secLevel / weakenPow) < 1) {
		weakenThreads = Math.ceil(secLevel / weakenPow)
	}
	else {
		weakenThreads = Math.floor(secLevel / weakenPow)
	}
	return weakenThreads
}


// returns a number of grow threads
function getGrowThreads(ns, target) {
	// find how much we need to grow the server by
	let moneyNeeded = ns.getServerMaxMoney(target) - ns.getServerMoneyAvailable(target)
	// determine how much of a % we're missing
	let percNeeded = 0
	let growThreads = 0
	if (moneyNeeded != 0) {
		percNeeded = (ns.getServerMaxMoney(target) * 100) / moneyNeeded
		if (percNeeded < 1) {
			growThreads = Math.ceil(ns.growthAnalyze(target, percNeeded))
		}
		else {
			growThreads = Math.floor(ns.growthAnalyze(target, percNeeded))
		}
	}
	return growThreads
}


// bonus grow threads
function getBonusGrowThreads(ns, hackAmount, target) {
	// check the hack amount and take this from the max money
	// find how much we need to grow the server by
	let moneyNeeded = ns.getServerMaxMoney(target) - hackAmount
	// determine how much of a % we're missing
	let percNeeded = 0
	let growThreads = 0
	if (moneyNeeded != 0) {
		percNeeded = (ns.getServerMaxMoney(target) * 100) / moneyNeeded
		if (percNeeded < 1) {
			growThreads = Math.ceil(ns.growthAnalyze(target, percNeeded))
		}
		else {
			growThreads = Math.floor(ns.growthAnalyze(target, percNeeded))
		}
	}
	return growThreads
}


// MAIN FUNCTION
export async function main(ns) {
	let logList = ["scan", "nuke", "brutessh", "ftpcrack", "relaysmtp", "httpworm", "sqlinject", "scp",
		"getServerMaxRam", "getServerUsedRam", "getServerSecurityLevel", "getServerMinSecurityLevel", "getServerMaxMoney", "getServerMoneyAvailable",
		"getHackingLevel", "getServerRequiredHackingLevel"]
	for (let l = 0; l < logList.length; l++) {
		ns.disableLog(logList[l])
		ns.clearLog()
	}

	// main variables for the loop
	let files = ["hk.js", "gr.js", "wk.js", "wkB.js", "grB.js"]
	let servers = []
	let targetList = []
	let target = ""
	let count = 0


	// main loop
	while (true) {
		// check if any new servers need to be added to the list
		servers = getNPServers(ns).concat(getPServers(ns))
		// make sure the server has the main hack,grow,weaken files
		for (let s = 0; s < servers.length; s++) {
			for (let f = 0; f < files.length; f++) {
				if (!ns.fileExists(files[f], servers[s])) {
					await ns.scp(files[f], "home", servers[s])
				}
			}
		}

		for (let s = 0; s < servers.length; s++) {
			if (ns.hasRootAccess(servers[s])) {
				// at the beginning of the game, attack easy targets for quick money
				if (ns.getPurchasedServers().length != ns.getPurchasedServerLimit()) {
					targetList = ["n00dles", "foodnstuff", "joesguns"]
				}
				// once our servers are at least 1TB and hacking is level 1000 generate a network wide list
				else if (ns.getServerMaxRam("pServer-0") >= 1024 && ns.getHackingLevel() > 1000) {
					targetList = getTargetServers(ns)
				}
				else {
					targetList = getEasyTargets(ns)
				}
				target = targetList[count]
				await ns.write("target.txt", target, "w")

				// cycle through targets here
				let servers = getNPServers(ns).concat(getPServers(ns))
				for (let s = 0; s < servers.length; s++) {
					await ns.scp("target.txt", "home", servers[s])
				}

				// MAIN CYCLE
				ns.print(servers[s] + " is checking: " + target)
				// WEAKEN
				if (!ns.scriptRunning("wk.js", servers[s])) {
					if (ns.getServerSecurityLevel(target) != ns.getServerMinSecurityLevel(target)) {
						// check the max threads we'll need to get stuff down
						let secLevel = ns.getServerSecurityLevel(target) - ns.getServerMinSecurityLevel(target)
						let weakenThreads = getWeakenThreads(ns, secLevel)
						let availableThreads = getThreads(ns, servers[s], "wk.js")
						// check if the server can send the amount of threads for the attack
						let attackThreads = 0
						if (availableThreads < weakenThreads) {
							attackThreads = availableThreads
						}
						else {
							attackThreads = weakenThreads
						}
						if (attackThreads > 0) {
							await ns.exec("wk.js", servers[s], attackThreads)
						}
					}
				}

				// GROW
				if (!ns.scriptRunning("gr.js", servers[s])) {
					if (ns.getServerMoneyAvailable(target) < ns.getServerMaxMoney(target)) {
						// find how much we need to grow the server by
						let growThreads = getGrowThreads(ns, target)
						let availableThreads = getThreads(ns, servers[s], "gr.js")
						let attackThreads = 0
						if (availableThreads < growThreads) {
							attackThreads = availableThreads
						}
						else {
							attackThreads = growThreads
						}
						if (attackThreads > 0) {
							await ns.exec("gr.js", servers[s], attackThreads)
							// if the server itself is above 1TB then try to execute bonus weaken
							if (ns.getServerMaxRam(servers[s]) >= 1024) {
								if (!ns.isRunning("wkB.js")) {
									availableThreads = getThreads(ns, servers[s], "wkB.js")
									// find the effect of grow on security
									let newSecLevel = ns.growthAnalyzeSecurity(availableThreads, target, 1)
									// conduct a weaken attack against the new security level
									let weakenThreads = getWeakenThreads(ns, newSecLevel)
									availableThreads = getThreads(ns, servers[s], "wkB.js")
									// check if the server can send the amount of threads for the attack
									let attackThreads = 0
									if (availableThreads < weakenThreads) {
										attackThreads = availableThreads
									}
									else {
										attackThreads = weakenThreads
									}
									if (attackThreads > 0) {
										await ns.exec("wkB.js", servers[s], attackThreads)
									}
								}
							}
						}
					}
				}

				// HACK
				if (!ns.scriptRunning("hk.js", servers[s])) {
					if (ns.getServerSecurityLevel(target) <= ns.getServerMinSecurityLevel(target) + 1 &&
						ns.getServerMoneyAvailable(target) >= ns.getServerMaxMoney(target) * .9) {
						// find the 50% of threads for the attack
						let hkAnalyzeThreads = ns.hackAnalyzeThreads(target, ns.getServerMaxMoney(target) * .5)
						let availableThreads = getThreads(ns, servers[s], "hk.js")
						let attackThreads = 0
						if (hkAnalyzeThreads > availableThreads) {
							attackThreads = availableThreads
						}
						else {
							attackThreads = hkAnalyzeThreads
						}
						if (attackThreads > 0) {
							await ns.exec("hk.js", servers[s], attackThreads)
							// if the server itself is above 1TB then try to execute bonus grow/weaken
							if (ns.getServerMaxRam(servers[s]) >= 1024) {
								// RUN BONUS WEAKEN
								if (!ns.isRunning("wkB.js")) {
									availableThreads = getThreads(ns, servers[s], "wkB.js")
									// find the effect of hack on security
									let newSecLevel = ns.hackAnalyzeSecurity(attackThreads, target)
									// conduct a weaken attack against the new security level
									let weakenThreads = getWeakenThreads(ns, newSecLevel)
									availableThreads = getThreads(ns, servers[s], "wkB.js")
									// check if the server can send the amount of threads for the attack
									let newAttackThreads = 0
									if (availableThreads < weakenThreads) {
										newAttackThreads = availableThreads
									}
									else {
										newAttackThreads = weakenThreads
									}
									if (newAttackThreads > 0) {
										await ns.exec("wkB.js", servers[s], newAttackThreads)
									}
								}
								// RUN BONUS GROW
								// targeting the wrong thing
								if (!ns.isRunning("grB.js")) {
									// get the total money that would be taken from the hack
									let hackAmount = ns.hackAnalyze(target) * attackThreads
									// find how much we need to grow the server by
									let growThreads = getBonusGrowThreads(ns, hackAmount, target)
									availableThreads = getThreads(ns, servers[s], "grB.js")
									let newAttackThreads = 0
									if (availableThreads < growThreads) {
										newAttackThreads = availableThreads
									}
									else {
										newAttackThreads = growThreads
									}
									if (newAttackThreads > 0 && !ns.isRunning("grB.js")) {
										await ns.exec("grB.js", servers[s], newAttackThreads)
									}
								}
							}

						}
					}
				}
				// update our counters
				count++
				if (count == targetList.length) {
					count = 0
				}
			}


			// try to access the server with hack files and nuke
			if (!ns.hasRootAccess(servers[s])) {
				try { await ns.brutessh(servers[s]) } catch { };
				try { await ns.ftpcrack(servers[s]) } catch { };
				try { await ns.relaysmtp(servers[s]) } catch { };
				try { await ns.httpworm(servers[s]) } catch { };
				try { await ns.sqlinject(servers[s]) } catch { };
				try {
					await ns.nuke(servers[s])
					ns.tprint("gained access to: " + servers[s])
					for (let f = 0; f < files.length; f++) {
						await ns.scp(files[f], "home", servers[s])
					}
				}
				catch { }
			}
		}
		// await the while loop to stop crash
		await ns.sleep(100)
	}
}
