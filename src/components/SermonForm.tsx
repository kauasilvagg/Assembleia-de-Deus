
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useEmailNotifications } from '@/hooks/useEmailNotifications';

interface Sermon {
  id: string;
  title: string;
  description: string;
  preacher_name: string;
  sermon_date: string;
  biblical_text: string;
  series_name: string;
  audio_url: string;
  video_url: string;
  duration_minutes: number;
  tags: string[];
  is_featured: boolean;
}

interface SermonFormProps {
  sermon?: Sermon | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const SermonForm = ({ sermon, onSuccess, onCancel }: SermonFormProps) => {
  const { toast } = useToast();
  const { sendNotification } = useEmailNotifications();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: sermon?.title || '',
    description: sermon?.description || '',
    preacher_name: sermon?.preacher_name || '',
    sermon_date: sermon?.sermon_date || '',
    biblical_text: sermon?.biblical_text || '',
    series_name: sermon?.series_name || '',
    audio_url: sermon?.audio_url || '',
    video_url: sermon?.video_url || '',
    duration_minutes: sermon?.duration_minutes || 0,
    tags: sermon?.tags?.join(', ') || '',
    is_featured: sermon?.is_featured || false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      const submitData = {
        ...formData,
        tags: tagsArray,
        duration_minutes: formData.duration_minutes || null
      };

      if (sermon) {
        const { error } = await supabase
          .from('sermons')
          .update(submitData)
          .eq('id', sermon.id);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Sermão atualizado com sucesso."
        });
      } else {
        const { data: insertedData, error } = await supabase
          .from('sermons')
          .insert([submitData])
          .select();

        if (error) throw error;

        // Send email notification for new sermon
        if (insertedData && insertedData[0]) {
          try {
            await sendNotification({
              type: 'sermon',
              title: formData.title,
              description: formData.description || undefined,
              content_id: insertedData[0].id,
              preacher_name: formData.preacher_name,
            });
          } catch (notificationError) {
            console.error('Failed to send email notification:', notificationError);
            // Don't fail the form submission if notification fails
          }
        }

        toast({
          title: "Sucesso",
          description: "Sermão criado com sucesso."
        });
      }

      onSuccess();
    } catch (error) {
      console.error('Erro ao salvar sermão:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o sermão.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  return (
    <Card className="max-w-4xl mx-auto mb-8">
      <CardHeader>
        <CardTitle>
          {sermon ? 'Editar Sermão' : 'Novo Sermão'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Título do Sermão *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="preacher_name">Nome do Pregador *</Label>
              <Input
                id="preacher_name"
                name="preacher_name"
                value={formData.preacher_name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="sermon_date">Data do Sermão *</Label>
              <Input
                id="sermon_date"
                name="sermon_date"
                type="date"
                value={formData.sermon_date}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="duration_minutes">Duração (minutos)</Label>
              <Input
                id="duration_minutes"
                name="duration_minutes"
                type="number"
                value={formData.duration_minutes}
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center space-x-2 pt-6">
              <Checkbox
                id="is_featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, is_featured: !!checked })
                }
              />
              <Label htmlFor="is_featured">Sermão em destaque</Label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="biblical_text">Texto Bíblico</Label>
              <Input
                id="biblical_text"
                name="biblical_text"
                placeholder="Ex: João 3:16"
                value={formData.biblical_text}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="series_name">Nome da Série</Label>
              <Input
                id="series_name"
                name="series_name"
                value={formData.series_name}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="audio_url">URL do Áudio</Label>
              <Input
                id="audio_url"
                name="audio_url"
                type="url"
                value={formData.audio_url}
                onChange={handleChange}
                placeholder="https://exemplo.com/audio.mp3"
              />
            </div>

            <div>
              <Label htmlFor="video_url">URL do Vídeo</Label>
              <Input
                id="video_url"
                name="video_url"
                type="url"
                value={formData.video_url}
                onChange={handleChange}
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
          </div>

          <div>
            <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
            <Input
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="evangelismo, família, oração"
            />
          </div>

          <div className="flex space-x-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : (sermon ? 'Atualizar' : 'Criar')}
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

export default SermonForm;
