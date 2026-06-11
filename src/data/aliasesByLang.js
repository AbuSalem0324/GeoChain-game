// Per-language aliases for every country. Used by the language-aware
// resolver (see aliases.js → resolveCountry).
//
// Structure: { CanonicalEnglishName: { langCode: [aliasForm, ...] } }
//   - Lang codes: en-GB, en-US, es, it, fr, de, pt, hu
//   - All alias forms are matched after normalise() (lowercase, diacritics
//     stripped). So 'Németország' and 'Nemetorszag' both work; including
//     both in the array is for clarity only.
//   - Some countries have multiple acceptable forms in one language
//     (e.g. Portuguese has both 'Irão' (pt-PT) and 'Irã' (pt-BR)); list
//     all that should be accepted.
//   - English forms are included for consistency and to provide an
//     en-GB / en-US specific variant where there's a real difference
//     (e.g. Côte d'Ivoire vs Ivory Coast, Czechia vs Czech Republic).
//
// Resolver behaviour:
//   - Canonical English name is ALWAYS accepted, in any language.
//   - Modern in-use English aliases (Burma, Holland, DRC, Czechia, etc.)
//     in UNIVERSAL_ALIASES below are ALSO always accepted, in any language.
//   - The selected-language alias list is accepted when that language
//     is active. Other languages' aliases are NOT.
//   - Historical names (Persia, Rhodesia, Siam, Ceylon, etc.) are NOT
//     included anywhere — they're rejected.

// Modern English-language aliases that are accepted in EVERY language.
// (Canonical English names are always accepted too; these are the
// "well-known alternate forms" — Burma, Holland, DRC, etc.)
export const UNIVERSAL_ALIASES = {
  'Netherlands': ['Holland', 'The Netherlands'],
  'United States': ['United States of America', 'USA', 'US', 'America'],
  'United Kingdom': ['UK', 'Great Britain', 'Britain', 'England'],
  'United Arab Emirates': ['UAE', 'Emirates'],
  "Côte d'Ivoire": ['Ivory Coast', "Cote d'Ivoire", 'Cote d Ivoire'],
  'Czech Republic': ['Czechia', 'Czech'],
  'Myanmar': ['Burma'],
  'Eswatini': ['Swaziland'],
  'Timor-Leste': ['East Timor', 'Timor'],
  'Turkey': ['Türkiye', 'Turkiye'],
  'Ireland': ['Republic of Ireland', 'Eire'],
  'Cape Verde': ['Cabo Verde'],
  'Democratic Republic of the Congo': ['DR Congo', 'Congo Kinshasa', 'Congo DR', 'DRC'],
  'Republic of the Congo': ['Congo Brazzaville', 'Congo Republic', 'ROC', 'Congo', 'Republic of Congo'],
  'Bosnia and Herzegovina': ['Bosnia'],
  'North Macedonia': ['North Mac', 'Macedonia'],
  'Trinidad and Tobago': ['Trinidad', 'Tobago'],
  'Gambia': ['The Gambia'],
  'Saudi Arabia': ['Saudi', 'KSA'],
  'Papua New Guinea': ['PNG', 'New Guinea'],
  'Central African Republic': ['CAR', 'Central Africa'],
  'Russia': ['Russian Federation'],
  'South Korea': ['Korea', 'ROK'],
  'North Korea': ['DPRK'],
  'Laos': ['Lao'],
  'Palestine': ['West Bank', 'Gaza'],
  'Slovakia': ['Slovak Republic'],
  'Moldova': ['Republic of Moldova'],
  'Suriname': ['Surinam'],
  'Bahamas': ['The Bahamas'],
  'Antigua and Barbuda': ['Antigua', 'Barbuda'],
  'Saint Kitts and Nevis': ['St Kitts and Nevis', 'St. Kitts and Nevis', 'St Kitts', 'St. Kitts', 'Saint Kitts', 'Kitts and Nevis', 'Nevis'],
  'Saint Lucia': ['St Lucia', 'St. Lucia'],
  'Saint Vincent and the Grenadines': ['St Vincent and the Grenadines', 'St. Vincent and the Grenadines', 'St Vincent', 'St. Vincent', 'Saint Vincent', 'SVG', 'Grenadines'],
  'Vatican City': ['Vatican', 'The Vatican', 'Holy See'],
  'San Marino': ['S. Marino', 'Republic of San Marino'],
  'Liechtenstein': ['Lichtenstein'],
  'Monaco': ['Principality of Monaco'],
  'Andorra': ['Andorre', 'Principality of Andorra'],
  'Malta': ['Republic of Malta'],
  'Bahrain': ['Kingdom of Bahrain'],
  'Qatar': ['State of Qatar'],
  'Kuwait': ['State of Kuwait'],
  'Maldives': ['Republic of Maldives'],
  'Singapore': ['Republic of Singapore'],
};

// Per-language native exonyms / endonyms. Canonical English is always
// accepted on top of these (in every language) — no need to repeat it
// here unless a language genuinely has its own spelling.
//
// Ordering of languages in each entry: en-GB, en-US, es, it, fr, de, pt, hu
//
// Where en-GB and en-US share a form, only one is listed (they're
// treated as one English pool by the resolver). Where they diverge
// (Czechia vs Czech Republic preference, etc.), both are present.
export const LANG_ALIASES = {

  'Afghanistan': {
    nl: ['Afghanistan'], no: ['Afghanistan'], pl: ['Afganistan'],
    es: ['Afganistán'], it: ['Afghanistan'], fr: ['Afghanistan'],
    de: ['Afghanistan'], pt: ['Afeganistão'], hu: ['Afganisztán'],
  },
  'Albania': {
    nl: ['Albanië'], no: ['Albania'], pl: ['Albania'],
    es: ['Albania'], it: ['Albania'], fr: ['Albanie'],
    de: ['Albanien'], pt: ['Albânia'], hu: ['Albánia'],
  },
  'Algeria': {
    nl: ['Algerije'], no: ['Algerie'], pl: ['Algieria'],
    es: ['Argelia'], it: ['Algeria'], fr: ['Algérie'],
    de: ['Algerien'], pt: ['Argélia'], hu: ['Algéria'],
  },
  'Andorra': {
    nl: ['Andorra'], no: ['Andorra'], pl: ['Andora'],
    es: ['Andorra'], it: ['Andorra'], fr: ['Andorre'],
    de: ['Andorra'], pt: ['Andorra'], hu: ['Andorra'],
  },
  'Angola': {
    nl: ['Angola'], no: ['Angola'], pl: ['Angola'],
    es: ['Angola'], it: ['Angola'], fr: ['Angola'],
    de: ['Angola'], pt: ['Angola'], hu: ['Angola'],
  },
  'Antigua and Barbuda': {
    nl: ['Antigua en Barbuda'], no: ['Antigua og Barbuda'], pl: ['Antigua i Barbuda'],
    es: ['Antigua y Barbuda'], it: ['Antigua e Barbuda'], fr: ['Antigua-et-Barbuda'],
    de: ['Antigua und Barbuda'], pt: ['Antígua e Barbuda'], hu: ['Antigua és Barbuda'],
  },
  'Argentina': {
    nl: ['Argentinië'], no: ['Argentina'], pl: ['Argentyna'],
    es: ['Argentina'], it: ['Argentina'], fr: ['Argentine'],
    de: ['Argentinien'], pt: ['Argentina'], hu: ['Argentína'],
  },
  'Armenia': {
    nl: ['Armenië'], no: ['Armenia'], pl: ['Armenia'],
    es: ['Armenia'], it: ['Armenia'], fr: ['Arménie'],
    de: ['Armenien'], pt: ['Arménia', 'Armênia'], hu: ['Örményország'],
  },
  'Australia': {
    nl: ['Australië'], no: ['Australia'], pl: ['Australia'],
    es: ['Australia'], it: ['Australia'], fr: ['Australie'],
    de: ['Australien'], pt: ['Austrália'], hu: ['Ausztrália'],
  },
  'Austria': {
    nl: ['Oostenrijk'], no: ['Østerrike'], pl: ['Austria'],
    es: ['Austria'], it: ['Austria'], fr: ['Autriche'],
    de: ['Österreich'], pt: ['Áustria'], hu: ['Ausztria'],
  },
  'Azerbaijan': {
    nl: ['Azerbeidzjan'], no: ['Aserbajdsjan'], pl: ['Azerbejdżan'],
    es: ['Azerbaiyán'], it: ['Azerbaigian'], fr: ['Azerbaïdjan'],
    de: ['Aserbaidschan'], pt: ['Azerbaijão'], hu: ['Azerbajdzsán'],
  },
  'Bahamas': {
    nl: ['Bahama\'s'], no: ['Bahamas'], pl: ['Bahamy'],
    es: ['Bahamas'], it: ['Bahamas'], fr: ['Bahamas'],
    de: ['Bahamas'], pt: ['Bahamas'], hu: ['Bahama-szigetek'],
  },
  'Bahrain': {
    nl: ['Bahrein'], no: ['Bahrain'], pl: ['Bahrajn'],
    es: ['Baréin', 'Bahrein'], it: ['Bahrein'], fr: ['Bahreïn'],
    de: ['Bahrain'], pt: ['Bahrein', 'Barém'], hu: ['Bahrein'],
  },
  'Bangladesh': {
    nl: ['Bangladesh'], no: ['Bangladesh'], pl: ['Bangladesz'],
    es: ['Bangladés', 'Bangladesh'], it: ['Bangladesh'], fr: ['Bangladesh'],
    de: ['Bangladesch'], pt: ['Bangladexe', 'Bangladesh'], hu: ['Banglades'],
  },
  'Barbados': {
    nl: ['Barbados'], no: ['Barbados'], pl: ['Barbados'],
    es: ['Barbados'], it: ['Barbados'], fr: ['Barbade'],
    de: ['Barbados'], pt: ['Barbados'], hu: ['Barbados'],
  },
  'Belarus': {
    nl: ['Wit-Rusland', 'Belarus'], no: ['Hviterussland', 'Belarus'], pl: ['Białoruś'],
    es: ['Bielorrusia'], it: ['Bielorussia'], fr: ['Biélorussie'],
    de: ['Weißrussland', 'Belarus'], pt: ['Bielorrússia'], hu: ['Fehéroroszország', 'Belarusz'],
  },
  'Belgium': {
    nl: ['België'], no: ['Belgia'], pl: ['Belgia'],
    es: ['Bélgica'], it: ['Belgio'], fr: ['Belgique'],
    de: ['Belgien'], pt: ['Bélgica'], hu: ['Belgium'],
  },
  'Belize': {
    nl: ['Belize'], no: ['Belize'], pl: ['Belize'],
    es: ['Belice'], it: ['Belize'], fr: ['Belize'],
    de: ['Belize'], pt: ['Belize'], hu: ['Belize'],
  },
  'Benin': {
    nl: ['Benin'], no: ['Benin'], pl: ['Benin'],
    es: ['Benín'], it: ['Benin'], fr: ['Bénin'],
    de: ['Benin'], pt: ['Benim', 'Benin'], hu: ['Benin'],
  },
  'Bhutan': {
    nl: ['Bhutan'], no: ['Bhutan'], pl: ['Bhutan'],
    es: ['Bután'], it: ['Bhutan'], fr: ['Bhoutan'],
    de: ['Bhutan'], pt: ['Butão'], hu: ['Bhután'],
  },
  'Bolivia': {
    nl: ['Bolivia'], no: ['Bolivia'], pl: ['Boliwia'],
    es: ['Bolivia'], it: ['Bolivia'], fr: ['Bolivie'],
    de: ['Bolivien'], pt: ['Bolívia'], hu: ['Bolívia'],
  },
  'Bosnia and Herzegovina': {
    nl: ['Bosnië en Herzegovina'], no: ['Bosnia-Hercegovina'], pl: ['Bośnia i Hercegowina'],
    es: ['Bosnia y Herzegovina'], it: ['Bosnia ed Erzegovina'], fr: ['Bosnie-Herzégovine'],
    de: ['Bosnien und Herzegowina'], pt: ['Bósnia e Herzegovina'], hu: ['Bosznia-Hercegovina'],
  },
  'Botswana': {
    nl: ['Botswana'], no: ['Botswana'], pl: ['Botswana'],
    es: ['Botsuana', 'Botswana'], it: ['Botswana'], fr: ['Botswana'],
    de: ['Botswana', 'Botsuana'], pt: ['Botswana', 'Botsuana'], hu: ['Botswana'],
  },
  'Brazil': {
    nl: ['Brazilië'], no: ['Brasil'], pl: ['Brazylia'],
    es: ['Brasil'], it: ['Brasile'], fr: ['Brésil'],
    de: ['Brasilien'], pt: ['Brasil'], hu: ['Brazília'],
  },
  'Brunei': {
    nl: ['Brunei'], no: ['Brunei'], pl: ['Brunei'],
    es: ['Brunéi', 'Brunei'], it: ['Brunei'], fr: ['Brunei'],
    de: ['Brunei'], pt: ['Brunei', 'Brunei Darussalã'], hu: ['Brunei'],
  },
  'Bulgaria': {
    nl: ['Bulgarije'], no: ['Bulgaria'], pl: ['Bułgaria'],
    es: ['Bulgaria'], it: ['Bulgaria'], fr: ['Bulgarie'],
    de: ['Bulgarien'], pt: ['Bulgária'], hu: ['Bulgária'],
  },
  'Burkina Faso': {
    nl: ['Burkina Faso'], no: ['Burkina Faso'], pl: ['Burkina Faso'],
    es: ['Burkina Faso'], it: ['Burkina Faso'], fr: ['Burkina Faso'],
    de: ['Burkina Faso'], pt: ['Burquina Faso', 'Burkina Faso'], hu: ['Burkina Faso'],
  },
  'Burundi': {
    nl: ['Burundi'], no: ['Burundi'], pl: ['Burundi'],
    es: ['Burundi'], it: ['Burundi'], fr: ['Burundi'],
    de: ['Burundi'], pt: ['Burundi', 'Burundo'], hu: ['Burundi'],
  },
  'Cambodia': {
    nl: ['Cambodja'], no: ['Kambodsja'], pl: ['Kambodża'],
    es: ['Camboya'], it: ['Cambogia'], fr: ['Cambodge'],
    de: ['Kambodscha'], pt: ['Camboja'], hu: ['Kambodzsa'],
  },
  'Cameroon': {
    nl: ['Kameroen'], no: ['Kamerun'], pl: ['Kamerun'],
    es: ['Camerún'], it: ['Camerun'], fr: ['Cameroun'],
    de: ['Kamerun'], pt: ['Camarões', 'Camerún'], hu: ['Kamerun'],
  },
  'Canada': {
    nl: ['Canada'], no: ['Canada'], pl: ['Kanada'],
    es: ['Canadá'], it: ['Canada'], fr: ['Canada'],
    de: ['Kanada'], pt: ['Canadá'], hu: ['Kanada'],
  },
  'Cape Verde': {
    nl: ['Kaapverdië'], no: ['Kapp Verde'], pl: ['Republika Zielonego Przylądka', 'Wyspy Zielonego Przylądka'],
    es: ['Cabo Verde'], it: ['Capo Verde'], fr: ['Cap-Vert'],
    de: ['Kap Verde', 'Cabo Verde'], pt: ['Cabo Verde'], hu: ['Zöld-foki Köztársaság', 'Zöld-foki-szigetek'],
  },
  'Central African Republic': {
    nl: ['Centraal-Afrikaanse Republiek'], no: ['Den sentralafrikanske republikk'], pl: ['Republika Środkowoafrykańska'],
    es: ['República Centroafricana'], it: ['Repubblica Centrafricana'], fr: ['République centrafricaine'],
    de: ['Zentralafrikanische Republik'], pt: ['República Centro-Africana'], hu: ['Közép-afrikai Köztársaság'],
  },
  'Chad': {
    nl: ['Tsjaad'], no: ['Tsjad'], pl: ['Czad'],
    es: ['Chad'], it: ['Ciad'], fr: ['Tchad'],
    de: ['Tschad'], pt: ['Chade'], hu: ['Csád'],
  },
  'Chile': {
    nl: ['Chili'], no: ['Chile'], pl: ['Chile'],
    es: ['Chile'], it: ['Cile'], fr: ['Chili'],
    de: ['Chile'], pt: ['Chile'], hu: ['Chile'],
  },
  'China': {
    nl: ['China'], no: ['Kina'], pl: ['Chiny'],
    es: ['China'], it: ['Cina'], fr: ['Chine'],
    de: ['China'], pt: ['China'], hu: ['Kína'],
  },
  'Colombia': {
    nl: ['Colombia'], no: ['Colombia'], pl: ['Kolumbia'],
    es: ['Colombia'], it: ['Colombia'], fr: ['Colombie'],
    de: ['Kolumbien'], pt: ['Colômbia'], hu: ['Kolumbia'],
  },
  'Comoros': {
    nl: ['Comoren'], no: ['Komorene'], pl: ['Komory'],
    es: ['Comoras'], it: ['Comore'], fr: ['Comores'],
    de: ['Komoren'], pt: ['Comores'], hu: ['Comore-szigetek'],
  },
  'Costa Rica': {
    nl: ['Costa Rica'], no: ['Costa Rica'], pl: ['Kostaryka'],
    es: ['Costa Rica'], it: ['Costa Rica'], fr: ['Costa Rica'],
    de: ['Costa Rica'], pt: ['Costa Rica'], hu: ['Costa Rica'],
  },
  'Croatia': {
    nl: ['Kroatië'], no: ['Kroatia'], pl: ['Chorwacja'],
    es: ['Croacia'], it: ['Croazia'], fr: ['Croatie'],
    de: ['Kroatien'], pt: ['Croácia'], hu: ['Horvátország'],
  },
  'Cuba': {
    nl: ['Cuba'], no: ['Cuba'], pl: ['Kuba'],
    es: ['Cuba'], it: ['Cuba'], fr: ['Cuba'],
    de: ['Kuba'], pt: ['Cuba'], hu: ['Kuba'],
  },
  'Cyprus': {
    nl: ['Cyprus'], no: ['Kypros'], pl: ['Cypr'],
    es: ['Chipre'], it: ['Cipro'], fr: ['Chypre'],
    de: ['Zypern'], pt: ['Chipre'], hu: ['Ciprus'],
  },
  'Czech Republic': {
    nl: ['Tsjechië'], no: ['Tsjekkia'], pl: ['Czechy'],
    'en-GB': ['Czechia'], 'en-US': ['Czechia'],
    es: ['República Checa', 'Chequia'], it: ['Repubblica Ceca', 'Cechia'],
    fr: ['République tchèque', 'Tchéquie'],
    de: ['Tschechien', 'Tschechische Republik'], pt: ['República Checa', 'Chéquia', 'Tchéquia'],
    hu: ['Csehország', 'Cseh Köztársaság'],
  },
  'Democratic Republic of the Congo': {
    nl: ['Democratische Republiek Congo'], no: ['Den demokratiske republikken Kongo'], pl: ['Demokratyczna Republika Konga'],
    es: ['República Democrática del Congo'], it: ['Repubblica Democratica del Congo'],
    fr: ['République démocratique du Congo'],
    de: ['Demokratische Republik Kongo'], pt: ['República Democrática do Congo'],
    hu: ['Kongói Demokratikus Köztársaság'],
  },
  'Denmark': {
    nl: ['Denemarken'], no: ['Danmark'], pl: ['Dania'],
    es: ['Dinamarca'], it: ['Danimarca'], fr: ['Danemark'],
    de: ['Dänemark'], pt: ['Dinamarca'], hu: ['Dánia'],
  },
  'Djibouti': {
    nl: ['Djibouti'], no: ['Djibouti'], pl: ['Dżibuti'],
    es: ['Yibuti'], it: ['Gibuti'], fr: ['Djibouti'],
    de: ['Dschibuti'], pt: ['Djibuti', 'Jibuti'], hu: ['Dzsibuti'],
  },
  'Dominica': {
    nl: ['Dominica'], no: ['Dominica'], pl: ['Dominika'],
    es: ['Dominica'], it: ['Dominica'], fr: ['Dominique'],
    de: ['Dominica'], pt: ['Dominica'], hu: ['Dominika'],
  },
  'Dominican Republic': {
    nl: ['Dominicaanse Republiek'], no: ['Den dominikanske republikk'], pl: ['Dominikana', 'Republika Dominikańska'],
    es: ['República Dominicana'], it: ['Repubblica Dominicana'], fr: ['République dominicaine'],
    de: ['Dominikanische Republik'], pt: ['República Dominicana'], hu: ['Dominikai Köztársaság'],
  },
  'Ecuador': {
    nl: ['Ecuador'], no: ['Ecuador'], pl: ['Ekwador'],
    es: ['Ecuador'], it: ['Ecuador'], fr: ['Équateur'],
    de: ['Ecuador'], pt: ['Equador'], hu: ['Ecuador'],
  },
  'Egypt': {
    nl: ['Egypte'], no: ['Egypt'], pl: ['Egipt'],
    es: ['Egipto'], it: ['Egitto'], fr: ['Égypte'],
    de: ['Ägypten'], pt: ['Egito', 'Egipto'], hu: ['Egyiptom'],
  },
  'El Salvador': {
    nl: ['El Salvador'], no: ['El Salvador'], pl: ['Salwador'],
    es: ['El Salvador'], it: ['El Salvador'], fr: ['Salvador', 'El Salvador'],
    de: ['El Salvador'], pt: ['El Salvador'], hu: ['Salvador', 'El Salvador'],
  },
  'Equatorial Guinea': {
    nl: ['Equatoriaal-Guinea'], no: ['Ekvatorial-Guinea'], pl: ['Gwinea Równikowa'],
    es: ['Guinea Ecuatorial'], it: ['Guinea Equatoriale'], fr: ['Guinée équatoriale'],
    de: ['Äquatorialguinea'], pt: ['Guiné Equatorial'], hu: ['Egyenlítői-Guinea'],
  },
  'Eritrea': {
    nl: ['Eritrea'], no: ['Eritrea'], pl: ['Erytrea'],
    es: ['Eritrea'], it: ['Eritrea'], fr: ['Érythrée'],
    de: ['Eritrea'], pt: ['Eritreia'], hu: ['Eritrea'],
  },
  'Estonia': {
    nl: ['Estland'], no: ['Estland'], pl: ['Estonia'],
    es: ['Estonia'], it: ['Estonia'], fr: ['Estonie'],
    de: ['Estland'], pt: ['Estónia', 'Estônia'], hu: ['Észtország'],
  },
  'Eswatini': {
    nl: ['Eswatini'], no: ['Eswatini'], pl: ['Eswatini', 'Suazi'],
    es: ['Esuatini', 'Suazilandia'], it: ['Eswatini', 'Swaziland'], fr: ['Eswatini', 'Swaziland'],
    de: ['Eswatini', 'Swasiland'], pt: ['Essuatíni', 'Suazilândia'], hu: ['Eszvatini', 'Szváziföld'],
  },
  'Ethiopia': {
    nl: ['Ethiopië'], no: ['Etiopia'], pl: ['Etiopia'],
    es: ['Etiopía'], it: ['Etiopia'], fr: ['Éthiopie'],
    de: ['Äthiopien'], pt: ['Etiópia'], hu: ['Etiópia'],
  },
  'Fiji': {
    nl: ['Fiji'], no: ['Fiji'], pl: ['Fidżi'],
    es: ['Fiyi', 'Fiji'], it: ['Figi', 'Fiji'], fr: ['Fidji'],
    de: ['Fidschi'], pt: ['Fiji', 'Fíji'], hu: ['Fidzsi-szigetek'],
  },
  'Finland': {
    nl: ['Finland'], no: ['Finland'], pl: ['Finlandia'],
    es: ['Finlandia'], it: ['Finlandia'], fr: ['Finlande'],
    de: ['Finnland'], pt: ['Finlândia'], hu: ['Finnország'],
  },
  'France': {
    nl: ['Frankrijk'], no: ['Frankrike'], pl: ['Francja'],
    es: ['Francia'], it: ['Francia'], fr: ['France'],
    de: ['Frankreich'], pt: ['França'], hu: ['Franciaország'],
  },
  'French Guiana': {
    nl: ['Frans-Guyana'], no: ['Fransk Guyana'], pl: ['Gujana Francuska'],
    es: ['Guayana Francesa'], it: ['Guyana Francese'], fr: ['Guyane'],
    de: ['Französisch-Guayana'], pt: ['Guiana Francesa'], hu: ['Francia Guyana'],
  },
  'Gabon': {
    nl: ['Gabon'], no: ['Gabon'], pl: ['Gabon'],
    es: ['Gabón'], it: ['Gabon'], fr: ['Gabon'],
    de: ['Gabun'], pt: ['Gabão'], hu: ['Gabon'],
  },
  'Gambia': {
    nl: ['Gambia'], no: ['Gambia'], pl: ['Gambia'],
    es: ['Gambia'], it: ['Gambia'], fr: ['Gambie'],
    de: ['Gambia'], pt: ['Gâmbia'], hu: ['Gambia'],
  },
  'Georgia': {
    nl: ['Georgië'], no: ['Georgia'], pl: ['Gruzja'],
    es: ['Georgia'], it: ['Georgia'], fr: ['Géorgie'],
    de: ['Georgien'], pt: ['Geórgia'], hu: ['Grúzia'],
  },
  'Germany': {
    nl: ['Duitsland'], no: ['Tyskland'], pl: ['Niemcy'],
    es: ['Alemania'], it: ['Germania'], fr: ['Allemagne'],
    de: ['Deutschland'], pt: ['Alemanha'], hu: ['Németország'],
  },
  'Ghana': {
    nl: ['Ghana'], no: ['Ghana'], pl: ['Ghana'],
    es: ['Ghana'], it: ['Ghana'], fr: ['Ghana'],
    de: ['Ghana'], pt: ['Gana', 'Ghana'], hu: ['Ghána'],
  },
  'Greece': {
    nl: ['Griekenland'], no: ['Hellas', 'Grekenland'], pl: ['Grecja'],
    es: ['Grecia'], it: ['Grecia'], fr: ['Grèce'],
    de: ['Griechenland'], pt: ['Grécia'], hu: ['Görögország'],
  },
  'Greenland': {
    nl: ['Groenland'], no: ['Grønland'], pl: ['Grenlandia'],
    es: ['Groenlandia'], it: ['Groenlandia'], fr: ['Groenland'],
    de: ['Grönland'], pt: ['Gronelândia', 'Groenlândia'], hu: ['Grönland'],
  },
  'Grenada': {
    nl: ['Grenada'], no: ['Grenada'], pl: ['Grenada'],
    es: ['Granada'], it: ['Grenada'], fr: ['Grenade'],
    de: ['Grenada'], pt: ['Granada'], hu: ['Grenada'],
  },
  'Guatemala': {
    nl: ['Guatemala'], no: ['Guatemala'], pl: ['Gwatemala'],
    es: ['Guatemala'], it: ['Guatemala'], fr: ['Guatemala'],
    de: ['Guatemala'], pt: ['Guatemala'], hu: ['Guatemala'],
  },
  'Guinea': {
    nl: ['Guinee'], no: ['Guinea'], pl: ['Gwinea'],
    es: ['Guinea'], it: ['Guinea'], fr: ['Guinée'],
    de: ['Guinea'], pt: ['Guiné'], hu: ['Guinea'],
  },
  'Guyana': {
    nl: ['Guyana'], no: ['Guyana'], pl: ['Gujana'],
    es: ['Guyana'], it: ['Guyana'], fr: ['Guyana'],
    de: ['Guyana'], pt: ['Guiana'], hu: ['Guyana'],
  },
  'Haiti': {
    nl: ['Haïti'], no: ['Haiti'], pl: ['Haiti'],
    es: ['Haití'], it: ['Haiti'], fr: ['Haïti'],
    de: ['Haiti'], pt: ['Haiti'], hu: ['Haiti'],
  },
  'Honduras': {
    nl: ['Honduras'], no: ['Honduras'], pl: ['Honduras'],
    es: ['Honduras'], it: ['Honduras'], fr: ['Honduras'],
    de: ['Honduras'], pt: ['Honduras'], hu: ['Honduras'],
  },
  'Hungary': {
    nl: ['Hongarije'], no: ['Ungarn'], pl: ['Węgry'],
    es: ['Hungría'], it: ['Ungheria'], fr: ['Hongrie'],
    de: ['Ungarn'], pt: ['Hungria'], hu: ['Magyarország'],
  },
  'Iceland': {
    nl: ['IJsland'], no: ['Island'], pl: ['Islandia'],
    es: ['Islandia'], it: ['Islanda'], fr: ['Islande'],
    de: ['Island'], pt: ['Islândia'], hu: ['Izland'],
  },
  'India': {
    nl: ['India'], no: ['India'], pl: ['Indie'],
    es: ['India'], it: ['India'], fr: ['Inde'],
    de: ['Indien'], pt: ['Índia'], hu: ['India'],
  },
  'Indonesia': {
    nl: ['Indonesië'], no: ['Indonesia'], pl: ['Indonezja'],
    es: ['Indonesia'], it: ['Indonesia'], fr: ['Indonésie'],
    de: ['Indonesien'], pt: ['Indonésia'], hu: ['Indonézia'],
  },
  'Iran': {
    nl: ['Iran'], no: ['Iran'], pl: ['Iran'],
    es: ['Irán'], it: ['Iran'], fr: ['Iran'],
    de: ['Iran'], pt: ['Irão', 'Irã'], hu: ['Irán'],
  },
  'Iraq': {
    nl: ['Irak'], no: ['Irak'], pl: ['Irak'],
    es: ['Irak', 'Iraq'], it: ['Iraq'], fr: ['Irak'],
    de: ['Irak'], pt: ['Iraque'], hu: ['Irak'],
  },
  'Ireland': {
    nl: ['Ierland'], no: ['Irland'], pl: ['Irlandia'],
    es: ['Irlanda'], it: ['Irlanda'], fr: ['Irlande'],
    de: ['Irland'], pt: ['Irlanda'], hu: ['Írország'],
  },
  'Israel': {
    nl: ['Israël'], no: ['Israel'], pl: ['Izrael'],
    es: ['Israel'], it: ['Israele'], fr: ['Israël'],
    de: ['Israel'], pt: ['Israel'], hu: ['Izrael'],
  },
  'Italy': {
    nl: ['Italië'], no: ['Italia'], pl: ['Włochy'],
    es: ['Italia'], it: ['Italia'], fr: ['Italie'],
    de: ['Italien'], pt: ['Itália'], hu: ['Olaszország'],
  },
  'Jamaica': {
    nl: ['Jamaica'], no: ['Jamaica'], pl: ['Jamajka'],
    es: ['Jamaica'], it: ['Giamaica'], fr: ['Jamaïque'],
    de: ['Jamaika'], pt: ['Jamaica'], hu: ['Jamaica'],
  },
  'Japan': {
    nl: ['Japan'], no: ['Japan'], pl: ['Japonia'],
    es: ['Japón'], it: ['Giappone'], fr: ['Japon'],
    de: ['Japan'], pt: ['Japão'], hu: ['Japán'],
  },
  'Jordan': {
    nl: ['Jordanië'], no: ['Jordan'], pl: ['Jordania'],
    es: ['Jordania'], it: ['Giordania'], fr: ['Jordanie'],
    de: ['Jordanien'], pt: ['Jordânia'], hu: ['Jordánia'],
  },
  'Kazakhstan': {
    nl: ['Kazachstan'], no: ['Kasakhstan'], pl: ['Kazachstan'],
    es: ['Kazajistán', 'Kazajstán'], it: ['Kazakistan', 'Kazakhstan'], fr: ['Kazakhstan'],
    de: ['Kasachstan'], pt: ['Cazaquistão'], hu: ['Kazahsztán'],
  },
  'Kenya': {
    nl: ['Kenia'], no: ['Kenya'], pl: ['Kenia'],
    es: ['Kenia'], it: ['Kenya', 'Kenia'], fr: ['Kenya'],
    de: ['Kenia'], pt: ['Quénia', 'Quênia'], hu: ['Kenya'],
  },
  'Kosovo': {
    nl: ['Kosovo'], no: ['Kosovo'], pl: ['Kosowo'],
    es: ['Kosovo'], it: ['Kosovo'], fr: ['Kosovo'],
    de: ['Kosovo'], pt: ['Kosovo', 'Cosovo'], hu: ['Koszovó'],
  },
  'Kuwait': {
    nl: ['Koeweit'], no: ['Kuwait'], pl: ['Kuwejt'],
    es: ['Kuwait'], it: ['Kuwait'], fr: ['Koweït'],
    de: ['Kuwait'], pt: ['Kuwait', 'Coveite'], hu: ['Kuvait'],
  },
  'Kyrgyzstan': {
    nl: ['Kirgizië'], no: ['Kirgisistan'], pl: ['Kirgistan'],
    es: ['Kirguistán'], it: ['Kirghizistan'], fr: ['Kirghizistan'],
    de: ['Kirgisistan'], pt: ['Quirguistão'], hu: ['Kirgizisztán'],
  },
  'Laos': {
    nl: ['Laos'], no: ['Laos'], pl: ['Laos'],
    es: ['Laos'], it: ['Laos'], fr: ['Laos'],
    de: ['Laos'], pt: ['Laos'], hu: ['Laosz'],
  },
  'Latvia': {
    nl: ['Letland'], no: ['Latvia'], pl: ['Łotwa'],
    es: ['Letonia'], it: ['Lettonia'], fr: ['Lettonie'],
    de: ['Lettland'], pt: ['Letónia', 'Letônia'], hu: ['Lettország'],
  },
  'Lebanon': {
    nl: ['Libanon'], no: ['Libanon'], pl: ['Liban'],
    es: ['Líbano'], it: ['Libano'], fr: ['Liban'],
    de: ['Libanon'], pt: ['Líbano'], hu: ['Libanon'],
  },
  'Lesotho': {
    nl: ['Lesotho'], no: ['Lesotho'], pl: ['Lesotho'],
    es: ['Lesoto', 'Lesotho'], it: ['Lesotho'], fr: ['Lesotho'],
    de: ['Lesotho'], pt: ['Lesoto', 'Lesotho'], hu: ['Lesotho'],
  },
  'Liberia': {
    nl: ['Liberia'], no: ['Liberia'], pl: ['Liberia'],
    es: ['Liberia'], it: ['Liberia'], fr: ['Libéria'],
    de: ['Liberia'], pt: ['Libéria'], hu: ['Libéria'],
  },
  'Libya': {
    nl: ['Libië'], no: ['Libya'], pl: ['Libia'],
    es: ['Libia'], it: ['Libia'], fr: ['Libye'],
    de: ['Libyen'], pt: ['Líbia'], hu: ['Líbia'],
  },
  'Liechtenstein': {
    nl: ['Liechtenstein'], no: ['Liechtenstein'], pl: ['Liechtenstein'],
    es: ['Liechtenstein'], it: ['Liechtenstein'], fr: ['Liechtenstein'],
    de: ['Liechtenstein', 'Fürstentum Liechtenstein'], pt: ['Liechtenstein'], hu: ['Liechtenstein'],
  },
  'Lithuania': {
    nl: ['Litouwen'], no: ['Litauen'], pl: ['Litwa'],
    es: ['Lituania'], it: ['Lituania'], fr: ['Lituanie'],
    de: ['Litauen'], pt: ['Lituânia'], hu: ['Litvánia'],
  },
  'Luxembourg': {
    nl: ['Luxemburg'], no: ['Luxembourg'], pl: ['Luksemburg'],
    es: ['Luxemburgo'], it: ['Lussemburgo'], fr: ['Luxembourg'],
    de: ['Luxemburg'], pt: ['Luxemburgo'], hu: ['Luxemburg'],
  },
  'Madagascar': {
    nl: ['Madagaskar'], no: ['Madagaskar'], pl: ['Madagaskar'],
    es: ['Madagascar'], it: ['Madagascar'], fr: ['Madagascar'],
    de: ['Madagaskar'], pt: ['Madagáscar', 'Madagascar'], hu: ['Madagaszkár'],
  },
  'Malawi': {
    nl: ['Malawi'], no: ['Malawi'], pl: ['Malawi'],
    es: ['Malaui', 'Malawi'], it: ['Malawi'], fr: ['Malawi'],
    de: ['Malawi'], pt: ['Maláui', 'Malawi'], hu: ['Malawi'],
  },
  'Malaysia': {
    nl: ['Maleisië'], no: ['Malaysia'], pl: ['Malezja'],
    es: ['Malasia'], it: ['Malaysia', 'Malesia'], fr: ['Malaisie'],
    de: ['Malaysia'], pt: ['Malásia'], hu: ['Malajzia'],
  },
  'Maldives': {
    nl: ['Maldiven'], no: ['Maldivene'], pl: ['Malediwy'],
    es: ['Maldivas'], it: ['Maldive'], fr: ['Maldives'],
    de: ['Malediven'], pt: ['Maldivas'], hu: ['Maldív-szigetek'],
  },
  'Mali': {
    nl: ['Mali'], no: ['Mali'], pl: ['Mali'],
    es: ['Malí', 'Mali'], it: ['Mali'], fr: ['Mali'],
    de: ['Mali'], pt: ['Mali', 'Máli'], hu: ['Mali'],
  },
  'Malta': {
    nl: ['Malta'], no: ['Malta'], pl: ['Malta'],
    es: ['Malta'], it: ['Malta'], fr: ['Malte'],
    de: ['Malta'], pt: ['Malta'], hu: ['Málta'],
  },
  'Marshall Islands': {
    nl: ['Marshalleilanden'], no: ['Marshalløyene'], pl: ['Wyspy Marshalla'],
    es: ['Islas Marshall'], it: ['Isole Marshall'], fr: ['Îles Marshall'],
    de: ['Marshallinseln'], pt: ['Ilhas Marshall'], hu: ['Marshall-szigetek'],
  },
  'Mauritania': {
    nl: ['Mauritanië'], no: ['Mauritania'], pl: ['Mauretania'],
    es: ['Mauritania'], it: ['Mauritania'], fr: ['Mauritanie'],
    de: ['Mauretanien'], pt: ['Mauritânia'], hu: ['Mauritánia'],
  },
  'Mauritius': {
    nl: ['Mauritius'], no: ['Mauritius'], pl: ['Mauritius'],
    es: ['Mauricio'], it: ['Mauritius'], fr: ['Maurice'],
    de: ['Mauritius'], pt: ['Maurícia', 'Maurício'], hu: ['Mauritius'],
  },
  'Mexico': {
    nl: ['Mexico'], no: ['Mexico'], pl: ['Meksyk'],
    es: ['México', 'Méjico'], it: ['Messico'], fr: ['Mexique'],
    de: ['Mexiko'], pt: ['México'], hu: ['Mexikó'],
  },
  'Micronesia': {
    nl: ['Micronesia'], no: ['Mikronesia'], pl: ['Mikronezja'],
    es: ['Micronesia'], it: ['Micronesia'], fr: ['Micronésie'],
    de: ['Mikronesien'], pt: ['Micronésia'], hu: ['Mikronézia'],
  },
  'Moldova': {
    nl: ['Moldavië'], no: ['Moldova'], pl: ['Mołdawia'],
    es: ['Moldavia'], it: ['Moldavia', 'Moldova'], fr: ['Moldavie'],
    de: ['Moldau', 'Moldawien'], pt: ['Moldávia'], hu: ['Moldova', 'Moldávia'],
  },
  'Monaco': {
    nl: ['Monaco'], no: ['Monaco'], pl: ['Monako'],
    es: ['Mónaco'], it: ['Monaco', 'Principato di Monaco'], fr: ['Monaco'],
    de: ['Monaco'], pt: ['Mónaco', 'Mônaco'], hu: ['Monaco'],
  },
  'Mongolia': {
    nl: ['Mongolië'], no: ['Mongolia'], pl: ['Mongolia'],
    es: ['Mongolia'], it: ['Mongolia'], fr: ['Mongolie'],
    de: ['Mongolei'], pt: ['Mongólia'], hu: ['Mongólia'],
  },
  'Montenegro': {
    nl: ['Montenegro'], no: ['Montenegro'], pl: ['Czarnogóra'],
    es: ['Montenegro'], it: ['Montenegro'], fr: ['Monténégro'],
    de: ['Montenegro'], pt: ['Montenegro'], hu: ['Montenegró'],
  },
  'Morocco': {
    nl: ['Marokko'], no: ['Marokko'], pl: ['Maroko'],
    es: ['Marruecos'], it: ['Marocco'], fr: ['Maroc'],
    de: ['Marokko'], pt: ['Marrocos'], hu: ['Marokkó'],
  },
  'Mozambique': {
    nl: ['Mozambique'], no: ['Mosambik'], pl: ['Mozambik'],
    es: ['Mozambique'], it: ['Mozambico'], fr: ['Mozambique'],
    de: ['Mosambik'], pt: ['Moçambique'], hu: ['Mozambik'],
  },
  'Myanmar': {
    nl: ['Myanmar', 'Birma'], no: ['Myanmar', 'Burma'], pl: ['Mjanma', 'Birma'],
    es: ['Myanmar', 'Birmania'], it: ['Birmania', 'Myanmar'], fr: ['Birmanie', 'Myanmar'],
    de: ['Myanmar', 'Birma'], pt: ['Mianmar', 'Birmânia'], hu: ['Mianmar', 'Burma'],
  },
  'Namibia': {
    nl: ['Namibië'], no: ['Namibia'], pl: ['Namibia'],
    es: ['Namibia'], it: ['Namibia'], fr: ['Namibie'],
    de: ['Namibia'], pt: ['Namíbia'], hu: ['Namíbia'],
  },
  'Nepal': {
    nl: ['Nepal'], no: ['Nepal'], pl: ['Nepal'],
    es: ['Nepal'], it: ['Nepal'], fr: ['Népal'],
    de: ['Nepal'], pt: ['Nepal'], hu: ['Nepál'],
  },
  'Netherlands': {
    nl: ['Nederland'], no: ['Nederland'], pl: ['Holandia', 'Niderlandy'],
    es: ['Países Bajos', 'Holanda'], it: ['Paesi Bassi', 'Olanda'], fr: ['Pays-Bas', 'Hollande'],
    de: ['Niederlande', 'Holland'], pt: ['Países Baixos', 'Holanda'], hu: ['Hollandia'],
  },
  'New Zealand': {
    nl: ['Nieuw-Zeeland'], no: ['New Zealand'], pl: ['Nowa Zelandia'],
    es: ['Nueva Zelanda'], it: ['Nuova Zelanda'], fr: ['Nouvelle-Zélande'],
    de: ['Neuseeland'], pt: ['Nova Zelândia'], hu: ['Új-Zéland'],
  },
  'Nicaragua': {
    nl: ['Nicaragua'], no: ['Nicaragua'], pl: ['Nikaragua'],
    es: ['Nicaragua'], it: ['Nicaragua'], fr: ['Nicaragua'],
    de: ['Nicaragua'], pt: ['Nicarágua'], hu: ['Nicaragua'],
  },
  'Niger': {
    nl: ['Niger'], no: ['Niger'], pl: ['Niger'],
    es: ['Níger'], it: ['Niger'], fr: ['Niger'],
    de: ['Niger'], pt: ['Níger'], hu: ['Niger'],
  },
  'Nigeria': {
    nl: ['Nigeria'], no: ['Nigeria'], pl: ['Nigeria'],
    es: ['Nigeria'], it: ['Nigeria'], fr: ['Nigéria', 'Nigeria'],
    de: ['Nigeria'], pt: ['Nigéria'], hu: ['Nigéria'],
  },
  'North Korea': {
    nl: ['Noord-Korea'], no: ['Nord-Korea'], pl: ['Korea Północna'],
    es: ['Corea del Norte'], it: ['Corea del Nord'], fr: ['Corée du Nord'],
    de: ['Nordkorea'], pt: ['Coreia do Norte'], hu: ['Észak-Korea'],
  },
  'North Macedonia': {
    nl: ['Noord-Macedonië'], no: ['Nord-Makedonia'], pl: ['Macedonia Północna'],
    es: ['Macedonia del Norte', 'Macedonia'], it: ['Macedonia del Nord', 'Macedonia'],
    fr: ['Macédoine du Nord', 'Macédoine'],
    de: ['Nordmazedonien', 'Mazedonien'], pt: ['Macedónia do Norte', 'Macedônia do Norte', 'Macedónia', 'Macedônia'],
    hu: ['Észak-Macedónia', 'Macedónia'],
  },
  'Norway': {
    nl: ['Noorwegen'], no: ['Norge'], pl: ['Norwegia'],
    es: ['Noruega'], it: ['Norvegia'], fr: ['Norvège'],
    de: ['Norwegen'], pt: ['Noruega'], hu: ['Norvégia'],
  },
  'Oman': {
    nl: ['Oman'], no: ['Oman'], pl: ['Oman'],
    es: ['Omán'], it: ['Oman'], fr: ['Oman'],
    de: ['Oman'], pt: ['Omã', 'Omán'], hu: ['Omán'],
  },
  'Pakistan': {
    nl: ['Pakistan'], no: ['Pakistan'], pl: ['Pakistan'],
    es: ['Pakistán'], it: ['Pakistan'], fr: ['Pakistan'],
    de: ['Pakistan'], pt: ['Paquistão'], hu: ['Pakisztán'],
  },
  'Palau': {
    nl: ['Palau'], no: ['Palau'], pl: ['Palau'],
    es: ['Palaos', 'Palau'], it: ['Palau'], fr: ['Palaos', 'Palau'],
    de: ['Palau'], pt: ['Palau', 'Palaus'], hu: ['Palau'],
  },
  'Palestine': {
    nl: ['Palestina'], no: ['Palestina'], pl: ['Palestyna'],
    es: ['Palestina'], it: ['Palestina'], fr: ['Palestine'],
    de: ['Palästina'], pt: ['Palestina'], hu: ['Palesztina'],
  },
  'Panama': {
    nl: ['Panama'], no: ['Panama'], pl: ['Panama'],
    es: ['Panamá'], it: ['Panama'], fr: ['Panama', 'Panamá'],
    de: ['Panama'], pt: ['Panamá'], hu: ['Panama'],
  },
  'Papua New Guinea': {
    nl: ['Papoea-Nieuw-Guinea'], no: ['Papua Ny-Guinea'], pl: ['Papua-Nowa Gwinea'],
    es: ['Papúa Nueva Guinea'], it: ['Papua Nuova Guinea'], fr: ['Papouasie-Nouvelle-Guinée'],
    de: ['Papua-Neuguinea'], pt: ['Papua-Nova Guiné'], hu: ['Pápua Új-Guinea'],
  },
  'Paraguay': {
    nl: ['Paraguay'], no: ['Paraguay'], pl: ['Paragwaj'],
    es: ['Paraguay'], it: ['Paraguay'], fr: ['Paraguay'],
    de: ['Paraguay'], pt: ['Paraguai'], hu: ['Paraguay'],
  },
  'Peru': {
    nl: ['Peru'], no: ['Peru'], pl: ['Peru'],
    es: ['Perú'], it: ['Perù'], fr: ['Pérou'],
    de: ['Peru'], pt: ['Peru'], hu: ['Peru'],
  },
  'Philippines': {
    nl: ['Filipijnen'], no: ['Filippinene'], pl: ['Filipiny'],
    es: ['Filipinas'], it: ['Filippine'], fr: ['Philippines'],
    de: ['Philippinen'], pt: ['Filipinas'], hu: ['Fülöp-szigetek'],
  },
  'Poland': {
    nl: ['Polen'], no: ['Polen'], pl: ['Polska'],
    es: ['Polonia'], it: ['Polonia'], fr: ['Pologne'],
    de: ['Polen'], pt: ['Polónia', 'Polônia'], hu: ['Lengyelország'],
  },
  'Portugal': {
    nl: ['Portugal'], no: ['Portugal'], pl: ['Portugalia'],
    es: ['Portugal'], it: ['Portogallo'], fr: ['Portugal'],
    de: ['Portugal'], pt: ['Portugal'], hu: ['Portugália'],
  },
  'Qatar': {
    nl: ['Qatar'], no: ['Qatar'], pl: ['Katar'],
    es: ['Catar', 'Qatar'], it: ['Qatar'], fr: ['Qatar'],
    de: ['Katar'], pt: ['Catar', 'Qatar'], hu: ['Katar'],
  },
  'Republic of the Congo': {
    nl: ['Republiek Congo', 'Congo-Brazzaville'], no: ['Republikken Kongo', 'Kongo-Brazzaville'], pl: ['Republika Konga', 'Kongo'],
    es: ['República del Congo'], it: ['Repubblica del Congo'], fr: ['République du Congo'],
    de: ['Republik Kongo'], pt: ['República do Congo'], hu: ['Kongói Köztársaság'],
  },
  'Romania': {
    nl: ['Roemenië'], no: ['Romania'], pl: ['Rumunia'],
    es: ['Rumania', 'Rumanía'], it: ['Romania'], fr: ['Roumanie'],
    de: ['Rumänien'], pt: ['Roménia', 'Romênia'], hu: ['Románia'],
  },
  'Russia': {
    nl: ['Rusland'], no: ['Russland'], pl: ['Rosja'],
    es: ['Rusia'], it: ['Russia'], fr: ['Russie'],
    de: ['Russland'], pt: ['Rússia'], hu: ['Oroszország'],
  },
  'Rwanda': {
    nl: ['Rwanda'], no: ['Rwanda'], pl: ['Rwanda'],
    es: ['Ruanda'], it: ['Ruanda'], fr: ['Rwanda'],
    de: ['Ruanda'], pt: ['Ruanda'], hu: ['Ruanda'],
  },
  'Saint Kitts and Nevis': {
    nl: ['Saint Kitts en Nevis'], no: ['Saint Kitts og Nevis'], pl: ['Saint Kitts i Nevis'],
    es: ['San Cristóbal y Nieves'], it: ['Saint Kitts e Nevis'], fr: ['Saint-Kitts-et-Nevis'],
    de: ['St. Kitts und Nevis'], pt: ['São Cristóvão e Neves'], hu: ['Saint Kitts és Nevis'],
  },
  'Saint Lucia': {
    nl: ['Saint Lucia'], no: ['Saint Lucia'], pl: ['Saint Lucia'],
    es: ['Santa Lucía'], it: ['Santa Lucia'], fr: ['Sainte-Lucie'],
    de: ['St. Lucia'], pt: ['Santa Lúcia'], hu: ['Saint Lucia'],
  },
  'Saint Vincent and the Grenadines': {
    nl: ['Saint Vincent en de Grenadines'], no: ['Saint Vincent og Grenadinene'], pl: ['Saint Vincent i Grenadyny'],
    es: ['San Vicente y las Granadinas'], it: ['Saint Vincent e Grenadine'],
    fr: ['Saint-Vincent-et-les-Grenadines'],
    de: ['St. Vincent und die Grenadinen'], pt: ['São Vicente e Granadinas'],
    hu: ['Saint Vincent és a Grenadine-szigetek'],
  },
  'Samoa': {
    nl: ['Samoa'], no: ['Samoa'], pl: ['Samoa'],
    es: ['Samoa'], it: ['Samoa'], fr: ['Samoa'],
    de: ['Samoa'], pt: ['Samoa'], hu: ['Szamoa'],
  },
  'San Marino': {
    nl: ['San Marino'], no: ['San Marino'], pl: ['San Marino'],
    es: ['San Marino'], it: ['San Marino'], fr: ['Saint-Marin'],
    de: ['San Marino'], pt: ['San Marino'], hu: ['San Marino'],
  },
  'Saudi Arabia': {
    nl: ['Saoedi-Arabië'], no: ['Saudi-Arabia'], pl: ['Arabia Saudyjska'],
    es: ['Arabia Saudita', 'Arabia Saudí'], it: ['Arabia Saudita'], fr: ['Arabie saoudite'],
    de: ['Saudi-Arabien'], pt: ['Arábia Saudita'], hu: ['Szaúd-Arábia'],
  },
  'Senegal': {
    nl: ['Senegal'], no: ['Senegal'], pl: ['Senegal'],
    es: ['Senegal'], it: ['Senegal'], fr: ['Sénégal'],
    de: ['Senegal'], pt: ['Senegal'], hu: ['Szenegál'],
  },
  'Serbia': {
    nl: ['Servië'], no: ['Serbia'], pl: ['Serbia'],
    es: ['Serbia'], it: ['Serbia'], fr: ['Serbie'],
    de: ['Serbien'], pt: ['Sérvia'], hu: ['Szerbia'],
  },
  'Seychelles': {
    nl: ['Seychellen'], no: ['Seychellene'], pl: ['Seszele'],
    es: ['Seychelles'], it: ['Seychelles'], fr: ['Seychelles'],
    de: ['Seychellen'], pt: ['Seicheles', 'Seychelles'], hu: ['Seychelle-szigetek'],
  },
  'Sierra Leone': {
    nl: ['Sierra Leone'], no: ['Sierra Leone'], pl: ['Sierra Leone'],
    es: ['Sierra Leona'], it: ['Sierra Leone'], fr: ['Sierra Leone'],
    de: ['Sierra Leone'], pt: ['Serra Leoa'], hu: ['Sierra Leone'],
  },
  'Singapore': {
    nl: ['Singapore'], no: ['Singapore'], pl: ['Singapur'],
    es: ['Singapur'], it: ['Singapore'], fr: ['Singapour'],
    de: ['Singapur'], pt: ['Singapura'], hu: ['Szingapúr'],
  },
  'Slovakia': {
    nl: ['Slowakije'], no: ['Slovakia'], pl: ['Słowacja'],
    es: ['Eslovaquia'], it: ['Slovacchia'], fr: ['Slovaquie'],
    de: ['Slowakei'], pt: ['Eslováquia'], hu: ['Szlovákia'],
  },
  'Slovenia': {
    nl: ['Slovenië'], no: ['Slovenia'], pl: ['Słowenia'],
    es: ['Eslovenia'], it: ['Slovenia'], fr: ['Slovénie'],
    de: ['Slowenien'], pt: ['Eslovénia', 'Eslovênia'], hu: ['Szlovénia'],
  },
  'Solomon Islands': {
    nl: ['Salomonseilanden'], no: ['Salomonøyene'], pl: ['Wyspy Salomona'],
    es: ['Islas Salomón'], it: ['Isole Salomone'], fr: ['Îles Salomon'],
    de: ['Salomonen'], pt: ['Ilhas Salomão'], hu: ['Salamon-szigetek'],
  },
  'Somalia': {
    nl: ['Somalië'], no: ['Somalia'], pl: ['Somalia'],
    es: ['Somalia'], it: ['Somalia'], fr: ['Somalie'],
    de: ['Somalia'], pt: ['Somália'], hu: ['Szomália'],
  },
  'South Africa': {
    nl: ['Zuid-Afrika'], no: ['Sør-Afrika'], pl: ['Republika Południowej Afryki', 'Afryka Południowa'],
    es: ['Sudáfrica'], it: ['Sudafrica'], fr: ['Afrique du Sud'],
    de: ['Südafrika'], pt: ['África do Sul'], hu: ['Dél-afrikai Köztársaság', 'Dél-Afrika'],
  },
  'South Korea': {
    nl: ['Zuid-Korea'], no: ['Sør-Korea'], pl: ['Korea Południowa'],
    es: ['Corea del Sur'], it: ['Corea del Sud'], fr: ['Corée du Sud'],
    de: ['Südkorea'], pt: ['Coreia do Sul'], hu: ['Dél-Korea'],
  },
  'South Sudan': {
    nl: ['Zuid-Soedan'], no: ['Sør-Sudan'], pl: ['Sudan Południowy'],
    es: ['Sudán del Sur'], it: ['Sud Sudan', 'Sudan del Sud'], fr: ['Soudan du Sud'],
    de: ['Südsudan'], pt: ['Sudão do Sul'], hu: ['Dél-Szudán'],
  },
  'Spain': {
    nl: ['Spanje'], no: ['Spania'], pl: ['Hiszpania'],
    es: ['España'], it: ['Spagna'], fr: ['Espagne'],
    de: ['Spanien'], pt: ['Espanha'], hu: ['Spanyolország'],
  },
  'Sri Lanka': {
    nl: ['Sri Lanka'], no: ['Sri Lanka'], pl: ['Sri Lanka'],
    es: ['Sri Lanka'], it: ['Sri Lanka'], fr: ['Sri Lanka'],
    de: ['Sri Lanka'], pt: ['Sri Lanka'], hu: ['Srí Lanka'],
  },
  'Sudan': {
    nl: ['Soedan'], no: ['Sudan'], pl: ['Sudan'],
    es: ['Sudán'], it: ['Sudan'], fr: ['Soudan'],
    de: ['Sudan'], pt: ['Sudão'], hu: ['Szudán'],
  },
  'Suriname': {
    nl: ['Suriname'], no: ['Surinam'], pl: ['Surinam'],
    es: ['Surinam', 'Suriname'], it: ['Suriname'], fr: ['Suriname'],
    de: ['Suriname'], pt: ['Suriname', 'Surinão'], hu: ['Suriname'],
  },
  'Sweden': {
    nl: ['Zweden'], no: ['Sverige'], pl: ['Szwecja'],
    es: ['Suecia'], it: ['Svezia'], fr: ['Suède'],
    de: ['Schweden'], pt: ['Suécia'], hu: ['Svédország'],
  },
  'Switzerland': {
    nl: ['Zwitserland'], no: ['Sveits'], pl: ['Szwajcaria'],
    es: ['Suiza'], it: ['Svizzera'], fr: ['Suisse'],
    de: ['Schweiz'], pt: ['Suíça'], hu: ['Svájc'],
  },
  'Syria': {
    nl: ['Syrië'], no: ['Syria'], pl: ['Syria'],
    es: ['Siria'], it: ['Siria'], fr: ['Syrie'],
    de: ['Syrien'], pt: ['Síria'], hu: ['Szíria'],
  },
  'São Tomé and Príncipe': {
    nl: ['Sao Tomé en Principe'], no: ['São Tomé og Príncipe'], pl: ['Wyspy Świętego Tomasza i Książęca'],
    es: ['Santo Tomé y Príncipe'], it: ['São Tomé e Príncipe'], fr: ['São Tomé-et-Principe'],
    de: ['São Tomé und Príncipe'], pt: ['São Tomé e Príncipe'], hu: ['São Tomé és Príncipe'],
  },
  'Taiwan': {
    nl: ['Taiwan'], no: ['Taiwan'], pl: ['Tajwan'],
    es: ['Taiwán'], it: ['Taiwan'], fr: ['Taïwan', 'Taiwan'],
    de: ['Taiwan'], pt: ['Taiwan', 'Taivã'], hu: ['Tajvan'],
  },
  'Tajikistan': {
    nl: ['Tadzjikistan'], no: ['Tadsjikistan'], pl: ['Tadżykistan'],
    es: ['Tayikistán'], it: ['Tagikistan'], fr: ['Tadjikistan'],
    de: ['Tadschikistan'], pt: ['Tajiquistão'], hu: ['Tádzsikisztán'],
  },
  'Tanzania': {
    nl: ['Tanzania'], no: ['Tanzania'], pl: ['Tanzania'],
    es: ['Tanzania'], it: ['Tanzania'], fr: ['Tanzanie'],
    de: ['Tansania'], pt: ['Tanzânia'], hu: ['Tanzánia'],
  },
  'Thailand': {
    nl: ['Thailand'], no: ['Thailand'], pl: ['Tajlandia'],
    es: ['Tailandia'], it: ['Thailandia'], fr: ['Thaïlande'],
    de: ['Thailand'], pt: ['Tailândia'], hu: ['Thaiföld'],
  },
  'Timor-Leste': {
    nl: ['Oost-Timor'], no: ['Øst-Timor'], pl: ['Timor Wschodni'],
    es: ['Timor Oriental', 'Timor-Leste'], it: ['Timor Est', 'Timor-Leste'], fr: ['Timor oriental', 'Timor-Leste'],
    de: ['Osttimor', 'Timor-Leste'], pt: ['Timor-Leste'], hu: ['Kelet-Timor', 'Timor-Leste'],
  },
  'Togo': {
    nl: ['Togo'], no: ['Togo'], pl: ['Togo'],
    es: ['Togo'], it: ['Togo'], fr: ['Togo'],
    de: ['Togo'], pt: ['Togo'], hu: ['Togo'],
  },
  'Tonga': {
    nl: ['Tonga'], no: ['Tonga'], pl: ['Tonga'],
    es: ['Tonga'], it: ['Tonga'], fr: ['Tonga'],
    de: ['Tonga'], pt: ['Tonga'], hu: ['Tonga'],
  },
  'Trinidad and Tobago': {
    nl: ['Trinidad en Tobago'], no: ['Trinidad og Tobago'], pl: ['Trynidad i Tobago'],
    es: ['Trinidad y Tobago'], it: ['Trinidad e Tobago'], fr: ['Trinité-et-Tobago'],
    de: ['Trinidad und Tobago'], pt: ['Trindade e Tobago'], hu: ['Trinidad és Tobago'],
  },
  'Tunisia': {
    nl: ['Tunesië'], no: ['Tunisia'], pl: ['Tunezja'],
    es: ['Túnez'], it: ['Tunisia'], fr: ['Tunisie'],
    de: ['Tunesien'], pt: ['Tunísia'], hu: ['Tunézia'],
  },
  'Turkey': {
    nl: ['Turkije'], no: ['Tyrkia'], pl: ['Turcja'],
    es: ['Turquía'], it: ['Turchia'], fr: ['Turquie'],
    de: ['Türkei'], pt: ['Turquia'], hu: ['Törökország'],
  },
  'Turkmenistan': {
    nl: ['Turkmenistan'], no: ['Turkmenistan'], pl: ['Turkmenistan'],
    es: ['Turkmenistán'], it: ['Turkmenistan'], fr: ['Turkménistan'],
    de: ['Turkmenistan'], pt: ['Turcomenistão'], hu: ['Türkmenisztán'],
  },
  'Uganda': {
    nl: ['Oeganda'], no: ['Uganda'], pl: ['Uganda'],
    es: ['Uganda'], it: ['Uganda'], fr: ['Ouganda'],
    de: ['Uganda'], pt: ['Uganda'], hu: ['Uganda'],
  },
  'Ukraine': {
    nl: ['Oekraïne'], no: ['Ukraina'], pl: ['Ukraina'],
    es: ['Ucrania'], it: ['Ucraina'], fr: ['Ukraine'],
    de: ['Ukraine'], pt: ['Ucrânia'], hu: ['Ukrajna'],
  },
  'United Arab Emirates': {
    nl: ['Verenigde Arabische Emiraten'], no: ['De forente arabiske emirater'], pl: ['Zjednoczone Emiraty Arabskie'],
    es: ['Emiratos Árabes Unidos'], it: ['Emirati Arabi Uniti'], fr: ['Émirats arabes unis'],
    de: ['Vereinigte Arabische Emirate'], pt: ['Emirados Árabes Unidos'], hu: ['Egyesült Arab Emírségek'],
  },
  'United Kingdom': {
    nl: ['Verenigd Koninkrijk', 'Groot-Brittannië'], no: ['Storbritannia'], pl: ['Wielka Brytania', 'Zjednoczone Królestwo'],
    'en-GB': ['United Kingdom', 'UK', 'Great Britain', 'Britain'],
    'en-US': ['United Kingdom', 'UK', 'Great Britain', 'Britain'],
    es: ['Reino Unido'], it: ['Regno Unito'], fr: ['Royaume-Uni'],
    de: ['Vereinigtes Königreich'], pt: ['Reino Unido'], hu: ['Egyesült Királyság', 'Nagy-Britannia'],
  },
  'United States': {
    nl: ['Verenigde Staten', 'VS'], no: ['USA', 'De forente stater'], pl: ['Stany Zjednoczone', 'USA'],
    'en-GB': ['United States', 'USA', 'US', 'America'],
    'en-US': ['United States', 'USA', 'US', 'America'],
    es: ['Estados Unidos', 'EE.UU.', 'EEUU'], it: ['Stati Uniti', 'USA'], fr: ['États-Unis', 'États Unis'],
    de: ['Vereinigte Staaten', 'USA'], pt: ['Estados Unidos', 'EUA'], hu: ['Egyesült Államok', 'USA'],
  },
  'Uruguay': {
    nl: ['Uruguay'], no: ['Uruguay'], pl: ['Urugwaj'],
    es: ['Uruguay'], it: ['Uruguay'], fr: ['Uruguay'],
    de: ['Uruguay'], pt: ['Uruguai'], hu: ['Uruguay'],
  },
  'Uzbekistan': {
    nl: ['Oezbekistan'], no: ['Usbekistan'], pl: ['Uzbekistan'],
    es: ['Uzbekistán'], it: ['Uzbekistan'], fr: ['Ouzbékistan'],
    de: ['Usbekistan'], pt: ['Uzbequistão'], hu: ['Üzbegisztán'],
  },
  'Vanuatu': {
    nl: ['Vanuatu'], no: ['Vanuatu'], pl: ['Vanuatu'],
    es: ['Vanuatu'], it: ['Vanuatu'], fr: ['Vanuatu'],
    de: ['Vanuatu'], pt: ['Vanuatu'], hu: ['Vanuatu'],
  },
  'Vatican City': {
    nl: ['Vaticaanstad'], no: ['Vatikanstaten'], pl: ['Watykan'],
    es: ['Ciudad del Vaticano', 'Vaticano'], it: ['Città del Vaticano', 'Vaticano'], fr: ['Vatican', 'Cité du Vatican'],
    de: ['Vatikanstadt', 'Vatikan'], pt: ['Cidade do Vaticano', 'Vaticano'], hu: ['Vatikán', 'Vatikánváros'],
  },
  'Venezuela': {
    nl: ['Venezuela'], no: ['Venezuela'], pl: ['Wenezuela'],
    es: ['Venezuela'], it: ['Venezuela'], fr: ['Venezuela'],
    de: ['Venezuela'], pt: ['Venezuela'], hu: ['Venezuela'],
  },
  'Vietnam': {
    nl: ['Vietnam'], no: ['Vietnam'], pl: ['Wietnam'],
    es: ['Vietnam'], it: ['Vietnam'], fr: ['Viêt Nam', 'Vietnam'],
    de: ['Vietnam'], pt: ['Vietname', 'Vietnã'], hu: ['Vietnam'],
  },
  'Western Sahara': {
    nl: ['Westelijke Sahara'], no: ['Vest-Sahara'], pl: ['Sahara Zachodnia'],
    es: ['Sáhara Occidental'], it: ['Sahara Occidentale'], fr: ['Sahara occidental'],
    de: ['Westsahara'], pt: ['Saara Ocidental'], hu: ['Nyugat-Szahara'],
  },
  'Yemen': {
    nl: ['Jemen'], no: ['Jemen'], pl: ['Jemen'],
    es: ['Yemen'], it: ['Yemen'], fr: ['Yémen'],
    de: ['Jemen'], pt: ['Iémen', 'Iêmen'], hu: ['Jemen'],
  },
  'Zambia': {
    nl: ['Zambia'], no: ['Zambia'], pl: ['Zambia'],
    es: ['Zambia'], it: ['Zambia'], fr: ['Zambie'],
    de: ['Sambia'], pt: ['Zâmbia'], hu: ['Zambia'],
  },
  'Zimbabwe': {
    nl: ['Zimbabwe'], no: ['Zimbabwe'], pl: ['Zimbabwe'],
    es: ['Zimbabue', 'Zimbabwe'], it: ['Zimbabwe'], fr: ['Zimbabwe'],
    de: ['Simbabwe', 'Zimbabwe'], pt: ['Zimbabué', 'Zimbábue'], hu: ['Zimbabwe'],
  },
};
