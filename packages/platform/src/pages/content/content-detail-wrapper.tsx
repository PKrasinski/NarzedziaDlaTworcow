import { ContentDetailLayout } from "@/components/content-detail-layout";
import { ContentProvider } from "@/providers/content-provider";

export function ContentDetailWrapperPage() {
  return (
    <ContentProvider>
      <ContentDetailLayout />
    </ContentProvider>
  );
}