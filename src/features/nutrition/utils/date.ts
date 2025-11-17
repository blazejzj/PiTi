// start of day in utc
export const startOfDayISO = (iso: string) => {
    const d = new Date(iso);
    d.setUTCHours(0, 0, 0, 0);
    return d.toISOString();
};

//[start, end] for 1 day in utc
export const dayRange = (iso: string) => {
    const start = new Date(iso);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 1);
    return { startISO: start.toISOString(), endISO: end.toISOString() };
};

export const toTodayISOWithTime = (hhmm: string) => {
    const [h, m] = hhmm.split(":").map(Number);
    const d = new Date();
    d.setHours(h || 0, m || 0, 0, 0);
    return d.toISOString();
};
