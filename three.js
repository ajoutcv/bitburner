/** @param {NS} ns */
/**
 * purchase the initial servers then continues to upgrade them to their max level
 */
export async function main(ns) {
	ns.toast("Purchasing initial servers")
	var ram = 8
	var count = 0 + ns.getPurchasedServers().length

	// check the player money
	while (count < ns.getPurchasedServerLimit()) {
		if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)) {
			ns.purchaseServer("pServer-" + count, ram)
			count++
		}
		await ns.sleep(100)
	}
	ns.toast("Initial servers purchased.")
	await ns.sleep(3000)
	ns.toast("Starting server upgrader.")
	// generate a list of pServers
	let pServers = ns.getPurchasedServers()
	ram = ram*2

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
				}
				// change the ram tier to the next level
				ram = ram * 2
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
