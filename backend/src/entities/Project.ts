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
import { Task } from "./Task";


@Entity("projects")
export class Project {
  @PrimaryGeneratedColumn()
  project_id!: number;

  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "text", nullable: true })
  description!: string;

  @CreateDateColumn({ type: "datetime" })
  created_at!: Date;

  // Relación muchos a muchos con usuarios (miembros)
  @ManyToMany(() => User)
  @JoinTable({
    name: "project_members",
    joinColumn: { name: "project_id", referencedColumnName: "project_id" },
    inverseJoinColumn: { name: "user_id", referencedColumnName: "user_id" },
  })
  members!: User[];

  // Relación uno a muchos con tareas
  @OneToMany(() => Task, (task) => task.project)
  tasks!: Task[];
}
