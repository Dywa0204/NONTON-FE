class DateFormat {
    static DATE_TIME_OPTION: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    };

    static DATE_OPTION: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };

    static MONTH_OPTION: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
    };

    static toStringDate = (date: Date, format: string = "YYYY-MM-DD"): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return format
            .replace("YYYY", String(year))
            .replace("MM", month)
            .replace("DD", day);
    };

    static changeFormat = (date: string) => {
        const dateParts = date.split("/");
        if (dateParts.length === 3) {
            const [day, month, year] = dateParts.map(Number);
            return `${year}-${month}-${day} 00:00:00`
        } else {
            const year = new Date().getFullYear();
            const month = String(new Date().getMonth() + 1).padStart(2, "0");
            const day = String(new Date().getDate()).padStart(2, "0");
            return `${year}-${month}-${day} 00:00:00`
        }
    }

    static formatDate = (date: string | Date, options: Intl.DateTimeFormatOptions = this.DATE_TIME_OPTION) => {
        let theDate;

        if (typeof date === "string") {
            const dateParts = date.split("/");
            if (dateParts.length === 3) {
                const [day, month, year] = dateParts.map(Number);
                theDate = new Date(year, month - 1, day);
            } else {
                theDate = new Date(date);
            }
        } else {
            theDate = date;
        }

        const formattedDate = theDate.toLocaleDateString("id-ID", options).replace(/\./g, ":").replace("pukul ", "");
        return formattedDate;
    };

    static formatSimpleDate = (date: string | Date) => {
        return this.formatDate(date, this.DATE_OPTION);
    }

    static calculateAge = (birthDateString: string) => {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDateString)) {
            return "Invalid date format. Use YYYY-MM-DD.";
        }

        const birth = new Date(birthDateString);
        if (isNaN(birth.getTime())) {
            return "Invalid date.";
        }

        const today = new Date();

        let years = today.getFullYear() - birth.getFullYear();
        let months = today.getMonth() - birth.getMonth();
        let days = today.getDate() - birth.getDate();

        if (days < 0) {
            months--;
            const previousMonth = new Date(today.getFullYear(), today.getMonth(), 0);
            days += previousMonth.getDate();
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        return `${years} Tahun ${months} Bulan ${days} Hari`;
    }

    static formatTimeShort = (timeString: string) => {
        if (!/^\d{2}:\d{2}:\d{2}$/.test(timeString)) {
            return timeString;
        }
    
        const [hh, mm] = timeString.split(":");
        return `${hh}:${mm}`;
    };

}

export default DateFormat