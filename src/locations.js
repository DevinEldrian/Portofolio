/** Actual destination identities. No fake Hakone/Kamakura internal region IDs. */
export const LOCATIONS=Object.freeze([
  {
    id:'akihabara',number:'01',city:'AKIHABARA',jp:'秋葉原',district:'ELECTRIC TOWN EXIT · CHUO-DORI · ARCADES',section:'Skills',
    title:'Curiosity connects everything.',
    description:'An electric district with electronics shops, animated pedestrian streets, arcade storefronts and fictional neon advertising.',
    panel:'Skills · Engineering with curiosity',
    detail:'Technology only works when it is understandable, useful and reliable. My experience spans frontend interfaces, test-case design, functional testing, SQL, Python and coordinated software delivery.',
    points:['Frontend UI improvements for E-Claim','Functional and regression testing','SQL, Python and QA methodology'],
    accent:'#e889a4'
  },
  {
    id:'shibuya',number:'02',city:'SHIBUYA',jp:'渋谷',district:'STATION · HACHIKO SIDE · SCRAMBLE CROSSING',section:'Projects',
    title:'Build experiences for people.',
    description:'A recognizable Shibuya scramble crossing with diagonal stripes, pedestrians, traffic rhythm, giant display façades and fashion streets.',
    panel:'Projects · Real experiences, reliable delivery',
    detail:'Explore my project approach through publicly shareable outcomes and methodologies. No bank client systems or confidential employer materials are recreated.',
    points:['E-Claim UI and interface enhancements','Test planning, defect documentation and regression verification','Immersive 3D portfolio development'],
    accent:'#8dbbdf'
  },
  {
    id:'arashiyama',number:'03',city:'ARASHIYAMA',jp:'嵐山',district:'RANDEN · NAGATSUJI-DORI · TOGETSUKYO · SAGANO',section:'Journey',
    title:'A career is a journey.',
    description:'Begin at Randen Arashiyama, explore active shop streets, walk beside the Katsura River and reach the Sagano Bamboo Grove.',
    panel:'My journey · People, systems and purpose',
    detail:'My professional work connects frontend craft to quality assurance. Discover verified CV narratives through in-world information points along the Arashiyama route.',
    points:['E-Claim · Frontend and testing','Treasury QA · Functional and integration validation','Reflection · Curiosity, quality and continuous learning'],
    accent:'#c9b487'
  },
  {
    id:'kyoto',number:'04',city:'KYOTO',jp:'京都',district:'GION · MACHIYA STREETS · YASAKA PAGODA',section:'Experience',
    title:'Build with care. Move with purpose.',
    description:'Traditional Kyoto: wooden machiya houses, glowing lanterns, stone lanes, pitched ceramic-tile roofs and cultural craft.',
    panel:'Experience · Care and accountability',
    detail:'My experience includes quality assurance for Treasury business processes, functional testing, regression and user acceptance testing. Only public high-level descriptions are included.',
    points:['Treasury QA and cross-system validation','Test design and evidence-based defect reporting','Continuous improvement and communication'],
    accent:'#e3a784'
  }
])
export const locationById=id=>LOCATIONS.find(p=>p.id===id)||LOCATIONS[0]
export const nextLocation=id=>LOCATIONS[(LOCATIONS.findIndex(p=>p.id===id)+1)%LOCATIONS.length]
