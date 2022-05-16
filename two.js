/** @param {NS} ns */

/** focus fires joesguns to maximize hack experience gains per second
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
function getPServers(ns) {
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


// return the max threads for the script
function getThreads(ns, server, script) {
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
	let servers = getNPServers(ns).concat(getPServers(ns))
	let target = "joesguns"
	await ns.write("target.txt", target, "w")

	// write the joesguns target to the servers
	for (let s = 0; s < servers.length; s++) {
		await ns.scp("target.txt", "home", servers[s])
	}

	// main loop
	while (true) {
		// check if any new servers need to be added to the list
		// servers = getNPServers(ns).concat(getPServers(ns))

		// MAIN CYCLE
		for (let s = 0; s < servers.length; s++) {
			if (ns.hasRootAccess(servers[s])) {
				if (!ns.scriptRunning("wk.js", servers[s])) {
					let attackThreads = getThreads(ns, servers[s],"wk.js")
					if(attackThreads >0){
						await ns.exec("wk.js", servers[s], attackThreads)
					}
				}
			}
		}
		// await the while loop to stop crash
		await ns.sleep(100)
	}
}
