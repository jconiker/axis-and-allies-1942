export const TERRITORIES = {
  // ═══ AMERICAS ═══
  alaska: {
    id:'alaska', name:'Alaska', ipc:2, startOwner:'usa', type:'land', region:'americas',
    x:95, y:115,
    adjacent:['western_us','western_canada','sz_1','sz_56']
  },
  western_canada: {
    id:'western_canada', name:'Western Canada', ipc:1, startOwner:'uk', type:'land', region:'americas',
    x:170, y:145,
    adjacent:['alaska','central_canada','western_us','sz_1','sz_56','sz_57']
  },
  central_canada: {
    id:'central_canada', name:'Central Canada', ipc:1, startOwner:'uk', type:'land', region:'americas',
    x:245, y:155,
    adjacent:['western_canada','eastern_canada','western_us','central_us','sz_7']
  },
  eastern_canada: {
    id:'eastern_canada', name:'Eastern Canada', ipc:3, startOwner:'uk', type:'land', region:'americas',
    x:330, y:155,
    adjacent:['central_canada','eastern_us','sz_7','sz_8']
  },
  western_us: {
    id:'western_us', name:'Western United States', ipc:10, startOwner:'usa', type:'land', region:'americas',
    x:145, y:240,
    adjacent:['alaska','western_canada','central_us','sz_56','sz_57']
  },
  central_us: {
    id:'central_us', name:'Central United States', ipc:6, startOwner:'usa', type:'land', region:'americas',
    x:230, y:265,
    adjacent:['western_us','eastern_us','central_canada','central_america']
  },
  eastern_us: {
    id:'eastern_us', name:'Eastern United States', ipc:12, startOwner:'usa', type:'land', region:'americas',
    x:310, y:255,
    adjacent:['central_us','eastern_canada','central_america','sz_7','sz_8','sz_10']
  },
  central_america: {
    id:'central_america', name:'Central America', ipc:1, startOwner:'usa', type:'land', region:'americas',
    x:230, y:355,
    adjacent:['eastern_us','central_us','sz_8','sz_9','sz_56']
  },
  brazil: {
    id:'brazil', name:'Brazil', ipc:3, startOwner:'usa', type:'land', region:'americas',
    x:340, y:455,
    adjacent:['sz_8','sz_9','sz_10']
  },
  hawaii: {
    id:'hawaii', name:'Hawaiian Islands', ipc:1, startOwner:'usa', type:'land', region:'pacific',
    x:95, y:355,
    adjacent:['sz_53','sz_26']
  },
  midway: {
    id:'midway', name:'Midway Island', ipc:0, startOwner:'usa', type:'land', region:'pacific',
    x:50, y:290,
    adjacent:['sz_25','sz_26']
  },

  // ═══ EUROPE ═══

  // ── NEUTRAL TERRITORIES (can be captured by either side) ──
  austria: {
    id:'austria', name:'Austria', ipc:4, startOwner:'neutral', type:'land', region:'europe',
    neutral:true, x:660, y:255,
    adjacent:['germany','southern_europe','eastern_europe','romania_bulgaria']
  },
  yugoslavia: {
    id:'yugoslavia', name:'Yugoslavia', ipc:2, startOwner:'neutral', type:'land', region:'europe',
    neutral:true, x:670, y:340,
    adjacent:['southern_europe','eastern_europe','romania_bulgaria','austria','sz_14','sz_15']
  },
  turkey: {
    id:'turkey', name:'Turkey', ipc:2, startOwner:'neutral', type:'land', region:'middleeast',
    neutral:true, x:755, y:335,
    adjacent:['romania_bulgaria','sz_15','trans_jordan','persia']
  },
  sweden: {
    id:'sweden', name:'Sweden', ipc:2, startOwner:'neutral', type:'land', region:'europe',
    neutral:true, x:640, y:120,
    adjacent:['norway','finland','sz_5']
  },
  spain: {
    id:'spain', name:'Spain & Portugal', ipc:2, startOwner:'neutral', type:'land', region:'europe',
    neutral:true, x:500, y:295,
    adjacent:['western_europe','sz_6','sz_7','sz_8','sz_14']
  },

  united_kingdom: {
    id:'united_kingdom', name:'United Kingdom', ipc:8, startOwner:'uk', type:'land', region:'europe',
    x:510, y:185,
    adjacent:['norway','sz_5','sz_6','sz_7','sz_8']
  },
  norway: {
    id:'norway', name:'Norway', ipc:3, startOwner:'germany', type:'land', region:'europe',
    x:600, y:130,
    adjacent:['united_kingdom','finland','germany','sweden','karelia','sz_5','sz_6']
  },
  finland: {
    id:'finland', name:'Finland & Norway', ipc:1, startOwner:'germany', type:'land', region:'europe',
    x:675, y:120,
    adjacent:['norway','germany','sweden','karelia','baltic_states','sz_5']
  },
  germany: {
    id:'germany', name:'Germany', ipc:10, startOwner:'germany', type:'land', region:'europe',
    x:625, y:225,
    adjacent:['norway','finland','western_europe','southern_europe','eastern_europe','baltic_states','austria','sweden','sz_5']
  },
  western_europe: {
    id:'western_europe', name:'Western Europe', ipc:6, startOwner:'germany', type:'land', region:'europe',
    x:545, y:290,
    adjacent:['germany','southern_europe','spain','united_kingdom','north_africa','sz_5','sz_6','sz_7','sz_8']
  },
  southern_europe: {
    id:'southern_europe', name:'Southern Europe', ipc:4, startOwner:'germany', type:'land', region:'europe',
    x:635, y:305,
    adjacent:['germany','western_europe','eastern_europe','ukraine','romania_bulgaria','austria','yugoslavia','north_africa','sz_14','sz_15']
  },
  baltic_states: {
    id:'baltic_states', name:'Baltic States', ipc:2, startOwner:'germany', type:'land', region:'europe',
    x:690, y:190,
    adjacent:['finland','germany','eastern_europe','belorussia','karelia','sz_5']
  },
  eastern_europe: {
    id:'eastern_europe', name:'Eastern Europe', ipc:3, startOwner:'germany', type:'land', region:'europe',
    x:695, y:260,
    adjacent:['germany','baltic_states','belorussia','ukraine','southern_europe','romania_bulgaria','austria','yugoslavia']
  },
  belorussia: {
    id:'belorussia', name:'Belorussia', ipc:2, startOwner:'germany', type:'land', region:'europe',
    x:745, y:220,
    adjacent:['baltic_states','karelia','russia','ukraine','eastern_europe']
  },
  ukraine: {
    id:'ukraine', name:'Ukraine S.S.R.', ipc:2, startOwner:'germany', type:'land', region:'europe',
    x:745, y:280,
    adjacent:['belorussia','russia','caucasus','romania_bulgaria','eastern_europe','southern_europe']
  },
  romania_bulgaria: {
    id:'romania_bulgaria', name:'Romania & Bulgaria', ipc:3, startOwner:'germany', type:'land', region:'europe',
    x:700, y:330,
    adjacent:['eastern_europe','ukraine','southern_europe','yugoslavia','austria','turkey','sz_14','sz_15']
  },

  // ═══ AFRICA ═══
  north_africa: {
    id:'north_africa', name:'North Africa', ipc:1, startOwner:'germany', type:'land', region:'africa',
    x:605, y:400,
    adjacent:['western_europe','southern_europe','egypt','west_africa','sz_14','sz_15']
  },
  west_africa: {
    id:'west_africa', name:'West Africa', ipc:1, startOwner:'uk', type:'land', region:'africa',
    x:545, y:475,
    adjacent:['north_africa','egypt','sz_11','sz_12']
  },
  egypt: {
    id:'egypt', name:'Egypt', ipc:3, startOwner:'uk', type:'land', region:'africa',
    x:700, y:395,
    adjacent:['north_africa','west_africa','anglo_egypt_sudan','trans_jordan','sz_15']
  },
  anglo_egypt_sudan: {
    id:'anglo_egypt_sudan', name:'Anglo-Egypt Sudan', ipc:1, startOwner:'uk', type:'land', region:'africa',
    x:700, y:455,
    adjacent:['egypt','east_africa','west_africa']
  },
  east_africa: {
    id:'east_africa', name:'East Africa', ipc:2, startOwner:'uk', type:'land', region:'africa',
    x:695, y:530,
    adjacent:['anglo_egypt_sudan','south_africa','sz_12','sz_20']
  },
  south_africa: {
    id:'south_africa', name:'South Africa', ipc:2, startOwner:'uk', type:'land', region:'africa',
    x:645, y:625,
    adjacent:['east_africa','sz_11','sz_12','sz_20']
  },
  trans_jordan: {
    id:'trans_jordan', name:'Trans-Jordan', ipc:1, startOwner:'uk', type:'land', region:'middleeast',
    x:765, y:375,
    adjacent:['egypt','persia','turkey','sz_15','sz_20']
  },
  persia: {
    id:'persia', name:'Persia', ipc:1, startOwner:'uk', type:'land', region:'middleeast',
    x:840, y:345,
    adjacent:['trans_jordan','india','caucasus','turkey','sz_20']
  },

  // ═══ USSR ═══
  karelia: {
    id:'karelia', name:'Karelia S.S.R.', ipc:2, startOwner:'ussr', type:'land', region:'europe',
    x:730, y:150,
    adjacent:['norway','finland','baltic_states','belorussia','russia','archangel','sz_5']
  },
  archangel: {
    id:'archangel', name:'Archangel', ipc:1, startOwner:'ussr', type:'land', region:'europe',
    x:795, y:130,
    adjacent:['karelia','russia','sz_2']
  },
  russia: {
    id:'russia', name:'Russia', ipc:8, startOwner:'ussr', type:'land', region:'europe',
    x:830, y:210,
    adjacent:['karelia','archangel','belorussia','ukraine','caucasus','kazakh','novosibirsk']
  },
  caucasus: {
    id:'caucasus', name:'Caucasus', ipc:4, startOwner:'ussr', type:'land', region:'europe',
    x:840, y:300,
    adjacent:['russia','ukraine','persia','kazakh','sz_20']
  },
  kazakh: {
    id:'kazakh', name:'Kazakh S.S.R.', ipc:2, startOwner:'ussr', type:'land', region:'asia',
    x:915, y:265,
    adjacent:['russia','caucasus','novosibirsk','india']
  },
  novosibirsk: {
    id:'novosibirsk', name:'Novosibirsk', ipc:1, startOwner:'ussr', type:'land', region:'asia',
    x:995, y:210,
    adjacent:['russia','kazakh','evenki','buryatia']
  },
  evenki: {
    id:'evenki', name:'Evenki National Okrug', ipc:1, startOwner:'ussr', type:'land', region:'asia',
    x:1075, y:160,
    adjacent:['novosibirsk','buryatia','yakut']
  },
  yakut: {
    id:'yakut', name:'Yakut S.S.R.', ipc:1, startOwner:'ussr', type:'land', region:'asia',
    x:1165, y:130,
    adjacent:['evenki','buryatia','soviet_far_east','sz_1']
  },
  buryatia: {
    id:'buryatia', name:'Buryatia S.S.R.', ipc:1, startOwner:'ussr', type:'land', region:'asia',
    x:1115, y:215,
    adjacent:['novosibirsk','evenki','yakut','soviet_far_east','manchuria']
  },
  soviet_far_east: {
    id:'soviet_far_east', name:'Soviet Far East', ipc:1, startOwner:'ussr', type:'land', region:'asia',
    x:1220, y:185,
    adjacent:['yakut','buryatia','manchuria','sz_1','sz_61']
  },

  // ═══ INDIA / SE ASIA ═══
  india: {
    id:'india', name:'India', ipc:3, startOwner:'uk', type:'land', region:'asia',
    x:950, y:360,
    adjacent:['persia','kazakh','burma','sz_20','sz_39']
  },
  burma: {
    id:'burma', name:'Burma', ipc:1, startOwner:'uk', type:'land', region:'asia',
    x:1030, y:365,
    adjacent:['india','french_indochina','yunnan','sz_37']
  },
  yunnan: {
    id:'yunnan', name:'Yunnan', ipc:1, startOwner:'uk', type:'land', region:'asia',
    x:1080, y:355,
    adjacent:['burma','french_indochina','kwangtung','szechwan']
  },
  szechwan: {
    id:'szechwan', name:'Szechwan', ipc:1, startOwner:'uk', type:'land', region:'asia',
    x:1090, y:310,
    adjacent:['yunnan','kwangtung','kiangsu','manchuria','buryatia']
  },
  kwangtung: {
    id:'kwangtung', name:'Kwangtung', ipc:2, startOwner:'japan', type:'land', region:'asia',
    x:1120, y:375,
    adjacent:['french_indochina','yunnan','szechwan','kiangsu','sz_20','sz_36']
  },
  kiangsu: {
    id:'kiangsu', name:'Kiangsu', ipc:3, startOwner:'japan', type:'land', region:'asia',
    x:1155, y:320,
    adjacent:['kwangtung','szechwan','manchuria','sz_36','sz_19']
  },
  french_indochina: {
    id:'french_indochina', name:'French Indo-China/Thailand', ipc:2, startOwner:'japan', type:'land', region:'asia',
    x:1055, y:415,
    adjacent:['burma','yunnan','kwangtung','malaya','sz_36','sz_37','sz_35']
  },
  malaya: {
    id:'malaya', name:'Malaya', ipc:3, startOwner:'japan', type:'land', region:'asia',
    x:1065, y:485,
    adjacent:['french_indochina','dutch_east_indies','sz_36','sz_37']
  },

  // ═══ JAPAN / PACIFIC ═══
  manchuria: {
    id:'manchuria', name:'Manchuria', ipc:3, startOwner:'japan', type:'land', region:'asia',
    x:1195, y:255,
    adjacent:['soviet_far_east','buryatia','szechwan','kiangsu','korea','sz_61']
  },
  korea: {
    id:'korea', name:'Korea', ipc:2, startOwner:'japan', type:'land', region:'asia',
    x:1215, y:300,
    adjacent:['manchuria','sz_30','sz_19']
  },
  japan: {
    id:'japan', name:'Japan', ipc:8, startOwner:'japan', type:'land', region:'asia',
    x:1275, y:270,
    adjacent:['sz_6','sz_19','sz_30','sz_61']
  },
  philippines: {
    id:'philippines', name:'Philippine Islands', ipc:3, startOwner:'japan', type:'land', region:'pacific',
    x:1185, y:430,
    adjacent:['sz_35','sz_36']
  },
  wake_island: {
    id:'wake_island', name:'Wake Island', ipc:0, startOwner:'japan', type:'land', region:'pacific',
    x:1310, y:355,
    adjacent:['sz_25','sz_29','sz_30']
  },
  guam: {
    id:'guam', name:'Guam', ipc:0, startOwner:'japan', type:'land', region:'pacific',
    x:1270, y:415,
    adjacent:['sz_29','sz_30','sz_35']
  },
  iwo_jima: {
    id:'iwo_jima', name:'Iwo Jima', ipc:0, startOwner:'japan', type:'land', region:'pacific',
    x:1295, y:335,
    adjacent:['sz_19','sz_30']
  },
  marianas: {
    id:'marianas', name:'Mariana Islands', ipc:0, startOwner:'japan', type:'land', region:'pacific',
    x:1285, y:390,
    adjacent:['sz_29','sz_30']
  },
  caroline_islands: {
    id:'caroline_islands', name:'Caroline Islands', ipc:0, startOwner:'japan', type:'land', region:'pacific',
    x:1235, y:465,
    adjacent:['sz_29','sz_35']
  },
  dutch_east_indies: {
    id:'dutch_east_indies', name:'Dutch East Indies', ipc:4, startOwner:'japan', type:'land', region:'pacific',
    x:1125, y:545,
    adjacent:['malaya','borneo','new_guinea','sz_36','sz_41','sz_42']
  },
  borneo: {
    id:'borneo', name:'Borneo', ipc:3, startOwner:'japan', type:'land', region:'pacific',
    x:1155, y:500,
    adjacent:['malaya','dutch_east_indies','philippines','sz_36','sz_41']
  },
  new_guinea: {
    id:'new_guinea', name:'New Guinea', ipc:1, startOwner:'australia', type:'land', region:'pacific',
    x:1230, y:555,
    adjacent:['dutch_east_indies','solomon_islands','australia','sz_42','sz_44','sz_45']
  },
  solomon_islands: {
    id:'solomon_islands', name:'Solomon Islands', ipc:0, startOwner:'japan', type:'land', region:'pacific',
    x:1285, y:565,
    adjacent:['new_guinea','sz_44','sz_45']
  },
  australia: {
    id:'australia', name:'Australia', ipc:4, startOwner:'australia', type:'land', region:'pacific',
    x:1185, y:580,
    adjacent:['new_guinea','sz_42','sz_44','sz_54']
  },
  new_zealand: {
    id:'new_zealand', name:'New Zealand', ipc:1, startOwner:'uk', type:'land', region:'pacific',
    x:1310, y:700,
    adjacent:['sz_54','sz_57']
  },

  // ═══ KEY SEA ZONES ═══
  sz_1:  { id:'sz_1',  name:'Sea Zone 1 (N Pacific)',   ipc:0, startOwner:null, type:'sea', region:'pacific',   x:170,  y:85,  adjacent:['alaska','western_canada','yakut','soviet_far_east','sz_2','sz_56'] },
  sz_2:  { id:'sz_2',  name:'Sea Zone 2 (N Atlantic)',  ipc:0, startOwner:null, type:'sea', region:'atlantic',  x:430,  y:110, adjacent:['archangel','karelia','sz_1','sz_5','sz_8'] },
  sz_5:  { id:'sz_5',  name:'Sea Zone 5 (N Sea)',       ipc:0, startOwner:null, type:'sea', region:'atlantic',  x:575,  y:155, adjacent:['united_kingdom','norway','finland','germany','karelia','baltic_states','western_europe','sz_2','sz_6'] },
  sz_6:  { id:'sz_6',  name:'Sea Zone 6 (N Atlantic)',  ipc:0, startOwner:null, type:'sea', region:'atlantic',  x:490,  y:225, adjacent:['united_kingdom','western_europe','norway','sz_5','sz_7'] },
  sz_7:  { id:'sz_7',  name:'Sea Zone 7 (Mid Atlantic)', ipc:0, startOwner:null, type:'sea', region:'atlantic',  x:430,  y:270, adjacent:['united_kingdom','western_europe','eastern_canada','central_canada','sz_6','sz_8','sz_12'] },
  sz_8:  { id:'sz_8',  name:'Sea Zone 8 (W Atlantic)',  ipc:0, startOwner:null, type:'sea', region:'atlantic',  x:360,  y:320, adjacent:['eastern_us','eastern_canada','western_europe','central_america','brazil','sz_7','sz_9','sz_10'] },
  sz_9:  { id:'sz_9',  name:'Sea Zone 9 (Caribbean)',   ipc:0, startOwner:null, type:'sea', region:'atlantic',  x:285,  y:390, adjacent:['central_america','brazil','sz_8','sz_10','sz_56'] },
  sz_10: { id:'sz_10', name:'Sea Zone 10 (S Atlantic)',  ipc:0, startOwner:null, type:'sea', region:'atlantic',  x:420,  y:430, adjacent:['eastern_us','brazil','sz_8','sz_9','sz_11'] },
  sz_11: { id:'sz_11', name:'Sea Zone 11 (S Atlantic)',  ipc:0, startOwner:null, type:'sea', region:'atlantic',  x:535,  y:555, adjacent:['west_africa','south_africa','sz_10','sz_12'] },
  sz_12: { id:'sz_12', name:'Sea Zone 12 (S Atlantic)',  ipc:0, startOwner:null, type:'sea', region:'atlantic',  x:620,  y:580, adjacent:['west_africa','east_africa','south_africa','sz_7','sz_11','sz_20'] },
  sz_14: { id:'sz_14', name:'Sea Zone 14 (Med W)',       ipc:0, startOwner:null, type:'sea', region:'europe',    x:580,  y:360, adjacent:['western_europe','north_africa','southern_europe','sz_15'] },
  sz_15: { id:'sz_15', name:'Sea Zone 15 (Med E)',       ipc:0, startOwner:null, type:'sea', region:'europe',    x:675,  y:385, adjacent:['southern_europe','romania_bulgaria','north_africa','egypt','trans_jordan','sz_14','sz_20'] },
  sz_19: { id:'sz_19', name:'Sea Zone 19 (E China Sea)', ipc:0, startOwner:null, type:'sea', region:'pacific',   x:1215, y:360, adjacent:['japan','korea','kiangsu','iwo_jima','sz_30','sz_36'] },
  sz_20: { id:'sz_20', name:'Sea Zone 20 (Indian O.)',   ipc:0, startOwner:null, type:'sea', region:'indian',    x:850,  y:470, adjacent:['persia','india','trans_jordan','east_africa','south_africa','caucasus','sz_12','sz_15','sz_39','sz_41'] },
  sz_25: { id:'sz_25', name:'Sea Zone 25 (C Pacific)',   ipc:0, startOwner:null, type:'sea', region:'pacific',   x:135,  y:300, adjacent:['midway','hawaii','sz_26','sz_29','sz_53'] },
  sz_26: { id:'sz_26', name:'Sea Zone 26 (C Pacific)',   ipc:0, startOwner:null, type:'sea', region:'pacific',   x:95,   y:405, adjacent:['hawaii','midway','sz_25','sz_53','sz_57'] },
  sz_29: { id:'sz_29', name:'Sea Zone 29 (C Pacific)',   ipc:0, startOwner:null, type:'sea', region:'pacific',   x:1285, y:450, adjacent:['wake_island','guam','marianas','caroline_islands','sz_25','sz_30','sz_35'] },
  sz_30: { id:'sz_30', name:'Sea Zone 30 (W Pacific)',   ipc:0, startOwner:null, type:'sea', region:'pacific',   x:1255, y:330, adjacent:['japan','korea','wake_island','guam','iwo_jima','marianas','sz_19','sz_29','sz_61'] },
  sz_35: { id:'sz_35', name:'Sea Zone 35 (Philippines)', ipc:0, startOwner:null, type:'sea', region:'pacific',   x:1170, y:455, adjacent:['philippines','french_indochina','guam','caroline_islands','borneo','sz_29','sz_36','sz_41'] },
  sz_36: { id:'sz_36', name:'Sea Zone 36 (S China Sea)', ipc:0, startOwner:null, type:'sea', region:'pacific',   x:1120, y:430, adjacent:['french_indochina','kwangtung','kiangsu','malaya','borneo','philippines','sz_19','sz_35','sz_41'] },
  sz_37: { id:'sz_37', name:'Sea Zone 37 (Bay Bengal)',  ipc:0, startOwner:null, type:'sea', region:'indian',    x:1000, y:440, adjacent:['india','burma','french_indochina','malaya','sz_20','sz_36','sz_39'] },
  sz_39: { id:'sz_39', name:'Sea Zone 39 (Indian O.)',   ipc:0, startOwner:null, type:'sea', region:'indian',    x:960,  y:490, adjacent:['india','sz_20','sz_37','sz_41'] },
  sz_41: { id:'sz_41', name:'Sea Zone 41 (Java Sea)',    ipc:0, startOwner:null, type:'sea', region:'pacific',   x:1110, y:565, adjacent:['dutch_east_indies','borneo','sz_35','sz_36','sz_39','sz_42','sz_20'] },
  sz_42: { id:'sz_42', name:'Sea Zone 42 (Coral Sea)',   ipc:0, startOwner:null, type:'sea', region:'pacific',   x:1190, y:600, adjacent:['new_guinea','australia','dutch_east_indies','sz_41','sz_44','sz_54'] },
  sz_44: { id:'sz_44', name:'Sea Zone 44 (S Pacific)',   ipc:0, startOwner:null, type:'sea', region:'pacific',   x:1260, y:630, adjacent:['new_guinea','solomon_islands','australia','sz_42','sz_45','sz_54'] },
  sz_45: { id:'sz_45', name:'Sea Zone 45 (S Pacific)',   ipc:0, startOwner:null, type:'sea', region:'pacific',   x:1340, y:600, adjacent:['solomon_islands','sz_44','sz_54'] },
  sz_53: { id:'sz_53', name:'Sea Zone 53 (E Pacific)',   ipc:0, startOwner:null, type:'sea', region:'pacific',   x:95,   y:440, adjacent:['hawaii','sz_25','sz_26','sz_54','sz_56'] },
  sz_54: { id:'sz_54', name:'Sea Zone 54 (S Pacific)',   ipc:0, startOwner:null, type:'sea', region:'pacific',   x:1230, y:720, adjacent:['australia','new_zealand','sz_42','sz_44','sz_45','sz_53','sz_57'] },
  sz_56: { id:'sz_56', name:'Sea Zone 56 (N Pacific)',   ipc:0, startOwner:null, type:'sea', region:'pacific',   x:155,  y:205, adjacent:['alaska','western_canada','western_us','central_america','sz_1','sz_9','sz_53','sz_57'] },
  sz_57: { id:'sz_57', name:'Sea Zone 57 (N Pacific)',   ipc:0, startOwner:null, type:'sea', region:'pacific',   x:1350, y:720, adjacent:['western_canada','western_us','new_zealand','sz_1','sz_54','sz_56'] },
  sz_61: { id:'sz_61', name:'Sea Zone 61 (Sea of Japan)', ipc:0, startOwner:null, type:'sea', region:'pacific',  x:1235, y:235, adjacent:['japan','manchuria','soviet_far_east','sz_30'] },
};
