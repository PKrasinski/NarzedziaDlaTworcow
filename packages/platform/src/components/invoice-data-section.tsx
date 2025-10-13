"use client";

import { useQuery } from "@/arc-provider";
import { $type, ArcObject, object } from "@arcote.tech/arc";
import { Form } from "@arcote.tech/arc-react";
import { invoiceDataSchema } from "@narzedziadlatworcow.pl/context/browser";
import { LabeledInput } from "@narzedziadlatworcow.pl/ui/components/labeled-input";
import {
  Card,
  CardContent,
} from "@narzedziadlatworcow.pl/ui/components/ui/card";
import { Checkbox } from "@narzedziadlatworcow.pl/ui/components/ui/checkbox";
import { Label } from "@narzedziadlatworcow.pl/ui/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@narzedziadlatworcow.pl/ui/components/ui/radio-group";
import { Building, User } from "lucide-react";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

interface InvoiceDataSectionProps {
  userName?: string;
}

export interface InvoiceDataSectionRef {
  getValues: () =>
    | {
        purchaseType: "private" | "company";
        invoiceData: $type<ArcObject<typeof invoiceDataSchema>> | null;
        shouldSaveForLater?: boolean;
      }
    | { error: true };
}

export const InvoiceDataSection = forwardRef<
  InvoiceDataSectionRef,
  InvoiceDataSectionProps
>(({ userName = "" }, ref) => {
  const [invoiceData] = useQuery(
    (q) => q.userInvoiceData.findOne({}),
    [],
    "user-invoice-data"
  );

  const [purchaseType, setPurchaseType] = useState<"private" | "company">(
    "private"
  );
  const [saveForLater, setSaveForLater] = useState(false);
  const formRef = useRef<any>(null);

  // Initialize data when component mounts or invoice data changes
  useEffect(() => {
    if (invoiceData?.address) {
      // User has existing invoice data - set to company mode
      setPurchaseType("company");
    }
  }, [invoiceData]);

  // Expose form methods to parent
  useImperativeHandle(ref, () => ({
    getValues: () => {
      if (purchaseType === "private") {
        return {
          purchaseType: "private",
          shouldSaveForLater: false,
        };
      }

      const error = formRef.current?.validate();
      if (error) {
        return { error: true };
      }

      const formValues = formRef.current?.getValues();
      return {
        purchaseType: "company",
        invoiceData: formValues,
        shouldSaveForLater: saveForLater,
      };
    },
  }));

  const hasExistingData = invoiceData?.address;

  return (
    <Card className="border border-gray-200">
      <CardContent className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Dane do faktury
          </h3>

          {/* Purchase Type Toggle */}
          <RadioGroup
            value={purchaseType}
            onValueChange={(value: "private" | "company") => {
              setPurchaseType(value);
            }}
            className="flex flex-col md:flex-row gap-6 md:gap-8"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="private" id="private" />
              <Label
                htmlFor="private"
                className="flex items-center cursor-pointer"
              >
                <User className="w-4 h-4 mr-2" />
                Osoba prywatna
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="company" id="company" />
              <Label
                htmlFor="company"
                className="flex items-center cursor-pointer"
              >
                <Building className="w-4 h-4 mr-2" />
                Firma
              </Label>
            </div>
          </RadioGroup>

          {/* Private Person Summary */}
          {purchaseType === "private" && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Kupujący:</strong>
                <br />
                {userName}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Zakup jako osoba prywatna
              </p>
            </div>
          )}

          {/* Company Data Form using Arc Form component */}
          {purchaseType === "company" && (
            <div className="space-y-4">
              {hasExistingData && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Uwaga:</strong> Poniżej są Twoje zapisane dane.
                    Możesz je edytować dla tego zakupu.
                  </p>
                </div>
              )}

              <Form
                ref={formRef}
                schema={object(invoiceDataSchema)}
                defaults={invoiceData as any}
                onSubmit={() => {}} // No submit handler needed for this form
                render={(Fields) => (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Fields.CompanyName
                        translations="Nazwa firmy jest wymagana"
                        render={(field: any) => (
                          <LabeledInput
                            {...field}
                            label="Nazwa firmy"
                            placeholder="Nazwa firmy"
                          />
                        )}
                      />

                      <Fields.Nip
                        translations={{
                          type: () => "NIP jest wymagany",
                          length: () => "NIP musi mieć 10 cyfr",
                          nip: () => "NIP musi mieć 10 cyfr",
                        }}
                        render={(field: any) => (
                          <LabeledInput
                            {...field}
                            label="NIP"
                            maxLength={10}
                            placeholder="1234567890"
                          />
                        )}
                      />
                    </div>

                    <Fields.Address
                      translations="Adres jest wymagany"
                      render={(field: any) => (
                        <LabeledInput
                          {...field}
                          label="Adres"
                          placeholder="ul. Przykładowa 1"
                        />
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Fields.PostalCode
                        translations={{
                          type: () => "Kod pocztowy jest wymagany",
                          postalCode: () =>
                            "Kod pocztowy musi mieć format 00-000",
                          length: () => "Kod pocztowy musi mieć format 00-000",
                        }}
                        render={(field: any) => (
                          <LabeledInput
                            {...field}
                            label="Kod pocztowy"
                            placeholder="00-000"
                          />
                        )}
                      />

                      <Fields.City
                        translations="Miasto jest wymagane"
                        render={(field: any) => (
                          <LabeledInput
                            {...field}
                            label="Miasto"
                            placeholder="Warszawa"
                          />
                        )}
                      />
                    </div>

                    <Fields.Country
                      translations="Kraj jest wymagany"
                      render={(field: any) => (
                        <LabeledInput
                          {...field}
                          label="Kraj"
                          placeholder="Polska"
                        />
                      )}
                    />
                  </div>
                )}
              />

              {/* Save for later checkbox */}
              <div className="flex items-center space-x-2 pt-2 border-t border-gray-200">
                <Checkbox
                  id="saveForLater"
                  checked={saveForLater}
                  onCheckedChange={(checked) => setSaveForLater(!!checked)}
                />
                <Label htmlFor="saveForLater" className="text-sm text-gray-600">
                  Zapisz te dane do użytku w przyszłości
                </Label>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

InvoiceDataSection.displayName = "InvoiceDataSection";
