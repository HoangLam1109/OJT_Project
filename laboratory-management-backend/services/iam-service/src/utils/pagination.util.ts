import { PaginationOptions, PaginationResponse } from '../types/pagination.type.js';
export class PaginationUtils {
  // Parse and validate pagination query params
  static parseQuery(query: any): PaginationOptions {
    const limit = parseInt(query.limit) || 10;

    if (limit < 1 || limit > 100) {
      throw new Error("Limit must be between 1 and 100");
    }

    return {
      limit,
      cursor: query.cursor,
      sortBy: query.sortBy || "_id",
      sortOrder: query.sortOrder || "asc",
      filters: query.filters,
    };
  }

  // Build MongoDB query from pagination options
  static buildMongoQuery(options: PaginationOptions): any {
    return {
      limit: options.limit,
      sort: { [options.sortBy]: options.sortOrder === "asc" ? 1 : -1 },
      cursor: options.cursor,
    };
  }

  // Extract cursor from document for next page
  static getCursor(doc: any, sortBy: string): string {
    return doc[sortBy];
  }

  // Format API response
  static formatResponse<T>(
    data: T[],
    hasNextPage: boolean,
    options: PaginationOptions,
    totalCount?: number
  ): PaginationResponse<T> {
    const sortBy = options.sortBy || "_id";
    const response: PaginationResponse<T> = {
      data,
      pagination: {
        hasNextPage,
        hasPreviousPage: options.cursor !== undefined,
        nextCursor: hasNextPage && data.length > 0
          ? (data[data.length - 1] as any)[sortBy]
          : undefined,
        previousCursor: options.cursor || undefined,
        limit: options.limit,
      },
    };

    if (totalCount !== undefined) {
      response.pagination.totalCount = totalCount;
    }

    return response;
  }
}
