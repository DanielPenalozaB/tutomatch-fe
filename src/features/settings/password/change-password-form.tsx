'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { changePassword } from '@/lib/api/settings/change-password';
import { ApiResponseError } from '@/lib/api/api';

// Password schema with validation
const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(6, {
      message: 'La contraseña actual debe tener al menos 6 caracteres'
    }),
    newPassword: z.string().min(6, {
      message: 'La nueva contraseña debe tener al menos 6 caracteres'
    }),
    confirmPassword: z.string().min(6, {
      message: 'La confirmación debe tener al menos 6 caracteres'
    })
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: [ 'confirmPassword' ]
  });

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export default function ChangePasswordForm() {
  const [ isLoading, setIsLoading ] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (data: PasswordFormValues) => {
    try {
      setIsLoading(true);

      if (!session?.accessToken) {
        throw new Error('No authentication token found');
      }

      await changePassword(
        {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword
        },
        session.accessToken
      );

      toast.success('Éxito', {
        description: 'Tu contraseña ha sido cambiada correctamente'
      });

      router.push('/settings');
    } catch (error) {
      if (error instanceof ApiResponseError) {
        if (error.message === 'New password cannot be the same as the current password') {
          toast.error('La nueva contraseña no puede ser la misma que la actual');
        } else {
          toast.error(`Error ${error.statusCode}`, {
            description: error.message || 'Ocurrió un error al cambiar la contraseña'
          });
        }
      } else {
        console.error('Error changing password:', error);
        toast.error('Error', {
          description: error instanceof Error ? error.message : 'No se pudo cambiar la contraseña'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-md space-y-6">
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña actual</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Tu contraseña actual" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nueva contraseña</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Mínimo 6 caracteres" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar nueva contraseña</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Repite tu nueva contraseña" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={() => router.push('/settings/profile')} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cambiando...
              </>
            ) : (
              'Cambiar contraseña'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
