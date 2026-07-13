import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Plus, X, RotateCcw, Utensils, Coffee, Apple, Moon, Sparkles, Trash2, Info, ChefHat, TrendingDown, Dumbbell, Sofa, GlassWater, Pencil, Check, Star, PencilLine, Home, LineChart, Droplets, ArrowRight, Flame, ChevronDown, Sun, ChevronLeft, ChevronRight, Smile, CalendarDays, Wallet, Camera, Send, MessageCircle, Download, Upload } from "lucide-react";

// ---- Paleta ----
const LIGHT = {
  bg1: "#F3F6F0", bg2: "#E7EEE6", surface: "#FFFFFF",
  ink: "#1B2823", muted: "#61706A", faint: "#93A099",
  line: "#E2E8DF", green: "#2F6B4F", greenDeep: "#1F4E39", greenSoft: "#E7F1E8", greenTint: "#F1F7F1",
  honey: "#D9982B", honeySoft: "#FAEED4", over: "#C25E39", overSoft: "#FBE8E1",
  water: "#3B90B2", waterSoft: "#E2F0F5",
};
const DARK = {
  bg1: "#101713", bg2: "#0C120F", surface: "#19231E",
  ink: "#E9EFEA", muted: "#9FB2A8", faint: "#6C7D74",
  line: "#2A362F", green: "#57A87E", greenDeep: "#3C8460", greenSoft: "#213029", greenTint: "#1C2620",
  honey: "#E2AC4E", honeySoft: "#2C2416", over: "#DA7951", overSoft: "#33221B",
  water: "#5AB0CD", waterSoft: "#182A32",
};
const C = { ...LIGHT };
const applyTheme = (dark) => Object.assign(C, dark ? DARK : LIGHT);
const PLATE = { proteina: "#C8734F", carbo: "#E4B65C", vegetais: "#5FA35F", feijao: "#8A5A3B" };
const GRAD = `linear-gradient(135deg, ${C.greenDeep}, ${C.green})`;
const FONT_LINK = `@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600;12..96,700;12..96,800&family=Inter:wght@400;450;500;600&display=swap');`;
const BUILD = "v10 · 11 jul (avulso com quantidades)";

const MEALS = [
  { id: "Café da manhã", short: "Café", icon: Coffee },
  { id: "Almoço", short: "Almoço", icon: Utensils },
  { id: "Lanche", short: "Lanche", icon: Apple },
  { id: "Jantar", short: "Jantar", icon: Moon },
];
const CATEGORY_ORDER = ["Proteínas", "Carboidratos", "Vegetais", "Frutas", "Outros"];
const ALL_MEALS = ["Café da manhã", "Almoço", "Lanche", "Jantar"];
const DAY_TYPES = [
  { id: "parado", label: "Parado", icon: Sofa, factor: 1.35 },
  { id: "academia", label: "Academia", icon: Dumbbell, factor: 1.40 },
  { id: "futebol", label: "Futebol", icon: Utensils, factor: 1.50 },
];
const dayTypeById = (id) => DAY_TYPES.find((d) => d.id === id) || DAY_TYPES[0];
const AGE = 28, HEIGHT_CM = 170, DEFICIT = 500;
const bmr = (w) => 10 * w + 6.25 * HEIGHT_CM - 5 * AGE + 5; // Mifflin-St Jeor (homem)
const targetFor = (dayTypeId, w, deficit = DEFICIT) => Math.max(1500, Math.round((bmr(w) * dayTypeById(dayTypeId).factor - deficit) / 10) * 10);
const START_WEIGHT = 105, GOAL_OBESITY = 87, GOAL_NORMAL = 72;

const FOODS = [
  // Proteínas · Bovino
  { n: "Carne bovina magra", c: "Proteínas", s: "Bovino", m: ["Almoço", "Jantar"] },
  { n: "Carne moída", c: "Proteínas", s: "Bovino", m: ["Almoço", "Jantar"] },
  { n: "Costela bovina", c: "Proteínas", s: "Bovino", m: ["Almoço", "Jantar"] },
  { n: "Picanha", c: "Proteínas", s: "Bovino", m: ["Almoço", "Jantar"] },
  { n: "Alcatra", c: "Proteínas", s: "Bovino", m: ["Almoço", "Jantar"] },
  { n: "Contrafilé", c: "Proteínas", s: "Bovino", m: ["Almoço", "Jantar"] },
  { n: "Fraldinha", c: "Proteínas", s: "Bovino", m: ["Almoço", "Jantar"] },
  { n: "Maminha", c: "Proteínas", s: "Bovino", m: ["Almoço", "Jantar"] },
  { n: "Cupim", c: "Proteínas", s: "Bovino", m: ["Almoço", "Jantar"] },
  { n: "Acém", c: "Proteínas", s: "Bovino", m: ["Almoço", "Jantar"] },
  { n: "Músculo", c: "Proteínas", s: "Bovino", m: ["Almoço", "Jantar"] },
  { n: "Charque / carne de sol", c: "Proteínas", s: "Bovino", m: ["Café da manhã", "Almoço", "Jantar"] },
  { n: "Fígado / miúdos", c: "Proteínas", s: "Bovino", m: ["Almoço", "Jantar"] },
  // Proteínas · Suíno
  { n: "Carne suína (lombo/bisteca)", c: "Proteínas", s: "Suíno", m: ["Almoço", "Jantar"] },
  { n: "Costela suína", c: "Proteínas", s: "Suíno", m: ["Almoço", "Jantar"] },
  { n: "Pernil", c: "Proteínas", s: "Suíno", m: ["Almoço", "Jantar"] },
  { n: "Bacon", c: "Proteínas", s: "Suíno", m: ["Café da manhã", "Almoço", "Jantar"] },
  { n: "Panceta", c: "Proteínas", s: "Suíno", m: ["Almoço", "Jantar"] },
  // Proteínas · Frango
  { n: "Frango", c: "Proteínas", s: "Frango", m: ["Almoço", "Jantar"] },
  { n: "Coxa/sobrecoxa", c: "Proteínas", s: "Frango", m: ["Almoço", "Jantar"] },
  { n: "Asa de frango", c: "Proteínas", s: "Frango", m: ["Almoço", "Jantar"] },
  { n: "Frango desfiado", c: "Proteínas", s: "Frango", m: ["Almoço", "Lanche", "Jantar"] },
  // Proteínas · Peixe & frutos do mar
  { n: "Peixe / tilápia", c: "Proteínas", s: "Peixe & frutos do mar", m: ["Almoço", "Jantar"] },
  { n: "Sardinha", c: "Proteínas", s: "Peixe & frutos do mar", m: ["Almoço", "Jantar"] },
  { n: "Atum enlatado", c: "Proteínas", s: "Peixe & frutos do mar", m: ["Almoço", "Lanche", "Jantar"] },
  { n: "Camarão", c: "Proteínas", s: "Peixe & frutos do mar", m: ["Almoço", "Jantar"] },
  { n: "Bacalhau", c: "Proteínas", s: "Peixe & frutos do mar", m: ["Almoço", "Jantar"] },
  // Proteínas · Embutidos
  { n: "Linguiça", c: "Proteínas", s: "Embutidos", m: ["Café da manhã", "Almoço", "Jantar"] },
  { n: "Calabresa", c: "Proteínas", s: "Embutidos", m: ["Café da manhã", "Almoço", "Jantar"] },
  { n: "Salsicha", c: "Proteínas", s: "Embutidos", m: ["Almoço", "Lanche", "Jantar"] },
  { n: "Presunto", c: "Proteínas", s: "Embutidos", m: ["Café da manhã", "Lanche", "Jantar"] },
  { n: "Peito de peru", c: "Proteínas", s: "Embutidos", m: ["Café da manhã", "Lanche", "Jantar"] },
  { n: "Mortadela", c: "Proteínas", s: "Embutidos", m: ["Café da manhã", "Lanche"] },
  // Proteínas · Ovos
  { n: "Ovos", c: "Proteínas", s: "Ovos", m: ["Café da manhã", "Almoço", "Lanche", "Jantar"] },
  { n: "Ovo de codorna", c: "Proteínas", s: "Ovos", m: ["Café da manhã", "Almoço", "Lanche", "Jantar"] },
  // Proteínas · Queijos & laticínios
  { n: "Queijo coalho", c: "Proteínas", s: "Queijos & laticínios", m: ["Café da manhã", "Almoço", "Lanche", "Jantar"] },
  { n: "Queijo mussarela", c: "Proteínas", s: "Queijos & laticínios", m: ["Café da manhã", "Almoço", "Lanche", "Jantar"] },
  { n: "Queijo do reino", c: "Proteínas", s: "Queijos & laticínios", m: ["Café da manhã", "Lanche", "Jantar"] },
  { n: "Queijo gorgonzola", c: "Proteínas", s: "Queijos & laticínios", m: ["Almoço", "Lanche", "Jantar"] },
  { n: "Ricota / cottage", c: "Proteínas", s: "Queijos & laticínios", m: ["Café da manhã", "Lanche", "Jantar"] },
  { n: "Iogurte", c: "Proteínas", s: "Queijos & laticínios", m: ["Café da manhã", "Lanche"] },
  { n: "Coalhada", c: "Proteínas", s: "Queijos & laticínios", m: ["Café da manhã", "Lanche"] },
  // Carboidratos · Grãos & massas
  { n: "Arroz", c: "Carboidratos", s: "Grãos & massas", m: ["Almoço", "Jantar"] },
  { n: "Macarrão", c: "Carboidratos", s: "Grãos & massas", m: ["Almoço", "Jantar"] },
  // Carboidratos · Leguminosas
  { n: "Feijão", c: "Carboidratos", s: "Leguminosas", m: ["Almoço", "Jantar"] },
  { n: "Fava", c: "Carboidratos", s: "Leguminosas", m: ["Almoço", "Jantar"] },
  { n: "Feijão tropeiro", c: "Carboidratos", s: "Leguminosas", m: ["Almoço", "Jantar"] },
  { n: "Grão-de-bico", c: "Carboidratos", s: "Leguminosas", m: ["Almoço", "Lanche", "Jantar"] },
  { n: "Lentilha", c: "Carboidratos", s: "Leguminosas", m: ["Almoço", "Jantar"] },
  // Carboidratos · Raízes & tubérculos
  { n: "Batata inglesa", c: "Carboidratos", s: "Raízes & tubérculos", m: ["Almoço", "Jantar"] },
  { n: "Macaxeira", c: "Carboidratos", s: "Raízes & tubérculos", m: ["Café da manhã", "Almoço", "Jantar"] },
  { n: "Inhame", c: "Carboidratos", s: "Raízes & tubérculos", m: ["Café da manhã", "Almoço", "Jantar"] },
  { n: "Batata-doce", c: "Carboidratos", s: "Raízes & tubérculos", m: ["Café da manhã", "Almoço", "Lanche", "Jantar"] },
  // Carboidratos · Milho & cuscuz
  { n: "Cuscuz", c: "Carboidratos", s: "Milho & cuscuz", m: ["Café da manhã", "Almoço", "Jantar"] },
  { n: "Cuscuz de arroz", c: "Carboidratos", s: "Milho & cuscuz", m: ["Café da manhã", "Almoço", "Jantar"] },
  // Carboidratos · Pães & farinhas
  { n: "Pão", c: "Carboidratos", s: "Pães & farinhas", m: ["Café da manhã", "Lanche"] },
  { n: "Pão de queijo", c: "Carboidratos", s: "Pães & farinhas", m: ["Café da manhã", "Lanche"] },
  { n: "Tapioca", c: "Carboidratos", s: "Pães & farinhas", m: ["Café da manhã", "Lanche", "Jantar"] },
  { n: "Aveia", c: "Carboidratos", s: "Pães & farinhas", m: ["Café da manhã", "Lanche"] },
  { n: "Granola", c: "Carboidratos", s: "Pães & farinhas", m: ["Café da manhã", "Lanche"] },
  { n: "Farofa", c: "Carboidratos", s: "Pães & farinhas", m: ["Almoço"] },
  { n: "Farinha (mandioca)", c: "Carboidratos", s: "Pães & farinhas", m: ["Almoço", "Jantar"] },
  { n: "Farinha láctea", c: "Carboidratos", s: "Pães & farinhas", m: ["Café da manhã", "Lanche"] },
  // Vegetais · Folhas & saladas
  { n: "Couve", c: "Vegetais", s: "Folhas & saladas", m: ["Almoço", "Jantar"] },
  { n: "Alface", c: "Vegetais", s: "Folhas & saladas", m: ["Almoço", "Jantar"] },
  { n: "Tomate", c: "Vegetais", s: "Folhas & saladas", m: ["Café da manhã", "Almoço", "Jantar"] },
  { n: "Cebola", c: "Vegetais", s: "Folhas & saladas", m: ["Café da manhã", "Almoço", "Jantar"] },
  // Vegetais · Legumes
  { n: "Cenoura", c: "Vegetais", s: "Legumes", m: ["Almoço", "Lanche", "Jantar"] },
  { n: "Brócolis", c: "Vegetais", s: "Legumes", m: ["Almoço", "Jantar"] },
  { n: "Abóbora / jerimum", c: "Vegetais", s: "Legumes", m: ["Almoço", "Jantar"] },
  { n: "Milho verde", c: "Vegetais", s: "Legumes", m: ["Almoço", "Lanche", "Jantar"] },
  { n: "Ervilha", c: "Vegetais", s: "Legumes", m: ["Almoço", "Jantar"] },
  { n: "Alho", c: "Vegetais", s: "Legumes", m: ["Almoço", "Jantar"] },
  // Frutas
  { n: "Banana", c: "Frutas", s: "Frutas", m: ["Café da manhã", "Lanche"] },
  { n: "Manga", c: "Frutas", s: "Frutas", m: ["Café da manhã", "Lanche"] },
  { n: "Mamão", c: "Frutas", s: "Frutas", m: ["Café da manhã", "Lanche"] },
  { n: "Melancia", c: "Frutas", s: "Frutas", m: ["Café da manhã", "Lanche"] },
  { n: "Uva", c: "Frutas", s: "Frutas", m: ["Lanche"] },
  { n: "Maçã", c: "Frutas", s: "Frutas", m: ["Lanche"] },
  { n: "Laranja", c: "Frutas", s: "Frutas", m: ["Café da manhã", "Lanche"] },
  { n: "Tangerina", c: "Frutas", s: "Frutas", m: ["Lanche"] },
  // Outros · Gorduras
  { n: "Azeite", c: "Outros", s: "Gorduras", m: ["Café da manhã", "Almoço", "Jantar"] },
  { n: "Manteiga", c: "Outros", s: "Gorduras", m: ["Café da manhã", "Almoço", "Jantar"] },
  { n: "Margarina", c: "Outros", s: "Gorduras", m: ["Café da manhã", "Almoço", "Jantar"] },
  // Outros · Molhos & temperos
  { n: "Mostarda", c: "Outros", s: "Molhos & temperos", m: ["Almoço", "Lanche", "Jantar"] },
  { n: "Ketchup", c: "Outros", s: "Molhos & temperos", m: ["Almoço", "Lanche", "Jantar"] },
  { n: "Shoyu", c: "Outros", s: "Molhos & temperos", m: ["Almoço", "Jantar"] },
  { n: "Barbecue", c: "Outros", s: "Molhos & temperos", m: ["Almoço", "Lanche", "Jantar"] },
  // Outros · Coberturas & doces
  { n: "Mel", c: "Outros", s: "Coberturas & doces", m: ["Café da manhã", "Lanche"] },
  { n: "Doce de leite", c: "Outros", s: "Coberturas & doces", m: ["Café da manhã", "Lanche"] },
  { n: "Creme de avelã (Nutella)", c: "Outros", s: "Coberturas & doces", m: ["Café da manhã", "Lanche"] },
  { n: "Chocolate", c: "Outros", s: "Coberturas & doces", m: ["Lanche"] },
  { n: "Paçoca", c: "Outros", s: "Coberturas & doces", m: ["Lanche"] },
  { n: "Achocolatado (Toddy)", c: "Outros", s: "Coberturas & doces", m: ["Café da manhã", "Lanche"] },
  // Outros · Leite & pastas
  { n: "Requeijão", c: "Outros", s: "Leite & pastas", m: ["Café da manhã", "Lanche"] },
  { n: "Requeijão light", c: "Outros", s: "Leite & pastas", m: ["Café da manhã", "Lanche"] },
  { n: "Cream cheese", c: "Outros", s: "Leite & pastas", m: ["Café da manhã", "Lanche"] },
  { n: "Leite", c: "Outros", s: "Leite & pastas", m: ["Café da manhã", "Lanche", "Jantar"] },
  { n: "Leite em pó", c: "Outros", s: "Leite & pastas", m: ["Café da manhã", "Lanche"] },
  { n: "Creme de leite", c: "Outros", s: "Leite & pastas", m: ["Almoço", "Jantar"] },
  { n: "Pasta de amendoim", c: "Outros", s: "Leite & pastas", m: ["Café da manhã", "Lanche"] },
  // Outros · Castanhas
  { n: "Castanhas / amendoim", c: "Outros", s: "Castanhas", m: ["Lanche"] },
  { n: "Filé mignon", c: "Proteínas", s: "Bovino", m: ["Almoço", "Jantar"] },
  { n: "Coração (bovino)", c: "Proteínas", s: "Bovino", m: ["Almoço", "Jantar"] },
  { n: "Hambúrguer de patinho", c: "Proteínas", s: "Bovino", m: ["Almoço", "Lanche", "Jantar"] },
  { n: "Torresmo", c: "Proteínas", s: "Suíno", m: ["Almoço", "Jantar"] },
  { n: "Costelinha suína", c: "Proteínas", s: "Suíno", m: ["Almoço", "Jantar"] },
  { n: "Salmão", c: "Proteínas", s: "Peixe & frutos do mar", m: ["Almoço", "Jantar"] },
  { n: "Caranguejo", c: "Proteínas", s: "Peixe & frutos do mar", m: ["Almoço", "Jantar"] },
  { n: "Siri", c: "Proteínas", s: "Peixe & frutos do mar", m: ["Almoço", "Jantar"] },
  { n: "Salame", c: "Proteínas", s: "Embutidos", m: ["Café da manhã", "Lanche", "Jantar"] },
  { n: "Nuggets", c: "Proteínas", s: "Embutidos", m: ["Almoço", "Lanche", "Jantar"] },
  { n: "Queijo prato", c: "Proteínas", s: "Queijos & laticínios", m: ["Café da manhã", "Almoço", "Lanche", "Jantar"] },
  { n: "Parmesão", c: "Proteínas", s: "Queijos & laticínios", m: ["Almoço", "Lanche", "Jantar"] },
  { n: "Queijo manteiga", c: "Proteínas", s: "Queijos & laticínios", m: ["Café da manhã", "Lanche", "Jantar"] },
  { n: "Provolone", c: "Proteínas", s: "Queijos & laticínios", m: ["Almoço", "Lanche", "Jantar"] },
  { n: "Cheddar", c: "Proteínas", s: "Queijos & laticínios", m: ["Almoço", "Lanche", "Jantar"] },
  { n: "Iogurte grego", c: "Proteínas", s: "Queijos & laticínios", m: ["Café da manhã", "Lanche"] },
  { n: "Arroz integral", c: "Carboidratos", s: "Grãos & massas", m: ["Almoço", "Jantar"] },
  { n: "Nhoque", c: "Carboidratos", s: "Grãos & massas", m: ["Almoço", "Jantar"] },
  { n: "Miojo", c: "Carboidratos", s: "Grãos & massas", m: ["Almoço", "Lanche", "Jantar"] },
  { n: "Pão de forma", c: "Carboidratos", s: "Pães & farinhas", m: ["Café da manhã", "Lanche"] },
  { n: "Rúcula", c: "Vegetais", s: "Folhas & saladas", m: ["Almoço", "Jantar"] },
  { n: "Espinafre", c: "Vegetais", s: "Folhas & saladas", m: ["Almoço", "Jantar"] },
  { n: "Repolho", c: "Vegetais", s: "Folhas & saladas", m: ["Almoço", "Jantar"] },
  { n: "Berinjela", c: "Vegetais", s: "Legumes", m: ["Almoço", "Jantar"] },
  { n: "Pimentão", c: "Vegetais", s: "Legumes", m: ["Café da manhã", "Almoço", "Jantar"] },
  { n: "Beterraba", c: "Vegetais", s: "Legumes", m: ["Almoço", "Lanche", "Jantar"] },
  { n: "Couve-flor", c: "Vegetais", s: "Legumes", m: ["Almoço", "Jantar"] },
  { n: "Pepino", c: "Vegetais", s: "Legumes", m: ["Almoço", "Lanche", "Jantar"] },
  { n: "Abacaxi", c: "Frutas", s: "Frutas", m: ["Café da manhã", "Lanche"] },
  { n: "Goiaba", c: "Frutas", s: "Frutas", m: ["Café da manhã", "Lanche"] },
  { n: "Maracujá", c: "Frutas", s: "Frutas", m: ["Café da manhã", "Lanche"] },
  { n: "Acerola", c: "Frutas", s: "Frutas", m: ["Café da manhã", "Lanche"] },
  { n: "Caju", c: "Frutas", s: "Frutas", m: ["Café da manhã", "Lanche"] },
  { n: "Coco", c: "Frutas", s: "Frutas", m: ["Café da manhã", "Lanche"] },
  { n: "Abacate", c: "Frutas", s: "Frutas", m: ["Café da manhã", "Lanche"] },
  { n: "Morango", c: "Frutas", s: "Frutas", m: ["Café da manhã", "Lanche"] },
  { n: "Melão", c: "Frutas", s: "Frutas", m: ["Café da manhã", "Lanche"] },
  { n: "Limão", c: "Frutas", s: "Frutas", m: ["Café da manhã", "Lanche"] },
  { n: "Pera", c: "Frutas", s: "Frutas", m: ["Café da manhã", "Lanche"] },
  { n: "Seriguela", c: "Frutas", s: "Frutas", m: ["Café da manhã", "Lanche"] },
  { n: "Cajá", c: "Frutas", s: "Frutas", m: ["Café da manhã", "Lanche"] },
  { n: "Graviola", c: "Frutas", s: "Frutas", m: ["Café da manhã", "Lanche"] },
  { n: "Óleo de coco", c: "Outros", s: "Gorduras", m: ["Café da manhã", "Almoço", "Jantar"] },
  { n: "Maionese", c: "Outros", s: "Molhos & temperos", m: ["Almoço", "Lanche", "Jantar"] },
  { n: "Molho de tomate / extrato", c: "Outros", s: "Molhos & temperos", m: ["Almoço", "Jantar"] },
  { n: "Molho branco", c: "Outros", s: "Molhos & temperos", m: ["Almoço", "Jantar"] },
  { n: "Vinagre", c: "Outros", s: "Molhos & temperos", m: ["Almoço", "Jantar"] },
  { n: "Pimenta", c: "Outros", s: "Molhos & temperos", m: ["Almoço", "Jantar"] },
  { n: "Molho inglês", c: "Outros", s: "Molhos & temperos", m: ["Almoço", "Jantar"] },
  { n: "Azeite de dendê", c: "Outros", s: "Molhos & temperos", m: ["Almoço", "Jantar"] },
  { n: "Leite de coco", c: "Outros", s: "Molhos & temperos", m: ["Café da manhã", "Almoço", "Jantar"] },
  { n: "Whey protein", c: "Outros", s: "Leite & pastas", m: ["Café da manhã", "Lanche"] },
  { n: "Leite vegetal", c: "Outros", s: "Leite & pastas", m: ["Café da manhã", "Lanche"] },
  { n: "Castanha de caju", c: "Outros", s: "Castanhas", m: ["Lanche"] },
  { n: "Castanha do Pará", c: "Outros", s: "Castanhas", m: ["Lanche"] },
  { n: "Amêndoas", c: "Outros", s: "Castanhas", m: ["Lanche"] },
  { n: "Nozes", c: "Outros", s: "Castanhas", m: ["Lanche"] },
  { n: "Chia", c: "Outros", s: "Castanhas", m: ["Café da manhã", "Lanche"] },
  { n: "Linhaça", c: "Outros", s: "Castanhas", m: ["Café da manhã", "Lanche"] },
];

const RECIPES = [
  { n: "Omelete", meals: ["Café da manhã", "Jantar", "Lanche"], base: ["Ovos"] },
  { n: "Cuscuz recheado", meals: ["Café da manhã", "Jantar"], base: ["Cuscuz"] },
  { n: "Tapioca recheada", meals: ["Café da manhã", "Lanche", "Jantar"], base: ["Tapioca"] },
  { n: "Sanduíche natural", meals: ["Café da manhã", "Lanche"], base: ["Pão"] },
  { n: "Salada completa", meals: ["Almoço", "Jantar"], base: ["Alface", "Tomate"] },
  { n: "Sopa / caldo", meals: ["Almoço", "Jantar"], base: ["Abóbora / jerimum"] },
  { n: "Panqueca de aveia", meals: ["Café da manhã", "Lanche"], base: ["Aveia", "Ovos", "Banana"] },
  { n: "Vitamina / shake", meals: ["Café da manhã", "Lanche"], base: ["Leite", "Banana"] },
  { n: "Strogonoff leve", meals: ["Almoço", "Jantar"], base: ["Frango", "Creme de leite"] },
  { n: "Escondidinho", meals: ["Almoço", "Jantar"], base: ["Macaxeira", "Carne moída"] },
  { n: "Frango com batata-doce", meals: ["Almoço", "Jantar"], base: ["Frango", "Batata-doce"] },
  { n: "Carne de sol com macaxeira", meals: ["Café da manhã", "Almoço", "Jantar"], base: ["Charque / carne de sol", "Macaxeira"] },
  { n: "Baião de dois", meals: ["Almoço", "Jantar"], base: ["Arroz", "Feijão"] },
  { n: "Macarrão à bolonhesa", meals: ["Almoço", "Jantar"], base: ["Macarrão", "Carne moída"] },
  { n: "Bife acebolado", meals: ["Almoço", "Jantar"], base: ["Carne bovina magra", "Cebola"] },
  { n: "Peixe assado com legumes", meals: ["Almoço", "Jantar"], base: ["Peixe / tilápia"] },
  { n: "Camarão refogado", meals: ["Almoço", "Jantar"], base: ["Camarão"] },
  { n: "Salada de atum", meals: ["Almoço", "Lanche", "Jantar"], base: ["Atum enlatado", "Alface"] },
  { n: "Frango grelhado + salada", meals: ["Almoço", "Jantar"], base: ["Frango", "Alface"] },
  { n: "Wrap de frango", meals: ["Almoço", "Lanche"], base: ["Tapioca", "Frango"] },
  { n: "Cuscuz com ovo", meals: ["Café da manhã", "Jantar"], base: ["Cuscuz", "Ovos"] },
  { n: "Torrada com ovo", meals: ["Café da manhã", "Lanche"], base: ["Pão", "Ovos"] },
  { n: "Mingau de aveia", meals: ["Café da manhã", "Lanche"], base: ["Aveia", "Leite"] },
  { n: "Iogurte com granola", meals: ["Café da manhã", "Lanche"], base: ["Iogurte", "Granola"] },
  { n: "Panqueca de banana", meals: ["Café da manhã", "Lanche"], base: ["Banana", "Ovos"] },
  { n: "Salpicão leve", meals: ["Almoço", "Lanche"], base: ["Frango", "Cenoura"] },
  { n: "Feijão tropeiro leve", meals: ["Almoço"], base: ["Feijão", "Ovos"] },
  { n: "Strogonoff de carne", meals: ["Almoço", "Jantar"], base: ["Carne bovina magra", "Creme de leite"] },
];

const SYSTEM_PROMPT = `Você é o assistente nutricional pessoal de UM usuário específico. Dada uma refeição e os alimentos disponíveis, monte uma porção balanceada com quantidades em medidas caseiras.

PERFIL:
- Homem, 28 anos, 105kg, 1,70m (IMC ~36, obesidade). Mora no Nordeste (Maceió).
- Meta imediata: sair da obesidade (abaixo de 87kg). Meta final: 70–78kg.
- Emagrecimento MODERADO. A meta diária é calculada pelo peso atual e pela atividade do dia; use SEMPRE o valor de kcal informado no CONTEXTO DE HOJE.
- Intolerância leve à lactose (consome sem problema em quantidade moderada).
- Gosta de bastante proteína. Futebol seg/qui; musculação 2x/semana.
- Come vegetais: couve, alface, tomate, cebola, cenoura, brócolis, abóbora. Aceita salada.

REGRAS:
1. NUNCA restritivo: ajuste quantidades, não proíba.
2. UM carboidrato principal por refeição.
3. Almoço/jantar: metade do prato de vegetais quando houver; senão garanta volume/saciedade com proteína, feijão, caldo/sopa.
4. Proteína generosa (sacia). 5. Farofa no máx ~1 c. de sopa. 6. Priorize SACIEDADE.
7. Se faltar algo, rebalanceie e explique na "dica". 8. Dia de FUTEBOL: refeição um pouco mais reforçada; PARADO: mais enxuta.
9. Referência: café 400–500, almoço 600–700, lanche 150–250, jantar 400–500 kcal.
10. CONTEXTO DE HOJE: monte para caber nas kcal que RESTAM do dia quando possível. Se restar pouco, faça leve e volumoso (proteína magra + vegetais, pouco carbo). Se não der pra caber sem deixar com fome real, seja HONESTO na "dica" e priorize saciedade — passar um pouco num dia não atrapalha a média, mas dormir com fome faz a pessoa desistir. Se já estourou (restam <=0), proponha a opção mais leve e sensata e tranquilize.
11. PERFIL APRENDIDO: puxe para os alimentos e estilos que a pessoa curte e repete. Se o peso está travado há semanas, sugira com gentileza reforçar proteína/vegetais ou reduzir um pouco o carbo. Se está emagrecendo bem, mantenha o padrão que está funcionando.
12. COERÊNCIA CULINÁRIA: interprete os alimentos selecionados como UM prato/refeição coeso, combinando-os do jeito que faz sentido na cozinha brasileira/nordestina (ex.: leite é para despejar sobre o cuscuz; queijo derrete no ovo; creme de leite entra no strogonoff). NUNCA transforme um ingrediente que é parte do prato numa "sobremesa" ou item avulso sem sentido. Se um item não combina com o resto, use-o como acompanhamento lógico ou avise na "dica".
13. QUEIJOS variam: ricota e cottage são leves; mussarela é intermediário; coalho, do reino e gorgonzola são mais calóricos e salgados — ajuste a porção ao tipo (queijos fortes, use pouco).
14. Em "troca", sugira UMA substituição simples que deixe o prato mais leve, com a economia aproximada (ex.: "troque a farofa por couve refogada, -80 kcal"). Se já estiver bem leve, use null.
15. PRECISÃO CALÓRICA — NUNCA subestime, seja REAL e não otimista. Cortes gordurosos (costela ~450–600 kcal só a carne em 150g, cupim, picanha, pernil, panceta, torresmo, linguiça, calabresa, bacon), frituras/empanados, queijos amarelos, óleos, manteiga, castanhas, açúcar e doces são MUITO calóricos. Some as calorias ESCONDIDAS: óleo/gordura do preparo (fritar/refogar pesa muito mais que grelhar/cozer), molhos, açúcar. Prefira sempre o limite ALTO da faixa — superestimar um pouco é melhor que subestimar e furar o déficit. Um prato de costela+arroz+feijão+salada raramente fica abaixo de 750 kcal.

RESPONDA APENAS JSON válido, sem markdown:
{"titulo":"...","itens":[{"alimento":"...","quantidade":"...","obs":"dica ou null"}],"calorias_estimadas":<int>,"saciedade":"Baixa|Média|Alta","dica":"...","troca":"substituição para aliviar kcal, ou null","prato":{"proteina":<n>,"carbo":<n>,"vegetais":<n>,"feijao":<n>} ou null}
Porcentagens de prato somam 100. null em café/lanche.`;

const ESTIMATE_PROMPT = `Você estima calorias de alimentos em português do Brasil. Dado o texto, responda APENAS JSON: {"nome":"nome curto","kcal":<inteiro>}. Se a quantidade não for dita, assuma uma porção comum. Seja REALISTA, nunca otimista: inclua óleo/gordura de preparo, molhos e açúcar; frituras e cortes gordos pesam muito; na dúvida, arredonde pra CIMA.`;

const LOGGED_PROMPT = `A pessoa vai descrever o que JÁ COMEU, com quantidades (gramas, unidades, colheres, fatias etc., podendo misturar formatos). Sua tarefa: calcular as calorias de CADA item com as quantidades informadas e apresentar a refeição.
NÃO altere as quantidades que ela informou — apenas calcule. Se algum item vier sem quantidade, assuma uma porção comum e diga isso na "obs" desse item.
PRECISÃO: seja REAL, nunca otimista. Inclua óleo/gordura de preparo (fritar/refogar pesa mais que grelhar/cozer), molhos e açúcar. Cortes gordos, frituras, queijos amarelos, castanhas e doces são muito calóricos. Na dúvida, arredonde pra CIMA.
Na "dica", comente brevemente a refeição para quem está emagrecendo (o que foi bom, o que pesou).
RESPONDA APENAS JSON, sem markdown:
{"titulo":"nome curto da refeição","itens":[{"alimento":"...","quantidade":"a quantidade que a pessoa informou","kcal":<int>,"obs":"curta ou null"}],"calorias_estimadas":<int, soma dos itens>,"saciedade":"Baixa|Média|Alta","dica":"1-2 frases","prato":{"proteina":<n>,"carbo":<n>,"vegetais":<n>,"feijao":<n>} ou null se não fizer sentido}
As porcentagens de "prato" somam 100.`;

const FREEMEAL_PROMPT = `Você é o coach de uma pessoa emagrecendo (meta ~2200 kcal/dia) que usa um "banco semanal" (meta diária calculada pelo peso): comendo abaixo da meta, guarda crédito pra uma refeição livre. Ela vai dizer QUE tipo de comida quer (ex.: pizza, hambúrguer, sushi). Com base no crédito da semana e na sobra de hoje, indique uma PORÇÃO CONCRETA e apetitosa desse alimento que cabe hoje sem estragar a semana (ex.: "2 fatias de pizza de frango com catupiry"). Regras: equilíbrio sempre, nunca incentive exagero; a porção não deve passar de ~40% do crédito positivo somado à sobra de hoje; se o crédito for baixo ou negativo, ofereça uma porção pequena e seja honesto (ou sugira uma versão mais leve). Responda APENAS JSON: {"porcao":"descrição concreta e apetitosa da porção","kcal":<int>,"mensagem":"1 frase amigável e honesta"}`;

// ---- Persistência ----
const STORE_PREFIX = "montaprato:";
const isoToday = () => new Date().toISOString().slice(0, 10);
const isoDaysAgo = (n) => new Date(Date.now() - n * 86400000).toISOString().slice(0, 10);
const uid = () => Math.random().toString(36).slice(2, 9);
async function loadJSON(key, fb) { try { const v = localStorage.getItem(STORE_PREFIX + key); return v === null ? fb : JSON.parse(v); } catch { return fb; } }
async function saveJSON(key, v) { try { localStorage.setItem(STORE_PREFIX + key, JSON.stringify(v)); } catch (e) {} }

function parseLooseJSON(text) {
  let t = (text || "").replace(/```json/gi, "").replace(/```/g, "").trim();
  try { return JSON.parse(t); } catch (e) {}
  const s = t.indexOf("{"), e = t.lastIndexOf("}");
  if (s !== -1 && e !== -1 && e > s) { try { return JSON.parse(t.slice(s, e + 1)); } catch (er) {} }
  throw new Error("Resposta em formato inesperado");
}
async function callClaude(system, userMsg, maxTokens = 900) {
  const resp = await fetch("/api/claude", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ max_tokens: maxTokens, system, messages: [{ role: "user", content: userMsg }] }),
  });
  const data = await resp.json();
  if (data && data.error) throw new Error(data.error.message || "Erro na API");
  const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n");
  if (!text.trim()) throw new Error("Resposta vazia");
  return parseLooseJSON(text);
}
async function callClaudeMsgs(system, messages, maxTokens = 900) {
  const resp = await fetch("/api/claude", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ max_tokens: maxTokens, system, messages }),
  });
  const data = await resp.json();
  if (data && data.error) throw new Error(data.error.message || "Erro na API");
  return (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n");
}

// ---- Componentes ----
function Chip({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      border: `1.5px solid ${active ? C.green : C.line}`, background: active ? C.green : C.surface,
      color: active ? "#fff" : C.ink, borderRadius: 999, padding: "8px 14px", fontSize: 13.5,
      fontWeight: 500, cursor: "pointer", transition: "all .15s ease", display: "inline-flex", alignItems: "center", gap: 6,
    }}>{label}{active && <X size={13} strokeWidth={2.5} />}</button>
  );
}

function CalRing({ consumed, target }) {
  const size = 152, stroke = 13, r = (size - stroke) / 2, circ = 2 * Math.PI * r;
  const pct = Math.min(1, target ? consumed / target : 0);
  const over = consumed > target, col = over ? C.honey : C.green;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.greenSoft} strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={col} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)} transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset .6s cubic-bezier(.4,0,.2,1), stroke .3s" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span className="display" style={{ fontSize: 36, fontWeight: 800, color: C.ink, lineHeight: 1 }}>{consumed}</span>
        <span style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>de {target} kcal</span>
        <span style={{ fontSize: 11.5, fontWeight: 600, color: col, marginTop: 5, background: over ? C.honeySoft : C.greenSoft, padding: "2px 10px", borderRadius: 999 }}>
          {over ? `+${consumed - target} acima` : `${target - consumed} restam`}
        </span>
      </div>
    </div>
  );
}

function Plate({ prato }) {
  if (!prato) return null;
  const order = ["vegetais", "proteina", "carbo", "feijao"];
  let acc = 0; const stops = [];
  order.forEach((k) => { const v = prato[k] || 0; if (v <= 0) return; stops.push(`${PLATE[k]} ${acc}% ${acc + v}%`); acc += v; });
  const labels = [{ k: "vegetais", t: "Vegetais" }, { k: "proteina", t: "Proteína" }, { k: "carbo", t: "Carbo" }, { k: "feijao", t: "Feijão" }].filter((l) => (prato[l.k] || 0) > 0);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
      <div style={{ width: 112, height: 112, borderRadius: "50%", background: `conic-gradient(${stops.join(", ")})`, boxShadow: `0 0 0 6px #fff, 0 0 0 7px ${C.line}, 0 10px 24px rgba(27,40,35,.15)`, flexShrink: 0 }} aria-hidden />
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {labels.map((l) => (
          <div key={l.k} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: C.muted }}>
            <span style={{ width: 11, height: 11, borderRadius: 3, background: PLATE[l.k] }} />
            <span style={{ color: C.ink, fontWeight: 500 }}>{l.t}</span><span>{prato[l.k]}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function WeightChart({ data }) {
  if (!data || data.length < 2) return <p style={{ fontSize: 13, color: C.muted, margin: "10px 0 0" }}>Registre pelo menos dois pesos para ver sua evolução.</p>;
  const pts = data.slice(-12), kgs = pts.map((p) => p.kg);
  const min = Math.min(...kgs) - 1, max = Math.max(...kgs) + 1;
  const W = 320, H = 130, pad = 10;
  const x = (i) => pad + (i / (pts.length - 1)) * (W - pad * 2);
  const y = (kg) => pad + (1 - (kg - min) / (max - min || 1)) * (H - pad * 2);
  const path = pts.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p.kg).toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", marginTop: 10 }}>
      <defs><linearGradient id="wg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.green} stopOpacity="0.22" /><stop offset="100%" stopColor={C.green} stopOpacity="0" /></linearGradient></defs>
      <path d={`${path} L${x(pts.length - 1)},${H - pad} L${x(0)},${H - pad} Z`} fill="url(#wg)" />
      <path d={path} fill="none" stroke={C.green} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {pts.map((p, i) => <circle key={i} cx={x(i)} cy={y(p.kg)} r="3.2" fill="#fff" stroke={C.green} strokeWidth="2" />)}
      {[[0, pts[0]], [pts.length - 1, pts[pts.length - 1]]].map(([i, p]) => (
        <text key={i} x={x(i)} y={y(p.kg) - 9} fontSize="11" fill={C.ink} textAnchor={i ? "end" : "start"} fontWeight="700">{p.kg}kg</text>
      ))}
    </svg>
  );
}

const satColor = (s) => (s === "Alta" ? C.green : s === "Média" ? C.honey : C.over);

function weightTrend(weights) {
  if (!weights || weights.length < 2) return null;
  const start = isoDaysAgo(21);
  let w = weights.filter((x) => x.date >= start);
  if (w.length < 2) w = weights.slice(-2);
  const first = w[0], last = w[w.length - 1];
  const days = Math.max(1, (new Date(last.date) - new Date(first.date)) / 86400000);
  const perWeek = Math.round(((last.kg - first.kg) / days) * 7 * 10) / 10;
  const s = `${perWeek > 0 ? "+" : ""}${perWeek}`;
  if (perWeek <= -0.3) return `emagrecendo bem (~${s} kg/sem) — o padrão atual funciona`;
  if (perWeek <= -0.05) return `emagrecendo devagar (~${s} kg/sem)`;
  if (perWeek < 0.2) return `travado nas últimas semanas (${s} kg/sem) — vale reforçar proteína/vegetais ou reduzir um pouco o carbo`;
  return `subindo (${s} kg/sem) — reveja porções com gentileza`;
}

function learnedProfile(history, weights, favorites) {
  const parts = [];
  if (favorites && favorites.length) parts.push(`Curte: ${favorites.map((f) => f.titulo).slice(0, 5).join("; ")}.`);
  const dates = Object.keys(history).sort().reverse().slice(0, 4);
  const titles = [];
  dates.forEach((d) => (history[d].meals || []).forEach((m) => { if (m.source !== "manual") titles.push(m.titulo); }));
  if (titles.length) parts.push(`Recentes: ${titles.slice(0, 5).join("; ")}.`);
  const rated = [];
  Object.values(history).forEach((v) => (v.meals || []).forEach((m) => { if (m.sabor || m.saciedadeR) rated.push(m); }));
  const liked = [...new Set(rated.filter((m) => (m.sabor || 0) >= 4).map((m) => m.titulo))].slice(0, 4);
  const lowSat = [...new Set(rated.filter((m) => (m.saciedadeR || 0) > 0 && (m.saciedadeR || 0) <= 2).map((m) => m.titulo))].slice(0, 4);
  if (liked.length) parts.push(`Gostou do sabor: ${liked.join("; ")}.`);
  if (lowSat.length) parts.push(`Deixou com fome (aumente porcao): ${lowSat.join("; ")}.`);
  const trend = weightTrend(weights);
  if (trend) parts.push(`Peso: ${trend}.`);
  return parts.length ? parts.join(" ") : "Poucos dados ainda; priorize saciedade.";
}
function dayStatus(consumed, target) {
  if (consumed === 0) return null;
  const diff = consumed - target;
  if (diff <= 0) return { tone: C.green, text: `Dentro da meta, com ${Math.abs(diff)} kcal de folga. Mandou bem.` };
  if (diff <= target * 0.1) return { tone: C.honey, text: `Passou ${diff} kcal — de leve, sem drama. O que conta é a média da semana.` };
  return { tone: C.over, text: `Passou ${diff} kcal hoje. Acontece; amanhã é um novo dia e a tendência é o que importa.` };
}

function weekDates(refIso) {
  const d = new Date(refIso + "T12:00:00");
  const dow = (d.getDay() + 6) % 7; // 0 = segunda
  const monday = new Date(d); monday.setDate(d.getDate() - dow);
  return Array.from({ length: 7 }, (_, i) => { const x = new Date(monday); x.setDate(monday.getDate() + i); return x.toISOString().slice(0, 10); });
}
const EVAL_PROMPT = `Você é um coach de emagrecimento acompanhando uma pessoa. Analise os dados e faça uma avaliação honesta, empática e concreta — nunca alarmista, nunca incentivando cortes extremos ou passar fome. Diretrizes:
- Peso caindo em ritmo saudável (~0,3–0,8 kg/semana): elogie e mande manter, ajuste_deficit = null.
- Peso ESTAGNADO por ~3 semanas E registro consistente (registrou a maioria dos dias): o déficit pode estar baixo — sugira AUMENTAR ~150–250 kcal (novo déficit entre 250 e 750, nunca acima).
- Registro FALHO (poucos dias): o provável é subregistro/constância, NÃO o déficit — recomende registrar melhor antes de mexer na meta e ajuste_deficit = null.
- Perdendo rápido demais (>1 kg/semana): sugira REDUZIR o déficit pra proteger músculo.
- Reforce hábitos (água, exercício, pesar semanalmente) quando fizer sentido.
Responda APENAS JSON: {"resumo":"1-2 frases do panorama","diagnostico":"o que os dados mostram","recomendacao":"o que fazer, concreto e gentil","ajuste_deficit":<novo déficit inteiro entre 250 e 750, ou null pra manter>,"motivo_ajuste":"curto, ou null"}`;

function buildEvalData(history, weights, deficit, currentWeight) {
  const recent = weights.slice(-6).map((w) => `${w.date}:${w.kg}kg`).join(", ");
  let rate = "sem dados suficientes";
  if (weights.length >= 2) {
    const start = isoDaysAgo(27);
    let w = weights.filter((x) => x.date >= start); if (w.length < 2) w = weights.slice(-2);
    const days = Math.max(1, (new Date(w[w.length - 1].date) - new Date(w[0].date)) / 86400000);
    rate = `${Math.round(((w[w.length - 1].kg - w[0].kg) / days) * 7 * 100) / 100} kg/semana`;
  }
  const start14 = isoDaysAgo(13); let logged = 0, tot = 0, ex = 0;
  Object.entries(history).forEach(([d, v]) => { if (d >= start14) { const ms = v.meals || []; if (ms.length) { logged++; tot += ms.reduce((a, m) => a + (m.kcal || 0), 0); } if (v.dayType && v.dayType !== "parado") ex++; } });
  const avg = logged ? Math.round(tot / logged) : 0;
  return `DADOS (homem, 1,70m, ~28 anos; meta: sair da obesidade abaixo de 87kg, depois 72kg):
Peso inicial 105kg, atual ${currentWeight}kg. Pesagens recentes: ${recent || "nenhuma"}.
Ritmo recente: ${rate}.
Calorias registradas: média ${avg || "—"} kcal/dia em ${logged} de 14 dias (constância do registro).
Dias de exercício (2 semanas): ${ex}.
Déficit atual: ${deficit} kcal. Meta atual (dia parado): ${targetFor("parado", currentWeight, deficit)} kcal.
Avalie o progresso e recomende ajustes.`;
}

function computeWeek(history, today, weight, deficit) {
  const dts = weekDates(today);
  let wTarget = 0, wConsumed = 0, elapsedTarget = 0, elapsedConsumed = 0;
  dts.forEach((d) => {
    const dd = history[d] || {};
    const t = targetFor(dd.dayType || "parado", weight, deficit);
    const c = (dd.meals || []).reduce((a, m) => a + (m.kcal || 0), 0);
    wTarget += t; wConsumed += c;
    if (d <= today) { elapsedTarget += t; elapsedConsumed += c; }
  });
  return { dts, wTarget, wConsumed, saldo: elapsedTarget - elapsedConsumed, remaining: wTarget - wConsumed };
}


export default function App() {
  const today = isoToday();
  const [view, setView] = useState("hoje");
  const [viewDate, setViewDate] = useState(today);
  const [dark, setDark] = useState(false);
  const [meal, setMeal] = useState("Almoço");
  const [selected, setSelected] = useState([]);
  const [custom, setCustom] = useState("");
  const [foodQuery, setFoodQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [lastTitulo, setLastTitulo] = useState(null);
  const [history, setHistory] = useState({});
  const [weights, setWeights] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [usage, setUsage] = useState({});
  const [customFoods, setCustomFoods] = useState([]);
  const [newFoodCat, setNewFoodCat] = useState("Proteínas");
  const [deficit, setDeficit] = useState(500);
  const [evalLoading, setEvalLoading] = useState(false);
  const [evalResult, setEvalResult] = useState(null);
  const [chatMsgs, setChatMsgs] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [mealEdited, setMealEdited] = useState(false);
  const [photoData, setPhotoData] = useState(null);
  const [photoMime, setPhotoMime] = useState("image/jpeg");
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoText, setPhotoText] = useState("");
  const [photoLoading, setPhotoLoading] = useState(false);
  const [photoResult, setPhotoResult] = useState(null);
  const [showBackup, setShowBackup] = useState(false);
  const [backupText, setBackupText] = useState("");
  const [importText, setImportText] = useState("");
  const [backupMsg, setBackupMsg] = useState("");
  const [weightInput, setWeightInput] = useState("");
  const [reportRange, setReportRange] = useState(7);
  const [manualName, setManualName] = useState("");
  const [manualMeal, setManualMeal] = useState("Almoço");
  const [manualResult, setManualResult] = useState(null);
  const [estimating, setEstimating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editKcal, setEditKcal] = useState("");
  const [waterCustom, setWaterCustom] = useState("");
  const [activeRecipe, setActiveRecipe] = useState(null);
  const [showManual, setShowManual] = useState(false);
  const [recipesOpen, setRecipesOpen] = useState(false);
  const [openSubs, setOpenSubs] = useState({});
  const [ratingOpenId, setRatingOpenId] = useState(null);
  const [freeOpen, setFreeOpen] = useState(false);
  const [freeType, setFreeType] = useState(null);
  const [freeLoading, setFreeLoading] = useState(false);
  const [freeResult, setFreeResult] = useState(null);
  const [freeCustom, setFreeCustom] = useState("");
  const [, forceRender] = useState(0);

  useEffect(() => { (async () => {
    const [h, w, f, u, t, cf, df] = await Promise.all([loadJSON("history", {}), loadJSON("weights", []), loadJSON("favorites", []), loadJSON("usage", {}), loadJSON("theme", false), loadJSON("customFoods", []), loadJSON("deficit", 500)]);
    setHistory(h || {}); setWeights(w || []); setFavorites(f || []); setUsage(u || {}); setCustomFoods(cf || []); setDeficit(df || 500);
    if (t) { applyTheme(true); setDark(true); }
  })(); }, []);

  const isToday = viewDate === today;
  const dayData = history[viewDate] || { meals: [], dayType: "parado", water: 0 };
  const dayType = dayData.dayType || "parado";
  const water = dayData.water || 0;
  const currentWeight = weights.length ? weights[weights.length - 1].kg : START_WEIGHT;
  const target = targetFor(dayType, currentWeight, deficit);
  const meals = dayData.meals || [];
  const consumed = useMemo(() => meals.reduce((a, m) => a + (m.kcal || 0), 0), [meals]);

  const persistHistory = useCallback((n) => { setHistory(n); saveJSON("history", n); }, []);
  const persistWeights = useCallback((n) => { setWeights(n); saveJSON("weights", n); }, []);
  const persistFavorites = useCallback((n) => { setFavorites(n); saveJSON("favorites", n); }, []);
  const persistUsage = useCallback((n) => { setUsage(n); saveJSON("usage", n); }, []);

  const patchDay = (patch) => { const cur = history[viewDate] || { meals: [], dayType: "parado", water: 0 }; persistHistory({ ...history, [viewDate]: { ...cur, ...patch } }); };
  const addMeals = (entries) => { const cur = history[viewDate] || { meals: [], dayType: "parado", water: 0 }; persistHistory({ ...history, [viewDate]: { ...cur, meals: [...(cur.meals || []), ...entries] } }); };
  const deleteMeal = (id) => patchDay({ meals: meals.filter((m) => m.id !== id) });
  const saveEditKcal = (id) => { const k = parseInt(editKcal); if (!isNaN(k)) patchDay({ meals: meals.map((m) => m.id === id ? { ...m, kcal: k } : m) }); setEditingId(null); setEditKcal(""); };
  const rateMeal = (id, field, val) => patchDay({ meals: meals.map((m) => m.id === id ? { ...m, [field]: val } : m) });

  const allFoods = useMemo(() => [...FOODS, ...customFoods.map((f) => ({ n: f.n, c: f.c || "Outros", s: "Adicionados por mim", m: ALL_MEALS }))], [customFoods]);
  const customByName = useMemo(() => Object.fromEntries(customFoods.map((f) => [f.n, f])), [customFoods]);
  const catalogByName = useMemo(() => Object.fromEntries(allFoods.map((f) => [f.n, f])), [allFoods]);
  const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const q = norm(foodQuery.trim());
  const visibleGroups = useMemo(() => { const g = {}; allFoods.filter((f) => f.m.includes(meal) && (!q || norm(f.n).includes(q))).forEach((f) => { const sub = f.s || "Outros"; (g[f.c] ||= {}); (g[f.c][sub] ||= []).push(f.n); }); return g; }, [allFoods, meal, q]);
  const topUsed = useMemo(() => Object.entries(usage).filter(([n]) => { const f = catalogByName[n]; return f && f.m.includes(meal); }).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([n]) => n), [usage, meal, catalogByName]);

  const changeMeal = (next) => { setMeal(next); setResult(null); setActiveRecipe(null); setSelected((s) => s.filter((n) => { const f = catalogByName[n]; return !f || f.m.includes(next); })); };
  const pickRecipe = (r) => { setActiveRecipe(r.n); if (!r.meals.includes(meal)) setMeal(r.meals[0]); setSelected([...r.base]); setResult(null); };
  const clearRecipe = () => { setActiveRecipe(null); setSelected([]); };
  const persistCustomFoods = useCallback((n) => { setCustomFoods(n); saveJSON("customFoods", n); }, []);
  async function estimateFoodKcal(id, name) {
    try {
      const ck = "kcal:" + name.toLowerCase();
      const cached = await loadJSON(ck, null);
      if (cached && typeof cached.kcal === "number") {
        setCustomFoods((prev) => { const nx = prev.map((f) => f.id === id ? { ...f, kcal: cached.kcal } : f); saveJSON("customFoods", nx); return nx; });
        return;
      }
      const r = await callClaude(ESTIMATE_PROMPT, `Estime as calorias de 1 porção comum de ${name}.`, 100);
      saveJSON(ck, { kcal: r.kcal || null });
      setCustomFoods((prev) => { const nx = prev.map((f) => f.id === id ? { ...f, kcal: r.kcal || null } : f); saveJSON("customFoods", nx); return nx; });
    } catch (e) { /* mantém sem kcal */ }
  }
  const toggle = (f) => setSelected((s) => (s.includes(f) ? s.filter((x) => x !== f) : [...s, f]));
  const isSubOpen = (cat, sub) => !!openSubs[cat + "::" + sub];
  const toggleSub = (cat, sub) => setOpenSubs((o) => ({ ...o, [cat + "::" + sub]: !o[cat + "::" + sub] }));
  const addCustom = () => {
    const v = custom.trim(); if (!v) return;
    const exists = allFoods.some((f) => f.n.toLowerCase() === v.toLowerCase());
    if (!exists) { const id = uid(); persistCustomFoods([...customFoods, { id, n: v, c: newFoodCat, kcal: null }]); estimateFoodKcal(id, v); }
    if (!selected.includes(v)) setSelected((s) => [...s, v]);
    setCustom("");
  };
  const removeCustomFood = (id) => { const f = customFoods.find((x) => x.id === id); persistCustomFoods(customFoods.filter((x) => x.id !== id)); if (f) setSelected((s) => s.filter((n) => n !== f.n)); };

  async function montar(regenerate = false) {
    if (selected.length === 0) return;
    setLoading(true); setError(null); if (!regenerate) setResult(null);
    const avoid = regenerate && lastTitulo ? ` Monte opção DIFERENTE da anterior ("${lastTitulo}").` : "";
    const remaining = target - consumed;
    const ctx = `CONTEXTO DE HOJE: dia de ${dayTypeById(dayType).label.toLowerCase()}. Meta ${target} kcal; já consumiu ${consumed}; restam ${remaining} kcal${remaining <= 250 ? " (pouco — monte leve!)" : ""}.`;
    const prof = `PERFIL APRENDIDO: ${learnedProfile(history, weights, favorites)}`;
    const recipeCtx = activeRecipe ? ` A pessoa quer montar a receita "${activeRecipe}": monte essa receita específica, equilibrada e saudável, combinando os ingredientes de forma coerente.` : "";
    try {
      const custHints = selected.map((n) => customByName[n]).filter(Boolean);
      const hintStr = custHints.length ? ` (categorias dos meus ingredientes: ${custHints.map((f) => `${f.n}=${f.c}`).join(", ")})` : "";
      let parsed;
      try { parsed = await callClaude(SYSTEM_PROMPT, `Refeição: ${meal}.${recipeCtx} ${ctx} ${prof} Alimentos disponíveis: ${selected.join(", ")}${hintStr}.${avoid} Monte a refeição respeitando o que resta do dia e o perfil aprendido.`); }
      catch (firstErr) { parsed = await callClaude(SYSTEM_PROMPT, `Refeição: ${meal}.${recipeCtx} ${ctx} Alimentos disponíveis: ${selected.join(", ")}${hintStr}. Monte a refeição. Responda SOMENTE com o JSON pedido, sem nenhum texto antes ou depois.`); }
      setResult(parsed); setLastTitulo(parsed.titulo || null); setChatMsgs([]); setMealEdited(false);
      const u = { ...usage }; selected.forEach((n) => { if (catalogByName[n]) u[n] = (u[n] || 0) + 1; }); persistUsage(u);
    } catch (e) { console.error("Erro ao montar:", e); setError("Não consegui montar agora. Tenta de novo em alguns segundos."); }
    finally { setLoading(false); }
  }
  const addResultToDay = () => { if (!result) return; addMeals([{ id: uid(), meal, titulo: result.titulo, kcal: result.calorias_estimadas || 0, source: "ai" }]); setResult(null); setSelected([]); setActiveRecipe(null); setChatMsgs([]); setMealEdited(false); setView("hoje"); };

  async function sendChat() {
    const msg = chatInput.trim(); if (!msg || !result) return;
    const next = [...chatMsgs, { role: "user", text: msg }];
    setChatMsgs(next); setChatInput(""); setChatLoading(true);
    const remaining = target - consumed;
    const sys = `Você é o coach nutricional pessoal (homem emagrecendo, meta ${target} kcal/dia, restam ${remaining} kcal hoje). Refeição atual: ${JSON.stringify({ titulo: result.titulo, itens: result.itens, calorias_estimadas: result.calorias_estimadas, prato: result.prato })}.
Se o usuário pedir QUALQUER mudança (trocar, tirar, adicionar, mudar porção, deixar mais leve/reforçada), REFAÇA a refeição de fato e recalcule itens, calorias e o prato. Estime calorias de forma REALISTA, sem subestimar cortes gordos, frituras, queijos amarelos, óleos e doces (na dúvida, arredonde pra cima).
Responda APENAS JSON: {"resposta":"mensagem curta e prática pro chat, explicando o que mudou","refeicao_atualizada": {"titulo":"...","itens":[{"alimento":"...","quantidade":"...","obs":"dica ou null"}],"calorias_estimadas":<int>,"saciedade":"Baixa|Média|Alta","dica":"...","troca":"... ou null","prato":{"proteina":<n>,"carbo":<n>,"vegetais":<n>,"feijao":<n>} ou null} ou null se não houve mudança na refeição}`;
    try {
      const txt = await callClaudeMsgs(sys, next.map((m) => ({ role: m.role === "user" ? "user" : "assistant", content: m.text })), 1000);
      let parsed; try { parsed = parseLooseJSON(txt); } catch (_) { parsed = { resposta: txt, refeicao_atualizada: null }; }
      setChatMsgs((m) => [...m, { role: "assistant", text: parsed.resposta || "Pronto, atualizei." }]);
      if (parsed.refeicao_atualizada) { setResult((prev) => ({ ...prev, ...parsed.refeicao_atualizada })); setLastTitulo(parsed.refeicao_atualizada.titulo || null); setMealEdited(true); }
    }
    catch (e) { setChatMsgs((m) => [...m, { role: "assistant", text: "Não consegui responder agora. Tenta de novo em alguns segundos." }]); }
    finally { setChatLoading(false); }
  }

  function onPhotoPick(e) {
    const file = e.target.files && e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { const url = String(reader.result); setPhotoPreview(url); setPhotoData(url.split(",")[1]); setPhotoMime(file.type || "image/jpeg"); setPhotoResult(null); };
    reader.readAsDataURL(file);
  }
  async function evalPhoto() {
    if (!photoData) return; setPhotoLoading(true); setPhotoResult(null);
    const remaining = target - consumed;
    const extra = photoText.trim() ? ` Responda também especificamente: "${photoText.trim()}".` : "";
    const sys = `Você é coach nutricional de uma pessoa emagrecendo (homem, meta ${target} kcal/dia; já consumiu ${consumed}; restam ${remaining}). Analise a FOTO do prato: estime as calorias de forma REALISTA e não otimista (inclua óleo/gordura de preparo, molhos, frituras e cortes gordos; na dúvida arredonde pra cima), diga se está adequado/exagerado/leve para o objetivo do dia e como melhorar.${extra} Responda APENAS JSON: {"titulo":"nome curto do prato","kcal_estimado":<int>,"avaliacao":"1-3 frases","sugestoes":"como melhorar, 1-2 frases"}`;
    const content = [{ type: "image", source: { type: "base64", media_type: photoMime, data: photoData } }, { type: "text", text: photoText.trim() || "Avalie meu prato para meu objetivo de emagrecimento." }];
    try { const txt = await callClaudeMsgs(sys, [{ role: "user", content }], 700); setPhotoResult(parseLooseJSON(txt)); }
    catch (e) { setPhotoResult({ titulo: "", kcal_estimado: 0, avaliacao: "Não consegui avaliar a foto agora. Tenta de novo em alguns segundos.", sugestoes: "" }); }
    finally { setPhotoLoading(false); }
  }
  const addPhotoToDay = () => { if (!photoResult) return; addMeals([{ id: uid(), meal: "Foto", titulo: photoResult.titulo || "Prato (foto)", kcal: photoResult.kcal_estimado || 0, source: "photo" }]); setPhotoResult(null); setPhotoData(null); setPhotoPreview(null); setPhotoText(""); };

  async function addManual() {
    const name = manualName.trim(); if (!name) return;
    setEstimating(true); setError(null); setManualResult(null);
    try {
      const r = await callClaude(LOGGED_PROMPT, `Refeição: ${manualMeal}. Eu comi: ${name}`, 1000);
      setManualResult(r);
    } catch (e) { setError("Não consegui calcular agora. Tenta de novo em alguns segundos."); }
    finally { setEstimating(false); }
  }
  const confirmManual = () => {
    if (!manualResult) return;
    addMeals([{ id: uid(), meal: manualMeal, titulo: manualResult.titulo, kcal: manualResult.calorias_estimadas || 0, source: "manual" }]);
    setManualResult(null); setManualName(""); setShowManual(false);
  };

  const toggleFavorite = (entry) => { const ex = favorites.find((f) => f.titulo === entry.titulo && f.kcal === entry.kcal); if (ex) persistFavorites(favorites.filter((f) => f.id !== ex.id)); else persistFavorites([...favorites, { id: uid(), meal: entry.meal, titulo: entry.titulo, kcal: entry.kcal }]); };
  const isFav = (entry) => !!favorites.find((f) => f.titulo === entry.titulo && f.kcal === entry.kcal);
  const addFavToDay = (f) => addMeals([{ id: uid(), meal: f.meal, titulo: f.titulo, kcal: f.kcal, source: "fav" }]);
  const logWeight = () => { const kg = parseFloat(weightInput.replace(",", ".")); if (!kg || kg < 30 || kg > 400) return; const next = [...weights.filter((w) => w.date !== today), { date: today, kg: Math.round(kg * 10) / 10 }].sort((a, b) => (a.date < b.date ? -1 : 1)); persistWeights(next); setWeightInput(""); };
  const toggleDark = () => { const nx = !dark; applyTheme(nx); setDark(nx); saveJSON("theme", nx); forceRender((x) => x + 1); };

  const shiftDate = (iso, d) => { const dt = new Date(iso + "T12:00:00"); dt.setDate(dt.getDate() + d); return dt.toISOString().slice(0, 10); };
  const goPrev = () => setViewDate((d) => shiftDate(d, -1));
  const goNext = () => { if (!isToday) setViewDate((d) => shiftDate(d, 1)); };
  const goToday = () => setViewDate(today);
  const applyDeficit = (d) => { const nd = Math.max(250, Math.min(750, Math.round(d))); setDeficit(nd); saveJSON("deficit", nd); setEvalResult((r) => r ? { ...r, applied: true } : r); };
  const snapshot = () => JSON.stringify({ v: 1, history, weights, favorites, usage, customFoods, deficit });
  const exportData = () => { setBackupText(snapshot()); setBackupMsg(""); };
  const copyBackup = async () => { try { await navigator.clipboard.writeText(backupText || snapshot()); setBackupMsg("Backup copiado! Guarde num lugar seguro."); } catch (e) { setBackupMsg("Selecione o texto acima e copie manualmente."); } };
  const downloadBackup = () => { try { const blob = new Blob([backupText || snapshot()], { type: "application/json" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `monta-prato-backup-${today}.json`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); } catch (e) { setBackupMsg("Não deu pra baixar aqui; use o Copiar."); } };
  const importData = () => {
    try {
      const p = JSON.parse(importText.trim());
      if (p.history) persistHistory(p.history);
      if (p.weights) persistWeights(p.weights);
      if (p.favorites) persistFavorites(p.favorites);
      if (p.usage) persistUsage(p.usage);
      if (p.customFoods) persistCustomFoods(p.customFoods);
      if (typeof p.deficit === "number") { setDeficit(p.deficit); saveJSON("deficit", p.deficit); }
      setBackupMsg("✓ Dados restaurados com sucesso!"); setImportText("");
    } catch (e) { setBackupMsg("Não consegui ler esse backup. Verifique se colou o texto completo."); }
  };
  async function askEval() {
    setEvalLoading(true); setEvalResult(null);
    try { const r = await callClaude(EVAL_PROMPT, buildEvalData(history, weights, deficit, currentWeight), 500); setEvalResult(r); }
    catch (e) { setEvalResult({ resumo: "Não consegui avaliar agora. Tenta de novo em alguns segundos.", diagnostico: "", recomendacao: "", ajuste_deficit: null }); }
    finally { setEvalLoading(false); }
  }

  const report = useMemo(() => {
    const startStr = isoDaysAgo(reportRange - 1); const inR = (d) => d >= startStr && d <= today;
    let logged = 0, totalKcal = 0, exDays = 0, mealCount = 0;
    Object.entries(history).forEach(([date, d]) => { if (!inR(date)) return; const ms = d.meals || []; if (ms.length) { logged++; totalKcal += ms.reduce((a, m) => a + (m.kcal || 0), 0); mealCount += ms.length; } if (d.dayType && d.dayType !== "parado") exDays++; });
    const wr = weights.filter((w) => inR(w.date)); const wChange = wr.length >= 2 ? Math.round((wr[wr.length - 1].kg - wr[0].kg) * 10) / 10 : null;
    return { logged, avg: logged ? Math.round(totalKcal / logged) : 0, exDays, mealCount, wChange };
  }, [history, weights, reportRange, today]);

  const totalLost = Math.round((START_WEIGHT - currentWeight) * 10) / 10;
  const toObesity = Math.max(0, Math.round((currentWeight - GOAL_OBESITY) * 10) / 10);
  const barPct = Math.max(0, Math.min(100, ((START_WEIGHT - currentWeight) / (START_WEIGHT - GOAL_NORMAL)) * 100));
  const marker87 = ((START_WEIGHT - GOAL_OBESITY) / (START_WEIGHT - GOAL_NORMAL)) * 100;
  const status = dayStatus(consumed, target);
  const waterGoal = Math.max(1500, Math.round((currentWeight * 35) / 100) * 100);
  const waterPct = Math.min(100, Math.round((water / waterGoal) * 100));
  const addWater = (ml) => patchDay({ water: Math.max(0, (water || 0) + ml) });

  const wk = useMemo(() => computeWeek(history, today, currentWeight, deficit), [history, today, currentWeight, deficit]);
  const FREE_TYPES = ["Pizza", "Hambúrguer", "Sushi", "Churrasco", "Açaí", "Sorvete", "Doce / sobremesa", "Salgados", "Lanche da rua", "Cerveja / drink"];
  async function askFreeMeal(type) {
    setFreeType(type); setFreeLoading(true); setFreeResult(null); setFreeCustom("");
    const sobraHoje = target - consumed;
    try {
      const r = await callClaude(FREEMEAL_PROMPT, `Tipo de refeição livre desejada: ${type}. Meta da semana: ${wk.wTarget} kcal. Consumido na semana: ${wk.wConsumed} kcal. Crédito acumulado (positivo = guardou; negativo = deve): ${wk.saldo} kcal. Sobra de hoje: ${sobraHoje} kcal. Diga a porção concreta desse alimento que cabe hoje.`, 200);
      setFreeResult(r);
    } catch (e) { setFreeResult({ porcao: "Não consegui calcular agora.", kcal: 0, mensagem: "Tenta de novo em alguns segundos." }); }
    finally { setFreeLoading(false); }
  }

  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const dateLabel = cap(new Date(viewDate + "T12:00:00").toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" }));
  const relLabel = isToday ? "Seu dia" : viewDate === isoDaysAgo(1) ? "Ontem" : viewDate === isoDaysAgo(2) ? "Anteontem" : cap(new Date(viewDate + "T12:00:00").toLocaleDateString("pt-BR", { weekday: "long" }));

  const NAV = [{ id: "hoje", t: "Hoje", icon: Home }, { id: "montar", t: "Montar", icon: ChefHat }, { id: "progresso", t: "Progresso", icon: LineChart }];
  const ThemeToggle = () => (
    <button onClick={toggleDark} aria-label="Alternar tema" className="press" style={{ border: `1px solid ${C.line}`, background: C.surface, borderRadius: 11, width: 40, height: 40, display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0 }}>
      {dark ? <Sun size={18} color={C.honey} /> : <Moon size={18} color={C.muted} />}
    </button>
  );

  return (
    <div style={{ background: `linear-gradient(180deg, ${C.bg1}, ${C.bg2})`, minHeight: "100vh", fontFamily: "'Inter',sans-serif", color: C.ink }}>
      <style>{FONT_LINK}</style>
      <style>{`
        .display{font-family:'Bricolage Grotesque',sans-serif}
        .mp-btn:disabled{opacity:.42;cursor:not-allowed}
        .press{transition:transform .1s ease} .press:active{transform:scale(.97)}
        @media (prefers-reduced-motion: reduce){*{transition:none!important}}
        .spin{animation:sp 1s linear infinite}@keyframes sp{to{transform:rotate(360deg)}}
        .fade{animation:fd .35s ease}@keyframes fd{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
        input::placeholder{color:${C.faint}} input:focus{border-color:${C.green}!important}
      `}</style>

      <div style={{ maxWidth: 620, margin: "0 auto", padding: "20px 16px 110px" }}>
        {view === "hoje" && (<div className="fade">
          <header style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
              <div>
                <div style={{ fontSize: 13, color: C.muted, fontWeight: 500 }}>{isToday ? dateLabel : "Vendo outro dia"}</div>
                <h1 className="display" style={{ fontSize: 28, fontWeight: 800, margin: "2px 0 0", letterSpacing: "-.02em" }}>{relLabel}</h1>
              </div>
              <ThemeToggle />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 12, background: C.surface, border: `1px solid ${C.line}`, borderRadius: 13, padding: 5 }}>
              <button onClick={goPrev} className="press" style={{ border: "none", background: C.greenTint, borderRadius: 9, width: 34, height: 34, display: "grid", placeItems: "center", cursor: "pointer" }}><ChevronLeft size={18} color={C.green} /></button>
              <div style={{ flex: 1, textAlign: "center", fontSize: 13.5, fontWeight: 600, color: C.ink }}>{isToday ? "Hoje" : dateLabel}</div>
              {!isToday && <button onClick={goToday} className="press" style={{ border: "none", background: C.greenSoft, color: C.green, borderRadius: 9, padding: "0 12px", height: 34, fontSize: 12.5, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Hoje</button>}
              <button onClick={goNext} disabled={isToday} className="press mp-btn" style={{ border: "none", background: C.greenTint, borderRadius: 9, width: 34, height: 34, display: "grid", placeItems: "center", cursor: "pointer" }}><ChevronRight size={18} color={C.green} /></button>
            </div>
          </header>

          <section style={card()}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}><CalRing consumed={consumed} target={target} /></div>
            <div style={{ marginTop: 18 }}>
              <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, marginBottom: 8 }}>Tipo do dia <span style={{ color: C.faint, fontWeight: 400 }}>· meta calculada pelo seu peso e atividade</span></div>
              <div style={{ display: "flex", gap: 8 }}>
                {DAY_TYPES.map((dt) => { const on = dayType === dt.id; const Icon = dt.icon;
                  return (<button key={dt.id} onClick={() => patchDay({ dayType: dt.id })} className="press" style={{ flex: 1, border: `1.5px solid ${on ? C.green : C.line}`, background: on ? C.greenSoft : C.surface, borderRadius: 13, padding: "10px 4px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <Icon size={17} color={on ? C.green : C.muted} /><span style={{ fontSize: 12, fontWeight: 600, color: on ? C.green : C.ink }}>{dt.label}</span><span style={{ fontSize: 10.5, color: C.muted }}>{targetFor(dt.id, currentWeight, deficit)}</span></button>);
                })}
              </div>
            </div>
          </section>

          <section style={{ ...card(), marginTop: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 7 }}><Droplets size={16} color={C.water} /><span style={badge()}>Água</span></span>
              <span style={{ fontSize: 13, color: C.muted }}><strong className="display" style={{ color: C.water, fontSize: 16 }}>{water}</strong> / {waterGoal} ml</span>
            </div>
            <div style={{ height: 10, background: C.waterSoft, borderRadius: 999, overflow: "hidden" }}><div style={{ width: `${waterPct}%`, height: "100%", background: `linear-gradient(90deg,#5AA9C7,${C.water})`, borderRadius: 999, transition: "width .4s ease" }} /></div>
            <div style={{ fontSize: 12, color: water >= waterGoal ? C.water : C.muted, fontWeight: water >= waterGoal ? 700 : 400, margin: "8px 0 12px" }}>{water >= waterGoal ? "Meta batida! 💧" : `Faltam ${waterGoal - water} ml`}</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              {[200, 300, 500].map((ml) => (<button key={ml} onClick={() => addWater(ml)} className="press" style={{ border: `1.5px solid ${C.water}`, background: C.waterSoft, color: C.water, borderRadius: 11, padding: "9px 13px", fontSize: 13.5, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4 }}><Plus size={13} />{ml}</button>))}
              {water > 0 && <button onClick={() => addWater(-Math.min(water, 200))} className="press" style={{ border: `1.5px solid ${C.line}`, background: C.surface, color: C.muted, borderRadius: 11, padding: "9px 12px", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>−200</button>}
              <input value={waterCustom} onChange={(e) => setWaterCustom(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { const v = parseInt(waterCustom); if (v > 0) { addWater(v); setWaterCustom(""); } } }} inputMode="numeric" placeholder="ml" style={{ ...inp(), width: 62, padding: "9px 10px", textAlign: "center" }} />
            </div>
          </section>

          <section style={{ ...card(), marginTop: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={badge()}>Diário {isToday ? "de hoje" : ""}</span>
              {meals.length > 0 && <span className="display" style={{ fontSize: 15, fontWeight: 800, color: C.green }}>{consumed} <span style={{ fontSize: 11, color: C.muted, fontWeight: 400 }}>kcal</span></span>}
            </div>
            {meals.length === 0 ? (
              <div style={{ textAlign: "center", padding: "18px 8px 6px" }}>
                <div style={{ width: 46, height: 46, borderRadius: 14, background: C.greenTint, display: "grid", placeItems: "center", margin: "0 auto 10px" }}><Utensils size={20} color={C.green} /></div>
                <p style={{ fontSize: 13.5, color: C.muted, margin: "0 0 14px", lineHeight: 1.5 }}>Nada registrado {isToday ? "ainda" : "nesse dia"}.<br />Monte uma refeição ou registre o que comeu.</p>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setView("montar")} className="press" style={{ ...btn(), flex: 1, gap: 7 }}><ChefHat size={16} /> Montar</button>
                  <button onClick={() => setShowManual((v) => !v)} className="press" style={{ ...btnOutline(), flex: 1, gap: 7 }}><PencilLine size={15} /> Avulso</button>
                </div>
              </div>
            ) : (
              <div style={{ marginTop: 10 }}>
                {meals.map((m, i) => (
                  <div key={m.id} style={{ padding: "10px 0", borderTop: i ? `1px solid ${C.line}` : "none" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.titulo}</div>
                        <div style={{ fontSize: 11.5, color: C.faint, display: "flex", gap: 8 }}>
                          <span>{m.meal}{m.source === "manual" ? " · avulso" : ""}</span>
                          {(m.sabor || m.saciedadeR) && <span>{m.sabor ? `😋 ${m.sabor}` : ""}{m.sabor && m.saciedadeR ? " · " : ""}{m.saciedadeR ? `🍽 ${m.saciedadeR}` : ""}</span>}
                        </div>
                      </div>
                      {editingId === m.id ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <input value={editKcal} onChange={(e) => setEditKcal(e.target.value)} inputMode="numeric" autoFocus style={{ ...inp(), width: 62, padding: "6px 8px", textAlign: "center" }} />
                          <button onClick={() => saveEditKcal(m.id)} className="press" style={{ border: "none", background: C.green, borderRadius: 8, padding: 7, cursor: "pointer" }}><Check size={15} color="#fff" /></button>
                        </div>
                      ) : (<>
                        <span style={{ fontSize: 13.5, fontWeight: 600 }}>{m.kcal}<span style={{ fontSize: 11, color: C.faint, fontWeight: 400 }}> kcal</span></span>
                        <button onClick={() => setRatingOpenId(ratingOpenId === m.id ? null : m.id)} style={iconBtn()}><Smile size={15} color={ratingOpenId === m.id ? C.green : (m.sabor || m.saciedadeR) ? C.honey : C.faint} /></button>
                        <button onClick={() => toggleFavorite(m)} style={iconBtn()}><Star size={15} color={isFav(m) ? C.honey : C.faint} fill={isFav(m) ? C.honey : "transparent"} /></button>
                        <button onClick={() => { setEditingId(m.id); setEditKcal(String(m.kcal)); }} style={iconBtn()}><Pencil size={14} color={C.faint} /></button>
                        <button onClick={() => deleteMeal(m.id)} style={iconBtn()}><Trash2 size={14} color={C.faint} /></button>
                      </>)}
                    </div>
                    {ratingOpenId === m.id && (
                      <div className="fade" style={{ marginTop: 10, background: C.greenTint, borderRadius: 12, padding: "12px 14px" }}>
                        <div style={{ fontSize: 11.5, color: C.muted, marginBottom: 10 }}>Como foi? A IA aprende com isso pra te servir melhor.</div>
                        {[{ f: "sabor", l: "Sabor 😋" }, { f: "saciedadeR", l: "Saciedade 🍽" }].map((row) => (
                          <div key={row.f} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: row.f === "sabor" ? 10 : 0 }}>
                            <span style={{ fontSize: 12.5, color: C.ink, fontWeight: 500 }}>{row.l}</span>
                            <div style={{ display: "flex", gap: 6 }}>
                              {[1, 2, 3, 4, 5].map((n) => { const on = (m[row.f] || 0) >= n;
                                return (<button key={n} onClick={() => rateMeal(m.id, row.f, n)} className="press" style={{ width: 30, height: 30, borderRadius: 8, border: `1.5px solid ${on ? C.green : C.line}`, background: on ? C.green : C.surface, color: on ? "#fff" : C.faint, fontSize: 12.5, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{n}</button>);
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {status && <div style={{ marginTop: 12, background: `${status.tone}22`, borderRadius: 13, padding: "12px 14px" }}><div style={{ fontSize: 12, fontWeight: 700, color: status.tone, marginBottom: 3 }}>Resumo do dia</div><p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.5 }}>{status.text}</p></div>}
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  <button onClick={() => setView("montar")} className="press" style={{ ...btnOutline(), flex: 1, gap: 6 }}><ChefHat size={15} /> Montar</button>
                  <button onClick={() => setShowManual((v) => !v)} className="press" style={{ ...btnOutline(), flex: 1, gap: 6 }}><PencilLine size={14} /> Avulso</button>
                </div>
              </div>
            )}
            {showManual && (
              <div className="fade" style={{ marginTop: 12, paddingTop: 14, borderTop: `1px solid ${C.line}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}><PencilLine size={15} color={C.green} /><span style={badge()}>Registrar o que comi</span></div>
                <p style={{ fontSize: 12.5, color: C.muted, margin: "0 0 10px", lineHeight: 1.5 }}>Liste os itens com as quantidades — em gramas, unidades, colheres, do jeito que for. Eu calculo as calorias de cada um.</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6, marginBottom: 8 }}>
                  {MEALS.map((m) => { const on = manualMeal === m.id;
                    return (<button key={m.id} onClick={() => setManualMeal(m.id)} className="press" style={{ border: `1.5px solid ${on ? C.green : C.line}`, background: on ? C.greenSoft : C.surface, color: on ? C.green : C.muted, borderRadius: 10, padding: "7px 2px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{m.short}</button>);
                  })}
                </div>
                <textarea value={manualName} onChange={(e) => setManualName(e.target.value)} placeholder={"Ex.:\n2 ovos fritos\n50g de cuscuz\n1 fatia de queijo coalho"} style={{ width: "100%", boxSizing: "border-box", height: 86, border: `1.5px solid ${C.line}`, borderRadius: 12, padding: "11px 13px", fontSize: 14, fontFamily: "inherit", color: C.ink, background: C.surface, outline: "none", resize: "vertical", lineHeight: 1.5 }} />
                <button onClick={addManual} className="mp-btn press" disabled={!manualName.trim() || estimating} style={{ ...btn(), width: "100%", boxSizing: "border-box", marginTop: 8, gap: 8 }}>{estimating ? <RotateCcw size={16} className="spin" /> : <Sparkles size={16} />}{estimating ? "Calculando…" : "Calcular calorias"}</button>

                {manualResult && (
                  <div className="fade" style={{ marginTop: 12, background: C.greenTint, borderRadius: 14, padding: 15 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                      <div><div style={{ fontSize: 11.5, color: C.muted, fontWeight: 600 }}>{manualMeal}</div><h3 className="display" style={{ fontSize: 18, fontWeight: 700, margin: "2px 0 0" }}>{manualResult.titulo}</h3></div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}><div className="display" style={{ fontSize: 22, fontWeight: 800, color: C.green, lineHeight: 1 }}>{manualResult.calorias_estimadas}</div><div style={{ fontSize: 11, color: C.muted }}>kcal aprox.</div></div>
                    </div>
                    {manualResult.prato && <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.line}` }}><Plate prato={manualResult.prato} /></div>}
                    <ul style={{ listStyle: "none", padding: 0, margin: "12px 0 0" }}>
                      {manualResult.itens?.map((it, i) => (
                        <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 0", borderTop: i ? `1px solid ${C.line}` : "none" }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.green, marginTop: 7, flexShrink: 0 }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <span style={{ fontWeight: 600, fontSize: 14 }}>{it.alimento}</span>
                            <span style={{ color: C.muted, fontSize: 14 }}> — {it.quantidade}</span>
                            {it.obs && it.obs !== "null" && <div style={{ fontSize: 12.5, color: C.muted, marginTop: 2 }}>{it.obs}</div>}
                          </div>
                          <span style={{ fontSize: 13.5, fontWeight: 700, color: C.green, flexShrink: 0 }}>{it.kcal}</span>
                        </li>
                      ))}
                    </ul>
                    {manualResult.saciedade && <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}><span style={{ fontSize: 12, color: C.muted }}>Saciedade:</span><span style={{ fontSize: 12, fontWeight: 700, color: satColor(manualResult.saciedade), background: `${satColor(manualResult.saciedade)}2A`, padding: "3px 10px", borderRadius: 999 }}>{manualResult.saciedade}</span></div>}
                    {manualResult.dica && <p style={{ margin: "10px 0 0", fontSize: 13, lineHeight: 1.5, color: C.muted }}>{manualResult.dica}</p>}
                    <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                      <button onClick={confirmManual} className="press" style={{ ...btn(), flex: 1, gap: 7 }}><Plus size={16} /> Adicionar ao dia</button>
                      <button onClick={() => setManualResult(null)} className="press" style={{ ...btnOutline(), gap: 6 }}>Refazer</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Avaliar por foto */}
          <section style={{ ...card(), marginTop: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}><Camera size={16} color={C.green} /><span style={badge()}>Avaliar prato por foto</span></div>
            <p style={{ fontSize: 12.5, color: C.muted, margin: "0 0 12px", lineHeight: 1.5 }}>Envie uma foto do seu prato — eu estimo as calorias e digo se está no ponto pro seu dia. Pode mandar uma pergunta junto.</p>
            {photoPreview && <img src={photoPreview} alt="prato" style={{ width: "100%", maxHeight: 220, objectFit: "cover", borderRadius: 13, marginBottom: 10 }} />}
            <label className="press" style={{ ...btnOutline(), width: "100%", boxSizing: "border-box", gap: 7, cursor: "pointer", marginBottom: 8 }}>
              <input type="file" accept="image/*" onChange={onPhotoPick} style={{ display: "none" }} />
              <Camera size={16} /> {photoPreview ? "Trocar foto" : "Escolher / tirar foto"}
            </label>
            <input value={photoText} onChange={(e) => setPhotoText(e.target.value)} placeholder="Pergunta (opcional): tá exagerado? como melhorar?" style={{ ...inp(), width: "100%", boxSizing: "border-box", marginBottom: 8 }} />
            <button onClick={evalPhoto} className="mp-btn press" disabled={!photoData || photoLoading} style={{ ...btn(), width: "100%", boxSizing: "border-box", gap: 8 }}>{photoLoading ? <RotateCcw size={16} className="spin" /> : <Sparkles size={16} />}{photoLoading ? "Analisando a foto…" : "Avaliar prato"}</button>
            {photoResult && (
              <div className="fade" style={{ marginTop: 12, background: C.greenTint, borderRadius: 13, padding: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                  <span className="display" style={{ fontSize: 17, fontWeight: 700 }}>{photoResult.titulo || "Seu prato"}</span>
                  {photoResult.kcal_estimado > 0 && <span className="display" style={{ fontSize: 20, fontWeight: 800, color: C.green, flexShrink: 0 }}>~{photoResult.kcal_estimado}</span>}
                </div>
                {photoResult.avaliacao && <p style={{ margin: "8px 0 0", fontSize: 13.5, lineHeight: 1.5, color: C.ink }}>{photoResult.avaliacao}</p>}
                {photoResult.sugestoes && <p style={{ margin: "8px 0 0", fontSize: 13, lineHeight: 1.5, color: C.muted }}><strong style={{ color: C.ink }}>Como melhorar:</strong> {photoResult.sugestoes}</p>}
                {photoResult.kcal_estimado > 0 && <button onClick={addPhotoToDay} className="press" style={{ ...btn(), width: "100%", boxSizing: "border-box", marginTop: 12, gap: 7 }}><Plus size={16} /> Adicionar ao dia</button>}
              </div>
            )}
          </section>

          {/* Banco da semana */}
          <section style={{ ...card(), marginTop: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 7 }}><Wallet size={16} color={C.green} /><span style={badge()}>Banco da semana</span></span>
              <span style={{ fontSize: 12, color: C.faint }}>seg–dom</span>
            </div>
            <p style={{ fontSize: 12.5, color: C.muted, margin: "0 0 12px", lineHeight: 1.5 }}>Pense na semana como um <strong style={{ color: C.ink }}>orçamento de calorias</strong>. Nos dias que você come abaixo da meta, sobra um <strong style={{ color: C.green }}>crédito</strong> — que pode virar uma refeição livre no fim de semana, sem atrapalhar o emagrecimento.</p>

            <div style={{ background: wk.saldo >= 0 ? C.greenSoft : C.overSoft, borderRadius: 14, padding: 14, marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: wk.saldo >= 0 ? C.green : C.over, marginBottom: 3 }}>{wk.saldo >= 0 ? "💰 Crédito guardado até agora" : "⚠️ Você está no vermelho"}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span className="display" style={{ fontSize: 30, fontWeight: 800, color: wk.saldo >= 0 ? C.green : C.over, lineHeight: 1 }}>{wk.saldo >= 0 ? `+${wk.saldo}` : wk.saldo}</span>
                <span style={{ fontSize: 13, color: C.muted }}>kcal</span>
              </div>
              <div style={{ fontSize: 12.5, color: C.muted, marginTop: 5, lineHeight: 1.5 }}>{wk.saldo >= 0 ? "Você comeu abaixo da meta até aqui. Esse é o tamanho do agrado que cabe sem furar a semana." : "Você comeu acima da meta até aqui. Segurando um pouco os próximos dias, dá pra reequilibrar."}</div>
            </div>

            <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
              <div style={{ flex: 1, background: C.greenTint, borderRadius: 12, padding: "10px 13px" }}>
                <div style={{ fontSize: 11, color: C.muted, marginBottom: 2 }}>Meta da semana</div>
                <div className="display" style={{ fontSize: 17, fontWeight: 800, color: C.ink }}>{wk.wTarget}<span style={{ fontSize: 11, color: C.muted, fontWeight: 400 }}> kcal</span></div>
              </div>
              <div style={{ flex: 1, background: C.greenTint, borderRadius: 12, padding: "10px 13px" }}>
                <div style={{ fontSize: 11, color: C.muted, marginBottom: 2 }}>Já consumido</div>
                <div className="display" style={{ fontSize: 17, fontWeight: 800, color: C.ink }}>{wk.wConsumed}<span style={{ fontSize: 11, color: C.muted, fontWeight: 400 }}> kcal</span></div>
              </div>
            </div>
            <div style={{ height: 10, background: C.greenSoft, borderRadius: 999, overflow: "hidden" }}><div style={{ width: `${Math.min(100, Math.round((wk.wConsumed / wk.wTarget) * 100))}%`, height: "100%", background: wk.wConsumed > wk.wTarget ? C.honey : GRAD, borderRadius: 999, transition: "width .4s ease" }} /></div>
            <div style={{ fontSize: 11.5, color: C.faint, marginTop: 6, marginBottom: 12, textAlign: "right" }}>{Math.min(100, Math.round((wk.wConsumed / wk.wTarget) * 100))}% do orçamento da semana usado</div>
            <button onClick={() => setFreeOpen((o) => !o)} className="press" style={{ ...btnOutline(), width: "100%", boxSizing: "border-box", gap: 8 }}><Sparkles size={16} /> Refeição livre</button>
            {freeOpen && (
              <div className="fade" style={{ marginTop: 12 }}>
                <div style={{ fontSize: 12.5, color: C.muted, marginBottom: 10 }}>Tá com vontade de quê? Eu olho o seu banco e digo a porção que cabe hoje.</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {FREE_TYPES.map((t) => { const on = freeType === t;
                    return (<button key={t} onClick={() => askFreeMeal(t)} disabled={freeLoading} className="press mp-btn" style={{ border: `1.5px solid ${on ? C.green : C.line}`, background: on ? C.greenSoft : C.surface, color: on ? C.green : C.ink, borderRadius: 999, padding: "8px 13px", fontSize: 13.5, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>{t}</button>);
                  })}
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <input value={freeCustom} onChange={(e) => setFreeCustom(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && freeCustom.trim()) askFreeMeal(freeCustom.trim()); }} placeholder="Outro (ex.: tapioca de Nutella)" style={{ ...inp(), flex: 1 }} />
                  <button onClick={() => freeCustom.trim() && askFreeMeal(freeCustom.trim())} className="mp-btn press" disabled={!freeCustom.trim() || freeLoading} style={btn()}><ArrowRight size={16} /></button>
                </div>
              </div>
            )}
            {freeLoading && <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8, color: C.muted, fontSize: 13.5 }}><RotateCcw size={16} className="spin" /> Calculando sua porção…</div>}
            {freeResult && !freeLoading && (
              <div className="fade" style={{ marginTop: 12, background: C.greenTint, borderRadius: 13, padding: "14px" }}>
                <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, marginBottom: 5 }}>{freeType}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                  <span className="display" style={{ fontSize: 18, fontWeight: 700, color: C.ink, lineHeight: 1.25 }}>{freeResult.porcao}</span>
                  {freeResult.kcal > 0 && <span className="display" style={{ fontSize: 20, fontWeight: 800, color: C.green, flexShrink: 0 }}>~{freeResult.kcal}</span>}
                </div>
                <p style={{ margin: "8px 0 0", fontSize: 13, lineHeight: 1.5, color: C.muted }}>{freeResult.mensagem}</p>
                {freeResult.kcal > 0 && <button onClick={() => { addMeals([{ id: uid(), meal: "Refeição livre", titulo: freeResult.porcao, kcal: freeResult.kcal || 0, source: "free" }]); setFreeResult(null); setFreeOpen(false); setFreeType(null); }} className="press" style={{ ...btn(), width: "100%", boxSizing: "border-box", marginTop: 12, gap: 7 }}><Plus size={16} /> Adicionar ao dia</button>}
              </div>
            )}
          </section>

          {favorites.length > 0 && (
            <section style={{ ...card(), marginTop: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}><Star size={15} color={C.honey} fill={C.honey} /><span style={badge()}>Adicionar rápido</span></div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {favorites.map((f) => (
                  <div key={f.id} style={{ display: "flex", alignItems: "center", border: `1.5px solid ${C.line}`, borderRadius: 999, overflow: "hidden" }}>
                    <button onClick={() => addFavToDay(f)} className="press" style={{ border: "none", background: C.surface, cursor: "pointer", padding: "7px 6px 7px 13px", display: "flex", alignItems: "center", gap: 7, fontFamily: "inherit", color: C.ink }}><span style={{ fontSize: 13.5, fontWeight: 500 }}>{f.titulo}</span><span style={{ fontSize: 12, color: C.muted }}>{f.kcal}</span><Plus size={15} color={C.green} /></button>
                    <button onClick={() => toggleFavorite(f)} style={{ border: "none", background: C.surface, cursor: "pointer", padding: "7px 10px 7px 4px", color: C.faint }}><X size={13} /></button>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>)}

        {view === "montar" && (<div className="fade">
          <header style={{ marginBottom: 18, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
            <div><div style={{ fontSize: 13, color: C.muted, fontWeight: 500 }}>Passo a passo</div><h1 className="display" style={{ fontSize: 28, fontWeight: 800, margin: "2px 0 0", letterSpacing: "-.02em" }}>Montar refeição</h1></div>
            <ThemeToggle />
          </header>

          {!isToday && <div style={{ marginBottom: 14, background: C.honeySoft, border: `1px solid ${C.honey}55`, borderRadius: 12, padding: "10px 14px", fontSize: 13, color: C.honey, display: "flex", alignItems: "center", gap: 8 }}><CalendarDays size={15} /> Adicionando em <strong>{dateLabel}</strong></div>}

          <section style={card()}>
            <label style={sectionLabel()}>1 · Qual refeição?</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
              {MEALS.map((m) => { const Icon = m.icon; const on = meal === m.id;
                return (<button key={m.id} onClick={() => changeMeal(m.id)} className="press" style={{ border: `1.5px solid ${on ? C.green : C.line}`, background: on ? C.greenSoft : C.surface, borderRadius: 13, padding: "12px 4px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}><Icon size={19} color={on ? C.green : C.muted} /><span style={{ fontSize: 12.5, fontWeight: 600, color: on ? C.green : C.ink }}>{m.short}</span></button>);
              })}
            </div>
          </section>

          <section style={{ ...card(), marginTop: 14 }}>
            <button onClick={() => setRecipesOpen((o) => !o)} className="press" style={{ width: "100%", border: "none", background: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: "inherit" }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: C.ink }}>2 · Receita <span style={{ fontWeight: 400, color: C.faint, fontSize: 12.5 }}>· opcional</span></span>
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>{!recipesOpen && <span style={{ fontSize: 12, color: C.muted }}>{RECIPES.filter((r) => r.meals.includes(meal)).length} opções</span>}<ChevronDown size={20} color={C.muted} style={{ transform: recipesOpen ? "rotate(180deg)" : "none", transition: "transform .2s ease" }} /></span>
            </button>
            {recipesOpen && (
              <div className="fade" style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 13 }}>
                {RECIPES.filter((r) => r.meals.includes(meal)).map((r) => { const on = activeRecipe === r.n;
                  return (<button key={r.n} onClick={() => on ? clearRecipe() : pickRecipe(r)} className="press" style={{ border: `1.5px solid ${on ? C.honey : C.line}`, background: on ? C.honeySoft : C.surface, color: on ? C.honey : C.ink, borderRadius: 999, padding: "8px 13px", fontSize: 13.5, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 6 }}><ChefHat size={14} color={on ? C.honey : C.muted} />{r.n}{on && <X size={13} strokeWidth={2.5} />}</button>);
                })}
              </div>
            )}
            {activeRecipe && <p style={{ fontSize: 12.5, color: C.honey, margin: "12px 0 0", background: C.honeySoft, padding: "9px 12px", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}><span>Montando <strong>{activeRecipe}</strong> — base já marcada.</span><button onClick={clearRecipe} style={{ border: "none", background: "none", cursor: "pointer", color: C.honey, padding: 2, display: "flex" }}><X size={15} /></button></p>}
          </section>

          <section style={{ ...card(), marginTop: 14 }}>
            <label style={sectionLabel()}>3 · O que você tem?</label>
            <div style={{ position: "relative", marginBottom: 14 }}>
              <input value={foodQuery} onChange={(e) => setFoodQuery(e.target.value)} placeholder="Buscar ingrediente…" style={{ ...inp(), width: "100%", boxSizing: "border-box", paddingLeft: 13 }} />
              {foodQuery && <button onClick={() => setFoodQuery("")} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", border: "none", background: C.greenTint, borderRadius: 8, padding: 5, cursor: "pointer", display: "flex" }}><X size={13} color={C.muted} /></button>}
            </div>
            {!foodQuery && topUsed.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11.5, color: C.faint, fontWeight: 600, marginBottom: 7, textTransform: "uppercase", letterSpacing: ".04em" }}>⭐ Mais usados</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>{topUsed.map((f) => <Chip key={f} label={f} active={selected.includes(f)} onClick={() => toggle(f)} />)}</div>
              </div>
            )}
            {CATEGORY_ORDER.filter((cat) => visibleGroups[cat]).map((cat) => (
              <div key={cat} style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11.5, color: C.faint, fontWeight: 700, marginBottom: 9, textTransform: "uppercase", letterSpacing: ".05em" }}>{cat}</div>
                {Object.keys(visibleGroups[cat]).map((sub) => {
                  const items = visibleGroups[cat][sub];
                  const open = q ? true : isSubOpen(cat, sub);
                  const selCount = items.filter((n) => selected.includes(n)).length;
                  return (
                    <div key={sub} style={{ marginBottom: 8 }}>
                      <button onClick={() => toggleSub(cat, sub)} className="press" style={{ width: "100%", border: `1px solid ${selCount > 0 ? C.green : C.line}`, background: open ? C.greenTint : C.surface, borderRadius: 11, padding: "9px 12px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: "inherit" }}>
                        <span style={{ fontSize: 13.5, fontWeight: 600, color: C.ink }}>{sub} <span style={{ color: C.faint, fontWeight: 400 }}>({items.length})</span>{selCount > 0 && <span style={{ color: C.green, fontWeight: 700 }}> · {selCount} ✓</span>}</span>
                        <ChevronDown size={17} color={C.muted} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s ease" }} />
                      </button>
                      {open && <div className="fade" style={{ display: "flex", flexWrap: "wrap", gap: 7, padding: "10px 2px 4px" }}>{items.map((f) => <Chip key={f} label={f} active={selected.includes(f)} onClick={() => toggle(f)} />)}</div>}
                    </div>
                  );
                })}
              </div>
            ))}
            {q && Object.keys(visibleGroups).length === 0 && <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>Nada encontrado. Você pode adicionar como ingrediente abaixo.</p>}
            <div style={{ marginTop: 6 }}>
              <div style={{ fontSize: 12.5, color: C.muted, marginBottom: 8 }}>Adicionar meu ingrediente <span style={{ color: C.faint }}>· escolha a categoria e ele fica salvo</span></div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                {[["Proteínas", "Proteína"], ["Carboidratos", "Carbo"], ["Vegetais", "Vegetal"], ["Frutas", "Fruta"], ["Outros", "Outro"]].map(([full, short]) => { const on = newFoodCat === full;
                  return (<button key={full} onClick={() => setNewFoodCat(full)} className="press" style={{ border: `1.5px solid ${on ? C.green : C.line}`, background: on ? C.greenSoft : C.surface, color: on ? C.green : C.muted, borderRadius: 999, padding: "6px 12px", fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{short}</button>);
                })}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <input value={custom} onChange={(e) => setCustom(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addCustom()} placeholder="Ex.: presunto, whey, tapioca doce…" style={{ ...inp(), flex: 1 }} />
                <button onClick={addCustom} className="mp-btn press" disabled={!custom.trim()} style={btn()}><Plus size={16} /></button>
              </div>
            </div>
            {customFoods.length > 0 && (
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 11.5, color: C.faint, fontWeight: 600, marginBottom: 7, textTransform: "uppercase", letterSpacing: ".04em" }}>Meus ingredientes salvos</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {customFoods.map((f) => (
                    <span key={f.id} style={{ display: "inline-flex", alignItems: "center", gap: 7, border: `1.5px solid ${C.line}`, background: C.surface, color: C.ink, borderRadius: 999, padding: "6px 8px 6px 13px", fontSize: 13.5 }}>
                      <span>{f.n} <span style={{ color: C.faint, fontSize: 11.5 }}>{({ Proteínas: "prot", Carboidratos: "carbo", Vegetais: "veg", Frutas: "fruta", Outros: "outro" })[f.c] || ""}{f.kcal ? ` · ~${f.kcal}kcal` : ""}</span></span>
                      <button onClick={() => removeCustomFood(f.id)} aria-label="Remover" style={{ border: "none", background: C.greenTint, borderRadius: 999, width: 19, height: 19, display: "grid", placeItems: "center", cursor: "pointer" }}><X size={11} color={C.muted} /></button>
                    </span>
                  ))}
                </div>
              </div>
            )}
            {selected.length > 0 && <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 7, alignItems: "center" }}><span style={{ fontSize: 12.5, color: C.muted }}>Selecionados:</span>{selected.map((f) => <Chip key={f} label={f} active onClick={() => toggle(f)} />)}</div>}
          </section>

          <button onClick={() => montar(false)} className="mp-btn press" disabled={selected.length === 0 || loading} style={{ marginTop: 16, width: "100%", border: "none", background: GRAD, color: "#fff", borderRadius: 15, padding: "16px", fontSize: 15.5, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 9, fontFamily: "'Bricolage Grotesque',sans-serif", boxShadow: "0 6px 18px rgba(31,78,57,.3)" }}>{loading ? <RotateCcw size={18} className="spin" /> : <Sparkles size={18} />}{loading ? "Montando…" : "Montar refeição"}</button>
          {error && <div style={{ marginTop: 14, background: C.overSoft, border: `1px solid ${C.over}55`, color: C.over, padding: "12px 14px", borderRadius: 12, fontSize: 14 }}>{error}</div>}

          {result && (
            <section className="fade" style={{ ...card(), marginTop: 16, border: `1.5px solid ${C.green}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <div><div style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>{meal}{mealEdited && <span style={{ marginLeft: 8, color: C.honey, fontWeight: 700 }}>✏️ ajustada</span>}</div><h2 className="display" style={{ fontSize: 21, fontWeight: 700, margin: "2px 0 0", letterSpacing: "-.01em" }}>{result.titulo}</h2>
                  {(() => { const after = target - consumed - (result.calorias_estimadas || 0); return (<span style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 7, fontSize: 11.5, fontWeight: 600, color: after >= 0 ? C.green : C.honey, background: after >= 0 ? C.greenSoft : C.honeySoft, padding: "3px 10px", borderRadius: 999 }}>{after >= 0 ? `Cabe no dia · sobram ${after} kcal` : `Passa ${Math.abs(after)} kcal do dia`}</span>); })()}
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}><div className="display" style={{ fontSize: 25, fontWeight: 800, color: C.green, lineHeight: 1 }}>{result.calorias_estimadas}</div><div style={{ fontSize: 11.5, color: C.muted }}>kcal aprox.</div></div>
              </div>
              {result.prato && <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${C.line}` }}><Plate prato={result.prato} /></div>}
              <ul style={{ listStyle: "none", padding: 0, margin: "16px 0 0" }}>
                {result.itens?.map((it, i) => (<li key={i} style={{ display: "flex", gap: 11, padding: "9px 0", borderTop: i ? `1px solid ${C.line}` : "none" }}><span style={{ width: 7, height: 7, borderRadius: "50%", background: C.green, marginTop: 7, flexShrink: 0 }} /><div><span style={{ fontWeight: 600, fontSize: 14.5 }}>{it.alimento}</span><span style={{ color: C.green, fontWeight: 600, fontSize: 14.5 }}> — {it.quantidade}</span>{it.obs && it.obs !== "null" && <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>{it.obs}</div>}</div></li>))}
              </ul>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}><span style={{ fontSize: 12.5, color: C.muted }}>Saciedade:</span><span style={{ fontSize: 12.5, fontWeight: 700, color: satColor(result.saciedade), background: `${satColor(result.saciedade)}2A`, padding: "3px 10px", borderRadius: 999 }}>{result.saciedade}</span></div>
              {result.dica && <div style={{ marginTop: 14, background: C.honeySoft, borderRadius: 12, padding: "12px 14px", display: "flex", gap: 10 }}><Info size={17} color={C.honey} style={{ flexShrink: 0, marginTop: 1 }} /><p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.5, color: C.ink }}>{result.dica}</p></div>}
              {result.troca && result.troca !== "null" && <div style={{ marginTop: 10, background: C.greenTint, borderRadius: 12, padding: "12px 14px", display: "flex", gap: 10, alignItems: "flex-start" }}><ArrowRight size={16} color={C.green} style={{ flexShrink: 0, marginTop: 2 }} /><div><div style={{ fontSize: 11.5, fontWeight: 700, color: C.green, marginBottom: 2 }}>Pra deixar mais leve</div><p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.5, color: C.ink }}>{result.troca}</p></div></div>}
              <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                <button onClick={addResultToDay} className="press" style={{ ...btn(), flex: 1, gap: 7 }}><Plus size={16} /> Adicionar ao dia</button>
                <button onClick={() => toggleFavorite({ meal, titulo: result.titulo, kcal: result.calorias_estimadas })} className="press" style={{ ...btnOutline(), padding: "10px 13px" }}><Star size={17} color={C.honey} fill={isFav({ meal, titulo: result.titulo, kcal: result.calorias_estimadas }) ? C.honey : "transparent"} /></button>
                <button onClick={() => montar(true)} className="mp-btn press" disabled={loading} style={{ ...btnOutline(), gap: 7 }}><RotateCcw size={15} className={loading ? "spin" : ""} /> Outra</button>
              </div>
              <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${C.line}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}><MessageCircle size={15} color={C.green} /><span style={badge()}>Perguntar ou ajustar</span></div>
                {chatMsgs.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 10 }}>
                    {chatMsgs.map((m, i) => (<div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "88%", background: m.role === "user" ? C.green : C.greenTint, color: m.role === "user" ? "#fff" : C.ink, borderRadius: 14, padding: "9px 13px", fontSize: 13.5, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{m.text}</div>))}
                    {chatLoading && <div style={{ alignSelf: "flex-start", color: C.muted, fontSize: 13, display: "flex", gap: 6, alignItems: "center" }}><RotateCcw size={14} className="spin" /> pensando…</div>}
                  </div>
                )}
                <div style={{ display: "flex", gap: 8 }}>
                  <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendChat()} placeholder="Ex.: pode trocar o arroz? tá muito pesado?" style={{ ...inp(), flex: 1 }} />
                  <button onClick={sendChat} className="mp-btn press" disabled={!chatInput.trim() || chatLoading} style={btn()}><Send size={16} /></button>
                </div>
              </div>
            </section>
          )}
        </div>)}

        {view === "progresso" && (<div className="fade">
          <header style={{ marginBottom: 18, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
            <div><div style={{ fontSize: 13, color: C.muted, fontWeight: 500 }}>Sua jornada</div><h1 className="display" style={{ fontSize: 28, fontWeight: 800, margin: "2px 0 0", letterSpacing: "-.02em" }}>Meu progresso</h1></div>
            <ThemeToggle />
          </header>

          <section style={card()}>
            <span style={badge()}>Peso atual</span>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 12, marginTop: 8 }}>
              <span className="display" style={{ fontSize: 44, fontWeight: 800, lineHeight: 1 }}>{currentWeight}</span><span style={{ fontSize: 16, color: C.muted, marginBottom: 6 }}>kg</span>
              {totalLost > 0 && <span style={{ marginBottom: 7, marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 5, fontSize: 14.5, fontWeight: 700, color: C.green, background: C.greenSoft, padding: "4px 11px", borderRadius: 999 }}><TrendingDown size={16} /> −{totalLost} kg</span>}
            </div>
            <div style={{ marginTop: 18, position: "relative", height: 10, background: C.greenSoft, borderRadius: 999 }}><div style={{ width: `${barPct}%`, height: "100%", background: GRAD, borderRadius: 999, transition: "width .5s ease" }} /><div style={{ position: "absolute", left: `${marker87}%`, top: -4, width: 2.5, height: 18, background: C.honey, borderRadius: 2 }} /></div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: C.muted, marginTop: 6 }}><span>Início {START_WEIGHT}</span><span style={{ color: C.honey, fontWeight: 600 }}>87 · sair da obesidade</span><span>{GOAL_NORMAL}</span></div>
            <p style={{ fontSize: 13.5, margin: "14px 0 0", lineHeight: 1.5 }}>{toObesity > 0 ? <>Faltam <strong style={{ color: C.green }}>{toObesity} kg</strong> para sair da faixa de obesidade. Foco aqui primeiro.</> : <>Você saiu da faixa de obesidade. Próxima parada: peso saudável. 🎉</>}</p>
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <input value={weightInput} onChange={(e) => setWeightInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && logWeight()} inputMode="decimal" placeholder="Peso de hoje (kg)" style={{ ...inp(), flex: 1 }} />
              <button onClick={logWeight} className="mp-btn press" disabled={!weightInput.trim()} style={btn()}>Registrar</button>
            </div>
            <p style={{ fontSize: 11.5, color: C.faint, margin: "8px 0 0" }}>Pese-se 1x por semana, de manhã em jejum. A tendência importa mais que o dia isolado.</p>
          </section>

          <section style={{ ...card(), marginTop: 14 }}><span style={badge()}>Evolução do peso</span><WeightChart data={weights} /></section>

          <section style={{ ...card(), marginTop: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <span style={badge()}>Relatório</span>
              <div style={{ display: "flex", gap: 4, background: C.greenTint, borderRadius: 10, padding: 3 }}>
                {[{ n: 7, t: "Semana" }, { n: 30, t: "Mês" }].map((r) => (<button key={r.n} onClick={() => setReportRange(r.n)} style={{ border: "none", background: reportRange === r.n ? C.surface : "transparent", color: reportRange === r.n ? C.green : C.muted, borderRadius: 8, padding: "6px 15px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", boxShadow: reportRange === r.n ? "0 1px 3px rgba(0,0,0,.08)" : "none" }}>{r.t}</button>))}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Stat label="Dias registrados" value={`${report.logged}`} sub={`de ${reportRange}`} />
              <Stat label="Média por dia" value={report.avg ? `${report.avg}` : "—"} sub="kcal" />
              <Stat label="Dias de exercício" value={`${report.exDays}`} sub="ativo" />
              <Stat label="Variação de peso" value={report.wChange === null ? "—" : `${report.wChange > 0 ? "+" : ""}${report.wChange}`} sub="kg" tone={report.wChange !== null && report.wChange < 0 ? C.green : C.ink} />
            </div>
            <p style={{ fontSize: 13, color: C.muted, margin: "14px 0 0", lineHeight: 1.5 }}>{report.logged === 0 ? "Comece a registrar refeições para ver seus números aqui." : `No período: ${report.mealCount} refeições registradas. ${report.avg && report.avg <= 2300 ? "Média dentro do alvo — bom trabalho." : "Média um pouco acima do alvo; dá pra ajustar aos poucos."}`}</p>
          </section>

          <section style={{ ...card(), marginTop: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}><Sparkles size={16} color={C.green} /><span style={badge()}>Avaliação do coach</span></div>
            <p style={{ fontSize: 13, color: C.muted, margin: "0 0 12px", lineHeight: 1.5 }}>A IA olha suas últimas semanas — peso, calorias, constância — e diz se o processo está no rumo ou se vale ajustar a meta.</p>
            <button onClick={askEval} className="mp-btn press" disabled={evalLoading} style={{ ...btn(), width: "100%", boxSizing: "border-box", gap: 8 }}>{evalLoading ? <RotateCcw size={16} className="spin" /> : <Sparkles size={16} />}{evalLoading ? "Analisando…" : "Avaliar meu progresso"}</button>
            {evalResult && (
              <div className="fade" style={{ marginTop: 14 }}>
                <p style={{ margin: "0 0 10px", fontSize: 14.5, fontWeight: 600, lineHeight: 1.45 }}>{evalResult.resumo}</p>
                {evalResult.diagnostico && <div style={{ marginBottom: 10 }}><div style={{ fontSize: 11.5, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".04em", marginBottom: 3 }}>Diagnóstico</div><p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.5, color: C.ink }}>{evalResult.diagnostico}</p></div>}
                {evalResult.recomendacao && <div style={{ marginBottom: 4 }}><div style={{ fontSize: 11.5, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".04em", marginBottom: 3 }}>Recomendação</div><p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.5, color: C.ink }}>{evalResult.recomendacao}</p></div>}
                {evalResult.ajuste_deficit && evalResult.ajuste_deficit !== deficit && (
                  <div style={{ marginTop: 12, background: C.greenTint, borderRadius: 13, padding: "14px" }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 4 }}>Ajuste sugerido de meta</div>
                    <div style={{ fontSize: 13, color: C.muted, marginBottom: 4 }}>Déficit: <strong style={{ color: C.ink }}>{deficit}</strong> → <strong style={{ color: C.green }}>{evalResult.ajuste_deficit}</strong> kcal/dia · nova meta parado ~{targetFor("parado", currentWeight, evalResult.ajuste_deficit)} kcal</div>
                    {evalResult.motivo_ajuste && evalResult.motivo_ajuste !== "null" && <p style={{ margin: "0 0 10px", fontSize: 12.5, color: C.muted, lineHeight: 1.5 }}>{evalResult.motivo_ajuste}</p>}
                    {evalResult.applied ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 7, color: C.green, fontSize: 13.5, fontWeight: 700 }}><Check size={16} /> Ajuste aplicado</div>
                    ) : (
                      <button onClick={() => applyDeficit(evalResult.ajuste_deficit)} className="press" style={{ ...btn(), width: "100%", boxSizing: "border-box", gap: 7 }}><Check size={16} /> Aplicar novo ajuste</button>
                    )}
                  </div>
                )}
              </div>
            )}
          </section>

          <section style={{ ...card(), marginTop: 14 }}>
            <button onClick={() => setShowBackup((o) => !o)} className="press" style={{ width: "100%", border: "none", background: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: "inherit" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 7 }}><Download size={15} color={C.green} /><span style={badge()}>Backup dos meus dados</span></span>
              <ChevronDown size={20} color={C.muted} style={{ transform: showBackup ? "rotate(180deg)" : "none", transition: "transform .2s ease" }} />
            </button>
            {showBackup && (
              <div className="fade" style={{ marginTop: 14 }}>
                <p style={{ fontSize: 12.5, color: C.muted, margin: "0 0 12px", lineHeight: 1.5 }}>Antes de atualizar/publicar uma versão nova, <strong>gere o backup e copie</strong>. Na versão nova, cole em "Restaurar" — assim você nunca perde refeições, pesos, favoritos e ingredientes.</p>
                <button onClick={exportData} className="press" style={{ ...btn(), width: "100%", boxSizing: "border-box", gap: 7 }}><Download size={16} /> Gerar backup</button>
                {backupText && (<>
                  <textarea readOnly value={backupText} onFocus={(e) => e.target.select()} style={{ width: "100%", boxSizing: "border-box", height: 80, marginTop: 10, border: `1.5px solid ${C.line}`, borderRadius: 12, padding: "10px 12px", fontSize: 11.5, fontFamily: "monospace", color: C.ink, background: C.surface, resize: "vertical" }} />
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <button onClick={copyBackup} className="press" style={{ ...btnOutline(), flex: 1, gap: 6 }}>Copiar</button>
                    <button onClick={downloadBackup} className="press" style={{ ...btnOutline(), flex: 1, gap: 6 }}>Baixar arquivo</button>
                  </div>
                </>)}
                <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${C.line}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}><Upload size={15} color={C.green} /><span style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>Restaurar de um backup</span></div>
                  <textarea value={importText} onChange={(e) => setImportText(e.target.value)} placeholder="Cole aqui o texto do backup…" style={{ width: "100%", boxSizing: "border-box", height: 70, border: `1.5px solid ${C.line}`, borderRadius: 12, padding: "10px 12px", fontSize: 11.5, fontFamily: "monospace", color: C.ink, background: C.surface, resize: "vertical" }} />
                  <button onClick={importData} className="mp-btn press" disabled={!importText.trim()} style={{ ...btn(), width: "100%", boxSizing: "border-box", marginTop: 8, gap: 7 }}><Upload size={16} /> Restaurar dados</button>
                </div>
                {backupMsg && <p style={{ fontSize: 12.5, color: C.green, fontWeight: 600, margin: "10px 0 0" }}>{backupMsg}</p>}
              </div>
            )}
          </section>

          <p style={{ marginTop: 20, fontSize: 11.5, color: C.faint, textAlign: "center", lineHeight: 1.5 }}>Estimativas aproximadas. Não substitui acompanhamento médico ou nutricional. Seus dados ficam salvos na sua conta.</p>
        </div>)}
        <div style={{ textAlign: "center", marginTop: 6, fontSize: 10.5, color: C.faint }}>Monta Prato · {BUILD}</div>
      </div>

      <nav style={{ position: "fixed", left: 0, right: 0, bottom: 0, background: dark ? "rgba(25,35,30,.9)" : "rgba(255,255,255,.9)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", borderTop: `1px solid ${C.line}`, zIndex: 50 }}>
        <div style={{ maxWidth: 620, margin: "0 auto", display: "flex", padding: "8px 12px calc(10px + env(safe-area-inset-bottom))" }}>
          {NAV.map((n) => { const on = view === n.id; const Icon = n.icon;
            return (<button key={n.id} onClick={() => setView(n.id)} className="press" style={{ flex: 1, border: "none", background: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "4px 0", fontFamily: "inherit" }}>
              <div style={{ display: "grid", placeItems: "center", width: 46, height: 30, borderRadius: 10, background: on ? C.greenSoft : "transparent", transition: "background .2s ease" }}><Icon size={20} color={on ? C.green : C.faint} strokeWidth={on ? 2.4 : 2} /></div>
              <span style={{ fontSize: 11, fontWeight: on ? 700 : 500, color: on ? C.green : C.faint }}>{n.t}</span></button>);
          })}
        </div>
      </nav>
    </div>
  );
}

function Stat({ label, value, sub, tone }) {
  return (<div style={{ background: C.greenTint, borderRadius: 13, padding: "13px 15px" }}><div style={{ fontSize: 11.5, color: C.muted, marginBottom: 5 }}>{label}</div><div style={{ display: "flex", alignItems: "baseline", gap: 5 }}><span className="display" style={{ fontSize: 23, fontWeight: 800, color: tone || C.ink }}>{value}</span><span style={{ fontSize: 12, color: C.muted }}>{sub}</span></div></div>);
}
function card() { return { background: C.surface, border: `1px solid ${C.line}`, borderRadius: 20, padding: "18px", boxShadow: "0 3px 14px rgba(27,40,35,.05)" }; }
function badge() { return { fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".06em" }; }
function sectionLabel() { return { display: "block", fontSize: 14, fontWeight: 700, color: C.ink, marginBottom: 11 }; }
function inp() { return { border: `1.5px solid ${C.line}`, borderRadius: 12, padding: "11px 13px", fontSize: 14, fontFamily: "inherit", color: C.ink, outline: "none", background: C.surface, transition: "border-color .15s ease" }; }
function btn() { return { border: "none", background: GRAD, color: "#fff", borderRadius: 12, padding: "11px 15px", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }; }
function btnOutline() { return { border: `1.5px solid ${C.green}`, background: C.surface, color: C.green, borderRadius: 12, padding: "10px 14px", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }; }
function iconBtn() { return { border: "none", background: "none", cursor: "pointer", padding: 5, display: "grid", placeItems: "center", borderRadius: 8 }; }
