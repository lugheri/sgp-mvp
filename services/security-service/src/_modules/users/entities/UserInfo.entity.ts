export class UserInfoEntity {
  constructor(
    public readonly id: number,
    public readonly user_id: number,
    public readonly name: string,
    public readonly email: string,
    public readonly number_phone: string,
    public readonly is_whatsapp: number,
    public readonly other_phone: string | null,
    public readonly alternative_email: string | null,
  ) {}
}
