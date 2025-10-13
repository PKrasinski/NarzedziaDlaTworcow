import { ContentItemLayout } from "@/components/content-item-layout";
import { ContentProvider } from "@/providers/content-provider";

export function ContentItemWrapperPage() {
  return (
    <ContentProvider>
      <ContentItemLayout />
    </ContentProvider>
  );
}