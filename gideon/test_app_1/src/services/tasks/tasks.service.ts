import { Service, AfterRoutesInit } from "@tsed/common";
import { TypeORMService } from "@tsed/typeorm";
import { Connection, Repository } from "typeorm";
import { Task } from "../../data/models/entities/task.entity";

@Service()
export class TasksService {

    private connection: Connection;
    private taskRepo: Repository<Task>;

    constructor(private typeORMService: TypeORMService) { }

    $afterRoutesInit() {
        this.connection = this.typeORMService.get();
        this.taskRepo = this.connection.getRepository(Task);
    }

    async create(task: Task): Promise<Task> {
        await this.taskRepo.save(task);
        return task;
    }

    async find(userId: number): Promise<Task[]> {
        console.log('#### '+ userId)
        const Tasks = await this.connection.manager.createQueryBuilder(Task, "task")
            .where("task.userId = :id", { id: userId }).getMany()
        return Tasks;
    }

    async findById(id: number): Promise<Task> {
        return await this.taskRepo.findOne(id);
    }


    async update(Task: Task): Promise<Task> {
        return await this.connection.manager.save(Task);
    }

    async remove(id: number): Promise<Task> {
        const Task = await this.taskRepo.findOne({ id });
        await this.connection.manager.remove(Task);
        return Task
    }
}