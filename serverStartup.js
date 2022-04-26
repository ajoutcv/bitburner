/** @param {NS} ns */
export async function main(ns) {
	// this will continue to loop until the count is complete, meaning you might get weird server names
	// if you run it twice. It's only meant to be run once to get to the max server limit
	var files = ["basicCycle.js", "upgradeCheck.js"]
	var ram = 8
	var count = 0 + ns.getPurchasedServers().length


	// check the player money
	while (count < ns.getPurchasedServerLimit()) {
		if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)) {
			ns.purchaseServer("pServer-" + count, ram)
			await ns.scp(files[0], "home", "pServer-" + count)
			await ns.exec(files[0], "pServer-" + count, (ns.getServerMaxRam("pServer-" + count) / ns.getScriptRam(files[0])))
			count++
		}
		await ns.sleep(1000)
	}
	ns.toast("Initial servers purchased.")
	await ns.sleep(3000)
	ns.toast("Starting server upgrader.")
	await ns.exec(files[1], "home", 1)
}
