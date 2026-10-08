export const LOCATIONS = [
  {
    id:'kyoto',number:'01',city:'KYOTO · ARASHIYAMA',jp:'嵐山',district:'ARASHIYAMA / RANDEN · KATSURA · SAGANO',section:'About',
    title:'Where my story begins.',description:'Begin at Randen Arashiyama Station. Follow Kyoto shops, the Katsura River, Togetsukyo Bridge and the Sagano bamboo path to discover my professional journey.',
    panel:'A different way to introduce myself',detail:'I’m Devin Eldrian Wijaya. Explore the landscape to learn how technology, quality assurance, and immersive experiences connect in my work.',
    points:['Based in Jakarta, Indonesia','Quality-minded by design','Interested in interactive technology'],accent:'#ed8b74'
  },
  {
    id:'tokyo',number:'02',city:'TOKYO',jp:'東京',district:'SHIBUYA / AKIHABARA — DIFFERENT TOKYO DISTRICTS',section:'Projects',
    title:'Ideas in motion.',description:'The city of prototypes and experiments. A space for the things I build and the challenges I love to solve.',
    panel:'Selected projects & experiments',detail:'This destination is a showcase for verified case studies, technical prototypes, and interactive builds. More projects will be added here.',
    points:['Web engineering explorations','Interactive 3D experiences','Project details coming soon'],accent:'#b1bafa'
  },
  {
    id:'hakone',number:'03',city:'HAKONE',jp:'箱根',district:'GORA / MOUNTAIN RAILWAY',section:'Experience',
    title:'The journey so far.',description:'Further into the mountains, discover the systems I have tested and the professional experiences that shape my approach.',
    panel:'Quality assurance · Treasury systems',detail:'My experience includes IT quality assurance for banking Treasury workflows, with system testing involving Murex and SWIFT.',
    points:['Functional & regression testing','Integration testing and UAT','End-to-end transaction validation'],accent:'#add5b5'
  },
  {
    id:'kamakura',number:'04',city:'KAMAKURA',jp:'鎌倉',district:'SHICHIRIGAHAMA / COASTAL LINE',section:'Contact',
    title:'Let’s cross paths.',description:'Some journeys are best made together. If an idea or opportunity brings you here, I’d love to connect.',
    panel:'Start a conversation',detail:'Interested in quality engineering, immersive technology, or collaborating on the next experience? Find me on GitHub.',
    points:['Open to meaningful connections','Based in Indonesia','Explore my GitHub profile'],accent:'#ecc593'
  }
]
export const locationById = id => LOCATIONS.find(x=>x.id===id) || LOCATIONS[0]
export const nextLocation = id => LOCATIONS[(LOCATIONS.findIndex(x=>x.id===id)+1)%LOCATIONS.length]
