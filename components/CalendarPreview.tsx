import Image from "next/image";

const weekdays = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const daysInDecember = 31;
const firstWeekday = 2; // 1 Desember 2026 jatuh pada Selasa.
const calendarDays = Array.from({ length: 35 }, (_, index) => {
  const day = index - firstWeekday + 1;
  return day > 0 && day <= daysInDecember ? day : null;
});

export function CalendarPreview() {
  return (
    <div className="mx-auto mt-8 w-full max-w-xs rounded-2xl border border-white/60 bg-white/95 p-5 text-[#315c55] shadow-xl backdrop-blur sm:mt-10 sm:p-6">
      <div className="mb-5 flex flex-col items-center text-center">
        <Image
          src="/images/calendar.png"
          alt=""
          aria-hidden="true"
          width={48}
          height={48}
          className="mb-4 size-12 object-contain"
        />
        <div>
          <p className="eyebrow text-[9px] text-[#319c91]">KALENDER ACARA</p>
          <h3 className="mt-1 font-serif text-2xl text-[#236e64]">
            Desember 2026
          </h3>
        </div>
      </div>

      <table
        className="w-full table-fixed text-center"
        aria-label="Kalender Desember 2026"
      >
        <thead>
          <tr>
            {weekdays.map((weekday) => (
              <th
                key={weekday}
                scope="col"
                className="pb-2 text-[10px] font-medium text-[#78918c]"
              >
                {weekday}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }, (_, week) => (
            <tr key={week}>
              {calendarDays.slice(week * 7, week * 7 + 7).map((day, index) => (
                <td key={day ?? `empty-${week}-${index}`} className="py-1">
                  {day === 20 ? (
                    <span
                      aria-label="Hari pernikahan, 20 Desember 2026"
                      className="mx-auto grid size-9 place-items-center rounded-full bg-[#319c91] font-semibold text-white shadow-md shadow-[#319c91]/25"
                    >
                      {day}
                    </span>
                  ) : (
                    <span className="mx-auto grid size-9 place-items-center text-xs text-[#58746e]">
                      {day}
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex items-center justify-center gap-2 border-t border-[#e4efec] pt-4 text-xs text-[#68827c]">
        <span aria-hidden="true" className="size-2.5 rounded-full bg-[#319c91]" />
        Hari pernikahan | 20 Desember
      </div>
    </div>
  );
}
