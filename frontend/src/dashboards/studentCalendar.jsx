import { useEffect, useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import { getAllClassByStudentId } from "../api/classApi";

function StudentCalendar() {
    const [classes, setClasses] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        const fetchStudentClasses = async () => {
            try {
                const res = await getAllClassByStudentId();
                setClasses(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchStudentClasses();
    }, []);

    const events = useMemo(() => {
        return classes.map(c => ({
            id: c.classId,
            title: `${c.subject} (${c.advisor})`,
            start: c.start,
            end: c.end,
            backgroundColor: "#3F7069",
            borderColor: "#3F7069",
            textColor: "#fff"
        }));
    }, [classes]);

    return (
        <div className="min-h-screen bg-[#F7F4EE] p-6">
            <div className="mx-auto max-w-6xl rounded-lg bg-white shadow-md p-5">
                <h1 className="mb-5 font-serif text-3xl text-[#22314A]">
                    Class Schedule
                </h1>

                <FullCalendar
                    plugins={[
                        dayGridPlugin,
                        timeGridPlugin,
                        interactionPlugin
                    ]}
                    initialView="dayGridMonth"
                    headerToolbar={{
                        left: "prev,next today",
                        center: "title",
                        right: "dayGridMonth,timeGridWeek,timeGridDay"
                    }}
                    events={events}
                    height="80vh"
                    eventTimeFormat={{
                        hour: "numeric",
                        minute: "2-digit",
                        meridiem: "short"
                    }}
                    eventClick={(info) => {
                        setSelectedEvent(info.event);
                    }}
                />
                {selectedEvent && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-xl w-[420px] p-6">

                            <div className="flex justify-between items-center mb-5">
                                <h2 className="text-2xl font-serif text-[#22314A]">
                                    Class Details
                                </h2>

                                <button
                                    onClick={() => setSelectedEvent(null)}
                                    className="text-gray-500 hover:text-black text-xl"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-4">

                                <div>
                                    <p className="text-xs uppercase tracking-wider text-gray-500">
                                        Subject
                                    </p>

                                    <p className="text-lg font-semibold">
                                        {selectedEvent.title}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs uppercase tracking-wider text-gray-500">
                                        Starts
                                    </p>

                                    <p>
                                        {selectedEvent.start.toLocaleString()}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs uppercase tracking-wider text-gray-500">
                                        Ends
                                    </p>

                                    <p>
                                        {selectedEvent.end.toLocaleString()}
                                    </p>
                                </div>

                            </div>

                            <div className="mt-6 flex justify-end">

                                <button
                                    onClick={() => setSelectedEvent(null)}
                                    className="px-4 py-2 rounded bg-[#22314A] text-white hover:opacity-90"
                                >
                                    Close
                                </button>

                            </div>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default StudentCalendar;