type ParsedDate = {
    date: string;
    time: string;
    formatted: string;
};

export const useDateTime = (dateString: string): ParsedDate => {
    const [datePart, timePart] = dateString.split(' ');

    const combinedDateTime = `${datePart}T${timePart}`;

    const date = new Date(combinedDateTime);

    const formattedDate = date.toLocaleDateString('ru-RU', {
        month: 'long',
        day: 'numeric',
    });

    const formattedTime = date.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
    });

    const formatted = `${formattedDate}, в ${formattedTime}`;

    return {
        date: formattedDate,
        time: formattedTime,
        formatted,
    };
};
