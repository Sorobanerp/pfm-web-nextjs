export interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  colorClass: string;
}

export function evaluatePasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return { score: 0, label: "Digite uma senha", colorClass: "bg-[#E6ECE2]" };
  }
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) {
    return { score: 1, label: "Fraca", colorClass: "bg-[#FF5D6C]" };
  }
  if (score === 2) {
    return { score: 2, label: "Razoável", colorClass: "bg-[#FBCEB5]" };
  }
  if (score === 3) {
    return { score: 3, label: "Forte", colorClass: "bg-[#8CBA51]" };
  }
  return { score: 4, label: "Excelente", colorClass: "bg-[#65962C]" };
}
