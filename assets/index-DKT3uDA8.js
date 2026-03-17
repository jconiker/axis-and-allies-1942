(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const n of i.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&a(n)}).observe(document,{childList:!0,subtree:!0});function e(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function a(s){if(s.ep)return;s.ep=!0;const i=e(s);fetch(s.href,i)}})();const V="modulepreload",Z=function(m){return"/axis-and-allies-1942/"+m},$={},U=function(t,e,a){let s=Promise.resolve();if(e&&e.length>0){let n=function(o){return Promise.all(o.map(d=>Promise.resolve(d).then(p=>({status:"fulfilled",value:p}),p=>({status:"rejected",reason:p}))))};document.getElementsByTagName("link");const c=document.querySelector("meta[property=csp-nonce]"),l=(c==null?void 0:c.nonce)||(c==null?void 0:c.getAttribute("nonce"));s=n(e.map(o=>{if(o=Z(o),o in $)return;$[o]=!0;const d=o.endsWith(".css"),p=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${o}"]${p}`))return;const h=document.createElement("link");if(h.rel=d?"stylesheet":V,d||(h.as="script"),h.crossOrigin="",h.href=o,l&&h.setAttribute("nonce",l),document.head.appendChild(h),d)return new Promise((u,f)=>{h.addEventListener("load",u),h.addEventListener("error",()=>f(new Error(`Unable to preload CSS for ${o}`)))})}))}function i(n){const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=n,window.dispatchEvent(c),!c.defaultPrevented)throw n}return s.then(n=>{for(const c of n||[])c.status==="rejected"&&i(c.reason);return t().catch(i)})},y={alaska:{id:"alaska",name:"Alaska",ipc:2,startOwner:"usa",type:"land",region:"americas",x:95,y:115,adjacent:["western_us","western_canada","sz_1","sz_56"]},western_canada:{id:"western_canada",name:"Western Canada",ipc:1,startOwner:"uk",type:"land",region:"americas",x:170,y:145,adjacent:["alaska","central_canada","western_us","sz_1","sz_56","sz_57"]},central_canada:{id:"central_canada",name:"Central Canada",ipc:1,startOwner:"uk",type:"land",region:"americas",x:245,y:155,adjacent:["western_canada","eastern_canada","western_us","central_us","sz_7"]},eastern_canada:{id:"eastern_canada",name:"Eastern Canada",ipc:3,startOwner:"uk",type:"land",region:"americas",x:330,y:155,adjacent:["central_canada","eastern_us","sz_7","sz_8"]},western_us:{id:"western_us",name:"Western United States",ipc:10,startOwner:"usa",type:"land",region:"americas",x:145,y:240,adjacent:["alaska","western_canada","central_us","sz_56","sz_57"]},central_us:{id:"central_us",name:"Central United States",ipc:6,startOwner:"usa",type:"land",region:"americas",x:230,y:265,adjacent:["western_us","eastern_us","central_canada","central_america"]},eastern_us:{id:"eastern_us",name:"Eastern United States",ipc:12,startOwner:"usa",type:"land",region:"americas",x:310,y:255,adjacent:["central_us","eastern_canada","central_america","sz_7","sz_8","sz_10"]},central_america:{id:"central_america",name:"Central America",ipc:1,startOwner:"usa",type:"land",region:"americas",x:230,y:355,adjacent:["eastern_us","central_us","sz_8","sz_9","sz_56"]},brazil:{id:"brazil",name:"Brazil",ipc:3,startOwner:"usa",type:"land",region:"americas",x:340,y:455,adjacent:["sz_8","sz_9","sz_10"]},hawaii:{id:"hawaii",name:"Hawaiian Islands",ipc:1,startOwner:"usa",type:"land",region:"pacific",x:95,y:355,adjacent:["sz_53","sz_26"]},midway:{id:"midway",name:"Midway Island",ipc:0,startOwner:"usa",type:"land",region:"pacific",x:50,y:290,adjacent:["sz_25","sz_26"]},austria:{id:"austria",name:"Austria",ipc:4,startOwner:"neutral",type:"land",region:"europe",neutral:!0,x:660,y:255,adjacent:["germany","southern_europe","eastern_europe","romania_bulgaria"]},yugoslavia:{id:"yugoslavia",name:"Yugoslavia",ipc:2,startOwner:"neutral",type:"land",region:"europe",neutral:!0,x:670,y:340,adjacent:["southern_europe","eastern_europe","romania_bulgaria","austria","sz_14","sz_15"]},turkey:{id:"turkey",name:"Turkey",ipc:2,startOwner:"neutral",type:"land",region:"middleeast",neutral:!0,x:755,y:335,adjacent:["romania_bulgaria","sz_15","trans_jordan","persia"]},sweden:{id:"sweden",name:"Sweden",ipc:2,startOwner:"neutral",type:"land",region:"europe",neutral:!0,x:640,y:120,adjacent:["norway","finland","sz_5"]},spain:{id:"spain",name:"Spain & Portugal",ipc:2,startOwner:"neutral",type:"land",region:"europe",neutral:!0,x:500,y:295,adjacent:["western_europe","sz_6","sz_7","sz_8","sz_14"]},united_kingdom:{id:"united_kingdom",name:"United Kingdom",ipc:8,startOwner:"uk",type:"land",region:"europe",x:510,y:185,adjacent:["norway","sz_5","sz_6","sz_7","sz_8"]},norway:{id:"norway",name:"Norway",ipc:3,startOwner:"germany",type:"land",region:"europe",x:600,y:130,adjacent:["united_kingdom","finland","germany","sweden","karelia","sz_5","sz_6"]},finland:{id:"finland",name:"Finland & Norway",ipc:1,startOwner:"germany",type:"land",region:"europe",x:675,y:120,adjacent:["norway","germany","sweden","karelia","baltic_states","sz_5"]},germany:{id:"germany",name:"Germany",ipc:10,startOwner:"germany",type:"land",region:"europe",x:625,y:225,adjacent:["norway","finland","western_europe","southern_europe","eastern_europe","baltic_states","austria","sweden","sz_5"]},western_europe:{id:"western_europe",name:"Western Europe",ipc:6,startOwner:"germany",type:"land",region:"europe",x:545,y:290,adjacent:["germany","southern_europe","spain","united_kingdom","north_africa","sz_5","sz_6","sz_7","sz_8"]},southern_europe:{id:"southern_europe",name:"Southern Europe",ipc:4,startOwner:"germany",type:"land",region:"europe",x:635,y:305,adjacent:["germany","western_europe","eastern_europe","ukraine","romania_bulgaria","austria","yugoslavia","north_africa","sz_14","sz_15"]},baltic_states:{id:"baltic_states",name:"Baltic States",ipc:2,startOwner:"germany",type:"land",region:"europe",x:690,y:190,adjacent:["finland","germany","eastern_europe","belorussia","karelia","sz_5"]},eastern_europe:{id:"eastern_europe",name:"Eastern Europe",ipc:3,startOwner:"germany",type:"land",region:"europe",x:695,y:260,adjacent:["germany","baltic_states","belorussia","ukraine","southern_europe","romania_bulgaria","austria","yugoslavia"]},belorussia:{id:"belorussia",name:"Belorussia",ipc:2,startOwner:"germany",type:"land",region:"europe",x:745,y:220,adjacent:["baltic_states","karelia","russia","ukraine","eastern_europe"]},ukraine:{id:"ukraine",name:"Ukraine S.S.R.",ipc:2,startOwner:"germany",type:"land",region:"europe",x:745,y:280,adjacent:["belorussia","russia","caucasus","romania_bulgaria","eastern_europe","southern_europe"]},romania_bulgaria:{id:"romania_bulgaria",name:"Romania & Bulgaria",ipc:3,startOwner:"germany",type:"land",region:"europe",x:700,y:330,adjacent:["eastern_europe","ukraine","southern_europe","yugoslavia","austria","turkey","sz_14","sz_15"]},north_africa:{id:"north_africa",name:"North Africa",ipc:1,startOwner:"germany",type:"land",region:"africa",x:605,y:400,adjacent:["western_europe","southern_europe","egypt","west_africa","sz_14","sz_15"]},west_africa:{id:"west_africa",name:"West Africa",ipc:1,startOwner:"uk",type:"land",region:"africa",x:545,y:475,adjacent:["north_africa","egypt","sz_11","sz_12"]},egypt:{id:"egypt",name:"Egypt",ipc:3,startOwner:"uk",type:"land",region:"africa",x:700,y:395,adjacent:["north_africa","west_africa","anglo_egypt_sudan","trans_jordan","sz_15"]},anglo_egypt_sudan:{id:"anglo_egypt_sudan",name:"Anglo-Egypt Sudan",ipc:1,startOwner:"uk",type:"land",region:"africa",x:700,y:455,adjacent:["egypt","east_africa","west_africa"]},east_africa:{id:"east_africa",name:"East Africa",ipc:2,startOwner:"uk",type:"land",region:"africa",x:695,y:530,adjacent:["anglo_egypt_sudan","south_africa","sz_12","sz_20"]},south_africa:{id:"south_africa",name:"South Africa",ipc:2,startOwner:"uk",type:"land",region:"africa",x:645,y:625,adjacent:["east_africa","sz_11","sz_12","sz_20"]},trans_jordan:{id:"trans_jordan",name:"Trans-Jordan",ipc:1,startOwner:"uk",type:"land",region:"middleeast",x:765,y:375,adjacent:["egypt","persia","turkey","sz_15","sz_20"]},persia:{id:"persia",name:"Persia",ipc:1,startOwner:"uk",type:"land",region:"middleeast",x:840,y:345,adjacent:["trans_jordan","india","caucasus","turkey","sz_20"]},karelia:{id:"karelia",name:"Karelia S.S.R.",ipc:2,startOwner:"ussr",type:"land",region:"europe",x:730,y:150,adjacent:["norway","finland","baltic_states","belorussia","russia","archangel","sz_5"]},archangel:{id:"archangel",name:"Archangel",ipc:1,startOwner:"ussr",type:"land",region:"europe",x:795,y:130,adjacent:["karelia","russia","sz_2"]},russia:{id:"russia",name:"Russia",ipc:8,startOwner:"ussr",type:"land",region:"europe",x:830,y:210,adjacent:["karelia","archangel","belorussia","ukraine","caucasus","kazakh","novosibirsk"]},caucasus:{id:"caucasus",name:"Caucasus",ipc:4,startOwner:"ussr",type:"land",region:"europe",x:840,y:300,adjacent:["russia","ukraine","persia","kazakh","sz_20"]},kazakh:{id:"kazakh",name:"Kazakh S.S.R.",ipc:2,startOwner:"ussr",type:"land",region:"asia",x:915,y:265,adjacent:["russia","caucasus","novosibirsk","india"]},novosibirsk:{id:"novosibirsk",name:"Novosibirsk",ipc:1,startOwner:"ussr",type:"land",region:"asia",x:995,y:210,adjacent:["russia","kazakh","evenki","buryatia"]},evenki:{id:"evenki",name:"Evenki National Okrug",ipc:1,startOwner:"ussr",type:"land",region:"asia",x:1075,y:160,adjacent:["novosibirsk","buryatia","yakut"]},yakut:{id:"yakut",name:"Yakut S.S.R.",ipc:1,startOwner:"ussr",type:"land",region:"asia",x:1165,y:130,adjacent:["evenki","buryatia","soviet_far_east","sz_1"]},buryatia:{id:"buryatia",name:"Buryatia S.S.R.",ipc:1,startOwner:"ussr",type:"land",region:"asia",x:1115,y:215,adjacent:["novosibirsk","evenki","yakut","soviet_far_east","manchuria"]},soviet_far_east:{id:"soviet_far_east",name:"Soviet Far East",ipc:1,startOwner:"ussr",type:"land",region:"asia",x:1220,y:185,adjacent:["yakut","buryatia","manchuria","sz_1","sz_61"]},india:{id:"india",name:"India",ipc:3,startOwner:"uk",type:"land",region:"asia",x:950,y:360,adjacent:["persia","kazakh","burma","sz_20","sz_39"]},burma:{id:"burma",name:"Burma",ipc:1,startOwner:"uk",type:"land",region:"asia",x:1030,y:365,adjacent:["india","french_indochina","yunnan","sz_37"]},yunnan:{id:"yunnan",name:"Yunnan",ipc:1,startOwner:"uk",type:"land",region:"asia",x:1080,y:355,adjacent:["burma","french_indochina","kwangtung","szechwan"]},szechwan:{id:"szechwan",name:"Szechwan",ipc:1,startOwner:"uk",type:"land",region:"asia",x:1090,y:310,adjacent:["yunnan","kwangtung","kiangsu","manchuria","buryatia"]},kwangtung:{id:"kwangtung",name:"Kwangtung",ipc:2,startOwner:"japan",type:"land",region:"asia",x:1120,y:375,adjacent:["french_indochina","yunnan","szechwan","kiangsu","sz_20","sz_36"]},kiangsu:{id:"kiangsu",name:"Kiangsu",ipc:3,startOwner:"japan",type:"land",region:"asia",x:1155,y:320,adjacent:["kwangtung","szechwan","manchuria","sz_36","sz_19"]},french_indochina:{id:"french_indochina",name:"French Indo-China/Thailand",ipc:2,startOwner:"japan",type:"land",region:"asia",x:1055,y:415,adjacent:["burma","yunnan","kwangtung","malaya","sz_36","sz_37","sz_35"]},malaya:{id:"malaya",name:"Malaya",ipc:3,startOwner:"japan",type:"land",region:"asia",x:1065,y:485,adjacent:["french_indochina","dutch_east_indies","sz_36","sz_37"]},manchuria:{id:"manchuria",name:"Manchuria",ipc:3,startOwner:"japan",type:"land",region:"asia",x:1195,y:255,adjacent:["soviet_far_east","buryatia","szechwan","kiangsu","korea","sz_61"]},korea:{id:"korea",name:"Korea",ipc:2,startOwner:"japan",type:"land",region:"asia",x:1215,y:300,adjacent:["manchuria","sz_30","sz_19"]},japan:{id:"japan",name:"Japan",ipc:8,startOwner:"japan",type:"land",region:"asia",x:1275,y:270,adjacent:["sz_6","sz_19","sz_30","sz_61"]},philippines:{id:"philippines",name:"Philippine Islands",ipc:3,startOwner:"japan",type:"land",region:"pacific",x:1185,y:430,adjacent:["sz_35","sz_36"]},wake_island:{id:"wake_island",name:"Wake Island",ipc:0,startOwner:"japan",type:"land",region:"pacific",x:1310,y:355,adjacent:["sz_25","sz_29","sz_30"]},guam:{id:"guam",name:"Guam",ipc:0,startOwner:"japan",type:"land",region:"pacific",x:1270,y:415,adjacent:["sz_29","sz_30","sz_35"]},iwo_jima:{id:"iwo_jima",name:"Iwo Jima",ipc:0,startOwner:"japan",type:"land",region:"pacific",x:1295,y:335,adjacent:["sz_19","sz_30"]},marianas:{id:"marianas",name:"Mariana Islands",ipc:0,startOwner:"japan",type:"land",region:"pacific",x:1285,y:390,adjacent:["sz_29","sz_30"]},caroline_islands:{id:"caroline_islands",name:"Caroline Islands",ipc:0,startOwner:"japan",type:"land",region:"pacific",x:1235,y:465,adjacent:["sz_29","sz_35"]},dutch_east_indies:{id:"dutch_east_indies",name:"Dutch East Indies",ipc:4,startOwner:"japan",type:"land",region:"pacific",x:1125,y:545,adjacent:["malaya","borneo","new_guinea","sz_36","sz_41","sz_42"]},borneo:{id:"borneo",name:"Borneo",ipc:3,startOwner:"japan",type:"land",region:"pacific",x:1155,y:500,adjacent:["malaya","dutch_east_indies","philippines","sz_36","sz_41"]},new_guinea:{id:"new_guinea",name:"New Guinea",ipc:1,startOwner:"uk",type:"land",region:"pacific",x:1230,y:555,adjacent:["dutch_east_indies","solomon_islands","australia","sz_42","sz_44","sz_45"]},solomon_islands:{id:"solomon_islands",name:"Solomon Islands",ipc:0,startOwner:"japan",type:"land",region:"pacific",x:1285,y:565,adjacent:["new_guinea","sz_44","sz_45"]},australia:{id:"australia",name:"Australia",ipc:2,startOwner:"uk",type:"land",region:"pacific",x:1185,y:660,adjacent:["new_guinea","sz_42","sz_44","sz_54"]},new_zealand:{id:"new_zealand",name:"New Zealand",ipc:1,startOwner:"uk",type:"land",region:"pacific",x:1310,y:700,adjacent:["sz_54","sz_57"]},sz_1:{id:"sz_1",name:"Sea Zone 1 (N Pacific)",ipc:0,startOwner:null,type:"sea",region:"pacific",x:170,y:85,adjacent:["alaska","western_canada","yakut","soviet_far_east","sz_2","sz_56"]},sz_2:{id:"sz_2",name:"Sea Zone 2 (N Atlantic)",ipc:0,startOwner:null,type:"sea",region:"atlantic",x:430,y:110,adjacent:["archangel","karelia","sz_1","sz_5","sz_8"]},sz_5:{id:"sz_5",name:"Sea Zone 5 (N Sea)",ipc:0,startOwner:null,type:"sea",region:"atlantic",x:575,y:155,adjacent:["united_kingdom","norway","finland","germany","karelia","baltic_states","western_europe","sz_2","sz_6"]},sz_6:{id:"sz_6",name:"Sea Zone 6 (N Atlantic)",ipc:0,startOwner:null,type:"sea",region:"atlantic",x:490,y:225,adjacent:["united_kingdom","western_europe","norway","sz_5","sz_7"]},sz_7:{id:"sz_7",name:"Sea Zone 7 (Mid Atlantic)",ipc:0,startOwner:null,type:"sea",region:"atlantic",x:430,y:270,adjacent:["united_kingdom","western_europe","eastern_canada","central_canada","sz_6","sz_8","sz_12"]},sz_8:{id:"sz_8",name:"Sea Zone 8 (W Atlantic)",ipc:0,startOwner:null,type:"sea",region:"atlantic",x:360,y:320,adjacent:["eastern_us","eastern_canada","western_europe","central_america","brazil","sz_7","sz_9","sz_10"]},sz_9:{id:"sz_9",name:"Sea Zone 9 (Caribbean)",ipc:0,startOwner:null,type:"sea",region:"atlantic",x:285,y:390,adjacent:["central_america","brazil","sz_8","sz_10","sz_56"]},sz_10:{id:"sz_10",name:"Sea Zone 10 (S Atlantic)",ipc:0,startOwner:null,type:"sea",region:"atlantic",x:420,y:430,adjacent:["eastern_us","brazil","sz_8","sz_9","sz_11"]},sz_11:{id:"sz_11",name:"Sea Zone 11 (S Atlantic)",ipc:0,startOwner:null,type:"sea",region:"atlantic",x:535,y:555,adjacent:["west_africa","south_africa","sz_10","sz_12"]},sz_12:{id:"sz_12",name:"Sea Zone 12 (S Atlantic)",ipc:0,startOwner:null,type:"sea",region:"atlantic",x:620,y:580,adjacent:["west_africa","east_africa","south_africa","sz_7","sz_11","sz_20"]},sz_14:{id:"sz_14",name:"Sea Zone 14 (Med W)",ipc:0,startOwner:null,type:"sea",region:"europe",x:580,y:360,adjacent:["western_europe","north_africa","southern_europe","sz_15"]},sz_15:{id:"sz_15",name:"Sea Zone 15 (Med E)",ipc:0,startOwner:null,type:"sea",region:"europe",x:675,y:385,adjacent:["southern_europe","romania_bulgaria","north_africa","egypt","trans_jordan","sz_14","sz_20"]},sz_19:{id:"sz_19",name:"Sea Zone 19 (E China Sea)",ipc:0,startOwner:null,type:"sea",region:"pacific",x:1215,y:360,adjacent:["japan","korea","kiangsu","iwo_jima","sz_30","sz_36"]},sz_20:{id:"sz_20",name:"Sea Zone 20 (Indian O.)",ipc:0,startOwner:null,type:"sea",region:"indian",x:850,y:470,adjacent:["persia","india","trans_jordan","east_africa","south_africa","caucasus","sz_12","sz_15","sz_39","sz_41"]},sz_25:{id:"sz_25",name:"Sea Zone 25 (C Pacific)",ipc:0,startOwner:null,type:"sea",region:"pacific",x:135,y:300,adjacent:["midway","hawaii","sz_26","sz_29","sz_53"]},sz_26:{id:"sz_26",name:"Sea Zone 26 (C Pacific)",ipc:0,startOwner:null,type:"sea",region:"pacific",x:95,y:405,adjacent:["hawaii","midway","sz_25","sz_53","sz_57"]},sz_29:{id:"sz_29",name:"Sea Zone 29 (C Pacific)",ipc:0,startOwner:null,type:"sea",region:"pacific",x:1285,y:450,adjacent:["wake_island","guam","marianas","caroline_islands","sz_25","sz_30","sz_35"]},sz_30:{id:"sz_30",name:"Sea Zone 30 (W Pacific)",ipc:0,startOwner:null,type:"sea",region:"pacific",x:1255,y:330,adjacent:["japan","korea","wake_island","guam","iwo_jima","marianas","sz_19","sz_29","sz_61"]},sz_35:{id:"sz_35",name:"Sea Zone 35 (Philippines)",ipc:0,startOwner:null,type:"sea",region:"pacific",x:1170,y:455,adjacent:["philippines","french_indochina","guam","caroline_islands","borneo","sz_29","sz_36","sz_41"]},sz_36:{id:"sz_36",name:"Sea Zone 36 (S China Sea)",ipc:0,startOwner:null,type:"sea",region:"pacific",x:1120,y:430,adjacent:["french_indochina","kwangtung","kiangsu","malaya","borneo","philippines","sz_19","sz_35","sz_41"]},sz_37:{id:"sz_37",name:"Sea Zone 37 (Bay Bengal)",ipc:0,startOwner:null,type:"sea",region:"indian",x:1e3,y:440,adjacent:["india","burma","french_indochina","malaya","sz_20","sz_36","sz_39"]},sz_39:{id:"sz_39",name:"Sea Zone 39 (Indian O.)",ipc:0,startOwner:null,type:"sea",region:"indian",x:960,y:490,adjacent:["india","sz_20","sz_37","sz_41"]},sz_41:{id:"sz_41",name:"Sea Zone 41 (Java Sea)",ipc:0,startOwner:null,type:"sea",region:"pacific",x:1110,y:565,adjacent:["dutch_east_indies","borneo","sz_35","sz_36","sz_39","sz_42","sz_20"]},sz_42:{id:"sz_42",name:"Sea Zone 42 (Coral Sea)",ipc:0,startOwner:null,type:"sea",region:"pacific",x:1190,y:600,adjacent:["new_guinea","australia","dutch_east_indies","sz_41","sz_44","sz_54"]},sz_44:{id:"sz_44",name:"Sea Zone 44 (S Pacific)",ipc:0,startOwner:null,type:"sea",region:"pacific",x:1260,y:630,adjacent:["new_guinea","solomon_islands","australia","sz_42","sz_45","sz_54"]},sz_45:{id:"sz_45",name:"Sea Zone 45 (S Pacific)",ipc:0,startOwner:null,type:"sea",region:"pacific",x:1340,y:600,adjacent:["solomon_islands","sz_44","sz_54"]},sz_53:{id:"sz_53",name:"Sea Zone 53 (E Pacific)",ipc:0,startOwner:null,type:"sea",region:"pacific",x:95,y:440,adjacent:["hawaii","sz_25","sz_26","sz_54","sz_56"]},sz_54:{id:"sz_54",name:"Sea Zone 54 (S Pacific)",ipc:0,startOwner:null,type:"sea",region:"pacific",x:1230,y:720,adjacent:["australia","new_zealand","sz_42","sz_44","sz_45","sz_53","sz_57"]},sz_56:{id:"sz_56",name:"Sea Zone 56 (N Pacific)",ipc:0,startOwner:null,type:"sea",region:"pacific",x:155,y:205,adjacent:["alaska","western_canada","western_us","central_america","sz_1","sz_9","sz_53","sz_57"]},sz_57:{id:"sz_57",name:"Sea Zone 57 (N Pacific)",ipc:0,startOwner:null,type:"sea",region:"pacific",x:1350,y:720,adjacent:["western_canada","western_us","new_zealand","sz_1","sz_54","sz_56"]},sz_61:{id:"sz_61",name:"Sea Zone 61 (Sea of Japan)",ipc:0,startOwner:null,type:"sea",region:"pacific",x:1235,y:235,adjacent:["japan","manchuria","soviet_far_east","sz_30"]}},b={ussr:{id:"ussr",name:"Soviet Union",side:"allies",color:"#cc2222",capital:"russia",turnOrder:1,startingIPC:24,flag:"🇷🇺",textColor:"#ffffff"},germany:{id:"germany",name:"Germany",side:"axis",color:"#666666",capital:"germany",turnOrder:2,startingIPC:40,flag:"🇩🇪",textColor:"#ffffff"},uk:{id:"uk",name:"United Kingdom",side:"allies",color:"#c8860a",capital:"united_kingdom",turnOrder:3,startingIPC:31,flag:"🇬🇧",textColor:"#ffffff"},japan:{id:"japan",name:"Japan",side:"axis",color:"#e8c020",capital:"japan",turnOrder:4,startingIPC:30,flag:"🇯🇵",textColor:"#000000"},usa:{id:"usa",name:"United States",side:"allies",color:"#4a7c3f",capital:"eastern_us",turnOrder:5,startingIPC:42,flag:"🇺🇸",textColor:"#ffffff"},neutral:{id:"neutral",name:"Neutral",side:"neutral",color:"#8a8a6e",capital:null,turnOrder:null,startingIPC:0,flag:"🏳️",textColor:"#ffffff"}},O=["ussr","germany","uk","japan","usa"];function L(m){var t;return((t=b[m])==null?void 0:t.side)??"neutral"}function P(m,t){if(!m||!t||m===t)return!1;const e=L(m),a=L(t);return e==="neutral"||a==="neutral"?!0:e!==a}const q={infantry:{id:"infantry",name:"Infantry",cost:3,attack:1,defense:2,movement:1,type:"land",canCarry:!1,carriedBy:["transport"],icon:"🪖",color:"#888",isCustom:!1,blitz:!1,description:"Basic ground unit. Can be supported by artillery to attack at 2."},artillery:{id:"artillery",name:"Artillery",cost:4,attack:2,defense:2,movement:1,type:"land",canCarry:!1,carriedBy:["transport"],icon:"💥",color:"#888",isCustom:!1,blitz:!1,supportsInfantry:!0,description:"Supports 1 infantry per artillery to attack at 2."},armor:{id:"armor",name:"Armor",cost:6,attack:3,defense:3,movement:2,type:"land",canCarry:!1,carriedBy:["transport"],icon:"🎯",color:"#888",isCustom:!1,blitz:!0,description:"Can blitz through unoccupied enemy territory."},antiair:{id:"antiair",name:"Anti-Aircraft Gun",cost:5,attack:0,defense:0,movement:1,type:"land",canCarry:!1,carriedBy:["transport"],icon:"⚡",color:"#888",isCustom:!1,blitz:!1,shootsAtAir:!0,airShots:1,description:"Fires at attacking aircraft before combat (hits on 1). Cannot attack."},fighter:{id:"fighter",name:"Fighter",cost:10,attack:3,defense:4,movement:4,type:"air",canCarry:!1,carriedBy:["carrier"],icon:"✈️",color:"#aae",isCustom:!1,canLandOnCarrier:!0,description:"Versatile air unit. Can land on carriers."},bomber:{id:"bomber",name:"Bomber",cost:12,attack:4,defense:1,movement:6,type:"air",canCarry:!1,carriedBy:[],icon:"💣",color:"#aae",isCustom:!1,canStrategicBomb:!0,bombingDice:2,description:"Long-range. Can strategic bomb enemy IPC production."},tactical_bomber:{id:"tactical_bomber",name:"Tactical Bomber",cost:11,attack:3,defense:3,movement:4,type:"air",canCarry:!1,carriedBy:["carrier"],icon:"🛩️",color:"#aae",isCustom:!1,canLandOnCarrier:!0,canStrategicBomb:!0,bombingDice:1,description:"Can land on carriers. Bonds with armor/fighter for +1 attack."},submarine:{id:"submarine",name:"Submarine",cost:6,attack:2,defense:1,movement:2,type:"sea",canCarry:!1,carriedBy:[],icon:"🤿",color:"#44a",isCustom:!1,submerge:!0,firstStrike:!0,ignoresDestroyers:!1,description:"First strike. Can submerge to avoid combat. Ignored by planes (unless destroyer present)."},destroyer:{id:"destroyer",name:"Destroyer",cost:8,attack:3,defense:3,movement:2,type:"sea",canCarry:!1,carriedBy:[],icon:"⚓",color:"#44a",isCustom:!1,cancelsSubs:!0,description:"Cancels submarine special abilities. General purpose warship."},cruiser:{id:"cruiser",name:"Cruiser",cost:12,attack:3,defense:3,movement:2,type:"sea",canCarry:!1,carriedBy:[],icon:"🚢",color:"#44a",isCustom:!1,canBombard:!0,description:"Can bombard coastal territories during amphibious assaults."},carrier:{id:"carrier",name:"Aircraft Carrier",cost:14,attack:1,defense:2,movement:2,type:"sea",canCarry:!0,carriedBy:[],carriesMax:2,carriesTypes:["fighter","tactical_bomber"],icon:"🛳️",color:"#44a",isCustom:!1,description:"Carries up to 2 fighters/tactical bombers. Defends at 2."},battleship:{id:"battleship",name:"Battleship",cost:20,attack:4,defense:4,movement:2,type:"sea",canCarry:!1,carriedBy:[],icon:"⛵",color:"#44a",isCustom:!1,twoHit:!0,canBombard:!0,description:"Takes 2 hits to sink. Can bombard coastal territories."},transport:{id:"transport",name:"Transport",cost:7,attack:0,defense:1,movement:2,type:"sea",canCarry:!0,carriedBy:[],carriesMax:2,carriesTypes:["infantry","artillery","armor","antiair"],icon:"🚤",color:"#44a",isCustom:!1,description:"Carries up to 2 land units (1 heavy = 1 slot, infantry/art = 1 slot each)."}};let Y={};function S(){return{...q,...Y}}const j="aa1942_autosave",T=2;class E{constructor(){this.reset()}reset(){this.ownership={},this.units={},this.ipc={},this.round=1,this.currentNationIdx=0,this.phase="setup",this.players={},this.pendingPlacements={},this.activeBattle=null,this.winner=null,this.technologies={},this.industrialComplexes={},this._listeners=[]}loadScenario(t){try{Object.values(y).forEach(e=>{this.ownership[e.id]=e.startOwner,this.units[e.id]=[]}),Object.values(b).forEach(e=>{var a;e.id!=="neutral"&&(this.ipc[e.id]=((a=t.ipc)==null?void 0:a[e.id])??e.startingIPC,this.pendingPlacements[e.id]=[],this.technologies[e.id]=[])}),["germany","russia","united_kingdom","eastern_us","japan"].forEach(e=>{const a=this.ownership[e];a&&a!=="neutral"&&(this.industrialComplexes[e]=a)}),this._placeScenarioUnits(t),this.phase="setup",this.round=1,this.currentNationIdx=0,this.autosave()}catch(e){console.error("[GameState] loadScenario failed:",e)}}_placeScenarioUnits(t){Object.entries(t.units).forEach(([e,a])=>{this.units[e]||(this.units[e]=[]),Array.isArray(a)&&a.forEach(({nation:s,type:i,count:n})=>{for(let c=0;c<n;c++)this.units[e].push(this._makeUnit(i,s))})})}_makeUnit(t,e,a={}){return{id:`${t}_${e}_${Math.random().toString(36).slice(2,7)}`,type:t,nation:e,damaged:!1,moved:!1,...a}}get currentNation(){return O[this.currentNationIdx]}getUnits(t,e=null){const a=this.units[t]||[];return e?a.filter(s=>s.nation===e):a}countUnits(t,e=null){return this.getUnits(t,e).reduce((a,s)=>(a[s.type]=(a[s.type]||0)+1,a),{})}getTerritoryIPC(t){var e;return((e=y[t])==null?void 0:e.ipc)||0}calculateIncome(t){return Object.entries(this.ownership).filter(([,e])=>e===t).reduce((e,[a])=>e+this.getTerritoryIPC(a),0)}moveUnits(t,e,a){try{const s=this.units[e].filter(i=>t.includes(i.id));this.units[e]=this.units[e].filter(i=>!t.includes(i.id)),s.forEach(i=>{i.moved=!0}),this.units[a]=[...this.units[a]||[],...s],this._emit("units_moved",{unitIds:t,fromId:e,toId:a}),this.autosave()}catch(s){console.error("[GameState] moveUnits failed:",s)}}purchaseUnit(t,e){try{const a=S()[t];if(!a)return!1;const s=a.cost;return(this.ipc[e]||0)<s?!1:(this.ipc[e]-=s,this.pendingPlacements[e].push(t),this._emit("unit_purchased",{unitType:t,nation:e}),this.autosave(),!0)}catch(a){return console.error("[GameState] purchaseUnit failed:",a),!1}}refundUnit(t,e){try{const a=this.pendingPlacements[e].indexOf(t);if(a===-1)return!1;const s=S()[t];return this.pendingPlacements[e].splice(a,1),this.ipc[e]+=(s==null?void 0:s.cost)||0,this._emit("unit_refunded",{unitType:t,nation:e}),this.autosave(),!0}catch(a){return console.error("[GameState] refundUnit failed:",a),!1}}placeUnit(t,e,a){try{const s=this.pendingPlacements[e].indexOf(t);if(s===-1)return!1;this.pendingPlacements[e].splice(s,1);const i=this._makeUnit(t,e);return this.units[a]=[...this.units[a]||[],i],this._emit("unit_placed",{unitType:t,nation:e,territoryId:a}),this.autosave(),!0}catch(s){return console.error("[GameState] placeUnit failed:",s),!1}}collectIncome(t){try{const e=this.calculateIncome(t);let a=0;this.hasTech(t,"war_bonds")&&(a=Math.ceil(Math.random()*6));const s=e+a;return this.ipc[t]=Math.min((this.ipc[t]||0)+s,999),this._emit("income_collected",{nation:t,income:e,bonus:a,total:this.ipc[t]}),this.autosave(),{income:e,bonus:a}}catch(e){return console.error("[GameState] collectIncome failed:",e),{income:0,bonus:0}}}captureTerritory(t,e){try{const a=this.ownership[t];this.ownership[t]=e,this.units[t]=(this.units[t]||[]).filter(i=>i.nation===e);const s=Object.values(b).find(i=>i.capital===t);if(s&&s.id!==e&&s.id!=="neutral"){const i=this.ipc[s.id]||0;this.ipc[s.id]=0,this.ipc[e]=(this.ipc[e]||0)+i}this._emit("territory_captured",{territoryId:t,byNation:e,prevOwner:a}),this.autosave()}catch(a){console.error("[GameState] captureTerritory failed:",a)}}hasTech(t,e){return(this.technologies[t]||[]).includes(e)}researchTech(t,e){try{this.technologies[t]||(this.technologies[t]=[]),this.technologies[t].includes(e)||(this.technologies[t].push(e),this._emit("tech_researched",{nation:t,techId:e}),this.autosave())}catch(a){console.error("[GameState] researchTech failed:",a)}}rollResearch(t,e,a){try{const s=e*5;if((this.ipc[t]||0)<s)return{dice:[],breakthroughs:[]};this.ipc[t]-=s;const i=Array.from({length:e},()=>Math.ceil(Math.random()*6)),n=i.filter(o=>o===6).length,c=[],l=a.filter(o=>!this.hasTech(t,o));for(let o=0;o<n&&l.length>0;o++){const d=Math.floor(Math.random()*l.length),p=l.splice(d,1)[0];this.researchTech(t,p),c.push(p)}return this.autosave(),{dice:i,breakthroughs:c}}catch(s){return console.error("[GameState] rollResearch failed:",s),{dice:[],breakthroughs:[]}}}checkVictory(){try{const t=Object.values(b).filter(i=>i.capital).map(i=>({nation:i.id,capital:i.capital,side:i.side})),e=t.filter(({capital:i,side:n})=>n==="allies"&&["germany","japan"].includes(this.ownership[i])).length,a=t.filter(({capital:i,side:n})=>n==="axis"&&["ussr","uk","usa"].includes(this.ownership[i])).length,s=Object.values(b).filter(i=>i.capital&&i.side!=="neutral").length;return e>=s&&(this.winner="axis"),a>=s&&(this.winner="allies"),this.winner}catch(t){return console.error("[GameState] checkVictory failed:",t),null}}nextPhase(){const t=["purchase","combat_move","conduct_combat","noncombat_move","place","collect"],e=t.indexOf(this.phase);e<t.length-1?this.phase=t[e+1]:(this.phase="purchase",this.currentNationIdx=(this.currentNationIdx+1)%O.length,this.currentNationIdx===0&&this.round++,Object.values(this.units).flat().forEach(a=>{a.moved=!1})),this._emit("phase_changed",{phase:this.phase,nation:this.currentNation,round:this.round}),this.autosave()}autosave(){try{const t={version:T,timestamp:Date.now(),ownership:this.ownership,units:this.units,ipc:this.ipc,round:this.round,currentNationIdx:this.currentNationIdx,phase:this.phase,players:this.players,technologies:this.technologies,industrialComplexes:this.industrialComplexes,pendingPlacements:this.pendingPlacements,winner:this.winner};localStorage.setItem(j,JSON.stringify(t))}catch{}}static hasSave(){try{const t=localStorage.getItem(j);return t?JSON.parse(t).version===T:!1}catch{return!1}}static getSaveInfo(){try{const t=localStorage.getItem(j);if(!t)return null;const e=JSON.parse(t);return{timestamp:e.timestamp,round:e.round,phase:e.phase,nation:O[e.currentNationIdx]}}catch{return null}}loadSave(){try{const t=localStorage.getItem(j);if(!t)return!1;const e=JSON.parse(t);return e.version!==T?!1:(this.ownership=e.ownership,this.units=e.units,this.ipc=e.ipc,this.round=e.round,this.currentNationIdx=e.currentNationIdx,this.phase=e.phase,this.players=e.players||{},this.technologies=e.technologies||{},this.industrialComplexes=e.industrialComplexes||{},this.pendingPlacements=e.pendingPlacements||{},this.winner=e.winner||null,this._listeners=[],!0)}catch(t){return console.error("[GameState] loadSave failed:",t),!1}}static clearSave(){try{localStorage.removeItem(j)}catch{}}serialize(){return JSON.stringify(this.autosave)}on(t,e){this._listeners.push({event:t,fn:e})}off(t,e){this._listeners=this._listeners.filter(a=>!(a.event===t&&a.fn===e))}_emit(t,e){this._listeners.filter(a=>a.event===t||a.event==="*").forEach(a=>{try{a.fn(e,t)}catch(s){console.error("[GameState] listener error:",t,s)}})}}class k{static rollDice(t,e){const a=Array.from({length:t},()=>Math.ceil(Math.random()*6)),s=a.filter(i=>i<=e).length;return{rolls:a,hits:s}}static resolveCombatRound(t,e,a=!1){var C;const s=S();let i=null;if(a){const _=e.filter(z=>{var A;return(A=s[z.type])==null?void 0:A.shootsAtAir}),g=t.filter(z=>{var A;return((A=s[z.type])==null?void 0:A.type)==="air"});if(_.length>0&&g.length>0){const z=Math.min(_.length*(((C=s.antiair)==null?void 0:C.airShots)||1),g.length),{rolls:A,hits:N}=k.rollDice(z,1);i={rolls:A,hits:N,targets:g.slice(0,N).map(H=>H.id)}}}const n=i?t.filter(_=>!i.targets.includes(_.id)):[...t],c=n.filter(_=>{var g;return(g=s[_.type])==null?void 0:g.firstStrike}),l=n.filter(_=>{var g;return!((g=s[_.type])!=null&&g.firstStrike)}),o=e.some(_=>_.type==="destroyer");let d=[],p=0;if(c.length>0&&!o){const _=k.rollDice(c.length,s.submarine.attack);d=_.rolls,p=_.hits}const h=l.filter(_=>_.type==="artillery").length;let u=0,f=[...d],v=p;l.forEach(_=>{const g=s[_.type];if(!g)return;let z=g.attack;if(_.type==="infantry"&&u<h&&(z=2,u++),z>0){const{rolls:A,hits:N}=k.rollDice(1,z);f.push(...A),v+=N}});let w=[],x=0;return e.forEach(_=>{const g=s[_.type];if(!(!g||g.shootsAtAir)&&g.defense>0){const{rolls:z,hits:A}=k.rollDice(1,g.defense);w.push(...z),x+=A}}),{attackerRolls:f,defenderRolls:w,attackerHits:v,defenderHits:x,aaResults:i}}static selectCasualties(t,e,a){if(e<=0)return[];const s=S(),i=[...t].sort((l,o)=>{var f,v,w,x,C,_;const d=l.damaged&&((f=s[l.type])==null?void 0:f.twoHit),p=o.damaged&&((v=s[o.type])==null?void 0:v.twoHit);if(d&&!p)return-1;if(!d&&p)return 1;const h=a?(w=s[l.type])==null?void 0:w.attack:(x=s[l.type])==null?void 0:x.defense,u=a?(C=s[o.type])==null?void 0:C.attack:(_=s[o.type])==null?void 0:_.defense;return(h||0)-(u||0)}),n=[];let c=e;for(const l of i){if(c<=0)break;const o=s[l.type];o!=null&&o.twoHit&&!l.damaged?(l.damaged=!0,c--,n.push({unit:l,killed:!1})):(n.push({unit:l,killed:!0}),c--)}return n}static estimateOdds(t,e){const a=S(),s=t.reduce((o,d)=>{var p;return o+(((p=a[d.type])==null?void 0:p.attack)||0)},0),i=e.reduce((o,d)=>{var p;return o+(((p=a[d.type])==null?void 0:p.defense)||0)},0),n=t.reduce((o,d)=>{var p;return o+((p=a[d.type])!=null&&p.twoHit?2:1)},0),c=e.reduce((o,d)=>{var p;return o+((p=a[d.type])!=null&&p.twoHit?2:1)},0);if(s===0)return 0;if(i===0)return 1;t.reduce((o,d)=>{var p;return o+(((p=a[d.type])==null?void 0:p.cost)||0)},0),e.reduce((o,d)=>{var p;return o+(((p=a[d.type])==null?void 0:p.cost)||0)},0);const l=s/6*n/(i/6*c+.001);return Math.min(.99,Math.max(.01,l/(1+l)))}}class F{constructor(t,e){this.state=t,this.ai=e,this.pendingCombats=[],this._phaseListeners=[]}startGame(){this.state.phase="purchase";const t=this.state.currentNation,e=this.state.round;this._emit("turn_start",{nation:t,round:e}),this._emit("phase_changed",{phase:"purchase",nation:t,round:e}),this._checkAI()}advancePhase(){const t=this.state.phase;t==="purchase"?this._endPurchase():t==="combat_move"?this._endCombatMove():t==="conduct_combat"?this._endCombat():t==="noncombat_move"?this._endNonCombatMove():t==="place"?this._endPlace():t==="collect"&&this._endCollect()}_endPurchase(){this.state.nextPhase(),this._emit("phase_changed",{phase:"combat_move",nation:this.state.currentNation}),this._checkAI()}_endCombatMove(){this.pendingCombats=this._findCombats(),this.state.nextPhase(),this._emit("phase_changed",{phase:"conduct_combat",nation:this.state.currentNation,combats:this.pendingCombats}),this.pendingCombats.length>0&&this._emit("combat_needed",{territoryId:this.pendingCombats[0]}),this._checkAI()}_endCombat(){this.pendingCombats=[],this.state.nextPhase(),this._emit("phase_changed",{phase:"noncombat_move",nation:this.state.currentNation}),this._checkAI()}_endNonCombatMove(){this.state.nextPhase(),this._emit("phase_changed",{phase:"place",nation:this.state.currentNation}),this._checkAI()}_endPlace(){this.state.nextPhase(),this._emit("phase_changed",{phase:"collect",nation:this.state.currentNation}),this._checkAI()}_endCollect(){const t=this.state.currentNation,e=this.state.collectIncome(t);if(this._emit("income_collected",{nation:t,income:e}),this.state.nextPhase(),this.state.checkVictory()){this._emit("game_over",{winner:this.state.winner});return}this._emit("turn_start",{nation:this.state.currentNation,round:this.state.round}),this._checkAI()}_findCombats(){const t=this.state.currentNation,e=[];return Object.keys(this.state.units).forEach(a=>{const s=this.state.units[a],i=s.some(c=>c.nation===t),n=s.some(c=>c.nation!==t&&c.nation!==null&&P(c.nation,t));i&&n&&e.push(a)}),e}_checkAI(){this.state.players[this.state.currentNation]==="ai"&&setTimeout(()=>{var t;return(t=this.ai)==null?void 0:t.takeTurn(this)},500)}on(t,e){this._phaseListeners.push({event:t,fn:e})}_emit(t,e){this._phaseListeners.filter(a=>a.event===t).forEach(a=>a.fn(e))}}class X{constructor(t){this.state=t,this.thinkDelay=600,this.difficulty="easy"}async takeTurn(t){const e=this.state.currentNation,a=this.state.phase;try{await this._delay(this.thinkDelay),a==="purchase"?(this._doPurchase(e),t.advancePhase()):a==="combat_move"?(this._doCombatMove(e),t.advancePhase()):a==="conduct_combat"?(await this._doCombat(e,t),t.advancePhase()):a==="noncombat_move"?(this._doNonCombatMove(e),t.advancePhase()):a==="place"?(this._doPlace(e),t.advancePhase()):a==="collect"&&t.advancePhase()}catch(s){console.error("[AI] takeTurn error — skipping phase:",s);try{t.advancePhase()}catch{}}}_doPurchase(t){const e=this.state.ipc[t],a=S();b[t].side;const s=e;let i=0;const n=[];if(this._isCapitalThreatened(t))for(;i+a.infantry.cost<=s&&n.filter(l=>l==="infantry").length<8;)n.push("infantry"),i+=a.infantry.cost;else{let l=0,o=0;for(;i<s;){const p=s-i;if(p>=a.armor.cost&&o<l/2)n.push("armor"),i+=a.armor.cost,o++;else if(p>=a.infantry.cost)n.push("infantry"),i+=a.infantry.cost,l++;else if(p>=a.artillery.cost)n.push("artillery"),i+=a.artillery.cost;else break}const d=this._getAllUnitsOfNation(t).filter(p=>{var h;return((h=S()[p.type])==null?void 0:h.type)==="air"}).length;s-i>=a.fighter.cost&&d<3&&(n.push("fighter"),i+=a.fighter.cost)}n.forEach(l=>this.state.purchaseUnit(l,t))}_doCombatMove(t){this._getMyTerritories(t).forEach(a=>{const s=this.state.getUnits(a,t);if(s.length===0)return;const i=y[a];i&&i.adjacent.forEach(n=>{const c=y[n];if(!c||c.type==="sea")return;const l=this.state.ownership[n];if(!l||l===t||!P(l,t))return;const o=this.state.getUnits(n),d=k.estimateOdds(s,o),p=Object.values(b).some(h=>h.capital===n);if(d>.6||p&&d>.4){const h=s.slice(0,Math.ceil(s.length*.7));h.length>0&&this.state.moveUnits(h.map(u=>u.id),a,n)}})})}async _doCombat(t,e){const a=e.pendingCombats||[];for(const s of a){await this._delay(400);let i=0,n=!0;for(;i<20;){const c=this.state.getUnits(s,t),l=this.state.getUnits(s).filter(h=>h.nation!==t);if(c.length===0)break;if(l.length===0){this.state.captureTerritory(s,t);break}const o=k.resolveCombatRound(c,l,n);k.selectCasualties(c,o.defenderHits,!0).filter(h=>h.killed).forEach(h=>{this.state.units[s]=this.state.units[s].filter(u=>u.id!==h.unit.id)}),k.selectCasualties(l,o.attackerHits,!1).filter(h=>h.killed).forEach(h=>{this.state.units[s]=this.state.units[s].filter(u=>u.id!==h.unit.id)}),n=!1,i++}}}_doNonCombatMove(t){const e=this._getMyTerritories(t),a=b[t].capital;e.forEach(s=>{if(s===a)return;const i=this.state.getUnits(s,t).filter(c=>!c.moved);if(i.length<=1)return;const n=y[s];n==null||n.adjacent.forEach(c=>{if(this.state.ownership[c]!==t)return;if(this.state.getUnits(c,t).length<i.length-1){const d=i.filter(p=>!p.moved).slice(0,1);d.length>0&&this.state.moveUnits(d.map(p=>p.id),s,c)}})})}_doPlace(t){const e=[...this.state.pendingPlacements[t]],a=b[t].capital;e.forEach(s=>{this.state.placeUnit(s,t,a)})}_getMyTerritories(t){return Object.entries(this.state.ownership).filter(([,e])=>e===t).map(([e])=>e)}_getAllUnitsOfNation(t){return Object.values(this.state.units).flat().filter(e=>e.nation===t)}_isCapitalThreatened(t){const e=b[t].capital,a=y[e];return a?a.adjacent.some(s=>this.state.getUnits(s).some(n=>P(n.nation,t))):!1}_delay(t){return new Promise(e=>setTimeout(e,t))}}function r(m,t,e){return{nation:m,type:t,count:e}}const W={name:"Axis & Allies 1942 — Second Edition",startYear:1942,ipc:{ussr:24,germany:40,uk:31,japan:30,usa:42},units:{russia:[r("ussr","infantry",8),r("ussr","armor",4),r("ussr","antiair",1),r("ussr","fighter",1)],karelia:[r("ussr","infantry",4),r("ussr","fighter",1),r("ussr","bomber",1)],caucasus:[r("ussr","infantry",5),r("ussr","armor",2),r("ussr","antiair",1)],archangel:[r("ussr","infantry",2)],kazakh:[r("ussr","infantry",3)],novosibirsk:[r("ussr","infantry",2)],evenki:[r("ussr","infantry",1)],yakut:[r("ussr","infantry",1)],soviet_far_east:[r("ussr","infantry",2)],buryatia:[r("ussr","infantry",1)],germany:[r("germany","infantry",5),r("germany","armor",2),r("germany","antiair",1),r("germany","fighter",2),r("germany","bomber",1)],western_europe:[r("germany","infantry",4),r("germany","armor",2),r("germany","antiair",1)],norway:[r("germany","infantry",3)],finland:[r("germany","infantry",3)],baltic_states:[r("germany","infantry",3),r("germany","armor",1)],eastern_europe:[r("germany","infantry",3),r("germany","armor",3)],belorussia:[r("germany","infantry",6),r("germany","armor",3),r("germany","fighter",1)],ukraine:[r("germany","infantry",5),r("germany","armor",4),r("germany","fighter",1)],romania_bulgaria:[r("germany","infantry",4),r("germany","armor",2),r("germany","antiair",1)],southern_europe:[r("germany","infantry",4),r("germany","armor",1),r("germany","antiair",1),r("germany","fighter",1)],north_africa:[r("germany","infantry",3),r("germany","armor",4),r("germany","fighter",1)],united_kingdom:[r("uk","infantry",2),r("uk","antiair",1),r("uk","fighter",2),r("uk","bomber",1)],egypt:[r("uk","infantry",4),r("uk","armor",1),r("uk","fighter",1)],india:[r("uk","infantry",4),r("uk","armor",1),r("uk","fighter",1)],south_africa:[r("uk","infantry",1)],west_africa:[r("uk","infantry",1)],east_africa:[r("uk","infantry",1)],anglo_egypt_sudan:[r("uk","infantry",1)],trans_jordan:[r("uk","infantry",1)],persia:[r("uk","infantry",1)],australia:[r("uk","infantry",3),r("uk","fighter",1)],new_zealand:[r("uk","infantry",1)],new_guinea:[r("uk","infantry",1)],japan:[r("japan","infantry",3),r("japan","antiair",1),r("japan","fighter",3),r("japan","bomber",2)],manchuria:[r("japan","infantry",6),r("japan","armor",2)],korea:[r("japan","infantry",4)],french_indochina:[r("japan","infantry",4),r("japan","armor",1)],kwangtung:[r("japan","infantry",4),r("japan","armor",2)],kiangsu:[r("japan","infantry",3)],malaya:[r("japan","infantry",3)],borneo:[r("japan","infantry",3)],dutch_east_indies:[r("japan","infantry",4)],philippines:[r("japan","infantry",4)],solomon_islands:[r("japan","infantry",2)],eastern_us:[r("usa","infantry",5),r("usa","armor",1),r("usa","antiair",1),r("usa","fighter",2),r("usa","bomber",1)],central_us:[r("usa","infantry",3)],western_us:[r("usa","infantry",3),r("usa","armor",1),r("usa","fighter",2)],alaska:[r("usa","infantry",1)],hawaii:[r("usa","infantry",2),r("usa","fighter",2)],midway:[r("usa","infantry",1)],sz_5:[r("germany","cruiser",1),r("germany","submarine",1),r("ussr","destroyer",1)],sz_6:[r("uk","carrier",1),r("uk","fighter",1),r("uk","destroyer",1)],sz_7:[r("uk","transport",1),r("uk","destroyer",1)],sz_8:[r("germany","battleship",1),r("germany","cruiser",1),r("usa","transport",1)],sz_12:[r("uk","cruiser",1),r("uk","transport",1)],sz_14:[r("germany","submarine",1)],sz_15:[r("germany","submarine",1),r("uk","destroyer",1)],sz_19:[r("japan","battleship",1),r("japan","carrier",2),r("japan","fighter",3),r("japan","destroyer",1),r("japan","submarine",1)],sz_20:[r("uk","transport",2),r("uk","destroyer",2),r("uk","battleship",1)],sz_26:[r("usa","carrier",1),r("usa","fighter",1),r("usa","battleship",1),r("usa","destroyer",2),r("usa","submarine",1),r("usa","transport",2),r("usa","cruiser",1)],sz_36:[r("japan","destroyer",1),r("japan","transport",4),r("japan","battleship",1),r("japan","cruiser",1)],sz_37:[r("japan","destroyer",1),r("uk","destroyer",1),r("uk","transport",1)],sz_41:[r("japan","destroyer",2),r("japan","transport",2),r("japan","submarine",1)],sz_56:[r("usa","battleship",1),r("usa","destroyer",1)],sz_61:[r("japan","destroyer",1),r("japan","carrier",1),r("japan","fighter",1)],sz_10:[r("usa","carrier",1),r("usa","destroyer",1),r("usa","fighter",1)]}};window.__TERRITORIES=y;const M={ussr:"#7a1818",germany:"#3a5050",uk:"#6a4406",japan:"#9a6808",usa:"#1e4a1c",neutral:"#4a4830"},K={ussr:"#c02828",germany:"#6090a0",uk:"#c88018",japan:"#d0a020",usa:"#3a8030",neutral:"#7a7850"},J="#0e1e38",R=1400,B=780,Q={infantry:"I",artillery:"A",armor:"T",antiair:"AA",fighter:"F",bomber:"B",tactical_bomber:"TB",submarine:"S",destroyer:"D",cruiser:"C",carrier:"V",battleship:"W",transport:"P"};class tt{constructor(t,e){this.container=t,this.app=e,this.state=e.state,this.selectedId=null,this.validTargets=new Set,this.svg=null,this._pinching=!1,this._blobGroups={}}render(){this.svg?this._update():this._build()}setSelection(t,e=[]){this.selectedId=t,this.validTargets=new Set(e),this._updateSelections()}clearSelection(){this.selectedId=null,this.validTargets.clear(),this._updateSelections()}_build(){this.container.innerHTML=`<style>${et}</style>`;const t=document.createElement("div");t.className="map-wrap",this.container.appendChild(t);const e=document.createElementNS("http://www.w3.org/2000/svg","svg");e.setAttribute("viewBox",`0 0 ${R} ${B}`),e.setAttribute("class","map-svg"),this.svg=e,t.appendChild(e),this._buildDefs(e);const a=document.createElementNS("http://www.w3.org/2000/svg","rect");a.setAttribute("width",R),a.setAttribute("height",B),a.setAttribute("fill","url(#ocean-grad)"),e.appendChild(a),["neutral","ussr","germany","uk","japan","usa"].forEach(s=>{const i=document.createElementNS("http://www.w3.org/2000/svg","g");i.setAttribute("id",`blobs-${s}`),i.setAttribute("filter","url(#goo)"),e.appendChild(i),this._blobGroups[s]=i}),this._seaGroup=this._makeGroup(e,"sea-labels"),this._labelGroup=this._makeGroup(e,"terr-labels"),this._selGroup=this._makeGroup(e,"selections"),this._unitGroup=this._makeGroup(e,"unit-tokens"),this._hitGroup=this._makeGroup(e,"hit-targets"),this._drawSeaLabels(),this._drawStaticLabels(),this._drawHitTargets(),this._updateBlobs(),this._updateUnits(),this._updateSelections(),this._attachInteraction(t)}_makeGroup(t,e){const a=document.createElementNS("http://www.w3.org/2000/svg","g");return a.setAttribute("id",e),t.appendChild(a),a}_buildDefs(t){const e=document.createElementNS("http://www.w3.org/2000/svg","defs");e.innerHTML=`
      <radialGradient id="ocean-grad" cx="50%" cy="42%" r="60%">
        <stop offset="0%"   stop-color="#1a3452"/>
        <stop offset="100%" stop-color="#090e1c"/>
      </radialGradient>

      <!-- Goo/metaball filter — makes adjacent same-nation territory circles merge -->
      <filter id="goo" x="-25%" y="-25%" width="150%" height="150%"
              color-interpolation-filters="sRGB">
        <feGaussianBlur stdDeviation="20" result="blur"/>
        <feColorMatrix type="matrix" result="cm"
          values="1 0 0 0 0
                  0 1 0 0 0
                  0 0 1 0 0
                  0 0 0 26 -10"/>
      </filter>

      <!-- Subtle vignette over ocean -->
      <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
        <stop offset="60%"  stop-color="transparent"/>
        <stop offset="100%" stop-color="rgba(0,0,0,0.55)"/>
      </radialGradient>
    `,t.appendChild(e)}_blobR(t){return t.ipc===0?32:Math.max(36,Math.min(78,20+t.ipc*5))}_updateBlobs(){const t=this.state.ownership||{};Object.values(this._blobGroups).forEach(e=>{e.innerHTML=""}),Object.values(y).forEach(e=>{if(e.type==="sea")return;const a=t[e.id]||"neutral",s=this._blobGroups[a]||this._blobGroups.neutral;if(!s)return;const i=this._blobR(e),n=M[a]||M.neutral,c=document.createElementNS("http://www.w3.org/2000/svg","circle");c.setAttribute("cx",e.x),c.setAttribute("cy",e.y),c.setAttribute("r",i),c.setAttribute("fill",n),s.appendChild(c)})}_drawSeaLabels(){Object.values(y).forEach(t=>{if(t.type!=="sea")return;const e=t.id.replace("sz_",""),a=document.createElementNS("http://www.w3.org/2000/svg","text");a.setAttribute("x",t.x),a.setAttribute("y",t.y),a.setAttribute("text-anchor","middle"),a.setAttribute("dominant-baseline","middle"),a.setAttribute("font-size","10"),a.setAttribute("fill","#2a5272"),a.setAttribute("font-family","Arial, sans-serif"),a.setAttribute("font-weight","bold"),a.textContent=e,this._seaGroup.appendChild(a)})}_drawStaticLabels(){const t=new Set(Object.values(b).filter(e=>e.capital).map(e=>e.capital));Object.values(y).forEach(e=>{var i;if(e.type==="sea")return;const a=document.createElementNS("http://www.w3.org/2000/svg","g");if(a.setAttribute("data-lbl",e.id),e.ipc>0){const n=document.createElementNS("http://www.w3.org/2000/svg","text");n.setAttribute("x",e.x),n.setAttribute("y",e.y),n.setAttribute("text-anchor","middle"),n.setAttribute("dominant-baseline","middle"),n.setAttribute("font-size","12"),n.setAttribute("fill","#c0b880"),n.setAttribute("font-family","Arial, sans-serif"),n.setAttribute("font-weight","bold"),n.setAttribute("class","ipc-val"),n.textContent=e.ipc,a.appendChild(n)}if(t.has(e.id)){const n=document.createElementNS("http://www.w3.org/2000/svg","text");n.setAttribute("x",e.x),n.setAttribute("y",e.y-22),n.setAttribute("text-anchor","middle"),n.setAttribute("dominant-baseline","middle"),n.setAttribute("font-size","14"),n.setAttribute("fill","#e8c840"),n.setAttribute("pointer-events","none"),n.textContent="★",a.appendChild(n)}if((i=this.state.industrialComplexes)!=null&&i[e.id]){const n=document.createElementNS("http://www.w3.org/2000/svg","text");n.setAttribute("x",e.x+18),n.setAttribute("y",e.y-18),n.setAttribute("font-size","11"),n.setAttribute("class","ic-badge"),n.textContent="🏭",a.appendChild(n)}const s=document.createElementNS("http://www.w3.org/2000/svg","text");s.setAttribute("x",e.x),s.setAttribute("y",e.y+this._blobR(e)+8),s.setAttribute("text-anchor","middle"),s.setAttribute("dominant-baseline","hanging"),s.setAttribute("font-size","7"),s.setAttribute("fill","#8a8a6a"),s.setAttribute("font-family","Arial, sans-serif"),s.setAttribute("pointer-events","none"),s.textContent=e.name.length>13?e.name.slice(0,12)+"…":e.name,a.appendChild(s),this._labelGroup.appendChild(a)})}_drawHitTargets(){Object.values(y).forEach(t=>{const e=t.type==="sea"?18:this._blobR(t),a=document.createElementNS("http://www.w3.org/2000/svg","circle");a.setAttribute("cx",t.x),a.setAttribute("cy",t.y),a.setAttribute("r",e),a.setAttribute("fill","transparent"),a.setAttribute("data-id",t.id),a.setAttribute("class","hit-target"),a.addEventListener("click",s=>{s.stopPropagation(),this.app.onTerritoryClick(t.id)}),a.addEventListener("touchend",s=>{s.preventDefault(),s.stopPropagation(),this.app.onTerritoryClick(t.id)}),this._hitGroup.appendChild(a)})}_updateUnits(){this._unitGroup&&(this._unitGroup.innerHTML="",Object.values(y).forEach(t=>{const e=this.state.getUnits(t.id);if(e.length===0)return;const a={};e.forEach(d=>{a[d.nation]||(a[d.nation]={}),a[d.nation][d.type]=(a[d.nation][d.type]||0)+1});const s=[];Object.entries(a).forEach(([d,p])=>{Object.entries(p).forEach(([h,u])=>{s.push({nat:d,type:h,count:u})})});const i=4,n=s.slice(0,i),c=Math.min(s.length,i+(s.length>i?1:0))*22,l=t.x-c/2+11,o=t.y-(t.type==="sea"?10:16);if(n.forEach(({nat:d,type:p,count:h},u)=>{const f=l+u*22,v=K[d]||"#666",w=Q[p]||p.slice(0,2).toUpperCase();this._svgCircle(this._unitGroup,f,o,10,"#0c1018",v,"1.8");const x=document.createElementNS("http://www.w3.org/2000/svg","text");if(x.setAttribute("x",f),x.setAttribute("y",o+.5),x.setAttribute("text-anchor","middle"),x.setAttribute("dominant-baseline","middle"),x.setAttribute("font-size",w.length>1?"5":"7"),x.setAttribute("fill","#d8d0b0"),x.setAttribute("font-weight","bold"),x.setAttribute("font-family","Arial, sans-serif"),x.textContent=w,this._unitGroup.appendChild(x),h>1){const C=f+7,_=o-7;this._svgCircle(this._unitGroup,C,_,5,"#c02020","#0c1018","0.8");const g=document.createElementNS("http://www.w3.org/2000/svg","text");g.setAttribute("x",C),g.setAttribute("y",_+.5),g.setAttribute("text-anchor","middle"),g.setAttribute("dominant-baseline","middle"),g.setAttribute("font-size","5"),g.setAttribute("fill","#fff"),g.setAttribute("font-weight","bold"),g.textContent=h>9?"9+":h,this._unitGroup.appendChild(g)}}),s.length>i){const d=s.length-i,p=l+i*22;this._svgCircle(this._unitGroup,p,o,10,"#252518","#888","1");const h=document.createElementNS("http://www.w3.org/2000/svg","text");h.setAttribute("x",p),h.setAttribute("y",o+.5),h.setAttribute("text-anchor","middle"),h.setAttribute("dominant-baseline","middle"),h.setAttribute("font-size","6"),h.setAttribute("fill","#bbb"),h.textContent=`+${d}`,this._unitGroup.appendChild(h)}}),this._updateIpcVis())}_svgCircle(t,e,a,s,i,n,c){const l=document.createElementNS("http://www.w3.org/2000/svg","circle");return l.setAttribute("cx",e),l.setAttribute("cy",a),l.setAttribute("r",s),l.setAttribute("fill",i),l.setAttribute("stroke",n),l.setAttribute("stroke-width",c),t.appendChild(l),l}_updateSelections(){var e;if(!this._selGroup)return;if(this._selGroup.innerHTML="",this.selectedId){const a=y[this.selectedId];if(a){const s=this._blobR(a)+7,i=document.createElementNS("http://www.w3.org/2000/svg","circle");i.setAttribute("cx",a.x),i.setAttribute("cy",a.y),i.setAttribute("r",s),i.setAttribute("fill","none"),i.setAttribute("stroke","#ffffff"),i.setAttribute("stroke-width","2.5"),i.setAttribute("stroke-dasharray","6,3"),i.setAttribute("opacity","0.9"),this._selGroup.appendChild(i)}}this.validTargets.forEach(a=>{const s=y[a];if(!s)return;const i=this._blobR(s)+5,n=document.createElementNS("http://www.w3.org/2000/svg","circle");n.setAttribute("cx",s.x),n.setAttribute("cy",s.y),n.setAttribute("r",i),n.setAttribute("fill","rgba(40,255,80,0.12)"),n.setAttribute("stroke","#30e060"),n.setAttribute("stroke-width","2"),this._selGroup.appendChild(n)}),(((e=this.app.turnEngine)==null?void 0:e.pendingCombats)||[]).forEach(a=>{const s=y[a];if(!s)return;const i=this._blobR(s)+5,n=document.createElementNS("http://www.w3.org/2000/svg","circle");n.setAttribute("cx",s.x),n.setAttribute("cy",s.y),n.setAttribute("r",i),n.setAttribute("fill","rgba(255,40,40,0.1)"),n.setAttribute("stroke","#ff4040"),n.setAttribute("stroke-width","2.5"),n.setAttribute("stroke-dasharray","5,2"),this._selGroup.appendChild(n)})}_updateIpcVis(){Object.values(y).forEach(t=>{var i;if(t.type==="sea")return;const e=(i=this._labelGroup)==null?void 0:i.querySelector(`[data-lbl="${t.id}"]`);if(!e)return;const a=this.state.getUnits(t.id),s=e.querySelector(".ipc-val");s&&s.setAttribute("visibility",a.length>0?"hidden":"visible")})}_update(){this.svg&&(this._updateBlobs(),this._updateUnits(),this._updateSelections())}_attachInteraction(t){let e=!1,a=null,s=0,i=0,n=1;const c=this.svg,l=()=>{c.style.transform=`translate(${s}px,${i}px) scale(${n})`};t.addEventListener("touchstart",o=>{o.touches.length===1?(e=!0,a={x:o.touches[0].clientX-s,y:o.touches[0].clientY-i}):o.touches.length===2&&(e=!1,this._pinching=!0,this._pinchStart={dist:Math.hypot(o.touches[0].clientX-o.touches[1].clientX,o.touches[0].clientY-o.touches[1].clientY),scale:n})},{passive:!0}),t.addEventListener("touchmove",o=>{if(e&&o.touches.length===1)s=o.touches[0].clientX-a.x,i=o.touches[0].clientY-a.y,l();else if(this._pinching&&o.touches.length===2){const d=Math.hypot(o.touches[0].clientX-o.touches[1].clientX,o.touches[0].clientY-o.touches[1].clientY);n=Math.max(.4,Math.min(4,this._pinchStart.scale*(d/this._pinchStart.dist))),l()}},{passive:!0}),t.addEventListener("touchend",o=>{e=!1,o.touches.length<2&&(this._pinching=!1)},{passive:!0}),t.addEventListener("dblclick",()=>{s=0,i=0,n=1,l()})}}const et=`
  .map-wrap {
    width: 100%; height: 100%;
    overflow: hidden; position: relative;
    background: ${J};
  }
  .map-svg {
    width: 100%; height: 100%;
    display: block; transform-origin: top left;
  }
  .hit-target  { cursor: pointer; }
  .hit-target:hover { opacity: 0.01; }
`,at={setup:"SETUP",purchase:"PURCHASE",combat_move:"COMBAT MOVE",conduct_combat:"COMBAT",noncombat_move:"NON-COMBAT",place:"MOBILIZE",collect:"INCOME"},I=["germany","western_europe","southern_europe","japan","manchuria","russia","united_kingdom","eastern_us","india","australia"],G=9,st={ussr:"★",germany:"✚",uk:"⊕",japan:"✿",usa:"★"};class it{constructor(t,e){this.container=t,this.app=e,this.state=e.state,this._built=!1}render(){this._built||(this.container.innerHTML=`<style>${nt}</style><div id="hud" class="hud"></div>`,this._built=!0),this._update()}_countVCs(){const t=this.state.ownership||{};let e=0,a=0;return I.forEach(s=>{const i=b[t[s]];(i==null?void 0:i.side)==="axis"?e++:(i==null?void 0:i.side)==="allies"&&a++}),{axisVC:e,alliedVC:a}}_update(){const t=this.container.querySelector("#hud");if(!t)return;const e=this.state.currentNation,a=b[e],s=this.state.phase,i=this.state.round,n=this.state.ipc[e]||0,{axisVC:c,alliedVC:l}=this._countVCs(),o=this.state.ownership||{};t.innerHTML=`
      <!-- Round counter -->
      <div class="h-round">
        <div class="h-round-label">ROUND</div>
        <div class="h-round-num">${i}</div>
      </div>

      <!-- Nation turn-order icons -->
      <div class="h-nations">
        ${O.map(d=>{const p=b[d],h=d===e,u=this.state.ipc[d]||0,f=this.state.players[d]==="human";return`
            <div class="h-nat ${h?"active":""} ${p.side}"
                 title="${p.name}: ${u} IPC ${f?"(You)":"(AI)"}">
              <span class="h-nat-sym">${st[d]||p.flag}</span>
              ${h?'<div class="h-nat-pip"></div>':""}
            </div>`}).join("")}
      </div>

      <!-- Phase + current nation -->
      <div class="h-center">
        <div class="h-phase-name">${at[s]||s}</div>
        <div class="h-nation-lbl" style="color:${(a==null?void 0:a.color)||"#888"}">${(a==null?void 0:a.name)||e}</div>
      </div>

      <!-- Victory Cities tracker -->
      <div class="h-vc">
        <div class="h-vc-row">
          <span class="h-vc-count axis">AXIS ${c}/${G}</span>
          <div class="h-vc-bar">
            ${I.map(d=>{var h;return`<span class="h-vc-sq ${((h=b[o[d]])==null?void 0:h.side)||"neutral"}"></span>`}).join("")}
          </div>
          <span class="h-vc-count allies">ALLIES ${l}/${I.length-G+1}</span>
        </div>
        <div class="h-vc-label">VICTORY CITIES</div>
      </div>

      <!-- Current-nation IPC -->
      <div class="h-ipc">
        <div class="h-ipc-val">${n}</div>
        <div class="h-ipc-lbl">IPC</div>
      </div>
    `}}const nt=`
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
`,rt={infantry:"INF",artillery:"ART",armor:"ARM",antiair:"AA",fighter:"FTR",bomber:"BMB",tactical_bomber:"TAC",submarine:"SUB",destroyer:"DD",cruiser:"CA",carrier:"CV",battleship:"BB",transport:"TP",industrial_complex:"IC"},D={id:"industrial_complex",name:"Industrial Complex",cost:15,attack:0,defense:0,movement:0,type:"building",description:"Produces units each round. Build in captured territory with 3+ IPC."};class ot{constructor(t,e){this.container=t,this.app=e,this.state=e.state,this._el=null,this._tab="land"}show(){if(this._el){this._render();return}this._el=document.createElement("div"),this._el.innerHTML=`<style>${ct}</style><div class="pp-panel" id="pp-panel"></div>`,this.container.appendChild(this._el),this._render()}hide(){var t;(t=this._el)==null||t.remove(),this._el=null}_render(){var d,p,h;const t=(d=this._el)==null?void 0:d.querySelector("#pp-panel");if(!t)return;const e=this.state.currentNation,a=this.state.ipc[e]||0,s=this.state.pendingPlacements[e]||[],i=S(),n=s.reduce((u,f)=>{var v;return u+(((v=i[f])==null?void 0:v.cost)||D.cost||0)},0),c={};s.forEach(u=>{c[u]=(c[u]||0)+1});const l={land:[],sea:[],air:[],industry:[D]};Object.values(i).forEach(u=>{const f=u.type==="building"?"industry":u.type;l[f]&&l[f].push(u)});const o=l[this._tab]||[];t.innerHTML=`
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
        ${["land","sea","air","industry"].map(u=>`
          <button class="pp-tab ${this._tab===u?"active":""}" data-tab="${u}">
            ${u.toUpperCase()}
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
        ${o.map(u=>this._unitRow(u,a,c[u.id]||0)).join("")}
      </div>

      <div class="pp-footer">
        <div class="pp-spent-lbl">SPENT: <b>${n} IPC</b></div>
        <button class="pp-end" id="pp-end">END PHASE</button>
      </div>
    `,t.querySelectorAll(".pp-tab").forEach(u=>u.addEventListener("click",()=>{this._tab=u.dataset.tab,this._render()})),t.querySelectorAll(".pp-plus").forEach(u=>u.addEventListener("click",()=>{this.state.purchaseUnit(u.dataset.type,e),this._render()})),t.querySelectorAll(".pp-minus").forEach(u=>u.addEventListener("click",()=>{this.state.refundUnit(u.dataset.type,e),this._render()})),(p=t.querySelector("#pp-x"))==null||p.addEventListener("click",()=>this.hide()),(h=t.querySelector("#pp-end"))==null||h.addEventListener("click",()=>{this.hide(),this.app.turnEngine.advancePhase()})}_unitRow(t,e,a){const s=e>=t.cost,i=t.type==="building",n=t.attack===0&&(i||t.shootsAtAir)?"—":t.attack,c=t.defense===0&&i?"—":t.defense,l=t.movement===0&&i?"—":t.movement,o=rt[t.id]||t.id.slice(0,3).toUpperCase();return`
      <div class="pp-row ${!s&&a===0?"dim":""}">
        <div class="pp-unit-art">
          <div class="pp-art-circle" title="${t.description||""}">${o}</div>
          <span class="pp-unit-name">${t.name.toUpperCase()}</span>
        </div>
        <span class="pp-stat">${n}</span>
        <span class="pp-stat">${c}</span>
        <span class="pp-stat">${l}</span>
        <span class="pp-stat cost">${t.cost}</span>
        <div class="pp-buy">
          <button class="pp-minus" data-type="${t.id}" ${a===0?"disabled":""}>−</button>
          <span class="pp-qty ${a>0?"has":""}">${a}</span>
          <button class="pp-plus" data-type="${t.id}" ${s?"":"disabled"}>+</button>
        </div>
      </div>`}}const ct=`
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
`;class lt{constructor(t,e){this.container=t,this.app=e,this.state=e.state,this._el=null,this._tid=null,this._log=[],this._round=0,this._done=!1}show(t){this._tid=t,this._log=[],this._round=0,this._done=!1,this._el||(this._el=document.createElement("div"),this._el.className="combat-modal-wrap",this._el.innerHTML=`<style>${dt}</style><div class="combat-modal" id="combat-modal"></div>`,this.container.appendChild(this._el)),this._render()}hide(){var t;(t=this._el)==null||t.remove(),this._el=null}_render(){var p,h,u,f,v;const t=(p=this._el)==null?void 0:p.querySelector("#combat-modal");if(!t)return;const e=this._tid,a=y[e],s=this.state.currentNation,i=this.state.getUnits(e,s),n=this.state.getUnits(e).filter(w=>w.nation!==s),c=(h=n[0])==null?void 0:h.nation,l=b[c]||{flag:"🏳️",name:"Neutral",color:"#888"},o=b[s]||{};if(i.length===0||n.length===0){i.length>0&&n.length===0&&this.state.captureTerritory(e,s),this.hide(),this.app.turnEngine.advancePhase();return}const d=S();t.innerHTML=`
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
            ${this._renderUnitList(i,d)}
          </div>
        </div>

        <div class="cm-vs">⚔</div>

        <div class="cm-side defender">
          <div class="cm-side-label" style="color:${l.color}">
            ${l.flag} ${l.name} (AI)
          </div>
          <div class="cm-unit-list">
            ${this._renderUnitList(n,d)}
          </div>
        </div>
      </div>

      ${this._log.length>0?`
        <div class="cm-log">
          ${this._log.slice(-4).map(w=>`<div class="cm-log-line">${w}</div>`).join("")}
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
    `,(u=t.querySelector("#cm-roll"))==null||u.addEventListener("click",()=>this._doRound()),(f=t.querySelector("#cm-retreat"))==null||f.addEventListener("click",()=>this._doRetreat()),(v=t.querySelector("#cm-ok"))==null||v.addEventListener("click",()=>{var w;this.hide(),this.app.turnEngine.pendingCombats&&(this.app.turnEngine.pendingCombats=this.app.turnEngine.pendingCombats.filter(x=>x!==this._tid)),((w=this.app.turnEngine.pendingCombats)==null?void 0:w.length)===0&&this.app.turnEngine.advancePhase()})}_renderUnitList(t,e){const a=t.reduce((s,i)=>(s[i.type]=(s[i.type]||0)+1,s),{});return Object.entries(a).map(([s,i])=>{const n=e[s];return`<span class="cm-unit-chip">${(n==null?void 0:n.icon)||"?"} ×${i}</span>`}).join("")}_doRound(){var s,i;const t=this.state.currentNation,e=this.state.getUnits(this._tid,t),a=this.state.getUnits(this._tid).filter(n=>n.nation!==t);if(e.length===0||a.length===0){this._finishCombat(e.length>0?"attacker":"defender");return}try{const n=k.resolveCombatRound(e,a,this._round===0);this._round++,((i=(s=n.aaResults)==null?void 0:s.targets)==null?void 0:i.length)>0&&(n.aaResults.targets.forEach(u=>{this.state.units[this._tid]=this.state.units[this._tid].filter(f=>f.id!==u)}),this._log.push(`⚡ AA fire: ${n.aaResults.hits} aircraft shot down!`));const c=k.selectCasualties(this.state.getUnits(this._tid).filter(u=>u.nation!==t),n.attackerHits,!1);c.filter(u=>u.killed).forEach(u=>{this.state.units[this._tid]=this.state.units[this._tid].filter(f=>f.id!==u.unit.id)});const l=k.selectCasualties(this.state.getUnits(this._tid,t),n.defenderHits,!0);l.filter(u=>u.killed).forEach(u=>{this.state.units[this._tid]=this.state.units[this._tid].filter(f=>f.id!==u.unit.id)});const o=l.filter(u=>u.killed).length,d=c.filter(u=>u.killed).length;this._log.push(`Round ${this._round}: You hit ${n.attackerHits} 🎯 | They hit ${n.defenderHits} 💥 (${o} lost, ${d} enemy lost)`),this.state.autosave();const p=this.state.getUnits(this._tid,t),h=this.state.getUnits(this._tid).filter(u=>u.nation!==t);p.length===0?this._finishCombat("defender"):h.length===0?this._finishCombat("attacker"):this._render()}catch(n){console.error("[CombatModal] round error:",n),this._log.push("⚠ Error in combat round. Try again."),this._render()}}_doRetreat(){var i;const t=this.state.currentNation,e=this.state.getUnits(this._tid,t),a=y[this._tid],s=a==null?void 0:a.adjacent.find(n=>{var l,o;const c=this.state.ownership[n];return c===t||((l=b[c])==null?void 0:l.side)===((o=b[t])==null?void 0:o.side)});s&&e.length>0&&(this.state.moveUnits(e.map(n=>n.id),this._tid,s),this._log.push(`Retreated to ${((i=y[s])==null?void 0:i.name)||s}`)),this._doneMsg="↩ Retreat successful.",this._done=!0,this._render()}_finishCombat(t){var a,s;const e=this.state.currentNation;t==="attacker"?(this.state.captureTerritory(this._tid,e),this._doneMsg=`✅ ${(a=y[this._tid])==null?void 0:a.name} captured!`):this._doneMsg=`❌ Attack repelled — ${(s=y[this._tid])==null?void 0:s.name} holds.`,this._done=!0,this._render()}}const dt=`
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
`;class pt{constructor(t){this.container=t,this.state=new E,this.ai=new X(this.state),this.turnEngine=new F(this.state,this.ai),this.map=null,this.hud=null,this.purchasePanel=null,this.combatModal=null,this.selectedTerritory=null,this.movingUnits=[],this.validTargets=[]}init(){this._buildShell(),E.hasSave()?this._showResumeScreen():this._showSetupScreen()}_buildShell(){this.container.innerHTML=`
      <style>${ut}</style>
      <div id="game-wrap" style="display:none;width:100%;height:100%;flex-direction:column;">
        <div id="hud-root"></div>
        <div id="map-root" style="flex:1;overflow:hidden;position:relative;"></div>
      </div>
      <div id="overlay-root"></div>
    `}_showResumeScreen(){const t=E.getSaveInfo(),a=new Date(t.timestamp).toLocaleString(),s=b[t.nation];this._showOverlay(`
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
    `),document.getElementById("btn-resume").addEventListener("click",()=>{this._resumeGame()}),document.getElementById("btn-new").addEventListener("click",()=>{E.clearSave(),this._showSetupScreen()})}_showSetupScreen(){const t={ussr:{sym:"★",label:"SOVIET UNION",side:"allies",color:"#c02828"},germany:{sym:"✚",label:"GERMANY",side:"axis",color:"#6090a0"},uk:{sym:"⊕",label:"U.K.",side:"allies",color:"#c88018"},japan:{sym:"✿",label:"JAPAN",side:"axis",color:"#d0a020"},usa:{sym:"★",label:"U.S.A.",side:"allies",color:"#3a8030"}};this._showOverlay(`
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
    `);const e=new Set;let a="normal";document.querySelectorAll(".ns-type-btn").forEach(s=>{s.addEventListener("click",()=>{const i=s.dataset.nation,n=s.dataset.type;document.querySelectorAll(`.ns-type-btn[data-nation="${i}"]`).forEach(c=>{c.classList.toggle("active",c.dataset.type===n)}),n==="human"?e.add(i):e.delete(i)})}),document.querySelectorAll(".ns-diff-btn").forEach(s=>{s.addEventListener("click",()=>{document.querySelectorAll(".ns-diff-btn").forEach(i=>i.classList.remove("active")),s.classList.add("active"),a=s.dataset.diff})}),document.getElementById("btn-start").addEventListener("click",()=>{e.size===0&&(e.add("ussr"),e.add("uk"),e.add("usa")),this._startNewGame([...e],a)})}_startNewGame(t,e){O.forEach(a=>{this.state.players[a]=t.includes(a)?"human":"ai"}),this.ai.difficulty=e,this.state.loadScenario(W),this._launchGame()}_resumeGame(){if(!this.state.loadSave()){this._showSetupScreen();return}this._launchGame()}_launchGame(){this._hideOverlay();const t=document.getElementById("game-wrap");t.style.display="flex",this.hud=new it(document.getElementById("hud-root"),this),this.map=new tt(document.getElementById("map-root"),this),this.purchasePanel=new ot(document.getElementById("overlay-root"),this),this.combatModal=new lt(document.getElementById("overlay-root"),this),this._buildPhaseBar(),this._wireEvents(),this.hud.render(),this.map.render(),this.state.phase==="setup"?this.turnEngine.startGame():this.state._emit("phase_changed",{phase:this.state.phase,nation:this.state.currentNation,round:this.state.round})}_buildPhaseBar(){var e,a;(e=document.getElementById("float-controls"))==null||e.remove();const t=document.createElement("div");t.id="float-controls",t.innerHTML=`
      <style>${ht}</style>
      <!-- Round END PHASE button bottom-right -->
      <button class="float-end-btn" id="btn-end-phase">
        <span>END</span><span>PHASE</span>
      </button>
      <!-- Research button (shown only during purchase) -->
      <button class="float-research-btn" id="btn-research" style="display:none">🔬</button>
      <!-- Phase hint bottom-center -->
      <div class="float-hint" id="phase-hint"></div>
      <!-- AI thinking banner -->
    `,document.body.appendChild(t),document.getElementById("btn-end-phase").addEventListener("click",()=>this._handleEndPhase()),(a=document.getElementById("btn-research"))==null||a.addEventListener("click",()=>this._showTechPanel())}_handleEndPhase(){this.selectedTerritory=null,this.movingUnits=[],this.validTargets=[],this.map.clearSelection(),this.turnEngine.advancePhase()}_wireEvents(){const t=e=>{try{this.selectedTerritory=null,this.movingUnits=[],this.validTargets=[],this.hud.render(),this.map.render(),this._updatePhaseHint(e.phase);const a=this.state.players[this.state.currentNation]==="human";e.phase==="purchase"&&a?this.purchasePanel.show():this.purchasePanel.hide(),this._setAIIndicator(!a);const s=document.getElementById("btn-research");s&&(s.style.display="none");const i=document.getElementById("btn-end-phase");if(i){const n=e.phase==="purchase"&&a;i.style.display=n?"none":"flex",i.disabled=!a,i.style.opacity=a?"1":"0.4"}}catch(a){console.error("[App] phase_changed handler:",a)}};this.state.on("phase_changed",t),this.turnEngine.on("phase_changed",t),this.state.on("territory_captured",()=>{try{this.map.render(),this.hud.render()}catch{}}),this.state.on("units_moved",()=>{try{this.map.render()}catch{}}),this.state.on("unit_placed",()=>{try{this.map.render()}catch{}}),this.state.on("income_collected",()=>{try{this.hud.render()}catch{}}),this.state.on("tech_researched",e=>{try{this._toast(`🔬 ${e.nation} researched a new technology!`),this.hud.render()}catch{}}),this.state.on("game_over",e=>{try{this._showVictoryScreen(e.winner)}catch{}}),this.turnEngine.on("combat_needed",e=>{try{this.state.players[this.state.currentNation]==="human"&&this.combatModal.show(e.territoryId)}catch{}})}_setAIIndicator(t){let e=document.getElementById("ai-thinking");t?e||(e=document.createElement("div"),e.id="ai-thinking",e.style.cssText="position:fixed;top:52px;left:50%;transform:translateX(-50%);background:#1a2a3a;border:1px solid #2a5a8a;border-radius:0 0 8px 8px;padding:4px 16px;font-size:0.75rem;color:#6ad4ff;z-index:100;pointer-events:none;",e.textContent="🤖 AI is thinking…",document.body.appendChild(e)):e==null||e.remove()}_updatePhaseHint(t){const e={purchase:"Buy units — they will be placed at end of turn.",combat_move:"Tap your units, then tap a territory to attack or move.",conduct_combat:"Tap a battle to resolve it.",noncombat_move:"Move remaining units to friendly territories.",place:"Place newly purchased units on industrial territories.",collect:"Collecting income…"},a=document.getElementById("phase-hint");a&&(a.textContent=e[t]||"")}onTerritoryClick(t){try{const e=this.state.phase,a=this.state.currentNation;if(!(this.state.players[a]==="human")){this._showTerritoryDetail(t);return}e==="combat_move"||e==="noncombat_move"?this._handleMoveClick(t,e):e==="conduct_combat"?(this.turnEngine.pendingCombats||[]).includes(t)?this.combatModal.show(t):this._showTerritoryDetail(t):e==="place"?this._handlePlaceClick(t):this._showTerritoryDetail(t)}catch(e){console.error("[App] onTerritoryClick:",e)}}_showTerritoryDetail(t){U(async()=>{const{TerritoryDetail:e}=await import("./TerritoryDetail-QJBU3T6S.js");return{TerritoryDetail:e}},[]).then(({TerritoryDetail:e})=>{new e(document.getElementById("overlay-root"),this).show(t)}).catch(()=>{})}_handleMoveClick(t,e){const a=this.state.currentNation;if(this.movingUnits.length===0){const s=this.state.getUnits(t,a).filter(i=>!i.moved);if(s.length===0)return;this.selectedTerritory=t,this.movingUnits=s.map(i=>i.id),this.validTargets=this._getValidTargets(t,s,e),this.map.setSelection(t,this.validTargets)}else this.validTargets.includes(t)&&this.state.moveUnits(this.movingUnits,this.selectedTerritory,t),this.selectedTerritory=null,this.movingUnits=[],this.validTargets=[],this.map.clearSelection()}_getValidTargets(t,e,a){var s;try{const{MoveValidator:i}=window.__validators||{},n=(s=window.__TERRITORIES)==null?void 0:s[t];return(n==null?void 0:n.adjacent)||[]}catch{return[]}}_handlePlaceClick(t){const e=this.state.currentNation,a=this.state.pendingPlacements[e];if(a.length===0)return;if(!(this.state.industrialComplexes[t]===e)){this._toast("Units must be placed at industrial complexes.");return}this.state.placeUnit(a[0],e,t)}_showTechPanel(){U(async()=>{const{TechPanel:t}=await import("./TechPanel-CXOoHD8a.js");return{TechPanel:t}},[]).then(({TechPanel:t})=>{new t(document.getElementById("overlay-root"),this).show()}).catch(t=>console.error("[App] TechPanel load failed:",t))}_showVictoryScreen(t){E.clearSave();const e=t==="allies"?"🤝 ALLIES VICTORY!":"🎯 AXIS VICTORY!";this._showOverlay(`
      <div class="screen-card victory">
        <h1>${e}</h1>
        <p>The ${t} have conquered enough capitals to win the war.</p>
        <button class="btn btn-primary" onclick="location.reload()">Play Again</button>
      </div>
    `)}_showOverlay(t){const e=document.getElementById("overlay-root");e.innerHTML=`<div class="screen-overlay">${t}</div>`}_hideOverlay(){const e=document.getElementById("overlay-root").querySelector(".screen-overlay");e&&e.remove()}_toast(t,e=2500){const a=document.createElement("div");a.className="toast",a.textContent=t,document.body.appendChild(a),requestAnimationFrame(()=>a.classList.add("show")),setTimeout(()=>{a.classList.remove("show"),setTimeout(()=>a.remove(),300)},e)}}const ut=`
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
`,ht=`
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
`;"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/sw.js").catch(m=>{console.warn("[SW] Registration failed:",m)})});window.addEventListener("DOMContentLoaded",()=>{try{const m=new pt(document.getElementById("app"));m.init(),window.__aa=m}catch(m){console.error("[Boot] Fatal error:",m),document.getElementById("loading").innerHTML=`
      <h1 style="color:#cc3333">⚠ Error</h1>
      <p style="color:#d4c9a8;max-width:400px;text-align:center">${m.message}</p>
      <button onclick="location.reload()" style="margin-top:20px;padding:12px 24px;background:#c8a040;border:none;border-radius:6px;font-size:1rem;cursor:pointer">Reload</button>
    `}});export{b as N,y as T,S as g};
