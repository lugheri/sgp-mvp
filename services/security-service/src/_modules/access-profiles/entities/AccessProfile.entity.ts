export class AccessProfileEntity {
  constructor(
    public readonly id: number,
    public readonly account_id: number,
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
