const allRoles = {
  user: ['linkUnlinkVape', 'getOwnVapes'],
  admin: ['getUsers', 'manageUsers', 'getVapes', 'manageVapes'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
