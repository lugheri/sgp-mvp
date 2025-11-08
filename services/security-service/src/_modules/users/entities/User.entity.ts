export class UserEntity {
  constructor(
    public readonly id: number,
    public readonly account_id: number,
    public readonly username: string,
    public readonly password: string,
    public readonly user_type:
      | 'operational'
      | 'supervisor'
      | 'manager'
      | 'technical'
      | 'account_manager',
    public readonly access_profile: number,
    public readonly reset_password: number,
    public readonly active: number,
    public readonly created_at: Date,
    public readonly updated_at: Date | null,
  ) {}

  isActive(): boolean {
    return this.active === 1
  }
}
