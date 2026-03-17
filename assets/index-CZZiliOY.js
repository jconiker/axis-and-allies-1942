(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const r of n.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&a(r)}).observe(document,{childList:!0,subtree:!0});function e(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function a(s){if(s.ep)return;s.ep=!0;const n=e(s);fetch(s.href,n)}})();const F="modulepreload",Z=function(y){return"/axis-and-allies-1942/"+y},L={},M=function(t,e,a){let s=Promise.resolve();if(e&&e.length>0){let r=function(o){return Promise.all(o.map(h=>Promise.resolve(h).then(p=>({status:"fulfilled",value:p}),p=>({status:"rejected",reason:p}))))};document.getElementsByTagName("link");const c=document.querySelector("meta[property=csp-nonce]"),d=(c==null?void 0:c.nonce)||(c==null?void 0:c.getAttribute("nonce"));s=r(e.map(o=>{if(o=Z(o),o in L)return;L[o]=!0;const h=o.endsWith(".css"),p=h?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${o}"]${p}`))return;const u=document.createElement("link");if(u.rel=h?"stylesheet":F,h||(u.as="script"),u.crossOrigin="",u.href=o,d&&u.setAttribute("nonce",d),document.head.appendChild(u),h)return new Promise((l,f)=>{u.addEventListener("load",l),u.addEventListener("error",()=>f(new Error(`Unable to preload CSS for ${o}`)))})}))}function n(r){const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=r,window.dispatchEvent(c),!c.defaultPrevented)throw r}return s.then(r=>{for(const c of r||[])c.status==="rejected"&&n(c.reason);return t().catch(n)})},v={alaska:{id:"alaska",name:"Alaska",ipc:2,startOwner:"usa",type:"land",region:"americas",x:95,y:115,adjacent:["western_us","western_canada","sz_1","sz_56"]},western_canada:{id:"western_canada",name:"Western Canada",ipc:1,startOwner:"uk",type:"land",region:"americas",x:170,y:145,adjacent:["alaska","central_canada","western_us","sz_1","sz_56","sz_57"]},central_canada:{id:"central_canada",name:"Central Canada",ipc:1,startOwner:"uk",type:"land",region:"americas",x:245,y:155,adjacent:["western_canada","eastern_canada","western_us","central_us","sz_7"]},eastern_canada:{id:"eastern_canada",name:"Eastern Canada",ipc:3,startOwner:"uk",type:"land",region:"americas",x:330,y:155,adjacent:["central_canada","eastern_us","sz_7","sz_8"]},western_us:{id:"western_us",name:"Western United States",ipc:10,startOwner:"usa",type:"land",region:"americas",x:145,y:240,adjacent:["alaska","western_canada","central_us","sz_56","sz_57"]},central_us:{id:"central_us",name:"Central United States",ipc:6,startOwner:"usa",type:"land",region:"americas",x:230,y:265,adjacent:["western_us","eastern_us","central_canada","central_america"]},eastern_us:{id:"eastern_us",name:"Eastern United States",ipc:12,startOwner:"usa",type:"land",region:"americas",x:310,y:255,adjacent:["central_us","eastern_canada","central_america","sz_7","sz_8","sz_10"]},central_america:{id:"central_america",name:"Central America",ipc:1,startOwner:"usa",type:"land",region:"americas",x:230,y:355,adjacent:["eastern_us","central_us","sz_8","sz_9","sz_56"]},brazil:{id:"brazil",name:"Brazil",ipc:3,startOwner:"usa",type:"land",region:"americas",x:340,y:455,adjacent:["sz_8","sz_9","sz_10"]},hawaii:{id:"hawaii",name:"Hawaiian Islands",ipc:1,startOwner:"usa",type:"land",region:"pacific",x:95,y:355,adjacent:["sz_53","sz_26"]},midway:{id:"midway",name:"Midway Island",ipc:0,startOwner:"usa",type:"land",region:"pacific",x:50,y:290,adjacent:["sz_25","sz_26"]},austria:{id:"austria",name:"Austria",ipc:4,startOwner:"neutral",type:"land",region:"europe",neutral:!0,x:660,y:255,adjacent:["germany","southern_europe","eastern_europe","romania_bulgaria"]},yugoslavia:{id:"yugoslavia",name:"Yugoslavia",ipc:2,startOwner:"neutral",type:"land",region:"europe",neutral:!0,x:670,y:340,adjacent:["southern_europe","eastern_europe","romania_bulgaria","austria","sz_14","sz_15"]},turkey:{id:"turkey",name:"Turkey",ipc:2,startOwner:"neutral",type:"land",region:"middleeast",neutral:!0,x:755,y:335,adjacent:["romania_bulgaria","sz_15","trans_jordan","persia"]},sweden:{id:"sweden",name:"Sweden",ipc:2,startOwner:"neutral",type:"land",region:"europe",neutral:!0,x:640,y:120,adjacent:["norway","finland","sz_5"]},spain:{id:"spain",name:"Spain & Portugal",ipc:2,startOwner:"neutral",type:"land",region:"europe",neutral:!0,x:500,y:295,adjacent:["western_europe","sz_6","sz_7","sz_8","sz_14"]},united_kingdom:{id:"united_kingdom",name:"United Kingdom",ipc:8,startOwner:"uk",type:"land",region:"europe",x:510,y:185,adjacent:["norway","sz_5","sz_6","sz_7","sz_8"]},norway:{id:"norway",name:"Norway",ipc:3,startOwner:"germany",type:"land",region:"europe",x:600,y:130,adjacent:["united_kingdom","finland","germany","sweden","karelia","sz_5","sz_6"]},finland:{id:"finland",name:"Finland & Norway",ipc:1,startOwner:"germany",type:"land",region:"europe",x:675,y:120,adjacent:["norway","germany","sweden","karelia","baltic_states","sz_5"]},germany:{id:"germany",name:"Germany",ipc:10,startOwner:"germany",type:"land",region:"europe",x:625,y:225,adjacent:["norway","finland","western_europe","southern_europe","eastern_europe","baltic_states","austria","sweden","sz_5"]},western_europe:{id:"western_europe",name:"Western Europe",ipc:6,startOwner:"germany",type:"land",region:"europe",x:545,y:290,adjacent:["germany","southern_europe","spain","united_kingdom","north_africa","sz_5","sz_6","sz_7","sz_8"]},southern_europe:{id:"southern_europe",name:"Southern Europe",ipc:4,startOwner:"germany",type:"land",region:"europe",x:635,y:305,adjacent:["germany","western_europe","eastern_europe","ukraine","romania_bulgaria","austria","yugoslavia","north_africa","sz_14","sz_15"]},baltic_states:{id:"baltic_states",name:"Baltic States",ipc:2,startOwner:"germany",type:"land",region:"europe",x:690,y:190,adjacent:["finland","germany","eastern_europe","belorussia","karelia","sz_5"]},eastern_europe:{id:"eastern_europe",name:"Eastern Europe",ipc:3,startOwner:"germany",type:"land",region:"europe",x:695,y:260,adjacent:["germany","baltic_states","belorussia","ukraine","southern_europe","romania_bulgaria","austria","yugoslavia"]},belorussia:{id:"belorussia",name:"Belorussia",ipc:2,startOwner:"germany",type:"land",region:"europe",x:745,y:220,adjacent:["baltic_states","karelia","russia","ukraine","eastern_europe"]},ukraine:{id:"ukraine",name:"Ukraine S.S.R.",ipc:2,startOwner:"germany",type:"land",region:"europe",x:745,y:280,adjacent:["belorussia","russia","caucasus","romania_bulgaria","eastern_europe","southern_europe"]},romania_bulgaria:{id:"romania_bulgaria",name:"Romania & Bulgaria",ipc:3,startOwner:"germany",type:"land",region:"europe",x:700,y:330,adjacent:["eastern_europe","ukraine","southern_europe","yugoslavia","austria","turkey","sz_14","sz_15"]},north_africa:{id:"north_africa",name:"North Africa",ipc:1,startOwner:"germany",type:"land",region:"africa",x:605,y:400,adjacent:["western_europe","southern_europe","egypt","west_africa","sz_14","sz_15"]},west_africa:{id:"west_africa",name:"West Africa",ipc:1,startOwner:"uk",type:"land",region:"africa",x:545,y:475,adjacent:["north_africa","egypt","sz_11","sz_12"]},egypt:{id:"egypt",name:"Egypt",ipc:3,startOwner:"uk",type:"land",region:"africa",x:700,y:395,adjacent:["north_africa","west_africa","anglo_egypt_sudan","trans_jordan","sz_15"]},anglo_egypt_sudan:{id:"anglo_egypt_sudan",name:"Anglo-Egypt Sudan",ipc:1,startOwner:"uk",type:"land",region:"africa",x:700,y:455,adjacent:["egypt","east_africa","west_africa"]},east_africa:{id:"east_africa",name:"East Africa",ipc:2,startOwner:"uk",type:"land",region:"africa",x:695,y:530,adjacent:["anglo_egypt_sudan","south_africa","sz_12","sz_20"]},south_africa:{id:"south_africa",name:"South Africa",ipc:2,startOwner:"uk",type:"land",region:"africa",x:645,y:625,adjacent:["east_africa","sz_11","sz_12","sz_20"]},trans_jordan:{id:"trans_jordan",name:"Trans-Jordan",ipc:1,startOwner:"uk",type:"land",region:"middleeast",x:765,y:375,adjacent:["egypt","persia","turkey","sz_15","sz_20"]},persia:{id:"persia",name:"Persia",ipc:1,startOwner:"uk",type:"land",region:"middleeast",x:840,y:345,adjacent:["trans_jordan","india","caucasus","turkey","sz_20"]},karelia:{id:"karelia",name:"Karelia S.S.R.",ipc:2,startOwner:"ussr",type:"land",region:"europe",x:730,y:150,adjacent:["norway","finland","baltic_states","belorussia","russia","archangel","sz_5"]},archangel:{id:"archangel",name:"Archangel",ipc:1,startOwner:"ussr",type:"land",region:"europe",x:795,y:130,adjacent:["karelia","russia","sz_2"]},russia:{id:"russia",name:"Russia",ipc:8,startOwner:"ussr",type:"land",region:"europe",x:830,y:210,adjacent:["karelia","archangel","belorussia","ukraine","caucasus","kazakh","novosibirsk"]},caucasus:{id:"caucasus",name:"Caucasus",ipc:4,startOwner:"ussr",type:"land",region:"europe",x:840,y:300,adjacent:["russia","ukraine","persia","kazakh","sz_20"]},kazakh:{id:"kazakh",name:"Kazakh S.S.R.",ipc:2,startOwner:"ussr",type:"land",region:"asia",x:915,y:265,adjacent:["russia","caucasus","novosibirsk","india"]},novosibirsk:{id:"novosibirsk",name:"Novosibirsk",ipc:1,startOwner:"ussr",type:"land",region:"asia",x:995,y:210,adjacent:["russia","kazakh","evenki","buryatia"]},evenki:{id:"evenki",name:"Evenki National Okrug",ipc:1,startOwner:"ussr",type:"land",region:"asia",x:1075,y:160,adjacent:["novosibirsk","buryatia","yakut"]},yakut:{id:"yakut",name:"Yakut S.S.R.",ipc:1,startOwner:"ussr",type:"land",region:"asia",x:1165,y:130,adjacent:["evenki","buryatia","soviet_far_east","sz_1"]},buryatia:{id:"buryatia",name:"Buryatia S.S.R.",ipc:1,startOwner:"ussr",type:"land",region:"asia",x:1115,y:215,adjacent:["novosibirsk","evenki","yakut","soviet_far_east","manchuria"]},soviet_far_east:{id:"soviet_far_east",name:"Soviet Far East",ipc:1,startOwner:"ussr",type:"land",region:"asia",x:1220,y:185,adjacent:["yakut","buryatia","manchuria","sz_1","sz_61"]},india:{id:"india",name:"India",ipc:3,startOwner:"uk",type:"land",region:"asia",x:950,y:360,adjacent:["persia","kazakh","burma","sz_20","sz_39"]},burma:{id:"burma",name:"Burma",ipc:1,startOwner:"uk",type:"land",region:"asia",x:1030,y:365,adjacent:["india","french_indochina","yunnan","sz_37"]},yunnan:{id:"yunnan",name:"Yunnan",ipc:1,startOwner:"uk",type:"land",region:"asia",x:1080,y:355,adjacent:["burma","french_indochina","kwangtung","szechwan"]},szechwan:{id:"szechwan",name:"Szechwan",ipc:1,startOwner:"uk",type:"land",region:"asia",x:1090,y:310,adjacent:["yunnan","kwangtung","kiangsu","manchuria","buryatia"]},kwangtung:{id:"kwangtung",name:"Kwangtung",ipc:2,startOwner:"japan",type:"land",region:"asia",x:1120,y:375,adjacent:["french_indochina","yunnan","szechwan","kiangsu","sz_20","sz_36"]},kiangsu:{id:"kiangsu",name:"Kiangsu",ipc:3,startOwner:"japan",type:"land",region:"asia",x:1155,y:320,adjacent:["kwangtung","szechwan","manchuria","sz_36","sz_19"]},french_indochina:{id:"french_indochina",name:"French Indo-China/Thailand",ipc:2,startOwner:"japan",type:"land",region:"asia",x:1055,y:415,adjacent:["burma","yunnan","kwangtung","malaya","sz_36","sz_37","sz_35"]},malaya:{id:"malaya",name:"Malaya",ipc:3,startOwner:"japan",type:"land",region:"asia",x:1065,y:485,adjacent:["french_indochina","dutch_east_indies","sz_36","sz_37"]},manchuria:{id:"manchuria",name:"Manchuria",ipc:3,startOwner:"japan",type:"land",region:"asia",x:1195,y:255,adjacent:["soviet_far_east","buryatia","szechwan","kiangsu","korea","sz_61"]},korea:{id:"korea",name:"Korea",ipc:2,startOwner:"japan",type:"land",region:"asia",x:1215,y:300,adjacent:["manchuria","sz_30","sz_19"]},japan:{id:"japan",name:"Japan",ipc:8,startOwner:"japan",type:"land",region:"asia",x:1275,y:270,adjacent:["sz_6","sz_19","sz_30","sz_61"]},philippines:{id:"philippines",name:"Philippine Islands",ipc:3,startOwner:"japan",type:"land",region:"pacific",x:1185,y:430,adjacent:["sz_35","sz_36"]},wake_island:{id:"wake_island",name:"Wake Island",ipc:0,startOwner:"japan",type:"land",region:"pacific",x:1310,y:355,adjacent:["sz_25","sz_29","sz_30"]},guam:{id:"guam",name:"Guam",ipc:0,startOwner:"japan",type:"land",region:"pacific",x:1270,y:415,adjacent:["sz_29","sz_30","sz_35"]},iwo_jima:{id:"iwo_jima",name:"Iwo Jima",ipc:0,startOwner:"japan",type:"land",region:"pacific",x:1295,y:335,adjacent:["sz_19","sz_30"]},marianas:{id:"marianas",name:"Mariana Islands",ipc:0,startOwner:"japan",type:"land",region:"pacific",x:1285,y:390,adjacent:["sz_29","sz_30"]},caroline_islands:{id:"caroline_islands",name:"Caroline Islands",ipc:0,startOwner:"japan",type:"land",region:"pacific",x:1235,y:465,adjacent:["sz_29","sz_35"]},dutch_east_indies:{id:"dutch_east_indies",name:"Dutch East Indies",ipc:4,startOwner:"japan",type:"land",region:"pacific",x:1125,y:545,adjacent:["malaya","borneo","new_guinea","sz_36","sz_41","sz_42"]},borneo:{id:"borneo",name:"Borneo",ipc:3,startOwner:"japan",type:"land",region:"pacific",x:1155,y:500,adjacent:["malaya","dutch_east_indies","philippines","sz_36","sz_41"]},new_guinea:{id:"new_guinea",name:"New Guinea",ipc:1,startOwner:"uk",type:"land",region:"pacific",x:1230,y:555,adjacent:["dutch_east_indies","solomon_islands","australia","sz_42","sz_44","sz_45"]},solomon_islands:{id:"solomon_islands",name:"Solomon Islands",ipc:0,startOwner:"japan",type:"land",region:"pacific",x:1285,y:565,adjacent:["new_guinea","sz_44","sz_45"]},australia:{id:"australia",name:"Australia",ipc:2,startOwner:"uk",type:"land",region:"pacific",x:1185,y:660,adjacent:["new_guinea","sz_42","sz_44","sz_54"]},new_zealand:{id:"new_zealand",name:"New Zealand",ipc:1,startOwner:"uk",type:"land",region:"pacific",x:1310,y:700,adjacent:["sz_54","sz_57"]},sz_1:{id:"sz_1",name:"Sea Zone 1 (N Pacific)",ipc:0,startOwner:null,type:"sea",region:"pacific",x:170,y:85,adjacent:["alaska","western_canada","yakut","soviet_far_east","sz_2","sz_56"]},sz_2:{id:"sz_2",name:"Sea Zone 2 (N Atlantic)",ipc:0,startOwner:null,type:"sea",region:"atlantic",x:430,y:110,adjacent:["archangel","karelia","sz_1","sz_5","sz_8"]},sz_5:{id:"sz_5",name:"Sea Zone 5 (N Sea)",ipc:0,startOwner:null,type:"sea",region:"atlantic",x:575,y:155,adjacent:["united_kingdom","norway","finland","germany","karelia","baltic_states","western_europe","sz_2","sz_6"]},sz_6:{id:"sz_6",name:"Sea Zone 6 (N Atlantic)",ipc:0,startOwner:null,type:"sea",region:"atlantic",x:490,y:225,adjacent:["united_kingdom","western_europe","norway","sz_5","sz_7"]},sz_7:{id:"sz_7",name:"Sea Zone 7 (Mid Atlantic)",ipc:0,startOwner:null,type:"sea",region:"atlantic",x:430,y:270,adjacent:["united_kingdom","western_europe","eastern_canada","central_canada","sz_6","sz_8","sz_12"]},sz_8:{id:"sz_8",name:"Sea Zone 8 (W Atlantic)",ipc:0,startOwner:null,type:"sea",region:"atlantic",x:360,y:320,adjacent:["eastern_us","eastern_canada","western_europe","central_america","brazil","sz_7","sz_9","sz_10"]},sz_9:{id:"sz_9",name:"Sea Zone 9 (Caribbean)",ipc:0,startOwner:null,type:"sea",region:"atlantic",x:285,y:390,adjacent:["central_america","brazil","sz_8","sz_10","sz_56"]},sz_10:{id:"sz_10",name:"Sea Zone 10 (S Atlantic)",ipc:0,startOwner:null,type:"sea",region:"atlantic",x:420,y:430,adjacent:["eastern_us","brazil","sz_8","sz_9","sz_11"]},sz_11:{id:"sz_11",name:"Sea Zone 11 (S Atlantic)",ipc:0,startOwner:null,type:"sea",region:"atlantic",x:535,y:555,adjacent:["west_africa","south_africa","sz_10","sz_12"]},sz_12:{id:"sz_12",name:"Sea Zone 12 (S Atlantic)",ipc:0,startOwner:null,type:"sea",region:"atlantic",x:620,y:580,adjacent:["west_africa","east_africa","south_africa","sz_7","sz_11","sz_20"]},sz_14:{id:"sz_14",name:"Sea Zone 14 (Med W)",ipc:0,startOwner:null,type:"sea",region:"europe",x:580,y:360,adjacent:["western_europe","north_africa","southern_europe","sz_15"]},sz_15:{id:"sz_15",name:"Sea Zone 15 (Med E)",ipc:0,startOwner:null,type:"sea",region:"europe",x:675,y:385,adjacent:["southern_europe","romania_bulgaria","north_africa","egypt","trans_jordan","sz_14","sz_20"]},sz_19:{id:"sz_19",name:"Sea Zone 19 (E China Sea)",ipc:0,startOwner:null,type:"sea",region:"pacific",x:1215,y:360,adjacent:["japan","korea","kiangsu","iwo_jima","sz_30","sz_36"]},sz_20:{id:"sz_20",name:"Sea Zone 20 (Indian O.)",ipc:0,startOwner:null,type:"sea",region:"indian",x:850,y:470,adjacent:["persia","india","trans_jordan","east_africa","south_africa","caucasus","sz_12","sz_15","sz_39","sz_41"]},sz_25:{id:"sz_25",name:"Sea Zone 25 (C Pacific)",ipc:0,startOwner:null,type:"sea",region:"pacific",x:135,y:300,adjacent:["midway","hawaii","sz_26","sz_29","sz_53"]},sz_26:{id:"sz_26",name:"Sea Zone 26 (C Pacific)",ipc:0,startOwner:null,type:"sea",region:"pacific",x:95,y:405,adjacent:["hawaii","midway","sz_25","sz_53","sz_57"]},sz_29:{id:"sz_29",name:"Sea Zone 29 (C Pacific)",ipc:0,startOwner:null,type:"sea",region:"pacific",x:1285,y:450,adjacent:["wake_island","guam","marianas","caroline_islands","sz_25","sz_30","sz_35"]},sz_30:{id:"sz_30",name:"Sea Zone 30 (W Pacific)",ipc:0,startOwner:null,type:"sea",region:"pacific",x:1255,y:330,adjacent:["japan","korea","wake_island","guam","iwo_jima","marianas","sz_19","sz_29","sz_61"]},sz_35:{id:"sz_35",name:"Sea Zone 35 (Philippines)",ipc:0,startOwner:null,type:"sea",region:"pacific",x:1170,y:455,adjacent:["philippines","french_indochina","guam","caroline_islands","borneo","sz_29","sz_36","sz_41"]},sz_36:{id:"sz_36",name:"Sea Zone 36 (S China Sea)",ipc:0,startOwner:null,type:"sea",region:"pacific",x:1120,y:430,adjacent:["french_indochina","kwangtung","kiangsu","malaya","borneo","philippines","sz_19","sz_35","sz_41"]},sz_37:{id:"sz_37",name:"Sea Zone 37 (Bay Bengal)",ipc:0,startOwner:null,type:"sea",region:"indian",x:1e3,y:440,adjacent:["india","burma","french_indochina","malaya","sz_20","sz_36","sz_39"]},sz_39:{id:"sz_39",name:"Sea Zone 39 (Indian O.)",ipc:0,startOwner:null,type:"sea",region:"indian",x:960,y:490,adjacent:["india","sz_20","sz_37","sz_41"]},sz_41:{id:"sz_41",name:"Sea Zone 41 (Java Sea)",ipc:0,startOwner:null,type:"sea",region:"pacific",x:1110,y:565,adjacent:["dutch_east_indies","borneo","sz_35","sz_36","sz_39","sz_42","sz_20"]},sz_42:{id:"sz_42",name:"Sea Zone 42 (Coral Sea)",ipc:0,startOwner:null,type:"sea",region:"pacific",x:1190,y:600,adjacent:["new_guinea","australia","dutch_east_indies","sz_41","sz_44","sz_54"]},sz_44:{id:"sz_44",name:"Sea Zone 44 (S Pacific)",ipc:0,startOwner:null,type:"sea",region:"pacific",x:1260,y:630,adjacent:["new_guinea","solomon_islands","australia","sz_42","sz_45","sz_54"]},sz_45:{id:"sz_45",name:"Sea Zone 45 (S Pacific)",ipc:0,startOwner:null,type:"sea",region:"pacific",x:1340,y:600,adjacent:["solomon_islands","sz_44","sz_54"]},sz_53:{id:"sz_53",name:"Sea Zone 53 (E Pacific)",ipc:0,startOwner:null,type:"sea",region:"pacific",x:95,y:440,adjacent:["hawaii","sz_25","sz_26","sz_54","sz_56"]},sz_54:{id:"sz_54",name:"Sea Zone 54 (S Pacific)",ipc:0,startOwner:null,type:"sea",region:"pacific",x:1230,y:720,adjacent:["australia","new_zealand","sz_42","sz_44","sz_45","sz_53","sz_57"]},sz_56:{id:"sz_56",name:"Sea Zone 56 (N Pacific)",ipc:0,startOwner:null,type:"sea",region:"pacific",x:155,y:205,adjacent:["alaska","western_canada","western_us","central_america","sz_1","sz_9","sz_53","sz_57"]},sz_57:{id:"sz_57",name:"Sea Zone 57 (N Pacific)",ipc:0,startOwner:null,type:"sea",region:"pacific",x:1350,y:720,adjacent:["western_canada","western_us","new_zealand","sz_1","sz_54","sz_56"]},sz_61:{id:"sz_61",name:"Sea Zone 61 (Sea of Japan)",ipc:0,startOwner:null,type:"sea",region:"pacific",x:1235,y:235,adjacent:["japan","manchuria","soviet_far_east","sz_30"]}},w={ussr:{id:"ussr",name:"Soviet Union",side:"allies",color:"#cc2222",capital:"russia",turnOrder:1,startingIPC:24,flag:"🇷🇺",textColor:"#ffffff"},germany:{id:"germany",name:"Germany",side:"axis",color:"#666666",capital:"germany",turnOrder:2,startingIPC:40,flag:"🇩🇪",textColor:"#ffffff"},uk:{id:"uk",name:"United Kingdom",side:"allies",color:"#c8860a",capital:"united_kingdom",turnOrder:3,startingIPC:31,flag:"🇬🇧",textColor:"#ffffff"},japan:{id:"japan",name:"Japan",side:"axis",color:"#e8c020",capital:"japan",turnOrder:4,startingIPC:30,flag:"🇯🇵",textColor:"#000000"},usa:{id:"usa",name:"United States",side:"allies",color:"#4a7c3f",capital:"eastern_us",turnOrder:5,startingIPC:42,flag:"🇺🇸",textColor:"#ffffff"},neutral:{id:"neutral",name:"Neutral",side:"neutral",color:"#8a8a6e",capital:null,turnOrder:null,startingIPC:0,flag:"🏳️",textColor:"#ffffff"}},T=["ussr","germany","uk","japan","usa"];function B(y){var t;return((t=w[y])==null?void 0:t.side)??"neutral"}function N(y,t){if(!y||!t||y===t)return!1;const e=B(y),a=B(t);return e==="neutral"||a==="neutral"?!0:e!==a}const K={infantry:{id:"infantry",name:"Infantry",cost:3,attack:1,defense:2,movement:1,type:"land",canCarry:!1,carriedBy:["transport"],icon:"🪖",color:"#888",isCustom:!1,blitz:!1,description:"Basic ground unit. Can be supported by artillery to attack at 2."},artillery:{id:"artillery",name:"Artillery",cost:4,attack:2,defense:2,movement:1,type:"land",canCarry:!1,carriedBy:["transport"],icon:"💥",color:"#888",isCustom:!1,blitz:!1,supportsInfantry:!0,description:"Supports 1 infantry per artillery to attack at 2."},armor:{id:"armor",name:"Armor",cost:6,attack:3,defense:3,movement:2,type:"land",canCarry:!1,carriedBy:["transport"],icon:"🎯",color:"#888",isCustom:!1,blitz:!0,description:"Can blitz through unoccupied enemy territory."},antiair:{id:"antiair",name:"Anti-Aircraft Gun",cost:5,attack:0,defense:0,movement:1,type:"land",canCarry:!1,carriedBy:["transport"],icon:"⚡",color:"#888",isCustom:!1,blitz:!1,shootsAtAir:!0,airShots:1,description:"Fires at attacking aircraft before combat (hits on 1). Cannot attack."},fighter:{id:"fighter",name:"Fighter",cost:10,attack:3,defense:4,movement:4,type:"air",canCarry:!1,carriedBy:["carrier"],icon:"✈️",color:"#aae",isCustom:!1,canLandOnCarrier:!0,description:"Versatile air unit. Can land on carriers."},bomber:{id:"bomber",name:"Bomber",cost:12,attack:4,defense:1,movement:6,type:"air",canCarry:!1,carriedBy:[],icon:"💣",color:"#aae",isCustom:!1,canStrategicBomb:!0,bombingDice:2,description:"Long-range. Can strategic bomb enemy IPC production."},tactical_bomber:{id:"tactical_bomber",name:"Tactical Bomber",cost:11,attack:3,defense:3,movement:4,type:"air",canCarry:!1,carriedBy:["carrier"],icon:"🛩️",color:"#aae",isCustom:!1,canLandOnCarrier:!0,canStrategicBomb:!0,bombingDice:1,description:"Can land on carriers. Bonds with armor/fighter for +1 attack."},submarine:{id:"submarine",name:"Submarine",cost:6,attack:2,defense:1,movement:2,type:"sea",canCarry:!1,carriedBy:[],icon:"🤿",color:"#44a",isCustom:!1,submerge:!0,firstStrike:!0,ignoresDestroyers:!1,description:"First strike. Can submerge to avoid combat. Ignored by planes (unless destroyer present)."},destroyer:{id:"destroyer",name:"Destroyer",cost:8,attack:3,defense:3,movement:2,type:"sea",canCarry:!1,carriedBy:[],icon:"⚓",color:"#44a",isCustom:!1,cancelsSubs:!0,description:"Cancels submarine special abilities. General purpose warship."},cruiser:{id:"cruiser",name:"Cruiser",cost:12,attack:3,defense:3,movement:2,type:"sea",canCarry:!1,carriedBy:[],icon:"🚢",color:"#44a",isCustom:!1,canBombard:!0,description:"Can bombard coastal territories during amphibious assaults."},carrier:{id:"carrier",name:"Aircraft Carrier",cost:14,attack:1,defense:2,movement:2,type:"sea",canCarry:!0,carriedBy:[],carriesMax:2,carriesTypes:["fighter","tactical_bomber"],icon:"🛳️",color:"#44a",isCustom:!1,description:"Carries up to 2 fighters/tactical bombers. Defends at 2."},battleship:{id:"battleship",name:"Battleship",cost:20,attack:4,defense:4,movement:2,type:"sea",canCarry:!1,carriedBy:[],icon:"⛵",color:"#44a",isCustom:!1,twoHit:!0,canBombard:!0,description:"Takes 2 hits to sink. Can bombard coastal territories."},transport:{id:"transport",name:"Transport",cost:7,attack:0,defense:1,movement:2,type:"sea",canCarry:!0,carriedBy:[],carriesMax:2,carriesTypes:["infantry","artillery","armor","antiair"],icon:"🚤",color:"#44a",isCustom:!1,description:"Carries up to 2 land units (1 heavy = 1 slot, infantry/art = 1 slot each)."}};let W={};function E(){return{...K,...W}}const O="aa1942_autosave",P=2;class I{constructor(){this.reset()}reset(){this.ownership={},this.units={},this.ipc={},this.round=1,this.currentNationIdx=0,this.phase="setup",this.players={},this.pendingPlacements={},this.activeBattle=null,this.winner=null,this.technologies={},this.industrialComplexes={},this._listeners=[]}loadScenario(t){try{Object.values(v).forEach(e=>{this.ownership[e.id]=e.startOwner,this.units[e.id]=[]}),Object.values(w).forEach(e=>{var a;e.id!=="neutral"&&(this.ipc[e.id]=((a=t.ipc)==null?void 0:a[e.id])??e.startingIPC,this.pendingPlacements[e.id]=[],this.technologies[e.id]=[])}),["germany","russia","united_kingdom","eastern_us","japan"].forEach(e=>{const a=this.ownership[e];a&&a!=="neutral"&&(this.industrialComplexes[e]=a)}),this._placeScenarioUnits(t),this.phase="setup",this.round=1,this.currentNationIdx=0,this.autosave()}catch(e){console.error("[GameState] loadScenario failed:",e)}}_placeScenarioUnits(t){Object.entries(t.units).forEach(([e,a])=>{this.units[e]||(this.units[e]=[]),Array.isArray(a)&&a.forEach(({nation:s,type:n,count:r})=>{for(let c=0;c<r;c++)this.units[e].push(this._makeUnit(n,s))})})}_makeUnit(t,e,a={}){return{id:`${t}_${e}_${Math.random().toString(36).slice(2,7)}`,type:t,nation:e,damaged:!1,moved:!1,...a}}get currentNation(){return T[this.currentNationIdx]}getUnits(t,e=null){const a=this.units[t]||[];return e?a.filter(s=>s.nation===e):a}countUnits(t,e=null){return this.getUnits(t,e).reduce((a,s)=>(a[s.type]=(a[s.type]||0)+1,a),{})}getTerritoryIPC(t){var e;return((e=v[t])==null?void 0:e.ipc)||0}calculateIncome(t){return Object.entries(this.ownership).filter(([,e])=>e===t).reduce((e,[a])=>e+this.getTerritoryIPC(a),0)}moveUnits(t,e,a){try{const s=this.units[e].filter(n=>t.includes(n.id));this.units[e]=this.units[e].filter(n=>!t.includes(n.id)),s.forEach(n=>{n.moved=!0}),this.units[a]=[...this.units[a]||[],...s],this._emit("units_moved",{unitIds:t,fromId:e,toId:a}),this.autosave()}catch(s){console.error("[GameState] moveUnits failed:",s)}}purchaseUnit(t,e){try{const a=E()[t];if(!a)return!1;const s=a.cost;return(this.ipc[e]||0)<s?!1:(this.ipc[e]-=s,this.pendingPlacements[e].push(t),this._emit("unit_purchased",{unitType:t,nation:e}),this.autosave(),!0)}catch(a){return console.error("[GameState] purchaseUnit failed:",a),!1}}refundUnit(t,e){try{const a=this.pendingPlacements[e].indexOf(t);if(a===-1)return!1;const s=E()[t];return this.pendingPlacements[e].splice(a,1),this.ipc[e]+=(s==null?void 0:s.cost)||0,this._emit("unit_refunded",{unitType:t,nation:e}),this.autosave(),!0}catch(a){return console.error("[GameState] refundUnit failed:",a),!1}}placeUnit(t,e,a){try{const s=this.pendingPlacements[e].indexOf(t);if(s===-1)return!1;this.pendingPlacements[e].splice(s,1);const n=this._makeUnit(t,e);return this.units[a]=[...this.units[a]||[],n],this._emit("unit_placed",{unitType:t,nation:e,territoryId:a}),this.autosave(),!0}catch(s){return console.error("[GameState] placeUnit failed:",s),!1}}collectIncome(t){try{const e=this.calculateIncome(t);let a=0;this.hasTech(t,"war_bonds")&&(a=Math.ceil(Math.random()*6));const s=e+a;return this.ipc[t]=Math.min((this.ipc[t]||0)+s,999),this._emit("income_collected",{nation:t,income:e,bonus:a,total:this.ipc[t]}),this.autosave(),{income:e,bonus:a}}catch(e){return console.error("[GameState] collectIncome failed:",e),{income:0,bonus:0}}}captureTerritory(t,e){try{const a=this.ownership[t];this.ownership[t]=e,this.units[t]=(this.units[t]||[]).filter(n=>n.nation===e);const s=Object.values(w).find(n=>n.capital===t);if(s&&s.id!==e&&s.id!=="neutral"){const n=this.ipc[s.id]||0;this.ipc[s.id]=0,this.ipc[e]=(this.ipc[e]||0)+n}this._emit("territory_captured",{territoryId:t,byNation:e,prevOwner:a}),this.autosave()}catch(a){console.error("[GameState] captureTerritory failed:",a)}}hasTech(t,e){return(this.technologies[t]||[]).includes(e)}researchTech(t,e){try{this.technologies[t]||(this.technologies[t]=[]),this.technologies[t].includes(e)||(this.technologies[t].push(e),this._emit("tech_researched",{nation:t,techId:e}),this.autosave())}catch(a){console.error("[GameState] researchTech failed:",a)}}rollResearch(t,e,a){try{const s=e*5;if((this.ipc[t]||0)<s)return{dice:[],breakthroughs:[]};this.ipc[t]-=s;const n=Array.from({length:e},()=>Math.ceil(Math.random()*6)),r=n.filter(o=>o===6).length,c=[],d=a.filter(o=>!this.hasTech(t,o));for(let o=0;o<r&&d.length>0;o++){const h=Math.floor(Math.random()*d.length),p=d.splice(h,1)[0];this.researchTech(t,p),c.push(p)}return this.autosave(),{dice:n,breakthroughs:c}}catch(s){return console.error("[GameState] rollResearch failed:",s),{dice:[],breakthroughs:[]}}}checkVictory(){try{const t=Object.values(w).filter(n=>n.capital).map(n=>({nation:n.id,capital:n.capital,side:n.side})),e=t.filter(({capital:n,side:r})=>r==="allies"&&["germany","japan"].includes(this.ownership[n])).length,a=t.filter(({capital:n,side:r})=>r==="axis"&&["ussr","uk","usa"].includes(this.ownership[n])).length,s=Object.values(w).filter(n=>n.capital&&n.side!=="neutral").length;return e>=s&&(this.winner="axis"),a>=s&&(this.winner="allies"),this.winner}catch(t){return console.error("[GameState] checkVictory failed:",t),null}}nextPhase(){const t=["purchase","combat_move","conduct_combat","noncombat_move","place","collect"],e=t.indexOf(this.phase);e<t.length-1?this.phase=t[e+1]:(this.phase="purchase",this.currentNationIdx=(this.currentNationIdx+1)%T.length,this.currentNationIdx===0&&this.round++,Object.values(this.units).flat().forEach(a=>{a.moved=!1})),this._emit("phase_changed",{phase:this.phase,nation:this.currentNation,round:this.round}),this.autosave()}autosave(){try{const t={version:P,timestamp:Date.now(),ownership:this.ownership,units:this.units,ipc:this.ipc,round:this.round,currentNationIdx:this.currentNationIdx,phase:this.phase,players:this.players,technologies:this.technologies,industrialComplexes:this.industrialComplexes,pendingPlacements:this.pendingPlacements,winner:this.winner};localStorage.setItem(O,JSON.stringify(t))}catch{}}static hasSave(){try{const t=localStorage.getItem(O);return t?JSON.parse(t).version===P:!1}catch{return!1}}static getSaveInfo(){try{const t=localStorage.getItem(O);if(!t)return null;const e=JSON.parse(t);return{timestamp:e.timestamp,round:e.round,phase:e.phase,nation:T[e.currentNationIdx]}}catch{return null}}loadSave(){try{const t=localStorage.getItem(O);if(!t)return!1;const e=JSON.parse(t);return e.version!==P?!1:(this.ownership=e.ownership,this.units=e.units,this.ipc=e.ipc,this.round=e.round,this.currentNationIdx=e.currentNationIdx,this.phase=e.phase,this.players=e.players||{},this.technologies=e.technologies||{},this.industrialComplexes=e.industrialComplexes||{},this.pendingPlacements=e.pendingPlacements||{},this.winner=e.winner||null,this._listeners=[],!0)}catch(t){return console.error("[GameState] loadSave failed:",t),!1}}static clearSave(){try{localStorage.removeItem(O)}catch{}}serialize(){return JSON.stringify(this.autosave)}on(t,e){this._listeners.push({event:t,fn:e})}off(t,e){this._listeners=this._listeners.filter(a=>!(a.event===t&&a.fn===e))}_emit(t,e){this._listeners.filter(a=>a.event===t||a.event==="*").forEach(a=>{try{a.fn(e,t)}catch(s){console.error("[GameState] listener error:",t,s)}})}}class A{static rollDice(t,e){const a=Array.from({length:t},()=>Math.ceil(Math.random()*6)),s=a.filter(n=>n<=e).length;return{rolls:a,hits:s}}static resolveCombatRound(t,e,a=!1){var S;const s=E();let n=null;if(a){const m=e.filter(z=>{var _;return(_=s[z.type])==null?void 0:_.shootsAtAir}),g=t.filter(z=>{var _;return((_=s[z.type])==null?void 0:_.type)==="air"});if(m.length>0&&g.length>0){const z=Math.min(m.length*(((S=s.antiair)==null?void 0:S.airShots)||1),g.length),{rolls:_,hits:C}=A.rollDice(z,1);n={rolls:_,hits:C,targets:g.slice(0,C).map(R=>R.id)}}}const r=n?t.filter(m=>!n.targets.includes(m.id)):[...t],c=r.filter(m=>{var g;return(g=s[m.type])==null?void 0:g.firstStrike}),d=r.filter(m=>{var g;return!((g=s[m.type])!=null&&g.firstStrike)}),o=e.some(m=>m.type==="destroyer");let h=[],p=0;if(c.length>0&&!o){const m=A.rollDice(c.length,s.submarine.attack);h=m.rolls,p=m.hits}const u=d.filter(m=>m.type==="artillery").length;let l=0,f=[...h],x=p;d.forEach(m=>{const g=s[m.type];if(!g)return;let z=g.attack;if(m.type==="infantry"&&l<u&&(z=2,l++),z>0){const{rolls:_,hits:C}=A.rollDice(1,z);f.push(..._),x+=C}});let b=[],k=0;return e.forEach(m=>{const g=s[m.type];if(!(!g||g.shootsAtAir)&&g.defense>0){const{rolls:z,hits:_}=A.rollDice(1,g.defense);b.push(...z),k+=_}}),{attackerRolls:f,defenderRolls:b,attackerHits:x,defenderHits:k,aaResults:n}}static selectCasualties(t,e,a){if(e<=0)return[];const s=E(),n=[...t].sort((d,o)=>{var f,x,b,k,S,m;const h=d.damaged&&((f=s[d.type])==null?void 0:f.twoHit),p=o.damaged&&((x=s[o.type])==null?void 0:x.twoHit);if(h&&!p)return-1;if(!h&&p)return 1;const u=a?(b=s[d.type])==null?void 0:b.attack:(k=s[d.type])==null?void 0:k.defense,l=a?(S=s[o.type])==null?void 0:S.attack:(m=s[o.type])==null?void 0:m.defense;return(u||0)-(l||0)}),r=[];let c=e;for(const d of n){if(c<=0)break;const o=s[d.type];o!=null&&o.twoHit&&!d.damaged?(d.damaged=!0,c--,r.push({unit:d,killed:!1})):(r.push({unit:d,killed:!0}),c--)}return r}static estimateOdds(t,e){const a=E(),s=t.reduce((o,h)=>{var p;return o+(((p=a[h.type])==null?void 0:p.attack)||0)},0),n=e.reduce((o,h)=>{var p;return o+(((p=a[h.type])==null?void 0:p.defense)||0)},0),r=t.reduce((o,h)=>{var p;return o+((p=a[h.type])!=null&&p.twoHit?2:1)},0),c=e.reduce((o,h)=>{var p;return o+((p=a[h.type])!=null&&p.twoHit?2:1)},0);if(s===0)return 0;if(n===0)return 1;t.reduce((o,h)=>{var p;return o+(((p=a[h.type])==null?void 0:p.cost)||0)},0),e.reduce((o,h)=>{var p;return o+(((p=a[h.type])==null?void 0:p.cost)||0)},0);const d=s/6*r/(n/6*c+.001);return Math.min(.99,Math.max(.01,d/(1+d)))}}class q{constructor(t,e){this.state=t,this.ai=e,this.pendingCombats=[],this._phaseListeners=[]}startGame(){this.state.phase="purchase";const t=this.state.currentNation,e=this.state.round;this._emit("turn_start",{nation:t,round:e}),this._emit("phase_changed",{phase:"purchase",nation:t,round:e}),this._checkAI()}advancePhase(){const t=this.state.phase;t==="purchase"?this._endPurchase():t==="combat_move"?this._endCombatMove():t==="conduct_combat"?this._endCombat():t==="noncombat_move"?this._endNonCombatMove():t==="place"?this._endPlace():t==="collect"&&this._endCollect()}_endPurchase(){this.state.nextPhase(),this._emit("phase_changed",{phase:"combat_move",nation:this.state.currentNation}),this._checkAI()}_endCombatMove(){this.pendingCombats=this._findCombats(),this.state.nextPhase(),this._emit("phase_changed",{phase:"conduct_combat",nation:this.state.currentNation,combats:this.pendingCombats}),this.pendingCombats.length>0&&this._emit("combat_needed",{territoryId:this.pendingCombats[0]}),this._checkAI()}_endCombat(){this.pendingCombats=[],this.state.nextPhase(),this._emit("phase_changed",{phase:"noncombat_move",nation:this.state.currentNation}),this._checkAI()}_endNonCombatMove(){this.state.nextPhase(),this._emit("phase_changed",{phase:"place",nation:this.state.currentNation}),this._checkAI()}_endPlace(){this.state.nextPhase(),this._emit("phase_changed",{phase:"collect",nation:this.state.currentNation}),this._checkAI()}_endCollect(){const t=this.state.currentNation,e=this.state.collectIncome(t);if(this._emit("income_collected",{nation:t,income:e}),this.state.nextPhase(),this.state.checkVictory()){this._emit("game_over",{winner:this.state.winner});return}this._emit("turn_start",{nation:this.state.currentNation,round:this.state.round}),this._checkAI()}_findCombats(){const t=this.state.currentNation,e=[];return Object.keys(this.state.units).forEach(a=>{const s=this.state.units[a],n=s.some(c=>c.nation===t),r=s.some(c=>c.nation!==t&&c.nation!==null&&N(c.nation,t));n&&r&&e.push(a)}),e}_checkAI(){this.state.players[this.state.currentNation]==="ai"&&setTimeout(()=>{var t;return(t=this.ai)==null?void 0:t.takeTurn(this)},500)}on(t,e){this._phaseListeners.push({event:t,fn:e})}_emit(t,e){this._phaseListeners.filter(a=>a.event===t).forEach(a=>a.fn(e))}}class X{constructor(t){this.state=t,this.thinkDelay=600,this.difficulty="easy"}async takeTurn(t){const e=this.state.currentNation,a=this.state.phase;try{await this._delay(this.thinkDelay),a==="purchase"?(this._doPurchase(e),t.advancePhase()):a==="combat_move"?(this._doCombatMove(e),t.advancePhase()):a==="conduct_combat"?(await this._doCombat(e,t),t.advancePhase()):a==="noncombat_move"?(this._doNonCombatMove(e),t.advancePhase()):a==="place"?(this._doPlace(e),t.advancePhase()):a==="collect"&&t.advancePhase()}catch(s){console.error("[AI] takeTurn error — skipping phase:",s);try{t.advancePhase()}catch{}}}_doPurchase(t){const e=this.state.ipc[t],a=E();w[t].side;const s=e;let n=0;const r=[];if(this._isCapitalThreatened(t))for(;n+a.infantry.cost<=s&&r.filter(d=>d==="infantry").length<8;)r.push("infantry"),n+=a.infantry.cost;else{let d=0,o=0;for(;n<s;){const p=s-n;if(p>=a.armor.cost&&o<d/2)r.push("armor"),n+=a.armor.cost,o++;else if(p>=a.infantry.cost)r.push("infantry"),n+=a.infantry.cost,d++;else if(p>=a.artillery.cost)r.push("artillery"),n+=a.artillery.cost;else break}const h=this._getAllUnitsOfNation(t).filter(p=>{var u;return((u=E()[p.type])==null?void 0:u.type)==="air"}).length;s-n>=a.fighter.cost&&h<3&&(r.push("fighter"),n+=a.fighter.cost)}r.forEach(d=>this.state.purchaseUnit(d,t))}_doCombatMove(t){this._getMyTerritories(t).forEach(a=>{const s=this.state.getUnits(a,t);if(s.length===0)return;const n=v[a];n&&n.adjacent.forEach(r=>{const c=v[r];if(!c||c.type==="sea")return;const d=this.state.ownership[r];if(!d||d===t||!N(d,t))return;const o=this.state.getUnits(r),h=A.estimateOdds(s,o),p=Object.values(w).some(u=>u.capital===r);if(h>.6||p&&h>.4){const u=s.slice(0,Math.ceil(s.length*.7));u.length>0&&this.state.moveUnits(u.map(l=>l.id),a,r)}})})}async _doCombat(t,e){const a=e.pendingCombats||[];for(const s of a){await this._delay(400);let n=0,r=!0;for(;n<20;){const c=this.state.getUnits(s,t),d=this.state.getUnits(s).filter(u=>u.nation!==t);if(c.length===0)break;if(d.length===0){this.state.captureTerritory(s,t);break}const o=A.resolveCombatRound(c,d,r);A.selectCasualties(c,o.defenderHits,!0).filter(u=>u.killed).forEach(u=>{this.state.units[s]=this.state.units[s].filter(l=>l.id!==u.unit.id)}),A.selectCasualties(d,o.attackerHits,!1).filter(u=>u.killed).forEach(u=>{this.state.units[s]=this.state.units[s].filter(l=>l.id!==u.unit.id)}),r=!1,n++}}}_doNonCombatMove(t){const e=this._getMyTerritories(t),a=w[t].capital;e.forEach(s=>{if(s===a)return;const n=this.state.getUnits(s,t).filter(c=>!c.moved);if(n.length<=1)return;const r=v[s];r==null||r.adjacent.forEach(c=>{if(this.state.ownership[c]!==t)return;if(this.state.getUnits(c,t).length<n.length-1){const h=n.filter(p=>!p.moved).slice(0,1);h.length>0&&this.state.moveUnits(h.map(p=>p.id),s,c)}})})}_doPlace(t){const e=[...this.state.pendingPlacements[t]],a=w[t].capital;e.forEach(s=>{this.state.placeUnit(s,t,a)})}_getMyTerritories(t){return Object.entries(this.state.ownership).filter(([,e])=>e===t).map(([e])=>e)}_getAllUnitsOfNation(t){return Object.values(this.state.units).flat().filter(e=>e.nation===t)}_isCapitalThreatened(t){const e=w[t].capital,a=v[e];return a?a.adjacent.some(s=>this.state.getUnits(s).some(r=>N(r.nation,t))):!1}_delay(t){return new Promise(e=>setTimeout(e,t))}}function i(y,t,e){return{nation:y,type:t,count:e}}const J={name:"Axis & Allies 1942 — Second Edition",startYear:1942,ipc:{ussr:24,germany:40,uk:31,japan:30,usa:42},units:{russia:[i("ussr","infantry",8),i("ussr","armor",4),i("ussr","antiair",1),i("ussr","fighter",1)],karelia:[i("ussr","infantry",4),i("ussr","fighter",1),i("ussr","bomber",1)],caucasus:[i("ussr","infantry",5),i("ussr","armor",2),i("ussr","antiair",1)],archangel:[i("ussr","infantry",2)],kazakh:[i("ussr","infantry",3)],novosibirsk:[i("ussr","infantry",2)],evenki:[i("ussr","infantry",1)],yakut:[i("ussr","infantry",1)],soviet_far_east:[i("ussr","infantry",2)],buryatia:[i("ussr","infantry",1)],germany:[i("germany","infantry",5),i("germany","armor",2),i("germany","antiair",1),i("germany","fighter",2),i("germany","bomber",1)],western_europe:[i("germany","infantry",4),i("germany","armor",2),i("germany","antiair",1)],norway:[i("germany","infantry",3)],finland:[i("germany","infantry",3)],baltic_states:[i("germany","infantry",3),i("germany","armor",1)],eastern_europe:[i("germany","infantry",3),i("germany","armor",3)],belorussia:[i("germany","infantry",6),i("germany","armor",3),i("germany","fighter",1)],ukraine:[i("germany","infantry",5),i("germany","armor",4),i("germany","fighter",1)],romania_bulgaria:[i("germany","infantry",4),i("germany","armor",2),i("germany","antiair",1)],southern_europe:[i("germany","infantry",4),i("germany","armor",1),i("germany","antiair",1),i("germany","fighter",1)],north_africa:[i("germany","infantry",3),i("germany","armor",4),i("germany","fighter",1)],united_kingdom:[i("uk","infantry",2),i("uk","antiair",1),i("uk","fighter",2),i("uk","bomber",1)],egypt:[i("uk","infantry",4),i("uk","armor",1),i("uk","fighter",1)],india:[i("uk","infantry",4),i("uk","armor",1),i("uk","fighter",1)],south_africa:[i("uk","infantry",1)],west_africa:[i("uk","infantry",1)],east_africa:[i("uk","infantry",1)],anglo_egypt_sudan:[i("uk","infantry",1)],trans_jordan:[i("uk","infantry",1)],persia:[i("uk","infantry",1)],australia:[i("uk","infantry",3),i("uk","fighter",1)],new_zealand:[i("uk","infantry",1)],new_guinea:[i("uk","infantry",1)],japan:[i("japan","infantry",3),i("japan","antiair",1),i("japan","fighter",3),i("japan","bomber",2)],manchuria:[i("japan","infantry",6),i("japan","armor",2)],korea:[i("japan","infantry",4)],french_indochina:[i("japan","infantry",4),i("japan","armor",1)],kwangtung:[i("japan","infantry",4),i("japan","armor",2)],kiangsu:[i("japan","infantry",3)],malaya:[i("japan","infantry",3)],borneo:[i("japan","infantry",3)],dutch_east_indies:[i("japan","infantry",4)],philippines:[i("japan","infantry",4)],solomon_islands:[i("japan","infantry",2)],eastern_us:[i("usa","infantry",5),i("usa","armor",1),i("usa","antiair",1),i("usa","fighter",2),i("usa","bomber",1)],central_us:[i("usa","infantry",3)],western_us:[i("usa","infantry",3),i("usa","armor",1),i("usa","fighter",2)],alaska:[i("usa","infantry",1)],hawaii:[i("usa","infantry",2),i("usa","fighter",2)],midway:[i("usa","infantry",1)],sz_5:[i("germany","cruiser",1),i("germany","submarine",1),i("ussr","destroyer",1)],sz_6:[i("uk","carrier",1),i("uk","fighter",1),i("uk","destroyer",1)],sz_7:[i("uk","transport",1),i("uk","destroyer",1)],sz_8:[i("germany","battleship",1),i("germany","cruiser",1),i("usa","transport",1)],sz_12:[i("uk","cruiser",1),i("uk","transport",1)],sz_14:[i("germany","submarine",1)],sz_15:[i("germany","submarine",1),i("uk","destroyer",1)],sz_19:[i("japan","battleship",1),i("japan","carrier",2),i("japan","fighter",3),i("japan","destroyer",1),i("japan","submarine",1)],sz_20:[i("uk","transport",2),i("uk","destroyer",2),i("uk","battleship",1)],sz_26:[i("usa","carrier",1),i("usa","fighter",1),i("usa","battleship",1),i("usa","destroyer",2),i("usa","submarine",1),i("usa","transport",2),i("usa","cruiser",1)],sz_36:[i("japan","destroyer",1),i("japan","transport",4),i("japan","battleship",1),i("japan","cruiser",1)],sz_37:[i("japan","destroyer",1),i("uk","destroyer",1),i("uk","transport",1)],sz_41:[i("japan","destroyer",2),i("japan","transport",2),i("japan","submarine",1)],sz_56:[i("usa","battleship",1),i("usa","destroyer",1)],sz_61:[i("japan","destroyer",1),i("japan","carrier",1),i("japan","fighter",1)],sz_10:[i("usa","carrier",1),i("usa","destroyer",1),i("usa","fighter",1)]}};window.__TERRITORIES=v;const $={ussr:"#8a1a1a",germany:"#2e4a58",uk:"#7a5008",japan:"#a07010",usa:"#1c4a1a",neutral:"#4a4830"},Q={ussr:"#e03030",germany:"#70b0c8",uk:"#e8a030",japan:"#e8c030",usa:"#40a838",neutral:"#9a9870"},Y="#0b1a30",G=1400,D=780,tt={infantry:"INF",artillery:"ART",armor:"ARM",antiair:"AA",fighter:"FTR",bomber:"BMB",submarine:"SUB",destroyer:"DD",cruiser:"CA",carrier:"CV",battleship:"BB",transport:"TRN"};class et{constructor(t,e){this.container=t,this.app=e,this.state=e.state,this.selectedId=null,this.validTargets=new Set,this.svg=null,this._pinching=!1,this._blobGroups={}}render(){this.svg?this._update():this._build()}setSelection(t,e=[]){this.selectedId=t,this.validTargets=new Set(e),this._updateSelections()}clearSelection(){this.selectedId=null,this.validTargets.clear(),this._updateSelections()}_build(){this.container.innerHTML=`<style>${at}</style>`;const t=document.createElement("div");t.className="map-wrap",this.container.appendChild(t);const e=document.createElementNS("http://www.w3.org/2000/svg","svg");e.setAttribute("viewBox",`0 0 ${G} ${D}`),e.setAttribute("class","map-svg"),this.svg=e,t.appendChild(e),this._buildDefs(e);const a=document.createElementNS("http://www.w3.org/2000/svg","rect");a.setAttribute("width",G),a.setAttribute("height",D),a.setAttribute("fill","url(#ocean-grad)"),e.appendChild(a),["neutral","ussr","germany","uk","japan","usa"].forEach(s=>{const n=document.createElementNS("http://www.w3.org/2000/svg","g");n.setAttribute("id",`blobs-${s}`),n.setAttribute("filter","url(#goo)"),e.appendChild(n),this._blobGroups[s]=n}),this._seaGroup=this._makeGroup(e,"sea-labels"),this._labelGroup=this._makeGroup(e,"terr-labels"),this._selGroup=this._makeGroup(e,"selections"),this._unitGroup=this._makeGroup(e,"unit-tokens"),this._hitGroup=this._makeGroup(e,"hit-targets"),this._drawSeaLabels(),this._drawStaticLabels(),this._drawHitTargets(),this._updateBlobs(),this._updateUnits(),this._updateSelections(),this._attachInteraction(t)}_makeGroup(t,e){const a=document.createElementNS("http://www.w3.org/2000/svg","g");return a.setAttribute("id",e),t.appendChild(a),a}_buildDefs(t){const e=document.createElementNS("http://www.w3.org/2000/svg","defs");e.innerHTML=`
      <radialGradient id="ocean-grad" cx="50%" cy="42%" r="65%">
        <stop offset="0%"   stop-color="#1c3858"/>
        <stop offset="100%" stop-color="${Y}"/>
      </radialGradient>

      <!-- Goo/metaball: adjacent same-nation blobs merge into painted regions -->
      <filter id="goo" x="-30%" y="-30%" width="160%" height="160%"
              color-interpolation-filters="sRGB">
        <feGaussianBlur stdDeviation="18" result="blur"/>
        <feColorMatrix type="matrix" result="cm"
          values="1 0 0 0 0
                  0 1 0 0 0
                  0 0 1 0 0
                  0 0 0 28 -11"/>
      </filter>

      <!-- Drop shadow for text readability over blobs -->
      <filter id="txt-shadow" x="-15%" y="-15%" width="130%" height="130%">
        <feDropShadow dx="0" dy="0" stdDeviation="2"
          flood-color="rgba(0,0,0,1)" flood-opacity="1"/>
      </filter>
    `,t.appendChild(e)}_blobR(t){return t.ipc===0?30:Math.max(34,Math.min(76,18+t.ipc*5))}_updateBlobs(){const t=this.state.ownership||{};Object.values(this._blobGroups).forEach(e=>{e.innerHTML=""}),Object.values(v).forEach(e=>{if(e.type==="sea")return;const a=t[e.id]||"neutral",s=this._blobGroups[a]||this._blobGroups.neutral;if(!s)return;const n=this._blobR(e),r=$[a]||$.neutral,c=document.createElementNS("http://www.w3.org/2000/svg","circle");c.setAttribute("cx",e.x),c.setAttribute("cy",e.y),c.setAttribute("r",n),c.setAttribute("fill",r),s.appendChild(c)})}_drawSeaLabels(){Object.values(v).forEach(t=>{if(t.type!=="sea")return;const e=t.id.replace("sz_",""),a=document.createElementNS("http://www.w3.org/2000/svg","text");a.setAttribute("x",t.x),a.setAttribute("y",t.y),a.setAttribute("text-anchor","middle"),a.setAttribute("dominant-baseline","middle"),a.setAttribute("font-size","11"),a.setAttribute("fill","#2a5878"),a.setAttribute("font-family","Arial, sans-serif"),a.setAttribute("font-weight","bold"),a.setAttribute("pointer-events","none"),a.textContent=e,this._seaGroup.appendChild(a)})}_drawStaticLabels(){const t=new Set(Object.values(w).filter(e=>e.capital).map(e=>e.capital));Object.values(v).forEach(e=>{var d;if(e.type==="sea")return;const a=this._blobR(e),s=document.createElementNS("http://www.w3.org/2000/svg","g");if(s.setAttribute("data-lbl",e.id),t.has(e.id)){const o=document.createElementNS("http://www.w3.org/2000/svg","text");o.setAttribute("x",e.x),o.setAttribute("y",e.y-a*.52),o.setAttribute("text-anchor","middle"),o.setAttribute("dominant-baseline","middle"),o.setAttribute("font-size","14"),o.setAttribute("fill","#f0d040"),o.setAttribute("filter","url(#txt-shadow)"),o.setAttribute("pointer-events","none"),o.textContent="★",s.appendChild(o)}if((d=this.state.industrialComplexes)!=null&&d[e.id]){const o=document.createElementNS("http://www.w3.org/2000/svg","text");o.setAttribute("x",e.x+a*.58),o.setAttribute("y",e.y-a*.55),o.setAttribute("font-size","12"),o.setAttribute("pointer-events","none"),o.textContent="🏭",s.appendChild(o)}const n=e.name.length>14?e.name.slice(0,13)+"…":e.name,r=document.createElementNS("http://www.w3.org/2000/svg","text");r.setAttribute("x",e.x);const c=t.has(e.id)?e.y-a*.1:e.y-(e.ipc>0?a*.18:0);if(r.setAttribute("y",c),r.setAttribute("text-anchor","middle"),r.setAttribute("dominant-baseline","middle"),r.setAttribute("font-size",a>=50?"9":"7.5"),r.setAttribute("fill","rgba(255,248,215,0.95)"),r.setAttribute("font-family","Arial Narrow, Arial, sans-serif"),r.setAttribute("font-weight","bold"),r.setAttribute("filter","url(#txt-shadow)"),r.setAttribute("pointer-events","none"),r.textContent=n,s.appendChild(r),e.ipc>0){const o=document.createElementNS("http://www.w3.org/2000/svg","text");o.setAttribute("x",e.x),o.setAttribute("y",e.y+a*.3),o.setAttribute("text-anchor","middle"),o.setAttribute("dominant-baseline","middle"),o.setAttribute("font-size",a>=50?"14":"11"),o.setAttribute("fill","#f8d840"),o.setAttribute("font-family","Arial Narrow, Arial, sans-serif"),o.setAttribute("font-weight","bold"),o.setAttribute("filter","url(#txt-shadow)"),o.setAttribute("pointer-events","none"),o.setAttribute("class","ipc-val"),o.textContent=`₊${e.ipc}`,s.appendChild(o)}this._labelGroup.appendChild(s)})}_drawHitTargets(){Object.values(v).forEach(t=>{const e=t.type==="sea"?22:this._blobR(t),a=document.createElementNS("http://www.w3.org/2000/svg","circle");a.setAttribute("cx",t.x),a.setAttribute("cy",t.y),a.setAttribute("r",e),a.setAttribute("fill","transparent"),a.setAttribute("data-id",t.id),a.setAttribute("class","hit-target"),a.addEventListener("click",s=>{s.stopPropagation(),this.app.onTerritoryClick(t.id)}),a.addEventListener("touchend",s=>{s.preventDefault(),s.stopPropagation(),this.app.onTerritoryClick(t.id)}),this._hitGroup.appendChild(a)})}_updateUnits(){this._unitGroup&&(this._unitGroup.innerHTML="",Object.values(v).forEach(t=>{const e=this.state.getUnits(t.id);if(e.length===0)return;const a={};e.forEach(u=>{a[u.nation]||(a[u.nation]={}),a[u.nation][u.type]=(a[u.nation][u.type]||0)+1});const s=[];Object.entries(a).forEach(([u,l])=>{Object.entries(l).forEach(([f,x])=>{s.push({nat:u,type:f,count:x})})});const n=4,r=s.slice(0,n),c=20,d=r.length*c,o=t.x-d/2+c/2,h=this._blobR(t),p=t.type==="sea"?t.y:t.y-h*.35;if(r.forEach(({nat:u,type:l,count:f},x)=>{const b=o+x*c,k=Q[u]||"#666",S=tt[l]||l.slice(0,3).toUpperCase();this._svgCircle(this._unitGroup,b,p,9,"#080c12",k,"2");const m=document.createElementNS("http://www.w3.org/2000/svg","text");if(m.setAttribute("x",b),m.setAttribute("y",p+.5),m.setAttribute("text-anchor","middle"),m.setAttribute("dominant-baseline","middle"),m.setAttribute("font-size",S.length>2?"4.5":"5.5"),m.setAttribute("fill","#e8ddc0"),m.setAttribute("font-weight","bold"),m.setAttribute("font-family","Arial, sans-serif"),m.setAttribute("pointer-events","none"),m.textContent=S,this._unitGroup.appendChild(m),f>1){const g=b+6,z=p-6;this._svgCircle(this._unitGroup,g,z,4.5,"#c02020","#080c12","0.8");const _=document.createElementNS("http://www.w3.org/2000/svg","text");_.setAttribute("x",g),_.setAttribute("y",z+.5),_.setAttribute("text-anchor","middle"),_.setAttribute("dominant-baseline","middle"),_.setAttribute("font-size","4.5"),_.setAttribute("fill","#fff"),_.setAttribute("font-weight","bold"),_.setAttribute("pointer-events","none"),_.textContent=f>9?"9+":f,this._unitGroup.appendChild(_)}}),s.length>n){const u=o+n*c;this._svgCircle(this._unitGroup,u,p,9,"#252518","#888","1");const l=document.createElementNS("http://www.w3.org/2000/svg","text");l.setAttribute("x",u),l.setAttribute("y",p+.5),l.setAttribute("text-anchor","middle"),l.setAttribute("dominant-baseline","middle"),l.setAttribute("font-size","5"),l.setAttribute("fill","#bbb"),l.setAttribute("pointer-events","none"),l.textContent=`+${s.length-n}`,this._unitGroup.appendChild(l)}}))}_svgCircle(t,e,a,s,n,r,c){const d=document.createElementNS("http://www.w3.org/2000/svg","circle");return d.setAttribute("cx",e),d.setAttribute("cy",a),d.setAttribute("r",s),d.setAttribute("fill",n),d.setAttribute("stroke",r),d.setAttribute("stroke-width",c),d.setAttribute("pointer-events","none"),t.appendChild(d),d}_updateSelections(){var e;if(!this._selGroup)return;if(this._selGroup.innerHTML="",this.selectedId){const a=v[this.selectedId];if(a){const s=(a.type==="sea"?22:this._blobR(a))+8,n=document.createElementNS("http://www.w3.org/2000/svg","circle");n.setAttribute("cx",a.x),n.setAttribute("cy",a.y),n.setAttribute("r",s),n.setAttribute("fill","rgba(255,255,255,0.08)"),n.setAttribute("stroke","#ffffff"),n.setAttribute("stroke-width","2.5"),n.setAttribute("stroke-dasharray","7,3"),n.setAttribute("pointer-events","none"),this._selGroup.appendChild(n)}}this.validTargets.forEach(a=>{const s=v[a];if(!s)return;const n=(s.type==="sea"?22:this._blobR(s))+6,r=document.createElementNS("http://www.w3.org/2000/svg","circle");r.setAttribute("cx",s.x),r.setAttribute("cy",s.y),r.setAttribute("r",n),r.setAttribute("fill","rgba(50,255,90,0.18)"),r.setAttribute("stroke","#40ff60"),r.setAttribute("stroke-width","2.5"),r.setAttribute("pointer-events","none"),this._selGroup.appendChild(r)}),(((e=this.app.turnEngine)==null?void 0:e.pendingCombats)||[]).forEach(a=>{const s=v[a];if(!s)return;const n=(s.type==="sea"?22:this._blobR(s))+6,r=document.createElementNS("http://www.w3.org/2000/svg","circle");r.setAttribute("cx",s.x),r.setAttribute("cy",s.y),r.setAttribute("r",n),r.setAttribute("fill","rgba(255,40,40,0.12)"),r.setAttribute("stroke","#ff3030"),r.setAttribute("stroke-width","2.5"),r.setAttribute("stroke-dasharray","6,3"),r.setAttribute("pointer-events","none"),this._selGroup.appendChild(r)})}_update(){this.svg&&(this._updateBlobs(),this._updateUnits(),this._updateSelections())}_attachInteraction(t){let e=!1,a=null,s=0,n=0,r=1;const c=this.svg,d=()=>{c.style.transform=`translate(${s}px,${n}px) scale(${r})`};t.addEventListener("touchstart",o=>{o.touches.length===1?(e=!0,a={x:o.touches[0].clientX-s,y:o.touches[0].clientY-n}):o.touches.length===2&&(e=!1,this._pinching=!0,this._pinchStart={dist:Math.hypot(o.touches[0].clientX-o.touches[1].clientX,o.touches[0].clientY-o.touches[1].clientY),scale:r})},{passive:!0}),t.addEventListener("touchmove",o=>{if(e&&o.touches.length===1)s=o.touches[0].clientX-a.x,n=o.touches[0].clientY-a.y,d();else if(this._pinching&&o.touches.length===2){const h=Math.hypot(o.touches[0].clientX-o.touches[1].clientX,o.touches[0].clientY-o.touches[1].clientY);r=Math.max(.4,Math.min(5,this._pinchStart.scale*(h/this._pinchStart.dist))),d()}},{passive:!0}),t.addEventListener("touchend",o=>{e=!1,o.touches.length<2&&(this._pinching=!1)},{passive:!0}),t.addEventListener("dblclick",()=>{s=0,n=0,r=1,d()})}}const at=`
  .map-wrap {
    width: 100%; height: 100%;
    overflow: hidden; position: relative;
    background: ${Y};
  }
  .map-svg {
    width: 100%; height: 100%;
    display: block; transform-origin: top left;
  }
  .hit-target { cursor: pointer; }
`,st={setup:"SETUP",purchase:"PURCHASE",combat_move:"COMBAT MOVE",conduct_combat:"COMBAT",noncombat_move:"NON-COMBAT",place:"MOBILIZE",collect:"INCOME"},U=["germany","western_europe","southern_europe","japan","manchuria","russia","united_kingdom","eastern_us","india","australia"],H=9,nt={ussr:"★",germany:"✚",uk:"⊕",japan:"✿",usa:"★"};class it{constructor(t,e){this.container=t,this.app=e,this.state=e.state,this._built=!1}render(){this._built||(this.container.innerHTML=`<style>${rt}</style><div id="hud" class="hud"></div>`,this._built=!0),this._update()}_countVCs(){const t=this.state.ownership||{};let e=0,a=0;return U.forEach(s=>{const n=w[t[s]];(n==null?void 0:n.side)==="axis"?e++:(n==null?void 0:n.side)==="allies"&&a++}),{axisVC:e,alliedVC:a}}_update(){const t=this.container.querySelector("#hud");if(!t)return;const e=this.state.currentNation,a=w[e],s=this.state.phase,n=this.state.round,r=this.state.ipc[e]||0,{axisVC:c,alliedVC:d}=this._countVCs(),o=this.state.ownership||{};t.innerHTML=`
      <!-- Round counter -->
      <div class="h-round">
        <div class="h-round-label">ROUND</div>
        <div class="h-round-num">${n}</div>
      </div>

      <!-- Nation turn-order icons -->
      <div class="h-nations">
        ${T.map(h=>{const p=w[h],u=h===e,l=this.state.ipc[h]||0,f=this.state.players[h]==="human";return`
            <div class="h-nat ${u?"active":""} ${p.side}"
                 title="${p.name}: ${l} IPC ${f?"(You)":"(AI)"}">
              <span class="h-nat-sym">${nt[h]||p.flag}</span>
              ${u?'<div class="h-nat-pip"></div>':""}
            </div>`}).join("")}
      </div>

      <!-- Phase + current nation -->
      <div class="h-center">
        <div class="h-phase-name">${st[s]||s}</div>
        <div class="h-nation-lbl" style="color:${(a==null?void 0:a.color)||"#888"}">${(a==null?void 0:a.name)||e}</div>
      </div>

      <!-- Victory Cities tracker -->
      <div class="h-vc">
        <div class="h-vc-row">
          <span class="h-vc-count axis">AXIS ${c}/${H}</span>
          <div class="h-vc-bar">
            ${U.map(h=>{var u;return`<span class="h-vc-sq ${((u=w[o[h]])==null?void 0:u.side)||"neutral"}"></span>`}).join("")}
          </div>
          <span class="h-vc-count allies">ALLIES ${d}/${U.length-H+1}</span>
        </div>
        <div class="h-vc-label">VICTORY CITIES</div>
      </div>

      <!-- Current-nation IPC -->
      <div class="h-ipc">
        <div class="h-ipc-val">${r}</div>
        <div class="h-ipc-lbl">IPC</div>
      </div>

      <!-- Rules button -->
      <button class="h-rules-btn" id="btn-rules" title="Rules Reference">📖</button>
    `}}const rt=`
  .hud {
    display: flex; align-items: center; gap: 8px;
    padding: 0 10px;
    background: #1a1e14;
    border-bottom: 2px solid #2e3222;
    height: 52px; flex-shrink: 0;
    font-family: 'Arial Narrow', Arial, sans-serif;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.5);
  }

  /* ── Round box ── */
  .h-round {
    display: flex; flex-direction: column; align-items: center;
    background: #c8a040; color: #0a0a05;
    padding: 3px 8px; border-radius: 3px;
    min-width: 44px; flex-shrink: 0;
  }
  .h-round-label { font-size: 0.52rem; font-weight: 900; letter-spacing: 1.5px; line-height: 1; }
  .h-round-num   { font-size: 1.1rem;  font-weight: 900; line-height: 1; }

  /* ── Nation icons ── */
  .h-nations { display: flex; gap: 4px; flex-shrink: 0; }
  .h-nat {
    width: 30px; height: 30px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    border: 2px solid transparent; cursor: default;
    opacity: 0.4; position: relative; transition: opacity 0.2s;
  }
  .h-nat.active  { opacity: 1; border-color: #e8a820; }
  .h-nat.axis    { background: #2a1414; }
  .h-nat.allies  { background: #141828; }
  .h-nat-sym     { font-size: 0.82rem; line-height: 1; }
  .h-nat-pip {
    position: absolute; bottom: -5px; left: 50%; transform: translateX(-50%);
    width: 4px; height: 4px; border-radius: 50%; background: #e8a820;
  }

  /* ── Phase block ── */
  .h-center {
    display: flex; flex-direction: column; align-items: center;
    padding: 0 6px; flex-shrink: 0;
  }
  .h-phase-name {
    font-size: 0.82rem; font-weight: 900; color: #e8e0c8;
    letter-spacing: 1.5px; text-transform: uppercase; line-height: 1;
  }
  .h-nation-lbl { font-size: 0.6rem; font-weight: bold; line-height: 1.4; }

  /* ── Victory Cities ── */
  .h-vc {
    flex: 1; display: flex; flex-direction: column; align-items: center;
    gap: 2px; min-width: 0;
  }
  .h-vc-row     { display: flex; align-items: center; gap: 6px; }
  .h-vc-count   { font-size: 0.66rem; font-weight: bold; white-space: nowrap; }
  .h-vc-count.axis   { color: #e07060; }
  .h-vc-count.allies { color: #70a8e8; }
  .h-vc-bar     { display: flex; gap: 2px; flex-wrap: nowrap; }
  .h-vc-sq {
    width: 11px; height: 11px; border-radius: 2px;
    background: #333; border: 1px solid #444;
  }
  .h-vc-sq.axis    { background: #b02820; border-color: #d04030; }
  .h-vc-sq.allies  { background: #1848a0; border-color: #2868c0; }
  .h-vc-sq.neutral { background: #404030; border-color: #606050; }
  .h-vc-label {
    font-size: 0.48rem; color: #5a6840; letter-spacing: 1px; text-transform: uppercase;
  }

  /* ── IPC block ── */
  .h-ipc {
    display: flex; flex-direction: column; align-items: center;
    background: #0e1408; border: 1px solid #2a3820;
    border-radius: 4px; padding: 3px 10px; flex-shrink: 0;
  }
  .h-ipc-val { font-size: 1.2rem; color: #c8a040; font-weight: 900; line-height: 1; }
  .h-ipc-lbl { font-size: 0.52rem; color: #5a6a3a; letter-spacing: 1px; }

  /* ── Rules button ── */
  .h-rules-btn {
    background: #1a1e14; border: 1px solid #3a4028;
    color: #8a9060; font-size: 1rem;
    width: 32px; height: 32px; border-radius: 5px;
    cursor: pointer; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    -webkit-tap-highlight-color: transparent;
  }
  .h-rules-btn:hover { background: #2a2e1c; color: #c0b880; }
`,ot={infantry:"INF",artillery:"ART",armor:"ARM",antiair:"AA",fighter:"FTR",bomber:"BMB",tactical_bomber:"TAC",submarine:"SUB",destroyer:"DD",cruiser:"CA",carrier:"CV",battleship:"BB",transport:"TP",industrial_complex:"IC"},V={id:"industrial_complex",name:"Industrial Complex",cost:15,attack:0,defense:0,movement:0,type:"building",description:"Produces units each round. Build in captured territory with 3+ IPC."};class ct{constructor(t,e){this.container=t,this.app=e,this.state=e.state,this._el=null,this._tab="land"}show(){if(this._el){this._render();return}this._el=document.createElement("div"),this._el.innerHTML=`<style>${lt}</style><div class="pp-panel" id="pp-panel"></div>`,this.container.appendChild(this._el),this._render()}hide(){var t;(t=this._el)==null||t.remove(),this._el=null}_render(){var h,p,u;const t=(h=this._el)==null?void 0:h.querySelector("#pp-panel");if(!t)return;const e=this.state.currentNation,a=this.state.ipc[e]||0,s=this.state.pendingPlacements[e]||[],n=E(),r=s.reduce((l,f)=>{var x;return l+(((x=n[f])==null?void 0:x.cost)||V.cost||0)},0),c={};s.forEach(l=>{c[l]=(c[l]||0)+1});const d={land:[],sea:[],air:[],industry:[V]};Object.values(n).forEach(l=>{const f=l.type==="building"?"industry":l.type;d[f]&&d[f].push(l)});const o=d[this._tab]||[];t.innerHTML=`
      <div class="pp-hdr">
        <button class="pp-x" id="pp-x">✕</button>
        <div class="pp-title">PURCHASE UNITS</div>
        <div class="pp-subtitle">Units mobilized during mobilization phase</div>
      </div>

      <div class="pp-ipc-bar">
        <div class="pp-ipc-item">
          <span class="pp-ipc-label">REMAINING IPC</span>
          <span class="pp-ipc-val ${a<5?"low":""}">${a}</span>
        </div>
        <div class="pp-ipc-sep"></div>
        <div class="pp-ipc-item right">
          <span class="pp-ipc-label">PURCHASED</span>
          <span class="pp-ipc-val">${s.length}</span>
        </div>
      </div>

      <div class="pp-tabs">
        ${["land","sea","air","industry"].map(l=>`
          <button class="pp-tab ${this._tab===l?"active":""}" data-tab="${l}">
            ${l.toUpperCase()}
          </button>`).join("")}
      </div>

      <div class="pp-col-hdr">
        <span class="pp-col-unit">UNIT</span>
        <span class="pp-col-stat">ATK</span>
        <span class="pp-col-stat">DEF</span>
        <span class="pp-col-stat">MOV</span>
        <span class="pp-col-stat cost">COST</span>
        <span class="pp-col-buy">PURCHASE</span>
      </div>

      <div class="pp-list">
        ${o.map(l=>this._unitRow(l,a,c[l.id]||0)).join("")}
      </div>

      <div class="pp-footer">
        <div class="pp-spent-lbl">SPENT: <b>${r} IPC</b></div>
        <button class="pp-end" id="pp-end">END PHASE</button>
      </div>
    `,t.querySelectorAll(".pp-tab").forEach(l=>l.addEventListener("click",()=>{this._tab=l.dataset.tab,this._render()})),t.querySelectorAll(".pp-plus").forEach(l=>l.addEventListener("click",()=>{this.state.purchaseUnit(l.dataset.type,e),this._render()})),t.querySelectorAll(".pp-minus").forEach(l=>l.addEventListener("click",()=>{this.state.refundUnit(l.dataset.type,e),this._render()})),(p=t.querySelector("#pp-x"))==null||p.addEventListener("click",()=>this.hide()),(u=t.querySelector("#pp-end"))==null||u.addEventListener("click",()=>{this.hide(),this.app.turnEngine.advancePhase()})}_unitRow(t,e,a){const s=e>=t.cost,n=t.type==="building",r=t.attack===0&&(n||t.shootsAtAir)?"—":t.attack,c=t.defense===0&&n?"—":t.defense,d=t.movement===0&&n?"—":t.movement,o=ot[t.id]||t.id.slice(0,3).toUpperCase();return`
      <div class="pp-row ${!s&&a===0?"dim":""}">
        <div class="pp-unit-art">
          <div class="pp-art-circle" title="${t.description||""}">${o}</div>
          <span class="pp-unit-name">${t.name.toUpperCase()}</span>
        </div>
        <span class="pp-stat">${r}</span>
        <span class="pp-stat">${c}</span>
        <span class="pp-stat">${d}</span>
        <span class="pp-stat cost">${t.cost}</span>
        <div class="pp-buy">
          <button class="pp-minus" data-type="${t.id}" ${a===0?"disabled":""}>−</button>
          <span class="pp-qty ${a>0?"has":""}">${a}</span>
          <button class="pp-plus" data-type="${t.id}" ${s?"":"disabled"}>+</button>
        </div>
      </div>`}}const lt=`
  .pp-panel {
    position: fixed; right: 0; top: 52px; bottom: 0;
    width: min(360px, 46vw);
    background: #161616;
    border-left: 2px solid #2c2c2c;
    display: flex; flex-direction: column;
    font-family: 'Arial Narrow', Arial, sans-serif;
    color: #d0d0c0; z-index: 300;
    box-shadow: -4px 0 24px rgba(0,0,0,0.8);
    overflow: hidden;
  }

  /* Header */
  .pp-hdr {
    background: #1c1c1c;
    border-bottom: 1px solid #2c2c2c;
    padding: 10px 14px 8px;
    position: relative; flex-shrink: 0;
  }
  .pp-x {
    position: absolute; top: 8px; right: 10px;
    background: #2a2a2a; border: none; color: #888;
    width: 28px; height: 28px; border-radius: 50%;
    font-size: 0.9rem; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
  }
  .pp-x:hover { background: #c83018; color: #fff; }
  .pp-title    { font-size: 0.88rem; font-weight: 900; color: #e0d8c0; letter-spacing: 1.5px; }
  .pp-subtitle { font-size: 0.62rem; color: #555; margin-top: 2px; }

  /* IPC row */
  .pp-ipc-bar {
    display: flex; align-items: center;
    background: #111; border-bottom: 1px solid #2c2c2c;
    padding: 8px 14px; flex-shrink: 0;
  }
  .pp-ipc-item       { display: flex; flex-direction: column; flex: 1; }
  .pp-ipc-item.right { align-items: flex-end; }
  .pp-ipc-label { font-size: 0.56rem; color: #555; letter-spacing: 1px; }
  .pp-ipc-val   { font-size: 1.3rem; font-weight: 900; color: #c8a040; line-height: 1; }
  .pp-ipc-val.low { color: #e04030; }
  .pp-ipc-sep   { width: 1px; background: #2c2c2c; height: 30px; margin: 0 10px; }

  /* Tabs */
  .pp-tabs {
    display: flex; background: #111;
    border-bottom: 2px solid #2c2c2c; flex-shrink: 0;
  }
  .pp-tab {
    flex: 1; padding: 8px 0; border: none;
    background: transparent; color: #555;
    font-family: inherit; font-size: 0.68rem; font-weight: 900;
    letter-spacing: 1px; cursor: pointer;
    border-bottom: 2px solid transparent; margin-bottom: -2px;
  }
  .pp-tab.active       { color: #e8c060; border-bottom-color: #e8c060; }
  .pp-tab:hover:not(.active) { color: #999; }

  /* Column headers */
  .pp-col-hdr {
    display: flex; align-items: center;
    padding: 5px 14px; background: #0e0e0e;
    border-bottom: 1px solid #222; flex-shrink: 0;
  }
  .pp-col-unit { flex: 1; font-size: 0.56rem; color: #444; letter-spacing: 1px; }
  .pp-col-stat { width: 28px; text-align: center; font-size: 0.56rem; color: #444; }
  .pp-col-stat.cost { color: #888; }
  .pp-col-buy  { width: 82px; text-align: center; font-size: 0.56rem; color: #444; }

  /* Unit list */
  .pp-list { flex: 1; overflow-y: auto; -webkit-overflow-scrolling: touch; }
  .pp-row {
    display: flex; align-items: center;
    padding: 7px 14px; border-bottom: 1px solid #1c1c1c;
  }
  .pp-row:hover { background: #1e1e1e; }
  .pp-row.dim   { opacity: 0.38; }

  .pp-unit-art {
    flex: 1; display: flex; align-items: center; gap: 8px; min-width: 0;
  }
  .pp-art-circle {
    width: 36px; height: 36px; border-radius: 50%;
    background: #1a1a28; border: 2px solid #3a3a52;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.58rem; font-weight: 900; color: #8a9ab0;
    flex-shrink: 0; letter-spacing: 0;
  }
  .pp-unit-name {
    font-size: 0.68rem; font-weight: bold; color: #b0a888;
    letter-spacing: 0.5px; white-space: nowrap; overflow: hidden;
    text-overflow: ellipsis;
  }

  .pp-stat      { width: 28px; text-align: center; font-size: 0.82rem; color: #c8c8b0; font-weight: bold; }
  .pp-stat.cost { color: #c8a040; font-size: 0.88rem; }

  /* Buy controls */
  .pp-buy {
    width: 82px; display: flex; align-items: center;
    justify-content: center; gap: 4px;
  }
  .pp-minus, .pp-plus {
    width: 24px; height: 24px; border-radius: 50%;
    border: 1px solid #3a3a22; background: #2a2a14;
    color: #c8a040; font-size: 1rem; font-weight: bold;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    line-height: 1; -webkit-tap-highlight-color: transparent;
    flex-shrink: 0;
  }
  .pp-minus:disabled, .pp-plus:disabled { opacity: 0.2; cursor: not-allowed; }
  .pp-minus:not(:disabled):hover,
  .pp-plus:not(:disabled):hover  { background: #c8a040; color: #0a0a05; }
  .pp-qty     { width: 20px; text-align: center; font-size: 0.88rem; color: #808060; font-weight: bold; }
  .pp-qty.has { color: #ffd840; }

  /* Footer */
  .pp-footer {
    background: #111; border-top: 2px solid #2c2c2c;
    padding: 10px 14px 14px; flex-shrink: 0;
    display: flex; align-items: center; gap: 10px;
  }
  .pp-spent-lbl { font-size: 0.68rem; color: #555; flex: 1; }
  .pp-spent-lbl b { color: #c8a040; }
  .pp-end {
    background: #b83010; color: #fff;
    border: none; border-radius: 5px;
    padding: 10px 18px; font-size: 0.82rem; font-weight: 900;
    letter-spacing: 1.5px; cursor: pointer; font-family: inherit;
    min-height: 44px; -webkit-tap-highlight-color: transparent;
  }
  .pp-end:hover  { background: #d84020; }
  .pp-end:active { background: #902808; }
`;class dt{constructor(t,e){this.container=t,this.app=e,this.state=e.state,this._el=null,this._tid=null,this._log=[],this._round=0,this._done=!1}show(t){this._tid=t,this._log=[],this._round=0,this._done=!1,this._el||(this._el=document.createElement("div"),this._el.className="combat-modal-wrap",this._el.innerHTML=`<style>${pt}</style><div class="combat-modal" id="combat-modal"></div>`,this.container.appendChild(this._el)),this._render()}hide(){var t;(t=this._el)==null||t.remove(),this._el=null}_render(){var p,u,l,f,x;const t=(p=this._el)==null?void 0:p.querySelector("#combat-modal");if(!t)return;const e=this._tid,a=v[e],s=this.state.currentNation,n=this.state.getUnits(e,s),r=this.state.getUnits(e).filter(b=>b.nation!==s),c=(u=r[0])==null?void 0:u.nation,d=w[c]||{flag:"🏳️",name:"Neutral",color:"#888"},o=w[s]||{};if(n.length===0||r.length===0){n.length>0&&r.length===0&&this.state.captureTerritory(e,s),this.hide(),this.app.turnEngine.advancePhase();return}const h=E();t.innerHTML=`
      <div class="cm-header">
        <div class="cm-territory">${(a==null?void 0:a.name)||e}</div>
        <div class="cm-round">Round ${this._round+1}</div>
      </div>

      <div class="cm-battlefield">
        <div class="cm-side attacker">
          <div class="cm-side-label" style="color:${o.color}">
            ${o.flag||""} ${o.name||s} (You)
          </div>
          <div class="cm-unit-list">
            ${this._renderUnitList(n,h)}
          </div>
        </div>

        <div class="cm-vs">⚔</div>

        <div class="cm-side defender">
          <div class="cm-side-label" style="color:${d.color}">
            ${d.flag} ${d.name} (AI)
          </div>
          <div class="cm-unit-list">
            ${this._renderUnitList(r,h)}
          </div>
        </div>
      </div>

      ${this._log.length>0?`
        <div class="cm-log">
          ${this._log.slice(-4).map(b=>`<div class="cm-log-line">${b}</div>`).join("")}
        </div>
      `:""}

      ${this._done?`
        <div class="cm-done-msg">${this._doneMsg}</div>
        <button class="cm-btn cm-btn-ok" id="cm-ok">Continue →</button>
      `:`
        <div class="cm-actions">
          <button class="cm-btn cm-btn-roll" id="cm-roll">🎲 Roll Dice</button>
          <button class="cm-btn cm-btn-retreat" id="cm-retreat">↩ Retreat</button>
        </div>
      `}
    `,(l=t.querySelector("#cm-roll"))==null||l.addEventListener("click",()=>this._doRound()),(f=t.querySelector("#cm-retreat"))==null||f.addEventListener("click",()=>this._doRetreat()),(x=t.querySelector("#cm-ok"))==null||x.addEventListener("click",()=>{var b;this.hide(),this.app.turnEngine.pendingCombats&&(this.app.turnEngine.pendingCombats=this.app.turnEngine.pendingCombats.filter(k=>k!==this._tid)),((b=this.app.turnEngine.pendingCombats)==null?void 0:b.length)===0&&this.app.turnEngine.advancePhase()})}_renderUnitList(t,e){const a=t.reduce((s,n)=>(s[n.type]=(s[n.type]||0)+1,s),{});return Object.entries(a).map(([s,n])=>{const r=e[s];return`<span class="cm-unit-chip">${(r==null?void 0:r.icon)||"?"} ×${n}</span>`}).join("")}_doRound(){var s,n;const t=this.state.currentNation,e=this.state.getUnits(this._tid,t),a=this.state.getUnits(this._tid).filter(r=>r.nation!==t);if(e.length===0||a.length===0){this._finishCombat(e.length>0?"attacker":"defender");return}try{const r=A.resolveCombatRound(e,a,this._round===0);this._round++,((n=(s=r.aaResults)==null?void 0:s.targets)==null?void 0:n.length)>0&&(r.aaResults.targets.forEach(l=>{this.state.units[this._tid]=this.state.units[this._tid].filter(f=>f.id!==l)}),this._log.push(`⚡ AA fire: ${r.aaResults.hits} aircraft shot down!`));const c=A.selectCasualties(this.state.getUnits(this._tid).filter(l=>l.nation!==t),r.attackerHits,!1);c.filter(l=>l.killed).forEach(l=>{this.state.units[this._tid]=this.state.units[this._tid].filter(f=>f.id!==l.unit.id)});const d=A.selectCasualties(this.state.getUnits(this._tid,t),r.defenderHits,!0);d.filter(l=>l.killed).forEach(l=>{this.state.units[this._tid]=this.state.units[this._tid].filter(f=>f.id!==l.unit.id)});const o=d.filter(l=>l.killed).length,h=c.filter(l=>l.killed).length;this._log.push(`Round ${this._round}: You hit ${r.attackerHits} 🎯 | They hit ${r.defenderHits} 💥 (${o} lost, ${h} enemy lost)`),this.state.autosave();const p=this.state.getUnits(this._tid,t),u=this.state.getUnits(this._tid).filter(l=>l.nation!==t);p.length===0?this._finishCombat("defender"):u.length===0?this._finishCombat("attacker"):this._render()}catch(r){console.error("[CombatModal] round error:",r),this._log.push("⚠ Error in combat round. Try again."),this._render()}}_doRetreat(){var n;const t=this.state.currentNation,e=this.state.getUnits(this._tid,t),a=v[this._tid],s=a==null?void 0:a.adjacent.find(r=>{var d,o;const c=this.state.ownership[r];return c===t||((d=w[c])==null?void 0:d.side)===((o=w[t])==null?void 0:o.side)});s&&e.length>0&&(this.state.moveUnits(e.map(r=>r.id),this._tid,s),this._log.push(`Retreated to ${((n=v[s])==null?void 0:n.name)||s}`)),this._doneMsg="↩ Retreat successful.",this._done=!0,this._render()}_finishCombat(t){var a,s;const e=this.state.currentNation;t==="attacker"?(this.state.captureTerritory(this._tid,e),this._doneMsg=`✅ ${(a=v[this._tid])==null?void 0:a.name} captured!`):this._doneMsg=`❌ Attack repelled — ${(s=v[this._tid])==null?void 0:s.name} holds.`,this._done=!0,this._render()}}const pt=`
  .combat-modal-wrap {
    position: fixed; inset: 0;
    background: rgba(5,10,20,0.9);
    z-index: 400;
    display: flex; align-items: center; justify-content: center;
  }
  .combat-modal {
    background: #111e30; border: 1px solid #1e3a5a;
    border-radius: 12px; padding: 20px 24px;
    max-width: 480px; width: 94%;
    font-family: Georgia, serif; color: #d4c9a8;
    max-height: 90vh; overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
  .cm-header {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 16px;
  }
  .cm-territory { font-size: 1.2rem; color: #c8a040; font-weight: bold; }
  .cm-round { font-size: 0.85rem; color: #6a7a8a; }

  .cm-battlefield {
    display: flex; align-items: flex-start; gap: 12px;
    margin-bottom: 16px; background: #0d1925;
    border-radius: 8px; padding: 14px;
  }
  .cm-side { flex: 1; }
  .cm-side-label { font-size: 0.8rem; font-weight: bold; margin-bottom: 8px; }
  .cm-unit-list { display: flex; flex-wrap: wrap; gap: 5px; }
  .cm-unit-chip {
    background: #1a2a3a; border: 1px solid #2a4a6a;
    border-radius: 5px; padding: 4px 8px; font-size: 0.85rem;
  }
  .cm-vs { font-size: 1.5rem; padding-top: 20px; color: #c8a040; }

  .cm-log {
    background: #0a1422; border: 1px solid #1a2a3a;
    border-radius: 6px; padding: 10px;
    margin-bottom: 14px; max-height: 100px; overflow-y: auto;
  }
  .cm-log-line { font-size: 0.78rem; color: #8aaa8a; margin-bottom: 3px; }

  .cm-actions { display: flex; gap: 10px; }
  .cm-btn {
    flex: 1; padding: 14px; border: none; border-radius: 8px;
    font-family: Georgia, serif; font-size: 1rem; font-weight: bold;
    cursor: pointer; min-height: 52px;
    -webkit-tap-highlight-color: transparent;
  }
  .cm-btn:active { transform: scale(0.97); }
  .cm-btn-roll    { background: #c8a040; color: #0a1628; }
  .cm-btn-retreat { background: #1e3a5a; color: #d4c9a8; }
  .cm-btn-ok      { width: 100%; background: #3aaa44; color: #fff; }

  .cm-done-msg {
    text-align: center; font-size: 1rem; color: #c8a040;
    margin-bottom: 14px; padding: 12px;
    background: #0d1925; border-radius: 8px;
  }
`;class ut{constructor(t){this.container=t,this._el=null}show(){this._el&&this._el.remove(),this._el=document.createElement("div"),this._el.className="rules-overlay",this._el.innerHTML=`
      <style>${ht}</style>
      <div class="rules-panel">
        <div class="rules-header">
          <span>📖 AXIS &amp; ALLIES 1942 — RULES REFERENCE</span>
          <button class="rules-close" id="rules-close">✕</button>
        </div>
        <div class="rules-body">

          <!-- OVERVIEW -->
          <section>
            <h2>OVERVIEW</h2>
            <p>Axis &amp; Allies 1942 Second Edition is a strategic WWII board game for 2–5 players.
            The <strong>Axis</strong> (Germany, Japan) battles the <strong>Allies</strong> (Soviet Union, United Kingdom, United States).
            The game is played in rounds; each nation takes a full turn per round.</p>
            <p><strong>Axis wins</strong> by controlling 9 of the 10 victory cities at the end of any Axis turn.
            <strong>Allies win</strong> by capturing both Berlin and Tokyo simultaneously.</p>
          </section>

          <!-- VICTORY CITIES -->
          <section>
            <h2>VICTORY CITIES (10 total)</h2>
            <div class="vc-grid">
              <div class="vc-axis">
                <div class="vc-label">AXIS START</div>
                <div>Berlin (Germany)</div>
                <div>Western Europe (Germany)</div>
                <div>Southern Europe (Germany)</div>
                <div>Tokyo (Japan)</div>
                <div>Manchuria (Japan)</div>
              </div>
              <div class="vc-allies">
                <div class="vc-label">ALLIES START</div>
                <div>Moscow (USSR)</div>
                <div>London (UK)</div>
                <div>Eastern USA (USA)</div>
                <div>India (UK)</div>
                <div>Australia (UK)</div>
              </div>
            </div>
            <p class="rule-note">Axis needs 9 of 10 victory cities at the END of any Axis nation's turn to win.</p>
          </section>

          <!-- TURN ORDER -->
          <section>
            <h2>TURN ORDER</h2>
            <ol>
              <li><span class="nat-ussr">Soviet Union</span></li>
              <li><span class="nat-germany">Germany</span></li>
              <li><span class="nat-uk">United Kingdom</span></li>
              <li><span class="nat-japan">Japan</span></li>
              <li><span class="nat-usa">United States</span></li>
            </ol>
            <p class="rule-note">Each nation completes all 6 phases before the next nation takes their turn.</p>
          </section>

          <!-- 6 PHASES -->
          <section>
            <h2>THE 6 PHASES OF EACH TURN</h2>

            <div class="phase-block">
              <div class="phase-num">1</div>
              <div class="phase-content">
                <h3>PURCHASE UNITS</h3>
                <p>Spend your IPC (Industrial Production Certificates) to buy units. Purchased units are set aside and placed on the board later in Phase 5. You may not spend more IPC than you have.</p>
                <p>You may also spend 5 IPC per die to roll for <strong>National Technology</strong> (roll a 6 to gain a tech breakthrough).</p>
              </div>
            </div>

            <div class="phase-block">
              <div class="phase-num">2</div>
              <div class="phase-content">
                <h3>COMBAT MOVEMENT</h3>
                <p>Move units that will participate in combat. Units moving into enemy-controlled territories or sea zones containing enemy ships are attacking. <strong>You must resolve any attack you start.</strong></p>
                <ul>
                  <li>Land units <strong>stop</strong> when they enter an enemy territory</li>
                  <li>Fighters and bombers fly over friendly territories en route to attacks</li>
                  <li>Submarines may submerge to avoid combat (if no enemy destroyer present)</li>
                  <li>AA Guns may <strong>not</strong> be moved in Combat Movement</li>
                  <li>Transports may carry up to 2 land units (1 infantry + 1 other, or 2 infantry)</li>
                </ul>
              </div>
            </div>

            <div class="phase-block">
              <div class="phase-num">3</div>
              <div class="phase-content">
                <h3>CONDUCT COMBAT</h3>
                <p>Resolve all battles you initiated. The attacker may <strong>withdraw</strong> after any round of combat.</p>
                <p><strong>Combat rounds:</strong></p>
                <ol>
                  <li>Defender's AA guns fire at attacking aircraft (hits on a 1; each gun fires once)</li>
                  <li>All attacking units fire simultaneously — assign hits to defending units</li>
                  <li>All defending units fire simultaneously — assign hits to attacking units</li>
                  <li>Remove casualties. Attacker decides to continue or withdraw.</li>
                </ol>
                <p>If the attacker eliminates all defenders, they capture the territory and move attacking land units in. The attacker collects any IPC tokens present.</p>
              </div>
            </div>

            <div class="phase-block">
              <div class="phase-num">4</div>
              <div class="phase-content">
                <h3>NON-COMBAT MOVEMENT</h3>
                <p>Move any units that did <strong>not</strong> participate in combat. Units may only enter friendly territories or sea zones. This is when you reposition defensive forces, move AA guns, and ferry units via transports.</p>
                <p>Fighters that attacked must have enough movement remaining to land on a friendly territory or carrier.</p>
              </div>
            </div>

            <div class="phase-block">
              <div class="phase-num">5</div>
              <div class="phase-content">
                <h3>MOBILIZE NEW UNITS (Place)</h3>
                <p>Place all units purchased in Phase 1 on territories you control that contain an <strong>Industrial Complex (🏭)</strong>. You may place up to <strong>3 units per IC per turn</strong> (or more with Industrial Technology).</p>
                <p>Naval units are placed in a friendly sea zone adjacent to the IC territory.</p>
              </div>
            </div>

            <div class="phase-block">
              <div class="phase-num">6</div>
              <div class="phase-content">
                <h3>COLLECT INCOME</h3>
                <p>Count the IPC value of all territories you currently control (shown in gold on the map). Add that amount to your treasury. You may never have more than 999 IPC.</p>
              </div>
            </div>
          </section>

          <!-- UNIT STATS -->
          <section>
            <h2>UNIT REFERENCE</h2>
            <p class="rule-note">ATK = attack value, DEF = defense value, MOV = movement spaces, COST = IPC cost. Roll ≤ the value on a d6 to hit.</p>
            <table class="unit-table">
              <thead><tr><th>Unit</th><th>Code</th><th>ATK</th><th>DEF</th><th>MOV</th><th>COST</th><th>Notes</th></tr></thead>
              <tbody>
                <tr class="land"><td>Infantry</td><td>INF</td><td>1</td><td>2</td><td>1</td><td>3</td><td>Boosted to ATK 2 when paired with Artillery</td></tr>
                <tr class="land"><td>Artillery</td><td>ART</td><td>2</td><td>2</td><td>1</td><td>4</td><td>Boosts 1 paired Infantry to ATK 2</td></tr>
                <tr class="land"><td>Armor (Tank)</td><td>ARM</td><td>3</td><td>3</td><td>2</td><td>6</td><td>Can blitz through undefended territory (2 moves)</td></tr>
                <tr class="land"><td>Anti-Aircraft</td><td>AA</td><td>—</td><td>1</td><td>1</td><td>5</td><td>Fires at air units before combat (hits on 1); 1 AA shot per attacking plane; max 3 shots; cannot move in combat phase</td></tr>
                <tr class="air"><td>Fighter</td><td>FTR</td><td>3</td><td>4</td><td>4</td><td>10</td><td>Must land on carrier or friendly territory; can escort/intercept</td></tr>
                <tr class="air"><td>Bomber</td><td>BMB</td><td>4</td><td>1</td><td>6</td><td>12</td><td>Can conduct strategic bombing runs on ICs (roll 1d6, deal that much damage)</td></tr>
                <tr class="naval"><td>Submarine</td><td>SUB</td><td>2</td><td>1</td><td>2</td><td>6</td><td>First strike; can submerge to avoid combat; ignored by surface ships (unless destroyer present)</td></tr>
                <tr class="naval"><td>Destroyer</td><td>DD</td><td>2</td><td>2</td><td>2</td><td>8</td><td>Negates submarine special abilities</td></tr>
                <tr class="naval"><td>Cruiser</td><td>CA</td><td>3</td><td>3</td><td>2</td><td>12</td><td>Can bombard land territories during amphibious assault (ATK 3)</td></tr>
                <tr class="naval"><td>Aircraft Carrier</td><td>CV</td><td>1</td><td>2</td><td>2</td><td>14</td><td>Carries up to 2 fighters; damaged carrier still carries fighters</td></tr>
                <tr class="naval"><td>Battleship</td><td>BB</td><td>4</td><td>4</td><td>2</td><td>20</td><td>Two hits to sink; can bombard land (ATK 4); takes 1 hit before full sinking</td></tr>
                <tr class="naval"><td>Transport</td><td>TRN</td><td>0</td><td>1</td><td>2</td><td>7</td><td>Carries up to 2 land units (1 large + 1 small, or 2 small); cannot attack</td></tr>
              </tbody>
            </table>
          </section>

          <!-- COMBAT RULES -->
          <section>
            <h2>COMBAT RULES</h2>
            <h3>Amphibious Assaults</h3>
            <p>Transport land units to a sea zone adjacent to an enemy territory. Warships in the same sea zone may provide <strong>shore bombardment</strong> (each fires once at its ATK value before the first round of combat). You must clear the sea zone of enemy ships first (sea battle), or the assault is blocked.</p>

            <h3>Strategic Bombing</h3>
            <p>Send bombers to attack an enemy Industrial Complex. The defender may scramble fighters from within 1 territory range to intercept. If uncontested, each bomber rolls 1d6 and deals that much damage (max = current IC production capacity). IC damage reduces production by 1 unit per damage point until repaired (costs 1 IPC per damage point during Phase 5).</p>

            <h3>Submarine Rules</h3>
            <ul>
              <li><strong>First Strike</strong>: Subs fire before all other units; casualties are removed before the enemy fires back</li>
              <li><strong>Submerge</strong>: At any point before or during combat, subs may submerge (retreat underwater) — UNLESS an enemy destroyer is present</li>
              <li><strong>Ignored</strong>: Opposing naval units may pass through a sea zone with only submarines (no destroyer present) without fighting</li>
            </ul>

            <h3>Retreating</h3>
            <p>The attacker may choose to retreat after any round of combat. Retreat to an adjacent territory that the attacking units moved from. All surviving attacking units must retreat to the same territory.</p>
          </section>

          <!-- INDUSTRIAL COMPLEXES -->
          <section>
            <h2>INDUSTRIAL COMPLEXES 🏭</h2>
            <p>Starting IC locations: <strong>Germany, Russia, United Kingdom, Eastern US, Japan</strong>.</p>
            <p>Each IC allows you to build up to <strong>3 units per turn</strong>. If an enemy captures a territory with your IC, they now control that IC and may use it on their turn.</p>
            <p>New ICs may be built for 15 IPC during Phase 5 on any territory you control with an IPC value of 2 or more.</p>
          </section>

          <!-- NATIONAL STARTING IPC -->
          <section>
            <h2>STARTING IPC / INCOME</h2>
            <table class="ipc-table">
              <thead><tr><th>Nation</th><th>Starting IPC</th><th>Starting Income</th></tr></thead>
              <tbody>
                <tr><td class="nat-ussr">Soviet Union</td><td>12</td><td>24</td></tr>
                <tr><td class="nat-germany">Germany</td><td>40</td><td>40</td></tr>
                <tr><td class="nat-uk">United Kingdom</td><td>20</td><td>28</td></tr>
                <tr><td class="nat-japan">Japan</td><td>26</td><td>26</td></tr>
                <tr><td class="nat-usa">United States</td><td>42</td><td>38</td></tr>
              </tbody>
            </table>
          </section>

          <!-- NATIONAL TECHNOLOGY -->
          <section>
            <h2>NATIONAL TECHNOLOGY</h2>
            <p>During Phase 1, spend 5 IPC per die. Roll each die — a <strong>6</strong> earns a breakthrough. Randomly determine which technology is gained from the table below.</p>
            <table class="tech-table">
              <thead><tr><th>Technology</th><th>Effect</th></tr></thead>
              <tbody>
                <tr><td>Advanced Artillery</td><td>Each Artillery boosts TWO infantry instead of one</td></tr>
                <tr><td>Rockets</td><td>AA Guns may fire once per turn at enemy ICs within 3 territories (1d6 damage, max 6)</td></tr>
                <tr><td>Jet Fighters</td><td>Fighters defend at 5 instead of 4</td></tr>
                <tr><td>Long-Range Aircraft</td><td>Fighters +2 movement, Bombers +2 movement</td></tr>
                <tr><td>Heavy Bombers</td><td>Bombers roll 2d6 on bombing runs (keep higher); attack with 2 dice (keep higher)</td></tr>
                <tr><td>Super Submarines</td><td>Submarines attack at 3 instead of 2</td></tr>
                <tr><td>Improved Shipyards</td><td>All naval units cost 1 less IPC</td></tr>
                <tr><td>Radar</td><td>AA Guns hit aircraft on a 1 or 2</td></tr>
                <tr><td>Industrial Technology</td><td>Industrial Complexes produce 2 extra units per turn (total 5)</td></tr>
                <tr><td>Mechanized Infantry</td><td>Infantry can move 2 spaces if paired with a tank; can blitz with tank</td></tr>
                <tr><td>Paratroopers</td><td>Each bomber may transport 1 infantry up to 3 territories (land in adjacent territory to target)</td></tr>
                <tr><td>War Bonds</td><td>Collect 1d6 extra IPC at end of Income phase</td></tr>
              </tbody>
            </table>
          </section>

          <!-- NEUTRALS -->
          <section>
            <h2>NEUTRAL TERRITORIES</h2>
            <p>Strictly Neutral territories (Spain, Sweden, Turkey, Yugoslavia, Austria) may be attacked — but doing so activates ALL other strict neutrals to defend against the attacking nation (they place 2 infantry per neutral territory that faces you). You gain their IPC value if captured.</p>
          </section>

        </div>
      </div>
    `,document.body.appendChild(this._el),document.getElementById("rules-close").addEventListener("click",()=>this.hide()),this._el.addEventListener("click",t=>{t.target===this._el&&this.hide()})}hide(){var t;(t=this._el)==null||t.remove(),this._el=null}}const ht=`
  .rules-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.82);
    z-index: 800;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Arial Narrow', Arial, sans-serif;
  }
  .rules-panel {
    width: min(860px, 96vw); height: 88vh;
    background: #0e1208;
    border: 1px solid #2a3018;
    border-radius: 10px;
    display: flex; flex-direction: column;
    overflow: hidden;
    box-shadow: 0 8px 64px rgba(0,0,0,0.95);
  }
  .rules-header {
    background: #141a08; border-bottom: 1px solid #2a3018;
    padding: 12px 18px;
    display: flex; align-items: center; justify-content: space-between;
    font-size: 0.85rem; font-weight: 900; color: #c8a040;
    letter-spacing: 2px; flex-shrink: 0;
  }
  .rules-close {
    background: #2a1808; border: 1px solid #5a2010; color: #e86040;
    width: 28px; height: 28px; border-radius: 4px;
    font-size: 0.8rem; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
  }
  .rules-body {
    overflow-y: auto; padding: 20px 24px;
    color: #c0b880;
    font-size: 0.85rem; line-height: 1.6;
  }
  .rules-body section {
    margin-bottom: 28px; border-bottom: 1px solid #1e2410; padding-bottom: 20px;
  }
  .rules-body section:last-child { border-bottom: none; }
  .rules-body h2 {
    font-size: 0.9rem; color: #e8c040; letter-spacing: 2px;
    font-weight: 900; margin: 0 0 10px;
    border-left: 3px solid #c8a030; padding-left: 10px;
  }
  .rules-body h3 { font-size: 0.82rem; color: #a89860; margin: 12px 0 6px; }
  .rules-body p  { margin: 0 0 8px; }
  .rules-body ul, .rules-body ol { margin: 6px 0 10px 20px; }
  .rules-body li { margin: 3px 0; }
  .rule-note { color: #888068; font-size: 0.8rem; font-style: italic; }

  /* Victory city grid */
  .vc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 10px 0; }
  .vc-axis  { background: #1a0c0c; border: 1px solid #3a1818; border-radius: 5px; padding: 10px; }
  .vc-allies{ background: #0c1018; border: 1px solid #182830; border-radius: 5px; padding: 10px; }
  .vc-label { font-weight: 900; letter-spacing: 1px; margin-bottom: 6px; font-size: 0.75rem; color: #a0a070; }
  .vc-axis  div:not(.vc-label) { color: #e07070; font-size: 0.82rem; margin: 2px 0; }
  .vc-allies div:not(.vc-label){ color: #70a8e0; font-size: 0.82rem; margin: 2px 0; }

  /* Phase blocks */
  .phase-block {
    display: flex; gap: 14px; margin: 10px 0;
    background: #0a0e06; border: 1px solid #1e2410;
    border-radius: 6px; padding: 12px;
  }
  .phase-num {
    width: 32px; height: 32px; border-radius: 50%;
    background: #c8a030; color: #080a04;
    font-size: 1.1rem; font-weight: 900;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .phase-content { flex: 1; }
  .phase-content h3 { margin: 0 0 6px; font-size: 0.85rem; color: #d0b860; }

  /* Unit table */
  .unit-table {
    width: 100%; border-collapse: collapse; font-size: 0.78rem;
    margin: 8px 0;
  }
  .unit-table th {
    background: #141a08; color: #a8a070; font-weight: 900;
    padding: 7px 8px; text-align: left; border-bottom: 1px solid #2a3010;
    letter-spacing: 0.5px;
  }
  .unit-table td { padding: 6px 8px; border-bottom: 1px solid #1a1e0c; }
  .unit-table tr:last-child td { border-bottom: none; }
  .unit-table tr.land  td:first-child { color: #c8a060; }
  .unit-table tr.air   td:first-child { color: #8080e8; }
  .unit-table tr.naval td:first-child { color: #4898d0; }
  .unit-table td:nth-child(3),.unit-table td:nth-child(4) { color: #e87870; text-align: center; font-weight: bold; }
  .unit-table td:nth-child(5) { color: #70d070; text-align: center; font-weight: bold; }
  .unit-table td:nth-child(6) { color: #f0c040; text-align: center; font-weight: bold; }

  /* IPC/tech tables */
  .ipc-table, .tech-table {
    width: 100%; border-collapse: collapse; font-size: 0.78rem; margin: 8px 0;
  }
  .ipc-table th, .tech-table th {
    background: #141a08; color: #a8a070; font-weight: 900;
    padding: 7px 8px; text-align: left; border-bottom: 1px solid #2a3010;
  }
  .ipc-table td, .tech-table td { padding: 6px 8px; border-bottom: 1px solid #1a1e0c; }
  .ipc-table tr:last-child td, .tech-table tr:last-child td { border-bottom: none; }
  .tech-table td:first-child { color: #88c870; font-weight: bold; }

  /* Nation colors */
  .nat-ussr    { color: #e03030; }
  .nat-germany { color: #70b8c8; }
  .nat-uk      { color: #e8a030; }
  .nat-japan   { color: #e8c830; }
  .nat-usa     { color: #50c040; }

  /* Scrollbar */
  .rules-body::-webkit-scrollbar { width: 6px; }
  .rules-body::-webkit-scrollbar-track { background: #0a0c06; }
  .rules-body::-webkit-scrollbar-thumb { background: #3a4020; border-radius: 3px; }
`;class mt{constructor(t){this.container=t,this.state=new I,this.ai=new X(this.state),this.turnEngine=new q(this.state,this.ai),this.map=null,this.hud=null,this.purchasePanel=null,this.combatModal=null,this.selectedTerritory=null,this.movingUnits=[],this.validTargets=[]}init(){this._buildShell(),I.hasSave()?this._showResumeScreen():this._showSetupScreen()}_buildShell(){this.container.innerHTML=`
      <style>${ft}</style>
      <div id="game-wrap" style="display:none;width:100%;height:100%;flex-direction:column;">
        <div id="hud-root"></div>
        <div id="map-root" style="flex:1;overflow:hidden;position:relative;"></div>
      </div>
      <div id="overlay-root"></div>
    `}_showResumeScreen(){const t=I.getSaveInfo(),a=new Date(t.timestamp).toLocaleString(),s=w[t.nation];this._showOverlay(`
      <div class="screen-card">
        <h1>⚔ AXIS &amp; ALLIES</h1>
        <p class="sub">1942 — Second Edition</p>
        <div class="resume-info">
          <p>Saved game found</p>
          <p><strong>${(s==null?void 0:s.flag)||""} ${(s==null?void 0:s.name)||t.nation}</strong> — Round ${t.round}</p>
          <p class="dim">${a}</p>
        </div>
        <div class="btn-group">
          <button class="btn btn-primary" id="btn-resume">Resume Game</button>
          <button class="btn btn-secondary" id="btn-new">New Game</button>
        </div>
      </div>
    `),document.getElementById("btn-resume").addEventListener("click",()=>{this._resumeGame()}),document.getElementById("btn-new").addEventListener("click",()=>{I.clearSave(),this._showSetupScreen()})}_showSetupScreen(){const t={ussr:{sym:"★",label:"SOVIET UNION",side:"allies",color:"#c02828"},germany:{sym:"✚",label:"GERMANY",side:"axis",color:"#6090a0"},uk:{sym:"⊕",label:"U.K.",side:"allies",color:"#c88018"},japan:{sym:"✿",label:"JAPAN",side:"axis",color:"#d0a020"},usa:{sym:"★",label:"U.S.A.",side:"allies",color:"#3a8030"}};this._showOverlay(`
      <div class="ns-screen">
        <h1 class="ns-title">AXIS &amp; ALLIES</h1>
        <p class="ns-sub">1942 — SECOND EDITION</p>

        <div class="ns-combatants">
          <div class="ns-side">
            <div class="ns-side-label axis-lbl">AXIS</div>
            ${["germany","japan"].map(s=>`
              <div class="ns-card ${s}" data-nation="${s}">
                <div class="ns-card-sym" style="color:${t[s].color}">${t[s].sym}</div>
                <div class="ns-card-name">${t[s].label}</div>
                <div class="ns-card-type">
                  <button class="ns-type-btn human" data-nation="${s}" data-type="human">HUMAN</button>
                  <button class="ns-type-btn ai active" data-nation="${s}" data-type="ai">AI</button>
                </div>
              </div>`).join("")}
          </div>

          <div class="ns-vs">VS</div>

          <div class="ns-side">
            <div class="ns-side-label allies-lbl">ALLIES</div>
            ${["ussr","uk","usa"].map(s=>`
              <div class="ns-card ${s}" data-nation="${s}">
                <div class="ns-card-sym" style="color:${t[s].color}">${t[s].sym}</div>
                <div class="ns-card-name">${t[s].label}</div>
                <div class="ns-card-type">
                  <button class="ns-type-btn human" data-nation="${s}" data-type="human">HUMAN</button>
                  <button class="ns-type-btn ai active" data-nation="${s}" data-type="ai">AI</button>
                </div>
              </div>`).join("")}
          </div>
        </div>

        <div class="ns-settings">
          <div class="ns-row">
            <span class="ns-row-label">⚙ AI DIFFICULTY</span>
            <div class="ns-diff">
              <button class="ns-diff-btn" data-diff="easy">EASY</button>
              <button class="ns-diff-btn active" data-diff="normal">NORMAL</button>
              <button class="ns-diff-btn" data-diff="hard">HARD</button>
            </div>
          </div>
          <div class="ns-row">
            <span class="ns-row-label">⚑ SCENARIO</span>
            <span class="ns-row-val">1942 SECOND EDITION</span>
          </div>
        </div>

        <button class="ns-start" id="btn-start">START CAMPAIGN →</button>
      </div>
    `);const e=new Set;let a="normal";document.querySelectorAll(".ns-type-btn").forEach(s=>{s.addEventListener("click",()=>{const n=s.dataset.nation,r=s.dataset.type;document.querySelectorAll(`.ns-type-btn[data-nation="${n}"]`).forEach(c=>{c.classList.toggle("active",c.dataset.type===r)}),r==="human"?e.add(n):e.delete(n)})}),document.querySelectorAll(".ns-diff-btn").forEach(s=>{s.addEventListener("click",()=>{document.querySelectorAll(".ns-diff-btn").forEach(n=>n.classList.remove("active")),s.classList.add("active"),a=s.dataset.diff})}),document.getElementById("btn-start").addEventListener("click",()=>{e.size===0&&(e.add("ussr"),e.add("uk"),e.add("usa")),this._startNewGame([...e],a)})}_startNewGame(t,e){T.forEach(a=>{this.state.players[a]=t.includes(a)?"human":"ai"}),this.ai.difficulty=e,this.state.loadScenario(J),this._launchGame()}_resumeGame(){if(!this.state.loadSave()){this._showSetupScreen();return}this._launchGame()}_launchGame(){var e;this._hideOverlay();const t=document.getElementById("game-wrap");t.style.display="flex",this.hud=new it(document.getElementById("hud-root"),this),this.map=new et(document.getElementById("map-root"),this),this.purchasePanel=new ct(document.getElementById("overlay-root"),this),this.combatModal=new dt(document.getElementById("overlay-root"),this),this.rulesPanel=new ut(document.body),this._buildPhaseBar(),this._wireEvents(),this.hud.render(),this.map.render(),(e=document.getElementById("btn-rules"))==null||e.addEventListener("click",()=>{var a;return(a=this.rulesPanel)==null?void 0:a.show()}),this.state.phase==="setup"?this.turnEngine.startGame():this.state._emit("phase_changed",{phase:this.state.phase,nation:this.state.currentNation,round:this.state.round})}_buildPhaseBar(){var e,a;(e=document.getElementById("float-controls"))==null||e.remove();const t=document.createElement("div");t.id="float-controls",t.innerHTML=`
      <style>${gt}</style>
      <!-- Round END PHASE button bottom-right -->
      <button class="float-end-btn" id="btn-end-phase">
        <span>END</span><span>PHASE</span>
      </button>
      <!-- Research button (shown only during purchase) -->
      <button class="float-research-btn" id="btn-research" style="display:none">🔬</button>
      <!-- Phase hint bottom-center -->
      <div class="float-hint" id="phase-hint"></div>
      <!-- AI thinking banner -->
    `,document.body.appendChild(t),document.getElementById("btn-end-phase").addEventListener("click",()=>this._handleEndPhase()),(a=document.getElementById("btn-research"))==null||a.addEventListener("click",()=>this._showTechPanel())}_handleEndPhase(){this.selectedTerritory=null,this.movingUnits=[],this.validTargets=[],this.map.clearSelection(),this.turnEngine.advancePhase()}_wireEvents(){const t=e=>{var a;try{this.selectedTerritory=null,this.movingUnits=[],this.validTargets=[],this.hud.render(),(a=document.getElementById("btn-rules"))==null||a.addEventListener("click",()=>{var c;return(c=this.rulesPanel)==null?void 0:c.show()}),this.map.render(),this._updatePhaseHint(e.phase);const s=this.state.players[this.state.currentNation]==="human";e.phase==="purchase"&&s?this.purchasePanel.show():this.purchasePanel.hide(),this._setAIIndicator(!s);const n=document.getElementById("btn-research");n&&(n.style.display="none");const r=document.getElementById("btn-end-phase");if(r){const c=e.phase==="purchase"&&s;r.style.display=c?"none":"flex",r.disabled=!s,r.style.opacity=s?"1":"0.4"}}catch(s){console.error("[App] phase_changed handler:",s)}};this.state.on("phase_changed",t),this.turnEngine.on("phase_changed",t),this.state.on("territory_captured",()=>{try{this.map.render(),this.hud.render()}catch{}}),this.state.on("units_moved",()=>{try{this.map.render()}catch{}}),this.state.on("unit_placed",()=>{try{this.map.render()}catch{}}),this.state.on("income_collected",()=>{try{this.hud.render()}catch{}}),this.state.on("tech_researched",e=>{try{this._toast(`🔬 ${e.nation} researched a new technology!`),this.hud.render()}catch{}}),this.state.on("game_over",e=>{try{this._showVictoryScreen(e.winner)}catch{}}),this.turnEngine.on("combat_needed",e=>{try{this.state.players[this.state.currentNation]==="human"&&this.combatModal.show(e.territoryId)}catch{}})}_setAIIndicator(t){let e=document.getElementById("ai-thinking");t?e||(e=document.createElement("div"),e.id="ai-thinking",e.style.cssText="position:fixed;top:52px;left:50%;transform:translateX(-50%);background:#1a2a3a;border:1px solid #2a5a8a;border-radius:0 0 8px 8px;padding:4px 16px;font-size:0.75rem;color:#6ad4ff;z-index:100;pointer-events:none;",e.textContent="🤖 AI is thinking…",document.body.appendChild(e)):e==null||e.remove()}_updatePhaseHint(t){const e={purchase:"Buy units — they will be placed at end of turn.",combat_move:"Tap your units, then tap a territory to attack or move.",conduct_combat:"Tap a battle to resolve it.",noncombat_move:"Move remaining units to friendly territories.",place:"Place newly purchased units on industrial territories.",collect:"Collecting income…"},a=document.getElementById("phase-hint");a&&(a.textContent=e[t]||"")}onTerritoryClick(t){try{const e=this.state.phase,a=this.state.currentNation;if(!(this.state.players[a]==="human")){this._showTerritoryDetail(t);return}e==="combat_move"||e==="noncombat_move"?this._handleMoveClick(t,e):e==="conduct_combat"?(this.turnEngine.pendingCombats||[]).includes(t)?this.combatModal.show(t):this._showTerritoryDetail(t):e==="place"?this._handlePlaceClick(t):this._showTerritoryDetail(t)}catch(e){console.error("[App] onTerritoryClick:",e)}}_showTerritoryDetail(t){M(async()=>{const{TerritoryDetail:e}=await import("./TerritoryDetail-CpUP_0v-.js");return{TerritoryDetail:e}},[]).then(({TerritoryDetail:e})=>{new e(document.getElementById("overlay-root"),this).show(t)}).catch(()=>{})}_handleMoveClick(t,e){const a=this.state.currentNation;if(this.movingUnits.length===0){const s=this.state.getUnits(t,a).filter(n=>!n.moved);if(s.length===0)return;this.selectedTerritory=t,this.movingUnits=s.map(n=>n.id),this.validTargets=this._getValidTargets(t,s,e),this.map.setSelection(t,this.validTargets)}else this.validTargets.includes(t)&&this.state.moveUnits(this.movingUnits,this.selectedTerritory,t),this.selectedTerritory=null,this.movingUnits=[],this.validTargets=[],this.map.clearSelection()}_getValidTargets(t,e,a){try{const s=this.state.currentNation,n=new Set(["infantry","artillery","armor","antiair"]),r=new Set(["fighter","bomber"]),c=new Set(["submarine","destroyer","cruiser","carrier","battleship","transport"]),d={infantry:1,artillery:1,armor:2,antiair:1,fighter:4,bomber:6,submarine:2,destroyer:2,cruiser:2,carrier:2,battleship:2,transport:2};let o=!1,h=!1,p=!1;if(e.forEach(b=>{n.has(b.type)&&(o=!0),r.has(b.type)&&(h=!0),c.has(b.type)&&(p=!0)}),a==="combat_move"&&e.every(b=>b.type==="antiair"))return[];let u=1;e.forEach(b=>{o&&r.has(b.type)||(u=Math.max(u,d[b.type]||1))});const l=new Set,f=[{id:t,movesLeft:u,enteredEnemy:!1}],x=new Map;for(;f.length>0;){const{id:b,movesLeft:k,enteredEnemy:S}=f.shift(),m=v[b];if(m)for(const g of m.adjacent||[]){const z=v[g];if(!z||o&&!h&&z.type==="sea"||p&&!h&&z.type!=="sea")continue;const _=this.state.ownership[g],C=_&&_!=="neutral"&&N(_,s),R=!C;if(a==="combat_move"){l.add(g);const j=x.get(g);k>1&&(j===void 0||j<k-1)&&(x.set(g,k-1),!S&&(!C||h)&&f.push({id:g,movesLeft:k-1,enteredEnemy:C}))}else if(a==="noncombat_move"){if(C)continue;l.add(g);const j=x.get(g);k>1&&(j===void 0||j<k-1)&&(x.set(g,k-1),f.push({id:g,movesLeft:k-1,enteredEnemy:!1}))}}}return l.delete(t),[...l]}catch(s){return console.error("[App] _getValidTargets error:",s),[]}}_handlePlaceClick(t){const e=this.state.currentNation,a=this.state.pendingPlacements[e];if(a.length===0)return;if(!(this.state.industrialComplexes[t]===e)){this._toast("Units must be placed at industrial complexes.");return}this.state.placeUnit(a[0],e,t)}_showTechPanel(){M(async()=>{const{TechPanel:t}=await import("./TechPanel-CXOoHD8a.js");return{TechPanel:t}},[]).then(({TechPanel:t})=>{new t(document.getElementById("overlay-root"),this).show()}).catch(t=>console.error("[App] TechPanel load failed:",t))}_showVictoryScreen(t){I.clearSave();const e=t==="allies"?"🤝 ALLIES VICTORY!":"🎯 AXIS VICTORY!";this._showOverlay(`
      <div class="screen-card victory">
        <h1>${e}</h1>
        <p>The ${t} have conquered enough capitals to win the war.</p>
        <button class="btn btn-primary" onclick="location.reload()">Play Again</button>
      </div>
    `)}_showOverlay(t){const e=document.getElementById("overlay-root");e.innerHTML=`<div class="screen-overlay">${t}</div>`}_hideOverlay(){const e=document.getElementById("overlay-root").querySelector(".screen-overlay");e&&e.remove()}_toast(t,e=2500){const a=document.createElement("div");a.className="toast",a.textContent=t,document.body.appendChild(a),requestAnimationFrame(()=>a.classList.add("show")),setTimeout(()=>{a.classList.remove("show"),setTimeout(()=>a.remove(),300)},e)}}const ft=`
  /* ── Overlay / base ── */
  .screen-overlay {
    position: fixed; inset: 0;
    background: rgba(5,8,14,0.95);
    display: flex; align-items: center; justify-content: center;
    z-index: 500;
    font-family: 'Arial Narrow', Arial, sans-serif;
  }

  /* ── Resume screen ── */
  .screen-card {
    background: #141810; border: 1px solid #2c3018;
    border-radius: 10px; padding: 32px 40px; text-align: center;
    max-width: 420px; width: 90%;
    box-shadow: 0 8px 48px rgba(0,0,0,0.9);
    font-family: 'Arial Narrow', Arial, sans-serif;
  }
  .screen-card h1  { font-size: 1.8rem; color: #c8a040; letter-spacing: 3px; font-weight: 900; }
  .screen-card .sub { color: #5a6840; margin: 4px 0 20px; font-size: 0.8rem; letter-spacing: 2px; }
  .resume-info { background: #0e1208; border-radius: 6px; padding: 14px; margin: 14px 0; border: 1px solid #2c3018; }
  .resume-info p   { color: #c0b880; margin: 4px 0; font-size: 0.9rem; }
  .resume-info .dim { color: #5a6040; font-size: 0.8rem; }
  .btn-group { display: flex; gap: 10px; margin-top: 14px; }

  .btn {
    padding: 12px 20px; border: none; border-radius: 5px;
    font-family: inherit; font-size: 0.88rem; font-weight: 900; letter-spacing: 1px;
    cursor: pointer; flex: 1; min-height: 46px;
    -webkit-tap-highlight-color: transparent;
  }
  .btn-primary   { background: #b83010; color: #fff; }
  .btn-secondary { background: #1e2814; color: #a0a880; border: 1px solid #2c3820; }
  .victory h1    { color: #c8a040; font-size: 2rem; margin-bottom: 12px; }

  /* ── NEW GAME setup screen ── */
  .ns-screen {
    width: min(720px, 95vw);
    background: #111408;
    border: 1px solid #2a2c18;
    border-radius: 10px;
    padding: 24px 28px 20px;
    box-shadow: 0 8px 64px rgba(0,0,0,0.95);
    font-family: 'Arial Narrow', Arial, sans-serif;
  }
  .ns-title {
    font-size: 2rem; color: #c8a040; letter-spacing: 4px; font-weight: 900;
    text-align: center; margin: 0 0 4px;
  }
  .ns-sub {
    text-align: center; font-size: 0.72rem; color: #5a6040;
    letter-spacing: 3px; margin: 0 0 20px;
  }

  /* Combatants grid */
  .ns-combatants {
    display: flex; align-items: flex-start; gap: 16px;
    margin-bottom: 18px;
  }
  .ns-side       { flex: 1; display: flex; flex-direction: column; gap: 8px; }
  .ns-side-label { font-size: 0.72rem; font-weight: 900; letter-spacing: 2px; text-align: center; margin-bottom: 4px; }
  .axis-lbl      { color: #d06060; }
  .allies-lbl    { color: #6090d0; }
  .ns-vs {
    font-size: 1.1rem; font-weight: 900; color: #5a5840;
    align-self: center; padding: 0 4px;
  }

  /* Nation card */
  .ns-card {
    background: #0e1008; border: 1px solid #282a18;
    border-radius: 6px; padding: 10px 12px;
    display: flex; align-items: center; gap: 10px;
  }
  .ns-card-sym  { font-size: 1.4rem; flex-shrink: 0; width: 28px; text-align: center; }
  .ns-card-name { flex: 1; font-size: 0.72rem; font-weight: 900; color: #c0b880; letter-spacing: 1px; }
  .ns-card-type { display: flex; gap: 3px; }
  .ns-type-btn {
    padding: 4px 8px; border: 1px solid #2c2c18;
    background: #0a0c06; color: #5a5a40;
    font-family: inherit; font-size: 0.6rem; font-weight: 900;
    letter-spacing: 0.5px; cursor: pointer; border-radius: 3px;
    -webkit-tap-highlight-color: transparent;
  }
  .ns-type-btn.active.human { background: #1a2a10; color: #60e840; border-color: #40a820; }
  .ns-type-btn.active.ai   { background: #2a1a10; color: #e87840; border-color: #a04810; }

  /* Settings */
  .ns-settings { border-top: 1px solid #2a2c18; padding-top: 14px; margin-bottom: 16px; }
  .ns-row { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
  .ns-row-label { font-size: 0.72rem; color: #7a7850; letter-spacing: 1px; flex: 1; }
  .ns-row-val   { font-size: 0.72rem; color: #c0b060; font-weight: bold; }
  .ns-diff { display: flex; gap: 4px; }
  .ns-diff-btn {
    padding: 5px 12px; border: 1px solid #2c2c18;
    background: #0e0e08; color: #5a5840;
    font-family: inherit; font-size: 0.65rem; font-weight: 900;
    letter-spacing: 1px; cursor: pointer; border-radius: 3px;
  }
  .ns-diff-btn.active { background: #1e2010; color: #e8c040; border-color: #a08020; }

  /* Start button */
  .ns-start {
    width: 100%; padding: 14px; border: none; border-radius: 6px;
    background: #b83010; color: #fff;
    font-family: inherit; font-size: 0.95rem; font-weight: 900; letter-spacing: 2px;
    cursor: pointer; min-height: 50px;
    -webkit-tap-highlight-color: transparent;
  }
  .ns-start:hover  { background: #d84020; }
  .ns-start:active { background: #902808; }

  /* Toast */
  .toast {
    position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%) translateY(16px);
    background: #1c1808; color: #c0b060; border: 1px solid #3a3420;
    border-radius: 6px; padding: 10px 20px; font-size: 0.85rem;
    opacity: 0; transition: all 0.25s; z-index: 900; white-space: nowrap;
    pointer-events: none; font-family: 'Arial Narrow', Arial, sans-serif;
  }
  .toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
`,gt=`
  /* Round END PHASE button — bottom right, like App Store */
  .float-end-btn {
    position: fixed; bottom: 22px; right: 22px;
    width: 64px; height: 64px; border-radius: 50%;
    background: #b82010; border: 3px solid #e03020;
    color: #fff;
    font-family: 'Arial Narrow', Arial, sans-serif;
    font-size: 0.54rem; font-weight: 900; letter-spacing: 1px;
    text-transform: uppercase;
    cursor: pointer;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 1px; z-index: 400;
    box-shadow: 0 4px 20px rgba(180,30,10,0.7);
    -webkit-tap-highlight-color: transparent;
  }
  .float-end-btn:disabled { opacity: 0.25; cursor: not-allowed; box-shadow: none; }
  .float-end-btn:not(:disabled):hover  { background: #d03020; }
  .float-end-btn:not(:disabled):active { transform: scale(0.93); }

  /* Research button */
  .float-research-btn {
    position: fixed; bottom: 96px; right: 22px;
    width: 48px; height: 48px; border-radius: 50%;
    background: #1a1a3a; border: 2px solid #4040a0;
    color: #aaaaee; font-size: 1.1rem;
    cursor: pointer; z-index: 400;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 2px 12px rgba(0,0,120,0.5);
    -webkit-tap-highlight-color: transparent;
  }

  /* Phase hint */
  .float-hint {
    position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%);
    color: #5a6040; font-size: 0.78rem; font-family: 'Arial Narrow', Arial, sans-serif;
    pointer-events: none; z-index: 399; white-space: nowrap;
    text-shadow: 0 1px 4px #000;
  }
`;"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/sw.js").catch(y=>{console.warn("[SW] Registration failed:",y)})});window.addEventListener("DOMContentLoaded",()=>{try{const y=new mt(document.getElementById("app"));y.init(),window.__aa=y}catch(y){console.error("[Boot] Fatal error:",y),document.getElementById("loading").innerHTML=`
      <h1 style="color:#cc3333">⚠ Error</h1>
      <p style="color:#d4c9a8;max-width:400px;text-align:center">${y.message}</p>
      <button onclick="location.reload()" style="margin-top:20px;padding:12px 24px;background:#c8a040;border:none;border-radius:6px;font-size:1rem;cursor:pointer">Reload</button>
    `}});export{w as N,v as T,E as g};
