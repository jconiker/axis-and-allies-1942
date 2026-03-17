// Starting unit placements for A&A 1942 2nd Edition
// Format: units[territoryId] = [ { nation, type, count }, ... ]
// Multiple nations can be in the same territory/sea zone

function u(nation, type, count) { return { nation, type, count }; }

export const SCENARIO_1942 = {
  name: 'Axis & Allies 1942 — Second Edition',
  startYear: 1942,

  // Initial IPC overrides (if different from NATIONS.startingIPC)
  ipc: {
    ussr: 24, germany: 40, uk: 31, japan: 30, usa: 42, australia: 10
  },

  // units: { territoryId: [ {nation, type, count}, ... ] }
  units: {
    // ── USSR LAND ──
    russia:           [ u('ussr','infantry',8), u('ussr','armor',4), u('ussr','antiair',1), u('ussr','fighter',1) ],
    karelia:          [ u('ussr','infantry',4), u('ussr','fighter',1), u('ussr','bomber',1) ],
    caucasus:         [ u('ussr','infantry',5), u('ussr','armor',2), u('ussr','antiair',1) ],
    archangel:        [ u('ussr','infantry',2) ],
    kazakh:           [ u('ussr','infantry',3) ],
    novosibirsk:      [ u('ussr','infantry',2) ],
    evenki:           [ u('ussr','infantry',1) ],
    yakut:            [ u('ussr','infantry',1) ],
    soviet_far_east:  [ u('ussr','infantry',2) ],
    buryatia:         [ u('ussr','infantry',1) ],

    // ── GERMANY LAND ──
    germany:          [ u('germany','infantry',5), u('germany','armor',2), u('germany','antiair',1), u('germany','fighter',2), u('germany','bomber',1) ],
    western_europe:   [ u('germany','infantry',4), u('germany','armor',2), u('germany','antiair',1) ],
    norway:           [ u('germany','infantry',3) ],
    finland:          [ u('germany','infantry',3) ],
    baltic_states:    [ u('germany','infantry',3), u('germany','armor',1) ],
    eastern_europe:   [ u('germany','infantry',3), u('germany','armor',3) ],
    belorussia:       [ u('germany','infantry',6), u('germany','armor',3), u('germany','fighter',1) ],
    ukraine:          [ u('germany','infantry',5), u('germany','armor',4), u('germany','fighter',1) ],
    romania_bulgaria: [ u('germany','infantry',4), u('germany','armor',2), u('germany','antiair',1) ],
    southern_europe:  [ u('germany','infantry',4), u('germany','armor',1), u('germany','antiair',1), u('germany','fighter',1) ],
    north_africa:     [ u('germany','infantry',3), u('germany','armor',4), u('germany','fighter',1) ],

    // ── UK LAND ──
    united_kingdom:   [ u('uk','infantry',2), u('uk','antiair',1), u('uk','fighter',2), u('uk','bomber',1) ],
    egypt:            [ u('uk','infantry',4), u('uk','armor',1), u('uk','fighter',1) ],
    india:            [ u('uk','infantry',4), u('uk','armor',1), u('uk','fighter',1) ],
    south_africa:     [ u('uk','infantry',1) ],
    west_africa:      [ u('uk','infantry',1) ],
    east_africa:      [ u('uk','infantry',1) ],
    anglo_egypt_sudan:[ u('uk','infantry',1) ],
    trans_jordan:     [ u('uk','infantry',1) ],
    persia:           [ u('uk','infantry',1) ],
    new_zealand:      [ u('uk','infantry',1) ],

    // ── AUSTRALIA LAND ──
    australia:        [ u('australia','infantry',3), u('australia','fighter',1) ],
    new_guinea:       [ u('australia','infantry',1) ],

    // ── JAPAN LAND ──
    japan:            [ u('japan','infantry',3), u('japan','antiair',1), u('japan','fighter',3), u('japan','bomber',2) ],
    manchuria:        [ u('japan','infantry',6), u('japan','armor',2) ],
    korea:            [ u('japan','infantry',4) ],
    french_indochina: [ u('japan','infantry',4), u('japan','armor',1) ],
    kwangtung:        [ u('japan','infantry',4), u('japan','armor',2) ],
    kiangsu:          [ u('japan','infantry',3) ],
    malaya:           [ u('japan','infantry',3) ],
    borneo:           [ u('japan','infantry',3) ],
    dutch_east_indies:[ u('japan','infantry',4) ],
    philippines:      [ u('japan','infantry',4) ],
    solomon_islands:  [ u('japan','infantry',2) ],

    // ── USA LAND ──
    eastern_us:       [ u('usa','infantry',5), u('usa','armor',1), u('usa','antiair',1), u('usa','fighter',2), u('usa','bomber',1) ],
    central_us:       [ u('usa','infantry',3) ],
    western_us:       [ u('usa','infantry',3), u('usa','armor',1), u('usa','fighter',2) ],
    alaska:           [ u('usa','infantry',1) ],
    hawaii:           [ u('usa','infantry',2), u('usa','fighter',2) ],
    midway:           [ u('usa','infantry',1) ],

    // ── NAVAL ──
    // sz_5 has BOTH USSR destroyer and Germany/UK forces
    sz_5:  [ u('germany','cruiser',1), u('germany','submarine',1), u('ussr','destroyer',1) ],
    sz_6:  [ u('uk','carrier',1), u('uk','fighter',1), u('uk','destroyer',1) ],
    sz_7:  [ u('uk','transport',1), u('uk','destroyer',1) ],
    sz_8:  [ u('germany','battleship',1), u('germany','cruiser',1), u('usa','transport',1) ],
    sz_12: [ u('uk','cruiser',1), u('uk','transport',1) ],
    sz_14: [ u('germany','submarine',1) ],
    sz_15: [ u('germany','submarine',1), u('uk','destroyer',1) ],
    sz_19: [ u('japan','battleship',1), u('japan','carrier',2), u('japan','fighter',3), u('japan','destroyer',1), u('japan','submarine',1) ],
    sz_20: [ u('uk','transport',2), u('uk','destroyer',2), u('uk','battleship',1) ],
    sz_26: [ u('usa','carrier',1), u('usa','fighter',1), u('usa','battleship',1), u('usa','destroyer',2), u('usa','submarine',1), u('usa','transport',2), u('usa','cruiser',1) ],
    sz_36: [ u('japan','destroyer',1), u('japan','transport',4), u('japan','battleship',1), u('japan','cruiser',1) ],
    sz_37: [ u('japan','destroyer',1), u('uk','destroyer',1), u('uk','transport',1) ],
    sz_41: [ u('japan','destroyer',2), u('japan','transport',2), u('japan','submarine',1) ],
    sz_56: [ u('usa','battleship',1), u('usa','destroyer',1) ],
    sz_61: [ u('japan','destroyer',1), u('japan','carrier',1), u('japan','fighter',1) ],
    sz_10: [ u('usa','carrier',1), u('usa','destroyer',1), u('usa','fighter',1) ],
  }
};
