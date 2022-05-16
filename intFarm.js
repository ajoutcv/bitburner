/** @param {NS} ns */
export async function main(ns) {
	// automatcially joins factions and then soft resets after 10m/s
	let invites = await ns.singularity.checkFactionInvitations();
	if (invites.length >= 10) {
		for (let i = 0; i < invites.length; i++) {
			await ns.singularity.joinFaction(invites[i]);
		}
		await ns.sleep(10);
		await ns.singularity.softReset('test.js')
	}
	else {
		ns.tprint(`You only have ${invites.length} invites. To get the max xp for time join more corp factions.`)
		ns.tprint(invites)
	}
}
