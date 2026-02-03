import { z } from 'zod';

const variationSchema = z.object({
  variation_type_id: z.string().min(1, "Selecione o tipo"),
  variant_option_id: z.string().min(1, "Selecione a opção"),
  stock: z.number().min(0, "Estoque não pode ser negativo"),
  extra_price: z.number().default(0),
  sku: z.string().min(3, "SKU é obrigatório"),
});

const productSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  description: z.string().optional(),
  price: z.coerce.number().positive("O preço deve ser maior que zero"),
  brand_id: z.string().min(1, "Selecione uma marca"),
  category_id: z.string().min(1, "Selecione uma categoria"),
  subcategory_id: z.string().min(1, "Selecione uma subcategoria"),
  stock: z.number().optional(),
  active: z.boolean().default(true),
  // Validação condicional: se tiver variações, o array não pode estar vazio
  variations: z.array(variationSchema).optional()
});

type ProductFormData = z.infer<typeof productSchema>;