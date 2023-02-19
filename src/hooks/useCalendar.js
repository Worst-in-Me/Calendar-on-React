import { useState, useCallback } from 'react';

export const useCalendar = (date) => {
    const [calendar, setCalendar] = useState(date);
    const [range, setRange] = useState({
        firstDate: null,
        secondDate: null,
    });

    const getDate = useCallback((event) => {
        let td = event.target.closest('td');

        if (!td) return;

        if (td.textContent === '') return;
        setRange((currRange) => {
            if (currRange.firstDate === null) return { ...currRange, firstDate: td.textContent };
            else if (currRange.secondDate === null) {
                if (+currRange.firstDate > +td.textContent)
                    return { ...currRange, firstDate: td.textContent, secondDate: currRange.firstDate };

                return { ...currRange, secondDate: td.textContent };
            }

            if (currRange.firstDate !== null && currRange.secondDate !== null)
                return { ...currRange, firstDate: td.textContent, secondDate: null };
        });
    }, []);

    const onLeft = useCallback(() => {
        setCalendar((calendar) => new Date(new Date(calendar).setMonth(calendar.getMonth() - 1)));
        setRange((currRange) => ({ ...currRange, firstDate: null, secondDate: null }));
    }, []);

    const onRight = useCallback(() => {
        setCalendar((calendar) => new Date(new Date(calendar).setMonth(calendar.getMonth() + 1)));
        setRange((currRange) => ({ ...currRange, firstDate: null, secondDate: null }));
    }, []);

    return [calendar, onLeft, onRight, range, getDate];
};
