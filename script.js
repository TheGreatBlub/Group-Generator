document.getElementById("hasLeader").addEventListener("change", function() {
    if (this.value === "yes") {
        document.getElementById("leaderSection").style.display = "block";
    } else {
        document.getElementById("leaderSection").style.display = "none";
    }
});

document.getElementById("groupForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const numPeople = parseInt(document.getElementById("numPeople").value);
    const groupSize = parseInt(document.getElementById("groupSize").value);
    const names = document.getElementById("names").value.split(",").map(name => name.trim());
    const hasLeader = document.getElementById("hasLeader").value === "yes";
    const leaderName = document.getElementById("leaderName").value.trim();

    if (names.length !== numPeople) {
        alert("Number of names does not match the number of people specified.");
        return;
    }

    if (hasLeader && !names.includes(leaderName)) {
        alert("Leader name must be one of the people specified.");
        return;
    }

    const allGroups = generateGroups(names, groupSize, hasLeader ? leaderName : null);
    const validGroups = findValidGroups(allGroups, names, groupSize, hasLeader ? leaderName : null);

    displayGroups(allGroups, validGroups);
});

function generateGroups(people, groupSize, leader = null) {
    let allGroups = [];
    const combinations = (arr, k) => {
        let i, subI, ret = [], sub, next;
        for (i = 0; i < arr.length; i++) {
            if (k === 1) {
                ret.push([arr[i]]);
            } else {
                sub = combinations(arr.slice(i + 1, arr.length), k - 1);
                for (subI = 0; subI < sub.length; subI++) {
                    next = sub[subI];
                    next.unshift(arr[i]);
                    ret.push(next);
                }
            }
        }
        return ret;
    };

    if (leader) {
        people = people.filter(person => person !== leader);
        allGroups = combinations(people, groupSize - 1).map(group => [leader, ...group]);
    } else {
        allGroups = combinations(people, groupSize);
    }

    return allGroups;
}

function checkAllPairs(groups, people) {
    const pairs = new Set(people.flatMap((v, i) => people.slice(i + 1).map(w => `${v},${w}`)));
    groups.forEach(group => {
        group.forEach((v, i) => {
            group.slice(i + 1).forEach(w => pairs.delete(`${v},${w}`));
        });
    });
    return pairs.size === 0;
}

function findValidGroups(allGroups, people, groupSize, leader = null) {
    for (let numGroups = 1; numGroups <= allGroups.length; numGroups++) {
        const combinations = (arr, k) => {
            let i, subI, ret = [], sub, next;
            for (i = 0; i < arr.length; i++) {
                if (k === 1) {
                    ret.push([arr[i]]);
                } else {
                    sub = combinations(arr.slice(i + 1, arr.length), k - 1);
                    for (subI = 0; subI < sub.length; subI++) {
                        next = sub[subI];
                        next.unshift(arr[i]);
                        ret.push(next);
                    }
                }
            }
            return ret;
        };
        const groupsCombination = combinations(allGroups, numGroups);
        for (const groups of groupsCombination) {
            if (checkAllPairs(groups, people)) {
                return groups;
            }
        }
    }
    return [];
}

function displayGroups(allGroups, validGroups) {
    const allGroupsList = document.getElementById("allGroups");
    const validGroupsList = document.getElementById("validGroups");

    allGroupsList.innerHTML = "";
    validGroupsList.innerHTML = "";

    allGroups.forEach(group => {
        const li = document.createElement("li");
        li.textContent = group.join(", ");
        allGroupsList.appendChild(li);
    });

    validGroups.forEach(group => {
        const li = document.createElement("li");
        li.textContent = group.join(", ");
        validGroupsList.appendChild(li);
    });
}
