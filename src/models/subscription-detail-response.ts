export interface SubscriptionDetailResponse {
    status:             string;
    status_update_time: Date;
    id:                 string;
    plan_id:            string;
    start_time:         Date;
    quantity:           string;
    shipping_amount:    ShippingAmount;
    subscriber:         Subscriber;
    billing_info:       BillingInfo;
    create_time:        Date;
    update_time:        Date;
    plan_overridden:    boolean;
    links:              Link[];
}

export interface BillingInfo {
    outstanding_balance:   ShippingAmount;
    cycle_executions:      CycleExecution[];
    last_payment:          LastPayment;
    next_billing_time:     Date;
    failed_payments_count: number;
}

export interface CycleExecution {
    tenure_type:                    string;
    sequence:                       number;
    cycles_completed:               number;
    cycles_remaining:               number;
    current_pricing_scheme_version: number;
    total_cycles:                   number;
}

export interface LastPayment {
    amount: ShippingAmount;
    time:   Date;
}

export interface ShippingAmount {
    currency_code: string;
    value:         string;
}

export interface Link {
    href:   string;
    rel:    string;
    method: string;
}

export interface Subscriber {
    email_address:    string;
    payer_id:         string;
    name:             Name;
    shipping_address: ShippingAddress;
}

export interface Name {
    given_name: string;
    surname:    string;
}

export interface ShippingAddress {
    address: Address;
}

export interface Address {
    address_line_1: string;
    admin_area_2:   string;
    admin_area_1:   string;
    postal_code:    string;
    country_code:   string;
}
