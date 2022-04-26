/** @param {NS} ns */
export async function main(ns) {
	/* automatically check if the player servers need to be upgraded
	 * when you upgrade, upgrade all server at once to minimize downtime
	 * keep upgrading until you hit the maximum pServer ram the game will allow
	*/

	// the file we need to send to the upgraded servers
	let files = ["hackFileManager.js", "hack.js", "weaken.js", "grow.js"]
	// set the base ram
	let ram = 16
	// generate a list of pServers
	let pServers = ns.getPurchasedServers()

	// check that we haven't hit the max pServer ram in the game
	// -------------->>>> disable access to the pServers while in the loop to avoid shutting it down from connection issues
	while (ram != ns.getPurchasedServerMaxRam()) {

		// check the server ram level
		if (ns.getServerMaxRam(pServers[0]) < ram) {
			// check if we have enough money to upgrade the servers to the next tier
			if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram) * 25) {
				ns.toast(`Upgrading servers to: ${ram}`)
				//iterate through the servers and upgrade them
				for (let s = 0; s < pServers.length; s++) {
					await ns.killall(pServers[s])
					await ns.deleteServer(pServers[s])
					await ns.purchaseServer(pServers[s], ram)
					await ns.sleep(100)
					for(let f = 0;f<files.length;f++){
						await ns.scp(files[f],"home",pServers[s])
					}
				}
				// change the ram tier to the next level
				ram = ram * 2
				// check to see if targetManager.js is running, if not, refresh it
				await ns.kill("targetManager.js","home")
				await ns.sleep(1000)
				await ns.exec("targetManager.js", "home", 1)
			}
		}
		// if the server ram is already equal to or greater than the set ram,
		// upgrade the ram variable to the next tier
		else if (ns.getServerMaxRam(pServers[0]) >= ram) {
			ram = ram * 2
		}
		await ns.sleep(1000)

	}
	await ns.sleep(10000)
	ns.toast("Servers upgraded to max ram!")
}
