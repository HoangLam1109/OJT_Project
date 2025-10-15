// User repository interface
export interface IAuditLogRepository {
  findById(id: string, fields?: string): Promise<any>;
  findByCode(code: string): Promise<any>;
  findByAction(action: string): Promise<any>;
  findByDate(date: Date): Promise<any>;
  create(logData: any): Promise<any>;
  updateById(id: string, logData: any): Promise<any>;
  deleteById(id: string): Promise<any>;
  findAll(fields?: string): Promise<any[]>;
}

// User repository implementation
export class AuditLogRepository implements IAuditLogRepository {
  constructor(private auditLogModel: any) {}

  async findById(id: string, fields?: string): Promise<any> {
    return await this.auditLogModel.findById(id, fields || "_id eventCode action eventMessage userId userEmail performedAt serviceName");
  }

  async findByCode(code: string): Promise<any> {
    return await this.auditLogModel.findOne({ eventCode: code });
  }

  async findByAction(action: string): Promise<any> {
    return await this.auditLogModel.findOne({ action: action });
  }

  async findByDate(date: Date): Promise<any> {
    return await this.auditLogModel.findOne({ performedAt: date });
  }

  async create(logData: any): Promise<any> {
    const log = new this.auditLogModel(logData);
    return await log.save();
  }

  async updateById(id: string, logData: any): Promise<any> {
    return await this.auditLogModel.findByIdAndUpdate(id, logData, { new: true });
  }

  async deleteById(id: string): Promise<any> {
    return await this.auditLogModel.findByIdAndDelete(id);
  }

  async findAll(fields?: string): Promise<any[]> {
    return await this.auditLogModel.find({}, fields);
  }
}
