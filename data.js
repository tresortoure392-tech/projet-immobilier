/**
 * BouohServices – Couche de données partagée
 * index.html (site public) <–> admin.html (administration)
 * Sync en temps réel via localStorage + StorageEvent
 */

const BOUOH_KEY = 'bouohservices_data';

const DEFAULT_DATA = {
  biens: [
    { id:1, titre:'Villa F5 avec Jardin', type:'maison', prix:45000000, loc:'Katiola, Centre-ville', desc:'Magnifique villa de 5 pièces avec jardin arborisé, garage double. Titre foncier disponible.', statut:'actif', superficie:300, pieces:5, ref:'BS-IMM-001', images:[], date:'20/05/2026', featured:true },
    { id:2, titre:'Terrain Viabilisé 500m²', type:'terrain', prix:8000000, loc:'Katiola, Quartier Nord', desc:'Terrain plat et bien orienté, entièrement viabilisé. Documentation complète.', statut:'actif', superficie:500, pieces:0, ref:'BS-TER-001', images:[], date:'21/05/2026', featured:true },
    { id:3, titre:'Appartement F3 Moderne', type:'appartement', prix:250000, loc:'Katiola, Résidence les Pins', desc:'Appartement moderne 3 pièces, 2ème étage, cuisine équipée, balcon. Loyer mensuel.', statut:'loue', superficie:85, pieces:3, ref:'BS-APT-001', images:[], date:'22/05/2026', featured:false }
  ],
  vehicules: [
    { id:10, marque:'Toyota', modele:'Hilux Double Cab', annee:2021, offre:'vente', prixVente:12500000, prixLocation:0, couleur:'Blanc Perle', carburant:'Diesel', km:45000, desc:'Excellent état. Première main, entretien régulier. Climatisation, GPS, caméra de recul.', statut:'actif', images:[], date:'22/05/2026', featured:true },
    { id:11, marque:'Honda', modele:'CB 125F', annee:2023, offre:'location', prixVente:0, prixLocation:5000, couleur:'Rouge', carburant:'Essence', km:8000, desc:'Moto économique pour déplacements en ville. Entretien récent, pneus neufs.', statut:'actif', images:[], date:'23/05/2026', featured:false }
  ],
  visiteurs: [],
  messages: [],
  commandes: [],   // ← NOUVEAU : commandes clients
  assurances: [],
  parametres: {
    nom:'BouohServices', adresse:"Katiola, feu de la mosquée", quartier:"Face au siège PDCI-RDA",
    ville:"Katiola, Côte d'Ivoire", tel1:'07 68 689 072', tel2:'01 73 91 92 25',
    whatsapp:'2250768689072', email:'', slogan:"Votre satisfaction, notre priorité !",
    horaires:'Lun – Sam : 8h00 – 18h00 | Dim : Sur rendez-vous',
    facebook:'#', instagram:'#', tiktok:'#'
  }
};

const BouohData = {
  load() {
    try {
      const raw = localStorage.getItem(BOUOH_KEY);
      if (raw) {
        const p = JSON.parse(raw);
        return { ...DEFAULT_DATA, ...p, parametres:{ ...DEFAULT_DATA.parametres, ...(p.parametres||{}) }, commandes: p.commandes || [] };
      }
    } catch(e) {}
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  },
  save(data) {
    try {
      localStorage.setItem(BOUOH_KEY, JSON.stringify(data));
      window.dispatchEvent(new StorageEvent('storage', { key:BOUOH_KEY, newValue:JSON.stringify(data), storageArea:localStorage }));
    } catch(e) { console.error('BouohData.save:', e); }
  },
  reset() { const d=JSON.parse(JSON.stringify(DEFAULT_DATA)); this.save(d); return d; },
  addMessage(msg) { const d=this.load(); d.messages.push({ id:Date.now(), ...msg, statut:'pending', date:new Date().toLocaleDateString('fr-FR') }); this.save(d); },
  addVisiteur(v) { const d=this.load(); d.visiteurs.push({ id:Date.now(), ...v, statut:'pending', date:new Date().toLocaleDateString('fr-FR') }); this.save(d); },
  /** Enregistre une commande depuis le site public */
  addCommande(cmd) {
    const d = this.load();
    d.commandes.push({
      id: Date.now(),
      ...cmd,
      statut: 'attente',   // attente | confirme | annule
      dateCmd: new Date().toLocaleDateString('fr-FR'),
      heureCmd: new Date().toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' })
    });
    this.save(d);
  }
};
