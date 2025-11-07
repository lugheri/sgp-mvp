export class TemplateAlreadyExistsError extends Error {
  constructor() {
    super(
      'Ops! Já existe uma conta com este nome. Por favor, escolha outro nome para sua nova conta.',
    )
  }
}
