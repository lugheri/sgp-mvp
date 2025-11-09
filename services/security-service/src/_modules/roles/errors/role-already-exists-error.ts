export class RoleAlreadyExistsError extends Error {
  constructor() {
    super('Ops! Esta regra Já existe. Por favor, escolha um regra diferente.')
  }
}
