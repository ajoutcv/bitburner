/** @param {NS} ns */
export async function main(ns) {
	// ------------------->>>>>>>>>>>>> NETWORK CRAWL <<<<<<<<<<<<<<-------------------
	// have a server list of targets
	let servers = []
	let filters = ns.getPurchasedServers()
	filters.push("darkweb")
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

	// MAPPING
	// write the map out by iterating over every server and scanning it
	// the host is first written as append
	// the servers connected to the host are written after it
	ns.clear("map.txt")
	for(let s=0;s<servers.length;s++){
		// if not in filters
		if(!filters.includes(servers[s])){
			await ns.write("map.txt",`${servers[s]}:\n`,"a")
			let tempScan = ns.scan(servers[s])
			// for each server connected to the server, append it to the list
			for(let h=0;h<tempScan.length;h++){
				await ns.write("map.txt",`${tempScan[h]}\n`,"a")
			}
			await ns.write("map.txt","\n","a")

		}


	}

}
