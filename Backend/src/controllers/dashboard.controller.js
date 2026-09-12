import pool from "../config/db.js";

export const getDashboardData = async (req, res) => {
    try {
        const { role, id: userId } = req.user;
        let data = {};

        if (role === 'Admin') {
            const projectsResult = await pool.query("SELECT COUNT(*) FROM projects");
            data.total_projects = parseInt(projectsResult.rows[0].count, 10);

            const statusResult = await pool.query("SELECT status, COUNT(*) FROM tasks GROUP BY status");
            data.tasks_by_status = statusResult.rows.reduce((acc, row) => {
                acc[row.status] = parseInt(row.count, 10);
                return acc;
            }, {});

            const overdueResult = await pool.query("SELECT COUNT(*) FROM tasks WHERE status = 'Overdue' OR (due_date < NOW() AND status != 'Done')");
            data.overdue_tasks_count = parseInt(overdueResult.rows[0].count, 10);


            data.active_users_online = 0; 

        } else if (role === 'Project Manager') {
            const projectsResult = await pool.query("SELECT COUNT(*) FROM projects WHERE created_by = $1", [userId]);
            data.total_projects = parseInt(projectsResult.rows[0].count, 10);

            const priorityResult = await pool.query(
                "SELECT t.priority, COUNT(*) FROM tasks t JOIN projects p ON t.project_id = p.id WHERE p.created_by = $1 GROUP BY t.priority",
                [userId]
            );
            data.tasks_by_priority = priorityResult.rows.reduce((acc, row) => {
                acc[row.priority] = parseInt(row.count, 10);
                return acc;
            }, {});

            const upcomingResult = await pool.query(
                "SELECT t.id, t.title, t.due_date, t.priority, t.status FROM tasks t JOIN projects p ON t.project_id = p.id WHERE p.created_by = $1 AND t.due_date >= NOW() AND t.due_date <= NOW() + INTERVAL '7 days' AND t.status != 'Done' ORDER BY t.due_date ASC",
                [userId]
            );
            data.upcoming_tasks_this_week = upcomingResult.rows;

        } else if (role === 'Developer') {
            const tasksResult = await pool.query(
                "SELECT id, title, description, project_id, status, priority, due_date FROM tasks WHERE assigned_to = $1 AND status != 'Done' ORDER BY priority DESC, due_date ASC",
                [userId]
            );
            data.assigned_tasks = tasksResult.rows;
        }

        res.json({ dashboard: data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};
