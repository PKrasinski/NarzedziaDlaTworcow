import { listener } from "@arcote.tech/arc";
import { goalsChat } from "../../creator-goals/chat";
import creatorIdentityStepCompleted from "../events/creator-identity-step-completed";

export const sendCreatorGoalsWelcomeMessage = listener(
  "sendCreatorGoalsWelcomeMessage"
)
  .use([
    creatorIdentityStepCompleted,
    goalsChat.context.get("goalsSystemMessageRequested"),
  ])
  .listenTo([creatorIdentityStepCompleted])
  .handle(async (ctx, event) => {
    const { accountWorkspaceId } = event.payload;

    // Request a system message for the creator-goals step
    const message = `Na podstawie przekazanej tożsamości twórcy rozpocznij pierwszą rozmowę z użytkownikiem.

Zrób to w formie krótkiego, miłego powitania.  
Nie zadawaj jeszcze wielu szczegółowych pytań — zacznij od spokojnej, otwartej rozmowy.  
Możesz zadać 1-2 lekkie pytania zachęcające użytkownika do podzielenia się tym, co chciałby osiągnąć dzięki swojej twórczości.
`;

    // Emit system message requested event
    await ctx.get(goalsChat.context.get("goalsSystemMessageRequested")).emit({
      chatId: accountWorkspaceId,
      parts: [{ type: "text", value: message }],
      enabledTools: [],
      messageId: goalsChat.messageId.generate(),
      previousResponseId: null,
    });
  });
