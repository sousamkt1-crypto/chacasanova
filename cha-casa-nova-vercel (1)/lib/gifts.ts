import { Bath, BedDouble, CookingPot, LampFloor, Shirt, Zap, type LucideIcon } from "lucide-react";
export type GiftItem = { id: string; name: string; quantity: number; chosen?: boolean; reservedBy?: string };
export type GiftCategory = { name: string; icon: LucideIcon; items: GiftItem[] };
const g = (id: string, name: string, quantity = 1, chosen = false, reservedBy?: string): GiftItem => ({ id, name, quantity, chosen, reservedBy });
export const categories: GiftCategory[] = [
  { name: "Cozinha", icon: CookingPot, items: [
    g("jogo-panelas","Jogo de panelas",2),g("panela-pressao","Panela de pressão",2),g("cuscuzeira-gelo","Kit cuscuzeira + forma de gelo"),g("frigideiras","Kit frigideiras"),g("forma-bolo-boleira","Kit forma de bolo + boleira"),g("travessas","Travessas"),g("pratos","Jogo de pratos"),g("talheres","Jogo de talheres",2),g("sobremesas","Jogo de sobremesas"),g("xicaras","Xícaras"),g("tacas","Taças"),g("copos-jarra","Kit jogo de copos + jarra para suco",2),g("potes-tampa","Potes com tampa",2),g("escorredor-detergente","Kit escorredor de louças + porta-detergente"),g("tabua-facas","Kit tábua de corte + jogo de facas"),g("colheres-conchas","Kit colheres de silicone + conchas"),g("ralador-peneiras-abridor","Kit ralador + peneiras + abridor de latas"),g("jogo-americano","Jogo americano",2),g("temperos-mantimentos","Kit porta-temperos + potes para mantimentos"),g("triturador","Triturador elétrico"),g("mesa","Mesa",1,true,"Nenezinha") ]},
  { name: "Eletroportáteis", icon: Zap, items: [g("air-fryer","Air fryer",1,true),g("liquidificador","Liquidificador",1,true),g("sanduicheira","Sanduicheira",1,true),g("microondas","Micro-ondas",1,true),g("batedeira","Batedeira"),g("espremedor","Espremedor de laranja"),g("forno-eletrico","Forno elétrico"),g("chaleira","Chaleira elétrica"),g("cooktop","Cooktop",1,true),g("geladeira","Geladeira",1,true)]},
  { name: "Banheiro", icon: Bath, items: [g("toalhas","Jogo de toalhas",2),g("tapetes-sabonete","Kit tapetes + porta-sabonete líquido",2)]},
  { name: "Quarto", icon: BedDouble, items: [g("lencois-luva","Jogo de lençóis + luva com elástico"),g("cortina-quarto","Cortina",2)]},
  { name: "Área de serviço", icon: Shirt, items: [g("tabua-passar","Tábua de passar"),g("organizador-limpeza","Organizador para produtos de limpeza")]},
  { name: "Sala", icon: LampFloor, items: [g("cortina-sala","Cortina de parede toda",2),g("sofa","Sofá")]},
];
