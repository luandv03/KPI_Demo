import React, { useState } from "react";
import Timeline, { TimelineHeaders, DateHeader } from "react-calendar-timeline";
import "react-calendar-timeline/dist/Timeline.scss";
import moment from "moment";

import scheduleData from "../../../KPI/tour/schedule.json";

// const shiftTimes = {
//     1: { start: "00:00", end: "05:30" },
//     2: { start: "06:00", end: "11:30" },
//     3: { start: "12:00", end: "17:30" },
//     4: { start: "18:00", end: "23:30" },
// };

const shiftTimes = {
    1: { start: "00:00", end: "06:00" },
    2: { start: "06:00", end: "12:00" },
    3: { start: "12:00", end: "18:00" },
    4: { start: "18:00", end: "24:00" },
};

// Tập màu cố định
const predefinedColors = [
    "#FF5733", // Màu đỏ cam
    "#33FF57", // Màu xanh lá
    "#3357FF", // Màu xanh dương
    "#FF33A1", // Màu hồng
    "#FFC300", // Màu vàng
    "#8E44AD", // Màu tím
    "#1ABC9C", // Màu xanh ngọc
    "#FF8C00", // Màu cam sáng
    "#DA70D6", // Màu tím nhạt
    "#20B2AA", // Màu xanh lam nhạt
];

const commandIds = [
    "LSX0001",
    "LSX0002",
    "LSX0003",
    "LSX0004",
    "LSX0005",
    "LSX0006",
    "LSX0007",
    "LSX0008",
    "LSX0009",
    "LSX0010",
];

// Gán màu cho từng commandId
const commandColors = {};
commandIds.forEach((id, index) => {
    commandColors[id] = predefinedColors[index];
});

console.log("Command Colors:", commandColors);

const processData = (commandId = "All") => {
    const groups = [];
    const items = [];
    let itemId = 1;

    let commandOperations = scheduleData;

    // Lọc dữ liệu theo commandId
    if (commandId !== "All") {
        commandOperations = scheduleData.filter(
            (cmd) => cmd.commandId === commandId
        );
    }

    commandOperations.forEach((op) => {
        // Add group for each operation
        groups.push({ id: op.id, title: op.name });

        // Process detailed_schedule
        const itemMap = {}; // To group items with the same start and end time
        op.detailed_schedule.forEach((detail) => {
            const startTime = moment(
                `${detail.day}T${shiftTimes[detail.shift].start}`
            );
            const endTime = moment(
                `${detail.day}T${shiftTimes[detail.shift].end}`
            );

            const key = `${startTime}-${endTime}`;
            if (!itemMap[key]) {
                itemMap[key] = {
                    id: itemId++,
                    group: op.id,
                    title: `${op.commandId}`,
                    start_time: startTime,
                    end_time: endTime,
                    color: commandColors[op.commandId],
                    details: [],
                };
            }
            itemMap[key].details.push({
                worker_id: detail.worker_id,
                asset_id: detail.asset_id,
            });
        });

        // Add items to the timeline
        Object.values(itemMap).forEach((item) => items.push(item));
    });

    console.log("Groups:", groups);
    console.log("Items:", items);

    return { groups, items };
};

const processWorkerAndAssetData = (commandId = "All") => {
    const workerGroups = [];
    const assetGroups = [];
    const workerItems = [];
    const assetItems = [];
    const workerMap = {};
    const assetMap = {};
    let itemId = 1;

    let commandOperations = scheduleData;

    // Lọc dữ liệu theo commandId
    if (commandId !== "All") {
        commandOperations = scheduleData.filter(
            (cmd) => cmd.commandId === commandId
        );
    }

    commandOperations.forEach((op) => {
        op.detailed_schedule.forEach((detail) => {
            const startTime = moment(
                `${detail.day}T${shiftTimes[detail.shift].start}`
            );
            let endTime = moment(
                `${detail.day}T${shiftTimes[detail.shift].end}`
            );

            // Nếu endTime nhỏ hơn startTime, chuyển sang ngày tiếp theo
            if (endTime.isBefore(startTime)) {
                endTime.add(1, "day");
            }

            // Xử lý groups cho worker
            if (!workerMap[detail.worker_id]) {
                workerMap[detail.worker_id] = true;
                workerGroups.push({
                    id: detail.worker_id,
                    title: `Worker ${detail.worker_id}`,
                });
            }

            // Xử lý groups cho asset
            if (!assetMap[detail.asset_id]) {
                assetMap[detail.asset_id] = true;
                assetGroups.push({
                    id: detail.asset_id,
                    title: `Asset ${detail.asset_id}`,
                });
            }

            // Tạo items cho worker
            workerItems.push({
                id: itemId++,
                group: detail.worker_id,
                title: `${op.commandId} - ${op.name}`,
                start_time: startTime,
                end_time: endTime,
                color: commandColors[op.commandId],
                details: {
                    operation: op.name,
                    asset: detail.asset_id,
                },
            });

            // Tạo items cho asset
            assetItems.push({
                id: itemId++,
                group: detail.asset_id,
                title: `${op.commandId} - ${op.name}`,
                start_time: startTime,
                end_time: endTime,
                color: commandColors[op.commandId],
                details: {
                    operation: op.name,
                    worker: detail.worker_id,
                },
            });
        });
    });

    return {
        workerGroups,
        assetGroups,
        workerItems,
        assetItems,
    };
};

const App = () => {
    // Lấy danh sách các lệnh sản xuất từ dữ liệu
    const commandIds = [
        "All",
        ...new Set(scheduleData.map((cmd) => cmd.commandId)),
    ];

    // State để lưu lệnh sản xuất được chọn
    const [selectedCommandId, setSelectedCommandId] = useState("All");
    const { groups, items } = processData(selectedCommandId);
    const { workerGroups, assetGroups, workerItems, assetItems } =
        processWorkerAndAssetData(selectedCommandId);
    // Lấy thời gian bắt đầu của items[0] và trừ đi 1 ngày
    const defaultTimeStart =
        items.length > 0
            ? moment(items[0].start_time)
            : moment().add(-12, "hour");

    const defaultTimeEnd = defaultTimeStart.clone().add(12, "hour");

    const [hoveredItem, setHoveredItem] = useState(null);
    const [hoverPosition, setHoverPosition] = useState({ top: 0, left: 0 });

    return (
        <div>
            <div className="select-container">
                <label htmlFor="command-select">Chọn lệnh sản xuất: </label>
                <select
                    id="command-select"
                    value={selectedCommandId}
                    onChange={(e) => setSelectedCommandId(e.target.value)}
                >
                    {commandIds.map((commandId) => (
                        <option key={commandId} value={commandId}>
                            {commandId}
                        </option>
                    ))}
                </select>
            </div>
            <div className="chart-container">
                <h2>Lịch công đoạn</h2>
                {/* <div className="main-container"> */}
                <Timeline
                    groups={groups}
                    items={items}
                    defaultTimeStart={defaultTimeStart}
                    defaultTimeEnd={defaultTimeEnd}
                    itemRenderer={({ item, getItemProps }) => {
                        const { style, ...otherProps } = getItemProps(
                            item.itemProps
                        );
                        return (
                            <div
                                {...otherProps}
                                style={{
                                    ...style,
                                    backgroundColor: item.color,
                                    color: "#fff",
                                    textAlign: "center",
                                    overflow: "hidden",
                                }}
                                onMouseEnter={(e) => {
                                    setHoveredItem(item);
                                    const rect =
                                        e.target.getBoundingClientRect();
                                    setHoverPosition({
                                        top: rect.top + window.scrollY + 20, // Vị trí dưới item
                                        left:
                                            rect.left +
                                            window.scrollX +
                                            rect.width / 2, // Căn giữa theo chiều ngang
                                    });
                                }}
                                onMouseLeave={() => setHoveredItem(null)}
                            >
                                +{item.details.length}
                            </div>
                        );
                    }}
                    timeSteps={{
                        second: 0,
                        minute: 0,
                        hour: 6, // 👉🏻 mỗi bước 6 tiếng
                        day: 1,
                        month: 1,
                        year: 1,
                    }}
                >
                    <TimelineHeaders>
                        <DateHeader unit="day" labelFormat="MM/DD" />
                        <DateHeader unit="hour" labelFormat="HH"></DateHeader>
                    </TimelineHeaders>
                </Timeline>

                {/* Hover Details */}
                {hoveredItem && (
                    <div
                        className="hover-details"
                        style={{
                            position: "absolute",
                            top: hoverPosition.top,
                            left: hoverPosition.left,
                            transform: "translate(-50%, 0)", // Căn giữa theo chiều ngang
                            background: "#fff",
                            border: "1px solid #ccc",
                            padding: "10px",
                            borderRadius: "4px",
                            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
                            zIndex: 1000,
                        }}
                    >
                        <h4>{hoveredItem.title}</h4>
                        <ul>
                            {hoveredItem.details.map((detail, index) => (
                                <li key={index}>
                                    Worker: {detail.worker_id}, Asset:{" "}
                                    {detail.asset_id}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {/* </div> */}
            </div>

            {/* Lịch nhân viên */}
            <div>
                <h2>Lịch nhân viên</h2>
                <Timeline
                    groups={workerGroups}
                    items={workerItems}
                    defaultTimeStart={defaultTimeStart}
                    defaultTimeEnd={defaultTimeEnd}
                    itemRenderer={({ item, getItemProps }) => {
                        const { style, ...otherProps } = getItemProps(
                            item.itemProps
                        );
                        return (
                            <div
                                {...otherProps}
                                style={{
                                    ...style,
                                    backgroundColor: item.color,
                                    color: "#fff",
                                    textAlign: "center",
                                    overflow: "hidden",
                                }}
                            >
                                {item.title}
                            </div>
                        );
                    }}
                    timeSteps={{
                        second: 0,
                        minute: 0,
                        hour: 6, // 👉🏻 mỗi bước 6 tiếng
                        day: 1,
                        month: 1,
                        year: 1,
                    }}
                >
                    <TimelineHeaders>
                        <DateHeader unit="day" labelFormat="MM/DD" />
                        <DateHeader unit="hour" labelFormat="HH" />
                    </TimelineHeaders>
                </Timeline>
            </div>

            {/* Lịch máy móc */}
            <div>
                <h2>Lịch máy móc</h2>
                <Timeline
                    groups={assetGroups}
                    items={assetItems}
                    defaultTimeStart={defaultTimeStart}
                    defaultTimeEnd={defaultTimeEnd}
                    itemRenderer={({ item, getItemProps }) => {
                        const { style, ...otherProps } = getItemProps(
                            item.itemProps
                        );
                        return (
                            <div
                                {...otherProps}
                                style={{
                                    ...style,
                                    backgroundColor: item.color,
                                    color: "#fff",
                                    textAlign: "center",
                                    overflow: "hidden",
                                }}
                            >
                                {item.title}
                            </div>
                        );
                    }}
                    timeSteps={{
                        second: 0,
                        minute: 0,
                        hour: 6, // 👉🏻 mỗi bước 6 tiếng
                        day: 1,
                        month: 1,
                        year: 1,
                    }}
                >
                    <TimelineHeaders>
                        <DateHeader unit="day" labelFormat="MM/DD" />
                        <DateHeader unit="hour" labelFormat="HH" />
                    </TimelineHeaders>
                </Timeline>
            </div>
        </div>
    );
};

export default App;
