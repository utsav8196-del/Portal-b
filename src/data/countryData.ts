export interface CountryData {
  id: number;
  countryName: string;
  currency: string;
  description: string;
  flag: string;
  image: string;
  status: boolean;
  showOnHomepage: boolean;
  createdAt: string;
  updatedAt: string;
}

export const mockCountries: CountryData[] = [
  {
    id: 1,
    countryName: 'United States',
    currency: 'USD',
    description: 'A federal republic composed of 50 states, a federal district, and various territories.',
    countryImage: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    flagImage: 'https://images.unsplash.com/photo-1603755082364-63495bb09638?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    showOnHomePage: true,
    status: true
  },
  {
    id: 2,
    countryName: 'United Kingdom',
    currency: 'GBP',
    description: 'A sovereign country in north-western Europe, off the north-western coast of the European mainland.',
    countryImage: 'https://images.unsplash.com/photo-1543799382-9a7f8f117b35?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    flagImage: 'https://images.unsplash.com/photo-1544276302-ad1a4feb1047?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    showOnHomePage: true,
    status: true
  },
  {
    id: 3,
    countryName: 'Canada',
    currency: 'CAD',
    description: 'A country in North America with provinces and territories extending from the Atlantic to the Pacific and northward into the Arctic Ocean.',
    countryImage: 'https://images.unsplash.com/photo-1513236726212-6bdd8868a320?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    flagImage: 'https://images.unsplash.com/photo-1599203322338-916fa2be328a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    showOnHomePage: true
  },
  {
    id: 4,
    countryName: 'Germany',
    currency: 'EUR',
    description: 'A country in Central Europe with a landscape of forests, rivers, mountain ranges, and the North Sea beaches.',
    countryImage: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    flagImage: 'https://images.unsplash.com/photo-1527866512907-a435703c59ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    showOnHomePage: false,
    status: true
  },
  {
    id: 5,
    countryName: 'Australia',
    currency: 'AUD',
    description: 'A sovereign country comprising the mainland of the Australian continent, the island of Tasmania, and numerous smaller islands.',
    countryImage: 'https://images.unsplash.com/photo-1530816616332-c2a6b8d8d979?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    flagImage: 'https://images.unsplash.com/photo-1589401885921-79cb18741ff7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    showOnHomePage: true
  },
  {
    id: 6,
    countryName: 'Japan',
    currency: 'JPY',
    description: 'An island country in East Asia located in the northwest Pacific Ocean, to the east of China, Korea, and Russia.',
    countryImage: 'https://images.unsplash.com/photo-1492571350019-22de08371fd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    flagImage: 'https://images.unsplash.com/photo-1534644605370-aaa21c2d2c02?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    showOnHomePage: false,
    status: true
  },
  {
    id: 7,
    countryName: 'France',
    currency: 'EUR',
    description: 'A transcontinental country spanning Western Europe and several overseas regions and territories.',
    countryImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    flagImage: 'https://images.unsplash.com/photo-1552653868-3c1e3e3c8663?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    showOnHomePage: true
  },
  {
    id: 8,
    countryName: 'Italy',
    currency: 'EUR',
    description: 'A European country consisting of a peninsula delimited by the Alps and several islands.',
    countryImage: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    flagImage: 'https://images.unsplash.com/photo-1612553683906-0e18e5fc4366?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    showOnHomePage: false
  },
  {
    id: 9,
    countryName: 'Spain',
    currency: 'EUR',
    description: 'A country in Southwestern Europe with territories across the Strait of Gibraltar and the Atlantic Ocean.',
    countryImage: 'https://images.unsplash.com/photo-1543785734-4b6e564642f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    flagImage: 'https://images.unsplash.com/photo-1456131656238-5e85b0f83be2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    showOnHomePage: false
  },
  {
    id: 10,
    countryName: 'Brazil',
    currency: 'BRL',
    description: 'The largest country in both South America and Latin America, known for its Amazon rainforest and festive culture.',
    countryImage: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    flagImage: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    showOnHomePage: true
  },
  {
    id: 11,
    countryName: 'India',
    currency: 'INR',
    description: 'A country in South Asia with diverse geography, including the Himalayan mountain range and the Thar Desert.',
    countryImage: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    flagImage: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    showOnHomePage: true
  },
  {
    id: 12,
    countryName: 'China',
    currency: 'CNY',
    description: 'A sovereign state in East Asia and the world\'s most populous country with a population of around 1.4 billion.',
    countryImage: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    flagImage: 'https://images.unsplash.com/photo-1508810301179-d8bf4a1a8641?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    showOnHomePage: false
  },
  {
    id: 13,
    countryName: 'South Korea',
    currency: 'KRW',
    description: 'A country in East Asia, constituting the southern part of the Korean Peninsula sharing a land border with North Korea.',
    countryImage: 'https://images.unsplash.com/photo-1538485399081-7c1cd2f578f5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    flagImage: 'https://images.unsplash.com/photo-1473145710954-9fa7e58dfa2e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    showOnHomePage: false
  },
  {
    id: 14,
    countryName: 'Sweden',
    currency: 'SEK',
    description: 'A Scandinavian nation with thousands of coastal islands and inland lakes, along with boreal forests and glaciated mountains.',
    countryImage: 'https://images.unsplash.com/photo-1518730518541-d0843268c287?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    flagImage: 'https://images.unsplash.com/photo-1529240876892-7afa2b64c142?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    showOnHomePage: false
  },
  {
    id: 15,
    countryName: 'Singapore',
    currency: 'SGD',
    description: 'A sovereign island city-state in maritime Southeast Asia, known for its tropical climate and multicultural population.',
    countryImage: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    flagImage: 'https://images.unsplash.com/photo-1565967523271-0b2258cc6e92?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    showOnHomePage: true
  }
];
