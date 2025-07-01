
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface Ministry {
  id: string;
  name: string;
  description: string;
  leader_name: string;
  leader_email: string;
  leader_phone: string;
  meeting_day: string;
  meeting_time: string;
  location: string;
  image_url: string;
}

interface MinistryFormProps {
  ministry?: Ministry | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const MinistryForm = ({ ministry, onSuccess, onCancel }: MinistryFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: ministry?.name || '',
    description: ministry?.description || '',
    leader_name: ministry?.leader_name || '',
    leader_email: ministry?.leader_email || '',
    leader_phone: ministry?.leader_phone || '',
    meeting_day: ministry?.meeting_day || '',
    meeting_time: ministry?.meeting_time || '',
    location: ministry?.location || '',
    image_url: ministry?.image_url || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (ministry) {
        // Atualizar ministério existente
        const { error } = await supabase
          .from('ministries')
          .update(formData)
          .eq('id', ministry.id);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Ministério atualizado com sucesso."
        });
      } else {
        // Criar novo ministério
        const { error } = await supabase
          .from('ministries')
          .insert([{ ...formData, is_active: true }]);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Ministério criado com sucesso."
        });
      }

      onSuccess();
    } catch (error) {
      console.error('Erro ao salvar ministério:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o ministério.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Card className="max-w-2xl mx-auto mb-8">
      <CardHeader>
        <CardTitle>
          {ministry ? 'Editar Ministério' : 'Novo Ministério'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome do Ministério *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="leader_name">Nome do Líder</Label>
              <Input
                id="leader_name"
                name="leader_name"
                value={formData.leader_name}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="leader_email">Email do Líder</Label>
              <Input
                id="leader_email"
                name="leader_email"
                type="email"
                value={formData.leader_email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="leader_phone">Telefone do Líder</Label>
              <Input
                id="leader_phone"
                name="leader_phone"
                value={formData.leader_phone}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="location">Local de Reunião</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="meeting_day">Dia da Reunião</Label>
              <Input
                id="meeting_day"
                name="meeting_day"
                placeholder="Ex: Quarta-feira"
                value={formData.meeting_day}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="meeting_time">Horário da Reunião</Label>
              <Input
                id="meeting_time"
                name="meeting_time"
                placeholder="Ex: 19:30"
                value={formData.meeting_time}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="image_url">URL da Imagem</Label>
            <Input
              id="image_url"
              name="image_url"
              type="url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="https://exemplo.com/imagem.jpg"
            />
          </div>

          <div className="flex space-x-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : (ministry ? 'Atualizar' : 'Criar')}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default MinistryForm;
