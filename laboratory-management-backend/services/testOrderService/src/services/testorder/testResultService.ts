import { TestResultRepository } from "../../repositories/testResult.repository.js";
import { TestItem } from "../../db/models/TestItem.model.js";
import { Types } from "mongoose";
import { TestOrderRepository } from "../../repositories/testOrderRepository.js";
import { TestOrderResult } from "../../db/models/TestResult.model.js";
export const TestResultService = {
    // Tạo kết quả random khi order Completed
    createRandomResults: async (test_order_id: string, test_item_ids: string[]) => {
        // Lấy thông tin Test Order để có tên bệnh nhân
        const order = await TestOrderRepository.findById(test_order_id);
        if (!order) throw new Error("Test Order not found");

        const patientName = order.patient_name; // giả sử field này có trong TestOrder


        const items = await TestItem.find({ _id: { $in: test_item_ids } });

        const results = items.map(item => {
            const randomValue = Math.random() * (item.ref_max! - item.ref_min!) + item.ref_min!;
            let status: "normal" | "high" | "low" = "normal";
            if (randomValue < item.ref_min!) status = "low";
            else if (randomValue > item.ref_max!) status = "high";

            return {
                test_order_id: new Types.ObjectId(test_order_id),
                test_item_id: item._id.toString(),
                patient_name: patientName ?? "",
                name: item.name,
                code: item.code,
                unit: item.unit,
                result_value: parseFloat(randomValue.toFixed(2)),
                result_status: status,
                reviewed: false,
                reviewer_comment: ""
            };
        });

        return TestResultRepository.createMany(results);
    },

    getTestOrdersWithResultsSummary: async (page = 1, limit = 10) => {
        const skip = (page - 1) * limit;

        return TestOrderResult.aggregate([
            { $match: {} }, // có thể lọc thêm nếu cần
            {
                $group: {
                    _id: "$test_order_id",
                    patient_name: { $first: "$patient_name" },
                    totalResults: { $sum: 1 },
                    resultsSample: { $push: "$$ROOT" } // nếu muốn giữ sample kết quả
                }
            },
            { $sort: { "_id": -1 } }, // sắp xếp theo test_order_id hoặc createdAt
            { $skip: skip },
            { $limit: limit },
            {
                $project: {
                    _id: 0,
                    test_order_id: "$_id",
                    patient_name: 1,
                    totalResults: 1,
                    resultsSample: 1
                }
            }
        ]);
    },

    getTestOrderById: async (testOrderId: string) => {

    const objectId = new Types.ObjectId(testOrderId);

    return TestOrderResult.aggregate([
        {
            $match: {
                test_order_id: objectId
            }
        },
        {
            $group: {
                _id: "$test_order_id",
                patient_name: { $first: "$patient_name" },
                totalResults: { $sum: 1 },
                resultsSample: { $push: "$$ROOT" }
            }
        },
        {
            $project: {
                _id: 0,
                test_order_id: "$_id",
                patient_name: 1,
                totalResults: 1,
                resultsSample: 1
            }
        }
    ]);
}

};



