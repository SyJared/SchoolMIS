import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/authContext";
import { getTeacherClassroom } from "../api/classApi";

// ---- Design tokens (Tailwind arbitrary values) ---------------------------
// ink:    #22314A   paper: #F7F4EE   paperLine: #E4DFD3
// teal:   #3F7069   clay:  #C1554A   amber: #C98A3E   inkSoft: #6B7688

function fmtTime(iso) {
    if (!iso) return "—";
    return new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}
function fmtDate(iso) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
}

function StampBadge({ done }) {
    return (
        <div
            className={`inline-block whitespace-nowrap rounded-sm border-2 px-2.5 py-0.5 -rotate-3 font-mono text-[11px] font-bold uppercase tracking-wider opacity-90 ${done ? "border-[#3F7069] text-[#3F7069]" : "border-[#C98A3E] text-[#C98A3E]"
                }`}
        >
            {done ? "Completed" : "Upcoming"}
        </div>
    );
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

function StudentRow({ student }) {
    const isPresent = student.status === "Present";
    return (
        <div className="flex items-center justify-between border-b border-dashed border-[#E4DFD3] py-1.5 text-[13.5px]">
            <span className="text-[#22314A]">{student.name}</span>
            <span
                className={`font-mono text-[11px] uppercase tracking-wide ${isPresent ? "text-[#3F7069]" : "text-[#C1554A]"
                    }`}
            >
                {student.status}
            </span>
        </div>
    );
}

function ClassRow({ cls }) {
    const [open, setOpen] = useState(false);
    const total = cls.students?.length || 0;
    const present = cls.students?.filter((s) => s.status === "Present").length || 0;

    return (
        <div className="mb-2.5 overflow-hidden rounded-md border border-[#E4DFD3] bg-white">
            <button
                onClick={() => setOpen((o) => !o)}
                className="flex w-full items-center gap-4 px-4.5 py-3.5 text-left"
            >
                <div className="w-[34px] text-center">
                    <div className="font-mono text-[10px] text-[#6B7688]">ID</div>
                    <div className="font-mono text-[15px] text-[#22314A]">{cls.classId}</div>
                </div>

                <div className="min-w-0 flex-1">
                    <div className="font-serif text-[17px] text-[#22314A]">
                        {cls.subject}{" "}
                        <span className="text-sm text-[#6B7688]">
                            · Grade {cls.gradeLevel}-{cls.section}
                        </span>
                    </div>
                    <div className="mt-0.5 font-mono text-xs text-[#6B7688]">
                        {fmtDate(cls.start)} · {fmtTime(cls.start)} – {fmtTime(cls.end)}
                    </div>
                </div>

                <div className="min-w-[60px] text-right font-mono text-[12.5px] text-[#6B7688]">
                    {present}/{total} present
                </div>

                <StampBadge done={cls.isDone} />

                <span
                    className={`text-xs text-[#6B7688] transition-transform ${open ? "rotate-180" : ""}`}
                >
                    ▾
                </span>
            </button>

            {open && (
                <div className="border-t border-[#E4DFD3] py-1 pl-[68px] pr-4.5 pb-4">
                    {total === 0 ? (
                        <div className="py-2.5 text-[13px] text-[#6B7688]">
                            No students recorded for this session.
                        </div>
                    ) : (
                        cls.students.map((s) => <StudentRow key={s.studentId} student={s} />)
                    )}
                </div>
            )}
        </div>
    );
}

function TeacherDashboard() {
    const { user } = useAuth();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) return;

        const fetchClassroom = async () => {
            setLoading(true);
            try {
                const res = await getTeacherClassroom();
                setData(res.data);
                setError(null);
            } catch (err) {
                console.log(err);
                setError("Couldn't load your classes. Try refreshing the page.");
            } finally {
                setLoading(false);
            }
        };

        fetchClassroom();
    }, [user]);

    const sorted = useMemo(
        () => [...data].sort((a, b) => new Date(b.start) - new Date(a.start)),
        [data]
    );

    const stats = useMemo(() => {
        const totalClasses = data.length;
        const completed = data.filter((c) => c.isDone).length;
        const upcoming = totalClasses - completed;

        let totalStudents = 0;
        let presentCount = 0;
        data.forEach((c) => {
            (c.students || []).forEach((s) => {
                totalStudents += 1;
                if (s.status === "Present") presentCount += 1;
            });
        });
        const attendanceRate = totalStudents ? Math.round((presentCount / totalStudents) * 100) : null;

        return { totalClasses, completed, upcoming, attendanceRate };
    }, [data]);

    return (
        <div className="min-h-screen bg-[#F7F4EE] px-6 pb-[60px] pt-8">
            <div className="mx-auto max-w-[860px]">
                <div className="mb-7">
                    <div className="mb-1 font-mono text-[11px] uppercase tracking-widest text-[#6B7688]">
                        Teacher Dashboard
                    </div>
                    <h1 className="font-serif text-[30px] text-[#22314A]">
                        {user?.name ? `Welcome back, ${user.name}` : "Your classes"}
                    </h1>
                </div>

                {error && (
                    <div className="mb-5 rounded-md border border-[#C1554A] bg-[#FBEAE7] px-3.5 py-2.5 text-[13.5px] text-[#C1554A]">
                        {error}
                    </div>
                )}

                <div className="mb-[30px] flex flex-wrap gap-3">
                    <StatCard label="Total classes" value={stats.totalClasses} />
                    <StatCard label="Completed" value={stats.completed} accentClass="text-[#3F7069]" />
                    <StatCard label="Upcoming" value={stats.upcoming} accentClass="text-[#C98A3E]" />
                    <StatCard
                        label="Attendance rate"
                        value={stats.attendanceRate === null ? "—" : `${stats.attendanceRate}%`}
                        sub={stats.attendanceRate === null ? "No records yet" : "Across all sessions"}
                    />
                </div>

                <div className="mb-2.5 pl-0.5 font-mono text-[11px] uppercase tracking-wide text-[#6B7688]">
                    Class Log
                </div>

                {loading ? (
                    <div className="px-1 py-5 text-[#6B7688]">Loading your classes…</div>
                ) : sorted.length === 0 ? (
                    <div className="rounded-md border border-dashed border-[#E4DFD3] bg-white px-5 py-7 text-center text-sm text-[#6B7688]">
                        No classes on record. Once a session is scheduled, it'll show up here.
                    </div>
                ) : (
                    sorted.map((cls) => <ClassRow key={cls.classId} cls={cls} />)
                )}
            </div>
        </div>
    );
}

export default TeacherDashboard;