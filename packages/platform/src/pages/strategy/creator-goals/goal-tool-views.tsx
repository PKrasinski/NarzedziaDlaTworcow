import { useCommands, useRevalidate } from "@/arc-provider";
import { object } from "@arcote.tech/arc";
import { goalSchema } from "@narzedziadlatworcow.pl/context/browser";
import type { ToolViewProps } from "@narzedziadlatworcow.pl/ui/components/chat/types";
import {
  EntityUpdatedSuccess,
  ToolWrapper,
} from "@narzedziadlatworcow.pl/ui/components/tool-wrapper";
import { EntityFormView } from "../components/entity-form-view";
import { GoalFormFields } from "./goal-form-fields";

const goalsObject = object(goalSchema);

// Create Goal Tool View
export const CreateGoalToolView = ({ params, result }: ToolViewProps) => {
  const { updateGoalForm } = useCommands();
  const revalidate = useRevalidate();

  // Extract goal data from params and goalId from result
  const goalData = params as any;
  const accountWorkspaceId = (params as any)?.accountWorkspaceId;
  const goalId = (result as any)?.success.goalId;

  if (!goalData || !goalId) {
    return <ToolWrapper message="Dodano nowy cel" />;
  }

  return (
    <ToolWrapper message="Dodano nowy cel">
      <EntityFormView
        schema={goalsObject}
        data={goalData}
        onUpdate={async (data) => {
          await updateGoalForm({
            goalId,
            goalUpdate: data,
            accountWorkspaceId,
          });
          revalidate("goals-messages");
        }}
        mode="tool"
        render={(Fields) => <GoalFormFields Fields={Fields} />}
      />
    </ToolWrapper>
  );
};

// Update Goal Tool View
export const UpdateGoalToolView = ({ params }: ToolViewProps) => {
  const { updateGoalForm } = useCommands();
  const revalidate = useRevalidate();

  // Extract goal data from params
  const goalUpdate = params as any;

  console.log("goalUpdate", goalUpdate);
  if (!goalUpdate) {
    return <EntityUpdatedSuccess entityType="cel" />;
  }

  return (
    <EntityUpdatedSuccess entityType="cel">
      <EntityFormView
        schema={goalsObject}
        data={goalUpdate}
        onUpdate={async (data) => {
          await updateGoalForm({
            goalId: goalUpdate.goalId,
            accountWorkspaceId: goalUpdate.accountWorkspaceId,
            goalUpdate: data,
          });
          revalidate("goals-messages");
        }}
        mode="tool"
        render={(Fields) => <GoalFormFields Fields={Fields} />}
      />
    </EntityUpdatedSuccess>
  );
};
