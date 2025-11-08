export class UserAlreadyExistsError extends Error {
  constructor() {
    super(
      'Ops! Já existe um usuário com este username. Por favor, escolha um username diferente.',
    )
  }
}
