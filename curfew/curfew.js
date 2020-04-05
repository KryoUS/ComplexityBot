//Default curfew starting time is 10pm
let start = {
    hour: 22,
    minutes: 0
};

//Default curfew ending time is 5am
let end = {
    hour: 7,
    minutes: 0
};

module.exports = {
    setStartCurfew: (time) => {
        let timeArr = time.split(":");

        if (timeArr.length === 2) {
            start.hour = timeArr[0];
            start.minutes = timeArr[1];
        }
    },

    setEndCurfew: (time) => {
        let timeArr = time.split(":");

        if (timeArr.length === 2) {
            end.hour = timeArr[0];
            end.minutes = timeArr[1];
        }
    },

    getStartCurfew: () => {
        return start;
    },

    getEndCurfew: () => {
        return end;
    },
};