import { Car, Phone, Mail, MapPin, Facebook, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Car className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-heading text-xl font-bold">KL Rent a Car</span>
            </div>
            <p className="text-background/70 mb-6">
              Sua locadora de confiança. Aluguel de carros rápido, simples e seguro.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="font-heading text-lg font-semibold mb-6">Links Rápidos</h3>
            <ul className="space-y-3">
              <li><a href="#sobre" className="text-background/70 hover:text-primary transition-colors">Sobre nós</a></li>
              <li><a href="#frota" className="text-background/70 hover:text-primary transition-colors">Nossa frota</a></li>
              <li><a href="#como-funciona" className="text-background/70 hover:text-primary transition-colors">Como funciona</a></li>
              <li><a href="#beneficios" className="text-background/70 hover:text-primary transition-colors">Benefícios</a></li>
            </ul>
          </div>

          {/* Categorias */}
          <div>
            <h3 className="font-heading text-lg font-semibold mb-6">Categorias</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-background/70 hover:text-primary transition-colors">Econômicos</a></li>
              <li><a href="#" className="text-background/70 hover:text-primary transition-colors">Compactos</a></li>
              <li><a href="#" className="text-background/70 hover:text-primary transition-colors">Sedans</a></li>
              <li><a href="#" className="text-background/70 hover:text-primary transition-colors">SUVs</a></li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="font-heading text-lg font-semibold mb-6">Contato</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-background/70">
                <Phone className="w-5 h-5 text-primary" />
                <span>(11) 99999-9999</span>
              </li>
              <li className="flex items-center gap-3 text-background/70">
                <Mail className="w-5 h-5 text-primary" />
                <span>contato@klrentacar.com.br</span>
              </li>
              <li className="flex items-start gap-3 text-background/70">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                <span>Av. Principal, 1000<br />São Paulo - SP</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-8 text-center">
          <p className="text-background/50 text-sm">
            © {new Date().getFullYear()} KL Rent a Car. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
