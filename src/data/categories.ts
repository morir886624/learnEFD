import { CategoryInfo } from '../types/phrase';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'greetings',
    labelFr: 'Salutations & Présentations',
    labelEn: 'Greetings & Introductions',
    labelDari: 'سلام و معرفی',
    icon: 'smile',
    color: '#3B82F6', // Blue
    description: 'Les bases incontournables pour faire connaissance et saluer poliment.',
  },
  {
    id: 'daily',
    labelFr: 'Vie Quotidienne & Routine',
    labelEn: 'Daily Life & Routine',
    labelDari: 'زندگی روزمره',
    icon: 'coffee',
    color: '#10B981', // Emerald
    description: 'Exprimer les heures, ses habitudes quotidiennes et sa journée.',
  },
  {
    id: 'travel',
    labelFr: 'Transports & Déplacements',
    labelEn: 'Transport & Travel',
    labelDari: 'سفر و ترانسپورت',
    icon: 'navigation',
    color: '#F59E0B', // Amber
    description: 'Prendre le métro, le bus, demander son chemin et acheter un billet.',
  },
  {
    id: 'food',
    labelFr: 'Restaurant & Alimentation',
    labelEn: 'Food & Dining',
    labelDari: 'غذا و رستورانت',
    icon: 'utensils',
    color: '#EF4444', // Red
    description: 'Commander au restaurant, faire les courses et parler de cuisine.',
  },
  {
    id: 'shopping',
    labelFr: 'Achats & Boutiques',
    labelEn: 'Shopping & Stores',
    labelDari: 'خرید و دکان‌ها',
    icon: 'shopping-bag',
    color: '#8B5CF6', // Purple
    description: 'Demander un prix, essayer un vêtement, payer par carte.',
  },
  {
    id: 'emergency',
    labelFr: 'Santé & Urgences',
    labelEn: 'Health & Emergencies',
    labelDari: 'صحت و موارد عاجل',
    icon: 'activity',
    color: '#EC4899', // Pink
    description: 'Consulter un médecin, aller à la pharmacie, appeler à l’aide.',
  },
  {
    id: 'work',
    labelFr: 'Travail & Professionnel',
    labelEn: 'Work & Professional',
    labelDari: 'کار و محیط مسلکی',
    icon: 'briefcase',
    color: '#0EA5E9', // Sky blue
    description: 'Entretiens d’embauche, e-mails pro, réunions et collaboration.',
  },
  {
    id: 'social',
    labelFr: 'Conversation & Opinions',
    labelEn: 'Conversation & Opinions',
    labelDari: 'گفتگو و نظرات',
    icon: 'message-circle',
    color: '#14B8A6', // Teal
    description: 'Donner son avis, exprimer un accord/désaccord et débattre (B1).',
  },
  {
    id: 'admin',
    labelFr: 'Démarches & Logement',
    labelEn: 'Housing & Administration',
    labelDari: 'امور اداری و مسکن',
    icon: 'home',
    color: '#6366F1', // Indigo
    description: 'Visiter un appartement, ouvrir un compte bancaire, démarches.',
  },
];
