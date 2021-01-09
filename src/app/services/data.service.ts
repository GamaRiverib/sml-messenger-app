import { Injectable } from '@angular/core';

export enum OrderStatus {
  CREATED, QUEUED, IN_ORDER, COLLECTED,
  READY_TO_STORAGE, READY_TO_DELIVERY, 
  DELIVERED, TO_STORAGE, TO_NEXT_VISIT,
  VISITS_DONE, STORAGED, VISIT_CANCELLED,
  DELETED, VISIT_SUSPENDED, RETURNED, LOST
}

export enum ServiceType {
  ON_DEMAND, SAME_DAY, NEXT_DAY
}

export enum PackageSize {
  ENVELOP, SMALL_BOX, MEDIUM_BOX, BIG_BOX
}

export interface Contact {
  name?: string;
  phone?: string;
  email: string;
}

export interface Location {
  street: string;
  longitude: number;
  latitude: number;
  zipCode: number;
  externalNumber: string;
  internalNumber?: string;
  neighborhood?: string;
  state: string;
  city: string;
  instructions?: string;
}

export interface MeetingPoint {
  contact?: Contact;
  location: Location;
  done?: boolean;
}

export interface Pickup extends MeetingPoint {

}

export interface Dropoff extends MeetingPoint {

}

export enum PackageDimensionUnit {
  MM, CM, INCH
}

export enum PackageWeightUnit {
  GR, KGR, OZ
}

export interface PackageDimension {
  height: number;
  width: number;
  length: number;
  unit: PackageDimensionUnit;
}

export interface PackageWeight {
  weight: number;
  unit: PackageWeightUnit;
}

export interface Package {
  size: PackageSize;
  dimensions: PackageDimension;
  weight: PackageWeight;
  items?: any;
  description?: string;
  quantity: number;
}

export interface OrderHistoryItem {
  previousStatus?: OrderStatus;
  currentStatus: OrderStatus;
  date: string;
  notes?: string;
}

export interface Customer {
  id: string;
  name: string;
  contact: Contact;
  location?: Location;
  notes?: string;
}

export interface Order {
  id: string;
  customer: Customer;
  status: OrderStatus;
  date: string;
  read: boolean;
  type: ServiceType;
  storeId?: string;
  pickup: Pickup;
  dropoff: Dropoff;
  packages: Package[];
  guide: string;
  history?: OrderHistoryItem[];
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public orders: Order[] = [
    {
      id: '00001',
      customer: {
        id: '23234',
        name: 'Jesús',
        contact: {
          email: 'jesus@gmail.com'
        }
      },
      status: OrderStatus.CREATED,
      date: '6/1/2021 19:07:45',
      read: false,
      type: ServiceType.ON_DEMAND,
      storeId: 'test_store',
      pickup: {
        contact: {
          name: 'José',
          phone: '6441548524',
          email: 'jose@gmail.com'
        },
        location: {
          street: 'Fresnillo',
          longitude: 99.2091224,
          latitude: -109.0291092,
          zipCode: 12345,
          externalNumber: '1236',
          neighborhood: 'Villa Aurora',
          state: 'SON',
          city: 'CAJEME',
          instructions: 'Casa color cereza'
        }
      },
      dropoff: {
        contact: {
          name: 'María',
          phone: '6441258439',
          email: 'maria@gmail.com'
        },
        location: {
          street: 'Calle Esperanza',
          longitude: 99.3364894,
          latitude: -107.90843043,
          zipCode: 12145,
          externalNumber: '564',
          neighborhood: 'Moderna',
          state: 'SON',
          city: 'CAJEME',
          instructions: 'Casa con rejas blancas'
        }
      },
      packages: [
        {
          size: PackageSize.SMALL_BOX,
          dimensions: {
            height: 10,
            width: 15,
            length: 15,
            unit: PackageDimensionUnit.CM
          },
          weight: {
            weight: 300,
            unit: PackageWeightUnit.GR
          },
          items: [{
            id: 10,
            name: 'Playera',
            units: 1,
            cost: 60
          }],
          description: 'Tocar el timbre al entregar',
          quantity: 1
        }
      ],
      guide: '493258039',
      history: [{
        currentStatus: OrderStatus.CREATED,
        date: '6/1/2021 19:07:45'
      }]
    },
    {
      id: '00002',
      customer: {
        id: '23234',
        name: 'Jesús',
        contact: {
          email: 'jesus@gmail.com'
        }
      },
      status: OrderStatus.CREATED,
      date: '6/1/2021 19:07:45',
      read: false,
      type: ServiceType.SAME_DAY,
      storeId: 'test_store',
      pickup: {
        contact: {
          name: 'José',
          phone: '6441548524',
          email: 'jose@gmail.com'
        },
        location: {
          street: 'Guerrero',
          longitude: 99.2091224,
          latitude: -109.0291092,
          zipCode: 12345,
          externalNumber: '1806',
          neighborhood: 'Infonavit Yukujimari',
          state: 'SON',
          city: 'CAJEME',
          instructions: 'Casa color cereza'
        }
      },
      dropoff: {
        contact: {
          name: 'María',
          phone: '6441258439',
          email: 'maria@gmail.com'
        },
        location: {
          street: 'Calle Esperanza',
          longitude: 99.3364894,
          latitude: -107.90843043,
          zipCode: 12145,
          externalNumber: '564',
          neighborhood: 'Moderna',
          state: 'SON',
          city: 'CAJEME',
          instructions: 'Casa con rejas blancas'
        }
      },
      packages: [
        {
          size: PackageSize.SMALL_BOX,
          dimensions: {
            height: 10,
            width: 15,
            length: 15,
            unit: PackageDimensionUnit.CM
          },
          weight: {
            weight: 300,
            unit: PackageWeightUnit.GR
          },
          items: [{
            id: 10,
            name: 'Playera',
            units: 1,
            cost: 60
          }],
          description: 'Tocar el timbre al entregar',
          quantity: 1
        }
      ],
      guide: '493258039',
      history: [{
        currentStatus: OrderStatus.CREATED,
        date: '6/1/2021 19:07:45'
      }]
    },
    {
      id: '00003',
      customer: {
        id: '23234',
        name: 'Jesús',
        contact: {
          email: 'jesus@gmail.com'
        }
      },
      status: OrderStatus.CREATED,
      date: '6/1/2021 19:07:45',
      read: false,
      type: ServiceType.NEXT_DAY,
      storeId: 'test_store',
      pickup: {
        contact: {
          name: 'José',
          phone: '6441548524',
          email: 'jose@gmail.com'
        },
        location: {
          street: 'Calle Siempre Viva',
          longitude: 99.2091224,
          latitude: -109.0291092,
          zipCode: 12345,
          externalNumber: '123',
          neighborhood: 'Villa',
          state: 'SON',
          city: 'CAJEME',
          instructions: 'Casa color cereza'
        }
      },
      dropoff: {
        contact: {
          name: 'María',
          phone: '6441258439',
          email: 'maria@gmail.com'
        },
        location: {
          street: 'Calle Esperanza',
          longitude: 99.3364894,
          latitude: -107.90843043,
          zipCode: 12145,
          externalNumber: '564',
          neighborhood: 'Moderna',
          state: 'SON',
          city: 'CAJEME',
          instructions: 'Casa con rejas blancas'
        }
      },
      packages: [
        {
          size: PackageSize.SMALL_BOX,
          dimensions: {
            height: 10,
            width: 15,
            length: 15,
            unit: PackageDimensionUnit.CM
          },
          weight: {
            weight: 300,
            unit: PackageWeightUnit.GR
          },
          items: [{
            id: 10,
            name: 'Playera',
            units: 1,
            cost: 60
          }],
          description: 'Tocar el timbre al entregar',
          quantity: 1
        }
      ],
      guide: '493258039',
      history: [{
        currentStatus: OrderStatus.CREATED,
        date: '6/1/2021 19:07:45'
      }]
    },
    {
      id: '00004',
      customer: {
        id: '23234',
        name: 'Jesús',
        contact: {
          email: 'jesus@gmail.com'
        }
      },
      status: OrderStatus.CREATED,
      date: '6/1/2021 19:07:45',
      read: false,
      type: ServiceType.ON_DEMAND,
      storeId: 'test_store',
      pickup: {
        contact: {
          name: 'José',
          phone: '6441548524',
          email: 'jose@gmail.com'
        },
        location: {
          street: 'Calle Siempre Viva',
          longitude: 99.2091224,
          latitude: -109.0291092,
          zipCode: 12345,
          externalNumber: '123',
          neighborhood: 'Villa',
          state: 'SON',
          city: 'CAJEME',
          instructions: 'Casa color cereza'
        }
      },
      dropoff: {
        contact: {
          name: 'María',
          phone: '6441258439',
          email: 'maria@gmail.com'
        },
        location: {
          street: 'Calle Esperanza',
          longitude: 99.3364894,
          latitude: -107.90843043,
          zipCode: 12145,
          externalNumber: '564',
          neighborhood: 'Moderna',
          state: 'SON',
          city: 'CAJEME',
          instructions: 'Casa con rejas blancas'
        }
      },
      packages: [
        {
          size: PackageSize.SMALL_BOX,
          dimensions: {
            height: 10,
            width: 15,
            length: 15,
            unit: PackageDimensionUnit.CM
          },
          weight: {
            weight: 300,
            unit: PackageWeightUnit.GR
          },
          items: [{
            id: 10,
            name: 'Playera',
            units: 1,
            cost: 60
          }],
          description: 'Tocar el timbre al entregar',
          quantity: 1
        }
      ],
      guide: '493258039',
      history: [{
        currentStatus: OrderStatus.CREATED,
        date: '6/1/2021 19:07:45'
      }]
    },
    {
      id: '00005',
      customer: {
        id: '23234',
        name: 'Jesús',
        contact: {
          email: 'jesus@gmail.com'
        }
      },
      status: OrderStatus.CREATED,
      date: '6/1/2021 19:07:45',
      read: false,
      type: ServiceType.ON_DEMAND,
      storeId: 'test_store',
      pickup: {
        contact: {
          name: 'José',
          phone: '6441548524',
          email: 'jose@gmail.com'
        },
        location: {
          street: 'Calle Siempre Viva',
          longitude: 99.2091224,
          latitude: -109.0291092,
          zipCode: 12345,
          externalNumber: '123',
          neighborhood: 'Villa',
          state: 'SON',
          city: 'CAJEME',
          instructions: 'Casa color cereza'
        }
      },
      dropoff: {
        contact: {
          name: 'María',
          phone: '6441258439',
          email: 'maria@gmail.com'
        },
        location: {
          street: 'Calle Esperanza',
          longitude: 99.3364894,
          latitude: -107.90843043,
          zipCode: 12145,
          externalNumber: '564',
          neighborhood: 'Moderna',
          state: 'SON',
          city: 'CAJEME',
          instructions: 'Casa con rejas blancas'
        }
      },
      packages: [
        {
          size: PackageSize.SMALL_BOX,
          dimensions: {
            height: 10,
            width: 15,
            length: 15,
            unit: PackageDimensionUnit.CM
          },
          weight: {
            weight: 300,
            unit: PackageWeightUnit.GR
          },
          items: [{
            id: 10,
            name: 'Playera',
            units: 1,
            cost: 60
          }],
          description: 'Tocar el timbre al entregar',
          quantity: 1
        }
      ],
      guide: '493258039',
      history: [{
        currentStatus: OrderStatus.CREATED,
        date: '6/1/2021 19:07:45'
      }]
    },
    {
      id: '00006',
      customer: {
        id: '23234',
        name: 'Jesús',
        contact: {
          email: 'jesus@gmail.com'
        }
      },
      status: OrderStatus.CREATED,
      date: '6/1/2021 19:07:45',
      read: false,
      type: ServiceType.ON_DEMAND,
      storeId: 'test_store',
      pickup: {
        contact: {
          name: 'José',
          phone: '6441548524',
          email: 'jose@gmail.com'
        },
        location: {
          street: 'Calle Siempre Viva',
          longitude: 99.2091224,
          latitude: -109.0291092,
          zipCode: 12345,
          externalNumber: '123',
          neighborhood: 'Villa',
          state: 'SON',
          city: 'CAJEME',
          instructions: 'Casa color cereza'
        }
      },
      dropoff: {
        contact: {
          name: 'María',
          phone: '6441258439',
          email: 'maria@gmail.com'
        },
        location: {
          street: 'Calle Esperanza',
          longitude: 99.3364894,
          latitude: -107.90843043,
          zipCode: 12145,
          externalNumber: '564',
          neighborhood: 'Moderna',
          state: 'SON',
          city: 'CAJEME',
          instructions: 'Casa con rejas blancas'
        }
      },
      packages: [
        {
          size: PackageSize.SMALL_BOX,
          dimensions: {
            height: 10,
            width: 15,
            length: 15,
            unit: PackageDimensionUnit.CM
          },
          weight: {
            weight: 300,
            unit: PackageWeightUnit.GR
          },
          items: [{
            id: 10,
            name: 'Playera',
            units: 1,
            cost: 60
          }],
          description: 'Tocar el timbre al entregar',
          quantity: 1
        }
      ],
      guide: '493258039',
      history: [{
        currentStatus: OrderStatus.CREATED,
        date: '6/1/2021 19:07:45'
      }]
    },
    {
      id: '00007',
      customer: {
        id: '23234',
        name: 'Jesús',
        contact: {
          email: 'jesus@gmail.com'
        }
      },
      status: OrderStatus.CREATED,
      date: '6/1/2021 19:07:45',
      read: false,
      type: ServiceType.ON_DEMAND,
      storeId: 'test_store',
      pickup: {
        contact: {
          name: 'José',
          phone: '6441548524',
          email: 'jose@gmail.com'
        },
        location: {
          street: 'Calle Siempre Viva',
          longitude: 99.2091224,
          latitude: -109.0291092,
          zipCode: 12345,
          externalNumber: '123',
          neighborhood: 'Villa',
          state: 'SON',
          city: 'CAJEME',
          instructions: 'Casa color cereza'
        }
      },
      dropoff: {
        contact: {
          name: 'María',
          phone: '6441258439',
          email: 'maria@gmail.com'
        },
        location: {
          street: 'Calle Esperanza',
          longitude: 99.3364894,
          latitude: -107.90843043,
          zipCode: 12145,
          externalNumber: '564',
          neighborhood: 'Moderna',
          state: 'SON',
          city: 'CAJEME',
          instructions: 'Casa con rejas blancas'
        }
      },
      packages: [
        {
          size: PackageSize.SMALL_BOX,
          dimensions: {
            height: 10,
            width: 15,
            length: 15,
            unit: PackageDimensionUnit.CM
          },
          weight: {
            weight: 300,
            unit: PackageWeightUnit.GR
          },
          items: [{
            id: 10,
            name: 'Playera',
            units: 1,
            cost: 60
          }],
          description: 'Tocar el timbre al entregar',
          quantity: 1
        }
      ],
      guide: '493258039',
      history: [{
        currentStatus: OrderStatus.CREATED,
        date: '6/1/2021 19:07:45'
      }]
    },
    {
      id: '00008',
      customer: {
        id: '23234',
        name: 'Jesús',
        contact: {
          email: 'jesus@gmail.com'
        }
      },
      status: OrderStatus.CREATED,
      date: '6/1/2021 19:07:45',
      read: false,
      type: ServiceType.ON_DEMAND,
      storeId: 'test_store',
      pickup: {
        contact: {
          name: 'José',
          phone: '6441548524',
          email: 'jose@gmail.com'
        },
        location: {
          street: 'Calle Siempre Viva',
          longitude: 99.2091224,
          latitude: -109.0291092,
          zipCode: 12345,
          externalNumber: '123',
          neighborhood: 'Villa',
          state: 'SON',
          city: 'CAJEME',
          instructions: 'Casa color cereza'
        }
      },
      dropoff: {
        contact: {
          name: 'María',
          phone: '6441258439',
          email: 'maria@gmail.com'
        },
        location: {
          street: 'Calle Esperanza',
          longitude: 99.3364894,
          latitude: -107.90843043,
          zipCode: 12145,
          externalNumber: '564',
          neighborhood: 'Moderna',
          state: 'SON',
          city: 'CAJEME',
          instructions: 'Casa con rejas blancas'
        }
      },
      packages: [
        {
          size: PackageSize.SMALL_BOX,
          dimensions: {
            height: 10,
            width: 15,
            length: 15,
            unit: PackageDimensionUnit.CM
          },
          weight: {
            weight: 300,
            unit: PackageWeightUnit.GR
          },
          items: [{
            id: 10,
            name: 'Playera',
            units: 1,
            cost: 60
          }],
          description: 'Tocar el timbre al entregar',
          quantity: 1
        }
      ],
      guide: '493258039',
      history: [{
        currentStatus: OrderStatus.CREATED,
        date: '6/1/2021 19:07:45'
      }]
    }
  ];

  constructor() { }

  public getOrders(): Order[] {
    return this.orders;
  }

  public getOrderById(id: number): Order {
    return this.orders[id];
  }
}
