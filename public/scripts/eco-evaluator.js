var lang = "en";

var UI = {
  subtitle:   { en: "Tool provided to attendees to assess an event's environmental impact", fr: "Outil mis à disposition des visiteurs pour évaluer l'impact environnemental d'un événement", kr: "Zoutil mèt a dispozision bann viziter pou évalu impact anviwònman an évènement", es: "Herramienta puesta a disposición de los asistentes para evaluar el impacto ambiental de un evento" },
  scoreLabel: { en: "25 criteria × 4 pts each", fr: "25 critères × 4 pts chacun", kr: "25 kritè × 4 pwen chak", es: "25 criterios × 4 pts cada uno" },
  gradeA:     { en: "80–100 Exemplary", fr: "80–100 Exemplaire", kr: "80–100 Ekzanplè", es: "80–100 Ejemplar" },
  gradeB:     { en: "60–79 Good", fr: "60–79 Bon", kr: "60–79 Bon", es: "60–79 Bueno" },
  gradeC:     { en: "40–59 Progressing", fr: "40–59 En progression", kr: "40–59 An pwogrè", es: "40–59 En progreso" },
  gradeD:     { en: "20–39 Early stage", fr: "20–39 Débutant", kr: "20–39 Debutan", es: "20–39 Fase inicial" },
  resetBtn:   { en: "Reset all", fr: "Tout réinitialiser", kr: "Reinisyalize tout", es: "Reiniciar todo" }
};

var CRITERIA = [
  {
    key: "emissions", icon: "💨",
    label: { en: "Emissions", fr: "Émissions", kr: "Emisyon", es: "Emisiones" },
    criteria: [
      { key: "attendeeTransport",
        label: { en: "Shared transport organized and promoted", fr: "Transport partagé organisé et communiqué", kr: "Transpò patajé òganize ak kominikasyon", es: "Transporte compartido organizado y comunicado" },
        tip: { en: "Organize at least one shared-transport option (shuttle, carpool, carsharing, transit) and promote it on every ticket — attendee travel is the single biggest emission source.", fr: "Organisez au moins une option de transport partagé (navette, covoiturage, autopartage, transports) et affichez-la sur chaque billet — le trajet du public est la première source d'émissions.", kr: "Òganize omwen yon opsyon transpò patajé (navèt, kovwatiraj, otopataj, transpò an komen) epi pibliye li sou chak tikèt — vwayaj piblik la se premye sous emisyon.", es: "Organiza al menos una opción de transporte compartido (lanzadera, coche compartido, carsharing, transporte público) y anúnciala en cada entrada — el viaje del público es la mayor fuente de emisiones. }
      },
      { key: "renewableEnergy",
        label: { en: "Renewable or grid energy (no diesel generators)", fr: "Énergie renouvelable ou réseau (sans groupes électrogènes)", kr: "Énerji renouvlab oswa rezo (san jeneratè)", es: "Energía renovable o de red (sin generadores)" },
        tip: { en: "Use grid power or rent solar/battery generators — diesel gensets are the top on-site emission source.", fr: "Utilisez le réseau électrique ou louez des générateurs solaires/batteries — les groupes diesel sont la première source d'émissions sur site.", kr: "Itilize kouran rezo a oswa lwe jeneratè solè/batri — jeneratè dyèzèl se premye sous emisyon sou sit.", es: "Usa la red eléctrica o alquila generadores solares/batería — los grupos diésel son la mayor fuente de emisiones in situ." }
      },
      { key: "carbonOffset",
        label: { en: "Carbon offset programme", fr: "Programme de compensation carbone", kr: "Pwogram konpansasyon kabòn", es: "Programa de compensación de carbono" },
        tip: { en: "Offset unavoidable emissions (artist flights, freight) via a Gold Standard/VCS scheme funded by a €1–2 ticket levy; publish the tonnes.", fr: "Compensez les émissions inévitables (vols des artistes, fret) via un programme Gold Standard/VCS financé par 1–2 € par billet ; publiez les tonnes.", kr: "Konpanse emisyon inevitab yo (vòl artis, fret) atravè yon pwogram Gold Standard/VCS ki finanse pa 1–2 € pa tikèt ; pibliye tòn yo.", es: "Compensa las emisiones inevitables (vuelos de artistas, fletes) con un programa Gold Standard/VCS financiado con 1–2 € por entrada; publica las toneladas." }
      },
      { key: "localHeadliners",
        label: { en: "Headliners don't require long-haul flights", fr: "Les têtes d'affiche n'arrivent pas par long-courrier", kr: "Tèt afich yo pa vwayaje pa avyon long-kouri", es: "Los cabeza de cartel no requieren vuelos de larga distancia" },
        tip: { en: "Prioritise Caribbean/regional artists — a transatlantic act + crew can equal a 2,000-person festival's ground transport.", fr: "Privilégiez les artistes caribéens/régionaux — un artiste transatlantique + équipe peut égaler l'empreinte transport d'un festival de 2 000 personnes.", kr: "Bay priyorite artis Karayib/rejyonal — yon artis transatlantik + ekip ka egal transpò yon festival 2 000 moun.", es: "Prioriza artistas caribeños/regionales — un artista transatlántico + equipo puede igualar el transporte terrestre de un festival de 2.000 personas." }
      },
      { key: "lowCarbonCatering",
        label: { en: "Low-carbon catering options featured", fr: "Options de restauration bas-carbone mises en avant", kr: "Opsyon manje ba-kabòn disponib", es: "Opciones de restauración baja en carbono destacadas" },
        tip: { en: "Require each vendor to feature at least one plant-based dish — food is ~25% of global emissions.", fr: "Exigez de chaque restaurateur au moins un plat végétal — l'alimentation représente ~25% des émissions mondiales.", kr: "Mande chak vandè omwen yon pla vejetal — manje se ~25% emisyon mondyal yo.", es: "Exige a cada vendedor al menos un plato vegetal — la comida es ~25% de las emisiones mundiales." }
      }
    ]
  },
  {
    key: "waste", icon: "♻️",
    label: { en: "Waste", fr: "Déchets", kr: "Dèchè", es: "Residuos" },
    criteria: [
      { key: "plasticBan",
        label: { en: "Single-use plastic banned on site", fr: "Plastique à usage unique interdit sur site", kr: "Plastik itilizasyon inikal entèdi sou sit", es: "Plástico de un solo uso prohibido en el sitio" },
        tip: { en: "Replace plastic cups, straws and cutlery with reusable or certified compostable alternatives. Write it into your vendor contracts.", fr: "Remplacez gobelets, pailles et couverts plastiques par des alternatives réutilisables ou compostables certifiées.", kr: "Ranplase gode, pay ak kiyè plastik ak altènatif reutilizab oswa konpostab.", es: "Sustituye vasos, pajitas y cubiertos de plástico por alternativas reutilizables o compostables." }
      },
      { key: "sorting",
        label: { en: "Separate bins on site: recyclable / organic / general waste", fr: "Bacs séparés sur site : recyclable / organique / général", kr: "Bak separe sou sit : resiklaj / òganik / jeneral", es: "Contenedores separados en el sitio: reciclaje / orgánico / general" },
        tip: { en: "Place clearly labeled stations (3 bins minimum: recyclable, organic/food, general waste) throughout the venue. One set of bins per 50 attendees is a good benchmark — people only sort correctly if the right bin is within sight.", fr: "Installez des stations de tri bien visibles avec au minimum 3 bacs distincts : recyclable (plastique, carton, verre), organique (restes alimentaires) et ordures générales. Comptez un point de tri pour 50 festivaliers — on trie correctement seulement si la bonne poubelle est à portée de vue.", kr: "Enstale estasyon triyaj ki klèman make ak omwen 3 bak separe : resiklaj (plastik, katon, vè), òganik (rès manje) ak dèchè jeneral. Kalkile yon pwen triyaj pou 50 patisipan — moun triye kòrèkteman sèlman si bon bwat la vizib.", es: "Instala estaciones de clasificación bien visibles con al menos 3 contenedores distintos: reciclable (plástico, cartón, vidrio), orgánico (restos de comida) y basura general. Un punto de clasificación por cada 50 asistentes — la gente solo clasifica bien si el contenedor correcto está a la vista." }
      },
      { key: "zeroWasteCatering",
        label: { en: "Reusable cups and plates for all catering", fr: "Gobelets et assiettes réutilisables pour la restauration", kr: "Gode ak asyèt reutilizab pou tout manje", es: "Vasos y platos reutilizables para toda la restauración" },
        tip: { en: "Use a cup deposit scheme — attendees pay a small deposit returned when they hand back the cup. Proven to achieve 95%+ return rates.", fr: "Utilisez une consigne sur les gobelets. Taux de retour prouvé supérieur à 95 %.", kr: "Itilize sistèm depo pou gode — yo remèt depo a lè yo retounen gode a.", es: "Usa un sistema de depósito de vasos — se devuelve al devolver el vaso. Funciona con >95% de retorno." }
      },
      { key: "wasteReport",
        label: { en: "Publishes post-event waste data", fr: "Publie les données déchets après l'événement", kr: "Pibliye done dèchè aprè evènman an", es: "Publica datos de residuos tras el evento" },
        tip: { en: "Weigh each waste stream after the event and publish the figures. Transparency creates accountability.", fr: "Pesez chaque flux de déchets après l'événement et publiez les chiffres.", kr: "Peze chak fliks dèchè aprè evènman an epi pibliye chif yo.", es: "Pesa cada flujo de residuos tras el evento y publica las cifras." }
      },
      { key: "compost",
        label: { en: "On-site composting for food waste", fr: "Compostage sur site des déchets alimentaires", kr: "Konpostaj sou sit pou dèchè alimantè", es: "Compostaje in situ de residuos alimentarios" },
        tip: { en: "Partner with a local farm or composting facility to handle organic waste from food vendors.", fr: "Partenariat avec une ferme ou une installation de compostage locale pour les déchets des restaurateurs.", kr: "Asosye ak yon fèm lokal pou jere dèchè òganik ki soti nan vandè manje yo.", es: "Asóciate con una granja o instalación de compostaje local para gestionar residuos de los vendedores." }
      }
    ]
  },
  {
    key: "water", icon: "💧",
    label: { en: "Water", fr: "Eau", kr: "Dlo", es: "Agua" },
    criteria: [
      { key: "refillStations",
        label: { en: "Free water refill stations throughout venue", fr: "Points de remplissage d'eau gratuits sur le site", kr: "Estasyon ranplisman dlo gratis sou sit la", es: "Estaciones de recarga de agua gratuitas" },
        tip: { en: "Install refill points — at minimum one per site — this dramatically reduces single-use bottle demand.", fr: "Installez des points de remplissage au minimum un par site — cela réduit considérablement la demande en bouteilles plastique.", kr: "Enstale pwen ranplisman omwen yon anlè sit la — sa rédiui demànd boutèy plastik.", es: "Instala puntos de recarga al menos uno por sitio — reduce drásticamente la demanda de botellas de plástico." }
      },
      { key: "noPlasticBottles",
        label: { en: "No single-use water bottles sold on site", fr: "Aucune bouteille d'eau à usage unique en vente", kr: "Pa gen boutèy dlo itilizasyon inikal an vant", es: "Sin botellas de agua de un solo uso a la venta" },
        tip: { en: "Ban plastic bottle sales site-wide. Sell reusable bottles or branded cups instead.", fr: "Interdisez la vente de bouteilles plastiques sur tout le site. Vendez des gourdes réutilisables à la place.", kr: "Entèdi vant boutèy plastik sou tout sit la. Vann boutèy reutilizab nan plas.", es: "Prohíbe la venta de botellas de plástico en todo el recinto. Vende botellas reutilizables en su lugar." }
      },
      { key: "waterTracking",
        label: { en: "Tracks total water consumption", fr: "Suit la consommation totale d'eau", kr: "Swiv konsomasyon total dlo a", es: "Seguimiento del consumo total de agua" },
        tip: { en: "Meter venue water use throughout the event and publish the total.", fr: "Mesurez la consommation d'eau pendant l'événement et publiez le total.", kr: "Mezire konsomasyon dlo pandan evènman an epi pibliye total la.", es: "Mide el consumo de agua durante el evento y publica el total." }
      },
      { key: "wastewaterPlan",
        label: { en: "Wastewater management plan in place", fr: "Plan de gestion des eaux usées en place", kr: "Plan jestyon dlo sal an plas", es: "Plan de gestión de aguas residuales" },
        tip: { en: "Ensure portable toilets use eco-certified chemicals and waste is collected by a licensed service.", fr: "Assurez-vous que les toilettes portables utilisent des produits éco-certifiés et que les eaux usées sont collectées par un prestataire agréé.", kr: "Asire twalèt pòtab yo itilize pwodui sètifye éko epi dlo sal kolekte pa yon sèvis otorize.", es: "Asegúrate de que los baños portátiles usen productos eco-certificados." }
      },
      { key: "droughtAware",
        label: { en: "Active water conservation measures", fr: "Mesures actives de conservation de l'eau", kr: "Mezi aktif pou konsèvasyon dlo", es: "Medidas activas de conservación del agua" },
        tip: { en: "Brief all staff and vendors on water-saving practices. Use dry urinals where possible.", fr: "Sensibilisez tout le personnel et les prestataires aux économies d'eau. Utilisez des urinoirs secs si possible.", kr: "Enfòme tout pèsonèl ak vandè sou pratik ekonomi dlo. Itilize urinwa sèk kote posib.", es: "Informa a todo el personal sobre prácticas de ahorro de agua. Usa urinarios secos donde sea posible." }
      }
    ]
  },
  {
    key: "biodiversity", icon: "🌿",
    label: { en: "Biodiversity", fr: "Biodiversité", kr: "Biodivèsité", es: "Biodiversidad" },
    criteria: [
      { key: "notNearProtected",
        label: { en: "Venue not adjacent to a protected natural area", fr: "Le site n'est pas adjacent à une zone naturelle protégée", kr: "Sit la pa adjasan ak yon zòn natirèl pwotèjé", es: "El recinto no está junto a un área natural protegida" },
        tip: { en: "A protected area includes: national parks, nature reserves, marine protected areas (MPAs), Ramsar wetlands, UNESCO biosphere reserves, and Natura 2000 sites. In the Caribbean this covers coral reefs, mangroves, seagrass beds, nesting beaches and rainforest. If the venue is within 500m of any of these, establish a strict buffer zone, brief all staff on its boundaries, and prohibit attendee access to sensitive zones.", fr: "Une zone naturelle protégée regroupe : parcs nationaux, réserves naturelles, aires marines protégées (AMP), zones humides Ramsar, réserves de biosphère UNESCO et sites Natura 2000. Dans la Caraïbe, cela inclut les récifs coralliens, les mangroves, les herbiers marins, les plages de ponte des tortues et les forêts tropicales. Si le site se trouve à moins de 500 m de l'un de ces espaces, définissez une zone tampon stricte, informez tout le personnel de ses limites et interdisez l'accès des festivaliers aux zones sensibles.", kr: "Yon zòn natirèl pwotèjé enkli : pak nasyonal, rezèv natirèl, zòn maren pwotèjé (AMP), zòn imid Ramsar, rezèv byosfè UNESCO ak sit Natura 2000. Nan Karayib la, sa kouvri resif koray, mangrove, zèb maren, plaj kote tòti pon ak forè twopikal. Si sit la a mwens pase 500 m youn nan espas sa yo, etabli yon zòn tanpon strict epi entèdi aksè patisipan nan zòn sansib yo.", es: "Un área natural protegida incluye: parques nacionales, reservas naturales, áreas marinas protegidas (AMP), humedales Ramsar, reservas de biosfera UNESCO y sitios Natura 2000. En el Caribe esto abarca arrecifes de coral, manglares, praderas de posidonia, playas de anidación de tortugas y bosques tropicales. Si el recinto está a menos de 500 m de alguno de estos espacios, establece una zona de amortiguamiento estricta, informa a todo el personal y prohíbe el acceso de los asistentes a las zonas sensibles." }
      },
      { key: "wildlifeBriefing",
        label: { en: "Wildlife sensitivity communicated to crew, vendors and attendees", fr: "Sensibilisation à la faune transmise aux équipes, prestataires et participants", kr: "Sansibilizasyon fòn transmèt bay ekip, vandè ak patisipan", es: "Sensibilización sobre fauna transmitida a equipos, proveedores y asistentes" },
        tip: { en: "Most Caribbean festival venues are within walking distance of a nesting beach, mangrove edge, or marine protected area — yet artists, crew, vendors and attendees typically receive no information on local wildlife. Before the event, identify which species are active during the event dates (sea turtles nest March–September; migratory seabirds roost at night). Brief all on-site personnel directly: where sensitive areas are, what to avoid, and who to contact if they spot a nesting turtle. Reach attendees through entry signage, an MC announcement at the start of each evening, or a note on the event app. A briefing costs nothing and is applicable in any setting — rural or urban.", fr: "La plupart des sites de festivals caribéens se trouvent à quelques minutes à pied d'une plage de ponte, d'une lisière de mangrove ou d'une aire marine protégée — mais équipes, prestataires et festivaliers ne reçoivent généralement aucune information sur la faune locale. Avant l'événement, identifiez quelles espèces sont actives (les tortues marines pondent de mars à septembre ; les oiseaux marins migrateurs se perchent la nuit). Informez directement tout le personnel sur site. Sensibilisez les festivaliers via la signalétique d'entrée, une annonce de l'animateur en début de soirée ou une note dans l'application. Une séance d'information ne coûte rien et s'applique partout — en milieu rural comme urbain.", kr: "Pifò sit festivàl Karayibyen yo a kèk minit mache depi yon plaj kote tòti pon, yon bòday mangrove oswa yon zòn maren pwotèjé — men ekip, vandè ak patisipan yo jeneralman pa resevwa okenn enfòmasyon sou fòn lokal la. Anvan evènman an, idantifye ki espès ki aktif pandan dat evènman an (tòti maren pon mas–septanm ; zwazo maren migratè dòmi lannwit). Enfòme tout pèsonèl dirèkteman. Jwenn patisipan yo atravè siyal nan antre, yon anonsman MC nan kòmansman chak sware, oswa yon nòt nan aplikasyon evènman an. Yon brifing pa koute anyen epi li aplikab nenpòt kote — milye riral oswa iben.", es: "La mayoría de los recintos de festivales caribeños están a pocos minutos a pie de una playa de anidación, un borde de manglar o un área marina protegida — pero equipos, proveedores y asistentes normalmente no reciben ninguna información sobre la fauna local. Antes del evento, identifica qué especies están activas (las tortugas marinas anidan de marzo a septiembre; las aves marinas migratorias se posan de noche). Informa directamente a todo el personal in situ. Llega a los asistentes mediante señalización en la entrada, un anuncio del presentador al inicio de cada noche o una nota en la app del evento. Una sesión informativa no cuesta nada y es aplicable en cualquier entorno — rural o urbano." }
      },
      { key: "leaveNoTrace",
        label: { en: "Official leave-no-trace policy", fr: "Politique officielle de non-impact sur le terrain", kr: "Politik ofisyèl 'kite anyen' sou teren", es: "Política oficial de no dejar rastro" },
        tip: { en: "Brief all vendors and staff. Organize a post-event cleanup team and document the site before and after.", fr: "Sensibilisez prestataires et personnel. Organisez une équipe de nettoyage post-événement.", kr: "Enfòme tout vandè ak pèsonèl. Òganize yon ekip netwayaj aprè evènman an.", es: "Informa a vendedores y personal. Organiza un equipo de limpieza post-evento." }
      },
      { key: "lightPollution",
        label: { en: "Light pollution measures (shielded, warm-toned)", fr: "Mesures contre la pollution lumineuse (éclairage orienté, tons chauds)", kr: "Mezi kont pòlisyon liminèz (limyè chode, direksyonèl)", es: "Medidas contra la contaminación lumínica (cálida y dirigida)" },
        tip: { en: "Use downward-facing, warm-toned lighting (>3000K). Avoid upward spotlights near beaches — they disorient nesting sea turtles.", fr: "Utilisez un éclairage vers le bas, tons chauds (>3000K). Évitez les projecteurs vers le ciel près des plages.", kr: "Itilize limyè ki dirije vè ba, ton chode (>3000K). Évite limyè ki monte vè syèl pre plaj.", es: "Usa iluminación hacia abajo, tonos cálidos (>3000K). Evita focos hacia el cielo cerca de playas." }
      },
      { key: "ecoNgo",
        label: { en: "Partners with an environmental NGO", fr: "Partenariat avec une ONG environnementale", kr: "Patnè ak yon ONG anviwonmantal", es: "Socio de una ONG medioambiental" },
        tip: { en: "Partner with a local NGO for on-site awareness activities.", fr: "Partenariat avec une ONG locale — présence sur site.", kr: "Asosye on ONG lokal pou aktivité konsyantizasyon sou sit la.", es: "Asóciate con una ONG local para actividades de sensibilización in situ." }
      }
    ]
  },
  {
    key: "community", icon: "🤝",
    label: { en: "Community", fr: "Communauté", kr: "Kominòté", es: "Comunidad" },
    criteria: [
      { key: "localVendors",
        label: { en: ">50% local food and craft vendors", fr: ">50 % de restaurateurs et artisans locaux", kr: ">50% vandè manje ak atizanat lokal", es: ">50% vendedores locales de comida y artesanía" },
        tip: { en: "Set a local vendor quota in your vendor selection criteria. Local supply chains reduce emissions and keep revenue in the community.", fr: "Fixez un quota de prestataires locaux. Les circuits courts réduisent les émissions et maintiennent les revenus dans la communauté.", kr: "Establi yon kota vandè lokal. Sa rédiui emisyon epi kenbe revni nan kominòté a.", es: "Establece una cuota de vendedores locales. Las cadenas locales reducen emisiones y mantienen ingresos en la comunidad." }
      },
      { key: "localLineup",
        label: { en: ">50% Caribbean or regional artists on lineup", fr: ">50 % d'artistes caribéens ou régionaux à l'affiche", kr: ">50% artist Karayibyen oswa rejyonal sou afich", es: ">50% artistas caribeños o regionales en el cartel" },
        tip: { en: "Reserve the majority of lineup slots for Caribbean artists. This supports the local music economy.", fr: "Réservez la majorité des créneaux aux artistes caribéens — soutien à l'économie musicale locale.", kr: "Rezève majorité plas yo pou artist Karayibyen. Sa sipòté ekonomi mizik lokal la.", es: "Reserva la mayoría de los puestos para artistas caribeños. Apoya la economía musical local." }
      },
      { key: "ngoPartner",
        label: { en: "Donates to or fundraises for an NGO", fr: "Reverse des fonds ou lève des fonds pour une ONG", kr: "Bay don oswa kolekte fon pou yon ONG", es: "Dona o recauda fondos para una ONG" },
        tip: { en: "Allocate a percentage of ticket revenue (even 1%) to an environmental or social NGO. Communicate it clearly.", fr: "Allouez un pourcentage des recettes billetterie (même 1 %) à une ONG. Communiquez-le clairement.", kr: "Aloke yon pousan revni tikèt (menm 1%) bay yon ONG. Kominikasyon klè sou sa.", es: "Destina un porcentaje de los ingresos de entradas (incluso el 1%) a una ONG. Comunícalo claramente." }
      },
      { key: "accessiblePricing",
        label: { en: "Free entry option or community ticket scheme", fr: "Entrée gratuite ou tarif communautaire", kr: "Opsyon antre gratis oswa tikèt kominotè", es: "Entrada gratuita o esquema de entradas comunitarias" },
        tip: { en: "Offer a free public zone, community tickets for local residents, or a pay-what-you-can scheme.", fr: "Proposez une zone gratuite, des tarifs résidents ou un système de participation libre.", kr: "Ofri yon zòn gratis, tikèt rezidan oswa yon sistèm 'peye sa ou ka'.", es: "Ofrece una zona gratuita, entradas para residentes o un esquema de pago voluntario." }
      },
      { key: "socialInclusion",
        label: { en: "Accessibility measures (mobility, language, disability)", fr: "Mesures d'accessibilité (mobilité, langue, handicap)", kr: "Mezi aksesibilité (mobilité, lang, andikap)", es: "Medidas de accesibilidad (movilidad, idioma, discapacidad)" },
        tip: { en: "Provide wheelchair access, multilingual signage (French, Creole, English) and consider sign language interpretation.", fr: "Accès fauteuil roulant, signalétique multilingue (français, créole, anglais) et interprétation en langue des signes.", kr: "Aksè chèz woulant, siyal miltilenng (fransè, kréyòl, anglè) ak entèpretasyon lang siy.", es: "Proporciona acceso en silla de ruedas, señalización multilingüe e interpretación de lengua de signos." }
      }
    ]
  }
];

var state = {};
CRITERIA.forEach(function(cat) {
  state[cat.key] = {};
  cat.criteria.forEach(function(c) { state[cat.key][c.key] = false; });
});

function t(key) { return UI[key][lang] || UI[key]["en"]; }

function applyLang() {
  document.documentElement.lang = lang;

  document.getElementById("ui-subtitle").textContent = t("subtitle");
  document.getElementById("ui-score-label").textContent = t("scoreLabel");
  document.getElementById("ui-grade-A").textContent = t("gradeA");
  document.getElementById("ui-grade-B").textContent = t("gradeB");
  document.getElementById("ui-grade-C").textContent = t("gradeC");
  document.getElementById("ui-grade-D").textContent = t("gradeD");
  document.getElementById("reset-btn").textContent = t("resetBtn");

  document.querySelectorAll(".lang-btn").forEach(function(btn) {
    btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
  });

  CRITERIA.forEach(function(cat) {
    var nameEl = document.getElementById("catname-" + cat.key);
    if (nameEl) nameEl.textContent = cat.label[lang] || cat.label.en;
    cat.criteria.forEach(function(c) {
      var labelEl = document.getElementById("clabel-" + cat.key + "-" + c.key);
      var tipEl   = document.getElementById("ctip-"   + cat.key + "-" + c.key);
      if (labelEl) labelEl.textContent = c.label[lang] || c.label.en;
      if (tipEl)   tipEl.textContent   = c.tip[lang]   || c.tip.en;
    });
  });
}

function computeScore() {
  var total = 0;
  CRITERIA.forEach(function(cat) {
    cat.criteria.forEach(function(c) {
      if (state[cat.key][c.key]) total += 4;
    });
  });
  return total;
}

function getGrade(score) {
  if (score >= 80) return "A";
  if (score >= 60) return "B";
  if (score >= 40) return "C";
  if (score >= 20) return "D";
  return "F";
}

function updateScore() {
  var score = computeScore();
  var grade = getGrade(score);

  document.getElementById("score-number").textContent = score;
  document.getElementById("grade-score-sub").textContent = score + "/100";
  document.getElementById("score-bar").style.width = score + "%";

  var circle = document.getElementById("grade-circle");
  circle.className = "grade-circle grade-" + grade;
  circle.childNodes[0].textContent = grade;

  CRITERIA.forEach(function(cat) {
    var met = cat.criteria.filter(function(c) { return state[cat.key][c.key]; }).length;
    var tallyEl = document.getElementById("tally-" + cat.key);
    var barEl   = document.getElementById("catbar-" + cat.key);
    if (tallyEl) tallyEl.textContent = met + "/5";
    if (barEl)   barEl.style.width   = (met / 5 * 100) + "%";
  });
}

function renderForm() {
  var form = document.getElementById("criteria-form");
  CRITERIA.forEach(function(cat) {
    var section = document.createElement("div");
    section.className = "category";

    var header = document.createElement("div");
    header.className = "category-header";
    header.innerHTML =
      '<span class="category-icon">' + cat.icon + '</span>' +
      '<span class="category-name" id="catname-' + cat.key + '">' + (cat.label[lang] || cat.label.en) + '</span>' +
      '<div class="cat-bar-track"><div class="cat-bar-fill" id="catbar-' + cat.key + '"></div></div>' +
      '<span class="category-tally" id="tally-' + cat.key + '">0/5</span>';
    section.appendChild(header);

    cat.criteria.forEach(function(c) {
      var row = document.createElement("label");
      row.className = "criterion";
      row.innerHTML =
        '<input type="checkbox" id="cb-' + cat.key + '-' + c.key + '" />' +
        '<div class="criterion-body">' +
          '<div class="criterion-label" id="clabel-' + cat.key + '-' + c.key + '">' + (c.label[lang] || c.label.en) + '</div>' +
          '<div class="criterion-tip"   id="ctip-'   + cat.key + '-' + c.key + '">' + (c.tip[lang]   || c.tip.en)   + '</div>' +
        '</div>';

      var cb = row.querySelector("input");
      cb.addEventListener("change", function() {
        state[cat.key][c.key] = cb.checked;
        row.classList.toggle("checked", cb.checked);
        updateScore();
      });

      section.appendChild(row);
    });

    form.appendChild(section);
  });
}

document.querySelectorAll(".lang-btn").forEach(function(btn) {
  btn.addEventListener("click", function() {
    lang = btn.getAttribute("data-lang");
    applyLang();
  });
});

document.getElementById("reset-btn").addEventListener("click", function() {
  CRITERIA.forEach(function(cat) {
    cat.criteria.forEach(function(c) {
      state[cat.key][c.key] = false;
      var cb = document.getElementById("cb-" + cat.key + "-" + c.key);
      if (cb) { cb.checked = false; cb.closest(".criterion").classList.remove("checked"); }
    });
  });
  updateScore();
});

renderForm();
applyLang();
updateScore();
