export type ViewType = 'INSTITUTIONAL' | 'RETAIL';

export interface PackData {
  id: string;
  name: string;
  quickStats: {
    scale: string;
    typology: string;
    plotBuilt: string;
    basePrice: string;
  };
  theEdge: string[];
  institutionalData: {
    title: string;
    points: string[];
  };
  retailData: {
    title: string;
    points: string[];
  };
  killScreen: {
    title: string;
    competitorWeakness: string;
    amgAdvantage: string;
  };
}

export interface NodeData {
  id: string;
  name: string;
  zoneData: string;
  coordinates: { x: number; y: number }; // Percentages for absolute positioning on the map
  lng: number;
  lat: number;
  packs: PackData[];
}

export const nodes: NodeData[] = [
  {
    id: 'node-1',
    name: 'Route de Fes',
    zoneData: 'Zone Data: 600-1,200 MAD/m². Approaching 2030 stadium infrastructure. ZTR zoning allows automatic VNA clearance.',
    coordinates: { x: 65, y: 30 },
    lng: -7.9300,
    lat: 31.6500,
    packs: [
      {
        id: 'pack-1a',
        name: 'The HSR Chic Hub',
        quickStats: {
          scale: '15 Units',
          typology: 'Chic Contemporary',
          plotBuilt: '500m² Plot / 200m² Built',
          basePrice: '5,600,000 MAD'
        },
        theEdge: [
          'Automatic VNA clearance via existing lotissements. Bypasses AD-HOC committee entirely.',
          'Pure 2030 World Cup speculative capture.'
        ],
        institutionalData: {
          title: 'Investment Appeal',
          points: [
            'Transacts in 60-90 days (Peak Velocity).',
            'Rapid deployment of Dubai SPV funds to catch the high-speed rail speculative wave.',
            'Highly liquid.'
          ]
        },
        retailData: {
          title: 'Retail Appeal',
          points: [
            'Hyper-optimized, lock-and-leave smart homes.',
            'Targeted at global digital nomads wanting immediate access to the new rail hub and Al Maaden golf.'
          ]
        },
        killScreen: {
          title: 'AMG vs. Generic Speculators',
          competitorWeakness: 'Others build dense townhouses to maximize GDV.',
          amgAdvantage: 'AMG maintains a strict 500m² private plot minimum, commanding peak nightly rental rates.'
        }
      },
      {
        id: 'pack-1b',
        name: 'The Amelkis-Adjacent Reserve',
        quickStats: {
          scale: '10 Units',
          typology: 'Luxury Neo-Beldi',
          plotBuilt: '900m² Plot / 350m² Built',
          basePrice: '12,000,000 MAD'
        },
        theEdge: [
          'Alpha-generation via neighbor pricing.',
          'Captures Amelkis prestige with a fraction of the OPEX.'
        ],
        institutionalData: {
          title: 'Investment Appeal',
          points: [
            'Generates massive absolute profit per unit.',
            'Operates on a lean 2,000 MAD/month syndic fee.',
            'Preserving a 10%+ net yield for SPV shareholders.'
          ]
        },
        retailData: {
          title: 'Retail Appeal',
          points: [
            'Sprawling 4-suite estates with dedicated staff quarters and authentic tadelakt finishes.',
            'The legacy golf lifestyle without the 100-unit mega-resort congestion.'
          ]
        },
        killScreen: {
          title: 'AMG vs. Legacy Golf Estates',
          competitorWeakness: 'Older estates suffer from massive water/utility OPEX.',
          amgAdvantage: 'AMG\'s RTCM+ thermal compliance and greywater recycling make it a zero-liability asset.'
        }
      }
    ]
  },
  {
    id: 'node-2',
    name: "Route d'Amizmiz",
    zoneData: 'Zone Data: 400-900 MAD/m². Premium eco-tourism and golf corridor. Massive land arbitrage available.',
    coordinates: { x: 35, y: 70 },
    lng: -8.0800,
    lat: 31.5600,
    packs: [
      {
        id: 'pack-2a',
        name: 'The Agafay Chic Engine',
        quickStats: {
          scale: '15 Units',
          typology: 'Chic Contemporary',
          plotBuilt: '500m² Plot / 200m² Built',
          basePrice: '5,500,000 MAD'
        },
        theEdge: [
          'The ultimate short-term rental cash cow.',
          'Low raw land costs drive developer margins past 35%.'
        ],
        institutionalData: {
          title: 'Investment Appeal',
          points: [
            'High margin arbitrage. Rapid turnover.',
            'The perfect asset block to syndicate to Gulf investors seeking high-yield Airbnb returns.'
          ]
        },
        retailData: {
          title: 'Retail Appeal',
          points: [
            'Bali-inspired contemporary design with sunken lounges and fire pits.',
            'The perfect exotic 4-suite vacation rental near the Agafay desert.'
          ]
        },
        killScreen: {
          title: 'AMG vs. Signature Luxury Villas',
          competitorWeakness: 'Signature scaled Phase 3 to 76 units, losing exclusivity.',
          amgAdvantage: 'AMG caps at 15 units, delivering actual "no vis-a-vis" privacy.'
        }
      },
      {
        id: 'pack-2b',
        name: 'The Eco-Beldi Arbitrage',
        quickStats: {
          scale: '12 Units',
          typology: 'Luxury Neo-Beldi',
          plotBuilt: '1,200m² Plot / 350m² Built',
          basePrice: '14,000,000 MAD'
        },
        theEdge: [
          'Captures the institutional ESG mandate.',
          'Qualifies for massive Law 03-22 state subsidies.'
        ],
        institutionalData: {
          title: 'Investment Appeal',
          points: [
            'ESG-compliant.',
            'Full solar integration and water recycling drop OPEX to near-zero, ensuring long-term yield preservation.'
          ]
        },
        retailData: {
          title: 'Retail Appeal',
          points: [
            'Authentic, raw Atlas stone architecture.',
            'Passive thermal massing naturally cools interiors by 5-7°C. A true zero-impact sanctuary.'
          ]
        },
        killScreen: {
          title: 'AMG vs. Taïb Immobilier (MB5)',
          competitorWeakness: 'Taïb relies on expensive, heavily amenitized footprints that risk service charge bloat.',
          amgAdvantage: 'AMG provides lean, military-grade perimeter security, mathematically outperforming on net yield.'
        }
      }
    ]
  },
  {
    id: 'node-3',
    name: "Route d'Ourika",
    zoneData: 'Zone Data: 800-1,800 MAD/m². The historical trophy corridor. Strict VNA friction requires strategic plot selection.',
    coordinates: { x: 55, y: 80 },
    lng: -7.9500,
    lat: 31.5200,
    packs: [
      {
        id: 'pack-3',
        name: 'The Atlas Trophy Estate',
        quickStats: {
          scale: '10 Units',
          typology: 'Luxury Prestige',
          plotBuilt: '900m² Plot / 350m² Built',
          basePrice: '15,000,000 MAD'
        },
        theEdge: [
          'Guaranteed, unbuildable panoramic Atlas views drive an empirical 15-25% valuation premium.'
        ],
        institutionalData: {
          title: 'Investment Appeal',
          points: [
            'Highly elastic price ceiling.',
            'Heavy-load trafficable rooftops directly monetize the mountain view.',
            'Designed for yield-agnostic legacy wealth parking.'
          ]
        },
        retailData: {
          title: 'Retail Appeal',
          points: [
            'Gravity-defying 15-meter column-free spans.',
            'Wall-to-wall Schüco structural glazing seamlessly blends the living room with the snow-capped High Atlas.'
          ]
        },
        killScreen: {
          title: 'AMG vs. M Square & Samba Hills',
          competitorWeakness: 'M Square built a claustrophobic 100-unit subdivision. Samba Hills is overpriced (>31k MAD/m²).',
          amgAdvantage: 'AMG strikes the perfect 4:1 ratio sweet spot.'
        }
      }
    ]
  },
  {
    id: 'node-4',
    name: 'Zone Chrifia',
    zoneData: 'Zone Data: 1,500-2,500 MAD/m². High density, airport proximity, rapid transition zone.',
    coordinates: { x: 45, y: 55 },
    lng: -8.0200,
    lat: 31.5800,
    packs: [
      {
        id: 'pack-4',
        name: 'The Cosmopolitan Chic Node',
        quickStats: {
          scale: '14 Units',
          typology: 'Chic Contemporary',
          plotBuilt: '500m² Plot / 200m² Built',
          basePrice: '6,000,000 MAD'
        },
        theEdge: [
          'Peak liquidity.',
          'Airport proximity and Almazar mall adjacency capture the hyper-lucrative digital nomad demographic.'
        ],
        institutionalData: {
          title: 'Investment Appeal',
          points: [
            'Ideal for UAE funds looking for rapid 60-90 day deployment-to-sale cycles.',
            'High underlying land value ensures strong downside protection.'
          ]
        },
        retailData: {
          title: 'Retail Appeal',
          points: [
            '5-star urban convenience.',
            'Immediate city access paired with the silence of a heavily secured, low-density gated envelope.'
          ]
        },
        killScreen: {
          title: 'AMG vs. Density Creep',
          competitorWeakness: 'Competitors resort to connected townhouses to offset 2,000 MAD/m² land costs.',
          amgAdvantage: 'AMG absorbs the cost, remaining the only true private villa compound in the immediate airport radius.'
        }
      }
    ]
  },
  {
    id: 'node-5',
    name: 'Route de Tameslouht',
    zoneData: 'Zone Data: 300-600 MAD/m². Deep agricultural, slower infrastructure, massive land availability.',
    coordinates: { x: 25, y: 85 },
    lng: -8.1100,
    lat: 31.5000,
    packs: [
      {
        id: 'pack-5',
        name: 'The Wellness Eco-Lodge Compound',
        quickStats: {
          scale: '12 Units',
          typology: 'Luxury Low-Impact Beldi',
          plotBuilt: '1,500m² Plot / 250m² Built',
          basePrice: '8,500,000 MAD'
        },
        theEdge: [
          'The long-term land bank play.',
          'Acquiring 2 hectares at under 500 MAD/m² minimizes upfront capital risk.'
        ],
        institutionalData: {
          title: 'Investment Appeal',
          points: [
            'Establishing a monopoly foothold in the next major development corridor.',
            'Off-grid capable infrastructure lowers reliance on municipal grids.'
          ]
        },
        retailData: {
          title: 'Retail Appeal',
          points: [
            'A holistic retreat.',
            'Expansive 1,500m² organic garden plots, yoga pavilions, and authentic rural tranquility.'
          ]
        },
        killScreen: {
          title: 'AMG vs. First-Mover Monopoly',
          competitorWeakness: 'Major competitors ignore Tameslouht.',
          amgAdvantage: 'AMG deploys self-sustaining RTCM+ technology to capture the European eco-tourism demographic completely unchallenged.'
        }
      }
    ]
  }
];
