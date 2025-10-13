import { useDesignSystem } from "design-system";
import { BookOpen, Lightbulb, Plus } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useContent } from "../content-provider";

export function ListOfContentSidebar() {
  const { contentFormats, content, isLoading } = useContent();
  const location = useLocation();
  const {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuLink,
    SidebarSeparator,
    SidebarTitle,
    SidebarDescription,
  } = useDesignSystem();


  return (
    <>
      {/* Header */}
      <SidebarHeader>
        <SidebarTitle>Treści</SidebarTitle>
        <SidebarDescription>Zarządzaj swoimi treściami</SidebarDescription>
      </SidebarHeader>

      {/* Main Navigation */}
      <SidebarGroup>
        <SidebarMenu>
          {/* All Content */}
          <SidebarMenuItem>
            <SidebarMenuLink 
              to="/"
              variant="gradient"
            >
              <BookOpen />
              <span>Wszystkie treści</span>
              {content && content.length > 0 && (
                <span className="ml-auto text-xs bg-white/50 text-gray-700 px-2 py-1 rounded-md font-medium">
                  {content.length}
                </span>
              )}
            </SidebarMenuLink>
          </SidebarMenuItem>

          {/* Generate Ideas */}
          <SidebarMenuItem>
            <SidebarMenuLink 
              to="/strategy/content-ideas"
              variant="gradient"
            >
              <Lightbulb />
              <span>Generuj pomysły</span>
            </SidebarMenuLink>
          </SidebarMenuItem>

        </SidebarMenu>
      </SidebarGroup>

      {/* Content Formats Section */}
      {contentFormats && contentFormats.length > 0 && (
        <>
          <SidebarSeparator />
          <SidebarGroup>
            <SidebarGroupLabel>Formaty treści</SidebarGroupLabel>
            <SidebarMenu>
              {contentFormats.map((format) => {
                const formatContentCount = content.filter(
                  (item) => item.formatId === format._id
                ).length;
                return (
                  <SidebarMenuItem key={format._id}>
                    <SidebarMenuLink 
                      to={`/content/format/${format._id}`}
                      variant="gradient"
                    >
                      <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="font-medium text-sm truncate">
                          {format.name || "Unnamed Format"}
                        </span>
                        {format.subtitle && (
                          <span className="text-xs text-gray-600 truncate">
                            {format.subtitle}
                          </span>
                        )}
                        </div>
                        {formatContentCount > 0 && (
                          <span className="text-xs bg-white/50 text-gray-700 px-2 py-1 rounded-md font-medium">
                            {formatContentCount}
                          </span>
                        )}
                      </SidebarMenuLink>
                    </SidebarMenuItem>
                );
              })}

              {/* Add New Format Button */}
              <SidebarMenuItem>
                <SidebarMenuLink 
                  to="/strategy/content-formats?view=summary"
                  variant="outline"
                  className="border-2 border-dashed border-gray-300 hover:border-blue-400 justify-center"
                >
                  <Plus />
                  <span>Dodaj format</span>
                </SidebarMenuLink>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </>
      )}

      {/* Loading State */}
      {isLoading && (
        <SidebarGroup>
          <SidebarGroupLabel>Ładowanie...</SidebarGroupLabel>
          <div className="animate-pulse space-y-3 px-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </SidebarGroup>
      )}
    </>
  );
}
