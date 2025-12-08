
export type WithPagination<T, K extends string> = {
  meta: {
    total: number;
    offset: number;
    limit: number;
  }
} & Record<K, T>;