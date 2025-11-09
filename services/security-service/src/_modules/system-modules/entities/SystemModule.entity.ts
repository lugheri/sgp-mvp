export class SystemModuleEntity {
  constructor(
    public readonly id: number,
    public readonly module_owner: number,
    public readonly name: string,
    public readonly alias: string,
    public readonly icon: string,
    public readonly description: string,
    public readonly type_module: string,
    public readonly order: number,
    public readonly active: number,
    public readonly created_at: Date,
    public readonly updated_at: Date | null,
  ) {}

  isActive(): boolean {
    return this.active === 1
  }
}
