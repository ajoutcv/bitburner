/** @param {NS} ns */
export async function main(ns) {
	let files = ["basicCycle.js", "hackFileManager.js", "hack.js", "weaken.js", "grow.js"]
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



	//------------->>>>>>> PSERVERS <<<<<<<<<<<<----------------

	let pServers = ns.getPurchasedServers()
	for (let h = 0; h < pServers.length; h++) {
		for (let f = 0; f < files.length; f++) {
			await ns.scp(files[f], "home", pServers[h])
		}
		await ns.kill(files[0], pServers[h])
		await ns.scp(files[0], "home", pServers[h])
		await ns.exec(files[0], pServers[h], (ns.getServerMaxRam(pServers[h]) / ns.getScriptRam(files[0])))
	}



	//------------->>>>>>> NORMAL SERVERS <<<<<<<<<<<<----------------
	// send and execute the files
	for (var h = 0; h < servers.length; h++) {
		if (ns.hasRootAccess && ns.getServerMaxRam(servers[h]) > 2) {
			await ns.kill(files[0], servers[h])
			await ns.scp(files[0], "home", servers[h])
			await ns.exec(files[0], servers[h], (ns.getServerMaxRam(servers[h]) / ns.getScriptRam(files[0])))
		}
	}
}
