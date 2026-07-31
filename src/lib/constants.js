// GVMC Zones and Wards Mapping
// Based on official Greater Visakhapatnam Municipal Corporation data

const generateWards = (start, end) => {
  const wards = [];
  for (let i = start; i <= end; i++) {
    wards.push(`Ward ${i}`);
  }
  return wards;
};

export const GVMC_ZONES = [
  {
    name: 'North Zone',
    wards: generateWards(46, 65) // 20 wards
  },
  {
    name: 'Gajuwaka Zone',
    wards: generateWards(83, 101) // 19 wards
  },
  {
    name: 'East Zone',
    wards: generateWards(12, 29) // 18 wards
  },
  {
    name: 'West Zone',
    wards: generateWards(66, 82) // 17 wards
  },
  {
    name: 'South Zone',
    wards: generateWards(30, 45) // 16 wards
  },
  {
    name: 'Madhurawada Zone',
    wards: [...generateWards(6, 11), 'Ward 120'] // 7 wards
  },
  {
    name: 'Pendurthi Zone',
    wards: generateWards(113, 119) // 7 wards
  },
  {
    name: 'Anakapalli Zone',
    wards: generateWards(107, 112) // 6 wards
  },
  {
    name: 'Aganampudi Zone',
    wards: generateWards(102, 106) // 5 wards
  },
  {
    name: 'Bheemunipatnam Zone',
    wards: generateWards(1, 5) // 5 wards
  }
];

export const getAllWards = () => {
  return GVMC_ZONES.flatMap(zone => zone.wards);
};
