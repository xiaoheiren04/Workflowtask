from workflow.models import Workflow, WorkflowHistory
import logging

logger = logging.getLogger(__name__)

def submit_update_app(current_state_name, action_name, next_state_name, **context):
    podnameandnamespace = context["app_id"]
    newimage = context["image_version"]
    workflow_id = context["workflow_id"]
    user = context["username"]
    workflow = Workflow.objects.get(pk=workflow_id)
    history = WorkflowHistory(
        user = user,
        workflow = workflow,
        action = action_name,
        state=next_state_name,
        message = "start update app image",
    )
    history.save()
    workflow.state = next_state_name
    workflow.save()
    logger.info("successfully submitted update %s image job" %podnameandnamespace)
def check_workload_image(current_state_name, action_name, next_state_name, **context):
    podnameandnamespace = context["app_id"]
    newimage = context["image_version"]
    workflow_id = context["workflow_id"]
    user = context["username"]
    workflow = Workflow.objects.get(pk=workflow_id)
    history = WorkflowHistory(
        user=user,
        workflow=workflow,
        action=action_name,
        state=next_state_name,
        message="start check current workload image",
    )
    history.save()
    workflow.state = next_state_name
    workflow.save()
    logger.info("successfully checked current workload image")

def complete_update_app(current_state_name, action_name, next_state_name, **context):
    podnameandnamespace = context["app_id"]
    newimage = context["image_version"]
    workflow_id = context["workflow_id"]
    user = context["username"]
    workflow = Workflow.objects.get(pk=workflow_id)
    history = WorkflowHistory(
        user = user,
        workflow = workflow,
        action = action_name,
        state=next_state_name,
        message = "complete update app image",
    )
    history.save()
    workflow.state = next_state_name
    workflow.save()
    logger.info("successfully completed update app job")

def cancel(current_state_name, action_name, next_state_name, **context):
    workflow_id = context["workflow_id"]
    user = context["username"]
    workflow = Workflow.objects.get(pk=workflow_id)
    history = WorkflowHistory(
        user = user,
        workflow = workflow,
        action = action_name,
        state=next_state_name,
        message = "cancel this update app image",
    )
    history.save()
    workflow.state = next_state_name
    workflow.save()
    logger.info("successfully cancelled update app job")