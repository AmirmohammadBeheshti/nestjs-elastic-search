import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
class ProductEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column()
  public title: string;

  @Column('text')
  public content: string;
  @Column({ type: 'float' })
  public price: number;
}

export default ProductEntity;
