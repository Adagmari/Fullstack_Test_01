import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { User } from "./User";
import { Project } from "./Project";

@Entity("tasks")
export class Task {
  @PrimaryGeneratedColumn()
  task_id!: number;

  @Column()
  project_id!: number;

  @Column({ type: "varchar", length: 255 })
  title!: string;

  @Column({ type: "text", nullable: true })
  description!: string;

  @Column({ type: "enum", enum: ["baja", "media", "alta"], default: "media" })
  priority!: "baja" | "media" | "alta";

  @Column({ type: "enum", enum: ["pendiente", "en-progreso", "completada"], default: "pendiente" })
  status!: "pendiente" | "en-progreso" | "completada";

  @Column({ type: "date", nullable: true })
  due_date!: Date;

  @CreateDateColumn({ type: "datetime" })
  created_at!: Date;

  // Relación muchos a uno con proyecto
  @ManyToOne(() => Project, (project) => project.tasks)
  @JoinColumn({ name: "project_id" })
  project!: Project;

  // Relación muchos a muchos con usuarios (asignados)
  @ManyToMany(() => User)
  @JoinTable({
    name: "task_assignments",
    joinColumn: { name: "task_id", referencedColumnName: "task_id" },
    inverseJoinColumn: { name: "user_id", referencedColumnName: "user_id" },
  })
  assignedTo!: User[];
}
