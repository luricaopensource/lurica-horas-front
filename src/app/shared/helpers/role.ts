export const roles = [
  {
    id: 1,
    name: 'Administrador',
  },
  {
    id: 2,
    name: 'Consultor',
  },
  {
    id: 3,
    name: 'Empleado',
  }
]

export const DEFAULT_ROLE_ID = roles[0].id
export const DEFAULT_ROLE_NAME = roles[0].name

export const getRoleName = (roleId: number): string => {
  if (!roleId) roleId = DEFAULT_ROLE_ID

  const role = roles[roleId - 1]

  return role ? role.name : DEFAULT_ROLE_NAME
}

export const getRoleId = (roleName: string): number => {
  if (!roleName) roleName = DEFAULT_ROLE_NAME

  const role = roles.find(role => role.name.toLowerCase() === roleName.toLowerCase())

  return role ? role.id : DEFAULT_ROLE_ID
}
