import { ProductSearchBody } from './product-search-body.type';

export interface ProductSearchResult {
  hits: {
    total: {
      value: number;
    };
    hits: Array<{
      _source: ProductSearchBody;
    }>;
  };
}
