import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Heart, CreditCard, DollarSign, Calendar, Gift, Church } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const Donations = () => {
  const [amount, setAmount] = useState('');
  const [donationType, setDonationType] = useState('tithe');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState('monthly');
  const [campaignName, setCampaignName] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchActiveCampaigns();
  }, []);

  const fetchActiveCampaigns = async () => {
    try {
      // Buscar campanhas ativas (você pode criar uma tabela de campanhas)
      setCampaigns([
        { id: '1', name: 'Construção do Novo Templo', target: 500000, raised: 150000 },
        { id: '2', name: 'Missão África', target: 100000, raised: 25000 },
        { id: '3', name: 'Reforma do Salão Infantil', target: 50000, raised: 30000 }
      ]);
    } catch (error) {
      console.error('Erro ao buscar campanhas:', error);
    }
  };

  const handleStripePayment = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Erro",
        description: "Por favor, insira um valor válido",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // Criar sessão do Stripe
      const response = await fetch('/api/create-donation-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount) * 100, // Stripe usa centavos
          donationType,
          isRecurring,
          recurringFrequency: isRecurring ? recurringFrequency : null,
          campaignName: donationType === 'campaign' ? campaignName : null,
          notes,
          userId: user?.id
        }),
      });

      const session = await response.json();
      
      if (session.url) {
        // Abrir Stripe Checkout em nova aba
        window.open(session.url, '_blank');
      }
      
    } catch (error) {
      console.error('Erro ao processar doação:', error);
      toast({
        title: "Erro",
        description: "Erro ao processar doação",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getProgress = (raised: number, target: number) => {
    return Math.min((raised / target) * 100, 100);
  };

  const donationTypeOptions = [
    { value: 'tithe', label: 'Dízimo', description: 'Contribuição regular de 10%' },
    { value: 'offering', label: 'Oferta', description: 'Doação voluntária' },
    { value: 'campaign', label: 'Campanha', description: 'Doação para campanha específica' },
    { value: 'mission', label: 'Missões', description: 'Apoio a trabalhos missionários' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-bethel-blue to-bethel-navy text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <Heart className="w-16 h-16 mx-auto mb-6 text-bethel-gold" />
          <h1 className="font-playfair text-4xl md:text-6xl font-bold mb-6">
            Contribuições & Doações
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            "Cada um dê conforme propôs no seu coração; não com tristeza, ou por necessidade; porque Deus ama ao que dá com alegria." - 2 Coríntios 9:7
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulário de Doação */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Fazer uma Doação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Tipo de Doação */}
                <div className="space-y-2">
                  <Label>Tipo de Contribuição</Label>
                  <Select value={donationType} onValueChange={setDonationType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {donationTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div>
                            <div className="font-medium">{option.label}</div>
                            <div className="text-sm text-gray-500">{option.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Campanha específica */}
                {donationType === 'campaign' && (
                  <div className="space-y-2">
                    <Label>Escolha a Campanha</Label>
                    <Select value={campaignName} onValueChange={setCampaignName}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma campanha" />
                      </SelectTrigger>
                      <SelectContent>
                        {campaigns.map((campaign) => (
                          <SelectItem key={campaign.id} value={campaign.name}>
                            {campaign.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Valor */}
                <div className="space-y-2">
                  <Label>Valor da Doação</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="number"
                      placeholder="0,00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-10"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  
                  {/* Valores sugeridos */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {[50, 100, 200, 500].map((value) => (
                      <Button
                        key={value}
                        variant="outline"
                        size="sm"
                        onClick={() => setAmount(value.toString())}
                        className="text-xs"
                      >
                        {formatCurrency(value)}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Doação Recorrente */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="recurring"
                      checked={isRecurring}
                      onCheckedChange={(checked) => setIsRecurring(checked === true)}
                    />
                    <Label htmlFor="recurring">
                      Fazer esta doação recorrente
                    </Label>
                  </div>

                  {isRecurring && (
                    <div className="space-y-2">
                      <Label>Frequência</Label>
                      <Select value={recurringFrequency} onValueChange={setRecurringFrequency}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Semanal</SelectItem>
                          <SelectItem value="monthly">Mensal</SelectItem>
                          <SelectItem value="quarterly">Trimestral</SelectItem>
                          <SelectItem value="yearly">Anual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                {/* Observações */}
                <div className="space-y-2">
                  <Label>Observações (opcional)</Label>
                  <Textarea
                    placeholder="Alguma observação sobre sua doação..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Botão de Doação */}
                <Button
                  onClick={handleStripePayment}
                  disabled={loading || !amount}
                  className="w-full bg-bethel-blue hover:bg-bethel-navy text-lg py-6"
                >
                  {loading ? (
                    'Processando...'
                  ) : (
                    <>
                      <Heart className="w-5 h-5 mr-2" />
                      Doar {amount && formatCurrency(parseFloat(amount))}
                    </>
                  )}
                </Button>

                <p className="text-sm text-gray-600 text-center">
                  Pagamento seguro processado pelo Stripe. Você será redirecionado para completar o pagamento.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Campanhas Ativas */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-5 h-5" />
                  Campanhas Ativas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">{campaign.name}</h3>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Arrecadado:</span>
                        <span className="font-medium">{formatCurrency(campaign.raised)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Meta:</span>
                        <span>{formatCurrency(campaign.target)}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-bethel-blue h-2 rounded-full transition-all duration-300"
                          style={{ width: `${getProgress(campaign.raised, campaign.target)}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {getProgress(campaign.raised, campaign.target).toFixed(1)}% da meta
                      </p>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-3"
                      onClick={() => {
                        setDonationType('campaign');
                        setCampaignName(campaign.name);
                      }}
                    >
                      Apoiar esta Campanha
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Informações */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Church className="w-5 h-5" />
                  Sobre as Contribuições
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-1">Dízimo</h4>
                  <p className="text-gray-600">
                    O dízimo é uma contribuição regular de 10% da renda, demonstrando nossa fidelidade e confiança em Deus.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-1">Ofertas</h4>
                  <p className="text-gray-600">
                    As ofertas são doações voluntárias além do dízimo, expressando nossa gratidão e amor por Deus.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-1">Segurança</h4>
                  <p className="text-gray-600">
                    Todas as transações são processadas de forma segura através do Stripe, garantindo a proteção dos seus dados.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Donations;