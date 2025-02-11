export interface GetPlansResponse {
    plans: Plan[];
    links: Link[];
}

export interface Link {
    href:    string;
    rel:     string;
    method:  string;
    encType: string;
}

export interface Plan {
    id:                  string;
    version:             number;
    product_id:          string;
    name:                string;
    status:              string;
    description:         string;
    usage_type:          string;
    billing_cycles:      BillingCycle[];
    payment_preferences: PaymentPreferences;
    taxes:               Taxes;
    quantity_supported:  boolean;
    payee:               Payee;
    create_time:         Date;
    update_time:         Date;
    links:               Link[];
}

export interface BillingCycle {
    pricing_scheme: PricingScheme;
    frequency:      Frequency;
    tenure_type:    string;
    sequence:       number;
    total_cycles:   number;
}

export interface Frequency {
    interval_unit:  string;
    interval_count: number;
}

export interface PricingScheme {
    version:     number;
    fixed_price: SetupFee;
    create_time: Date;
    update_time: Date;
}

export interface SetupFee {
    currency_code: string;
    value:         string;
}

export interface Payee {
    merchant_id:  string;
    display_data: DisplayData;
}

export interface DisplayData {
    business_email: string;
    business_phone: BusinessPhone;
}

export interface BusinessPhone {
    country_code:    string;
    national_number: string;
}

export interface PaymentPreferences {
    service_type:              string;
    auto_bill_outstanding:     boolean;
    setup_fee:                 SetupFee;
    setup_fee_failure_action:  string;
    payment_failure_threshold: number;
}

export interface Taxes {
    percentage: string;
    inclusive:  boolean;
}
