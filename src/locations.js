/** KISEKI's four physical-world story environments. IDs remain stable so
 * existing bookmarked interactions, save data and train-state tests work. */
export const LOCATIONS = [
  {
    id:'kyoto',number:'03',city:'ARASHIYAMA',jp:'嵐山',district:'RANDEN · SAGANO BAMBOO GROVE · KATSURA RIVER',section:'My Journey',
    title:'Where the journey becomes meaningful.',
    description:'Walk past the Randen station, tea houses, the Katsura river and Sagano bamboo grove to discover my career story through interactive places.',
    panel:'Exploration is a way to tell a story.',
    detail:'I am Devin Eldrian Wijaya. My journey combines curiosity about technology, visual interfaces and the confidence built through software quality assurance.',
    points:['E-Claim · Interface and frontend work','Treasury QA · Reliability in complex workflows','My approach · Curiosity and quality'],
    accent:'#c7aa77'
  },
  {
    id:'tokyo',number:'01',city:'AKIHABARA',jp:'秋葉原',district:'ELECTRIC TOWN · ARCADE · TECHNOLOGY',section:'Skills',
    title:'Curiosity connects everything.',
    description:'An electric night district with layered Japanese signs, neon storefronts, gaming and electronics culture. My curiosity about technology begins here.',
    panel:'Skills · Where ideas meet craft',
    detail:'Explore how software testing, frontend work, SQL, Python and careful validation connect to my professional experience. Signs and businesses are original fictional designs.',
    points:['Functional and regression testing','Frontend interface improvements','SQL, Python and collaborative delivery'],
    accent:'#ed6788'
  },
  {
    id:'hakone',number:'02',city:'SHIBUYA',jp:'渋谷',district:'SCRAMBLE CROSSING · CENTER GAI · PEOPLE',section:'Projects',
    title:'Ideas come alive through people.',
    description:'An atmospheric urban crossing with moving crowds, luminous screens and the spirit of Tokyo. Every project is about a real experience.',
    panel:'Projects & experiments',
    detail:'Professional work includes frontend improvements for E-Claim and functional validation. No confidential employer screenshots or internal banking data are shown.',
    points:['E-Claim UI and frontend improvements','Test scenarios and bug verification','Technical experimentation through KISEKI'],
    accent:'#8daefa'
  },
  {
    id:'kamakura',number:'04',city:'KYOTO',jp:'京都',district:'GION · MACHIYA · HERITAGE STREETS',section:'Experience',
    title:'Build with care. Move with purpose.',
    description:'Traditional Kyoto reveals the human side of craft: weathered wood, warm lanterns, stone lanes and a respect for how things are made.',
    panel:'Experience · Craft and responsibility',
    detail:'My experience includes IT Quality Assurance for Treasury systems, involving the testing of business workflows and end-to-end validation, described only at a safe public level.',
    points:['Quality assurance and regression testing','Integration/UAT and documented evidence','Based in Indonesia · Open to meaningful conversations'],
    accent:'#e9a36d'
  }
]
export const locationById=id=>LOCATIONS.find(x=>x.id===id)||LOCATIONS[0]
export const nextLocation=id=>LOCATIONS[(LOCATIONS.findIndex(x=>x.id===id)+1)%LOCATIONS.length]
