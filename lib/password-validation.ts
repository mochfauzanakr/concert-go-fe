export function passwordError(password: string): string | undefined {
  if (password.length < 8) return "Kata sandi minimal 8 karakter.";
  if (new TextEncoder().encode(password).length > 72) return "Kata sandi maksimal 72 byte.";
  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return "Gunakan huruf besar, huruf kecil, angka, dan simbol seperti ! atau @.";
  }
}
