import styles from './Calendar.module.css';
import { Button } from '../Button/Button';
import cn from 'classnames';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useCalendar } from '../../hooks/useCalendar';

const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const getFirstDayOfMonth = (date) => {
    const copyDate = new Date(date);
    copyDate.setDate(0);
    copyDate.setDate(copyDate.getDate() + 1);

    const day = copyDate.getDay();

    return day === 0 ? 6 : day - 1;
};

const getDays = (date) => {
    const copyDate = new Date(date);
    copyDate.setMonth(copyDate.getMonth() + 1);
    copyDate.setDate(0);

    return copyDate.getDate();
};

const Header = () =>
    daysOfWeek.map((day, index) => (
        <th key={day} className={cn(styles.cell, (index === 5 || index === 6) && styles.weekend)}>
            {day}
        </th>
    ));

const isInRange = (day, range) => {
    if (range.firstDate === null && range.secondDate === null) return false;
    if (range.firstDate !== null && range.secondDate === null && day === +range.firstDate) return true;

    if (day < 0) return false;

    return day >= range.firstDate && day <= range.secondDate;
};

const isHolidayYear = (date, holidays) => {
    const currMonth = date.getMonth();
    const currYear = date.getFullYear();

    return (day) => {
        if (!holidays) return false;
        const currDay = `${currYear}-${
            (currMonth + 1).toString().length === 1 ? '0' + (currMonth + 1) : currMonth + 1
        }-${day.toString().length === 1 ? '0' + day : day}`;
        const holiday = holidays.find((holiday) => holiday.date === currDay);

        return holiday !== undefined;
    };
};

export const Calendar = ({ date }) => {
    const [currDate, onLeft, onRight, range, getDate] = useCalendar(date);

    const [holidays, setHolidays] = useState(null);

    useEffect(() => {
        (async () => {
            const response = await fetch(
                `https://holidayapi.com/v1/holidays?pretty&key=${encodeURIComponent(
                    'c79a2428-2cde-4b90-8c28-ce4269acec25'
                )}&country=${encodeURIComponent('RU')}&year=2022`
            )
                .then(async (e) => await e.json())
                .then(async (e) => setHolidays(await e.holidays), []);
        })();
    }, []);

    const isHoliday = useCallback(isHolidayYear(currDate, holidays), [holidays, currDate]);

    const maxDays = getDays(currDate);
    const firstDayOfMonth = getFirstDayOfMonth(currDate);

    const table = useMemo(() => {
        const list = [];

        for (let start = -firstDayOfMonth; start < maxDays; ) {
            const tds = [];

            for (let i = 0; i < 7; i++) {
                tds.push(
                    <td
                        key={start}
                        className={cn(
                            styles.cell,
                            (i === 5 || i === 6) && styles.weekend,
                            isInRange(start + 1, range) && styles.highlight,
                            isHoliday(start >= 0 && start < maxDays && start + 1) && styles.holiday
                        )}
                    >
                        {start >= 0 && start < maxDays && start + 1}
                    </td>
                );
                start++;
            }
            list.push(<tr key={start}>{tds}</tr>);
        }

        return list;
    }, [maxDays, firstDayOfMonth, range]);

    let dateFormat = Intl.DateTimeFormat('ru-RU', { month: 'long', year: 'numeric' }).format(currDate);
    dateFormat = dateFormat.charAt(0).toUpperCase() + dateFormat.slice(1);

    return (
        <>
            <div>{dateFormat}</div>
            <Button className="prev-button" children="<" onClick={onLeft} />
            <table className={styles.calendar}>
                <thead>
                    <tr>
                        <Header />
                    </tr>
                </thead>
                <tbody onClick={getDate}>{table}</tbody>
            </table>
            <Button className="next-button" children=">" onClick={onRight} />
        </>
    );
};
