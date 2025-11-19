import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn
  } from "typeorm";
  
  @Entity("users")
  export class User {
    @PrimaryGeneratedColumn()
    user_id!: number;
  
    @Column({ type: "varchar", length: 100 })
    user_names!: string;
  
    @Column({ type: "varchar", length: 100, unique: true })
    user_email!: string;
  
    @Column({ type: "int", select: false })
    user_rol!: number;
  
    @Column({ type: "tinyint", default: 1, select: false })
    user_state!: number; // 1 activo, 0 inactivo
  
    @Column({ type: "varchar", length: 255 })
    user_clave!: string; // contraseña con hash bcrypt
    
  
    @Column({ type: "text", nullable: true, select: false })
    user_token!: string | null;
  
    @CreateDateColumn({ type: "timestamp", select: false })
    created_at!: Date;
  
    @UpdateDateColumn({ type: "timestamp", select: false })
    updated_at!: Date;
  }
  