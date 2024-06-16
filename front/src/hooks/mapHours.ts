type TimeMapping = {
    startHour: number;
    finishHour: number;
};

export function mapHours(start_time: string, finish_time: string): TimeMapping {
    const startDate = new Date(start_time);
    const finishDate = new Date(finish_time);

    const startHour = startDate.getHours() + startDate.getMinutes() / 60;
    const finishHour = finishDate.getHours() + finishDate.getMinutes() / 60;

    if (startDate.getTime() > finishDate.getTime()) {
        throw new Error('finish_time cannot be before start_time');
    }

    let totalStartHour = startHour;

    // If finish time is on the next day, add 24 hours
    let totalFinishHour = finishHour;
    if (finishDate.getDate() !== startDate.getDate()) {
        totalFinishHour += 24;
    }

    return {
        startHour: totalStartHour,
        finishHour: totalFinishHour,
    };
}
