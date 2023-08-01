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
  async remove(articleId: number) {
    this.elasticsearchService.deleteByQuery({
      index: this.index,
      body: {
        query: {
          match: {
            id: articleId,
          },
        },
      },
    });
  }
  async search(text: string, offset?: number, limit?: number) {
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
      count: count,
      results,
    };
  }
}
