
var roles = ["DPS", "Tank", "Support", "Flex"];

// Order in which roles will be filled into the teams
var slot_order = [
	['blue', 0],
	['red', 0],
	['red', 1],
	['blue', 1],
	['blue', 2],
	['red', 2],
	['red', 3],
	['blue', 3],
	['blue', 4],
	['red', 4],
	['red', 5],
	['blue', 5],
];

// Slot numbers along with the roles that will be filled into those slots depending on the available player roles
var slot_roles = [
	['DPS', 'Flex'], // DPS slot
	['Tank', 'Flex'], // Tank slot
	['Support', 'Flex'], // Support slot
	['DPS', 'Flex'], // 2nd DPS slot
	['Support', 'Flex', 'DPS'], // 2nd Support slot
	['Flex', 'Tank', 'Support', 'DPS'] // Flex slot
];

// Similar to Python's range(x, y)
function arrayRange(from, to) {
	arr = [];
	for (i = from; i < to; i++) {
		arr.push[i];
	}
	return arr;
}

// Returns given the number of roles, which role should be set at the passed index
function getSlot(roleCounts, index) {
	errors = [
		"Not enough DPS or Flex players.",
		"Not enough Tank or Flex players.",
		"Not enough Support or Flex players.",
		"Not enough DPS or Flex players.",
		"Not enough Support, Flex or DPS players.",
		"This error should not appear?"
	];
	for (i = 0; i < slot_roles[index].length; i++) {
		if (roleCounts[slot_roles[index][i]] > 0) {
			roleCounts[slot_roles[index][i]]--;
			return slot_roles[index][i];
		}
	}
	return errors[index];
}

// Return an array with 12 slots, 6 for blue, 6 for red
function getSlotRoles(plrs) {
	var success = true;
	var roleCounts = {
		DPS: 0,
		Tank: 0,
		Support: 0,
		Flex: 0
	};
	for (i = 0; i < plrs.length; i++) {
		roleCount[plrs[i]['role']]++;
	}
	var set_slots = {
		blue: [],
		red: []
	};
	for (i = 0; i < slot_order.length; i++) {
		nextRole = getSlot(roleCounts, slot_order[i][1]);
		if (['DPS', 'Tank', 'Support', 'Flex'].includes(nextRole)) {
			set_slots[slot_order[i][0]].push(nextRole);
		} else {
			return nextRole;
		}
	}
	return set_slots;
}

// Checks if the current team is better, then replaces it if so
var bestTeam = null;
var lowestDif = Infinity;
function checkBestTeam(comb) {
	totalBlue = 0;
	totalRed = 0;
	for (i = 0; i < 12; i++) {
		if (i < 6) { // blue player
			totalBlue += comb[i]['sr'];
		} else { // red player
			totalRed += comb[i]['sr'];
		}
	}
	avgBlue = totalBlue/6;
	avgRed = totalRed/6;
	if (Math.abs(avgBlue-avgRed) < lowestDif) {
		bestTeam = {
			blue: comb.slice(0, 6),
			red: comb.slice(6, 12),
			blueAvg: avgBlue,
			redAvg: avgRed
		}
		lowestDif = Math.abs(avgBlue-avgRed);
	}
	// TO DO: FINISH THIS BLOCK AND SEPERATE DPS AVERAGE FROM TEAM AVERAGE
}

// Finds and stores all combinations (overwrites best stored combination)
var curCombination = [null, null, null, null, null, null, null, null, null, null, null, null];
function findCombinations(slotInfo, teamroles, tProgress, depth) {
	var curRole = teamroles[tProgress]['role'];
	var curTeam = teamroles[tProgress]['team'];
	var roleInfo = slotInfo[curRole][curTeam];
	var plrs = roleInfo[curRole]['plrs']
	if (roleInfo['fill'] == roleInfo['slots'].length) {
		// Slots filled, skip to next team/role slot recursively
		// Recursive call here in case you have like 0 Tank/Support players so youi can skip the loop
		findCombinations(slotInfo, teamroles, tProgress+1, depth);
	} else {
		// range includes numbers up to plrs.length-1 excluding those also in the blueindexes array
		var indexes = arrayRange(roleInfo['prev']+1, plrs.length);
		if (curTeam == 'red') { // IN THE PYTHON CODE THIS IS WHERE I MADE A MISTAKE, I PUT BLUE INSTEAD OF RED
			indexes = (arrayRange(roleInfo['prev']+1, plrs.length)).filter(function(e) {return !slotInfo[curRole]['blueindexes'].includes(e);});
		}
		indexes.forEach(function(num) {
			curCombination[roleInfo['slots'][roleInfo['fill']]] = plrs[num];
			if (curTeam == 'blue') { // push to blueindexes
				slotInfo[curRole]['blueindexes'].push(num);
			}
			roleInfo['fill']++;
			if (depth == 11) {
				checkBestTeam(curCombination);
			} else {
				var oldPrev = roleInfo['prev'];
				roleInfo['prev'] = num;
				findCombinations(slotInfo, teamroles, tProgress, depth+1);
				roleInfo['prev'] = oldPrev;
			}
			roleInfo['fill']--;
			if (curTeam == 'blue') { // remove from blueindexes if blue
				slotInfo[curRole]['blueindexes'].pop();
			}
		});
	}
}

/* arrA minus arrB
arrA = [1, 3, 4, 7];
arrB = [2, 3, 6, 7, 8];
arrC = arrA.filter(function(e) {return !arrB.includes(e);});
*/

// Initializer of function above
function startCombinations(sRoles, plrs) {
	// Hull for slot info
	var sInfo = {
		DPS: {
			plrs: [], // players with the DPS role
			blueindexes: [], // 
			blue: {slots: [], fill: 0, prev: -1}, // slots: indexes to fill, fill: number of filled indexes: prev: index to jump back to
			red: {slots: [], fill: 0, prev: -1},
		},
		Tank: {
			plrs: [],
			blueindexes: [],
			blue: {slots: [], fill: 0, prev: -1},
			red: {slots: [], fill: 0, prev: -1},
		},
		Support: {
			plrs: [],
			blueindexes: [],
			blue: {slots: [], fill: 0, prev: -1},
			red: {slots: [], fill: 0, prev: -1},
		},
		Flex: {
			plrs: [],
			blueindexes: [],
			blue: {slots: [], fill: 0, prev: -1},
			red: {slots: [], fill: 0, prev: -1},
		}
	};
	// Fill plrs tables
	plrs.forEach(function(plr) {
		sInfo[plr['role']]['plrs'].push(plr); // pushes a reference!
	});
	// Initialize slots for blue and red
	var counter = 0;
	sRoles['blue'].forEach(function(bluerole) {
		sInfo[bluerole]['blue']['slots'].push(++counter);
	});
	counter = 0;
	sRoles['red'].forEach(function(redrole) {
		sInfo[redrole]['red']['slots'].push(++counter);
	});
	//var concatRoles = sRoles['blue'].concat(sRoles['red']); // one array is more convenient for the upcoming recursive call
	var rolesOrder = [
		{role: 'DPS', team: 'blue'}, {role: 'DPS', team: 'red'},
		{role: 'Tank', team: 'blue'}, {role: 'Tank', team: 'red'},
		{role: 'Support', team: 'blue'}, {role: 'Support', team: 'red'},
		{role: 'Flex', team: 'blue'}, {role: 'Flex', team: 'red'}
	];
	findCombinations(sInfo, rolesOrder, 0, 0);
}

// Fairly balances teams and returns teams
function generateTeams(plrsArray) { // player example: {name: 'John', sr: 5000, role: 'Flex'}
	// Step 1. Return value in advance + reset global variables
	var generated = {
		teams: {
			blue: [],
			red: []
		},
		average: {
			blue: 0,
			red: 0
		},
		errorMessage: "",
		success: true
	};
	curCombination = [null, null, null, null, null, null, null, null, null, null, null, null];
	lowestDif = Infinity;
	bestTeam = null;
	// Step 2. Set slot roles
	slotRoles = getSlotRoles(plrsArray); // returns {blue: [...], red: [...]}
	if (typeof(slotRoles) == 'string') {
		generated['errorMessage'] = slotRoles;
		generated['success'] = false;
		return generated; // early termination
	}
	// Step 3. Get all sorting combinations
	startCombinations(slotRoles, plrsArray);
	// Step 4. Find the most balanced combination
	if (bestTeam != null) {
		generated['teams']['blue'] = bestTeam['blue'];
		generated['teams']['red'] = bestTeam['red'];
		generated['average']['blue'] = bestTeam['blueAvg'];
		generated['average']['red'] = bestTeam['redAvg'];
	} else {
		generated['errorMessage'] = "Could not find best teams";
		generated['success'] = false;
	}
	return generated;
}



