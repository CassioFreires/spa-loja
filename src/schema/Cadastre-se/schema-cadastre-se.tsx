import { z } from "zod";

export const CadastreSeSchema = z
  .object({
    name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
    email: z.string().email({ message: 'Email inválido' }),
    phone: z.string().min(10, { message: 'Telefone inválido' }).optional(),
    password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }),
    confirmPassword: z.string().min(6, {
      message: 'A confirmação de senha deve ter pelo menos 6 caracteres',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'], // 🔥 ESSENCIAL
    message: 'As senhas não coincidem',
  });
