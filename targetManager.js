/** @param {NS} ns */
export async function main(ns) {
	/* checks for new targets based on hacking level and sends a basic hacking script
	   for the server to run.
	   Maximizes the amount of servers currently being hacked */


	// create a list of hackable servers
	let files = ["targetedBasicCycle.js", "hackFileManager.js", "hack.js", "grow.js", "weaken.js"]
	let homeCycleFiles = ["hackFileManager.js", "hack.js", "grow.js", "weaken.js"]
	// ------------------->>>>>>>>>>>>> NETWORK CRAWL <<<<<<<<<<<<<<-------------------
	// have a server list of targets

	let servers = []
	let filters = ns.getPurchasedServers()
	filters.push("home", "darkweb")
	// origin point
	let scanned = ns.scan("home")
	while (scanned.length > 0) {
		// check the last item in the list, if it is not in the server list, discard it
		let s = scanned.pop()
		if (!servers.includes(s) && !filters.includes(s)) {
			servers.push(s)
			// add the new server to the scan list
			scanned = scanned.concat(ns.scan(s))
		}
	}

	// send all the hack files to all the servers
	for (let s = 0; s < servers.length; s++) {
		if (ns.hasRootAccess(servers[s])) {
			for (let f = 0; f < files.length; f++) {
				await ns.scp(files[f], "home", servers[s])
			}
		}
	}
	// send all files to the purchased servers
	let pServers = ns.getPurchasedServers()
	for (let s = 0; s < pServers.length; s++) {
		if (ns.hasRootAccess(pServers[s])) {
			for (let f = 0; f < files.length; f++) {
				await ns.scp(files[f], "home", pServers[s])
			}
		}
	}


	// ------------------->>>>>>>>>>>>> MAIN LOOP <<<<<<<<<<<<<<-------------------
	while (true) {

		// ------------------->>>>>>>>>>>>> SETUP <<<<<<<<<<<<<<-------------------

		// make sure we can hack the server and it has money on it
		let hackableServer = []
		for (let h = 0; h < servers.length; h++) {
			if (ns.getServerRequiredHackingLevel(servers[h]) <= ns.getHackingLevel() && ns.getServerMaxMoney(servers[h]) > 0 && ns.hasRootAccess(servers[h])) {
				hackableServer.push(servers[h])
			}
		}


		let targets = hackableServer
		// if your hacking level is above 1000 and you have 512 ram servers:
		if (ns.getHackingLevel() > 1000 && ns.getServerMaxRam("pServer-0") >= 512) {
			targets = []
			// only hack servers with more that 1 billion in max money
			for (let s = 0; s < hackableServer.length; s++) {
				if (ns.getServerMaxMoney(hackableServer[s]) > 1000000000) {
					targets.push(hackableServer[s])
				}
			}
		}




		// ------------------->>>>>>>>>>>>> BASIC TARGET ALLOCATION FOR PSERVERS <<<<<<<<<<<<<<-------------------
		// add a count for the targetss and pServers
		let count = 0
		for (let s = 0; s < pServers.length; s++) {
			//write and send the target files
			if (pServers[s] != "home") {
				await ns.write("target.txt", targets[count], "w")
				await ns.scp("target.txt", "home", pServers[s])
			}

			// if hackFileManager.js isn't running on pServer, run it unless it isn't there
			if (!ns.scriptRunning("hackFileManager.js", pServers[s]) && pServers[s] != "home") {
				// kill all files running on the server
				await ns.killall(pServers[s])
				await ns.sleep(100)
				if (ns.fileExists("hackFileManager.js") && ns.getServerMaxRam(pServers[s]) >= 32) {
					await ns.exec("hackFileManager.js", pServers[s], 1)
				}
				else {
					// execute the targetedBasicCycle.js if the manager is not there
					await ns.exec(files[0], pServers[s], (ns.getServerMaxRam(pServers[s]) / ns.getScriptRam(files[0])))
				}
			}
			// refresh the pServer file manager
			else if (ns.scriptRunning("hackFileManager.js", pServers[s]) && pServers[s] != "home") {
				// kill all files running on the server
				await ns.killall(pServers[s])
				await ns.sleep(100)
				await ns.exec("hackFileManager.js", pServers[s], 1)
			}

			count++
			// if the count gets to the end of hackable servers, reset the count
			if (count == targets.length) {
				count = 0
			}

		}


		// ------------------->>>>>>>>>>>>> BASIC TARGET ALLOCATION FOR REG SERVERS <<<<<<<<<<<<<<-------------------

		// generate a list of servers which have ram to hack
		let rServers = []
		for (let s = 0; s < servers.length; s++) {
			if (!rServers.includes(servers[s]) && ns.getServerMaxRam(servers[s]) > 2) {
				rServers.push(servers[s])
			}
		}


		// --------------  REGULAR SERVERS

		// reverse the server list to attempt to avoid too much doubling of targets
		rServers.reverse()

		// send the targetdBasicCycle.js file if the server doesn't have it
		for (let f = 0; f < rServers.length; f++) {
			await ns.scp(files[0], "home", rServers[f])
		}

		// set the count back to zero
		count = 0

		// add a count for the targets and rServers
		for (let s = 0; s < rServers.length; s++) {
			//write and send the target files
			await ns.write("target.txt", targets[count], "w")
			await ns.scp("target.txt", "home", rServers[s])
			// kill all files running on the server
			await ns.killall(rServers[s])
			await ns.sleep(100)
			if (ns.getServerMaxRam(rServers[s]) > 32) {
				// execute the targetedBasicCycle.js
				await ns.exec("hackFileManager.js", rServers[s], 1)
				count++
			}
			else {
				// execute the targetedBasicCycle.js
				await ns.exec(files[0], rServers[s], (ns.getServerMaxRam(rServers[s]) / ns.getScriptRam(files[0])))
				count++
			}

			// if the count gets to the end of hackable servers, reset the count
			if (count == targets.length) {
				count = 0
			}
		}


		// -------------- HOME SERVER

		// refresh the home file manager here as target.txt has finished cycling through everything
		if (ns.scriptRunning("hackFileManager.js", "home")) {
			for (let f = 0; f < homeCycleFiles.length; f++) {
				await ns.kill(homeCycleFiles[f], "home")
				await (100)
			}
			await ns.exec("hackFileManager.js", "home", 1)
		}
		else if (!ns.scriptRunning("hackFileManager.js", "home")) {
			await ns.exec("hackFileManager.js", "home", 1)
		}

		await ns.sleep(1800000)
	}
}
