import pool from "../config/db.js";
import { emitTaskActivity } from "../socket/socket.js";

const markOverdueTasks = async () => {
    try {
        const query = `
            UPDATE tasks 
            SET status = 'Overdue' 
            WHERE due_date < NOW() 
            AND status NOT IN ('Done', 'Overdue')
            RETURNING id, title, project_id, assigned_to, status;
        `;
        
        const result = await pool.query(query);
        
        if (result.rows.length > 0) {
            console.log(`[Job] Automatically marked ${result.rows.length} tasks as Overdue.`);
            
            for (const task of result.rows) {
                
                await pool.query(
                    "INSERT INTO task_activity_logs (task_id, old_status, new_status) VALUES ($1, $2, $3)",
                    [task.id, 'To Do/In Progress', 'Overdue'] 
                );
                emitTaskActivity(task.project_id, task.assigned_to, {
                    taskId: task.id,
                    taskTitle: task.title,
                    action: "System Update",
                    details: `Task automatically marked as Overdue.`,
                    timestamp: new Date()
                });
            }
        }
    } catch (err) {
        console.error("[Job] Error marking overdue tasks:", err);
    }
};

export const startOverdueJob = () => {
    markOverdueTasks();
    setInterval(markOverdueTasks, 60 * 1000);
};
