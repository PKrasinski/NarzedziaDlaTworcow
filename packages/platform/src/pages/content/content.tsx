import { ContentListLayout } from "@/components/content-list-layout";
import { ContentProvider } from "@/providers/content-provider";

export function ContentPage() {
  return (
    <ContentProvider>
      <ContentListLayout />
    </ContentProvider>
  );
}
