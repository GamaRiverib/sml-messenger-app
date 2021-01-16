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
  Id: 1,
  FullAddress: "Calle Fresnillo 1236, Villa Aurora, 85154 Cd Obregón Sonora",
  Latitude: 27.476384442957702,
  Longitude: -109.96744362284186
}, {
  Id: 2,
  Street: "Fresnillo",
  Number: "1236",
  BetweenStreets: "Compostela y Anáhuac",
  Suburb: "Villa Aurora",
  City: "Ciudad Obregón",
  State: "Sonora",
  Zip: 85154,
  Country: "México",
  Indications: "Enseguida de casa con reja azul",
  Latitude: 27.476384442957702,
  Longitude: -109.96744362284186
}, {
  Id: 3,
  Street: "Guerrero",
  Number: "1806",
  BetweenStreets: "Cocobi y Toapa",
  Suburb: "Infonavit Yukujimari",
  City: "Ciudad Obregón",
  State: "Sonora",
  Zip: 85120,
  Country: "México",
  Indications: "Hay un local de una estética",
  Latitude: 27.493996725705582,
  Longitude: -109.95783394127278
}, {
  Id: 4,
  FullAddress: "Calle Guerrero 1806, Infonavit Yukujimari, 85120 Cd Obregón Sonora",
  Latitude: 27.493996725705582,
  Longitude: -109.95783394127278
}, {
  Id: 5,
  FullAddress: "Calle Michoacán 417, Morelos, 85110 Cd Obregón, Son.",
  Latitude: 27.503159134504582,
  Longitude: -109.95340823675087
}, {
  Id: 6,
  FullAddress: "Flavio Bórquez 2150, Prados de la Laguna, Cd Obregón, Son.",
  Latitude: 27.480614242956626,
  Longitude: -109.96660767629292
}, {
  Id: 7,
  FullAddress: "Bretaña 1907, Fraccionamiento Torre de París, Cd Obregón, Son.",
  Latitude: 27.47505808892123,
  Longitude: -109.96232484293019
}, {
  Id: 8,
  Street: "Av. Enramada",
  Number: "624",
  BetweenStreets: "De la luna y Loma azul",
  Suburb: "Casa Blanca",
  City: "Ciudad Obregón",
  State: "Sonora",
  Zip: 85134,
  Country: "México",
  Latitude: 27.488512106277305, 
  Longitude: -109.98619694331903
}, {
  Id: 9,
  Street: "Miguel Guerrero",
  Number: "739A",
  Suburb: "Nuevo Cajeme",
  City: "Cd Obregón",
  State: "Sonora",
  Zip: 85050,
  Country: "México",
  Latitude: 27.510098525468266,
  Longitude: -109.92615077617862
}, {
  Id: 10,
  FullAddress: "Calle Privada Palma Areca 328 Palma Real, 85190 Cd Obregón, Sonora",
  Latitude: 27.45594290068994,
  Longitude: -109.94257184262565
}];

for (let i = 0; i < address.length; i++) {
  const a = address[i];
  if (!a.FullAddress) {
    a.FullAddress = `${a.Street} ${a.Number}, ${a.Suburb}, ${a.Zip} ${a.City} ${a.State}`;
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
  const Id = address.length;
  const a = {
    Id,
    FullAddress: `${getRandomStreetName()} ${getRandomNumber(4)}, ${getRandomNeiborhoodName()}, 85${getRandomNumber(3)} Cd Obregón, Sonora`,
    Latitude: getRandomLatitude(),
    Longitude: getRandomLongitude()
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
    Name: getRandomName(),
    Email: getRandomEmail(),
    Phone: getRandomPhone()
  }
}

function getRandomAddressInstruction(): AddressInstruction {
  return {
    Description: "",
    Contact: getRandomContact()
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
    Size: getRandomPackageSize(),
    Description: "",
    Dimension: {
      Height: getRandomNumber(2),
      Width: getRandomNumber(2),
      Length: getRandomNumber(2),
      LongitudeUnit: getRandomPackageLengthUnit()
    },
    Weight: {
      Weight: getRandomNumber(3),
      WeightUnit: getRandomPackageWeightUnit()
    },
    Content: ""
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
    PreviousStatus: getRandomDeliveryStatus(),
    CurrentStatus: getRandomDeliveryStatus(),
    Date: new Date("2021-01-12T16:51:11.352Z").toString(),
    Notes: ""
  }
}

function getRandomDeliveryLog(): DeliveryHistoryItem[] {
  const l = Math.floor(Math.random() * 4);
  const logs = [];
  for(let i = 0; i < l; i++) {
    logs.push(getRandomLog());
  }
  return logs;
}

function getRandomOrder(): Order {
  return {
    Id: ++counter,
    CreatedAt: new Date("2021-01-12T16:51:11.352Z").toString(),
    SourceAddress: createRandomAddress(),
    SourceAddressInstruction: getRandomAddressInstruction(),
    DestinationAddress: getRandomAddress(),
    DestinationAddressInstruction: getRandomAddressInstruction(),
    ServiceType: getRandomServiceType(),
    DeliveryStatus: getRandomDeliveryStatus(),
    Distance: getRandomNumber(2),
    EstimatedDeliveryTime: getRandomNumber(3),
    Packages: getRandomPackages(),
    CustomerContact: getRandomContact(),
    DeliveryLog: getRandomDeliveryLog()
  };
}

function reload() {
  orders = [];
  const max = Math.floor(Math.random() * 10);
  for (let i = 0; i < max; i++) {
    orders.push(getRandomOrder());
  }
}

reload();

function address2dto(a: Address): AddressDto {
  return {
    Id: a.Id,
    FullAddress: a.FullAddress,
    Latitude: a.Latitude,
    Longitude: a.Longitude
  };
}

function getAllOrders(): OrderDto[] {
  return orders.map(o => {
    return {
      Id: o.Id,
      CreatedAt: o.CreatedAt,
      SourceAddress: address2dto(o.SourceAddress),
      DestinationAddress: address2dto(o.DestinationAddress),
      ServiceType: o.ServiceType,
      DeliveryStatus: o.DeliveryStatus,
      Distance: o.Distance,
      EstimatedDeliveryTime: o.EstimatedDeliveryTime
    };
  });
}

function getOrderById(Id: number): Order {
  return orders.find((o => o.Id == Id));
}

export {
  getAllOrders, getOrderById, reload
};
