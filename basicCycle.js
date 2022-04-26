/** @param {NS} ns */
export async function main(ns) {
	var target = "n00dles"
	while (true) {
		if (ns.getServerMinSecurityLevel(target) + 5 < ns.getServerSecurityLevel(target)) {
			await ns.weaken(target)
		}
		else if (ns.getServerMaxMoney(target) * .75 > ns.getServerMoneyAvailable(target)) {
			await ns.grow(target)
		}
		else {
			await ns.hack(target)
		}
		await ns.sleep(1000)
	}
}
