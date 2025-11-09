export class SystemModuleAlreadyExistsError extends Error {
  constructor() {
    super(
      'Ops! Já existe um módulo de acesso com este nome. Por favor, escolha um nome diferente.',
    )
  }
}
