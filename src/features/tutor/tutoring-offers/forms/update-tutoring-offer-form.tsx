// src/features/tutor/tutoring-offers/forms/update-tutoring-offer-form.tsx
'use client';

import { getSubjects, SubjectsResponse } from '@/lib/api/subjects/get-subjects';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { tutoringOfferFormSchema, TutoringOfferFormValues } from '../data/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
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
import { getTutoringOffer } from '@/lib/api/tutor/tutoring-offers/get-tutoring-offer';
import { updateTutoringOffer } from '@/lib/api/tutor/tutoring-offers/update-tutoring-offer';

interface UpdateTutoringOfferFormProps {
  offerId: number;
}

export default function UpdateTutoringOfferForm({ offerId }: UpdateTutoringOfferFormProps) {
  const [ isLoading, setIsLoading ] = useState(true);
  const [ subjects, setSubjects ] = useState<SubjectsResponse[]>([]);
  const [ initialData, setInitialData ] = useState<TutoringOfferFormValues | null>(null);
  const { data: session } = useSession();
  const router = useRouter();

  const form = useForm<TutoringOfferFormValues>({
    resolver: zodResolver(tutoringOfferFormSchema),
    mode: 'onChange'
  });

  const modality = form.watch('modality');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        if (!session?.accessToken) {
          throw new Error('No authentication token found');
        }

        // Fetch subjects and offer data in parallel
        const [ subjectsData, offerData ] = await Promise.all([
          getSubjects(session.accessToken),
          getTutoringOffer(session.accessToken, offerId)
        ]);

        setSubjects(subjectsData);

        // Set initial form values
        const initialValues: TutoringOfferFormValues = {
          subjectId: offerData.subjectId,
          modality: offerData.modality,
          topicsDescription: offerData.topicsDescription || '',
          sessionType: offerData.sessionType,
          location: offerData.location || '',
          meetingLink: offerData.meetingLink || '',
          hourlyRate: offerData.hourlyRate.toString()
        };

        setInitialData(initialValues);
        form.reset(initialValues);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Error', {
          description: 'No se pudieron cargar los datos necesarios'
        });
        router.push('/tutor/tutoring-offers');
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.accessToken) {
      fetchData();
    }
  }, [ session?.accessToken, offerId, form, router ]);

  const onSubmit = async (formData: TutoringOfferFormValues) => {
    try {
      setIsLoading(true);

      if (!session?.accessToken) {
        throw new Error('No authentication token found');
      }

      await updateTutoringOffer(
        offerId,
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

      toast.success('Oferta actualizada', {
        description: 'Tu oferta de tutoría ha sido actualizada exitosamente'
      });

      router.push('/tutor/tutoring-offers');
    } catch (error) {
      console.error('Error updating tutoring offer:', error);

      let errorMessage = 'No se pudo actualizar la oferta. Por favor intenta nuevamente.';

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

  if (isLoading || !initialData) {
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

        <FormField
          control={form.control}
          name="hourlyRate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tarifa por hora</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Ej: 15" {...field} disabled={isLoading} />
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
                Actualizando...
              </>
            ) : (
              'Actualizar oferta'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}