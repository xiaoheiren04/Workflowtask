import json
import logging
from celery import shared_task
from workflow.fsm import FsmDefinition, FSM, MultipleAvailActions, reset_err
from workflow.models import Workflow

logger = logging.getLogger(__name__)

# human triggered action
@shared_task
def start_action_by_id(workflow_id, action, force_continue=False):
    logger.info("actioning on %d: %s" % (workflow_id, action))
    workflow_row = Workflow.objects.get(pk=workflow_id)
    current_state_name = workflow_row.state
    wf_type = workflow_row.workflow_type
    task_row = workflow_row.task.all()[0]
    app_id = task_row.application
    username = task_row.user.username
    workflow_id = workflow_row.id
    fsm_def = FsmDefinition(wf_type)
    myfsm = FSM(fsm_def, current_state_name)


    if "Standalone" in app_id:
        nodes_list = json.loads(task_row.computes)
        context = {"app_id": app_id,
            "workflow_id": workflow_id,
            "username": username,
            "nodes_list": nodes_list,
            "force_continue": force_continue,
        }
    else:
        context = {"app_id": app_id,
            "workflow_id": workflow_id,
            "username": username,
            # "servers": servers,
            # "server_ips": server_ips,
            # "regions": regions,
            "force_continue": force_continue,
        }
    if wf_type == "LB_enable_disable" or wf_type == "LB_create_vip" or wf_type == "LB_delete_vip" or wf_type == "LB_add_node_to_vip" or wf_type == "LB_remove_node_from_vip":
        context = json.loads(task_row.computes)
        context['workflow_id'] = workflow_id
        context['username'] = username
        context['force_continue'] = force_continue
    reset_err(workflow_id)
    state = myfsm.execute_action(action, context)
    need_confirm = state["need_confirm"]
    (has_err, err_msg) = get_err(workflow_id)
    if not need_confirm and not has_err:
        if wf_type == "downgrade_region" or wf_type == "LB_enable_disable" or wf_type == "LB_create_vip" or wf_type == "LB_delete_vip" or wf_type == "LB_add_node_to_vip" or wf_type == "LB_remove_node_from_vip":
            auto_start_by_id.delay(workflow_id, context)
        elif "Standalone" in app_id:
            auto_start_by_id.delay(workflow_id, context)
        else:
            auto_start_by_id.delay(workflow_id, context)

@shared_task
def auto_start_by_id(workflow_id, context):
    workflow_row = Workflow.objects.get(pk=workflow_id)
    current_state_name = workflow_row.state
    wf_type = workflow_row.workflow_type
    task_row = workflow_row.task.all()[0]
    app_id = task_row.application
    username = task_row.user.username
    workflow_id = workflow_row.id
    fsm_def = FsmDefinition(wf_type)
    myfsm = FSM(fsm_def, current_state_name)
    context["workflow_id"] = workflow_id
    context["username"] = username
    context["force_continue"] = False

    while True:
        try:
            (has_err, err_msg) = get_err(workflow_id)
            if has_err:
                msg = "cannot action on %d when error is not resolved" % workflow_id
                logger.info(msg)
                return

            actions = myfsm.get_current_actions(group="proceed")
            if len(actions) == 0:
                break
            if len(actions) > 1:
                raise MultipleAvailActions(current_state_name, actions)
            action_name = actions[0]["name"]
            logger.info("actioning on %d: %s" % (workflow_id, action_name))
            state = myfsm.execute_action(action_name, context)
            need_confirm = state["need_confirm"]
            if need_confirm:
                break
        except Exception as e:
            logger.error(e)

def get_err(workflow_id):
    workflow = Workflow.objects.get(pk=workflow_id)
    return (workflow.has_err, workflow.err_msg)