/** @param {NS} ns */
export async function main(ns) {
	/* runs off the host it is on and cycles through the weaken/hack/grow cycle
	   aiming to optomize the total ram

		variables:
		"target.txt" - sent through by targetManager.js on "home". This is the target server the manager
							   has selected.

	 * This code can by further optomized by tweaking the thread count values for each weaken/hack/grow.
	 * This will be done later on

	*/

	let target = ns.read("target.txt")

	// MAIN LOOP
	while (true) {
		// check the available ram on the server to see if we can perform actions
		let serverAvailableRam = ns.getServerMaxRam(ns.getHostname()) - ns.getServerUsedRam(ns.getHostname())
		if (serverAvailableRam >= 0) {
			// check which programs are running on the server
			// try to run weaken
			if (!ns.isRunning("weaken.js", ns.getHostname())) {
				if (ns.getServerMinSecurityLevel(target) < ns.getServerSecurityLevel(target)) {
					await ns.exec("weaken.js", ns.getHostname(), ((serverAvailableRam * .50) / ns.getScriptRam("weaken.js")))
				}
			}
			// try to run grow
			if (!ns.isRunning("grow.js", ns.getHostname())) {
				if (ns.getServerMaxMoney(target) * .90 > ns.getServerMoneyAvailable(target)) {
					await ns.exec("grow.js", ns.getHostname(), ((serverAvailableRam * .90) / ns.getScriptRam("grow.js")))
				}
			}
			// try to run hack, aiming for 50% of total server money
			if (!ns.isRunning("hack.js", ns.getHostname())) {
				if (ns.getServerMoneyAvailable(target) >= ns.getServerMaxMoney(target) * .90) {
					if ((ns.getServerMaxRam(ns.getHostname()) - ns.getServerUsedRam(ns.getHostname())) >= serverAvailableRam) {
						await ns.exec("hack.js", ns.getHostname(), (serverAvailableRam * .90 / ns.getScriptRam("hack.js")))
					}
				}
			}
		}
		await ns.sleep(1000)
	}
}
