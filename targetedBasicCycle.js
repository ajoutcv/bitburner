/** @param {NS} ns */
export async function main(ns) {
	var target = ns.read("target.txt")
	while (true) {
		if (ns.getServerMinSecurityLevel(target) + 5 < ns.getServerSecurityLevel(target)) {
			await ns.weaken(target)
		}
		else if (ns.getServerMaxMoney(target) * .85 > ns.getServerMoneyAvailable(target)) {
			await ns.grow(target)
		}
		else {
			await ns.hack(target)
		}
		await ns.sleep(1000)
	}

}
