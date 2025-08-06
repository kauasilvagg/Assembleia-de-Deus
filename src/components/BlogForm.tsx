import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useEmailNotifications } from '@/hooks/useEmailNotifications';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const blogFormSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  content: z.string().min(1, 'Conteúdo é obrigatório'),
  excerpt: z.string().optional(),
  category: z.string(),
  tags: z.string().optional(),
  featured_image_url: z.string().url().optional().or(z.literal('')),
  is_published: z.boolean(),
  is_featured: z.boolean(),
});

type BlogFormData = z.infer<typeof blogFormSchema>;

interface BlogFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const BlogForm = ({ isOpen, onClose, onSuccess }: BlogFormProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { sendNotification } = useEmailNotifications();
  const { user } = useAuth();

  const form = useForm<BlogFormData>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: '',
      content: '',
      excerpt: '',
      category: 'geral',
      tags: '',
      featured_image_url: '',
      is_published: false,
      is_featured: false,
    },
  });

  const onSubmit = async (data: BlogFormData) => {
    if (!user) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para criar artigos.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const tagsArray = data.tags ? data.tags.split(',').map(tag => tag.trim()) : [];
      
      const blogData = {
        title: data.title,
        content: data.content,
        excerpt: data.excerpt || null,
        category: data.category,
        featured_image_url: data.featured_image_url || null,
        is_published: data.is_published,
        is_featured: data.is_featured,
        author_id: user.id,
        author_name: user.user_metadata?.full_name || user.email || 'Autor',
        tags: tagsArray,
        published_at: data.is_published ? new Date().toISOString() : null,
      };

      const { data: insertedData, error } = await supabase
        .from('blog_posts')
        .insert(blogData)
        .select();

      if (error) throw error;

      // Send email notification for new blog post
      if (data.is_published && insertedData && insertedData[0]) {
        try {
          await sendNotification({
            type: 'blog',
            title: data.title,
            description: data.excerpt || data.content?.substring(0, 150) + '...',
            content_id: insertedData[0].id,
            author_name: blogData.author_name,
          });
        } catch (notificationError) {
          console.error('Failed to send email notification:', notificationError);
          // Don't fail the form submission if notification fails
        }
      }

      toast({
        title: "Artigo criado com sucesso!",
        description: data.is_published ? "O artigo foi publicado." : "O artigo foi salvo como rascunho.",
      });

      form.reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao criar artigo:', error);
      toast({
        title: "Erro ao criar artigo",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Artigo</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                {...form.register('title')}
                placeholder="Digite o título do artigo"
              />
              {form.formState.errors.title && (
                <p className="text-sm text-red-600 mt-1">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="category">Categoria</Label>
              <Select 
                value={form.watch('category')} 
                onValueChange={(value) => form.setValue('category', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="geral">Geral</SelectItem>
                  <SelectItem value="espiritualidade">Espiritualidade</SelectItem>
                  <SelectItem value="educacao">Educação Cristã</SelectItem>
                  <SelectItem value="comunidade">Comunidade</SelectItem>
                  <SelectItem value="testemunho">Testemunhos</SelectItem>
                  <SelectItem value="familia">Família</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
              <Input
                id="tags"
                {...form.register('tags')}
                placeholder="evangelismo, oração, família"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="featured_image_url">URL da Imagem em Destaque</Label>
              <Input
                id="featured_image_url"
                {...form.register('featured_image_url')}
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="excerpt">Resumo</Label>
              <Textarea
                id="excerpt"
                {...form.register('excerpt')}
                rows={3}
                placeholder="Breve descrição do artigo..."
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="content">Conteúdo *</Label>
              <Textarea
                id="content"
                {...form.register('content')}
                rows={10}
                placeholder="Escreva o conteúdo completo do artigo..."
              />
              {form.formState.errors.content && (
                <p className="text-sm text-red-600 mt-1">
                  {form.formState.errors.content.message}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_featured"
                checked={form.watch('is_featured')}
                onCheckedChange={(checked) => form.setValue('is_featured', checked)}
              />
              <Label htmlFor="is_featured">Artigo em destaque</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_published"
                checked={form.watch('is_published')}
                onCheckedChange={(checked) => form.setValue('is_published', checked)}
              />
              <Label htmlFor="is_published">Publicar artigo</Label>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Artigo'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BlogForm;