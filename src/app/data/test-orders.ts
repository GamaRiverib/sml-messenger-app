import { Address } from "../model/address";
import { AddressDto } from "../model/address-dto";
import { AddressInstruction } from "../model/address-instruction";
import { Contact } from "../model/contact";
import { DeliveryHistoryItem } from "../model/delivery-history-item";
import { Order } from "../model/order";
import { OrderDto } from "../model/order-dto"
import { Package } from "../model/package";

const orders: Order[] = [];

const address: Address[] = [{
  Id: 1,
  FullAddress: "Fresnillo 1236 Col Villa Aurora CP 85154 Ciudad Obregón Sonora",
  Latitude: 99.2091224,
  Longitude: -109.0291092
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
  Latitude: 99.2091224,
  Longitude: -109.0291092
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
  Latitude: 99.2091224,
  Longitude: -109.0291092
}, {
  Id: 4,
  FullAddress: "Guerrero 1806, Infonavit Yukujimari, 85120 Cd Obregón Sonora",
  Latitude: 99.2091224,
  Longitude: -109.0291092
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
  const status = ["CREATED", "QUEUED", "IN_ORDER", "COLLECTED", "READY_TO_STORAGE", "READY_TO_DELIVERY", "DELIVERED", "TO_STORAGE", "TO_NEXT_VISIT", "VISIT_DONE", "STORAGED", "VISIT_CANCELLED", "DELETED", "VISIT_SUSPENDED", "RETURNED", "LOST"];
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
    SourceAddress: getRandomAddress(),
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

const max = Math.floor(Math.random() * 50);
for (let i = 0; i < max; i++) {
  orders.push(getRandomOrder());
}

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
  getAllOrders, getOrderById
};
