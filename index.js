'use strict'

const {logError}    = require('@popovmp/micro-logger')
const {requestForm} = require('@popovmp/request-service')

function getDbiler(url, secret, dbName)
{
	/**
	 * Parses the response
	 *
	 * @param {string | null} err
	 * @param {any | null}    res
	 *
	 * @return {any | null}
	 */
	function parseResponse(err, res)
	{
		if (err || typeof res !== 'object') {
			logError(`Network error: ${err}`, 'dbiler-response')
			return
		}

		if (res.err) {
			console.error(`Response error: ${res.err}`, 'dbiler-response')
			return
		}

		if (! res.hasOwnProperty('data') ) {
			console.error(`Response error: no data`, 'dbiler-response')
			return
		}

		return res.data
	}

	/**
	 * Inserts document in the DB.
	 *
	 * @param {Object} doc - document to be inserted in DB.
	 *
	 * @param {function(id: string|undefined)} callback.
	 */
	function insert(doc, callback)
	{
		const data = {
			secret: secret,
			dbName: dbName,
			doc   : JSON.stringify(doc),
		}

		requestForm(url + '/insert', data, {},
			requestService_post_ready)

		function requestService_post_ready(err, data)
		{
			const id = parseResponse(err, data)

			callback(id || undefined)
		}
	}

	/**
	 * Finds objects in DB.
	 *
	 * @param {Object} query
	 * @param {Object} projection
	 *
	 * @param {function(docs: Object[])} callback
	 */
	function find(query, projection, callback)
	{
		const data = {
			secret    : secret,
			dbName    : dbName,
			query     : JSON.stringify(query),
			projection: JSON.stringify(projection),
		}

		requestForm(url + '/find', data, {},
			requestService_post_ready)

		function requestService_post_ready(err, data)
		{
			const docs = parseResponse(err, data)

			callback(docs || [])
		}
	}

	/**
	 * Finds one object in DB.
	 * @param {Object} query
	 * @param {Object} projection
	 * @param {function(doc: Object|undefined)} callback
	 */
	function findOne(query, projection, callback)
	{
		const data = {
			secret    : secret,
			dbName    : dbName,
			query     : JSON.stringify(query),
			projection: JSON.stringify(projection),
		}

		requestForm(url + '/find-one', data, {},
			requestService_post_ready)

		function requestService_post_ready(err, data)
		{
			const doc = parseResponse(err, data)

			callback(doc || undefined)
		}
	}

	/**
	 * Counts objects in DB.
	 *
	 * @param {Object} query
	 * @param {function(count: number)} callback
	 */
	function count(query, callback)
	{
		const data = {
			secret: secret,
			dbName: dbName,
			query : JSON.stringify(query),
		}

		requestForm(url + '/count', data, {},
			requestService_post_ready)

		function requestService_post_ready(err, data)
		{
			const count = parseResponse(err, data)

			callback(count || 0)
		}
	}

	/**
	 * Updates documents in DB.
	 *
	 * @param {Object} query
	 * @param {Object} update
	 * @param {Object} options
	 * @param {function(numUpdated: number)} callback
	 */
	function update(query, update, options, callback)
	{
		const data = {
			secret : secret,
			dbName : dbName,
			query  : JSON.stringify(query),
			update : JSON.stringify(update),
			options: JSON.stringify(options),
		}

		requestForm(url + '/update', data, {},
			requestService_post_ready)

		function requestService_post_ready(err, data)
		{
			const numUpdated = parseResponse(err, data)

			callback(numUpdated || 0)
		}
	}

	/**
	 * Removes documents in DB.
	 *
	 * @param {Object} query
	 * @param {Object} options
	 * @param {function(numRemoved: number)} callback
	 */
	function remove(query, options, callback)
	{
		const data = {
			secret : secret,
			dbName : dbName,
			query  : JSON.stringify(query),
			options: JSON.stringify(options),
		}

		requestForm(url + '/remove', data, {},
			requestService_post_ready)

		function requestService_post_ready(err, data)
		{
			const numRemoved = parseResponse(err, data)

			callback(numRemoved || 0)
		}
	}

	/**
	 * Saves DB.
	 *
	 * @param {function(isSaved: boolean)} callback
	 */
	function save(callback)
	{
		const data = {
			secret: secret,
			dbName: dbName,
		}

		requestForm(url + '/save', data, {},
			requestService_post_ready)

		function requestService_post_ready(err, data)
		{
			const isSaved = parseResponse(err, data)

			callback(isSaved || false)
		}
	}

	return {
		insert,
		find,
		findOne,
		count,
		update,
		remove,
		save,
	}
}

module.exports = {
	getDbiler,
}
