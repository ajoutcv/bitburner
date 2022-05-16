/** @param {NS} ns */
export async function main(ns) {
	let target = ns.read("target.txt")
	await ns.weaken(target)
}
