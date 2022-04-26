/** @param {NS} ns */
export async function main(ns) {
	/* Pulls the files from all servers and copies them back to the home server
	 */

	// REGEX PATTERNS
	let litPattern = /\.lit/
	let cctPattern = /\.cct/


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


	// ------------------->>>>>>>>>>>>> FILE PULL <<<<<<<<<<<<<<-------------------
	let litFiles = []
	let cctFiles = []
	let cctServers = []


	for (let h = 0; h < servers.length; h++) {
		if (ns.ls(servers[h]) != 0) {
			// create a file dump to check through
			let files = ns.ls(servers[h])
			for (let f = 0; f < files.length; f++) {
				// check for regex lit pattern
				if (litPattern.test(files[f]) && !litFiles.includes(files[f])) {
					// add to list then send the file to home
					litFiles.push(files[f])
					await ns.scp(files[f], servers[h], "home")
				}
				// check for regex contract files and send to list to be written to file
				else if (cctPattern.test(files[f]) && !cctFiles.includes(files[f])) {
					cctServers.push(servers[h])
					cctFiles.push(files[f])
				}
			}
		}
	}
	// pull the contracts and their locations and chuck them into a .txt file
	ns.clear("contractList.txt")
	for (let f = 0; f < cctFiles.length; f++) {
		await ns.write("contractList.txt",`${cctServers[f]}\n${cctFiles[f]}\n`,"a")
	}
	ns.tprint(cctFiles.length)
	ns.tprint(cctServers.length)
}
