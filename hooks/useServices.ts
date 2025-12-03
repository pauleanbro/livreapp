import { LegalDocumentsService, legalDocumentsService } from "@/services/legalDocuments.service";

export enum EServices {
  LegalDocumentsService = "LegalDocumentsService",
}

interface TServices {
  [EServices.LegalDocumentsService]: LegalDocumentsService;
}

const servicesMap: { [K in EServices]: TServices[K] } = {
  [EServices.LegalDocumentsService]: legalDocumentsService,
};

export const useServices = <T extends EServices>(service: T): TServices[T] => {
  return servicesMap[service];
};
