'use client';

import { getSubjects, SubjectsResponse } from '@/lib/api/subjects/get-subjects';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { tutoringOfferFormSchema, TutoringOfferFormValues } from '../data/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { createTutoringOffer } from '@/lib/api/tutor/tutoring-offers/create-tutoring-offer';
import { ApiResponseError } from '@/lib/api/api';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { cn } from '@/lib/utils';

export default function CreateTutoringOfferForm() {
  const [ isLoading, setIsLoading ] = useState(true);
  const [ subjects, setSubjects ] = useState<SubjectsResponse[]>([]);
  const { data: session } = useSession();
  const router = useRouter();

  const form = useForm<TutoringOfferFormValues>({
    resolver: zodResolver(tutoringOfferFormSchema),
    defaultValues: {
      subjectId: undefined,
      modality: undefined,
      topicsDescription: '',
      sessionType: undefined,
      location: '',
      meetingLink: '',
      hourlyRate: '15'
    },
    mode: 'onChange'
  });

  const modality = form.watch('modality');

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setIsLoading(true);

        if (!session?.accessToken) {
          throw new Error('No authentication token found');
        }

        const data = await getSubjects(session.accessToken);

        setSubjects(data);
      } catch (error) {
        console.error('Error fetching subjects:', error);
        toast.error('Error', {
          description: 'No se pudieron cargar las asignaturas'
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.accessToken) {
      fetchSubjects();
    }
  }, [ session?.accessToken ]);

  const onSubmit = async (formData: TutoringOfferFormValues) => {
    try {
      setIsLoading(true);

      if (!session?.accessToken) {
        throw new Error('No authentication token found');
      }

      await createTutoringOffer(
        {
          subjectId: formData.subjectId,
          modality: formData.modality,
          topicsDescription: formData.topicsDescription,
          sessionType: formData.sessionType,
          location: formData.location,
          meetingLink: formData.meetingLink,
          hourlyRate: parseInt(formData.hourlyRate)
        },
        session.accessToken
      );

      toast.success('Oferta creada', {
        description: 'Tu oferta de tutoría ha sido creada exitosamente'
      });

      router.push('/tutor/tutoring-offers');
    } catch (error) {
      console.error('Error creating tutoring offer:', error);

      let errorMessage = 'No se pudo crear la oferta. Por favor intenta nuevamente.';

      if (error instanceof ApiResponseError) {
        errorMessage = error.message || errorMessage;
      }

      toast.error('Error', {
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !subjects.length) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="subjectId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Asignatura</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button variant="outline" role="combobox" className={cn('w-full justify-between', !field.value && 'text-muted-foreground')}>
                      {field.value ? subjects.find((subject) => subject.id === field.value)?.name : 'Selecciona una asignatura'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                  <Command>
                    <CommandInput placeholder="Buscar asignatura..." />
                    <CommandEmpty>No se encontraron asignaturas.</CommandEmpty>
                    <CommandGroup className="max-h-60 overflow-y-auto">
                      {subjects.map((subject) => (
                        <CommandItem
                          value={subject.id.toString()}
                          key={subject.id}
                          onSelect={() => {
                            form.setValue('subjectId', subject.id);
                          }}
                        >
                          <Check className={cn('mr-2 h-4 w-4', subject.id === field.value ? 'opacity-100' : 'opacity-0')} />
                          {subject.name} ({subject.code})
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="modality"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Modalidad</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl className="w-full">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona la modalidad" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="presential">Presencial</SelectItem>
                  <SelectItem value="virtual">Virtual</SelectItem>
                  <SelectItem value="mixed">Mixta</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {modality === 'presential' || modality === 'mixed' ? (
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ubicación</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Biblioteca Central, Sala 203" {...field} value={field.value || ''} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : null}

        {modality === 'virtual' || modality === 'mixed' ? (
          <FormField
            control={form.control}
            name="meetingLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enlace de reunión</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: https://meet.google.com/abc-xyz-123" {...field} value={field.value || ''} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : null}

        <FormField
          control={form.control}
          name="sessionType"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Tipo de sesión</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl className="w-full">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo de sesión" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="group">Grupal</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="topicsDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Temas que puedes enseñar</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe los temas específicos en los que puedes brindar tutoría..." className="resize-none" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex w-full justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creando...
              </>
            ) : (
              'Crear oferta'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
