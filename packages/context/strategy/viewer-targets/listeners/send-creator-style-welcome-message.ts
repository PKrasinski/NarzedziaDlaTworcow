import { listener } from "@arcote.tech/arc";
import { creatorStyleChat } from "../../creator-style/chat";
import viewerTargetsStepCompleted from "../events/viewer-targets-step-completed";

export const sendCreatorStyleWelcomeMessage = listener(
  "sendCreatorStyleWelcomeMessage"
)
  .use([
    viewerTargetsStepCompleted,
    creatorStyleChat.context.get("creatorStyleSystemMessageRequested"),
  ])
  .listenTo([viewerTargetsStepCompleted])
  .handle(async (ctx, event) => {
    const { accountWorkspaceId } = event.payload;

    // Request a system message for the creator-style step
    const message = `Na podstawie przekazanych informacji o odbiorcach rozpocznij rozmowę o stylu komunikacji twórcy.

Zrób to w formie krótkiego, miłego powitania.  
Nie zadawaj jeszcze wielu szczegółowych pytań — zacznij od spokojnej, otwartej rozmowy.  
Możesz zadać 1-2 lekkie pytania zachęcające użytkownika do podzielenia się tym, jaki styl komunikacji do niego pasuje.
Zaproponuj kilka stylów komunikacji najbardziej prawdopodobnych dla jego odbiorców.
`;

    // Emit system message requested event
    await ctx.get(creatorStyleChat.context.get("creatorStyleSystemMessageRequested")).emit({
      chatId: accountWorkspaceId,
      parts: [{ type: "text", value: message }],
      enabledTools: [],
      messageId: creatorStyleChat.messageId.generate(),
      previousResponseId: null,
    });
  });
