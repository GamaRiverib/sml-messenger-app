export const STATUS_PRIORITY = [
  "QUEUED", "READY_TO_DELIVERY", "IN_ORDER", "COLLECTED", "READY_TO_STORAGE", 
  "TO_STORAGE", "RETURNED", "VISIT_DONE", "TO_NEXT_VISIT", "VISIT_SUSPENDED",
  "VISIT_CANCELED", "CREATED", "STORAGED", "DELIVERED", "LOST"];

export const SERVICE_TYPE_PRIORITY = ["ON_DEMAND", "SAME_DAY", "NEXT_DAY"];

export const STATUS_ICONS = {
  CREATED: 'ellipse',
  QUEUED: 'help-circle',
  IN_ORDER: 'navigate',
  COLLECTED: 'navigate',
  READY_TO_STORAGE: 'archive',
  READY_TO_DELIVERY: 'navigate',
  DELIVERED: 'checkmark-done-circle',
  TO_STORAGE: 'archive',
  TO_NEXT_VISIT: 'help-circle',
  VISIT_DONE: 'alert-circle',
  STORAGED: 'archive',
  VISIT_CANCELED: 'warning',
  DELETED: 'close-circle',
  VISIT_SUSPENDED: 'warning',
  RETURNED: 'warning',
  LOST: 'warning'
};

export const STATUS_ICON_COLOR = {
  'ON_DEMAND': {
    CREATED: 'danger',
    QUEUED: 'danger',
    IN_ORDER: 'danger',
    COLLECTED: '',
    READY_TO_STORAGE: 'tertiary',
    READY_TO_DELIVERY: 'success',
    DELIVERED: 'success',
    TO_STORAGE: 'tertiary',
    TO_NEXT_VISIT: '',
    VISIT_DONE: 'danger',
    STORAGED: 'success',
    VISIT_CANCELED: 'danger',
    DELETED: '',
    VISIT_SUSPENDED: 'warning',
    RETURNED: 'danger',
    LOST: ''
  },
  'SAME_DAY': {
    CREATED: 'warning',
    QUEUED: 'danger',
    IN_ORDER: 'warning',
    COLLECTED: '',
    READY_TO_STORAGE: 'tertiary',
    READY_TO_DELIVERY: 'success',
    DELIVERED: 'success',
    TO_STORAGE: 'tertiary',
    TO_NEXT_VISIT: '',
    VISIT_DONE: 'danger',
    STORAGED: 'success',
    VISIT_CANCELED: 'danger',
    DELETED: '',
    VISIT_SUSPENDED: 'warning',
    RETURNED: 'danger',
    LOST: ''
  },
  'NEXT_DAY': {
    CREATED: 'secondary',
    QUEUED: 'warning',
    IN_ORDER: 'tertiary',
    COLLECTED: 'tertiary',
    READY_TO_STORAGE: 'tertiary',
    READY_TO_DELIVERY: 'success',
    DELIVERED: 'success',
    TO_STORAGE: 'tertiary',
    TO_NEXT_VISIT: '',
    VISIT_DONE: 'danger',
    STORAGED: 'success',
    VISIT_CANCELED: 'danger',
    DELETED: '',
    VISIT_SUSPENDED: 'warning',
    RETURNED: 'danger',
    LOST: ''
  }
}

export const ORDER_PROGRESS = {
  CREATED: 0.1,
  QUEUED: 0.1,
  IN_ORDER: 0.25,
  COLLECTED: 0.5,
  RETURNED: 0.5,
  READY_TO_DELIVERY: 0.75,
  READY_TO_STORAGE: 0.75,
  TO_STORAGE: 0.75,
  DELIVERED: 1,
  STORAGED: 1,
  LOST: 1,
  VISIT_DONE: 0.5,
  TO_NEXT_VISIT: 0.2,
  VISIT_CANCELED: 0.5,
  VISIT_SUSPENDED: 0.5
};

export const ORDER_PROGRESS_COLOR = {
  CREATED: 'secondary',
  QUEUED: 'secondary',
  IN_ORDER: 'primary',
  COLLECTED: 'primary',
  RETURNED: 'warning',
  READY_TO_DELIVERY: 'primary',
  READY_TO_STORAGE: 'primary',
  TO_STORAGE: 'primary',
  DELIVERED: 'success',
  STORAGED: 'success',
  LOST: 'danger',
  VISIT_DONE: 'warning',
  TO_NEXT_VISIT: 'tertiary',
  VISIT_CANCELED: 'warning',
  VISIT_SUSPENDED: 'warning'
};
