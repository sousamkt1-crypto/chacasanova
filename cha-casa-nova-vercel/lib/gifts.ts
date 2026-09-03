import { Bath, BedDouble, CookingPot, LampFloor, Shirt, Zap, type LucideIcon } from "lucide-react";
export type GiftItem = { id: string; name: string; chosen?: boolean; reservedBy?: string };
export type GiftCategory = { name: string; icon: LucideIcon; items: GiftItem[] };
const g = (id: string, name: string, chosen = false, reservedBy?: string): GiftItem => ({ id, name, chosen, reservedBy });
export const categories: GiftCategory[] = [
  { name: "Cozinha", icon: CookingPot, items: [
    g("jogo-panelas","Jogo de panelas"),g("panela-pressao","Panela de pressão"),g("cuscuzeira-gelo","Kit cuscuzeira + forma de gelo"),g("frigideiras","Kit frigideiras"),g("forma-bolo-boleira","Kit forma de bolo + boleira"),g("travessas","Travessas"),g("pratos","Jogo de pratos"),g("talheres","Jogo de talheres"),g("sobremesas","Jogo de sobremesas"),g("xicaras","Xícaras"),g("tacas","Taças"),g("copos-jarra","Kit jogo de copos + jarra para suco"),g("potes-tampa","Potes com tampa"),g("escorredor-detergente","Kit escorredor de louças + porta-detergente"),g("tabua-facas","Kit tábua de corte + jogo de facas"),g("colheres-conchas","Kit colheres de silicone + conchas"),g("ralador-peneiras-abridor","Kit ralador + peneiras + abridor de latas"),g("jogo-americano","Jogo americano"),g("temperos-mantimentos","Kit porta-temperos + potes para mantimentos"),g("triturador","Triturador elétrico"),g("mesa","Mesa",true,"Nenezinha") ]},
  { name: "Eletroportáteis", icon: Zap, items: [g("air-fryer","Air fryer",true),g("liquidificador","Liquidificador",true),g("sanduicheira","Sanduicheira",true),g("microondas","Micro-ondas",true),g("batedeira","Batedeira"),g("espremedor","Espremedor de laranja"),g("forno-eletrico","Forno elétrico"),g("chaleira","Chaleira elétrica"),g("cooktop","Cooktop",true),g("geladeira","Geladeira",true)]},
  { name: "Banheiro", icon: Bath, items: [g("toalhas","Jogo de toalhas"),g("tapetes-sabonete","Kit tapetes + porta-sabonete líquido")]},
  { name: "Quarto", icon: BedDouble, items: [g("lencois-luva","Jogo de lençóis + luva com elástico"),g("cortina-quarto","Cortina")]},
  { name: "Área de serviço", icon: Shirt, items: [g("tabua-passar","Tábua de passar"),g("organizador-limpeza","Organizador para produtos de limpeza")]},
  { name: "Sala", icon: LampFloor, items: [g("cortina-sala","Cortina de parede toda"),g("sofa","Sofá")]},
];
