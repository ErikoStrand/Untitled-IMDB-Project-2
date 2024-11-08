import mysql from 'mysql2/promise';
import { env } from '$env/dynamic/private';
export function getMysqlPool() {
	return mysql.createPool({
		host: env.DB_HOST,
		user: env.DB_USER,
		password: env.DB_PASSWORD,
		database: env.DB_NAME,
		port: 20968,
		connectionLimit: 100,
		queueLimit: 0, // Unlimited queueing
		waitForConnections: true // Wait for a connection if all are in use
	});
}

export async function query(sql, params) {
	const pool = getMysqlPool();
	try {
		const [results] = await pool.execute(sql, params);
		await pool.end();
		return results;
	} catch (error) {
		console.error('Database query error:', error);
		await pool.end();
		throw error;
	}
}

export async function querymany(sql, params) {
	const pool = getMysqlPool();
	try {
		const [results] = await pool.query(sql, params);
		await pool.end();
		return results;
	} catch (error) {
		console.error('Database query error:', error);
		await pool.end();
		throw error;
	}
}
