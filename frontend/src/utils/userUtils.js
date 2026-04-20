export function getUserName(users, id) {
    if (!users || !Array.isArray(users)) return `User ${id}`;
    const u = users.find(x => x.id === id);
    return u ? `${u.name} (ID: ${id})` : `User ${id}`;
}
