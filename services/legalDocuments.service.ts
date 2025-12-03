import { axiosAdapter, AxiosAdapter } from "@/utils/axiosAdapter";

enum ELegalDocuments {
  TERMS_OF_SERVICE_AND_PRIVACY_POLICY_BEEKEEPER = "TERMS_OF_SERVICE_AND_PRIVACY_POLICY_BEEKEEPER",
}

export interface ILegalDocument {
  type: ELegalDocuments;
  title: string;
  content: string;
}

export interface LegalDocumentsService {
  acceptedTermsOfServiceAndPrivacyBeekeeper(): Promise<void>;
  getTermsOfServiceAndPrivacyBeekeeper(): Promise<ILegalDocument>;
  downloadTermsOfServiceAndPrivacyBeekeeper(): Promise<ArrayBuffer>;
}

export class LegalDocumentsServiceImpl implements LegalDocumentsService {
  constructor(private readonly http: AxiosAdapter) {}

  private getDocumentUrl(document: ELegalDocuments) {
    return `/legal-documents/${document}`;
  }

  acceptedTermsOfServiceAndPrivacyBeekeeper(): Promise<void> {
    return this.http.post(
      this.getDocumentUrl(ELegalDocuments.TERMS_OF_SERVICE_AND_PRIVACY_POLICY_BEEKEEPER) + "/accept"
    );
  }

  getTermsOfServiceAndPrivacyBeekeeper(): Promise<ILegalDocument> {
    return this.http.get<ILegalDocument>(
      this.getDocumentUrl(ELegalDocuments.TERMS_OF_SERVICE_AND_PRIVACY_POLICY_BEEKEEPER)
    );
  }

  downloadTermsOfServiceAndPrivacyBeekeeper(): Promise<ArrayBuffer> {
    return this.http.get(
      this.getDocumentUrl(ELegalDocuments.TERMS_OF_SERVICE_AND_PRIVACY_POLICY_BEEKEEPER) + "/download",
      { responseType: "arraybuffer" }
    );
  }
}

export const legalDocumentsService = new LegalDocumentsServiceImpl(axiosAdapter);
