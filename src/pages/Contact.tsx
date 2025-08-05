import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    message_type: 'geral'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Save to database
      const { error: dbError } = await supabase
        .from('contact_messages')
        .insert([formData]);

      if (dbError) throw dbError;

      // Send email notification
      const { data, error: emailError } = await supabase.functions.invoke('send-contact-email', {
        body: formData
      });

      if (emailError) {
        console.error('Error sending email:', emailError);
        // Don't throw error here, as the message was saved to database
        toast({
          title: "Mensagem salva com sucesso!",
          description: "Sua mensagem foi salva, mas pode haver um atraso no envio do email de confirmação."
        });
      } else {
        toast({
          title: "Mensagem enviada com sucesso!",
          description: "Enviamos uma confirmação para seu email. Entraremos em contato em breve."
        });
      }

      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        message_type: 'geral'
      });
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast({
        title: "Erro ao enviar mensagem",
        description: "Tente novamente ou entre em contato por telefone.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen font-inter">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Entre em Contato
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Estamos aqui para ajudar. Entre em contato conosco e vamos conversar!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Informações de Contato */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Informações de Contato
                </CardTitle>
                <CardDescription>
                  Entre em contato conosco através dos canais abaixo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-bethel-blue mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Endereço</h4>
                    <p className="text-gray-600">
                      Parque Vitória - São Luís/MA<br />
                      CEP: 65123-250
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-bethel-blue mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Telefone</h4>
                    <p className="text-gray-600">(98) 985122030</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-bethel-blue mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">E-mail</h4>
                    <p className="text-gray-600">magalhaeskaua13@gmail.com</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">
                  Horários de Culto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Domingo (Noite)</span>
                  <span>18h30</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Formulário de Contato */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Envie uma Mensagem
              </CardTitle>
              <CardDescription>
                Preencha o formulário abaixo e entraremos em contato em breve
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message_type">Tipo de Mensagem</Label>
                  <Select value={formData.message_type} onValueChange={(value) => handleInputChange('message_type', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="geral">Informações Gerais</SelectItem>
                      <SelectItem value="oração">Pedido de Oração</SelectItem>
                      <SelectItem value="visita">Solicitação de Visita</SelectItem>
                      <SelectItem value="ministerio">Ministérios</SelectItem>
                      <SelectItem value="evento">Eventos</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Assunto *</Label>
                  <Input
                    id="subject"
                    type="text"
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Mensagem *</Label>
                  <Textarea
                    id="message"
                    rows={5}
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-bethel-blue hover:bg-bethel-navy"
                  disabled={loading}
                >
                  {loading ? (
                    'Enviando...'
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Enviar Mensagem
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
