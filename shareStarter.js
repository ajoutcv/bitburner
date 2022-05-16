/** @param {NS} ns */
import { getPServers, getThreads } from "one.js";

export async function main(ns) {
	let servers = getPServers(ns);
	for (let s = 0; s < servers.length; s++) {
		if(servers[s] != "home"){
			await ns.scp("shareComp.js", "home", servers[s])
		}
		await ns.exec("shareComp.js", servers[s], getThreads(ns, servers[s], "shareComp.js"))
	}
}
