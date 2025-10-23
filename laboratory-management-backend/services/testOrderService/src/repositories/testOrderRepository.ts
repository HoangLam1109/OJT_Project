import TestOrder, { ITestOrder } from "../models/TestOrder";

export const TestOrderRepository = {
  create: (data: Partial<ITestOrder>) => new TestOrder(data).save(),
  findAll: () => TestOrder.find({ is_deleted: false }),
  findById: (id: string) => TestOrder.findById(id),
  update: (id: string, data: Partial<ITestOrder>) =>
    TestOrder.findByIdAndUpdate(id, data, { new: true }),
  softDelete: (id: string, deletedBy: string) =>
    TestOrder.findByIdAndUpdate(id, { is_deleted: true, deleted_at: new Date(), deleted_by: deletedBy }, { new: true })
};
