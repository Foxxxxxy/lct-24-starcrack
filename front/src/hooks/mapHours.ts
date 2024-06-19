type TimeMapping = {
    width: number;
    offset: number;
};

const TIMEGAP = 6 // 1 minute = 6 pixels


export function mapHours(start_time: string, finish_time: string): TimeMapping {
    let startDate = new Date(start_time);
    let finishDate = new Date(finish_time);

    if (startDate.getTime() > finishDate.getTime()) {
        const temp = startDate;
        startDate = finishDate;
        finishDate = temp;
    }

    const startTime = startDate.getHours() * 60 + startDate.getMinutes(); // minutes
    const finishTime = finishDate.getHours() * 60 + finishDate.getMinutes(); // minutes

    const timeDiff = finishTime - startTime;
    const width = timeDiff * TIMEGAP; // pixels
    const offset = startTime * TIMEGAP + (timeDiff / 2 * TIMEGAP) + 4; // pixels

    return {
        width,
        offset,
    };
}