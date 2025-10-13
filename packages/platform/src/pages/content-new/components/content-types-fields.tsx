import { FormFields } from "@arcote.tech/arc-react";
import { contentTypes } from "@narzedziadlatworcow.pl/context";
import { LabeledText } from "../../strategy/components/labeled-text";

export const InstagramPostFields = ({
  Fields,
}: {
  Fields: FormFields<(typeof contentTypes)["instagramPost"]>;
}) => {
  return (
    <div className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-2xl border border-white/50 p-6 space-y-4 shadow-lg shadow-black/5">
      {/* Decorative background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-orange-500/5 rounded-2xl" />

      {/* Header */}
      <div className="relative flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg text-white shadow-sm bg-gradient-to-br from-pink-500 to-orange-500">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        </div>
        <h3 className="font-medium text-gray-900 text-sm">Instagram Post</h3>
      </div>

      {/* Content */}
      <div className="relative space-y-4">
        <Fields.Description
          translations="Post description is required"
          render={(descField) => (
            <LabeledText
              {...descField}
              label="OPIS POSTA"
              multiline
              placeholder="Napisz opis dla posta Instagram..."
            />
          )}
        />
      </div>
    </div>
  );
};

export const InstagramStoryFields = ({
  Fields,
}: {
  Fields: FormFields<(typeof contentTypes)["instagramStory"]>;
}) => {
  return (
    <div className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-2xl border border-white/50 p-6 space-y-4 shadow-lg shadow-black/5">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-2xl" />

      <div className="relative flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg text-white shadow-sm bg-gradient-to-br from-purple-500 to-pink-500">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.2c3.2 0 3.6 0 4.9.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.6 4.8-4.9 4.9-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9-.1-1.3-.1-1.6-.1-4.8s0-3.6.1-4.8c.1-3.3 1.6-4.8 4.9-4.9 1.2-.1 1.5-.1 4.8-.1zm0-2.2C8.7 0 8.3 0 7 .1 3.4.3 1 2.7.8 6.3 0 7.6 0 8 0 12s0 4.4.1 5.7c.2 3.6 2.6 6 6.2 6.2 1.3.1 1.7.1 5.7.1s4.4 0 5.7-.1c3.6-.2 6-2.6 6.2-6.2.1-1.3.1-1.7.1-5.7s0-4.4-.1-5.7C23.7 2.7 21.3.3 17.7.1 16.4 0 16 0 12 0z" />
          </svg>
        </div>
        <h3 className="font-medium text-gray-900 text-sm">Instagram Story</h3>
      </div>

      <div className="relative space-y-4">
        <Fields.Text
          translations="Story text is required"
          render={(textField) => (
            <LabeledText
              {...textField}
              label="TEKST STORIES"
              multiline
              placeholder="Napisz tekst dla Instagram Stories..."
            />
          )}
        />
      </div>
    </div>
  );
};

export const InstagramReelFields = ({
  Fields,
}: {
  Fields: FormFields<(typeof contentTypes)["instagramReel"]>;
}) => {
  return (
    <div className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-2xl border border-white/50 p-6 space-y-4 shadow-lg shadow-black/5">
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-pink-500/5 rounded-2xl" />

      <div className="relative flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg text-white shadow-sm bg-gradient-to-br from-red-500 to-pink-500">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <polygon points="10,8 16,12 10,16" />
          </svg>
        </div>
        <h3 className="font-medium text-gray-900 text-sm">Instagram Reel</h3>
      </div>

      <div className="relative space-y-4">
        <Fields.Description
          translations="Reel description is required"
          render={(descField) => (
            <LabeledText
              {...descField}
              label="OPIS REELA"
              multiline
              placeholder="Napisz opis dla reela Instagram..."
            />
          )}
        />
      </div>
    </div>
  );
};

export const InstagramCarouselFields = ({
  Fields,
}: {
  Fields: FormFields<(typeof contentTypes)["instagramCarousel"]>;
}) => {
  return (
    <div className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-2xl border border-white/50 p-6 space-y-4 shadow-lg shadow-black/5">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl" />

      <div className="relative flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg text-white shadow-sm bg-gradient-to-br from-indigo-500 to-purple-500">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22 16V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2zm-11.5-6L9 12.5l1.5 2L13 11l3 4H8l2.5-3zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z" />
          </svg>
        </div>
        <h3 className="font-medium text-gray-900 text-sm">
          Instagram Carousel
        </h3>
      </div>

      <div className="relative space-y-4">
        <Fields.Description
          translations="Carousel description is required"
          render={(descField) => (
            <LabeledText
              {...descField}
              label="OPIS KARUZELI"
              multiline
              placeholder="Napisz opis dla karuzeli Instagram..."
            />
          )}
        />
      </div>
    </div>
  );
};

export const TiktokVideoFields = ({
  Fields,
}: {
  Fields: FormFields<(typeof contentTypes)["tiktokVideo"]>;
}) => {
  return (
    <div className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-2xl border border-white/50 p-6 space-y-4 shadow-lg shadow-black/5">
      <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-red-500/5 rounded-2xl" />

      <div className="relative flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg text-white shadow-sm bg-gradient-to-br from-black to-red-500">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43V7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.43z" />
          </svg>
        </div>
        <h3 className="font-medium text-gray-900 text-sm">TikTok Video</h3>
      </div>

      <div className="relative space-y-4">
        <Fields.Description
          translations="TikTok description is required"
          render={(descField) => (
            <LabeledText
              {...descField}
              label="OPIS WIDEO TIKTOK"
              multiline
              placeholder="Napisz opis dla wideo TikTok..."
            />
          )}
        />
      </div>
    </div>
  );
};

export const LinkedinPostFields = ({
  Fields,
}: {
  Fields: FormFields<(typeof contentTypes)["linkedinPost"]>;
}) => {
  return (
    <div className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-2xl border border-white/50 p-6 space-y-4 shadow-lg shadow-black/5">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-blue-700/5 rounded-2xl" />

      <div className="relative flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg text-white shadow-sm bg-gradient-to-br from-blue-600 to-blue-700">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        </div>
        <h3 className="font-medium text-gray-900 text-sm">LinkedIn Post</h3>
      </div>

      <div className="relative space-y-4">
        <Fields.Text
          translations="Post text is required"
          render={(textField) => (
            <LabeledText
              {...textField}
              label="TEKST POSTA LINKEDIN"
              multiline
              placeholder="Napisz tekst dla posta LinkedIn..."
            />
          )}
        />
      </div>
    </div>
  );
};

export const LinkedinArticleFields = ({
  Fields,
}: {
  Fields: FormFields<(typeof contentTypes)["linkedinArticle"]>;
}) => {
  return (
    <div className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-2xl border border-white/50 p-6 space-y-4 shadow-lg shadow-black/5">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/5 rounded-2xl" />

      <div className="relative flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg text-white shadow-sm bg-gradient-to-br from-blue-500 to-blue-600">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" />
          </svg>
        </div>
        <h3 className="font-medium text-gray-900 text-sm">LinkedIn Article</h3>
      </div>

      <div className="relative space-y-4">
        <Fields.Title
          translations="Article title is required"
          render={(titleField) => (
            <LabeledText
              {...titleField}
              label="TYTUŁ ARTYKUŁU"
              placeholder="Napisz tytuł artykułu LinkedIn..."
            />
          )}
        />

        <Fields.Content
          translations="Article content is required"
          render={(contentField) => (
            <LabeledText
              {...contentField}
              label="TREŚĆ ARTYKUŁU"
              multiline
              placeholder="Napisz treść artykułu LinkedIn..."
            />
          )}
        />

        <Fields.Description
          translations="Article description is required"
          render={(descField) => (
            <LabeledText
              {...descField}
              label="OPIS ARTYKUŁU"
              multiline
              placeholder="Napisz krótki opis artykułu..."
            />
          )}
        />
      </div>
    </div>
  );
};

export const LinkedinVideoFields = ({
  Fields,
}: {
  Fields: FormFields<(typeof contentTypes)["linkedinVideo"]>;
}) => {
  return (
    <div className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-2xl border border-white/50 p-6 space-y-4 shadow-lg shadow-black/5">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-700/5 to-indigo-600/5 rounded-2xl" />

      <div className="relative flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg text-white shadow-sm bg-gradient-to-br from-blue-700 to-indigo-600">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
          </svg>
        </div>
        <h3 className="font-medium text-gray-900 text-sm">LinkedIn Video</h3>
      </div>

      <div className="relative space-y-4">
        <Fields.Title
          translations="Video title is required"
          render={(titleField) => (
            <LabeledText
              {...titleField}
              label="TYTUŁ WIDEO"
              placeholder="Napisz tytuł wideo LinkedIn..."
            />
          )}
        />

        <Fields.Description
          translations="Video description is required"
          render={(descField) => (
            <LabeledText
              {...descField}
              label="OPIS WIDEO"
              multiline
              placeholder="Napisz opis wideo LinkedIn..."
            />
          )}
        />
      </div>
    </div>
  );
};

export const TwitterTweetFields = ({
  Fields,
}: {
  Fields: FormFields<(typeof contentTypes)["twitterTweet"]>;
}) => {
  return (
    <div className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-2xl border border-white/50 p-6 space-y-4 shadow-lg shadow-black/5">
      <div className="absolute inset-0 bg-gradient-to-br from-sky-400/5 to-blue-500/5 rounded-2xl" />

      <div className="relative flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg text-white shadow-sm bg-gradient-to-br from-sky-400 to-blue-500">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
          </svg>
        </div>
        <h3 className="font-medium text-gray-900 text-sm">Twitter Tweet</h3>
      </div>

      <div className="relative space-y-4">
        <Fields.Text
          translations="Tweet text is required"
          render={(textField) => (
            <LabeledText
              {...textField}
              label="TEKST TWEETA"
              multiline
              placeholder="Napisz tekst tweeta..."
            />
          )}
        />
      </div>
    </div>
  );
};

export const TwitterThreadFields = ({
  Fields,
}: {
  Fields: FormFields<(typeof contentTypes)["twitterThread"]>;
}) => {
  return (
    <div className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-2xl border border-white/50 p-6 space-y-4 shadow-lg shadow-black/5">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-2xl" />

      <div className="relative flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg text-white shadow-sm bg-gradient-to-br from-blue-500 to-indigo-500">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 6h-2l.5-1.5c.4-1.1-.1-2.3-1.2-2.7-1.1-.4-2.3.1-2.7 1.2L14.5 6H9.5l.5-1.5c.4-1.1-.1-2.3-1.2-2.7-1.1-.4-2.3.1-2.7 1.2L4.9 6H3c-1.1 0-2 .9-2 2s.9 2 2 2h1.5l-1 3H2c-1.1 0-2 .9-2 2s.9 2 2 2h1.1l-.5 1.5c-.4 1.1.1 2.3 1.2 2.7.2.1.5.1.8.1.9 0 1.7-.5 2.1-1.3l.5-1.5h5l-.5 1.5c-.4 1.1.1 2.3 1.2 2.7.2.1.5.1.8.1.9 0 1.7-.5 2.1-1.3l.5-1.5H21c1.1 0 2-.9 2-2s-.9-2-2-2h-1.1l1-3H22c1.1 0 2-.9 2-2s-.9-2-2-2zM16.5 13h-5l1-3h5l-1 3z" />
          </svg>
        </div>
        <h3 className="font-medium text-gray-900 text-sm">Twitter Thread</h3>
      </div>

      <div className="relative space-y-4">
        <Fields.ThreadContent
          translations="Thread content is required"
          render={(contentField) => (
            <LabeledText
              {...contentField}
              label="TREŚĆ WĄTKU"
              multiline
              rows={6}
              placeholder="Napisz treść wątku Twitter..."
            />
          )}
        />
      </div>
    </div>
  );
};

export const TwitterVideoFields = ({
  Fields,
}: {
  Fields: FormFields<(typeof contentTypes)["twitterVideo"]>;
}) => {
  return (
    <div className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-2xl border border-white/50 p-6 space-y-4 shadow-lg shadow-black/5">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-purple-500/5 rounded-2xl" />

      <div className="relative flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg text-white shadow-sm bg-gradient-to-br from-blue-400 to-purple-500">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
          </svg>
        </div>
        <h3 className="font-medium text-gray-900 text-sm">Twitter Video</h3>
      </div>

      <div className="relative space-y-4">
        <Fields.Text
          translations="Video text is required"
          render={(textField) => (
            <LabeledText
              {...textField}
              label="TEKST DO WIDEO"
              multiline
              placeholder="Napisz tekst do wideo Twitter..."
            />
          )}
        />
      </div>
    </div>
  );
};

export const YoutubeVideoFields = ({
  Fields,
}: {
  Fields: FormFields<(typeof contentTypes)["youtubeVideo"]>;
}) => {
  return (
    <div className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-2xl border border-white/50 p-6 space-y-4 shadow-lg shadow-black/5">
      <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-red-700/5 rounded-2xl" />

      <div className="relative flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg text-white shadow-sm bg-gradient-to-br from-red-600 to-red-700">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        </div>
        <h3 className="font-medium text-gray-900 text-sm">YouTube Video</h3>
      </div>

      <div className="relative space-y-4">
        <Fields.Title
          translations="Video title is required"
          render={(titleField) => (
            <LabeledText
              {...titleField}
              label="TYTUŁ WIDEO"
              placeholder="Napisz tytuł wideo YouTube..."
            />
          )}
        />

        <Fields.Description
          translations="Video description is required"
          render={(descField) => (
            <LabeledText
              {...descField}
              label="OPIS WIDEO"
              multiline
              rows={6}
              placeholder="Napisz opis wideo YouTube..."
            />
          )}
        />
      </div>
    </div>
  );
};

export const YoutubeShortsFields = ({
  Fields,
}: {
  Fields: FormFields<(typeof contentTypes)["youtubeShorts"]>;
}) => {
  return (
    <div className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-2xl border border-white/50 p-6 space-y-4 shadow-lg shadow-black/5">
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-orange-500/5 rounded-2xl" />

      <div className="relative flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg text-white shadow-sm bg-gradient-to-br from-red-500 to-orange-500">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            <rect x="16" y="2" width="6" height="20" rx="3" />
          </svg>
        </div>
        <h3 className="font-medium text-gray-900 text-sm">YouTube Shorts</h3>
      </div>

      <div className="relative space-y-4">
        <Fields.Title
          translations="Shorts title is required"
          render={(titleField) => (
            <LabeledText
              {...titleField}
              label="TYTUŁ SHORTS"
              placeholder="Napisz tytuł YouTube Shorts..."
            />
          )}
        />

        <Fields.Description
          translations="Shorts description is required"
          render={(descField) => (
            <LabeledText
              {...descField}
              label="OPIS SHORTS"
              multiline
              placeholder="Napisz opis YouTube Shorts..."
            />
          )}
        />
      </div>
    </div>
  );
};

export const LongFormArticleFields = ({
  Fields,
}: {
  Fields: FormFields<(typeof contentTypes)["longFormArticle"]>;
}) => {
  return (
    <div className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-2xl border border-white/50 p-6 space-y-4 shadow-lg shadow-black/5">
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-teal-500/5 rounded-2xl" />

      <div className="relative flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg text-white shadow-sm bg-gradient-to-br from-green-500 to-teal-500">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
          </svg>
        </div>
        <h3 className="font-medium text-gray-900 text-sm">Artykuł blogowy</h3>
      </div>

      <div className="relative space-y-4">
        <Fields.Headline
          translations="Article headline is required"
          render={(headlineField) => (
            <LabeledText
              {...headlineField}
              label="NAGŁÓWEK"
              placeholder="Napisz nagłówek artykułu..."
            />
          )}
        />

        <Fields.Introduction
          translations="Article introduction is required"
          render={(introField) => (
            <LabeledText
              {...introField}
              label="WSTĘP"
              multiline
              placeholder="Napisz wstęp artykułu..."
            />
          )}
        />

        <Fields.MainContent
          translations="Article main content is required"
          render={(contentField) => (
            <LabeledText
              {...contentField}
              label="GŁÓWNA TREŚĆ"
              multiline
              rows={10}
              placeholder="Napisz główną treść artykułu..."
            />
          )}
        />

        <Fields.Conclusion
          translations="Article conclusion is required"
          render={(conclusionField) => (
            <LabeledText
              {...conclusionField}
              label="PODSUMOWANIE"
              multiline
              placeholder="Napisz podsumowanie artykułu..."
            />
          )}
        />
      </div>
    </div>
  );
};

export const ShortVideoScenarioFields = ({
  Fields,
}: {
  Fields: FormFields<(typeof contentTypes)["shortVideoScenario"]>;
}) => {
  return (
    <div className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-2xl border border-white/50 p-6 space-y-4 shadow-lg shadow-black/5">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-indigo-600/5 rounded-2xl" />

      <div className="relative flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg text-white shadow-sm bg-gradient-to-br from-purple-600 to-indigo-600">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" />
          </svg>
        </div>
        <h3 className="font-medium text-gray-900 text-sm">
          Scenariusz krótkiego wideo
        </h3>
      </div>

      <div className="relative space-y-4">
        <Fields.Hook
          translations="Video hook is required"
          render={(hookField) => (
            <LabeledText
              {...hookField}
              label="HOOK"
              multiline
              placeholder="Napisz przyciągający hook dla krótkiego wideo..."
            />
          )}
        />

        <Fields.MainContent
          translations="Video main content is required"
          render={(contentField) => (
            <LabeledText
              {...contentField}
              label="GŁÓWNA TREŚĆ"
              multiline
              rows={6}
              placeholder="Napisz główną treść krótkiego wideo..."
            />
          )}
        />

        <Fields.CallToAction
          translations="Video call to action is required"
          render={(ctaField) => (
            <LabeledText
              {...ctaField}
              label="CALL TO ACTION"
              multiline
              placeholder="Napisz call to action dla krótkiego wideo..."
            />
          )}
        />
      </div>
    </div>
  );
};

export const LongVideoScenarioFields = ({
  Fields,
}: {
  Fields: FormFields<(typeof contentTypes)["longVideoScenario"]>;
}) => {
  return (
    <div className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-2xl border border-white/50 p-6 space-y-4 shadow-lg shadow-black/5">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-purple-700/5 rounded-2xl" />

      <div className="relative flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg text-white shadow-sm bg-gradient-to-br from-indigo-600 to-purple-700">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
          </svg>
        </div>
        <h3 className="font-medium text-gray-900 text-sm">
          Scenariusz długiego wideo
        </h3>
      </div>

      <div className="relative space-y-4">
        <Fields.Introduction
          translations="Video introduction is required"
          render={(introField) => (
            <LabeledText
              {...introField}
              label="WPROWADZENIE"
              multiline
              placeholder="Napisz wprowadzenie dla długiego wideo..."
            />
          )}
        />

        <Fields.MainPoints
          translations="Video main points are required"
          render={(pointsField) => (
            <LabeledText
              {...pointsField}
              label="GŁÓWNE PUNKTY"
              multiline
              rows={6}
              placeholder="Opisz główne punkty długiego wideo..."
            />
          )}
        />

        <Fields.Conclusion
          translations="Video conclusion is required"
          render={(conclusionField) => (
            <LabeledText
              {...conclusionField}
              label="ZAKOŃCZENIE"
              multiline
              placeholder="Napisz zakończenie dla długiego wideo..."
            />
          )}
        />

        <Fields.CallToAction
          translations="Video call to action is required"
          render={(ctaField) => (
            <LabeledText
              {...ctaField}
              label="CALL TO ACTION"
              multiline
              placeholder="Napisz call to action dla długiego wideo..."
            />
          )}
        />
      </div>
    </div>
  );
};

export const CarouselIdeasFields = ({
  Fields,
}: {
  Fields: FormFields<(typeof contentTypes)["carouselIdeas"]>;
}) => {
  return (
    <div className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-2xl border border-white/50 p-6 space-y-4 shadow-lg shadow-black/5">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-cyan-600/5 rounded-2xl" />

      <div className="relative flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg text-white shadow-sm bg-gradient-to-br from-teal-500 to-cyan-600">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22 16V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2zm-11.5-6L9 12.5l1.5 2L13 11l3 4H8l2.5-3zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z" />
          </svg>
        </div>
        <h3 className="font-medium text-gray-900 text-sm">
          Pomysły na karuzelę
        </h3>
      </div>

      <div className="relative space-y-4">
        <Fields.Title
          translations="Carousel title is required"
          render={(titleField) => (
            <LabeledText
              {...titleField}
              label="TYTUŁ KARUZELI"
              placeholder="Napisz tytuł karuzeli..."
            />
          )}
        />

        <Fields.Slides
          translations="Carousel slides are required"
          render={(slidesField) => (
            <LabeledText
              {...slidesField}
              label="SLAJDY"
              multiline
              rows={8}
              placeholder="Opisz zawartość slajdów karuzeli..."
            />
          )}
        />
      </div>
    </div>
  );
};

// Export mapping for all content type field components
export const contentTypeFieldsMap = {
  instagramPost: InstagramPostFields,
  instagramStory: InstagramStoryFields,
  instagramReel: InstagramReelFields,
  instagramCarousel: InstagramCarouselFields,
  tiktokVideo: TiktokVideoFields,
  linkedinPost: LinkedinPostFields,
  linkedinArticle: LinkedinArticleFields,
  linkedinVideo: LinkedinVideoFields,
  twitterTweet: TwitterTweetFields,
  twitterThread: TwitterThreadFields,
  twitterVideo: TwitterVideoFields,
  youtubeVideo: YoutubeVideoFields,
  youtubeShorts: YoutubeShortsFields,
  longFormArticle: LongFormArticleFields,
  shortVideoScenario: ShortVideoScenarioFields,
  longVideoScenario: LongVideoScenarioFields,
  carouselIdeas: CarouselIdeasFields,
} as const;
