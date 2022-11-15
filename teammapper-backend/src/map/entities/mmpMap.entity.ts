import {
  Entity, Column, PrimaryGeneratedColumn, OneToMany, Generated,
} from 'typeorm';
import { MapOptions } from '../types';
import { MmpNode } from './mmpNode.entity';

const mmpMapOptionDefaults: MapOptions = {
  fontIncrement: 5,
  fontMaxSize: 70,
  fontMinSize: 15
}

@Entity()
class MmpMap {
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @Column({ type: 'timestamptz', nullable: true, default: () => 'now()' })
    lastModified: Date;

  @Column({ nullable: true })
  @Generated('uuid')
    adminId: string;

  @Column({ nullable: true })
    name: string;

  @Column('jsonb', { nullable: false, default: {} })
    options: MapOptions;

  /* eslint-disable @typescript-eslint/no-unused-vars */
  @OneToMany(type => MmpNode, (node) => node.nodeMap, {
    cascade: true,
    })
  /* eslint-enable @typescript-eslint/no-unused-vars */
    nodes: MmpNode[];
}

export { MmpMap, mmpMapOptionDefaults }
