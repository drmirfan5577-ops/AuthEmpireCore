import { useState, useEffect } from 'react';

interface ClockData {
  gregorian: string;
  gregorianDate: string;
  hijri: string;
  hijriDate: string;
}

function toHijri(date: Date): { year: number; month: number; day: number; monthName: string } {
  // Accurate Hijri conversion algorithm
  const JD = Math.floor((14 + Math.floor((date.getMonth() + 1 + 9) / 12)) / 100);
  const julianDay = Math.floor(365.25 * (date.getFullYear() + 4716))
    + Math.floor(30.6001 * (date.getMonth() + (date.getMonth() < 2 ? 14 : 2) + 1))
    + date.getDate() - JD
    + Math.floor(JD / 4)
    - Math.floor(3 * (Math.floor((date.getFullYear() + (date.getMonth() < 2 ? 4799 : 4800)) / 100) + 1) / 4)
    - 32045;

  const l = julianDay - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const l2 = l - 10631 * n + 354;
  const j = Math.floor((10985 - l2) / 5316) * Math.floor(50 * l2 / 17719)
    + Math.floor(l2 / 5670) * Math.floor(43 * l2 / 15238);
  const l3 = l2 - Math.floor((30 - j) / 15) * Math.floor(17719 * j / 50)
    - Math.floor(j / 16) * Math.floor(15238 * j / 43) + 29;
  const month = Math.floor(24 * l3 / 709);
  const day = l3 - Math.floor(709 * month / 24);
  const year = 30 * n + j - 30;

  const HIJRI_MONTHS = [
    'Muharram','Safar','Rabi al-Awwal','Rabi al-Thani',
    'Jumada al-Ula','Jumada al-Akhirah','Rajab','Shaban',
    'Ramadan','Shawwal','Dhul Qadah','Dhul Hijjah'
  ];

  return { year, month, day, monthName: HIJRI_MONTHS[month - 1] || '' };
}

export function useClock(): ClockData {
  const [data, setData] = useState<ClockData>(() => compute());

  function compute(): ClockData {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
    const hijri = toHijri(now);
    const hijriStr = `${hijri.day} ${hijri.monthName} ${hijri.year} AH`;
    return {
      gregorian: timeStr,
      gregorianDate: dateStr,
      hijri: hijriStr,
      hijriDate: `${hijri.day}/${hijri.month}/${hijri.year}`,
    };
  }

  useEffect(() => {
    const interval = setInterval(() => setData(compute()), 1000);
    return () => clearInterval(interval);
  }, []);

  return data;
}
