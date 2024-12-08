export async function _deleteWatchlist(id) {
	try {
		const response = await fetch('/api/party/deleteWatchlist', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ id })
		});

		if (!response.ok) {
			throw new Error('Network response was not ok');
		}

		const result = await response.json();
		return result;
	} catch (error) {
		console.error('Error:', error);
		throw error;
	}
}
export async function _createWatchlist(name, ownerID) {
	try {
		const response = await fetch('/api/party/createWatchlist', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name: name.toString(),
				ownerID: ownerID.toString()
			})
		});

		if (!response.ok) {
			throw new Error('Failed to create watchlist');
		}
		console.log(response);
		const result = await response.json();
		return result;
	} catch (error) {
		console.error('Failed to create watchlist:', error);
		return { success: false };
	}
}
export async function _leaveWatchlist(watchlistId, userId) {
	try {
		const response = await fetch('/api/party/leaveWatchlist', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				watchlistId,
				userId
			})
		});

		if (!response.ok) {
			throw new Error('Failed to leave watchlist');
		}

		return true;
	} catch (error) {
		console.error('Failed to leave watchlist:', error);
		return false;
	}
}
