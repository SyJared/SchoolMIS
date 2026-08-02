import { useEffect, useState } from "react";
import { getAdminDashboard } from "../api/adminApi";
import { Users, GraduationCap, School, ClipboardList, FileText, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function StatCard({ icon: Icon, label, value, color }) {
    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${color}`}>
                <Icon size={20} className="text-white" />
            </div>
            <div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-sm text-gray-500">{label}</p>
            </div>
        </div>
    );
}

function AdminDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await getAdminDashboard();
                setData(res.data);
            } catch (err) {
                console.log(err);
                setError("Failed to load dashboard");
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading) return <div className="p-6 text-sm text-gray-500">Loading dashboard...</div>;
    if (error) return <div className="p-6 text-sm text-red-500">{error}</div>;
    if (!data) return null;

    const chartData = data.gradeBreakdown.map((g) => ({
        grade: `Grade ${g.gradeLevel}`,
        students: g.studentCount,
    }));

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>

            {/* Stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                <StatCard icon={GraduationCap} label="Students" value={data.totalStudents} color="bg-indigo-500" />
                <StatCard icon={Users} label="Teachers" value={data.totalTeachers} color="bg-emerald-500" />
                <StatCard icon={School} label="Classrooms" value={data.totalClassrooms} color="bg-amber-500" />
                <StatCard icon={ClipboardList} label="Quizzes" value={data.totalQuizzes} color="bg-rose-500" />
                <StatCard icon={FileText} label="Assignments" value={data.totalAssignments} color="bg-sky-500" />
            </div>

            {/* Students per grade chart */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-4">
                    <BarChart3 size={16} className="text-indigo-600" />
                    Students per Grade Level
                </h2>

                {chartData.length === 0 ? (
                    <p className="text-sm text-gray-400">No data yet.</p>
                ) : (
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="grade" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="students" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>

            {/* Students per section table */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                <h2 className="text-sm font-semibold text-gray-700 mb-4">Students per Section</h2>

                {data.sectionBreakdown.length === 0 ? (
                    <p className="text-sm text-gray-400">No sections yet.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-gray-500 border-b border-gray-100">
                                    <th className="py-2 pr-4 font-medium">Grade</th>
                                    <th className="py-2 pr-4 font-medium">Section</th>
                                    <th className="py-2 pr-4 font-medium">Subject</th>
                                    <th className="py-2 pr-4 font-medium">Advisor</th>
                                    <th className="py-2 pr-4 font-medium text-right">Students</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {data.sectionBreakdown.map((s) => (
                                    <tr key={s.classroomId} className="text-gray-700">
                                        <td className="py-2.5 pr-4">{s.gradeLevel}</td>
                                        <td className="py-2.5 pr-4 font-medium">{s.section}</td>
                                        <td className="py-2.5 pr-4">{s.subject}</td>
                                        <td className="py-2.5 pr-4">{s.advisorName}</td>
                                        <td className="py-2.5 pr-4 text-right">
                                            <span className="inline-flex items-center justify-center min-w-[28px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
                                                {s.studentCount}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminDashboard;