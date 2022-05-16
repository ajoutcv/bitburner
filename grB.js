/**
 * A bonus grow file for any extra availble threads on a server after it's executed hack/grow/weaken
 */
/** @param {NS} ns */
export async function main(ns) {
	let target = ns.read("target.txt")
	await ns.grow(target)
}
