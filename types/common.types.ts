export interface GlobalResponse<T> {
  message: string;
  data: T;
  pagination?: {
    currentPage: number;
    nextPage: number | null;
    prevPage: number | null;
    totalPage: number;
    totalRecords: number;
  } | null;
  reqId: string;
  status: "T" | "F"; 
}

export interface ErrorResponse {
  message: string;
  data?: any;
}
