import { Property, MaxLength, Required } from "@tsed/common";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Task {

    @PrimaryGeneratedColumn()
    @Property()
    id: number;

    @Column()
    @MaxLength(300)
    @Required()
    task: string;

    @Column()
    @MaxLength(1)
    emoji: string;

    @Column()
    @MaxLength(100)
    @Required()
    category: string;

    @ManyToOne(type => User, user => user.tasks)
    user: User;

}