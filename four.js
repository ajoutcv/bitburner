import { getNPServers } from "one.js";
/** @param {NS} ns */
/**
 * Pulls contract locations from the network and attempts to auto-solve them
 */

// largestPrimeFactor
export function largestPrimeFactor(ns, dataSet) {
	// give a default value to maxPrime
	let maxPrime = -1;
	// check if the number is divisible by 2
	while (dataSet % 2 == 0) {
		// keep dividing it until we reach the base
		dataSet /= 2
		maxPrime = 2
	}
	// check if the number is divisible by 3
	while (dataSet % 3 == 0) {
		dataSet /= 3
		maxPrime = 3
	}
	// check if the number is divisible by 5 and every other prime number up to the square root of the number
	for (let i = 5; i <= Math.sqrt(dataSet); i += 6) {
		while (dataSet % i == 0) {
			maxPrime = i;
			dataSet = dataSet / i;
		}
		while (dataSet % (i + 2) == 0) {
			maxPrime = i + 2;
			dataSet = dataSet / (i + 2);
		}
	}
	// return the dataSet if it's remaining number is above 4
	if (dataSet > 4) {
		return dataSet
	}
	// otherwise return the max prime factor
	else {
		return maxPrime
	}
}


// solves the stocktraderI problem
function algorithmicStockTraderI(ns, dataSet) {
	return undefined
}

// algorithmicStockTraderII
function algorithmicStockTraderII(ns, dataSet) {

	return undefined
}

// algorithmicStockTraderIII
function algorithmicStockTraderIII(ns, dataSet) {
	return undefined
}
// algorithmicStockTraderIV
function algorithmicStockTraderIV(ns, dataSet) {
	return undefined;
}

// totalWaysToSum
function totalWaysToSum(ns, dataSet) {
	return undefined;
}

// totalWaysToSumII
function totalWaysToSumII(ns, dataSet) {
	return undefined;
}

// Minimum Path Sum in a Triangle
function minimumPathSumTriangle(ns, dataSet) {
	return undefined;
}

// findAllValidMathExpressions
function findAllValidMathExpressions(ns, dataSet) {
	return undefined;
}



// subarrayWithMaximumSum ------------<<<<<<<<<<< wrong
function subarrayWithMaximumSum(ns, dataSet) {
	let count = 1
	let subArrays = []
	let testArray = []
	for (let i = 0; i < dataSet.length; i++) {
		// contiguous
		if (dataSet[i] < dataSet[count]) {
			testArray.push(dataSet[i])
		}
		// hitting a wall
		else {
			testArray.push(dataSet[i])
			subArrays.push(testArray)
			testArray = []
		}
		count++
	}
	let maxValues = []
	let tempValue = 0;
	// find the sum of the array totals
	for (let i = 0; i < subArrays.length; i++) {
		// for each item in that subarray grab the sum
		for (let j = 0; j < subArrays[i].length; j++) {
			tempValue += subArrays[i][j]
		}
		maxValues.push(tempValue)
		tempValue = 0
	}
	let answer = Math.max.apply(0, maxValues);
	return answer;

}

// hammingCodesBinToInt
function hammingCodesBinToInt(ns, dataSet) {
	return undefined;
}

// arrayJumpingGameII
function arrayJumpingGameII(ns, dataSet) {
	return 0
}

// spiralizeMatrix
function spiralizeMatrix(ns, dataSet) {
	return undefined;
}

// mergeOverlappingIntervals
function mergeOverlappingIntervals(ns, dataSet) {
	return undefined;
}

// uniquePathsGridI
function uniquePathsGridI(ns, dataSet) {
	return undefined;
}

// sanitizeParenthesesInExpression
function sanitizeParenthesesInExpression(ns, dataSet) {
	return undefined;
}



// MAIN FUNCTION
export async function main(ns) {
	let cctPattern = /\.cct/
	let servers = getNPServers(ns)
	let cctFiles = []
	let contractServers = []

	// get the contracts on servers if any
	for (let h = 0; h < servers.length; h++) {
		if (ns.ls(servers[h]) != 0) {
			// create a file dump to check through
			let files = ns.ls(servers[h])
			for (let f = 0; f < files.length; f++) {
				// check for regex contract files and send to list to be written to file
				if (cctPattern.test(files[f]) && !cctFiles.includes(files[f])) {
					contractServers.push(servers[h])
					cctFiles.push(files[f])
				}
			}
		}
	}
	if (contractServers.length == 0) {
		ns.tprint("No contracts found.")
	}
	else {
		ns.tprint("Contracts Found: " + cctFiles.length)
		// check each server on the list
		for (let s = 0; s < contractServers.length; s++) {
			let contractType = ns.codingcontract.getContractType(cctFiles[s], contractServers[s])
			let contractData = ns.codingcontract.getData(cctFiles[s], contractServers[s])
			ns.tprint(contractType)
			// check through each file on the server

			// ---------- WORKING ----------
			// pretty sure this is working fine
			if (contractType == "Find Largest Prime Factor") {
				ns.tprint("attempting " + contractType + " on " + contractServers[s])
				let dataSet = contractData;
				let answer = largestPrimeFactor(ns, dataSet);
				// attempt to answer the question
				let result = ns.codingcontract.attempt(answer, cctFiles[s], contractServers[s])
				if (!result) {
					ns.tprint("Failed attempt at " + contractType)
				}
				else {
					ns.tprint("Successful!")
				}
				ns.tprint("")
			}



			// checked with dummy code and contract array. seems to work fine <<<<------- doesnt work, might be the subarray thing
			if (contractType == "Subarray with Maximum Sum") {
				ns.tprint("attempting " + contractType + " on " + contractServers[s])
				let dataSet = contractData;
				let answer = subarrayWithMaximumSum(ns, dataSet);
				// attempt to answer the question
				// ns.tprint(ns.codingcontract.getDescription(cctFiles[s], contractServers[s]))
				let result = ns.codingcontract.attempt(answer, cctFiles[s], contractServers[s])
				if (!result) {
					ns.tprint("Failed attempt at " + contractType)
				}
				else {
					ns.tprint("Successful!")
				}
				ns.tprint("")
			}

			// ---------- NOT WORKING ----------
			if (contractType == "Algorithmic Stock Trader I") {
				ns.tprint("attempting " + contractType + " on " + contractServers[s])
				let dataSet = contractData;
				let answer = algorithmicStockTraderI(ns, dataSet);
				// attempt to answer the question
				// let result = ns.codingcontract.attempt(answer, cctFiles[s], contractServers[s])
				// if (!result) {
				// 	ns.tprint("Failed attempt at " + contractType)
				// }
				// ns.tprint("")

			}

			if (contractType == "Algorithmic Stock Trader II") {
				ns.tprint("attempting " + contractType + " on " + contractServers[s])
				let dataSet = contractData;
				let answer = algorithmicStockTraderII(ns, dataSet);
				// ns.tprint(ns.codingcontract.getDescription(cctFiles[s], contractServers[s]))
				// attempt to answer the question
				// ns.tprint(ns.codingcontract.getNumTriesRemaining(cctFiles[s],contractServers[s]))
				// ns.codingcontract.attempt(answer, cctFiles[s], contractServers[s])


			}

			if (contractType == "Algorithmic Stock Trader III") {
				ns.tprint("attempting " + contractType + " on " + contractServers[s])
				let dataSet = contractData;
				let answer = algorithmicStockTraderIII(ns, dataSet);
				// ns.tprint(ns.codingcontract.getDescription(cctFiles[s],contractServers[s]))
				// attempt to answer the question
				// ns.codingcontract.attempt(answer, cctFiles[s], contractServers[s])
			}

			if (contractType == "Algorithmic Stock Trader IV") {
				ns.tprint("attempting " + contractType + " on " + contractServers[s])
				let dataSet = contractData;
				let answer = algorithmicStockTraderIV(ns, dataSet);
				// attempt to answer the question
				// ns.codingcontract.attempt(answer, cctFiles[s], contractServers[s])
			}
			if (contractType == "Total Ways to Sum") {
				ns.tprint("attempting " + contractType + " on " + contractServers[s])
				let dataSet = contractData;
				let answer = totalWaysToSum(ns, dataSet);
				// attempt to answer the question
				// ns.codingcontract.attempt(answer, cctFiles[s], contractServers[s])
			}


			if (contractType == "Total Ways to Sum II") {
				ns.tprint("attempting " + contractType + " on " + contractServers[s])
				let dataSet = contractData;
				let answer = totalWaysToSumII(ns, dataSet);
				// attempt to answer the question
				// ns.codingcontract.attempt(answer, cctFiles[s], contractServers[s])
			}

			if (contractType == "Minimum Path Sum in a Triangle") {
				ns.tprint("attempting " + contractType + " on " + contractServers[s])
				let dataSet = contractData;
				let answer = minimumPathSumTriangle(ns, dataSet);
				// ns.tprint(ns.codingcontract.getDescription(cctFiles[s],contractServers[s]))
				// attempt to answer the question
				// ns.codingcontract.attempt(answer, cctFiles[s], contractServers[s])
			}

			if (contractType == "Spiralize Matrix") {
				ns.tprint("attempting " + contractType + " on " + contractServers[s])
				let dataSet = contractData;
				let answer = spiralizeMatrix(ns, dataSet);
				// attempt to answer the question
				// ns.codingcontract.attempt(answer, cctFiles[s], contractServers[s])

			}

			if (contractType == "HammingCodes: Encoded Binary to Integer") {
				ns.tprint("attempting " + contractType + " on " + contractServers[s])
				let dataSet = contractData;
				let answer = hammingCodesBinToInt(ns, dataSet);

				// attempt to answer the question
				// ns.codingcontract.attempt(answer, cctFiles[s], contractServers[s])
			}

			// works if the first number in the array is 0
			if (contractType == "Array Jumping Game II") {
				ns.tprint("attempting " + contractType + " on " + contractServers[s])
				let dataSet = contractData;
				let answer = arrayJumpingGameII(ns, dataSet);
				// ns.tprint(ns.codingcontract.getDescription(cctFiles[s],contractServers[s]))
				// attempt to answer the question
				// let result = ns.codingcontract.attempt(answer, cctFiles[s], contractServers[s])
				// if(!result){
				// 	ns.tprint("Failed attempt at "+contractType)
				// }
				// else{
				// 	ns.tprint("Successful!")
				// }
				// ns.tprint("")
			}

			if (contractType == "Merge Overlapping Intervals") {
				ns.tprint("attempting " + contractType + " on " + contractServers[s])
				let dataSet = contractData;
				let answer = mergeOverlappingIntervals(ns, dataSet);
				// attempt to answer the question
				// ns.codingcontract.attempt(answer, cctFiles[s], contractServers[s])
			}

			if (contractType == "Unique Paths in a Grid I") {
				ns.tprint("attempting " + contractType + " on " + contractServers[s])
				let dataSet = contractData;
				let answer = uniquePathsGridI(ns, dataSet);

				// attempt to answer the question
				// ns.codingcontract.attempt(answer, cctFiles[s], contractServers[s])
			}

			if (contractType == "Find All Valid Math Expressions") {
				ns.tprint("attempting " + contractType + " on " + contractServers[s])
				let dataSet = contractData;
				let answer = findAllValidMathExpressions(ns, dataSet);
				// ns.tprint(ns.codingcontract.getDescription(cctFiles[s],contractServers[s]))

				// attempt to answer the question
				// ns.codingcontract.attempt(answer, cctFiles[s], contractServers[s])
			}

			if (contractType == "Sanitize Parentheses in Expression") {
				ns.tprint("attempting " + contractType + " on " + contractServers[s])
				let dataSet = contractData;
				let answer = sanitizeParenthesesInExpression(ns, dataSet);
				// ns.tprint(ns.codingcontract.getDescription(cctFiles[s],contractServers[s]))

				// attempt to answer the question
				// ns.codingcontract.attempt(answer, cctFiles[s], contractServers[s])
			}




		}
	}

}
