
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Calendar, Clock, MapPin, X } from 'lucide-react';
import { useEmailNotifications } from '@/hooks/useEmailNotifications';

const eventFormSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  event_date: z.string().min(1, 'Data é obrigatória'),
  location: z.string().optional(),
  event_type: z.string().min(1, 'Tipo é obrigatório'),
  is_recurring: z.boolean().default(false),
  recurring_pattern: z.string().optional(),
  registration_required: z.boolean().default(false),
  max_participants: z.number().optional(),
  price: z.coerce.number().min(0, 'Preço deve ser maior ou igual a zero').optional(),
  is_paid: z.boolean().default(false),
});

type EventFormData = z.infer<typeof eventFormSchema>;

interface EventFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const EventForm = ({ onClose, onSuccess }: EventFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { sendNotification } = useEmailNotifications();

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: '',
      description: '',
      event_date: '',
      location: '',
      event_type: 'culto',
      is_recurring: false,
      recurring_pattern: '',
      registration_required: false,
      max_participants: undefined,
      price: 0,
      is_paid: false,
    },
  });

  const onSubmit = async (data: EventFormData) => {
    console.log('Submitting event data:', data);
    setIsSubmitting(true);

    try {
      // Convert date string to ISO format
      const eventDate = new Date(data.event_date).toISOString();
      
      const eventData = {
        title: data.title,
        description: data.description || null,
        event_date: eventDate,
        location: data.location || null,
        event_type: data.event_type,
        is_recurring: data.is_recurring,
        recurring_pattern: data.is_recurring ? data.recurring_pattern : null,
        registration_required: data.registration_required,
        max_participants: data.max_participants || null,
        price: data.is_paid ? (data.price || 0) : 0,
        is_paid: data.is_paid,
        is_active: true,
      };

      console.log('Sending to database:', eventData);

      const { data: insertedData, error } = await supabase
        .from('events')
        .insert([eventData])
        .select();

      if (error) {
        console.error('Error creating event:', error);
        throw error;
      }

      // Send email notification for new event
      if (insertedData && insertedData[0]) {
        try {
          await sendNotification({
            type: 'event',
            title: data.title,
            description: data.description || undefined,
            content_id: insertedData[0].id,
            event_date: data.event_date,
          });
        } catch (notificationError) {
          console.error('Failed to send email notification:', notificationError);
          // Don't fail the form submission if notification fails
        }
      }

      toast({
        title: 'Evento criado com sucesso!',
        description: 'O evento foi adicionado à programação.',
      });

      form.reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: 'Erro ao criar evento',
        description: 'Ocorreu um erro ao salvar o evento. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Novo Evento</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título do Evento</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o título do evento" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva o evento..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="event_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data e Hora</FormLabel>
                    <FormControl>
                      <Input 
                        type="datetime-local" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="event_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Evento</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="culto">Culto</SelectItem>
                        <SelectItem value="estudo">Estudo Bíblico</SelectItem>
                        <SelectItem value="encontro">Encontro</SelectItem>
                        <SelectItem value="evento-especial">Evento Especial</SelectItem>
                        <SelectItem value="conferencia">Conferência</SelectItem>
                        <SelectItem value="retiro">Retiro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Local</FormLabel>
                  <FormControl>
                    <Input placeholder="Local do evento" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center space-x-2">
              <FormField
                control={form.control}
                name="is_recurring"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Evento recorrente</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {form.watch('is_recurring') && (
              <FormField
                control={form.control}
                name="recurring_pattern"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Padrão de Recorrência</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Toda semana, Todo mês..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex items-center space-x-2">
              <FormField
                control={form.control}
                name="registration_required"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Requer inscrição</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {form.watch('registration_required') && (
              <FormField
                control={form.control}
                name="max_participants"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número máximo de participantes</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Ex: 100"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex items-center space-x-2">
              <FormField
                control={form.control}
                name="is_paid"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Evento pago</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {form.watch('is_paid') && (
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço (R$)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        min="0"
                        placeholder="Ex: 15.00"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Salvando...' : 'Criar Evento'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default EventForm;
