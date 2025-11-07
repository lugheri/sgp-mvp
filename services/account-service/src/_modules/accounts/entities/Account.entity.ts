export class AccountEntity {
  constructor(
    public readonly id: number,
    public readonly account_owner: number,
    public readonly account_name: string,
    public readonly company_name: string,
    public readonly terms_agreed: number,
    public readonly public_ip: string,
    public readonly local_ip: string,
    public readonly setup_environment: number,
    public readonly active: number,
    public readonly created_at: Date,
    public readonly updated_at: Date | null,
  ) {}

  isActive(): boolean {
    return this.active === 1
  }

  isAgreed(): boolean {
    return this.terms_agreed === 1
  }
}
