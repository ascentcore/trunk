import { Controller, Post, Get, BodyParams, Authenticated, Req, Use } from "@tsed/common";
import { Description, Returns, Summary } from "@tsed/swagger";
import { Task } from "../data/models/entities/task.entity";
import { User } from "../data/models/entities/user.entity";
import { TasksService } from "../services/tasks/tasks.service";

@Controller('/tasks')
export default class TasksController {

    constructor(private taskService: TasksService) {
    }

    @Post("/create")
    @Authenticated({ claim: 'can_create_tasks' })
    @Summary("User creates task")
    @Description(`
            Task creation
    `)
    @Returns(Task)
    async create(@Req('user') user: User, @BodyParams() task: Task): Promise<Task> {
        return this.taskService.create({ ...task, user });
    }


    @Get("/all")
    @Authenticated({ claim: 'can_list_claims' })
    @Summary("Gel all tasks")
    @Description(`
            List all tasks
        `)
    @Returns(Task)
    async getAll(@Req('user') user: User): Promise<Task[]> {
        return await this.taskService.find(user.id);
    }

}