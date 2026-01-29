// schema-login.ts
import { z } from "zod";

export const LoginSchema = z.object({
  email: z
    .string()
    .email("Informe um email válido"),
  password: z
    .string()
    .min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export type LoginFormData = z.infer<typeof LoginSchema>;
