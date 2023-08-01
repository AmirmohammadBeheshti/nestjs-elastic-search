import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import ProductEntity from './entity/product.entity';
import { ProductSearchService } from './product-search.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private postsRepository: Repository<ProductEntity>,
    private searchService: ProductSearchService,
  ) {}
  async createProduct(body: CreateProductDto) {
    const newPost = await this.postsRepository.create(body);
    await this.postsRepository.save(newPost);
    this.searchService.indexProduct(newPost);
    return newPost;
  }
  async searchForProduct(text: string, offset = 0, limit = 20) {
    const { results, count } = await this.searchService.search(
      text,
      offset,
      limit,
    );
    const ids = results.map((result) => result.id);
    if (!ids.length) {
      return {
        items: [],
        count,
      };
    }
    const items = await this.postsRepository.find({
      where: { id: In(ids) },
    });
    return {
      items,
      count,
    };
  }
}
