import { TestResultRepository } from "../../repositories/testResult.repository.js";
import { TestItem } from "../../db/models/TestItem.model.js";
import { Types } from "mongoose";
import { TestOrderRepository } from "../../repositories/testOrderRepository.js";
import { TestOrderResult } from "../../db/models/TestResult.model.js";
export const TestResultService = {

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



