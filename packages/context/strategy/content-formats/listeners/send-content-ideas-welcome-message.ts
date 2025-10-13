import { listener } from "@arcote.tech/arc";
import { contentIdeasChat } from "../../content-ideas/chat";
import contentFormatsStepCompleted from "../events/content-formats-step-completed";

export const sendContentIdeasWelcomeMessage = listener(
  "sendContentIdeasWelcomeMessage"
)
  .use([
    contentFormatsStepCompleted,
    contentIdeasChat.context.get("contentIdeasSystemMessageRequested"),
  ])
  .listenTo([contentFormatsStepCompleted])
  .handle(async (ctx, event) => {
    const { accountWorkspaceId } = event.payload;

    // Request a system message for the content-ideas step
    const message = `Na podstawie przekazanych informacji o formatach treści rozpocznij rozmowę o pomysłach na treści.

Zrób to w formie krótkiego, miłego powitania.  
Nie zadawaj jeszcze wielu szczegółowych pytań — zacznij od spokojnej, otwartej rozmowy.  
Możesz zadać 1-2 lekkie pytania zachęcające użytkownika do podzielenia się tym, jakie pomysły na treści ma w głowie.
Zaproponuj kilka konkretnych pomysłów na treści najbardziej prawdopodobnych dla jego formatów i stylu komunikacji.
`;

    // Emit system message requested event
    await ctx.get(contentIdeasChat.context.get("contentIdeasSystemMessageRequested")).emit({
      chatId: accountWorkspaceId,
      parts: [{ type: "text", value: message }],
      enabledTools: [],
      messageId: contentIdeasChat.messageId.generate(),
      previousResponseId: null,
    });
  });