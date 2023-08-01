import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ProductSearchBody, ProductSearchResult } from './types';
import ProductEntity from './entity/product.entity';
import { ApiResponse } from '@elastic/elasticsearch';
// import { WriteResponseBase } from '@elastic/elasticsearch/lib/api/types';
@Injectable()
export class ProductSearchService {
  index = 'products';

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async indexProduct(
    product: ProductEntity,
  ): Promise<ApiResponse<ProductSearchBody, Record<string, unknown>>> {
    return this.elasticsearchService.index<ProductSearchBody>({
      index: this.index,
      body: {
        id: product.id,
        title: product.title,
        content: product.content,
        price: product.price,
      },
    });
  }

  async search(text: string, offset?: number, limit?: number, startId = 0) {
    // let separateCount = 0;
    // if (startId) {
    //   separateCount = await this.count(text, ['title', 'content']);
    // }
    const { body } =
      await this.elasticsearchService.search<ProductSearchResult>({
        index: this.index,
        from: offset,
        size: limit,
        body: {
          query: {
            bool: {
              must: {
                multi_match: {
                  query: text,
                  fields: ['title', 'content'],
                },
              },
              filter: {
                range: {
                  id: {
                    gt: startId,
                  },
                },
              },
            },
          },
          sort: {
            _score: {
              order: 'desc',
            },
          },
        },
      });
    const count = body.hits.total.value;
    const hits = body.hits.hits;
    const results = hits.map((item) => item._source);
    return {
      // count: startId ? separateCount : count,
      count: 0,
      results,
    };
  }
}
