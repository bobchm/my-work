
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

    function compareDates(d1, d2) {
        const [month1, date1, year1] = d1.split("-");
        const [month2, date2, year2] = d2.split("-");

        if (year1 < year2) return -1;
        if (year1 > year2) return 1;
        if (month1 < month2) return -1;
        if (month1 > month2) return 1;
        if (date1 < date2) return -1;
        if (date1 > date2) return 1;
        return 0;
    }

    export {encodeDate, addDays, getToday, compareDates};
    