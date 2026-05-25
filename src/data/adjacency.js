// World country adjacency graph
// Keys and values are canonical display names
// Built from Natural Earth borders + manual sea/proximity links per spec

const RAW_ADJACENCY = {
  'Afghanistan': ['China', 'Iran', 'Pakistan', 'Tajikistan', 'Turkmenistan', 'Uzbekistan'],
  'Albania': ['Greece', 'Kosovo', 'Montenegro', 'North Macedonia'],
  'Andorra': ['France', 'Spain'],
  'Algeria': ['Libya', 'Mali', 'Mauritania', 'Morocco', 'Niger', 'Tunisia', 'Western Sahara'],
  'Angola': ['Democratic Republic of the Congo', 'Namibia', 'Republic of the Congo', 'Zambia'],
  'Antigua and Barbuda': ['Dominica', 'Saint Kitts and Nevis'],
  'Argentina': ['Bolivia', 'Brazil', 'Chile', 'Paraguay', 'Uruguay'],
  'Armenia': ['Azerbaijan', 'Georgia', 'Iran', 'Turkey'],
  'Australia': ['Indonesia', 'New Zealand', 'Papua New Guinea', 'Timor-Leste'],
  'Austria': ['Czech Republic', 'Germany', 'Hungary', 'Italy', 'Liechtenstein', 'Slovakia', 'Slovenia', 'Switzerland'],
  'Azerbaijan': ['Armenia', 'Georgia', 'Iran', 'Russia', 'Turkey'],
  'Bahamas': ['Cuba', 'United States'],
  'Bahrain': ['Saudi Arabia'],
  'Barbados': ['Saint Lucia', 'Saint Vincent and the Grenadines'],
  'Bangladesh': ['India', 'Myanmar'],
  'Belarus': ['Latvia', 'Lithuania', 'Poland', 'Russia', 'Ukraine'],
  'Belgium': ['France', 'Germany', 'Luxembourg', 'Netherlands', 'United Kingdom'],
  'Belize': ['Guatemala', 'Mexico'],
  'Benin': ['Burkina Faso', 'Niger', 'Nigeria', 'Togo'],
  'Bhutan': ['China', 'India'],
  'Bolivia': ['Argentina', 'Brazil', 'Chile', 'Paraguay', 'Peru'],
  'Bosnia and Herzegovina': ['Croatia', 'Montenegro', 'Serbia'],
  'Botswana': ['Namibia', 'South Africa', 'Zambia', 'Zimbabwe'],
  'Brazil': ['Argentina', 'Bolivia', 'Colombia', 'French Guiana', 'Guyana', 'Paraguay', 'Peru', 'Suriname', 'Uruguay', 'Venezuela'],
  'Brunei': ['Malaysia'],
  'Bulgaria': ['Greece', 'North Macedonia', 'Romania', 'Serbia', 'Turkey'],
  'Burkina Faso': ['Benin', "Côte d'Ivoire", 'Ghana', 'Mali', 'Niger', 'Togo'],
  'Burundi': ['Democratic Republic of the Congo', 'Rwanda', 'Tanzania'],
  'Cambodia': ['Laos', 'Thailand', 'Vietnam'],
  'Cameroon': ['Central African Republic', 'Chad', 'Equatorial Guinea', 'Gabon', 'Nigeria', 'Republic of the Congo', 'São Tomé and Príncipe'],
  'Canada': ['Greenland', 'United States'],
  'Cape Verde': ['Senegal', 'Mauritania'],
  'Central African Republic': ['Cameroon', 'Chad', 'Democratic Republic of the Congo', 'Republic of the Congo', 'South Sudan', 'Sudan'],
  'Chad': ['Cameroon', 'Central African Republic', 'Libya', 'Niger', 'Nigeria', 'Sudan'],
  'Chile': ['Argentina', 'Bolivia', 'Peru'],
  'China': ['Afghanistan', 'Bhutan', 'India', 'Japan', 'Kazakhstan', 'Kyrgyzstan', 'Laos', 'Mongolia', 'Myanmar', 'Nepal', 'North Korea', 'Pakistan', 'Philippines', 'Russia', 'Taiwan', 'Tajikistan', 'Vietnam'],
  'Colombia': ['Brazil', 'Ecuador', 'Panama', 'Peru', 'Venezuela'],
  'Comoros': ['Madagascar', 'Mozambique'],
  'Costa Rica': ['Nicaragua', 'Panama'],
  "Côte d'Ivoire": ['Burkina Faso', 'Ghana', 'Guinea', 'Liberia', 'Mali'],
  'Croatia': ['Bosnia and Herzegovina', 'Hungary', 'Montenegro', 'Serbia', 'Slovenia'],
  'Cuba': ['Bahamas', 'Haiti', 'Jamaica', 'Mexico', 'United States'],
  'Cyprus': ['Lebanon', 'Syria', 'Turkey'],
  'Czech Republic': ['Austria', 'Germany', 'Poland', 'Slovakia'],
  'Democratic Republic of the Congo': ['Angola', 'Burundi', 'Central African Republic', 'Republic of the Congo', 'Rwanda', 'South Sudan', 'Tanzania', 'Uganda', 'Zambia'],
  'Denmark': ['Germany'],
  'Djibouti': ['Eritrea', 'Ethiopia', 'Somalia'],
  'Dominica': ['Antigua and Barbuda', 'Saint Lucia'],
  'Dominican Republic': ['Haiti'],
  'Ecuador': ['Colombia', 'Peru'],
  'Egypt': ['Israel', 'Libya', 'Palestine', 'Sudan'],
  'El Salvador': ['Guatemala', 'Honduras'],
  'Equatorial Guinea': ['Cameroon', 'Gabon', 'São Tomé and Príncipe'],
  'Eritrea': ['Djibouti', 'Ethiopia', 'Sudan'],
  'Estonia': ['Latvia', 'Russia'],
  'Eswatini': ['Mozambique', 'South Africa'],
  'Ethiopia': ['Djibouti', 'Eritrea', 'Kenya', 'Somalia', 'South Sudan', 'Sudan'],
  'Fiji': ['New Zealand', 'Samoa', 'Solomon Islands', 'Tonga', 'Vanuatu'],
  'Finland': ['Norway', 'Russia', 'Sweden'],
  'France': ['Andorra', 'Belgium', 'Germany', 'Italy', 'Luxembourg', 'Monaco', 'Spain', 'Switzerland', 'United Kingdom'],
  'French Guiana': ['Brazil', 'Suriname'],
  'Gabon': ['Cameroon', 'Equatorial Guinea', 'Republic of the Congo', 'São Tomé and Príncipe'],
  'Gambia': ['Senegal'],
  'Georgia': ['Armenia', 'Azerbaijan', 'Russia', 'Turkey'],
  'Germany': ['Austria', 'Belgium', 'Czech Republic', 'Denmark', 'France', 'Luxembourg', 'Netherlands', 'Poland', 'Switzerland'],
  'Ghana': ['Burkina Faso', "Côte d'Ivoire", 'Togo'],
  'Greece': ['Albania', 'Bulgaria', 'North Macedonia', 'Turkey'],
  'Greenland': ['Canada', 'Iceland'],
  'Grenada': ['Saint Vincent and the Grenadines', 'Trinidad and Tobago'],
  'Guatemala': ['Belize', 'El Salvador', 'Honduras', 'Mexico'],
  'Guinea': ["Côte d'Ivoire", 'Guinea-Bissau', 'Liberia', 'Mali', 'Senegal', 'Sierra Leone'],
  'Guinea-Bissau': ['Guinea', 'Senegal'],
  'Guyana': ['Brazil', 'Suriname', 'Venezuela'],
  'Haiti': ['Cuba', 'Dominican Republic', 'Jamaica'],
  'Honduras': ['El Salvador', 'Guatemala', 'Nicaragua'],
  'Hungary': ['Austria', 'Croatia', 'Romania', 'Serbia', 'Slovakia', 'Slovenia', 'Ukraine'],
  'Iceland': ['Greenland', 'Norway', 'United Kingdom'], // island-nation sea links
  'India': ['Bangladesh', 'Bhutan', 'China', 'Maldives', 'Myanmar', 'Nepal', 'Pakistan', 'Sri Lanka'],
  'Indonesia': ['Australia', 'Malaysia', 'Palau', 'Papua New Guinea', 'Philippines', 'Timor-Leste'],
  'Iran': ['Afghanistan', 'Armenia', 'Azerbaijan', 'Iraq', 'Pakistan', 'Turkey', 'Turkmenistan'],
  'Iraq': ['Iran', 'Jordan', 'Kuwait', 'Saudi Arabia', 'Syria', 'Turkey'],
  'Ireland': ['United Kingdom'],
  'Israel': ['Egypt', 'Jordan', 'Lebanon', 'Palestine', 'Syria'],
  'Italy': ['Austria', 'France', 'Malta', 'San Marino', 'Slovenia', 'Switzerland', 'Vatican City'],
  'Jamaica': ['Cuba', 'Haiti'],
  'Japan': ['China', 'North Korea', 'Russia', 'South Korea'],
  'Jordan': ['Iraq', 'Israel', 'Palestine', 'Saudi Arabia', 'Syria'],
  'Kazakhstan': ['China', 'Kyrgyzstan', 'Russia', 'Turkmenistan', 'Uzbekistan'],
  'Kenya': ['Ethiopia', 'Seychelles', 'Somalia', 'South Sudan', 'Tanzania', 'Uganda'],
  'Kosovo': ['Albania', 'Montenegro', 'North Macedonia', 'Serbia'],
  'Kuwait': ['Iraq', 'Saudi Arabia'],
  'Kyrgyzstan': ['China', 'Kazakhstan', 'Tajikistan', 'Uzbekistan'],
  'Laos': ['Cambodia', 'China', 'Myanmar', 'Thailand', 'Vietnam'],
  'Latvia': ['Belarus', 'Estonia', 'Lithuania', 'Russia'],
  'Lebanon': ['Cyprus', 'Israel', 'Syria'],
  'Lesotho': ['South Africa'],
  'Liberia': ["Côte d'Ivoire", 'Guinea', 'Sierra Leone'],
  'Libya': ['Algeria', 'Chad', 'Egypt', 'Niger', 'Sudan', 'Tunisia'],
  'Liechtenstein': ['Austria', 'Switzerland'],
  'Lithuania': ['Belarus', 'Latvia', 'Poland', 'Russia'],
  'Luxembourg': ['Belgium', 'France', 'Germany'],
  'Madagascar': ['Comoros', 'Mauritius', 'Mozambique', 'Seychelles'],
  'Malawi': ['Mozambique', 'Tanzania', 'Zambia'],
  'Malaysia': ['Brunei', 'Indonesia', 'Philippines', 'Singapore', 'Thailand'],
  'Maldives': ['India', 'Sri Lanka'],
  'Mali': ['Algeria', 'Burkina Faso', "Côte d'Ivoire", 'Guinea', 'Mauritania', 'Niger', 'Senegal'],
  'Malta': ['Algeria', 'Italy', 'Tunisia'],
  'Marshall Islands': ['Micronesia', 'Solomon Islands'],
  'Mauritania': ['Algeria', 'Mali', 'Morocco', 'Senegal', 'Western Sahara','Cape Verde'],
  'Mauritius': ['Madagascar'],
  'Mexico': ['Belize', 'Cuba', 'Guatemala', 'United States'],
  'Micronesia': ['Marshall Islands', 'Papua New Guinea', 'Solomon Islands'],
  'Moldova': ['Romania', 'Ukraine'],
  'Monaco': ['France'],
  'Mongolia': ['China', 'Russia'],
  'Montenegro': ['Albania', 'Bosnia and Herzegovina', 'Croatia', 'Kosovo', 'Serbia'],
  'Morocco': ['Algeria', 'Mauritania', 'Spain', 'Western Sahara'],
  'Mozambique': ['Comoros', 'Eswatini', 'Madagascar', 'Malawi', 'South Africa', 'Tanzania', 'Zambia', 'Zimbabwe'],
  'Myanmar': ['Bangladesh', 'China', 'India', 'Laos', 'Thailand'],
  'Namibia': ['Angola', 'Botswana', 'South Africa', 'Zambia'],
  'Nepal': ['China', 'India'],
  'Netherlands': ['Belgium', 'Germany', 'United Kingdom'],
  'New Zealand': ['Australia', 'Fiji', 'Tonga'],
  'Nicaragua': ['Costa Rica', 'Honduras'],
  'Niger': ['Algeria', 'Benin', 'Burkina Faso', 'Chad', 'Libya', 'Mali', 'Nigeria'],
  'Nigeria': ['Benin', 'Cameroon', 'Chad', 'Niger', 'São Tomé and Príncipe'],
  'North Korea': ['China', 'Japan', 'Russia', 'South Korea'],
  'North Macedonia': ['Albania', 'Bulgaria', 'Greece', 'Kosovo', 'Serbia'],
  'Norway': ['Finland', 'Iceland', 'Russia', 'Sweden'], // Iceland: island-nation sea link
  'Oman': ['Saudi Arabia', 'United Arab Emirates', 'Yemen'],
  'Pakistan': ['Afghanistan', 'China', 'India', 'Iran'],
  'Palau': ['Indonesia', 'Philippines'],
  'Palestine': ['Egypt', 'Israel', 'Jordan'],
  'Panama': ['Colombia', 'Costa Rica'],
  'Papua New Guinea': ['Australia', 'Indonesia', 'Micronesia', 'Solomon Islands'],
  'Paraguay': ['Argentina', 'Bolivia', 'Brazil'],
  'Peru': ['Bolivia', 'Brazil', 'Chile', 'Colombia', 'Ecuador'],
  'Philippines': ['China', 'Indonesia', 'Malaysia', 'Palau', 'Taiwan', 'Vietnam'],
  'Poland': ['Belarus', 'Czech Republic', 'Germany', 'Lithuania', 'Russia', 'Slovakia', 'Ukraine'],
  'Portugal': ['Spain'],
  'Qatar': ['Saudi Arabia'],
  'Republic of the Congo': ['Angola', 'Cameroon', 'Central African Republic', 'Democratic Republic of the Congo', 'Gabon'],
  'Romania': ['Bulgaria', 'Hungary', 'Moldova', 'Serbia', 'Ukraine'],
  'Russia': ['Azerbaijan', 'Belarus', 'China', 'Estonia', 'Finland', 'Georgia', 'Japan', 'Kazakhstan', 'Latvia', 'Lithuania', 'Mongolia', 'North Korea', 'Norway', 'Poland', 'Ukraine'],
  'Rwanda': ['Burundi', 'Democratic Republic of the Congo', 'Tanzania', 'Uganda'],
  'Saint Kitts and Nevis': ['Antigua and Barbuda'],
  'Saint Lucia': ['Barbados', 'Dominica', 'Saint Vincent and the Grenadines'],
  'Saint Vincent and the Grenadines': ['Barbados', 'Grenada', 'Saint Lucia'],
  'Samoa': ['Fiji', 'Tonga'],
  'São Tomé and Príncipe': ['Cameroon', 'Equatorial Guinea', 'Gabon', 'Nigeria'],
  'San Marino': ['Italy'],
  'Saudi Arabia': ['Bahrain', 'Iraq', 'Jordan', 'Kuwait', 'Oman', 'Qatar', 'United Arab Emirates', 'Yemen'],
  'Senegal': ['Gambia', 'Guinea', 'Guinea-Bissau', 'Mali', 'Mauritania', 'Cape Verde'],
  'Serbia': ['Albania', 'Bosnia and Herzegovina', 'Bulgaria', 'Croatia', 'Hungary', 'Kosovo', 'Montenegro', 'North Macedonia', 'Romania'],
  'Seychelles': ['Kenya', 'Madagascar', 'Somalia', 'Tanzania'],
  'Sierra Leone': ['Guinea', 'Liberia'],
  'Singapore': ['Malaysia'],
  'Slovakia': ['Austria', 'Czech Republic', 'Hungary', 'Poland', 'Ukraine'],
  'Slovenia': ['Austria', 'Croatia', 'Hungary', 'Italy'],
  'Solomon Islands': ['Fiji', 'Marshall Islands', 'Micronesia', 'Papua New Guinea', 'Vanuatu'],
  'Somalia': ['Djibouti', 'Ethiopia', 'Kenya', 'Seychelles'],
  'South Africa': ['Botswana', 'Eswatini', 'Lesotho', 'Mozambique', 'Namibia', 'Zimbabwe'],
  'South Korea': ['Japan', 'North Korea'],
  'South Sudan': ['Central African Republic', 'Democratic Republic of the Congo', 'Ethiopia', 'Kenya', 'Sudan', 'Uganda'],
  'Spain': ['Andorra', 'France', 'Morocco', 'Portugal'],
  'Sri Lanka': ['India', 'Maldives'],
  'Sudan': ['Central African Republic', 'Chad', 'Egypt', 'Eritrea', 'Ethiopia', 'Libya', 'South Sudan'],
  'Suriname': ['Brazil', 'French Guiana', 'Guyana'],
  'Sweden': ['Finland', 'Norway'],
  'Switzerland': ['Austria', 'France', 'Germany', 'Italy', 'Liechtenstein'],
  'Syria': ['Cyprus', 'Iraq', 'Israel', 'Jordan', 'Lebanon', 'Turkey'],
  'Taiwan': ['China', 'Philippines'],
  'Tajikistan': ['Afghanistan', 'China', 'Kyrgyzstan', 'Uzbekistan'],
  'Tanzania': ['Burundi', 'Democratic Republic of the Congo', 'Kenya', 'Malawi', 'Mozambique', 'Rwanda', 'Seychelles', 'Uganda', 'Zambia'],
  'Thailand': ['Cambodia', 'Laos', 'Malaysia', 'Myanmar'],
  'Timor-Leste': ['Australia', 'Indonesia'],
  'Togo': ['Benin', 'Burkina Faso', 'Ghana'],
  'Tonga': ['Fiji', 'New Zealand', 'Samoa'],
  'Trinidad and Tobago': ['Grenada', 'Venezuela'],
  'Tunisia': ['Algeria', 'Libya', 'Malta'],
  'Turkey': ['Armenia', 'Azerbaijan', 'Bulgaria', 'Cyprus', 'Georgia', 'Greece', 'Iran', 'Iraq', 'Syria'],
  'Turkmenistan': ['Afghanistan', 'Iran', 'Kazakhstan', 'Uzbekistan'],
  'Uganda': ['Democratic Republic of the Congo', 'Kenya', 'Rwanda', 'South Sudan', 'Tanzania'],
  'Ukraine': ['Belarus', 'Hungary', 'Moldova', 'Poland', 'Romania', 'Russia', 'Slovakia'],
  'United Arab Emirates': ['Oman', 'Saudi Arabia'],
  'United Kingdom': ['Belgium', 'France', 'Iceland', 'Ireland', 'Netherlands'],
  'United States': ['Bahamas', 'Canada', 'Cuba', 'Mexico'],
  'Uruguay': ['Argentina', 'Brazil'],
  'Uzbekistan': ['Afghanistan', 'Kazakhstan', 'Kyrgyzstan', 'Tajikistan', 'Turkmenistan'],
  'Vanuatu': ['Fiji', 'Solomon Islands'],
  'Vatican City': ['Italy'],
  'Venezuela': ['Brazil', 'Colombia', 'Guyana', 'Trinidad and Tobago'],
  'Vietnam': ['Cambodia', 'China', 'Laos', 'Philippines'],
  'Western Sahara': ['Algeria', 'Mauritania', 'Morocco'],
  'Yemen': ['Oman', 'Saudi Arabia'],
  'Zambia': ['Angola', 'Botswana', 'Democratic Republic of the Congo', 'Malawi', 'Mozambique', 'Namibia', 'Tanzania', 'Zimbabwe'],
  'Zimbabwe': ['Botswana', 'Mozambique', 'South Africa', 'Zambia'],
};

// Bering Strait link (Russia ↔ USA) — only active in World Domination
export const BERING_STRAIT = ['Russia', 'United States'];

/** Build a symmetric adjacency map */
function buildAdjacency(raw) {
  const map = new Map();
  for (const [country, neighbours] of Object.entries(raw)) {
    if (!map.has(country)) map.set(country, new Set());
    for (const n of neighbours) {
      map.get(country).add(n);
      if (!map.has(n)) map.set(n, new Set());
      map.get(n).add(country);
    }
  }
  return map;
}

export const WORLD_ADJACENCY = buildAdjacency(RAW_ADJACENCY);

/** Get neighbours of a country, optionally including Bering Strait */
export function getNeighbours(country, { beringStrait = false } = {}) {
  const neighbours = new Set(WORLD_ADJACENCY.get(country) ?? []);
  if (beringStrait && BERING_STRAIT.includes(country)) {
    const other = BERING_STRAIT.find(c => c !== country);
    if (other) neighbours.add(other);
  }
  return neighbours;
}

/** Check if two countries are neighbours */
export function areNeighbours(a, b, opts = {}) {
  return getNeighbours(a, opts).has(b);
}

/** All playable world country names */
export const WORLD_COUNTRIES = [...WORLD_ADJACENCY.keys()].filter(
  c => !['Cape Verde', 'Comoros', 'Seychelles', 'São Tomé and Príncipe',
         'Marshall Islands', 'Micronesia', 'Samoa', 'Tonga', 'Palau',
         'Solomon Islands', 'Vanuatu', 'Fiji', 'Papua New Guinea',
         'Mauritius', 'Jamaica', 'Cuba', 'Dominican Republic', 'Haiti',
         'Trinidad and Tobago', 'Brunei', 'Timor-Leste'].includes(c)
);

// Actually keep all countries in the adjacency graph but flag unplayable in aliases.js
export const ALL_WORLD_COUNTRIES = [...WORLD_ADJACENCY.keys()];
