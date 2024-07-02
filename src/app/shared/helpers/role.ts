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

export const getRoleName = (roleId: number): string => {
  const role = roles[roleId - 1]

  return role ? role.name : ''
}


export const getRoleId = (roleName: string): number => {
  const role = roles.find(role => role.name.toLowerCase() === roleName.toLowerCase())

  return role ? role.id : 0
}
