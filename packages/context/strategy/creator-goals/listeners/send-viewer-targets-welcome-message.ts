import { listener } from "@arcote.tech/arc";
import { viewerTargetsChat } from "../../viewer-targets/chat";
import creatorGoalsStepCompleted from "../events/creator-goals-step-completed";

export const sendViewerTargetsWelcomeMessage = listener(
  "sendViewerTargetsWelcomeMessage"
)
  .use([
    creatorGoalsStepCompleted,
    viewerTargetsChat.context.get("viewerTargetsSystemMessageRequested"),
  ])
  .listenTo([creatorGoalsStepCompleted])
  .handle(async (ctx, event) => {
    const { accountWorkspaceId } = event.payload;

    // Request a system message for the viewer-targets step
    const message = `Na podstawie przekazanych informacji o Twoich celach jako twórcy rozpocznij rozmowę o grupach docelowych.

Zrób to w formie krótkiego, miłego powitania.  
Nie zadawaj jeszcze wielu szczegółowych pytań — zacznij od spokojnej, otwartej rozmowy.  
Możesz zadać 1-2 lekkie pytania zachęcające użytkownika do podzielenia się tym, kto jest jego docelowym odbiorcą.
Zaproponuj kilka grup docelowych najbardziej prawdopodobnych dla twórcy.
`;

    // Emit system message requested event
    await ctx.get(viewerTargetsChat.context.get("viewerTargetsSystemMessageRequested")).emit({
      chatId: accountWorkspaceId,
      parts: [{ type: "text", value: message }],
      enabledTools: [],
      messageId: viewerTargetsChat.messageId.generate(),
      previousResponseId: null,
    });
  });
