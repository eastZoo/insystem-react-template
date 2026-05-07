export interface AssetLocationMapping {
  id: string;
  linkSerialNo: string;
  legalDongCode: string;
  assetName: string | null;
  createdAt: string;
}

export interface CreateAssetLocationMappingPayload {
  linkSerialNo: string;
  legalDongCode: string;
  assetName?: string;
}

export interface BulkCreateResult {
  created: number;
  skipped: number;
}
