/** @param {NS} ns */
export async function main(ns) {
	/* Sets up the initial game load.
	   Runs the serverStartup after load to begin purchasing base servers
	*/
	let initialTarget = "n00dles"
	let files = ["basicCycle.js"]
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


	// ------------------->>>>>>>>>>>>> PORT ATTACK & INITIAL FILES <<<<<<<<<<<<<<-------------------
	// check player port attack files
	let portFiles = 0

	if (ns.fileExists("BruteSSH.exe")) { var ssh = true; portFiles++ }
	if (ns.fileExists("FTPCrack.exe")) { var ftp = true; portFiles++ };
	if (ns.fileExists("relaySMTP.exe")) { var smtp = true; portFiles++ };
	if (ns.fileExists("HTTPWorm.exe")) { var http = true; portFiles++ };
	if (ns.fileExists("SQLInject.exe")) { var sql = true; portFiles++ };


	// run through the servers, attack port and nuke servers
	for (let h = 0; h < servers.length; h++) {

		if (!ns.hasRootAccess(servers[h]) && ns.getServerNumPortsRequired(servers[h]) <= portFiles) {
			if (ssh) { await ns.brutessh(servers[h]) }
			if (ftp) { await ns.ftpcrack(servers[h]) }
			if (smtp) { await ns.relaysmtp(servers[h]) }
			if (http) { await ns.httpworm(servers[h]) }
			if (sql) { await ns.sqlinject(servers[h]) }

			await ns.nuke(servers[h])
			if (ns.hasRootAccess(servers[h]) && ns.getServerMaxRam(servers[h]) > 2) {
				await ns.scp(files[0], "home", servers[h])
				await ns.exec(files[0], servers[h], (ns.getServerMaxRam(servers[h]) / ns.getScriptRam(files[0])))
			}
		}
		else if(!ns.hasRootAccess(servers[h]) && ns.getServerNumPortsRequired(servers[h]) == 0){
			await ns.nuke(servers[h])
			await ns.scp(files[0], "home", servers[h])
			await ns.exec(files[0], servers[h], (ns.getServerMaxRam(servers[h]) / ns.getScriptRam(files[0])))
		}
	}
	ns.tprint("finished checking servers to exploit")

	// check if you need to buy base servers
	if (ns.getPurchasedServers().length == 0) {
		ns.tprint("starting base server purchasing")
		await ns.exec("serverStartup.js", "home", 1)
	}
	// check if hackFileManager.js has started, if not, start it up
	if (!ns.isRunning("hackFileManager.js", "home")) {
		ns.tprint("starting hackFileManager.js")
		await ns.write("target.txt", initialTarget, "w")
		await ns.exec("hackFileManager.js", "home", 1)
	}
}
