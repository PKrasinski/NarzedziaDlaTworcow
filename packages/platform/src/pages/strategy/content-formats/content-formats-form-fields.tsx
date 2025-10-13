import { useQuery } from "@/arc-provider";
import { useAccountWorkspaces } from "@/components";
import { object } from "@arcote.tech/arc";
import { FormFields } from "@arcote.tech/arc-react";
import { formatSchema } from "@narzedziadlatworcow.pl/context";
import { Plus, User } from "lucide-react";
import {
  ContentTypeConfig,
  contentTypeConfigs,
  createContentTypeIcon,
} from "../../../lib/content-types";
import { LabeledSelect, LabeledText } from "../components";
import { useEditMode } from "../components/entity-form-view";

const format = object(formatSchema);

interface ContentFormatsFormFieldsProps {
  Fields: FormFields<typeof format>;
  onRemove?: () => void;
}

// Content Type Section Component
const ContentTypeSection = ({
  config,
  children,
}: {
  config: ContentTypeConfig;
  children: React.ReactNode;
}) => {
  return (
    <div className="relative bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-2xl border border-white/50 p-6 space-y-4 shadow-lg shadow-black/5">
      {/* Decorative background gradient */}
      <div
        className={`absolute inset-0 ${config.color} opacity-5 rounded-2xl mb-0`}
      />

      {/* Header */}
      <div className="relative flex items-center gap-2 mb-3">
        <div
          className={`p-1.5 rounded-lg text-white shadow-sm ${config.color}`}
        >
          {createContentTypeIcon(config.alias, "w-5 h-5")}
        </div>
        <h3 className="font-medium text-gray-900 text-sm">{config.name}</h3>
      </div>

      {/* Content */}
      <div className="relative space-y-4">{children}</div>
    </div>
  );
};

// This is now handled by the content-types.tsx file

// Small Add Content Type Button Component
const SmallAddContentTypeButton = ({
  config,
  onClick,
}: {
  config: ContentTypeConfig;
  onClick: () => void;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 px-2 py-1.5 rounded-md border border-dashed border-gray-300 hover:border-gray-400 transition-colors bg-gray-50/50 hover:bg-gray-100/50 group text-xs"
    >
      <span className="text-gray-400 group-hover:text-gray-600 flex-shrink-0">
        {createContentTypeIcon(config.alias, "w-3 h-3")}
      </span>
      <span className="text-gray-600 font-medium truncate flex-1">
        {config.name}
      </span>
      <Plus className="w-2.5 h-2.5 text-gray-400 group-hover:text-gray-600 flex-shrink-0" />
    </button>
  );
};

export const ContentFormatsFormFields = ({
  Fields,
  onRemove,
}: ContentFormatsFormFieldsProps) => {
  const { isEditing, mode } = useEditMode();
  const { currentAccount } = useAccountWorkspaces();

  const [viewerTargets] = useQuery((q) =>
    q.viewerTargets.find({
      where: {
        accountWorkspaceId: currentAccount._id,
      },
    })
  );

  const userPersonas = viewerTargets || [];

  const personaOptions = userPersonas.map((persona) => ({
    value: persona._id,
    label: persona.name || "Bez nazwy",
    icon: <User className="w-4 h-4" />,
  }));

  return (
    <div className="space-y-6">
      {/* Name - Title for tool/summary views */}
      <Fields.Name
        translations="Nazwa formatu jest wymagana"
        render={(field: any) => (
          <LabeledText
            {...field}
            label="NAZWA FORMATU"
            placeholder="Wprowadź nazwę formatu treści..."
          />
        )}
      />

      {/* Subtitle */}
      <Fields.Subtitle
        translations="Podtytuł formatu jest wymagany"
        render={(field: any) => (
          <LabeledText
            {...field}
            label="PODTYTUŁ"
            placeholder="Krótki podtytuł (max 8 słów)..."
          />
        )}
      />

      {/* Description */}
      <Fields.Description
        translations="Opis formatu jest wymagany"
        render={(field: any) => (
          <LabeledText
            {...field}
            label="OPIS"
            multiline
            placeholder="Opisz format i jego przeznaczenie..."
          />
        )}
      />

      {/* Rules */}
      <Fields.Rules
        translations="Zasady są wymagane"
        render={(field: any) => (
          <LabeledText
            {...field}
            label="ZASADY TWORZENIA TREŚCI"
            multiline
            placeholder="Opisz zasady tworzenia treści w tym formacie..."
          />
        )}
      />

      {/* Persona Selection */}
      <Fields.PersonaId
        translations="Persona jest wymagana"
        render={(field: any) => (
          <LabeledSelect
            {...field}
            label="PERSONA DOCELOWA"
            options={personaOptions}
            placeholder="Wybierz personę docelową..."
            emptyMessage={
              userPersonas.length === 0
                ? "Najpierw dodaj persony w poprzednim kroku."
                : undefined
            }
          />
        )}
      />

      {/* Instagram Content Types */}
      {/* Content section when Instagram Post exists */}
      <Fields.InstagramPost
        translations="Zasady Instagram Post są wymagane"
        render={(field) => {
          if (!field.value) return null;

          return (
            <ContentTypeSection config={contentTypeConfigs.instagramPost}>
              {field.subFields?.DescriptionRules && (
                <field.subFields.DescriptionRules
                  translations="Zasady opisu posta są wymagane"
                  render={(descField: any) => (
                    <LabeledText
                      {...descField}
                      label="ZASADY OPISU POSTA"
                      multiline
                      placeholder="Opisz zasady tworzenia opisów dla postów Instagram..."
                    />
                  )}
                />
              )}
            </ContentTypeSection>
          );
        }}
      />

      {/* Content section when Instagram Story exists */}
      <Fields.InstagramStory
        translations="Zasady Instagram Story są wymagane"
        render={(field) => {
          if (!field.value) return null;

          return (
            <ContentTypeSection config={contentTypeConfigs.instagramStory}>
              {field.subFields?.TextRules && (
                <field.subFields.TextRules
                  translations="Zasady tekstu stories są wymagane"
                  render={(textField: any) => (
                    <LabeledText
                      {...textField}
                      label="ZASADY TEKSTU STORIES"
                      multiline
                      placeholder="Opisz zasady tworzenia tekstów dla Instagram Stories..."
                    />
                  )}
                />
              )}
            </ContentTypeSection>
          );
        }}
      />

      {/* Content section when Instagram Reel exists */}
      <Fields.InstagramReel
        translations="Zasady Instagram Reel są wymagane"
        render={(field) => {
          if (!field.value) return null;

          return (
            <ContentTypeSection config={contentTypeConfigs.instagramReel}>
              {field.subFields?.DescriptionRules && (
                <field.subFields.DescriptionRules
                  translations="Zasady opisu reela są wymagane"
                  render={(descField: any) => (
                    <LabeledText
                      {...descField}
                      label="ZASADY OPISU REELA"
                      multiline
                      placeholder="Opisz zasady tworzenia opisów dla reeli Instagram..."
                    />
                  )}
                />
              )}
            </ContentTypeSection>
          );
        }}
      />

      {/* Content section when Instagram Carousel exists */}
      <Fields.InstagramCarousel
        translations="Zasady Instagram Carousel są wymagane"
        render={(field) => {
          if (!field.value) return null;

          return (
            <ContentTypeSection config={contentTypeConfigs.instagramCarousel}>
              {field.subFields?.DescriptionRules && (
                <field.subFields.DescriptionRules
                  translations="Zasady opisu karuzeli są wymagane"
                  render={(descField: any) => (
                    <LabeledText
                      {...descField}
                      label="ZASADY OPISU KARUZELI"
                      multiline
                      placeholder="Opisz zasady tworzenia opisów dla karuzeli Instagram..."
                    />
                  )}
                />
              )}
            </ContentTypeSection>
          );
        }}
      />

      {/* Content section when TikTok Video exists */}
      <Fields.TiktokVideo
        translations="Zasady TikTok Video są wymagane"
        render={(field) => {
          if (!field.value) return null;

          return (
            <ContentTypeSection config={contentTypeConfigs.tiktokVideo}>
              {field.subFields?.DescriptionRules && (
                <field.subFields.DescriptionRules
                  translations="Zasady opisu wideo są wymagane"
                  render={(descField: any) => (
                    <LabeledText
                      {...descField}
                      label="ZASADY OPISU WIDEO TIKTOK"
                      multiline
                      placeholder="Opisz zasady tworzenia opisów dla wideo TikTok..."
                    />
                  )}
                />
              )}
            </ContentTypeSection>
          );
        }}
      />

      {/* Content section when LinkedIn Post exists */}
      <Fields.LinkedinPost
        translations="Zasady LinkedIn Post są wymagane"
        render={(field) => {
          if (!field.value) return null;

          return (
            <ContentTypeSection config={contentTypeConfigs.linkedinPost}>
              {field.subFields?.TextRules && (
                <field.subFields.TextRules
                  translations="Zasady tekstu posta są wymagane"
                  render={(textField: any) => (
                    <LabeledText
                      {...textField}
                      label="ZASADY TEKSTU POSTA LINKEDIN"
                      multiline
                      placeholder="Opisz zasady tworzenia tekstów dla postów LinkedIn..."
                    />
                  )}
                />
              )}
            </ContentTypeSection>
          );
        }}
      />

      {/* Content section when LinkedIn Article exists */}
      <Fields.LinkedinArticle
        translations="Zasady LinkedIn Article są wymagane"
        render={(field) => {
          if (!field.value) return null;

          return (
            <ContentTypeSection config={contentTypeConfigs.linkedinArticle}>
              {field.subFields?.TitleRules && (
                <field.subFields.TitleRules
                  translations="Zasady tytułu artykułu są wymagane"
                  render={(titleField: any) => (
                    <LabeledText
                      {...titleField}
                      label="ZASADY TYTUŁU ARTYKUŁU"
                      multiline
                      placeholder="Opisz zasady tworzenia tytułów artykułów LinkedIn..."
                    />
                  )}
                />
              )}
              {field.subFields?.ContentRules && (
                <field.subFields.ContentRules
                  translations="Zasady treści artykułu są wymagane"
                  render={(contentField: any) => (
                    <LabeledText
                      {...contentField}
                      label="ZASADY TREŚCI ARTYKUŁU"
                      multiline
                      placeholder="Opisz zasady tworzenia treści artykułów LinkedIn..."
                    />
                  )}
                />
              )}
              {field.subFields?.DescriptionRules && (
                <field.subFields.DescriptionRules
                  translations="Zasady opisu artykułu są wymagane"
                  render={(descField: any) => (
                    <LabeledText
                      {...descField}
                      label="ZASADY OPISU ARTYKUŁU"
                      multiline
                      placeholder="Opisz zasady tworzenia opisów artykułów LinkedIn..."
                    />
                  )}
                />
              )}
            </ContentTypeSection>
          );
        }}
      />

      {/* Content section when LinkedIn Video exists */}
      <Fields.LinkedinVideo
        translations="Zasady LinkedIn Video są wymagane"
        render={(field) => {
          if (!field.value) return null;

          return (
            <ContentTypeSection config={contentTypeConfigs.linkedinVideo}>
              {field.subFields?.TitleRules && (
                <field.subFields.TitleRules
                  translations="Zasady tytułu wideo są wymagane"
                  render={(titleField: any) => (
                    <LabeledText
                      {...titleField}
                      label="ZASADY TYTUŁU WIDEO"
                      multiline
                      placeholder="Opisz zasady tworzenia tytułów wideo LinkedIn..."
                    />
                  )}
                />
              )}
              {field.subFields?.DescriptionRules && (
                <field.subFields.DescriptionRules
                  translations="Zasady opisu wideo są wymagane"
                  render={(descField: any) => (
                    <LabeledText
                      {...descField}
                      label="ZASADY OPISU WIDEO"
                      multiline
                      placeholder="Opisz zasady tworzenia opisów wideo LinkedIn..."
                    />
                  )}
                />
              )}
            </ContentTypeSection>
          );
        }}
      />

      {/* Content section when Twitter Tweet exists */}
      <Fields.TwitterTweet
        translations="Zasady Twitter Tweet są wymagane"
        render={(field) => {
          if (!field.value) return null;

          return (
            <ContentTypeSection config={contentTypeConfigs.twitterTweet}>
              {field.subFields?.TextRules && (
                <field.subFields.TextRules
                  translations="Zasady tekstu tweeta są wymagane"
                  render={(textField: any) => (
                    <LabeledText
                      {...textField}
                      label="ZASADY TEKSTU TWEETA"
                      multiline
                      placeholder="Opisz zasady tworzenia tekstów tweetów..."
                    />
                  )}
                />
              )}
            </ContentTypeSection>
          );
        }}
      />

      {/* Content section when Twitter Thread exists */}
      <Fields.TwitterThread
        translations="Zasady Twitter Thread są wymagane"
        render={(field) => {
          if (!field.value) return null;

          return (
            <ContentTypeSection config={contentTypeConfigs.twitterThread}>
              {field.subFields?.ThreadContentRules && (
                <field.subFields.ThreadContentRules
                  translations="Zasady treści wątku są wymagane"
                  render={(contentField: any) => (
                    <LabeledText
                      {...contentField}
                      label="ZASADY TREŚCI WĄTKU"
                      multiline
                      placeholder="Opisz zasady tworzenia wątków Twitter..."
                    />
                  )}
                />
              )}
            </ContentTypeSection>
          );
        }}
      />

      {/* Content section when Twitter Video exists */}
      <Fields.TwitterVideo
        translations="Zasady tekstu do wideo są wymagane"
        render={(field) => {
          if (!field.value) return null;

          return (
            <ContentTypeSection config={contentTypeConfigs.twitterVideo}>
              {field.subFields?.TextRules && (
                <field.subFields.TextRules
                  translations="Zasady tekstu do wideo są wymagane"
                  render={(textField: any) => (
                    <LabeledText
                      {...textField}
                      label="ZASADY TEKSTU DO WIDEO"
                      multiline
                      placeholder="Opisz zasady tworzenia tekstów do wideo Twitter..."
                    />
                  )}
                />
              )}
            </ContentTypeSection>
          );
        }}
      />

      {/* Content section when YouTube Video exists */}
      <Fields.YoutubeVideo
        translations="Zasady YouTube Video są wymagane"
        render={(field) => {
          if (!field.value) return null;

          return (
            <ContentTypeSection config={contentTypeConfigs.youtubeVideo}>
              {field.subFields?.TitleRules && (
                <field.subFields.TitleRules
                  translations="Zasady tytułu wideo są wymagane"
                  render={(titleField: any) => (
                    <LabeledText
                      {...titleField}
                      label="ZASADY TYTUŁU WIDEO"
                      multiline
                      placeholder="Opisz zasady tworzenia tytułów dla YouTube..."
                    />
                  )}
                />
              )}
              {field.subFields?.DescriptionRules && (
                <field.subFields.DescriptionRules
                  translations="Zasady opisu wideo są wymagane"
                  render={(descField: any) => (
                    <LabeledText
                      {...descField}
                      label="ZASADY OPISU WIDEO"
                      multiline
                      placeholder="Opisz zasady tworzenia opisów wideo YouTube..."
                    />
                  )}
                />
              )}
            </ContentTypeSection>
          );
        }}
      />

      {/* Content section when YouTube Shorts exists */}
      <Fields.YoutubeShorts
        translations="Zasady YouTube Shorts są wymagane"
        render={(field) => {
          if (!field.value) return null;

          return (
            <ContentTypeSection config={contentTypeConfigs.youtubeShorts}>
              {field.subFields?.TitleRules && (
                <field.subFields.TitleRules
                  translations="Zasady tytułu krótkiego wideo są wymagane"
                  render={(titleField: any) => (
                    <LabeledText
                      {...titleField}
                      label="ZASADY TYTUŁU SHORTS"
                      multiline
                      placeholder="Opisz zasady tworzenia tytułów dla YouTube Shorts..."
                    />
                  )}
                />
              )}
              {field.subFields?.DescriptionRules && (
                <field.subFields.DescriptionRules
                  translations="Zasady opisu krótkiego wideo są wymagane"
                  render={(descField: any) => (
                    <LabeledText
                      {...descField}
                      label="ZASADY OPISU SHORTS"
                      multiline
                      placeholder="Opisz zasady tworzenia opisów YouTube Shorts..."
                    />
                  )}
                />
              )}
            </ContentTypeSection>
          );
        }}
      />

      {/* Content section when Short Video Scenario exists */}
      <Fields.ShortVideoScenario
        translations="Zasady Short Video Scenario są wymagane"
        render={(field) => {
          if (!field.value) return null;

          return (
            <ContentTypeSection config={contentTypeConfigs.shortVideoScenario}>
              {field.subFields?.HookRules && (
                <field.subFields.HookRules
                  translations="Zasady hooka są wymagane"
                  render={(hookField: any) => (
                    <LabeledText
                      {...hookField}
                      label="ZASADY HOOKA"
                      multiline
                      placeholder="Opisz zasady tworzenia hooków dla krótkich wideo..."
                    />
                  )}
                />
              )}
              {field.subFields?.MainContentRules && (
                <field.subFields.MainContentRules
                  translations="Zasady głównej treści są wymagane"
                  render={(contentField: any) => (
                    <LabeledText
                      {...contentField}
                      label="ZASADY GŁÓWNEJ TREŚCI"
                      multiline
                      placeholder="Opisz zasady tworzenia głównej treści krótkich wideo..."
                    />
                  )}
                />
              )}
              {field.subFields?.CallToActionRules && (
                <field.subFields.CallToActionRules
                  translations="Zasady call to action są wymagane"
                  render={(ctaField: any) => (
                    <LabeledText
                      {...ctaField}
                      label="ZASADY CALL TO ACTION"
                      multiline
                      placeholder="Opisz zasady tworzenia call to action dla krótkich wideo..."
                    />
                  )}
                />
              )}
            </ContentTypeSection>
          );
        }}
      />

      {/* Content section when Long Video Scenario exists */}
      <Fields.LongVideoScenario
        translations="Zasady Long Video Scenario są wymagane"
        render={(field) => {
          if (!field.value) return null;

          return (
            <ContentTypeSection config={contentTypeConfigs.longVideoScenario}>
              {field.subFields?.IntroductionRules && (
                <field.subFields.IntroductionRules
                  translations="Zasady wprowadzenia są wymagane"
                  render={(introField: any) => (
                    <LabeledText
                      {...introField}
                      label="ZASADY WPROWADZENIA"
                      multiline
                      placeholder="Opisz zasady tworzenia wprowadzeń dla długich wideo..."
                    />
                  )}
                />
              )}
              {field.subFields?.MainPointsRules && (
                <field.subFields.MainPointsRules
                  translations="Zasady głównych punktów są wymagane"
                  render={(pointsField: any) => (
                    <LabeledText
                      {...pointsField}
                      label="ZASADY GŁÓWNYCH PUNKTÓW"
                      multiline
                      placeholder="Opisz zasady tworzenia głównych punktów dla długich wideo..."
                    />
                  )}
                />
              )}
              {field.subFields?.ConclusionRules && (
                <field.subFields.ConclusionRules
                  translations="Zasady zakończenia są wymagane"
                  render={(conclusionField: any) => (
                    <LabeledText
                      {...conclusionField}
                      label="ZASADY ZAKOŃCZENIA"
                      multiline
                      placeholder="Opisz zasady tworzenia zakończeń dla długich wideo..."
                    />
                  )}
                />
              )}
              {field.subFields?.CallToActionRules && (
                <field.subFields.CallToActionRules
                  translations="Zasady call to action są wymagane"
                  render={(ctaField: any) => (
                    <LabeledText
                      {...ctaField}
                      label="ZASADY CALL TO ACTION"
                      multiline
                      placeholder="Opisz zasady tworzenia call to action dla długich wideo..."
                    />
                  )}
                />
              )}
            </ContentTypeSection>
          );
        }}
      />

      {/* Content section when Carousel Ideas exists */}
      <Fields.CarouselIdeas
        translations="Zasady Carousel Ideas są wymagane"
        render={(field) => {
          if (!field.value) return null;

          return (
            <ContentTypeSection config={contentTypeConfigs.carouselIdeas}>
              {field.subFields?.TitleRules && (
                <field.subFields.TitleRules
                  translations="Zasady tytułu karuzeli są wymagane"
                  render={(titleField: any) => (
                    <LabeledText
                      {...titleField}
                      label="ZASADY TYTUŁU KARUZELI"
                      multiline
                      placeholder="Opisz zasady tworzenia tytułów karuzeli..."
                    />
                  )}
                />
              )}
              {field.subFields?.SlidesRules && (
                <field.subFields.SlidesRules
                  translations="Zasady slajdów są wymagane"
                  render={(slidesField: any) => (
                    <LabeledText
                      {...slidesField}
                      label="ZASADY SLAJDÓW"
                      multiline
                      placeholder="Opisz zasady tworzenia slajdów karuzeli..."
                    />
                  )}
                />
              )}
            </ContentTypeSection>
          );
        }}
      />

      {/* Content section when Long Form Article exists */}
      <Fields.LongFormArticle
        translations="Zasady Long Form Article są wymagane"
        render={(field) => {
          if (!field.value) return null;

          return (
            <ContentTypeSection config={contentTypeConfigs.longFormArticle}>
              {field.subFields?.HeadlineRules && (
                <field.subFields.HeadlineRules
                  translations="Zasady nagłówka są wymagane"
                  render={(headlineField: any) => (
                    <LabeledText
                      {...headlineField}
                      label="ZASADY NAGŁÓWKA"
                      multiline
                      placeholder="Opisz zasady tworzenia nagłówków artykułów..."
                    />
                  )}
                />
              )}
              {field.subFields?.IntroductionRules && (
                <field.subFields.IntroductionRules
                  translations="Zasady wstępu są wymagane"
                  render={(introField: any) => (
                    <LabeledText
                      {...introField}
                      label="ZASADY WSTĘPU"
                      multiline
                      placeholder="Opisz zasady tworzenia wstępów artykułów..."
                    />
                  )}
                />
              )}
              {field.subFields?.MainContentRules && (
                <field.subFields.MainContentRules
                  translations="Zasady głównej treści są wymagane"
                  render={(contentField: any) => (
                    <LabeledText
                      {...contentField}
                      label="ZASADY GŁÓWNEJ TREŚCI"
                      multiline
                      placeholder="Opisz zasady tworzenia głównej treści artykułów..."
                    />
                  )}
                />
              )}
              {field.subFields?.ConclusionRules && (
                <field.subFields.ConclusionRules
                  translations="Zasady podsumowania są wymagane"
                  render={(conclusionField: any) => (
                    <LabeledText
                      {...conclusionField}
                      label="ZASADY PODSUMOWANIA"
                      multiline
                      placeholder="Opisz zasady tworzenia podsumowań artykułów..."
                    />
                  )}
                />
              )}
            </ContentTypeSection>
          );
        }}
      />

      {/* Add Content Types Section - Only visible in edit mode */}
      {isEditing && mode === "summary" && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4">
            DODAJ FORMATY TREŚCI
          </h3>
          <div className="grid grid-cols-4 gap-2">
            <Fields.InstagramPost
              translations=""
              render={(field) => {
                if (!field.value) {
                  return (
                    <SmallAddContentTypeButton
                      config={contentTypeConfigs.instagramPost}
                      onClick={() => field.onChange({})}
                    />
                  );
                }
                return null;
              }}
            />

            <Fields.InstagramStory
              translations=""
              render={(field) => {
                if (!field.value) {
                  return (
                    <SmallAddContentTypeButton
                      config={contentTypeConfigs.instagramStory}
                      onClick={() => field.onChange({})}
                    />
                  );
                }
                return null;
              }}
            />

            <Fields.InstagramReel
              translations=""
              render={(field) => {
                if (!field.value) {
                  return (
                    <SmallAddContentTypeButton
                      config={contentTypeConfigs.instagramReel}
                      onClick={() => field.onChange({})}
                    />
                  );
                }
                return null;
              }}
            />

            <Fields.InstagramCarousel
              translations=""
              render={(field) => {
                if (!field.value) {
                  return (
                    <SmallAddContentTypeButton
                      config={contentTypeConfigs.instagramCarousel}
                      onClick={() => field.onChange({})}
                    />
                  );
                }
                return null;
              }}
            />

            <Fields.TiktokVideo
              translations=""
              render={(field) => {
                if (!field.value) {
                  return (
                    <SmallAddContentTypeButton
                      config={contentTypeConfigs.tiktokVideo}
                      onClick={() => field.onChange({})}
                    />
                  );
                }
                return null;
              }}
            />

            <Fields.LinkedinPost
              translations=""
              render={(field) => {
                if (!field.value) {
                  return (
                    <SmallAddContentTypeButton
                      config={contentTypeConfigs.linkedinPost}
                      onClick={() => field.onChange({})}
                    />
                  );
                }
                return null;
              }}
            />

            <Fields.LinkedinArticle
              translations=""
              render={(field) => {
                if (!field.value) {
                  return (
                    <SmallAddContentTypeButton
                      config={contentTypeConfigs.linkedinArticle}
                      onClick={() => field.onChange({})}
                    />
                  );
                }
                return null;
              }}
            />

            <Fields.LinkedinVideo
              translations=""
              render={(field) => {
                if (!field.value) {
                  return (
                    <SmallAddContentTypeButton
                      config={contentTypeConfigs.linkedinVideo}
                      onClick={() => field.onChange({})}
                    />
                  );
                }
                return null;
              }}
            />

            <Fields.TwitterTweet
              translations=""
              render={(field) => {
                if (!field.value) {
                  return (
                    <SmallAddContentTypeButton
                      config={contentTypeConfigs.twitterTweet}
                      onClick={() => field.onChange({})}
                    />
                  );
                }
                return null;
              }}
            />

            <Fields.TwitterThread
              translations=""
              render={(field) => {
                if (!field.value) {
                  return (
                    <SmallAddContentTypeButton
                      config={contentTypeConfigs.twitterThread}
                      onClick={() => field.onChange({})}
                    />
                  );
                }
                return null;
              }}
            />

            <Fields.TwitterVideo
              translations=""
              render={(field) => {
                if (!field.value) {
                  return (
                    <SmallAddContentTypeButton
                      config={contentTypeConfigs.twitterVideo}
                      onClick={() => field.onChange({})}
                    />
                  );
                }
                return null;
              }}
            />

            <Fields.LongFormArticle
              translations=""
              render={(field) => {
                if (!field.value) {
                  return (
                    <SmallAddContentTypeButton
                      config={contentTypeConfigs.longFormArticle}
                      onClick={() => field.onChange({})}
                    />
                  );
                }
                return null;
              }}
            />

            <Fields.YoutubeVideo
              translations=""
              render={(field) => {
                if (!field.value) {
                  return (
                    <SmallAddContentTypeButton
                      config={contentTypeConfigs.youtubeVideo}
                      onClick={() => field.onChange({})}
                    />
                  );
                }
                return null;
              }}
            />

            <Fields.YoutubeShorts
              translations=""
              render={(field) => {
                if (!field.value) {
                  return (
                    <SmallAddContentTypeButton
                      config={contentTypeConfigs.youtubeShorts}
                      onClick={() => field.onChange({})}
                    />
                  );
                }
                return null;
              }}
            />

            <Fields.ShortVideoScenario
              translations=""
              render={(field) => {
                if (!field.value) {
                  return (
                    <SmallAddContentTypeButton
                      config={contentTypeConfigs.shortVideoScenario}
                      onClick={() => field.onChange({})}
                    />
                  );
                }
                return null;
              }}
            />

            <Fields.LongVideoScenario
              translations=""
              render={(field) => {
                if (!field.value) {
                  return (
                    <SmallAddContentTypeButton
                      config={contentTypeConfigs.longVideoScenario}
                      onClick={() => field.onChange({})}
                    />
                  );
                }
                return null;
              }}
            />

            <Fields.CarouselIdeas
              translations=""
              render={(field) => {
                if (!field.value) {
                  return (
                    <SmallAddContentTypeButton
                      config={contentTypeConfigs.carouselIdeas}
                      onClick={() => field.onChange({})}
                    />
                  );
                }
                return null;
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
