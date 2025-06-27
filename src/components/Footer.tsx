
import { Link } from 'react-router-dom';
import { Mail, Calendar } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Igreja Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-bethel-blue to-bethel-navy rounded-full flex items-center justify-center">
                <span className="text-white font-bold">B</span>
              </div>
              <h3 className="font-playfair font-bold text-lg">Igreja Batista Bethel</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Uma comunidade acolhedora onde você pode crescer na fé, participar de ministérios 
              e fazer parte da família de Deus.
            </p>
          </div>

          {/* Links Rápidos */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Links Rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/sobre" className="text-gray-400 hover:text-white transition-colors">Sobre Nós</Link></li>
              <li><Link to="/ministerios" className="text-gray-400 hover:text-white transition-colors">Ministérios</Link></li>
              <li><Link to="/eventos" className="text-gray-400 hover:text-white transition-colors">Eventos</Link></li>
              <li><Link to="/sermoes" className="text-gray-400 hover:text-white transition-colors">Sermões</Link></li>
            </ul>
          </div>

          {/* Horários */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Horários de Culto</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Domingo: 9h e 19h</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Quarta: 19h30</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Sexta: 19h30 (Jovens)</span>
              </div>
            </div>
          </div>

          {/* Contato */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Contato</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>contato@igrejabethel.com.br</span>
              </div>
              <p>Rua da Fé, 123<br />Centro - São Paulo/SP<br />CEP: 01234-567</p>
              <p>(11) 1234-5678</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>&copy; 2024 Igreja Batista Bethel. Todos os direitos reservados.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link to="/privacidade" className="hover:text-white transition-colors">
                Política de Privacidade
              </Link>
              <Link to="/termos" className="hover:text-white transition-colors">
                Termos de Uso
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
