'use client';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ApiResponseError } from '@/lib/api/api';
import { getProfile } from '@/lib/api/settings/get-profile';
import { updateProfile } from '@/lib/api/settings/update-profile';
import { cn, getFormatedRole } from '@/lib/utils';
import { AcademicProgram } from '@/types/academic-programs';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const profileFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'El nombre debe tener al menos 2 caracteres.'
    })
    .max(100, {
      message: 'El nombre debe tener como máximo 100 caracteres.'
    }),
  password: z.string().min(6).max(100).optional(),
  bio: z.string().max(160).optional(),
  studentCode: z.string().max(20).optional(),
  academicProgram: z.string().max(100).optional(),
  semester: z.string().max(2).optional()
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfileForm() {
  const [ isLoading, setIsLoading ] = useState(true);
  const { data: session, status, update } = useSession();
  const { push } = useRouter();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '',
      bio: '',
      studentCode: '',
      academicProgram: '',
      semester: ''
    },
    mode: 'onChange'
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);

        if (!session?.accessToken) {
          throw new Error('No authentication token found');
        }

        const data = await getProfile(session.accessToken);

        form.reset({
          name: data.name || '',
          bio: data.bio || '',
          studentCode: data.studentCode || '',
          academicProgram: data.academicProgram || '',
          semester: data.semester?.toString() || ''
        });
      } catch (error) {
        // Handle ApiResponseError specifically
        if (error instanceof ApiResponseError) {
          // Handle different status codes differently if needed
          if (error.statusCode === 404) {
            toast.error('Usuario no encontrado', {
              description: 'No se pudo encontrar tu perfil de usuario'
            });
            await signOut();
          } else if (error.statusCode === 401) {
            toast.error('Sesión expirada', {
              description: 'Tu sesión ha expirado. Por favor inicia sesión nuevamente'
            });
          } else {
            toast.error(`Error ${error.statusCode}`, {
              description: error.message || 'Ocurrió un error al cargar tu perfil'
            });
          }
        } else {
          // Handle other errors (like network errors)
          toast.error('Error de conexión', {
            description: error instanceof Error ? error.message : 'No se pudo conectar con el servidor'
          });
        }

        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchUserData();
    }
  }, [ form, session?.accessToken, status, toast ]);

  const onSubmit = async (formData: ProfileFormValues) => {
    try {
      setIsLoading(true);

      if (!session?.accessToken) {
        throw new Error('No authentication token found');
      }

      // Prepare the data for the API
      const updateData = {
        name: formData.name,
        bio: formData.bio,
        ...(session?.user?.role === 'student' && {
          studentCode: formData.studentCode,
          academicProgram: formData.academicProgram,
          semester: formData.semester ? parseInt(formData.semester) : undefined
        })
      };

      // Update the profile
      const updatedProfile = await updateProfile(updateData, session.accessToken);

      // Update the session to reflect changes
      await update({
        ...session,
        user: {
          ...session.user,
          name: updatedProfile.name
          // Add any other fields you want to update in the session
        }
      });

      // Show success message
      toast.success('Éxito', {
        description: 'Tu perfil ha sido actualizado correctamente'
      });

      // Optionally refetch the profile to ensure consistency
      const freshProfile = await getProfile(session.accessToken);
      form.reset({
        name: freshProfile.name || '',
        bio: freshProfile.bio || '',
        studentCode: freshProfile.studentCode || '',
        academicProgram: freshProfile.academicProgram || '',
        semester: freshProfile.semester?.toString() || ''
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error', {
        description: 'No se pudo actualizar el perfil. Por favor intenta nuevamente.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Semester options for the select
  const semesterOptions = Array.from({ length: 12 }, (_, i) => i + 1);

  if (isLoading && !session) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre completo</FormLabel>
              <FormControl>
                <Input placeholder="Juan Daniel Peñaloza" {...field} disabled={isLoading} />
              </FormControl>
              <FormDescription>Ingresa tu nombre completo</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={() => (
            <FormItem>
              <FormLabel>Contrase&ntilde;a</FormLabel>
              <FormControl>
                <Button type="button" onClick={() => push('/settings/password')} className="w-fit" disabled={isLoading}>
                  Cambiar contrase&ntilde;a
                </Button>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input placeholder="Tu email" value={session?.user?.email || ''} disabled readOnly />
          </FormControl>
          <FormDescription>Tu email universitario</FormDescription>
        </FormItem>
        <FormItem>
          <FormLabel>Rol</FormLabel>
          <FormControl>
            <Input placeholder="Tu rol" value={getFormatedRole(session?.user?.role)} disabled readOnly />
          </FormControl>
          <FormDescription>Tu rol en el sistema</FormDescription>
        </FormItem>
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Biografía</FormLabel>
              <FormControl>
                <Textarea placeholder="Cuéntanos un poco sobre ti..." className="resize-none" {...field} value={field.value || ''} disabled={isLoading} />
              </FormControl>
              <FormDescription>Información adicional sobre ti (opcional)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {session?.user?.role === 'student' && (
          <>
            <FormField
              control={form.control}
              name="studentCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código estudiantil</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: 123456" {...field} value={field.value || ''} disabled={isLoading} />
                  </FormControl>
                  <FormDescription>Tu código o identificación estudiantil (opcional)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="academicProgram"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Programa académico</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant="outline" role="combobox" className={cn('w-full justify-between', !field.value && 'text-muted-foreground')}>
                          {field.value ? Object.entries(AcademicProgram).find(([ , value ]) => value === field.value)?.[1] : 'Selecciona tu programa académico'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Buscar programa..." />
                        <CommandEmpty>No se encontraron programas.</CommandEmpty>
                        <CommandGroup className="max-h-60 overflow-y-auto">
                          {Object.entries(AcademicProgram).map(([ key, value ]) => (
                            <CommandItem
                              value={value}
                              key={key}
                              onSelect={() => {
                                form.setValue('academicProgram', value);
                              }}
                            >
                              <Check className={cn('mr-2 h-4 w-4', value === field.value ? 'opacity-100' : 'opacity-0')} />
                              {value}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>El programa académico que cursas (opcional)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="semester"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Semestre</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ''} disabled={isLoading}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu semestre" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="null">No especificado</SelectItem>
                      {semesterOptions.map((semester) => (
                        <SelectItem key={semester} value={semester.toString()}>
                          Semestre {semester}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>El semestre que estás cursando (opcional)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            'Guardar cambios'
          )}
        </Button>
      </form>
    </Form>
  );
}
