import { Router } from "express";
import {
    createProject,
    deleteProject,
    getOneProject,
    getallProjects,
    updateProject,
} from "./handlers/project";
import { body } from "express-validator";
import { createTask, deleteTask, updateTask } from "./handlers/task";
import { getUser, updateUser } from "./handlers/user";

const router = Router();
//USER
router.get("/user", getUser);

router.put(
    "/user/:id",
    body("password").exists(),
    body("email").optional(),
    body("newpassword").optional(),
    updateUser
);

//PROJECTS

router.get("/project", getallProjects);

router.get("/project/:id", getOneProject);

router.post(
    "/project",
    body("name").exists().isString(),
    body("description").optional(),
    createProject
);

router.put(
    "/project/:id",
    body("name").optional(),
    body("description").optional(),
    updateProject
);

router.delete("/project/:id", deleteProject);

//TASKS

router.post(
    "/task",
    body("title").exists().isString(),
    body("description").optional(),
    createTask
);
router.put(
    "/task/:id",
    body("title").optional(),
    body("description").optional(),
    body("status").isIn(["IN_PROGRESS", "COMPLETED"]).optional(),
    updateTask
);
router.delete("/task/:id", deleteTask);

export default router;
