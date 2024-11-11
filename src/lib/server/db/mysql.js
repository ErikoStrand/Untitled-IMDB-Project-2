// db.js
import mysql from 'mysql2/promise';
import { env } from '$env/dynamic/private';

// Create a single pool instance that's reused
const pool = mysql.createPool({
	host: env.DB_HOST,
	user: env.DB_USER,
	password: env.DB_PASSWORD,
	database: env.DB_NAME,
	port: 20968,
	connectionLimit: 10, // Lower this for Vercel
	queueLimit: 0,
	waitForConnections: true,
	enableKeepAlive: true,
	keepAliveInitialDelay: 0
});

export async function query(sql, params) {
	try {
		const [results] = await pool.execute(sql, params);
		return results;
	} catch (error) {
		console.error('Database query error:', error);
		throw error;
	}
}

export async function querymany(sql, params) {
	try {
		const [results] = await pool.query(sql, params);
		return results;
	} catch (error) {
		console.error('Database query error:', error);
		throw error;
	}
}

// Optional: Clean up pool on app shutdown
process.on('SIGTERM', () => {
	pool.end();
});
