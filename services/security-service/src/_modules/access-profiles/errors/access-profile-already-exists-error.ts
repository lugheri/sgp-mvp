export class AccessProfileAlreadyExistsError extends Error {
  constructor() {
    super(
      'Ops! Já existe um perfil de acesso com este nome. Por favor, escolha um nome diferente.',
    )
  }
}
