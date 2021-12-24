export namespace Account {
  export namespace StellarResponse {
    export interface AccountInfo {
      _links: Links;
      id: string; // GAYOLLLUIZE4DZMBB2ZBKGBUBZLIOYU6XFLW37GBP2VZD3ABNXCW4BVA
      account_id: string; // GAYOLLLUIZE4DZMBB2ZBKGBUBZLIOYU6XFLW37GBP2VZD3ABNXCW4BVA
      sequence: string; // 120192344968520093
      subentry_count: number; // 6
      last_modified_ledger: number; // 37858216
      last_modified_time: string; // 2021-10-17T21:09:13Z
      thresholds: Thresholds;
      flags: Flags;
      balances?: BalancesEntity[] | null;
      signers?: SignersEntity[] | null;
      data: Object; // often empty
      num_sponsoring: number; // 0
      num_sponsored: number; // 0
      paging_token: string; // GAYOLLLUIZE4DZMBB2ZBKGBUBZLIOYU6XFLW37GBP2VZD3ABNXCW4BVA
    }

    export interface Links {
      self: Self;
      transactions: TransactionsOrOperationsOrPaymentsOrEffectsOrOffersOrTradesOrData;
      operations: TransactionsOrOperationsOrPaymentsOrEffectsOrOffersOrTradesOrData;
      payments: TransactionsOrOperationsOrPaymentsOrEffectsOrOffersOrTradesOrData;
      effects: TransactionsOrOperationsOrPaymentsOrEffectsOrOffersOrTradesOrData;
      offers: TransactionsOrOperationsOrPaymentsOrEffectsOrOffersOrTradesOrData;
      trades: TransactionsOrOperationsOrPaymentsOrEffectsOrOffersOrTradesOrData;
      data: TransactionsOrOperationsOrPaymentsOrEffectsOrOffersOrTradesOrData;
    }

    export interface Self {
      href: string;
    }

    export interface TransactionsOrOperationsOrPaymentsOrEffectsOrOffersOrTradesOrData {
      href: string;
      templated: boolean;
    }

    export interface Thresholds {
      low_threshold: number;
      med_threshold: number;
      high_threshold: number;
    }

    export interface Flags {
      auth_required: boolean;
      auth_revocable: boolean;
      auth_immutable: boolean;
      auth_clawback_enabled: boolean;
    }

    export interface BalancesEntity {
      balance: string; // 3.1200000
      limit?: string | null; // 922337203685.4775807
      buying_liabilities: string; // 0.0000000
      selling_liabilities: string; // 0.0000000
      last_modified_ledger?: number | null; // 29882476
      is_authorized?: boolean | null;
      is_authorized_to_maintain_liabilities?: boolean | null;
      asset_type: string; // credit_alphanum4
      asset_code?: string | null; // USD
      asset_issuer?: string | null; // GDUKMGUGDZQK6YHYA5Z6AY2G4XDSZPSZ3SW5UN3ARVMO6QSRDWP5YLEX
    }

    export interface SignersEntity {
      weight: number;
      key: string;
      type: string;
    }
  }

  export interface Info {
    accountId: string;
    balanceInUSD: number;
    balanceInXLM: number;
    sequence: number;
    rawData: StellarResponse.AccountInfo;
  }
}
