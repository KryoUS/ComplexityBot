//Default curfew starting time is 10pm
let curfew = {
    start: 2200,
    end: 700
};

module.exports = {
    setStartCurfew: (time) => {
        curfew.start = time;
    },

    setEndCurfew: (time) => {
        curfew.end = time;
    },

    getCurfew: () => {
        return curfew;
    },
};