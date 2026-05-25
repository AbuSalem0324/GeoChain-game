// US States adjacency graph
// 50 states + DC; Canada and Mexico as valid foreign entries for river modes

const RAW_STATE_ADJACENCY = {
  'Alabama': ['Florida', 'Georgia', 'Mississippi', 'Tennessee',],
  'Alaska': ['Washington', 'Canada'],
  'Arizona': ['California', 'Colorado', 'Nevada', 'New Mexico', 'Utah', 'Mexico'],
  'Arkansas': ['Louisiana', 'Mississippi', 'Missouri', 'Oklahoma', 'Tennessee', 'Texas'],
  'California': ['Arizona', 'Nevada', 'Oregon'],
  'Colorado': ['Arizona', 'Kansas', 'Nebraska', 'New Mexico', 'Oklahoma', 'Utah', 'Wyoming'],
  'Connecticut': ['Massachusetts', 'New York', 'Rhode Island'],
  'Delaware': ['Maryland', 'New Jersey', 'Pennsylvania'],
  'District of Columbia': ['Maryland', 'Virginia'],
  'Florida': ['Alabama', 'Georgia'],
  'Georgia': ['Alabama', 'Florida', 'North Carolina', 'South Carolina', 'Tennessee'],
  'Hawaii':['California'],
  'Idaho': ['Montana', 'Nevada', 'Oregon', 'Utah', 'Washington', 'Wyoming', 'Canada'],
  'Illinois': ['Indiana', 'Iowa', 'Kentucky', 'Missouri', 'Wisconsin'],
  'Indiana': ['Illinois', 'Kentucky', 'Michigan', 'Ohio'],
  'Iowa': ['Illinois', 'Minnesota', 'Missouri', 'Nebraska', 'South Dakota', 'Wisconsin'],
  'Kansas': ['Colorado', 'Missouri', 'Nebraska', 'Oklahoma'],
  'Kentucky': ['Illinois', 'Indiana', 'Missouri', 'Ohio', 'Tennessee', 'Virginia', 'West Virginia'],
  'Louisiana': ['Arkansas', 'Mississippi', 'Texas'],
  'Maine': ['New Hampshire', 'Canada'],
  'Maryland': ['Delaware', 'District of Columbia', 'Pennsylvania', 'Virginia', 'West Virginia'],
  'Massachusetts': ['Connecticut', 'New Hampshire', 'New York', 'Rhode Island', 'Vermont'],
  'Michigan': ['Illinois', 'Indiana', 'Minnesota', 'Ohio', 'Wisconsin', 'Canada'],
  'Minnesota': ['Iowa', 'North Dakota', 'South Dakota', 'Wisconsin', 'Canada'],
  'Mississippi': ['Alabama', 'Arkansas', 'Louisiana', 'Tennessee'],
  'Missouri': ['Arkansas', 'Illinois', 'Iowa', 'Kansas', 'Kentucky', 'Nebraska', 'Oklahoma', 'Tennessee'],
  'Montana': ['Idaho', 'North Dakota', 'South Dakota', 'Wyoming', 'Canada'],
  'Nebraska': ['Colorado', 'Iowa', 'Kansas', 'Missouri', 'South Dakota', 'Wyoming'],
  'Nevada': ['Arizona', 'California', 'Idaho', 'Oregon', 'Utah'],
  'New Hampshire': ['Maine', 'Massachusetts', 'Vermont', 'Canada'],
  'New Jersey': ['Delaware', 'New York', 'Pennsylvania'],
  'New Mexico': ['Arizona', 'Colorado', 'Oklahoma', 'Texas', 'Mexico'],
  'New York': ['Connecticut', 'Massachusetts', 'New Jersey', 'Pennsylvania', 'Vermont', 'Canada'],
  'North Carolina': ['Georgia', 'South Carolina', 'Tennessee', 'Virginia'],
  'North Dakota': ['Minnesota', 'Montana', 'South Dakota', 'Canada'],
  'Ohio': ['Indiana', 'Kentucky', 'Michigan', 'Pennsylvania', 'West Virginia', 'Canada'],
  'Oklahoma': ['Arkansas', 'Colorado', 'Kansas', 'Missouri', 'New Mexico', 'Texas'],
  'Oregon': ['California', 'Idaho', 'Nevada', 'Washington'],
  'Pennsylvania': ['Delaware', 'Maryland', 'New Jersey', 'New York', 'Ohio', 'West Virginia', 'Canada'],
  'Rhode Island': ['Connecticut', 'Massachusetts'],
  'South Carolina': ['Georgia', 'North Carolina'],
  'South Dakota': ['Iowa', 'Minnesota', 'Montana', 'Nebraska', 'North Dakota', 'Wyoming'],
  'Tennessee': ['Alabama', 'Arkansas', 'Georgia', 'Kentucky', 'Mississippi', 'Missouri', 'North Carolina', 'Virginia'],
  'Texas': ['Arkansas', 'Louisiana', 'New Mexico', 'Oklahoma', 'Mexico'],
  'Utah': ['Arizona', 'Colorado', 'Idaho', 'Nevada', 'New Mexico', 'Wyoming'],
  'Vermont': ['Massachusetts', 'New Hampshire', 'New York', 'Canada'],
  'Virginia': ['District of Columbia', 'Kentucky', 'Maryland', 'North Carolina', 'Tennessee', 'West Virginia'],
  'Washington': ['Idaho', 'Oregon', 'Canada'],
  'West Virginia': ['Kentucky', 'Maryland', 'Ohio', 'Pennsylvania', 'Virginia'],
  'Wisconsin': ['Illinois', 'Iowa', 'Michigan', 'Minnesota'],
  'Wyoming': ['Colorado', 'Idaho', 'Montana', 'Nebraska', 'South Dakota', 'Utah'],
  'Canada': ['Alaska', 'Idaho', 'Maine', 'Michigan', 'Minnesota', 'Montana', 'New Hampshire', 'New York', 'North Dakota', 'Ohio', 'Pennsylvania', 'Vermont', 'Washington'],
  'Mexico': ['Arizona', 'New Mexico', 'Texas'],
};

function buildAdjacency(raw) {
  const map = new Map();
  for (const [state, neighbours] of Object.entries(raw)) {
    if (!map.has(state)) map.set(state, new Set());
    for (const n of neighbours) {
      map.get(state).add(n);
      if (!map.has(n)) map.set(n, new Set());
      map.get(n).add(state);
    }
  }
  return map;
}

export const STATE_ADJACENCY = buildAdjacency(RAW_STATE_ADJACENCY);

// 50 states + District of Columbia = 51 playable entries (per spec)
export const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'District of Columbia', 'Florida', 'Georgia',
  'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
  'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
  'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia',
  'Washington', 'West Virginia', 'Wisconsin', 'Wyoming',
];

export function getStateNeighbours(state) {
  return new Set(STATE_ADJACENCY.get(state) ?? []);
}

export function statesAreNeighbours(a, b) {
  return getStateNeighbours(a).has(b);
}
