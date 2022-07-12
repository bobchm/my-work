
    function encodeDate(dt) {
        return (dt.getMonth() + 1) + "-" + dt.getDate() + "-" + dt.getFullYear();
    }

    function addDays(dateS, nDays) {
        var startDate = new Date(dateS);
        var newDate = new Date();
        newDate.setDate(startDate.getDate() + nDays);
        return encodeDate(newDate);
    }

    function getToday() {
        return encodeDate(new Date());
    }

    export {encodeDate, addDays, getToday};
    