export class RoleEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly active: number,
    public readonly created_at: Date,
    public readonly updated_at: Date | null,
  ) {}

  isActive(): boolean {
    return this.active === 1
  }
}
