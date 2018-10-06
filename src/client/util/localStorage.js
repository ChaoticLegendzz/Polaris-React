/*
	Interfaces with session storage and the API to provide Roblox and Discord stuff
*/
/* global Raven */

const {apiFetch}  = require('./apiFetch.js');

// Extend the storage object (and hence session storage) to support objects.
Storage.prototype.setObject = function(key, value) {
	this.setItem(key, JSON.stringify(value));
};

Storage.prototype.getObject = function(key) {
	var value = this.getItem(key);
	return value && JSON.parse(value);
};


module.exports.getGroupInfo = async function (groupId) {

	let cachedInfo = sessionStorage.getObject(groupId);
	if (cachedInfo) {
		return cachedInfo;
	}
	const res = await fetch(`/api/roblox/group/${groupId}`);
	const json = await res.json();
	if (!res.ok) {
		console.error(json);
		return json;
	} else {
		sessionStorage.setObject(groupId, json);
		return json;
	}
};




module.exports.getDiscordInfo = async function () {

	let cachedInfo = sessionStorage.getObject("discord");
	if (cachedInfo) {
		return cachedInfo;
	}
	const json = await apiFetch(`/api/discord/@me`);
	if (json.error) {
		console.error(json);
		return json;
	} else {
		sessionStorage.setObject("discord", json);

		Raven.setExtraContext({
			discordId: json.id,
			discordName: json.username,
			discordDisc: json.discriminator
		});

		return json;
	}
};
// Bad idea? Yes. Very very easy to lose cache. Only meant to store them while this page is open. Won't bother with autoclear: Refreshing will do it.
const discordRolesCache = {};
module.exports.getDiscordRoles = async function (guildId) {
	guildId = guildId || window._discordServerId;
	let cachedInfo = discordRolesCache[guildId];
	if (cachedInfo) {
		return cachedInfo;
	}
	const json = await apiFetch(`/api/servers/${guildId}/roles`);
	if (json.error) {
		console.error(json);
		return json;
	} else {
		discordRolesCache[guildId] = json;

		return json;
	}
};
