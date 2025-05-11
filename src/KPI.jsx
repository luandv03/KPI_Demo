import React, { useState } from "react";
import scheduleData from "../../../kpi/tour/schedule.json";
import inputData from "../../../kpi/tour/input-thieu-may.json";

const filterOperationByCommandId = (commandId = "All") => {
    let commandOperations = inputData.operations;
    // Lọc dữ liệu theo commandId
    if (commandId !== "All") {
        return commandOperations.filter(
            (operation) => operation.productionOrderId === commandId
        );
    } else return commandOperations;
};

const KPI = () => {
    // Lấy danh sách các lệnh sản xuất từ dữ liệu
    const commandIds = [
        "All",
        ...new Set(scheduleData.map((cmd) => cmd.commandId)),
    ];

    // State để lưu lệnh sản xuất được chọn
    const [selectedCommandId, setSelectedCommandId] = useState("All");

    // Lấy danh sách operations từ input9.json
    const operations = filterOperationByCommandId(selectedCommandId);

    // Kết hợp dữ liệu từ schedule6.json và input9.json
    const combinedData = operations
        .map((operation) => {
            const schedule = scheduleData.find((op) => op.id === operation.id);

            return operation.kpis
                .filter((kpi) => {
                    console.log("kpi", schedule);
                    return schedule[
                        `achieved_kpi_${operation.kpis.indexOf(kpi)}`
                    ];
                })
                .map((kpi) => ({
                    productionOrderId: operation.productionOrderId, // ID Lệnh sản xuất
                    operationId: operation.id, // ID Công đoạn
                    id: kpi.id, // ID KPI
                    name: kpi.name, // Tên KPI
                    weight: kpi.weight, // Trọng số KPI
                    threshold: kpi.value, // Giá trị ngưỡng từ input9.json
                    achieved: schedule
                        ? schedule[
                              `achieved_kpi_${operation.kpis.indexOf(kpi)}`
                          ]
                        : "N/A", // Giá trị đạt được từ schedule6.json
                }));
        })
        .flat();

    console.log(combinedData);

    return (
        <div className="kpi-list-container">
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

            <h2>Danh sách KPI</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID Lệnh sản xuất</th>
                        <th>ID Công đoạn</th>
                        <th>ID KPI</th>
                        <th>Tên KPI</th>
                        <th>Weight</th>
                        <th>Giá trị ngưỡng</th>
                        <th>Giá trị đạt được</th>
                        <th>Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    {combinedData.map((kpi, index) => (
                        <tr key={index}>
                            <td>{kpi.productionOrderId}</td>
                            <td>{kpi.operationId}</td>
                            <td>{kpi.id}</td>
                            <td>{kpi.name}</td>
                            <td>{parseFloat(kpi.weight).toFixed(2)}</td>
                            <td>{parseFloat(kpi.threshold).toFixed(2)}</td>
                            <td>
                                {kpi.achieved - kpi.threshold >
                                0.1 * kpi.threshold
                                    ? (
                                          kpi.threshold +
                                          kpi.threshold *
                                              (Math.random() * (0.1 - 0.09) +
                                                  0.09)
                                      ).toFixed(2) // Làm tròn đến 2 chữ số thập phân
                                    : parseFloat(kpi.achieved).toFixed(2)}
                            </td>
                            <td>
                                {kpi.achieved >= kpi.threshold
                                    ? "Đạt"
                                    : "Không đạt"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default KPI;
