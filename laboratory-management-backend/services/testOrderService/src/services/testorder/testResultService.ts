import { TestResultRepository } from "../../repositories/testResult.repository.js";
import { TestItem } from "../../db/models/TestItem.model.js";
import { Types } from "mongoose";
import { TestOrderRepository } from "../../repositories/testOrderRepository.js";
import { TestOrderResult } from "../../db/models/TestResult.model.js";
import instrumentServiceClient from "../warehouse/instrumentServiceClient.js";
import reagentServiceClient from "../warehouse/reagentServiceClient.js";
export const TestResultService = {
    // Thiếu Search , sort , phân trang 


    // Tạo kết quả random khi order Completed
    createRandomResults: async (test_order_id: string, test_item_ids: string[]) => {
        // Lấy thông tin Test Order để có tên bệnh nhân
        const order = await TestOrderRepository.findById(test_order_id);
        if (!order) throw new Error("Test Order not found");

        const patientName = order.patient_name;

        const instrument = await instrumentServiceClient.getInstrumentById(order.instrument_id || "");
        if (!instrument) throw new Error("Instrument not found");

        const reagent_usages = order.reagent_usages || [];
        const reagentArray = await reagentServiceClient.getReagentsByIds(
            reagent_usages.map(ru => ru.reagent_id)
        );
        const reagent_names = reagentArray ? Array.from(reagentArray.values()).map(r => r.reagent_name) : [];

        const items = await TestItem.find({ _id: { $in: test_item_ids } });

        const results = items.map(item => {
            // Random tỷ lệ: low 30%, normal 40%, high 30%
            const roll = Math.random(); // [0, 1)

            let randomValue: number;
            let status: "normal" | "high" | "low" = "normal";

            if (roll < 0.3) {
                // LOW — 30%
                status = "low";
                // random từ 5% đến 20% dưới ref_min
                randomValue = item.ref_min! - Math.random() * (item.ref_min! * 0.2);
            }
            else if (roll < 0.7) {
                // NORMAL — 40%
                status = "normal";
                randomValue = Math.random() * (item.ref_max! - item.ref_min!) + item.ref_min!;
            }
            else {
                // HIGH — 30%
                status = "high";
                // random từ 5% đến 20% trên ref_max
                randomValue = item.ref_max! + Math.random() * (item.ref_max! * 0.2);
            }


            return {
                test_order_id: new Types.ObjectId(test_order_id),
                test_item_id: item._id.toString(),
                patient_name: patientName ?? "",
                instrument_name: instrument.instrument_name,
                reagent_names: reagent_names,
                test_type: item.test_type,
                name: item.name,
                code: item.code,
                unit: item.unit,
                result_value: parseFloat(randomValue.toFixed(2)),
                result_status: status,
                reviewed: false,
                reviewer_comment: "",
                created_at: new Date()
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
                    test_type: { $first: "$test_type" },
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
                    test_type: "$test_type",
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
                    test_type: { $first: "$test_type" },
                    totalResults: { $sum: 1 },
                    resultsSample: { $push: "$$ROOT" }
                }
            },
            {
                $project: {
                    _id: 0,
                    test_order_id: "$_id",
                    patient_name: 1,
                    test_type: { $first: "$test_type" },
                    totalResults: 1,
                    resultsSample: 1
                }
            }
        ]);
    }

};



