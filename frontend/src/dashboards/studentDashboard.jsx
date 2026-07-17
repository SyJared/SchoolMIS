import { useEffect, useMemo, useState } from "react";
import { getInfoForStudentDashboard } from "../api/studentsApi";
import StudentCalendar from "./studentCalendar";

// ---- Design tokens (Tailwind arbitrary values) ---------------------------
// ink:    #22314A   paper: #F7F4EE   paperLine: #E4DFD3
// teal:   #3F7069   clay:  #C1554A   amber: #C98A3E   inkSoft: #6B7688

function fmtTime(iso) {
    if (!iso) return "—";
    return new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}
function fmtDate(iso) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString([], { month: "short", day: "numeric" });
}

function StatCard({ label, value, accentClass, sub }) {
    return (
        <div className="flex-1 min-w-[150px] rounded-md border border-[#E4DFD3] bg-white px-5 py-[18px]">
            <div className="mb-2 font-mono text-[11px] uppercase tracking-wider text-[#6B7688]">
                {label}
            </div>
            <div className={`font-serif text-[34px] leading-none ${accentClass || "text-[#22314A]"}`}>
                {value}
            </div>
            {sub && <div className="mt-1.5 text-[12.5px] text-[#6B7688]">{sub}</div>}
        </div>
    );
}

function TodayClassRow({ cls }) {
    const now = new Date();
    const start = new Date(cls.start);
    const end = new Date(cls.end);
    const isPast = end < now;
    const isLive = start <= now && now <= end;

    const statusLabel = isLive ? "In progress" : isPast ? "Done" : "Upcoming";
    const statusColor = isLive ? "#C98A3E" : isPast ? "#3F7069" : "#6B7688";

    return (
        <div className="flex items-center gap-4 rounded-md border border-[#E4DFD3] bg-white px-4 py-3.5">
            <div className="w-[34px] text-center">
                <div className="font-mono text-[10px] text-[#6B7688]">ID</div>
                <div className="font-mono text-[15px] text-[#22314A]">{cls.classId}</div>
            </div>

            <div className="min-w-0 flex-1">
                <div className="font-serif text-[17px] text-[#22314A]">{cls.subject}</div>
                <div className="mt-0.5 font-mono text-xs text-[#6B7688]">
                    {fmtTime(cls.start)} – {fmtTime(cls.end)} · {cls.teacher}
                </div>
            </div>

            <div
                className="whitespace-nowrap rounded-sm border-2 px-2.5 py-0.5 -rotate-2 font-mono text-[11px] font-bold uppercase tracking-wider opacity-90"
                style={{ borderColor: statusColor, color: statusColor }}
            >
                {statusLabel}
            </div>
        </div>
    );
}

function AttendanceRow({ entry }) {
    const isPresent = entry.status === "Present";
    return (
        <div className="flex items-center justify-between border-b border-dashed border-[#E4DFD3] py-2.5 text-[13.5px]">
            <div className="flex flex-col">
                <span className="text-[#22314A]">{entry.subject}</span>
                <span className="font-mono text-[11px] text-[#6B7688]">{fmtDate(entry.date)}</span>
            </div>
            <span
                className={`font-mono text-[11px] uppercase tracking-wide ${isPresent ? "text-[#3F7069]" : "text-[#C1554A]"
                    }`}
            >
                {entry.status}
            </span>
        </div>
    );
}

function StudentDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await getInfoForStudentDashboard();
                setData(res.data);
                setError(null);
            } catch (err) {
                console.log(err);
                setError("Couldn't load your dashboard. Try refreshing the page.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const sortedToday = useMemo(() => {
        if (!data?.todayClasses) return [];
        return [...data.todayClasses].sort((a, b) => new Date(a.start) - new Date(b.start));
    }, [data]);

    const sortedRecent = useMemo(() => {
        if (!data?.recentAttendance) return [];
        return [...data.recentAttendance].sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [data]);

    return (
        <div className="min-h-screen bg-[#F7F4EE] px-6 pb-[60px] pt-8">
            <div className="mx-auto max-w-[860px]">
                <div className="mb-7">
                    <div className="mb-1 font-mono text-[11px] uppercase tracking-widest text-[#6B7688]">
                        Student Dashboard
                    </div>
                    <h1 className="font-serif text-[30px] text-[#22314A]">
                        {data?.studentName ? data.studentName : "Your progress"}
                    </h1>
                    {data && (
                        <div className="mt-1 font-mono text-xs text-[#6B7688]">
                            Grade {data.gradeLevel}-{data.section}
                        </div>
                    )}
                </div>

                {error && (
                    <div className="mb-5 rounded-md border border-[#C1554A] bg-[#FBEAE7] px-3.5 py-2.5 text-[13.5px] text-[#C1554A]">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="px-1 py-5 text-[#6B7688]">Loading your dashboard…</div>
                ) : !data ? (
                    <div className="rounded-md border border-dashed border-[#E4DFD3] bg-white px-5 py-7 text-center text-sm text-[#6B7688]">
                        No data available yet.
                    </div>
                ) : (
                    <>
                        <div className="mb-8 flex flex-wrap gap-3">
                            <StatCard label="Enrolled subjects" value={data.enrolledSubjects} />
                            <StatCard
                                label="Attendance rate"
                                value={`${data.attendanceRate}%`}
                                accentClass={data.attendanceRate >= 90 ? "text-[#3F7069]" : "text-[#C98A3E]"}
                                sub="Across all sessions"
                            />
                            <StatCard label="Classes today" value={sortedToday.length} accentClass="text-[#22314A]" />
                        </div>

                        <div className="mb-2.5 pl-0.5 font-mono text-[11px] uppercase tracking-wide text-[#6B7688]">
                            Today's Classes
                        </div>
                        <div className="mb-8 flex flex-col gap-2.5">
                            {sortedToday.length === 0 ? (
                                <div className="rounded-md border border-dashed border-[#E4DFD3] bg-white px-5 py-6 text-center text-sm text-[#6B7688]">
                                    No classes scheduled for today.
                                </div>
                            ) : (
                                sortedToday.map((cls) => <TodayClassRow key={cls.classId} cls={cls} />)
                            )}
                        </div>

                        <div className="mb-2.5 pl-0.5 font-mono text-[11px] uppercase tracking-wide text-[#6B7688]">
                            Recent Attendance
                        </div>
                        <div className="rounded-md border border-[#E4DFD3] bg-white px-4">
                            {sortedRecent.length === 0 ? (
                                <div className="py-6 text-center text-sm text-[#6B7688]">
                                    No attendance records yet.
                                </div>
                            ) : (
                                sortedRecent.map((entry, i) => <AttendanceRow key={i} entry={entry} />)
                            )}
                        </div>
                    </>
                )}
            </div>
            <StudentCalendar />
        </div>
    );
}

export default StudentDashboard;