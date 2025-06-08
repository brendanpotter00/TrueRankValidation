export interface Park {
  id: string;
  name: string;
  state: string;
  established: number;
  imageUrl: string;
}

export const parks: Park[] = [
  {
    id: "acad",
    name: "Acadia",
    state: "Maine",
    established: 1916,
    imageUrl:
      "https://i.pinimg.com/736x/6f/78/53/6f7853368797f938744875684f40beb8.jpg",
  },
  {
    id: "arch",
    name: "Arches",
    state: "Utah",
    established: 1971,
    imageUrl:
      "https://i.pinimg.com/736x/0e/88/a7/0e88a778fedf9153acff06e38aac7a53.jpg",
  },
  {
    id: "badl",
    name: "Badlands",
    state: "South Dakota",
    established: 1978,
    imageUrl:
      "https://i.pinimg.com/736x/9f/b2/55/9fb255e5729199ffc534a1f7b8d33002.jpg",
  },
  {
    id: "bibe",
    name: "Big Bend",
    state: "Texas",
    established: 1944,
    imageUrl:
      "https://i.pinimg.com/736x/3a/a8/9f/3aa89f4aca73d1256004175d0ab7ac60.jpg",
  },
  {
    id: "bisc",
    name: "Biscayne",
    state: "Florida",
    established: 1980,
    imageUrl:
      "https://i.pinimg.com/736x/ef/ca/93/efca9389cbc10a8fe063db6ca7df4b78.jpg",
  },
  {
    id: "blca",
    name: "Black Canyon of the Gunnison",
    state: "Colorado",
    established: 1999,
    imageUrl:
      "https://i.pinimg.com/736x/11/09/dd/1109dd78ef86ac6ef52c8be2b9a11b9a.jpg",
  },
  {
    id: "brca",
    name: "Bryce Canyon",
    state: "Utah",
    established: 1928,
    imageUrl:
      "https://i.pinimg.com/736x/88/7c/45/887c45273666491b66aa480540b25f8f.jpg",
  },
  {
    id: "cany",
    name: "Canyonlands",
    state: "Utah",
    established: 1964,
    imageUrl:
      "https://i.pinimg.com/736x/32/5b/a3/325ba3b70f5a6cbccbba06442306c69e.jpg",
  },
  {
    id: "care",
    name: "Capitol Reef",
    state: "Utah",
    established: 1971,
    imageUrl:
      "https://i.pinimg.com/736x/b7/f7/78/b7f7786e7d35a67ba7c2582ca33e6b66.jpg",
  },
  {
    id: "cave",
    name: "Carlsbad Caverns",
    state: "New Mexico",
    established: 1930,
    imageUrl:
      "https://i.pinimg.com/736x/99/36/38/9936382f7137e257dfb21105778afab8.jpg",
  },
  {
    id: "chis",
    name: "Channel Islands",
    state: "California",
    established: 1980,
    imageUrl:
      "https://i.pinimg.com/736x/9d/18/72/9d1872d0be76d94d32d53e741ee52b0e.jpg",
  },
  {
    id: "cong",
    name: "Congaree",
    state: "South Carolina",
    established: 2003,
    imageUrl:
      "https://i.pinimg.com/736x/c5/7a/9a/c57a9abdfd3b728bd498b36637648b35.jpg",
  },
  {
    id: "crla",
    name: "Crater Lake",
    state: "Oregon",
    established: 1902,
    imageUrl:
      "https://i.pinimg.com/736x/ac/db/bf/acdbbf5e103b91fc559796aac8c19807.jpg",
  },
  {
    id: "cuva",
    name: "Cuyahoga Valley",
    state: "Ohio",
    established: 2000,
    imageUrl:
      "https://i.pinimg.com/736x/59/ba/e4/59bae4b5a927df20b971ead8c2ba3920.jpg",
  },
  {
    id: "deva",
    name: "Death Valley",
    state: "California",
    established: 1994,
    imageUrl:
      "https://i.pinimg.com/736x/fd/2d/47/fd2d47fd014cffd4a4616677c7cb046a.jpg",
  },
  {
    id: "dena",
    name: "Denali",
    state: "Alaska",
    established: 1917,
    imageUrl:
      "https://i.pinimg.com/736x/58/92/b5/5892b5113e688aaa2febb76399b5141a.jpg",
  },
  {
    id: "drto",
    name: "Dry Tortugas",
    state: "Florida",
    established: 1992,
    imageUrl:
      "https://i.pinimg.com/736x/71/74/cd/7174cdaa6d8b67391815131c7ca9951f.jpg",
  },
  {
    id: "ever",
    name: "Everglades",
    state: "Florida",
    established: 1934,
    imageUrl:
      "https://i.pinimg.com/736x/02/d3/a2/02d3a248383995be75032462d1381a4e.jpg",
  },
  {
    id: "gaar",
    name: "Gates of the Arctic",
    state: "Alaska",
    established: 1980,
    imageUrl:
      "https://i.pinimg.com/736x/f3/f8/39/f3f8393da90fad7106473e4626e56549.jpg",
  },
  {
    id: "jeff",
    name: "Gateway Arch",
    state: "Missouri",
    established: 2018,
    imageUrl:
      "https://i.pinimg.com/736x/cb/99/1b/cb991b618c6eb8d57ddec09e9db3070d.jpg",
  },
  {
    id: "glac",
    name: "Glacier",
    state: "Montana",
    established: 1910,
    imageUrl:
      "https://i.pinimg.com/736x/d7/ad/ec/d7adec273588311d2d808ecda29312b6.jpg",
  },
  {
    id: "glba",
    name: "Glacier Bay",
    state: "Alaska",
    established: 1980,
    imageUrl:
      "https://i.pinimg.com/736x/ba/9c/80/ba9c8016ae92942b2461dc8cb97236cc.jpg",
  },
  {
    id: "grca",
    name: "Grand Canyon",
    state: "Arizona",
    established: 1919,
    imageUrl:
      "https://i.pinimg.com/736x/3b/11/0c/3b110cbdfe4b1738520c0f8cc8264c81.jpg",
  },
  {
    id: "grte",
    name: "Grand Teton",
    state: "Wyoming",
    established: 1929,
    imageUrl:
      "https://i.pinimg.com/736x/3a/72/e3/3a72e3f29bee8915e27461b75e7bda6c.jpg",
  },
  {
    id: "grba",
    name: "Great Basin",
    state: "Nevada",
    established: 1986,
    imageUrl:
      "https://i.pinimg.com/736x/5d/c4/4a/5dc44aa475c0f7f485afde884003c7a2.jpg",
  },
  {
    id: "grpo",
    name: "Great Sand Dunes",
    state: "Colorado",
    established: 2004,
    imageUrl:
      "https://i.pinimg.com/736x/6f/3e/41/6f3e411079cfc690ca5184aa8bc68ffd.jpg",
  },
  {
    id: "grsm",
    name: "Great Smoky Mountains",
    state: "Tennessee",
    established: 1934,
    imageUrl:
      "https://i.pinimg.com/736x/f4/be/3f/f4be3f435c3c8a2b91a2dcda91629b43.jpg",
  },
  {
    id: "gumo",
    name: "Guadalupe Mountains",
    state: "Texas",
    established: 1966,
    imageUrl: "",
  },
  {
    id: "hale",
    name: "Haleakalā",
    state: "Hawaii",
    established: 1916,
    imageUrl: "",
  },
  {
    id: "havo",
    name: "Hawai'i Volcanoes",
    state: "Hawaii",
    established: 1916,
    imageUrl: "",
  },
  {
    id: "hosp",
    name: "Hot Springs",
    state: "Arkansas",
    established: 1921,
    imageUrl: "",
  },
  {
    id: "indu",
    name: "Indiana Dunes",
    state: "Indiana",
    established: 2019,
    imageUrl: "",
  },
  {
    id: "isro",
    name: "Isle Royale",
    state: "Michigan",
    established: 1940,
    imageUrl: "",
  },
  {
    id: "josh",
    name: "Joshua Tree",
    state: "California",
    established: 1994,
    imageUrl: "",
  },
  {
    id: "katm",
    name: "Katmai",
    state: "Alaska",
    established: 1980,
    imageUrl: "",
  },
  {
    id: "kefj",
    name: "Kenai Fjords",
    state: "Alaska",
    established: 1980,
    imageUrl: "",
  },
  {
    id: "king",
    name: "Kings Canyon",
    state: "California",
    established: 1980,
    imageUrl:
      "https://i.pinimg.com/736x/b6/3c/70/b63c70f020a4677f82bc3916a9c1fbcc.jpg",
  },
  {
    id: "kova",
    name: "Kobuk Valley",
    state: "Alaska",
    established: 1980,
    imageUrl: "",
  },
  {
    id: "lacl",
    name: "Lake Clark",
    state: "Alaska",
    established: 1980,
    imageUrl: "",
  },
  {
    id: "lavo",
    name: "Lassen Volcanic",
    state: "California",
    established: 1916,
    imageUrl: "",
  },
  {
    id: "maca",
    name: "Mammoth Cave",
    state: "Kentucky",
    established: 1941,
    imageUrl: "",
  },
  {
    id: "meve",
    name: "Mesa Verde",
    state: "Colorado",
    established: 1906,
    imageUrl: "",
  },
  {
    id: "mora",
    name: "Mount Rainier",
    state: "Washington",
    established: 1899,
    imageUrl:
      "https://i.pinimg.com/736x/5a/2c/79/5a2c79f5e343f97be58da08be758bcd1.jpg",
  },
  {
    id: "npsa",
    name: "National Park of American Samoa",
    state: "American Samoa",
    established: 1988,
    imageUrl: "",
  },
  {
    id: "noca",
    name: "North Cascades",
    state: "Washington",
    established: 1968,
    imageUrl: "",
  },
  {
    id: "olym",
    name: "Olympic",
    state: "Washington",
    established: 1938,
    imageUrl:
      "https://i.pinimg.com/736x/2e/f7/04/2ef70417f087a655412da143eb8226ec.jpg",
  },
  {
    id: "pefo",
    name: "Petrified Forest",
    state: "Arizona",
    established: 1962,
    imageUrl:
      "https://i.pinimg.com/736x/d4/76/a1/d476a1ed9ec53901f8ec7650aabc9415.jpg",
  },
  {
    id: "pinn",
    name: "Pinnacles",
    state: "California",
    established: 2013,
    imageUrl: "",
  },
  {
    id: "redw",
    name: "Redwood",
    state: "California",
    established: 1968,
    imageUrl:
      "https://i.pinimg.com/736x/ac/ef/40/acef406f61bb79320c3d409b253961d1.jpg",
  },
  {
    id: "romo",
    name: "Rocky Mountain",
    state: "Colorado",
    established: 1915,
    imageUrl:
      "https://i.pinimg.com/736x/89/d7/fd/89d7fd1189c78d809dc2d6d570d2ddab.jpg",
  },
  {
    id: "sagu",
    name: "Saguaro",
    state: "Arizona",
    established: 1994,
    imageUrl:
      "https://i.pinimg.com/736x/01/5c/6f/015c6f8b9fe62c90a09a8f18a0e0d10a.jpg",
  },
  {
    id: "seki",
    name: "Sequoia",
    state: "California",
    established: 1890,
    imageUrl:
      "https://i.pinimg.com/736x/1e/f7/83/1ef783003b1155782ac88f5573fe358d.jpg",
  },
  {
    id: "shen",
    name: "Shenandoah",
    state: "Virginia",
    established: 1935,
    imageUrl: "",
  },
  {
    id: "thro",
    name: "Theodore Roosevelt",
    state: "North Dakota",
    established: 1978,
    imageUrl:
      "https://i.pinimg.com/736x/41/5d/3d/415d3d945a9c935d90dc860add72808c.jpg",
  },
  {
    id: "viis",
    name: "Virgin Islands",
    state: "U.S. Virgin Islands",
    established: 1956,
    imageUrl: "",
  },
  {
    id: "voya",
    name: "Voyageurs",
    state: "Minnesota",
    established: 1975,
    imageUrl: "",
  },
  {
    id: "whsa",
    name: "White Sands",
    state: "New Mexico",
    established: 2019,
    imageUrl: "",
  },
  {
    id: "wica",
    name: "Wind Cave",
    state: "South Dakota",
    established: 1903,
    imageUrl: "",
  },
  {
    id: "wrst",
    name: "Wrangell-St. Elias",
    state: "Alaska",
    established: 1980,
    imageUrl: "",
  },
  {
    id: "yell",
    name: "Yellowstone",
    state: "Wyoming",
    established: 1872,
    imageUrl:
      "https://i.pinimg.com/736x/68/9c/fe/689cfe951da82bce6d597e10a0c330d9.jpg",
  },
  {
    id: "yose",
    name: "Yosemite",
    state: "California",
    established: 1890,
    imageUrl:
      "https://i.pinimg.com/736x/db/1a/71/db1a71c5c4ffac4b21b26bf88faf07c9.jpg",
  },
  {
    id: "zion",
    name: "Zion",
    state: "Utah",
    established: 1919,
    imageUrl:
      "https://i.pinimg.com/736x/72/46/eb/7246eb8a20d49f94adfa0b11be7778d9.jpg",
  },
];
