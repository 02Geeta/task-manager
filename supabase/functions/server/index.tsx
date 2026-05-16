import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Helper function to create Supabase client with service role
const getServiceClient = () => createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Helper function to verify user authentication
const verifyAuth = async (authHeader: string | null) => {
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  const accessToken = authHeader.split(' ')[1];
  const supabase = getServiceClient();
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user) {
    return null;
  }
  return user;
};

// Health check endpoint
app.get("/make-server-bfa263b0/health", (c) => {
  return c.json({ status: "ok" });
});

// ============ AUTHENTICATION ROUTES ============

// Signup
app.post("/make-server-bfa263b0/auth/signup", async (c) => {
  try {
    const { name, email, password } = await c.req.json();

    if (!name || !email || !password) {
      return c.json({ error: "Name, email, and password are required" }, 400);
    }

    const supabase = getServiceClient();
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      email_confirm: true, // Auto-confirm since email server not configured
    });

    if (error) {
      console.log(`Signup error for ${email}: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    // Store user data in KV store
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      name,
      email,
      createdAt: new Date().toISOString(),
    });

    console.log(`User created successfully: ${email}`);
    return c.json({
      message: "User created successfully",
      user: { id: data.user.id, name, email }
    });
  } catch (error) {
    console.log(`Signup error: ${error.message}`);
    return c.json({ error: "Failed to create user" }, 500);
  }
});

// Login
app.post("/make-server-bfa263b0/auth/login", async (c) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: "Email and password are required" }, 400);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
    );

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log(`Login error for ${email}: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    // Get user data from KV store
    const userData = await kv.get(`user:${data.user.id}`);

    console.log(`User logged in successfully: ${email}`);
    return c.json({
      accessToken: data.session.access_token,
      user: userData || { id: data.user.id, email: data.user.email }
    });
  } catch (error) {
    console.log(`Login error: ${error.message}`);
    return c.json({ error: "Failed to login" }, 500);
  }
});

// Get current session
app.get("/make-server-bfa263b0/auth/session", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userData = await kv.get(`user:${user.id}`);
    return c.json({ user: userData || { id: user.id, email: user.email } });
  } catch (error) {
    console.log(`Session error: ${error.message}`);
    return c.json({ error: "Failed to get session" }, 500);
  }
});

// ============ PROJECT ROUTES ============

// Create project
app.post("/make-server-bfa263b0/projects", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized - please login" }, 401);
    }

    const { name, description } = await c.req.json();
    if (!name) {
      return c.json({ error: "Project name is required" }, 400);
    }

    const projectId = crypto.randomUUID();
    const project = {
      id: projectId,
      name,
      description: description || "",
      adminId: user.id,
      members: [user.id],
      createdAt: new Date().toISOString(),
    };

    await kv.set(`project:${projectId}`, project);

    // Add to user's projects
    const userProjects = await kv.get(`user:${user.id}:projects`) || [];
    userProjects.push(projectId);
    await kv.set(`user:${user.id}:projects`, userProjects);

    console.log(`Project created: ${name} by user ${user.id}`);
    return c.json({ project });
  } catch (error) {
    console.log(`Create project error: ${error.message}`);
    return c.json({ error: "Failed to create project" }, 500);
  }
});

// Get all projects for user
app.get("/make-server-bfa263b0/projects", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized - please login" }, 401);
    }

    const projectIds = await kv.get(`user:${user.id}:projects`) || [];
    const projects = [];

    for (const projectId of projectIds) {
      const project = await kv.get(`project:${projectId}`);
      if (project) {
        projects.push(project);
      }
    }

    return c.json({ projects });
  } catch (error) {
    console.log(`Get projects error: ${error.message}`);
    return c.json({ error: "Failed to get projects" }, 500);
  }
});

// Add member to project
app.post("/make-server-bfa263b0/projects/:projectId/members", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized - please login" }, 401);
    }

    const projectId = c.req.param('projectId');
    const { userEmail } = await c.req.json();

    const project = await kv.get(`project:${projectId}`);
    if (!project) {
      return c.json({ error: "Project not found" }, 404);
    }

    // Check if user is admin
    if (project.adminId !== user.id) {
      return c.json({ error: "Only project admin can add members" }, 403);
    }

    // Find user by email
    const allProjects = await kv.getByPrefix("user:");
    let targetUserId = null;
    for (const userData of allProjects) {
      if (userData.email === userEmail) {
        targetUserId = userData.id;
        break;
      }
    }

    if (!targetUserId) {
      return c.json({ error: "User not found" }, 404);
    }

    if (project.members.includes(targetUserId)) {
      return c.json({ error: "User already a member" }, 400);
    }

    // Add member to project
    project.members.push(targetUserId);
    await kv.set(`project:${projectId}`, project);

    // Add project to user's projects
    const userProjects = await kv.get(`user:${targetUserId}:projects`) || [];
    userProjects.push(projectId);
    await kv.set(`user:${targetUserId}:projects`, userProjects);

    console.log(`Member ${userEmail} added to project ${projectId}`);
    return c.json({ message: "Member added successfully", project });
  } catch (error) {
    console.log(`Add member error: ${error.message}`);
    return c.json({ error: "Failed to add member" }, 500);
  }
});

// Remove member from project
app.delete("/make-server-bfa263b0/projects/:projectId/members/:memberId", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized - please login" }, 401);
    }

    const projectId = c.req.param('projectId');
    const memberId = c.req.param('memberId');

    const project = await kv.get(`project:${projectId}`);
    if (!project) {
      return c.json({ error: "Project not found" }, 404);
    }

    // Check if user is admin
    if (project.adminId !== user.id) {
      return c.json({ error: "Only project admin can remove members" }, 403);
    }

    if (memberId === project.adminId) {
      return c.json({ error: "Cannot remove project admin" }, 400);
    }

    // Remove member from project
    project.members = project.members.filter((id: string) => id !== memberId);
    await kv.set(`project:${projectId}`, project);

    // Remove project from user's projects
    const userProjects = await kv.get(`user:${memberId}:projects`) || [];
    const updatedProjects = userProjects.filter((id: string) => id !== projectId);
    await kv.set(`user:${memberId}:projects`, updatedProjects);

    console.log(`Member ${memberId} removed from project ${projectId}`);
    return c.json({ message: "Member removed successfully", project });
  } catch (error) {
    console.log(`Remove member error: ${error.message}`);
    return c.json({ error: "Failed to remove member" }, 500);
  }
});

// ============ TASK ROUTES ============

// Create task
app.post("/make-server-bfa263b0/tasks", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized - please login" }, 401);
    }

    const { projectId, title, description, dueDate, priority, assignedTo } = await c.req.json();

    if (!projectId || !title) {
      return c.json({ error: "Project ID and title are required" }, 400);
    }

    const project = await kv.get(`project:${projectId}`);
    if (!project) {
      return c.json({ error: "Project not found" }, 404);
    }

    // Check if user is admin to create tasks
    if (project.adminId !== user.id) {
      return c.json({ error: "Only project admin can create tasks" }, 403);
    }

    const taskId = crypto.randomUUID();
    const task = {
      id: taskId,
      projectId,
      title,
      description: description || "",
      dueDate: dueDate || null,
      priority: priority || "Medium",
      status: "To Do",
      assignedTo: assignedTo || null,
      createdBy: user.id,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`task:${taskId}`, task);

    // Add to project's tasks
    const projectTasks = await kv.get(`project:${projectId}:tasks`) || [];
    projectTasks.push(taskId);
    await kv.set(`project:${projectId}:tasks`, projectTasks);

    console.log(`Task created: ${title} in project ${projectId}`);
    return c.json({ task });
  } catch (error) {
    console.log(`Create task error: ${error.message}`);
    return c.json({ error: "Failed to create task" }, 500);
  }
});

// Get all tasks for a project
app.get("/make-server-bfa263b0/projects/:projectId/tasks", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized - please login" }, 401);
    }

    const projectId = c.req.param('projectId');
    const project = await kv.get(`project:${projectId}`);

    if (!project) {
      return c.json({ error: "Project not found" }, 404);
    }

    // Check if user is member
    if (!project.members.includes(user.id)) {
      return c.json({ error: "Access denied" }, 403);
    }

    const taskIds = await kv.get(`project:${projectId}:tasks`) || [];
    const tasks = [];

    for (const taskId of taskIds) {
      const task = await kv.get(`task:${taskId}`);
      if (task) {
        // Members can only see their assigned tasks
        if (project.adminId === user.id || task.assignedTo === user.id) {
          tasks.push(task);
        }
      }
    }

    return c.json({ tasks });
  } catch (error) {
    console.log(`Get tasks error: ${error.message}`);
    return c.json({ error: "Failed to get tasks" }, 500);
  }
});

// Update task
app.put("/make-server-bfa263b0/tasks/:taskId", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized - please login" }, 401);
    }

    const taskId = c.req.param('taskId');
    const updates = await c.req.json();

    const task = await kv.get(`task:${taskId}`);
    if (!task) {
      return c.json({ error: "Task not found" }, 404);
    }

    const project = await kv.get(`project:${task.projectId}`);
    if (!project) {
      return c.json({ error: "Project not found" }, 404);
    }

    // Admin can update everything, members can only update status of their tasks
    if (project.adminId === user.id) {
      Object.assign(task, updates);
    } else if (task.assignedTo === user.id) {
      // Members can only update status
      if (updates.status) {
        task.status = updates.status;
      } else {
        return c.json({ error: "Members can only update task status" }, 403);
      }
    } else {
      return c.json({ error: "Access denied" }, 403);
    }

    await kv.set(`task:${taskId}`, task);

    console.log(`Task ${taskId} updated by user ${user.id}`);
    return c.json({ task });
  } catch (error) {
    console.log(`Update task error: ${error.message}`);
    return c.json({ error: "Failed to update task" }, 500);
  }
});

// Delete task
app.delete("/make-server-bfa263b0/tasks/:taskId", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized - please login" }, 401);
    }

    const taskId = c.req.param('taskId');
    const task = await kv.get(`task:${taskId}`);

    if (!task) {
      return c.json({ error: "Task not found" }, 404);
    }

    const project = await kv.get(`project:${task.projectId}`);
    if (!project) {
      return c.json({ error: "Project not found" }, 404);
    }

    // Only admin can delete tasks
    if (project.adminId !== user.id) {
      return c.json({ error: "Only project admin can delete tasks" }, 403);
    }

    await kv.del(`task:${taskId}`);

    // Remove from project's tasks
    const projectTasks = await kv.get(`project:${task.projectId}:tasks`) || [];
    const updatedTasks = projectTasks.filter((id: string) => id !== taskId);
    await kv.set(`project:${task.projectId}:tasks`, updatedTasks);

    console.log(`Task ${taskId} deleted`);
    return c.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.log(`Delete task error: ${error.message}`);
    return c.json({ error: "Failed to delete task" }, 500);
  }
});

// ============ DASHBOARD ROUTES ============

// Get dashboard analytics
app.get("/make-server-bfa263b0/dashboard/:projectId", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized - please login" }, 401);
    }

    const projectId = c.req.param('projectId');
    const project = await kv.get(`project:${projectId}`);

    if (!project) {
      return c.json({ error: "Project not found" }, 404);
    }

    // Check if user is member
    if (!project.members.includes(user.id)) {
      return c.json({ error: "Access denied" }, 403);
    }

    const taskIds = await kv.get(`project:${projectId}:tasks`) || [];
    const tasks = [];

    for (const taskId of taskIds) {
      const task = await kv.get(`task:${taskId}`);
      if (task) {
        tasks.push(task);
      }
    }

    // Calculate statistics
    const totalTasks = tasks.length;
    const todoTasks = tasks.filter(t => t.status === "To Do").length;
    const inProgressTasks = tasks.filter(t => t.status === "In Progress").length;
    const doneTasks = tasks.filter(t => t.status === "Done").length;

    const now = new Date();
    const overdueTasks = tasks.filter(t => {
      if (!t.dueDate || t.status === "Done") return false;
      return new Date(t.dueDate) < now;
    }).length;

    // Tasks per user
    const tasksPerUser: Record<string, number> = {};
    for (const task of tasks) {
      if (task.assignedTo) {
        tasksPerUser[task.assignedTo] = (tasksPerUser[task.assignedTo] || 0) + 1;
      }
    }

    // Get member details
    const members = [];
    for (const memberId of project.members) {
      const memberData = await kv.get(`user:${memberId}`);
      if (memberData) {
        members.push({
          ...memberData,
          taskCount: tasksPerUser[memberId] || 0,
          isAdmin: memberId === project.adminId,
        });
      }
    }

    return c.json({
      totalTasks,
      todoTasks,
      inProgressTasks,
      doneTasks,
      overdueTasks,
      tasksPerUser,
      members,
    });
  } catch (error) {
    console.log(`Dashboard error: ${error.message}`);
    return c.json({ error: "Failed to get dashboard data" }, 500);
  }
});

Deno.serve(app.fetch);