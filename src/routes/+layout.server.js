import { query } from '$lib/server/db/mysql.js';
const upsertUserSQL = `
  INSERT INTO discordBasics (discordID, global_name, avatar, email)
  SELECT ?, ?, ?, ?
  WHERE NOT EXISTS (
    SELECT 1 FROM discordBasics WHERE discordID = ?
  )
`;

export async function load({ locals }) {
	if (locals.user.id != null) {
		try {
			await query(upsertUserSQL, [
				locals.user.id,
				locals.user.global_name,
				locals.user.avatar,
				locals.user.email,
				locals.user.id
			]);
		} catch (error) {
			console.error('Database error:', error);
		}
	}
	return {
		user: locals.user || null
	};
}
