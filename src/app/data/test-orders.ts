import { Address } from "../model/address";
import { AddressDto } from "../model/address-dto";
import { AddressInstruction } from "../model/address-instruction";
import { Contact } from "../model/contact";
import { DeliveryHistoryItem } from "../model/delivery-history-item";
import { Order } from "../model/order";
import { OrderDto } from "../model/order-dto"
import { Package } from "../model/package";

let orders: Order[] = [];

const address: Address[] = [{
  id: 1,
  fullAddress: "Calle Fresnillo 1236, Villa Aurora, 85154 Cd Obregón Sonora",
  latitude: 27.476384442957702,
  longitude: -109.96744362284186
}, {
  id: 2,
  street: "Fresnillo",
  number: "1236",
  betweenStreets: "Compostela y Anáhuac",
  suburb: "Villa Aurora",
  city: "Ciudad Obregón",
  state: "Sonora",
  zip: 85154,
  country: "México",
  indications: "Enseguida de casa con reja azul",
  latitude: 27.476384442957702,
  longitude: -109.96744362284186
}, {
  id: 3,
  street: "Guerrero",
  number: "1806",
  betweenStreets: "Cocobi y Toapa",
  suburb: "Infonavit Yukujimari",
  city: "Ciudad Obregón",
  state: "Sonora",
  zip: 85120,
  country: "México",
  indications: "Hay un local de una estética",
  latitude: 27.493996725705582,
  longitude: -109.95783394127278
}, {
  id: 4,
  fullAddress: "Calle Guerrero 1806, Infonavit Yukujimari, 85120 Cd Obregón Sonora",
  latitude: 27.493996725705582,
  longitude: -109.95783394127278
}, {
  id: 5,
  fullAddress: "Calle Michoacán 417, Morelos, 85110 Cd Obregón, Son.",
  latitude: 27.503159134504582,
  longitude: -109.95340823675087
}, {
  id: 6,
  fullAddress: "Flavio Bórquez 2150, Prados de la Laguna, Cd Obregón, Son.",
  latitude: 27.480614242956626,
  longitude: -109.96660767629292
}, {
  id: 7,
  fullAddress: "Bretaña 1907, Fraccionamiento Torre de París, Cd Obregón, Son.",
  latitude: 27.47505808892123,
  longitude: -109.96232484293019
}, {
  id: 8,
  street: "Av. Enramada",
  number: "624",
  betweenStreets: "De la luna y Loma azul",
  suburb: "Casa Blanca",
  city: "Ciudad Obregón",
  state: "Sonora",
  zip: 85134,
  country: "México",
  latitude: 27.488512106277305, 
  longitude: -109.98619694331903
}, {
  id: 9,
  street: "Miguel Guerrero",
  number: "739A",
  suburb: "Nuevo Cajeme",
  city: "Cd Obregón",
  state: "Sonora",
  zip: 85050,
  country: "México",
  latitude: 27.510098525468266,
  longitude: -109.92615077617862
}, {
  id: 10,
  fullAddress: "Calle Privada Palma Areca 328 Palma Real, 85190 Cd Obregón, Sonora",
  latitude: 27.45594290068994,
  longitude: -109.94257184262565
}];

for (let i = 0; i < address.length; i++) {
  const a = address[i];
  if (!a.fullAddress) {
    a.fullAddress = `${a.street} ${a.number}, ${a.suburb}, ${a.zip} ${a.city} ${a.state}`;
  }
}

function getRandomLatitude(): number {
  const p5 = Math.pow(10,5);
  const p10 = Math.pow(10,10);
  const a = Math.trunc((Math.floor(Math.random() * 9617 + 43667) / p5) * p5);
  const b = Math.trunc((Math.floor(Math.random() * 623278317 + 8715845527) / p10) * p10);
  return parseFloat(`27.${a}${b}`);
}

function getRandomLongitude(): number {
  const p5 = Math.pow(10,5);
  const p7 = Math.pow(10,7);
  const a = Math.trunc((Math.floor(Math.random() * 10608 + 89213) / p5) * p5);
  const b = Math.trunc((Math.floor(Math.random() * 147321 + 4249496) / p7) * p7);
  return parseFloat(`-109.${a}${b}`);
}

const street_names = [
  "Hermenegildo Galeana", "Blvd. Rodolfo Elías Calles", "Av. Jesús García", "Calle Vicente Guerrero",
  "Calle Ignacio Allende", "Av. 6 de Abril", "Av. Nainari", "Calle Cajeme", "Calle Norte", "Calle Cananea",
  "Blvd. Ignacio Ramírez", "Av. Rodolfo Félix Váldes", "Calle Ejercito Nacional", "Calle Blvd. C.T.M.", 
  "Calle Manuel de Jesús Clouthier", "Francisco Eusebio Kino", "Calle París", "Calle Michoacán", "Calle California",
  "Calle Tabasco", "Calle Coahuila", "Av. Miguel Aleman", "Calle Jalisco", "Calle Sufragio Efectivo", "Blvd. Las Torres"
];

const neiborhood_names = [
  "Santa Fe", "Real del Sol", "Matías Méndez", "Beltrones", "Puente Real", "Nuevo Cajeme", "Cincuentenario",
  "Morelos", "Los Misioneros", "Yukujimari", "Cumuripa", "Centro", "Benito Juárez", "Parque Industrial", 
  "Villas del Nainari", "Prados del Tepeyac", "Campestre", "Sochiloa", "Miravalle", "Municipio Libre",
  "Faustino Félix", "Robles del Castillo", "Primero de Mayo", "Aves del Castillo", "Valle Verde", "Valle Dorado"
];

function getRandomStreetName(): string {
  const i = Math.floor(Math.random() * street_names.length);
  return street_names[i];
}

function getRandomNeiborhoodName(): string {
  const i = Math.floor(Math.random() * neiborhood_names.length);
  return neiborhood_names[i];
}

function createRandomAddress(): Address {
  const id = address.length;
  const a = {
    id,
    fullAddress: `${getRandomStreetName()} ${getRandomNumber(4)}, ${getRandomNeiborhoodName()}, 85${getRandomNumber(3)} Cd Obregón, Sonora`,
    latitude: getRandomLatitude(),
    longitude: getRandomLongitude()
  };
  // console.log({address: a});
  // address.push(a);
  return a;
}

const names: string[] = [
  "José", "María", "Jesús", "Eduardo", "Leonardo",
  "Martín", "Fernanda", "Rosa", "Alejandro",
  "Sofia", "Adolfo", "Lorena", "Ricardo"
];

function getRandomFirstName(): string {
  const i = Math.floor(Math.random() * names.length);
  return names[i];
}

const last_names: string[] = [
  "López", "Martínez", "Aguirre", "Gonzalez", "Hernández",
  "Jímenez", "Sánchez", "Fernández", "Apodaca", "Rivera",
  "Ibarra", "Torres", "Nuñez", "Domínguez", "Urías", "Quiñonez"
];

function getRandomLastName(): string {
  const i = Math.floor(Math.random() * last_names.length);
  return last_names[i];
}

function getRandomName(): string {
  return `${getRandomFirstName()} ${getRandomLastName()} ${getRandomLastName()}`;
}

function getRandomNumber(l?: number): number {
  if (l && l < 11) {
    l = Math.pow(10, l);
  } else {
    l = 10000000000;
  }
  return Math.floor(Math.random() * l);
}

function getRandomPhone(): string {
  const i = Math.floor(Math.random() * 7);
  let p: string;
  switch (i) {
    case 0: 
      p = `644 ${getRandomNumber(3)} ${getRandomNumber(4)}`;
      break;
    case 1:
      p = `644${getRandomNumber(3)}${getRandomNumber(4)}`;
      break;
    case 2:
      p = `644 ${getRandomNumber(3)}${getRandomNumber(4)}`;
      break;
    case 3:
      p = `644-${getRandomNumber(3)}-${getRandomNumber(4)}`;
      break;
    case 4: 
      p = `64 4${getRandomNumber(1)} ${getRandomNumber(2)} ${getRandomNumber(2)} ${getRandomNumber(2)}`;
      break;
    case 5:
      p = `64-4${getRandomNumber(1)}-${getRandomNumber(2)}-${getRandomNumber(2)}-${getRandomNumber(2)}`;
      break;
  }
  return p;
}

function getRandomEmail(): string {
  const i = Math.floor(Math.random() * 7);
  let e: string;
  switch (i) {
    case 0: 
      e = `${getRandomFirstName().toLocaleLowerCase()}.${getRandomLastName().toLocaleLowerCase()}@gmail.com`;
      break;
    case 1:
      e = `${getRandomFirstName().toLocaleLowerCase()}.${getRandomLastName().toLocaleLowerCase()}@hotmail.com`;
      break;
    case 2:
      e = `${getRandomFirstName().toLocaleLowerCase()}.${getRandomLastName().toLocaleLowerCase()}@outlook.com`;
      break;
  }
  return e;
}

function getRandomContact(): Contact {
  return {
    name: getRandomName(),
    email: getRandomEmail(),
    phone: getRandomPhone()
  }
}

function getRandomAddressInstruction(): AddressInstruction {
  return {
    description: "",
    contact: getRandomContact()
  };
}

let counter = 0;

function getRandomAddress(): Address {
  const i = Math.floor(Math.random() * address.length);
  return address[i];
}

function getRandomServiceType(): string {
  const types = ["ON_DEMAND", "SAME_DAY", "NEXT_DAY"];
  const i = Math.floor(Math.random() * types.length);
  return types[i];
}

function getRandomDeliveryStatus(): string {
  const status = ["QUEUED", "IN_ORDER", "COLLECTED", "READY_TO_STORAGE", "READY_TO_DELIVERY", "TO_STORAGE", "VISIT_DONE", "VISIT_CANCELED", "VISIT_SUSPENDED", "RETURNED"];
  const i = Math.floor(Math.random() * status.length);
  return status[i];
}

function getRandomPackageSize(): string {
  const sizes = ["ENVELOP", "SMALL", "MEDIUM", "LARGE"];
  const i = Math.floor(Math.random() * sizes.length);
  return sizes[i];
}

function getRandomPackageLengthUnit(): string {
  const units = ["CM", "M", "INCH", "FT"];
  const i = Math.floor(Math.random() * units.length);
  return units[i];
}

function getRandomPackageWeightUnit(): string {
  const units = ["GR", "KGR", "OZ"];
  const i = Math.floor(Math.random() * units.length);
  return units[i];
}

function getRandomPackage(): Package {
  return {
    size: getRandomPackageSize(),
    description: "",
    dimension: {
      height: getRandomNumber(2),
      width: getRandomNumber(2),
      length: getRandomNumber(2),
      longitudeUnit: getRandomPackageLengthUnit()
    },
    weight: {
      weight: getRandomNumber(3),
      weightUnit: getRandomPackageWeightUnit()
    },
    content: ""
  };
}

function getRandomPackages(): Package[] {
  const l = Math.floor(Math.random() * 4);
  const packages = [];
  for(let i = 0; i < l; i++) {
    packages.push(getRandomPackage());
  }
  return packages;
}

function getRandomLog(): DeliveryHistoryItem {
  return {
    previousStatus: getRandomDeliveryStatus(),
    currentStatus: getRandomDeliveryStatus(),
    date: new Date("2021-01-12T16:51:11.352Z").toString(),
    notes: ""
  }
}

function getRandomDeliveryLog(): DeliveryHistoryItem[] {
  const l = Math.floor(Math.random() * 10);
  const logs = [];
  for(let i = 0; i < l; i++) {
    logs.push(getRandomLog());
  }
  return logs;
}

function getRandomOrder(): Order {
  return {
    id: ++counter,
    createdAt: new Date("2021-01-12T16:51:11.352Z").toString(),
    sourceAddress: createRandomAddress(),
    sourceAddressInstruction: getRandomAddressInstruction(),
    destinationAddress: getRandomAddress(),
    destinationAddressInstruction: getRandomAddressInstruction(),
    serviceType: getRandomServiceType(),
    deliveryStatus: getRandomDeliveryStatus(),
    distance: getRandomNumber(2),
    estimatedDeliveryTime: getRandomNumber(3),
    packages: getRandomPackages(),
    customerContact: getRandomContact(),
    deliveryLog: getRandomDeliveryLog()
  };
}

function address2dto(a: Address): AddressDto {
  return {
    id: a.id,
    fullAddress: a.fullAddress,
    latitude: a.latitude,
    longitude: a.longitude
  };
}

let lastOrderAt = 0;

function getAllOrders(): OrderDto[] {
  let now: number = Date.now();
  if (now - lastOrderAt >= 30*1000) {
    const max = Math.floor(Math.random() * 3);
    for (let i = 0; i < max; i++) {
      orders.push(getRandomOrder());
      lastOrderAt = now;
    }
  }
  return orders.map(o => {
    return {
      id: o.id,
      createdAt: o.createdAt,
      sourceAddress: address2dto(o.sourceAddress),
      destinationAddress: address2dto(o.destinationAddress),
      serviceType: o.serviceType,
      deliveryStatus: o.deliveryStatus,
      distance: o.distance,
      estimatedDeliveryTime: o.estimatedDeliveryTime
    };
  });
}

function getOrderById(id: number): Order {
  return orders.find((o => o.id === id));
}

export {
  getAllOrders, getOrderById
};
