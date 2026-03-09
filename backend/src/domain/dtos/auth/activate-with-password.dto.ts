export class ActivateWithPasswordDto {
  private constructor(
    public readonly email: string,
    public readonly currentPassword: string,
    public readonly newPassword: string,
  ) { }

  static create(body: Record<string, unknown>): [string?, ActivateWithPasswordDto?] {
    const { email, currentPassword, newPassword, confirmPassword } = body;

    if (!email || typeof email !== 'string') return ['Email is required'];
    if (!currentPassword || typeof currentPassword !== 'string') return ['Current password is required'];
    if (!newPassword || typeof newPassword !== 'string') return ['New password is required'];
    if (!confirmPassword || typeof confirmPassword !== 'string') return ['Confirm password is required'];
    if (newPassword !== confirmPassword) return ['New password and confirm password do not match'];
    if (newPassword.length < 6) return ['New password must be at least 6 characters'];
    if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(newPassword)) return ['New password must contain letters and numbers'];
    if (currentPassword === newPassword) return ['New password must be different from current password'];

    return [undefined, new ActivateWithPasswordDto(email, currentPassword, newPassword)];
  }
}
