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
    es: ['Afganistán'], it: ['Afghanistan'], fr: ['Afghanistan'],
    de: ['Afghanistan'], pt: ['Afeganistão'], hu: ['Afganisztán'],
  },
  'Albania': {
    es: ['Albania'], it: ['Albania'], fr: ['Albanie'],
    de: ['Albanien'], pt: ['Albânia'], hu: ['Albánia'],
  },
  'Algeria': {
    es: ['Argelia'], it: ['Algeria'], fr: ['Algérie'],
    de: ['Algerien'], pt: ['Argélia'], hu: ['Algéria'],
  },
  'Andorra': {
    es: ['Andorra'], it: ['Andorra'], fr: ['Andorre'],
    de: ['Andorra'], pt: ['Andorra'], hu: ['Andorra'],
  },
  'Angola': {
    es: ['Angola'], it: ['Angola'], fr: ['Angola'],
    de: ['Angola'], pt: ['Angola'], hu: ['Angola'],
  },
  'Antigua and Barbuda': {
    es: ['Antigua y Barbuda'], it: ['Antigua e Barbuda'], fr: ['Antigua-et-Barbuda'],
    de: ['Antigua und Barbuda'], pt: ['Antígua e Barbuda'], hu: ['Antigua és Barbuda'],
  },
  'Argentina': {
    es: ['Argentina'], it: ['Argentina'], fr: ['Argentine'],
    de: ['Argentinien'], pt: ['Argentina'], hu: ['Argentína'],
  },
  'Armenia': {
    es: ['Armenia'], it: ['Armenia'], fr: ['Arménie'],
    de: ['Armenien'], pt: ['Arménia', 'Armênia'], hu: ['Örményország'],
  },
  'Australia': {
    es: ['Australia'], it: ['Australia'], fr: ['Australie'],
    de: ['Australien'], pt: ['Austrália'], hu: ['Ausztrália'],
  },
  'Austria': {
    es: ['Austria'], it: ['Austria'], fr: ['Autriche'],
    de: ['Österreich'], pt: ['Áustria'], hu: ['Ausztria'],
  },
  'Azerbaijan': {
    es: ['Azerbaiyán'], it: ['Azerbaigian'], fr: ['Azerbaïdjan'],
    de: ['Aserbaidschan'], pt: ['Azerbaijão'], hu: ['Azerbajdzsán'],
  },
  'Bahamas': {
    es: ['Bahamas'], it: ['Bahamas'], fr: ['Bahamas'],
    de: ['Bahamas'], pt: ['Bahamas'], hu: ['Bahama-szigetek'],
  },
  'Bahrain': {
    es: ['Baréin', 'Bahrein'], it: ['Bahrein'], fr: ['Bahreïn'],
    de: ['Bahrain'], pt: ['Bahrein', 'Barém'], hu: ['Bahrein'],
  },
  'Bangladesh': {
    es: ['Bangladés', 'Bangladesh'], it: ['Bangladesh'], fr: ['Bangladesh'],
    de: ['Bangladesch'], pt: ['Bangladexe', 'Bangladesh'], hu: ['Banglades'],
  },
  'Barbados': {
    es: ['Barbados'], it: ['Barbados'], fr: ['Barbade'],
    de: ['Barbados'], pt: ['Barbados'], hu: ['Barbados'],
  },
  'Belarus': {
    es: ['Bielorrusia'], it: ['Bielorussia'], fr: ['Biélorussie'],
    de: ['Weißrussland', 'Belarus'], pt: ['Bielorrússia'], hu: ['Fehéroroszország', 'Belarusz'],
  },
  'Belgium': {
    es: ['Bélgica'], it: ['Belgio'], fr: ['Belgique'],
    de: ['Belgien'], pt: ['Bélgica'], hu: ['Belgium'],
  },
  'Belize': {
    es: ['Belice'], it: ['Belize'], fr: ['Belize'],
    de: ['Belize'], pt: ['Belize'], hu: ['Belize'],
  },
  'Benin': {
    es: ['Benín'], it: ['Benin'], fr: ['Bénin'],
    de: ['Benin'], pt: ['Benim', 'Benin'], hu: ['Benin'],
  },
  'Bhutan': {
    es: ['Bután'], it: ['Bhutan'], fr: ['Bhoutan'],
    de: ['Bhutan'], pt: ['Butão'], hu: ['Bhután'],
  },
  'Bolivia': {
    es: ['Bolivia'], it: ['Bolivia'], fr: ['Bolivie'],
    de: ['Bolivien'], pt: ['Bolívia'], hu: ['Bolívia'],
  },
  'Bosnia and Herzegovina': {
    es: ['Bosnia y Herzegovina'], it: ['Bosnia ed Erzegovina'], fr: ['Bosnie-Herzégovine'],
    de: ['Bosnien und Herzegowina'], pt: ['Bósnia e Herzegovina'], hu: ['Bosznia-Hercegovina'],
  },
  'Botswana': {
    es: ['Botsuana', 'Botswana'], it: ['Botswana'], fr: ['Botswana'],
    de: ['Botswana', 'Botsuana'], pt: ['Botswana', 'Botsuana'], hu: ['Botswana'],
  },
  'Brazil': {
    es: ['Brasil'], it: ['Brasile'], fr: ['Brésil'],
    de: ['Brasilien'], pt: ['Brasil'], hu: ['Brazília'],
  },
  'Brunei': {
    es: ['Brunéi', 'Brunei'], it: ['Brunei'], fr: ['Brunei'],
    de: ['Brunei'], pt: ['Brunei', 'Brunei Darussalã'], hu: ['Brunei'],
  },
  'Bulgaria': {
    es: ['Bulgaria'], it: ['Bulgaria'], fr: ['Bulgarie'],
    de: ['Bulgarien'], pt: ['Bulgária'], hu: ['Bulgária'],
  },
  'Burkina Faso': {
    es: ['Burkina Faso'], it: ['Burkina Faso'], fr: ['Burkina Faso'],
    de: ['Burkina Faso'], pt: ['Burquina Faso', 'Burkina Faso'], hu: ['Burkina Faso'],
  },
  'Burundi': {
    es: ['Burundi'], it: ['Burundi'], fr: ['Burundi'],
    de: ['Burundi'], pt: ['Burundi', 'Burundo'], hu: ['Burundi'],
  },
  'Cambodia': {
    es: ['Camboya'], it: ['Cambogia'], fr: ['Cambodge'],
    de: ['Kambodscha'], pt: ['Camboja'], hu: ['Kambodzsa'],
  },
  'Cameroon': {
    es: ['Camerún'], it: ['Camerun'], fr: ['Cameroun'],
    de: ['Kamerun'], pt: ['Camarões', 'Camerún'], hu: ['Kamerun'],
  },
  'Canada': {
    es: ['Canadá'], it: ['Canada'], fr: ['Canada'],
    de: ['Kanada'], pt: ['Canadá'], hu: ['Kanada'],
  },
  'Cape Verde': {
    es: ['Cabo Verde'], it: ['Capo Verde'], fr: ['Cap-Vert'],
    de: ['Kap Verde', 'Cabo Verde'], pt: ['Cabo Verde'], hu: ['Zöld-foki Köztársaság', 'Zöld-foki-szigetek'],
  },
  'Central African Republic': {
    es: ['República Centroafricana'], it: ['Repubblica Centrafricana'], fr: ['République centrafricaine'],
    de: ['Zentralafrikanische Republik'], pt: ['República Centro-Africana'], hu: ['Közép-afrikai Köztársaság'],
  },
  'Chad': {
    es: ['Chad'], it: ['Ciad'], fr: ['Tchad'],
    de: ['Tschad'], pt: ['Chade'], hu: ['Csád'],
  },
  'Chile': {
    es: ['Chile'], it: ['Cile'], fr: ['Chili'],
    de: ['Chile'], pt: ['Chile'], hu: ['Chile'],
  },
  'China': {
    es: ['China'], it: ['Cina'], fr: ['Chine'],
    de: ['China'], pt: ['China'], hu: ['Kína'],
  },
  'Colombia': {
    es: ['Colombia'], it: ['Colombia'], fr: ['Colombie'],
    de: ['Kolumbien'], pt: ['Colômbia'], hu: ['Kolumbia'],
  },
  'Comoros': {
    es: ['Comoras'], it: ['Comore'], fr: ['Comores'],
    de: ['Komoren'], pt: ['Comores'], hu: ['Comore-szigetek'],
  },
  'Costa Rica': {
    es: ['Costa Rica'], it: ['Costa Rica'], fr: ['Costa Rica'],
    de: ['Costa Rica'], pt: ['Costa Rica'], hu: ['Costa Rica'],
  },
  'Croatia': {
    es: ['Croacia'], it: ['Croazia'], fr: ['Croatie'],
    de: ['Kroatien'], pt: ['Croácia'], hu: ['Horvátország'],
  },
  'Cuba': {
    es: ['Cuba'], it: ['Cuba'], fr: ['Cuba'],
    de: ['Kuba'], pt: ['Cuba'], hu: ['Kuba'],
  },
  'Cyprus': {
    es: ['Chipre'], it: ['Cipro'], fr: ['Chypre'],
    de: ['Zypern'], pt: ['Chipre'], hu: ['Ciprus'],
  },
  'Czech Republic': {
    'en-GB': ['Czechia'], 'en-US': ['Czechia'],
    es: ['República Checa', 'Chequia'], it: ['Repubblica Ceca', 'Cechia'],
    fr: ['République tchèque', 'Tchéquie'],
    de: ['Tschechien', 'Tschechische Republik'], pt: ['República Checa', 'Chéquia', 'Tchéquia'],
    hu: ['Csehország', 'Cseh Köztársaság'],
  },
  'Democratic Republic of the Congo': {
    es: ['República Democrática del Congo'], it: ['Repubblica Democratica del Congo'],
    fr: ['République démocratique du Congo'],
    de: ['Demokratische Republik Kongo'], pt: ['República Democrática do Congo'],
    hu: ['Kongói Demokratikus Köztársaság'],
  },
  'Denmark': {
    es: ['Dinamarca'], it: ['Danimarca'], fr: ['Danemark'],
    de: ['Dänemark'], pt: ['Dinamarca'], hu: ['Dánia'],
  },
  'Djibouti': {
    es: ['Yibuti'], it: ['Gibuti'], fr: ['Djibouti'],
    de: ['Dschibuti'], pt: ['Djibuti', 'Jibuti'], hu: ['Dzsibuti'],
  },
  'Dominica': {
    es: ['Dominica'], it: ['Dominica'], fr: ['Dominique'],
    de: ['Dominica'], pt: ['Dominica'], hu: ['Dominika'],
  },
  'Dominican Republic': {
    es: ['República Dominicana'], it: ['Repubblica Dominicana'], fr: ['République dominicaine'],
    de: ['Dominikanische Republik'], pt: ['República Dominicana'], hu: ['Dominikai Köztársaság'],
  },
  'Ecuador': {
    es: ['Ecuador'], it: ['Ecuador'], fr: ['Équateur'],
    de: ['Ecuador'], pt: ['Equador'], hu: ['Ecuador'],
  },
  'Egypt': {
    es: ['Egipto'], it: ['Egitto'], fr: ['Égypte'],
    de: ['Ägypten'], pt: ['Egito', 'Egipto'], hu: ['Egyiptom'],
  },
  'El Salvador': {
    es: ['El Salvador'], it: ['El Salvador'], fr: ['Salvador', 'El Salvador'],
    de: ['El Salvador'], pt: ['El Salvador'], hu: ['Salvador', 'El Salvador'],
  },
  'Equatorial Guinea': {
    es: ['Guinea Ecuatorial'], it: ['Guinea Equatoriale'], fr: ['Guinée équatoriale'],
    de: ['Äquatorialguinea'], pt: ['Guiné Equatorial'], hu: ['Egyenlítői-Guinea'],
  },
  'Eritrea': {
    es: ['Eritrea'], it: ['Eritrea'], fr: ['Érythrée'],
    de: ['Eritrea'], pt: ['Eritreia'], hu: ['Eritrea'],
  },
  'Estonia': {
    es: ['Estonia'], it: ['Estonia'], fr: ['Estonie'],
    de: ['Estland'], pt: ['Estónia', 'Estônia'], hu: ['Észtország'],
  },
  'Eswatini': {
    es: ['Esuatini', 'Suazilandia'], it: ['Eswatini', 'Swaziland'], fr: ['Eswatini', 'Swaziland'],
    de: ['Eswatini', 'Swasiland'], pt: ['Essuatíni', 'Suazilândia'], hu: ['Eszvatini', 'Szváziföld'],
  },
  'Ethiopia': {
    es: ['Etiopía'], it: ['Etiopia'], fr: ['Éthiopie'],
    de: ['Äthiopien'], pt: ['Etiópia'], hu: ['Etiópia'],
  },
  'Fiji': {
    es: ['Fiyi', 'Fiji'], it: ['Figi', 'Fiji'], fr: ['Fidji'],
    de: ['Fidschi'], pt: ['Fiji', 'Fíji'], hu: ['Fidzsi-szigetek'],
  },
  'Finland': {
    es: ['Finlandia'], it: ['Finlandia'], fr: ['Finlande'],
    de: ['Finnland'], pt: ['Finlândia'], hu: ['Finnország'],
  },
  'France': {
    es: ['Francia'], it: ['Francia'], fr: ['France'],
    de: ['Frankreich'], pt: ['França'], hu: ['Franciaország'],
  },
  'French Guiana': {
    es: ['Guayana Francesa'], it: ['Guyana Francese'], fr: ['Guyane'],
    de: ['Französisch-Guayana'], pt: ['Guiana Francesa'], hu: ['Francia Guyana'],
  },
  'Gabon': {
    es: ['Gabón'], it: ['Gabon'], fr: ['Gabon'],
    de: ['Gabun'], pt: ['Gabão'], hu: ['Gabon'],
  },
  'Gambia': {
    es: ['Gambia'], it: ['Gambia'], fr: ['Gambie'],
    de: ['Gambia'], pt: ['Gâmbia'], hu: ['Gambia'],
  },
  'Georgia': {
    es: ['Georgia'], it: ['Georgia'], fr: ['Géorgie'],
    de: ['Georgien'], pt: ['Geórgia'], hu: ['Grúzia'],
  },
  'Germany': {
    es: ['Alemania'], it: ['Germania'], fr: ['Allemagne'],
    de: ['Deutschland'], pt: ['Alemanha'], hu: ['Németország'],
  },
  'Ghana': {
    es: ['Ghana'], it: ['Ghana'], fr: ['Ghana'],
    de: ['Ghana'], pt: ['Gana', 'Ghana'], hu: ['Ghána'],
  },
  'Greece': {
    es: ['Grecia'], it: ['Grecia'], fr: ['Grèce'],
    de: ['Griechenland'], pt: ['Grécia'], hu: ['Görögország'],
  },
  'Greenland': {
    es: ['Groenlandia'], it: ['Groenlandia'], fr: ['Groenland'],
    de: ['Grönland'], pt: ['Gronelândia', 'Groenlândia'], hu: ['Grönland'],
  },
  'Grenada': {
    es: ['Granada'], it: ['Grenada'], fr: ['Grenade'],
    de: ['Grenada'], pt: ['Granada'], hu: ['Grenada'],
  },
  'Guatemala': {
    es: ['Guatemala'], it: ['Guatemala'], fr: ['Guatemala'],
    de: ['Guatemala'], pt: ['Guatemala'], hu: ['Guatemala'],
  },
  'Guinea': {
    es: ['Guinea'], it: ['Guinea'], fr: ['Guinée'],
    de: ['Guinea'], pt: ['Guiné'], hu: ['Guinea'],
  },
  'Guyana': {
    es: ['Guyana'], it: ['Guyana'], fr: ['Guyana'],
    de: ['Guyana'], pt: ['Guiana'], hu: ['Guyana'],
  },
  'Haiti': {
    es: ['Haití'], it: ['Haiti'], fr: ['Haïti'],
    de: ['Haiti'], pt: ['Haiti'], hu: ['Haiti'],
  },
  'Honduras': {
    es: ['Honduras'], it: ['Honduras'], fr: ['Honduras'],
    de: ['Honduras'], pt: ['Honduras'], hu: ['Honduras'],
  },
  'Hungary': {
    es: ['Hungría'], it: ['Ungheria'], fr: ['Hongrie'],
    de: ['Ungarn'], pt: ['Hungria'], hu: ['Magyarország'],
  },
  'Iceland': {
    es: ['Islandia'], it: ['Islanda'], fr: ['Islande'],
    de: ['Island'], pt: ['Islândia'], hu: ['Izland'],
  },
  'India': {
    es: ['India'], it: ['India'], fr: ['Inde'],
    de: ['Indien'], pt: ['Índia'], hu: ['India'],
  },
  'Indonesia': {
    es: ['Indonesia'], it: ['Indonesia'], fr: ['Indonésie'],
    de: ['Indonesien'], pt: ['Indonésia'], hu: ['Indonézia'],
  },
  'Iran': {
    es: ['Irán'], it: ['Iran'], fr: ['Iran'],
    de: ['Iran'], pt: ['Irão', 'Irã'], hu: ['Irán'],
  },
  'Iraq': {
    es: ['Irak', 'Iraq'], it: ['Iraq'], fr: ['Irak'],
    de: ['Irak'], pt: ['Iraque'], hu: ['Irak'],
  },
  'Ireland': {
    es: ['Irlanda'], it: ['Irlanda'], fr: ['Irlande'],
    de: ['Irland'], pt: ['Irlanda'], hu: ['Írország'],
  },
  'Israel': {
    es: ['Israel'], it: ['Israele'], fr: ['Israël'],
    de: ['Israel'], pt: ['Israel'], hu: ['Izrael'],
  },
  'Italy': {
    es: ['Italia'], it: ['Italia'], fr: ['Italie'],
    de: ['Italien'], pt: ['Itália'], hu: ['Olaszország'],
  },
  'Jamaica': {
    es: ['Jamaica'], it: ['Giamaica'], fr: ['Jamaïque'],
    de: ['Jamaika'], pt: ['Jamaica'], hu: ['Jamaica'],
  },
  'Japan': {
    es: ['Japón'], it: ['Giappone'], fr: ['Japon'],
    de: ['Japan'], pt: ['Japão'], hu: ['Japán'],
  },
  'Jordan': {
    es: ['Jordania'], it: ['Giordania'], fr: ['Jordanie'],
    de: ['Jordanien'], pt: ['Jordânia'], hu: ['Jordánia'],
  },
  'Kazakhstan': {
    es: ['Kazajistán', 'Kazajstán'], it: ['Kazakistan', 'Kazakhstan'], fr: ['Kazakhstan'],
    de: ['Kasachstan'], pt: ['Cazaquistão'], hu: ['Kazahsztán'],
  },
  'Kenya': {
    es: ['Kenia'], it: ['Kenya', 'Kenia'], fr: ['Kenya'],
    de: ['Kenia'], pt: ['Quénia', 'Quênia'], hu: ['Kenya'],
  },
  'Kosovo': {
    es: ['Kosovo'], it: ['Kosovo'], fr: ['Kosovo'],
    de: ['Kosovo'], pt: ['Kosovo', 'Cosovo'], hu: ['Koszovó'],
  },
  'Kuwait': {
    es: ['Kuwait'], it: ['Kuwait'], fr: ['Koweït'],
    de: ['Kuwait'], pt: ['Kuwait', 'Coveite'], hu: ['Kuvait'],
  },
  'Kyrgyzstan': {
    es: ['Kirguistán'], it: ['Kirghizistan'], fr: ['Kirghizistan'],
    de: ['Kirgisistan'], pt: ['Quirguistão'], hu: ['Kirgizisztán'],
  },
  'Laos': {
    es: ['Laos'], it: ['Laos'], fr: ['Laos'],
    de: ['Laos'], pt: ['Laos'], hu: ['Laosz'],
  },
  'Latvia': {
    es: ['Letonia'], it: ['Lettonia'], fr: ['Lettonie'],
    de: ['Lettland'], pt: ['Letónia', 'Letônia'], hu: ['Lettország'],
  },
  'Lebanon': {
    es: ['Líbano'], it: ['Libano'], fr: ['Liban'],
    de: ['Libanon'], pt: ['Líbano'], hu: ['Libanon'],
  },
  'Lesotho': {
    es: ['Lesoto', 'Lesotho'], it: ['Lesotho'], fr: ['Lesotho'],
    de: ['Lesotho'], pt: ['Lesoto', 'Lesotho'], hu: ['Lesotho'],
  },
  'Liberia': {
    es: ['Liberia'], it: ['Liberia'], fr: ['Libéria'],
    de: ['Liberia'], pt: ['Libéria'], hu: ['Libéria'],
  },
  'Libya': {
    es: ['Libia'], it: ['Libia'], fr: ['Libye'],
    de: ['Libyen'], pt: ['Líbia'], hu: ['Líbia'],
  },
  'Liechtenstein': {
    es: ['Liechtenstein'], it: ['Liechtenstein'], fr: ['Liechtenstein'],
    de: ['Liechtenstein', 'Fürstentum Liechtenstein'], pt: ['Liechtenstein'], hu: ['Liechtenstein'],
  },
  'Lithuania': {
    es: ['Lituania'], it: ['Lituania'], fr: ['Lituanie'],
    de: ['Litauen'], pt: ['Lituânia'], hu: ['Litvánia'],
  },
  'Luxembourg': {
    es: ['Luxemburgo'], it: ['Lussemburgo'], fr: ['Luxembourg'],
    de: ['Luxemburg'], pt: ['Luxemburgo'], hu: ['Luxemburg'],
  },
  'Madagascar': {
    es: ['Madagascar'], it: ['Madagascar'], fr: ['Madagascar'],
    de: ['Madagaskar'], pt: ['Madagáscar', 'Madagascar'], hu: ['Madagaszkár'],
  },
  'Malawi': {
    es: ['Malaui', 'Malawi'], it: ['Malawi'], fr: ['Malawi'],
    de: ['Malawi'], pt: ['Maláui', 'Malawi'], hu: ['Malawi'],
  },
  'Malaysia': {
    es: ['Malasia'], it: ['Malaysia', 'Malesia'], fr: ['Malaisie'],
    de: ['Malaysia'], pt: ['Malásia'], hu: ['Malajzia'],
  },
  'Maldives': {
    es: ['Maldivas'], it: ['Maldive'], fr: ['Maldives'],
    de: ['Malediven'], pt: ['Maldivas'], hu: ['Maldív-szigetek'],
  },
  'Mali': {
    es: ['Malí', 'Mali'], it: ['Mali'], fr: ['Mali'],
    de: ['Mali'], pt: ['Mali', 'Máli'], hu: ['Mali'],
  },
  'Malta': {
    es: ['Malta'], it: ['Malta'], fr: ['Malte'],
    de: ['Malta'], pt: ['Malta'], hu: ['Málta'],
  },
  'Marshall Islands': {
    es: ['Islas Marshall'], it: ['Isole Marshall'], fr: ['Îles Marshall'],
    de: ['Marshallinseln'], pt: ['Ilhas Marshall'], hu: ['Marshall-szigetek'],
  },
  'Mauritania': {
    es: ['Mauritania'], it: ['Mauritania'], fr: ['Mauritanie'],
    de: ['Mauretanien'], pt: ['Mauritânia'], hu: ['Mauritánia'],
  },
  'Mauritius': {
    es: ['Mauricio'], it: ['Mauritius'], fr: ['Maurice'],
    de: ['Mauritius'], pt: ['Maurícia', 'Maurício'], hu: ['Mauritius'],
  },
  'Mexico': {
    es: ['México', 'Méjico'], it: ['Messico'], fr: ['Mexique'],
    de: ['Mexiko'], pt: ['México'], hu: ['Mexikó'],
  },
  'Micronesia': {
    es: ['Micronesia'], it: ['Micronesia'], fr: ['Micronésie'],
    de: ['Mikronesien'], pt: ['Micronésia'], hu: ['Mikronézia'],
  },
  'Moldova': {
    es: ['Moldavia'], it: ['Moldavia', 'Moldova'], fr: ['Moldavie'],
    de: ['Moldau', 'Moldawien'], pt: ['Moldávia'], hu: ['Moldova', 'Moldávia'],
  },
  'Monaco': {
    es: ['Mónaco'], it: ['Monaco', 'Principato di Monaco'], fr: ['Monaco'],
    de: ['Monaco'], pt: ['Mónaco', 'Mônaco'], hu: ['Monaco'],
  },
  'Mongolia': {
    es: ['Mongolia'], it: ['Mongolia'], fr: ['Mongolie'],
    de: ['Mongolei'], pt: ['Mongólia'], hu: ['Mongólia'],
  },
  'Montenegro': {
    es: ['Montenegro'], it: ['Montenegro'], fr: ['Monténégro'],
    de: ['Montenegro'], pt: ['Montenegro'], hu: ['Montenegró'],
  },
  'Morocco': {
    es: ['Marruecos'], it: ['Marocco'], fr: ['Maroc'],
    de: ['Marokko'], pt: ['Marrocos'], hu: ['Marokkó'],
  },
  'Mozambique': {
    es: ['Mozambique'], it: ['Mozambico'], fr: ['Mozambique'],
    de: ['Mosambik'], pt: ['Moçambique'], hu: ['Mozambik'],
  },
  'Myanmar': {
    es: ['Myanmar', 'Birmania'], it: ['Birmania', 'Myanmar'], fr: ['Birmanie', 'Myanmar'],
    de: ['Myanmar', 'Birma'], pt: ['Mianmar', 'Birmânia'], hu: ['Mianmar', 'Burma'],
  },
  'Namibia': {
    es: ['Namibia'], it: ['Namibia'], fr: ['Namibie'],
    de: ['Namibia'], pt: ['Namíbia'], hu: ['Namíbia'],
  },
  'Nepal': {
    es: ['Nepal'], it: ['Nepal'], fr: ['Népal'],
    de: ['Nepal'], pt: ['Nepal'], hu: ['Nepál'],
  },
  'Netherlands': {
    es: ['Países Bajos', 'Holanda'], it: ['Paesi Bassi', 'Olanda'], fr: ['Pays-Bas', 'Hollande'],
    de: ['Niederlande', 'Holland'], pt: ['Países Baixos', 'Holanda'], hu: ['Hollandia'],
  },
  'New Zealand': {
    es: ['Nueva Zelanda'], it: ['Nuova Zelanda'], fr: ['Nouvelle-Zélande'],
    de: ['Neuseeland'], pt: ['Nova Zelândia'], hu: ['Új-Zéland'],
  },
  'Nicaragua': {
    es: ['Nicaragua'], it: ['Nicaragua'], fr: ['Nicaragua'],
    de: ['Nicaragua'], pt: ['Nicarágua'], hu: ['Nicaragua'],
  },
  'Niger': {
    es: ['Níger'], it: ['Niger'], fr: ['Niger'],
    de: ['Niger'], pt: ['Níger'], hu: ['Niger'],
  },
  'Nigeria': {
    es: ['Nigeria'], it: ['Nigeria'], fr: ['Nigéria', 'Nigeria'],
    de: ['Nigeria'], pt: ['Nigéria'], hu: ['Nigéria'],
  },
  'North Korea': {
    es: ['Corea del Norte'], it: ['Corea del Nord'], fr: ['Corée du Nord'],
    de: ['Nordkorea'], pt: ['Coreia do Norte'], hu: ['Észak-Korea'],
  },
  'North Macedonia': {
    es: ['Macedonia del Norte', 'Macedonia'], it: ['Macedonia del Nord', 'Macedonia'],
    fr: ['Macédoine du Nord', 'Macédoine'],
    de: ['Nordmazedonien', 'Mazedonien'], pt: ['Macedónia do Norte', 'Macedônia do Norte', 'Macedónia', 'Macedônia'],
    hu: ['Észak-Macedónia', 'Macedónia'],
  },
  'Norway': {
    es: ['Noruega'], it: ['Norvegia'], fr: ['Norvège'],
    de: ['Norwegen'], pt: ['Noruega'], hu: ['Norvégia'],
  },
  'Oman': {
    es: ['Omán'], it: ['Oman'], fr: ['Oman'],
    de: ['Oman'], pt: ['Omã', 'Omán'], hu: ['Omán'],
  },
  'Pakistan': {
    es: ['Pakistán'], it: ['Pakistan'], fr: ['Pakistan'],
    de: ['Pakistan'], pt: ['Paquistão'], hu: ['Pakisztán'],
  },
  'Palau': {
    es: ['Palaos', 'Palau'], it: ['Palau'], fr: ['Palaos', 'Palau'],
    de: ['Palau'], pt: ['Palau', 'Palaus'], hu: ['Palau'],
  },
  'Palestine': {
    es: ['Palestina'], it: ['Palestina'], fr: ['Palestine'],
    de: ['Palästina'], pt: ['Palestina'], hu: ['Palesztina'],
  },
  'Panama': {
    es: ['Panamá'], it: ['Panama'], fr: ['Panama', 'Panamá'],
    de: ['Panama'], pt: ['Panamá'], hu: ['Panama'],
  },
  'Papua New Guinea': {
    es: ['Papúa Nueva Guinea'], it: ['Papua Nuova Guinea'], fr: ['Papouasie-Nouvelle-Guinée'],
    de: ['Papua-Neuguinea'], pt: ['Papua-Nova Guiné'], hu: ['Pápua Új-Guinea'],
  },
  'Paraguay': {
    es: ['Paraguay'], it: ['Paraguay'], fr: ['Paraguay'],
    de: ['Paraguay'], pt: ['Paraguai'], hu: ['Paraguay'],
  },
  'Peru': {
    es: ['Perú'], it: ['Perù'], fr: ['Pérou'],
    de: ['Peru'], pt: ['Peru'], hu: ['Peru'],
  },
  'Philippines': {
    es: ['Filipinas'], it: ['Filippine'], fr: ['Philippines'],
    de: ['Philippinen'], pt: ['Filipinas'], hu: ['Fülöp-szigetek'],
  },
  'Poland': {
    es: ['Polonia'], it: ['Polonia'], fr: ['Pologne'],
    de: ['Polen'], pt: ['Polónia', 'Polônia'], hu: ['Lengyelország'],
  },
  'Portugal': {
    es: ['Portugal'], it: ['Portogallo'], fr: ['Portugal'],
    de: ['Portugal'], pt: ['Portugal'], hu: ['Portugália'],
  },
  'Qatar': {
    es: ['Catar', 'Qatar'], it: ['Qatar'], fr: ['Qatar'],
    de: ['Katar'], pt: ['Catar', 'Qatar'], hu: ['Katar'],
  },
  'Republic of the Congo': {
    es: ['República del Congo'], it: ['Repubblica del Congo'], fr: ['République du Congo'],
    de: ['Republik Kongo'], pt: ['República do Congo'], hu: ['Kongói Köztársaság'],
  },
  'Romania': {
    es: ['Rumania', 'Rumanía'], it: ['Romania'], fr: ['Roumanie'],
    de: ['Rumänien'], pt: ['Roménia', 'Romênia'], hu: ['Románia'],
  },
  'Russia': {
    es: ['Rusia'], it: ['Russia'], fr: ['Russie'],
    de: ['Russland'], pt: ['Rússia'], hu: ['Oroszország'],
  },
  'Rwanda': {
    es: ['Ruanda'], it: ['Ruanda'], fr: ['Rwanda'],
    de: ['Ruanda'], pt: ['Ruanda'], hu: ['Ruanda'],
  },
  'Saint Kitts and Nevis': {
    es: ['San Cristóbal y Nieves'], it: ['Saint Kitts e Nevis'], fr: ['Saint-Kitts-et-Nevis'],
    de: ['St. Kitts und Nevis'], pt: ['São Cristóvão e Neves'], hu: ['Saint Kitts és Nevis'],
  },
  'Saint Lucia': {
    es: ['Santa Lucía'], it: ['Santa Lucia'], fr: ['Sainte-Lucie'],
    de: ['St. Lucia'], pt: ['Santa Lúcia'], hu: ['Saint Lucia'],
  },
  'Saint Vincent and the Grenadines': {
    es: ['San Vicente y las Granadinas'], it: ['Saint Vincent e Grenadine'],
    fr: ['Saint-Vincent-et-les-Grenadines'],
    de: ['St. Vincent und die Grenadinen'], pt: ['São Vicente e Granadinas'],
    hu: ['Saint Vincent és a Grenadine-szigetek'],
  },
  'Samoa': {
    es: ['Samoa'], it: ['Samoa'], fr: ['Samoa'],
    de: ['Samoa'], pt: ['Samoa'], hu: ['Szamoa'],
  },
  'San Marino': {
    es: ['San Marino'], it: ['San Marino'], fr: ['Saint-Marin'],
    de: ['San Marino'], pt: ['San Marino'], hu: ['San Marino'],
  },
  'Saudi Arabia': {
    es: ['Arabia Saudita', 'Arabia Saudí'], it: ['Arabia Saudita'], fr: ['Arabie saoudite'],
    de: ['Saudi-Arabien'], pt: ['Arábia Saudita'], hu: ['Szaúd-Arábia'],
  },
  'Senegal': {
    es: ['Senegal'], it: ['Senegal'], fr: ['Sénégal'],
    de: ['Senegal'], pt: ['Senegal'], hu: ['Szenegál'],
  },
  'Serbia': {
    es: ['Serbia'], it: ['Serbia'], fr: ['Serbie'],
    de: ['Serbien'], pt: ['Sérvia'], hu: ['Szerbia'],
  },
  'Seychelles': {
    es: ['Seychelles'], it: ['Seychelles'], fr: ['Seychelles'],
    de: ['Seychellen'], pt: ['Seicheles', 'Seychelles'], hu: ['Seychelle-szigetek'],
  },
  'Sierra Leone': {
    es: ['Sierra Leona'], it: ['Sierra Leone'], fr: ['Sierra Leone'],
    de: ['Sierra Leone'], pt: ['Serra Leoa'], hu: ['Sierra Leone'],
  },
  'Singapore': {
    es: ['Singapur'], it: ['Singapore'], fr: ['Singapour'],
    de: ['Singapur'], pt: ['Singapura'], hu: ['Szingapúr'],
  },
  'Slovakia': {
    es: ['Eslovaquia'], it: ['Slovacchia'], fr: ['Slovaquie'],
    de: ['Slowakei'], pt: ['Eslováquia'], hu: ['Szlovákia'],
  },
  'Slovenia': {
    es: ['Eslovenia'], it: ['Slovenia'], fr: ['Slovénie'],
    de: ['Slowenien'], pt: ['Eslovénia', 'Eslovênia'], hu: ['Szlovénia'],
  },
  'Solomon Islands': {
    es: ['Islas Salomón'], it: ['Isole Salomone'], fr: ['Îles Salomon'],
    de: ['Salomonen'], pt: ['Ilhas Salomão'], hu: ['Salamon-szigetek'],
  },
  'Somalia': {
    es: ['Somalia'], it: ['Somalia'], fr: ['Somalie'],
    de: ['Somalia'], pt: ['Somália'], hu: ['Szomália'],
  },
  'South Africa': {
    es: ['Sudáfrica'], it: ['Sudafrica'], fr: ['Afrique du Sud'],
    de: ['Südafrika'], pt: ['África do Sul'], hu: ['Dél-afrikai Köztársaság', 'Dél-Afrika'],
  },
  'South Korea': {
    es: ['Corea del Sur'], it: ['Corea del Sud'], fr: ['Corée du Sud'],
    de: ['Südkorea'], pt: ['Coreia do Sul'], hu: ['Dél-Korea'],
  },
  'South Sudan': {
    es: ['Sudán del Sur'], it: ['Sud Sudan', 'Sudan del Sud'], fr: ['Soudan du Sud'],
    de: ['Südsudan'], pt: ['Sudão do Sul'], hu: ['Dél-Szudán'],
  },
  'Spain': {
    es: ['España'], it: ['Spagna'], fr: ['Espagne'],
    de: ['Spanien'], pt: ['Espanha'], hu: ['Spanyolország'],
  },
  'Sri Lanka': {
    es: ['Sri Lanka'], it: ['Sri Lanka'], fr: ['Sri Lanka'],
    de: ['Sri Lanka'], pt: ['Sri Lanka'], hu: ['Srí Lanka'],
  },
  'Sudan': {
    es: ['Sudán'], it: ['Sudan'], fr: ['Soudan'],
    de: ['Sudan'], pt: ['Sudão'], hu: ['Szudán'],
  },
  'Suriname': {
    es: ['Surinam', 'Suriname'], it: ['Suriname'], fr: ['Suriname'],
    de: ['Suriname'], pt: ['Suriname', 'Surinão'], hu: ['Suriname'],
  },
  'Sweden': {
    es: ['Suecia'], it: ['Svezia'], fr: ['Suède'],
    de: ['Schweden'], pt: ['Suécia'], hu: ['Svédország'],
  },
  'Switzerland': {
    es: ['Suiza'], it: ['Svizzera'], fr: ['Suisse'],
    de: ['Schweiz'], pt: ['Suíça'], hu: ['Svájc'],
  },
  'Syria': {
    es: ['Siria'], it: ['Siria'], fr: ['Syrie'],
    de: ['Syrien'], pt: ['Síria'], hu: ['Szíria'],
  },
  'São Tomé and Príncipe': {
    es: ['Santo Tomé y Príncipe'], it: ['São Tomé e Príncipe'], fr: ['São Tomé-et-Principe'],
    de: ['São Tomé und Príncipe'], pt: ['São Tomé e Príncipe'], hu: ['São Tomé és Príncipe'],
  },
  'Taiwan': {
    es: ['Taiwán'], it: ['Taiwan'], fr: ['Taïwan', 'Taiwan'],
    de: ['Taiwan'], pt: ['Taiwan', 'Taivã'], hu: ['Tajvan'],
  },
  'Tajikistan': {
    es: ['Tayikistán'], it: ['Tagikistan'], fr: ['Tadjikistan'],
    de: ['Tadschikistan'], pt: ['Tajiquistão'], hu: ['Tádzsikisztán'],
  },
  'Tanzania': {
    es: ['Tanzania'], it: ['Tanzania'], fr: ['Tanzanie'],
    de: ['Tansania'], pt: ['Tanzânia'], hu: ['Tanzánia'],
  },
  'Thailand': {
    es: ['Tailandia'], it: ['Thailandia'], fr: ['Thaïlande'],
    de: ['Thailand'], pt: ['Tailândia'], hu: ['Thaiföld'],
  },
  'Timor-Leste': {
    es: ['Timor Oriental', 'Timor-Leste'], it: ['Timor Est', 'Timor-Leste'], fr: ['Timor oriental', 'Timor-Leste'],
    de: ['Osttimor', 'Timor-Leste'], pt: ['Timor-Leste'], hu: ['Kelet-Timor', 'Timor-Leste'],
  },
  'Togo': {
    es: ['Togo'], it: ['Togo'], fr: ['Togo'],
    de: ['Togo'], pt: ['Togo'], hu: ['Togo'],
  },
  'Tonga': {
    es: ['Tonga'], it: ['Tonga'], fr: ['Tonga'],
    de: ['Tonga'], pt: ['Tonga'], hu: ['Tonga'],
  },
  'Trinidad and Tobago': {
    es: ['Trinidad y Tobago'], it: ['Trinidad e Tobago'], fr: ['Trinité-et-Tobago'],
    de: ['Trinidad und Tobago'], pt: ['Trindade e Tobago'], hu: ['Trinidad és Tobago'],
  },
  'Tunisia': {
    es: ['Túnez'], it: ['Tunisia'], fr: ['Tunisie'],
    de: ['Tunesien'], pt: ['Tunísia'], hu: ['Tunézia'],
  },
  'Turkey': {
    es: ['Turquía'], it: ['Turchia'], fr: ['Turquie'],
    de: ['Türkei'], pt: ['Turquia'], hu: ['Törökország'],
  },
  'Turkmenistan': {
    es: ['Turkmenistán'], it: ['Turkmenistan'], fr: ['Turkménistan'],
    de: ['Turkmenistan'], pt: ['Turcomenistão'], hu: ['Türkmenisztán'],
  },
  'Uganda': {
    es: ['Uganda'], it: ['Uganda'], fr: ['Ouganda'],
    de: ['Uganda'], pt: ['Uganda'], hu: ['Uganda'],
  },
  'Ukraine': {
    es: ['Ucrania'], it: ['Ucraina'], fr: ['Ukraine'],
    de: ['Ukraine'], pt: ['Ucrânia'], hu: ['Ukrajna'],
  },
  'United Arab Emirates': {
    es: ['Emiratos Árabes Unidos'], it: ['Emirati Arabi Uniti'], fr: ['Émirats arabes unis'],
    de: ['Vereinigte Arabische Emirate'], pt: ['Emirados Árabes Unidos'], hu: ['Egyesült Arab Emírségek'],
  },
  'United Kingdom': {
    'en-GB': ['United Kingdom', 'UK', 'Great Britain', 'Britain'],
    'en-US': ['United Kingdom', 'UK', 'Great Britain', 'Britain'],
    es: ['Reino Unido'], it: ['Regno Unito'], fr: ['Royaume-Uni'],
    de: ['Vereinigtes Königreich'], pt: ['Reino Unido'], hu: ['Egyesült Királyság', 'Nagy-Britannia'],
  },
  'United States': {
    'en-GB': ['United States', 'USA', 'US', 'America'],
    'en-US': ['United States', 'USA', 'US', 'America'],
    es: ['Estados Unidos', 'EE.UU.', 'EEUU'], it: ['Stati Uniti', 'USA'], fr: ['États-Unis', 'États Unis'],
    de: ['Vereinigte Staaten', 'USA'], pt: ['Estados Unidos', 'EUA'], hu: ['Egyesült Államok', 'USA'],
  },
  'Uruguay': {
    es: ['Uruguay'], it: ['Uruguay'], fr: ['Uruguay'],
    de: ['Uruguay'], pt: ['Uruguai'], hu: ['Uruguay'],
  },
  'Uzbekistan': {
    es: ['Uzbekistán'], it: ['Uzbekistan'], fr: ['Ouzbékistan'],
    de: ['Usbekistan'], pt: ['Uzbequistão'], hu: ['Üzbegisztán'],
  },
  'Vanuatu': {
    es: ['Vanuatu'], it: ['Vanuatu'], fr: ['Vanuatu'],
    de: ['Vanuatu'], pt: ['Vanuatu'], hu: ['Vanuatu'],
  },
  'Vatican City': {
    es: ['Ciudad del Vaticano', 'Vaticano'], it: ['Città del Vaticano', 'Vaticano'], fr: ['Vatican', 'Cité du Vatican'],
    de: ['Vatikanstadt', 'Vatikan'], pt: ['Cidade do Vaticano', 'Vaticano'], hu: ['Vatikán', 'Vatikánváros'],
  },
  'Venezuela': {
    es: ['Venezuela'], it: ['Venezuela'], fr: ['Venezuela'],
    de: ['Venezuela'], pt: ['Venezuela'], hu: ['Venezuela'],
  },
  'Vietnam': {
    es: ['Vietnam'], it: ['Vietnam'], fr: ['Viêt Nam', 'Vietnam'],
    de: ['Vietnam'], pt: ['Vietname', 'Vietnã'], hu: ['Vietnam'],
  },
  'Western Sahara': {
    es: ['Sáhara Occidental'], it: ['Sahara Occidentale'], fr: ['Sahara occidental'],
    de: ['Westsahara'], pt: ['Saara Ocidental'], hu: ['Nyugat-Szahara'],
  },
  'Yemen': {
    es: ['Yemen'], it: ['Yemen'], fr: ['Yémen'],
    de: ['Jemen'], pt: ['Iémen', 'Iêmen'], hu: ['Jemen'],
  },
  'Zambia': {
    es: ['Zambia'], it: ['Zambia'], fr: ['Zambie'],
    de: ['Sambia'], pt: ['Zâmbia'], hu: ['Zambia'],
  },
  'Zimbabwe': {
    es: ['Zimbabue', 'Zimbabwe'], it: ['Zimbabwe'], fr: ['Zimbabwe'],
    de: ['Simbabwe', 'Zimbabwe'], pt: ['Zimbabué', 'Zimbábue'], hu: ['Zimbabwe'],
  },
};
