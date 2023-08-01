import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async createProduct(@Body() body: CreateProductDto) {
    return this.productService.createProduct(body);
  }

  @Get()
  async getPosts(@Query('search') search: string) {
    return this.productService.searchForProduct(search);
  }

  @Delete(':id')
  async deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.productService.deleteProduct(+id);
  }
}
