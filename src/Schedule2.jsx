import React from "react";
import monthlySchedule from "../../../KPI/tour/monthly_schedule2.json"; // Lịch đăng ký
import assignedSchedule from "../../../KPI/tour/schedule_worst.json"; // Lịch phân công

const Schedule2 = () => {
    // Tạo danh sách header từ dữ liệu đăng ký
    const generateHeaders = (data) => {
        return data.flatMap((daySchedule) =>
            Array.from({ length: daySchedule.shift_count }).map(
                (_, shiftIndex) => ({
                    date: daySchedule.date,
                    shift: `Ca ${shiftIndex + 1}`,
                })
            )
        );
    };

    // Tạo danh sách nhân viên từ dữ liệu đăng ký
    const generateWorkers = (data) => {
        const workers = new Set();
        data.forEach((daySchedule) => {
            Object.keys(daySchedule.schedule).forEach((workerId) =>
                workers.add(workerId)
            );
        });
        return Array.from(workers);
    };

    // Tìm công đoạn được phân công cho nhân viên theo ngày và ca
    const findAssignedOperation = (workerId, date, shiftIndex) => {
        for (const operation of assignedSchedule) {
            for (const detail of operation.detailed_schedule) {
                if (
                    detail.worker_id === workerId &&
                    detail.day === date &&
                    detail.shift === shiftIndex + 1
                ) {
                    return operation.id; // Trả về ID của công đoạn (ví dụ: OP001)
                }
            }
        }
        return null; // Không tìm thấy công đoạn nào
    };

    const headers = generateHeaders(monthlySchedule);
    const workers = generateWorkers(monthlySchedule);

    return (
        <div className="schedule-container">
            <table>
                <thead>
                    <tr>
                        <th>Nhân viên</th>
                        {headers.map((header, index) => (
                            <th key={index}>
                                {header.date} <br /> {header.shift}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {workers.map((workerId) => (
                        <tr key={workerId}>
                            <td>{workerId}</td>
                            {headers.map((header, index) => {
                                // Tìm trạng thái làm việc của nhân viên theo ngày và ca
                                const daySchedule = monthlySchedule.find(
                                    (day) => day.date === header.date
                                );
                                const shiftIndex =
                                    parseInt(header.shift.split(" ")[1], 10) -
                                    1;
                                const isRegistered =
                                    daySchedule &&
                                    daySchedule.schedule[workerId] &&
                                    daySchedule.schedule[workerId][
                                        shiftIndex
                                    ] === 1;

                                // Tìm công đoạn được phân công
                                const assignedOperation = isRegistered
                                    ? findAssignedOperation(
                                          workerId,
                                          header.date,
                                          shiftIndex
                                      )
                                    : null;

                                return (
                                    <td
                                        key={index}
                                        className={
                                            assignedOperation
                                                ? "assigned"
                                                : isRegistered
                                                ? "registered"
                                                : "not-registered"
                                        }
                                    >
                                        {assignedOperation ||
                                            (isRegistered ? "✔" : "✘")}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Schedule2;
