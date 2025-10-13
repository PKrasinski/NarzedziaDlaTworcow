import { useDesignSystem } from "design-system";
import { BarChart3, MessageCircle, User } from "lucide-react";
import { useLocation, useParams } from "react-router-dom";
import { getContentTypes, contentTypeConfigs } from "../../../lib/content-types";
import { useContent } from "../content-provider";

export function ContentItemSidebar() {
  const { itemId } = useParams<{ itemId: string }>();
  const { content, contentFormats } = useContent();
  const location = useLocation();
  const {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuLink,
    SidebarSeparator,
    SidebarTitle,
    SidebarDescription,
  } = useDesignSystem();

  // Find the current content
  const currentContent = content.find((item) => item._id === itemId);
  const currentFormat = currentContent 
    ? contentFormats.find((f) => f._id === currentContent.formatId)
    : null;

  // Get content types present in this content
  const presentContentTypes = currentContent ? getContentTypes(currentContent) : [];

  // Get available content types from the current format
  const availableContentTypes = currentFormat ? 
    Object.keys(contentTypeConfigs).filter(contentTypeAlias => {
      // Check if this content type is enabled in the format
      return currentFormat[contentTypeAlias] && typeof currentFormat[contentTypeAlias] === 'object';
    }).map(alias => ({
      alias,
      config: contentTypeConfigs[alias],
      isPresent: presentContentTypes.some(pt => pt.alias === alias)
    })) : [];


  const menuItems = [
    {
      path: `/content/item/${itemId}`,
      label: "Chat",
      icon: MessageCircle,
      exact: true,
    },
    {
      path: `/content/item/${itemId}/statistics`,
      label: "Statystyki", 
      icon: BarChart3,
      exact: false,
    },
    {
      path: `/content/item/${itemId}/tasks`,
      label: "Zadania",
      icon: User,
      exact: false,
    },
  ];

  return (
    <>
      {/* Header */}
      <SidebarHeader>
        <SidebarTitle>
          {currentContent?.title || "Bez tytułu"}
        </SidebarTitle>
        {currentContent?.description && (
          <SidebarDescription>
            {currentContent.description}
          </SidebarDescription>
        )}
        {currentFormat && (
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
            {currentFormat.name}
          </span>
        )}
      </SidebarHeader>

      {/* Main Navigation */}
      <SidebarGroup>
        <SidebarMenu>
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuLink 
                  to={item.path}
                  exact={item.exact}
                  variant="gradient"
                >
                  <Icon />
                  <span>{item.label}</span>
                </SidebarMenuLink>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroup>

      {/* Content Types Section */}
      {availableContentTypes.length > 0 && (
        <>
          <SidebarSeparator />
          <SidebarGroup>
            <SidebarGroupLabel>Typy treści</SidebarGroupLabel>
            <SidebarMenu>
              {availableContentTypes.map(({ alias, config, isPresent }) => {
                const IconComponent = config.icon;
                const contentTypePath = `/content/item/${itemId}/${alias}`;
                
                return (
                  <SidebarMenuItem key={alias}>
                    <SidebarMenuLink 
                      to={contentTypePath}
                      variant="gradient"
                    >
                      <div className={`p-1.5 rounded-lg text-white shadow-sm ${config.color}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="font-medium text-sm truncate">
                          {config.name}
                        </span>
                        {isPresent && (
                          <span className="text-xs text-green-600">
                            Uzupełnione
                          </span>
                        )}
                      </div>
                      <div className={`w-2 h-2 rounded-full ${
                        isPresent 
                          ? "bg-gradient-to-r from-blue-500 to-purple-500" 
                          : "bg-gray-300"
                      }`}></div>
                    </SidebarMenuLink>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        </>
      )}

      {/* Loading State */}
      {!currentContent && (
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