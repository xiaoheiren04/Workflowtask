import re
import datetime
import math
import json
import logging
import socket
import time
import csv
from string import Template
from dateutil.relativedelta import relativedelta
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q
from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate,login,logout
from django.views.decorators.http import require_POST, require_http_methods
from django.core.paginator import Paginator
from django.utils import timezone
from workflow.models import Workflow
from mainapp.models import Task
from workflow.fsm import create_workflow, FsmDefinition, FSM
from mainapp.celery_task import auto_start_by_id,start_action_by_id

def index(request):
    return render(request, "mainapp/login.html")

@require_POST
def dologin(request):
    username = request.POST.get("user", "")
    tokencode = request.POST.get("tokencode", "")
    try:
        user = authenticate(
            username=username, password=tokencode)
        if user is not None:
            login(request, user)
            return JsonResponse({
                "success": True,
                "msg": "",
            })
        else:
            print("can't authenticate the user")
    except Exception as e:
        msg = str(e)
        return JsonResponse({
            "success": False,
            "msg": msg,
        })


def dologout(request):
    logout(request)
    return redirect("/")

@login_required()
def update_version_html(request):
    return render(request, "mainapp/update_version.html")

@login_required()
def my_tasks(request):
    login_as = request.GET.get("login_as", request.user.username)
    task_rows = Task.objects.filter(
        Q(user__username=login_as) & \
        ~Q(workflow__state="COMPLETED") & \
        ~Q(workflow__state="CANCELLED")).order_by("-id").all()
    task_count = task_rows.count()
    page_num = math.ceil(task_count/25)
    paginator = Paginator(task_rows, 25)
    page = int(request.GET.get("page", "1"))
    pages = list(range(1, page_num+1, 1))
    tasks = paginator.get_page(page)
    result = []
    for task in tasks:
        fsm_def = FsmDefinition(task.workflow.workflow_type)
        state_uiname = fsm_def.get_state_ui_name(task.workflow.state)
        if task.workflow.state == "STARTED_BAKE_SEVEN" or task.workflow.state == "BAKE_FOR_SLC" or task.workflow.state == "BAKE_FOR_LVSAZ01" or task.workflow.state == "BAKE_FOR_LVS" or task.workflow.state == "BAKE_FOR_RNOAZ01" or task.workflow.state == "BAKE_FOR_RNOAZ02" or task.workflow.state == "BAKE_FOR_RNOAZ03" or task.workflow.state == "BAKE_FOR_RNO" or task.workflow.state == "BAKE_FOR_DECOMM_SLC" or task.workflow.state == "BAKE_FOR_DECOMM_LVSAZ01" or task.workflow.state == "BAKE_FOR_DECOMM_LVS" or task.workflow.state == "BAKE_FOR_DECOMM_RNOAZ01" or task.workflow.state == "BAKE_FOR_DECOMM_RNOAZ02" or task.workflow.state == "BAKE_FOR_DECOMM_RNOAZ03":
            state_uiname = "{} ({} Days)".format(state_uiname, task.bake_days)
        result.append({
            "id": task.id,
            "application": task.application,
            "type": task.workflow.workflow_type,
            # "bake_days": task.bake_days,
            "state_uiname": state_uiname,
            "state": task.workflow.state,
            "has_err": task.workflow.has_err,
            "err_msg": task.workflow.err_msg,
        })
    return render(request, "mainapp/my_tasks.html", {"curr_page": page, "pages": pages, "applications": result})

@login_required()
def my_task_details(request, application_id):
    task_row = Task.objects.get(pk=application_id)
    application = task_row.application
    origination = task_row.origination
    fsm_def = FsmDefinition(task_row.workflow.workflow_type)
    state_uiname = fsm_def.get_state_ui_name(task_row.workflow.state)
    state = task_row.workflow.state
    workflow_row = task_row.workflow
    has_err = workflow_row.has_err
    err_msg = workflow_row.err_msg
    history_rows = workflow_row.workflow_histories.order_by("timestamp").all()
    flow_done = []
    for history_row in history_rows:
        history = get_history_details(fsm_def, history_row)
        flow_done.append(history)

    flow_todo = fsm_def.get_flow_data_from(workflow_row.state)
    flow_data = {"state": state,
        "flow_done": flow_done,
        "flow_todo": flow_todo,
        "has_err": has_err
    }

    # jobs = get_jobs(workflow_row)
    # changes = get_changes(workflow_row)
    return render(request, "mainapp/my_task_details.html", {
        "application": application,
        "origination": origination,
        "state_uiname": state_uiname,
        "has_err": has_err,
        "err_msg": err_msg,
        # "jobs": jobs,
        # "changes": changes,
        "flow_data": json.dumps(flow_data),
    })

def get_history_details(fsm_def, history_row):
    # change_rows = history_row.changes.all()
    # job_rows = history_row.jobs.all()
    # jira_rows = history_row.jiras.all()
    state_name = history_row.state
    state_uiname = fsm_def.get_state_ui_name(state_name)
    # changes = []
    # for change_row in change_rows:
    #     changes.append({
    #         "cr_num": change_row.cr_num,
    #         "cr_state": change_row.cr_state,
    #     })

    # jobs = []
    # for job_row in job_rows:
    #     jobs.append({
    #         "job_url": job_row.job_url,
    #         "job_type": job_row.job_type,
    #         "job_state": job_row.job_state,
    #         "error": job_row.error,
    #         "rollback": job_row.rollback,
    #     })
    #
    # jiras = []
    # for jira_row in jira_rows:
    #     jiras.append({
    #         "jira_num": jira_row.jira_num,
    #         "jira_state": jira_row.jira_state,
    #     })

    result = {
        "user": history_row.user,
        "action": history_row.action,
        "timestamp": history_row.timestamp.strftime("%Y-%m-%d %H:%M"),
        "message": history_row.message,
        "err_msg": history_row.err_msg,
        "has_err": history_row.has_err,
        "state_name": state_name,
        "state_uiname": state_uiname,
        # "changes": changes,
        # "jobs": jobs,
        # "jiras": jiras
    }
    return result
@login_required
@csrf_exempt
@require_POST
def start_update(request):
    body = request.body.decode("utf-8")
    data = json.loads(body)
    app_id = data["app_id"].strip()
    origination = data["origination"].strip()

    try:
        (task_id, msg) = update_app(request.user, app_id, origination)
        return JsonResponse({
            "success": True,
            "msg": msg,
        })
    except Exception as e:
        msg = str(e)
        return JsonResponse({
            "success": False,
            "msg": msg,
        })
def update_app(user, app_id, origination):
    workflow_id = create_workflow("update_app")
    workflow_row = Workflow.objects.get(pk=workflow_id)
    task_row = Task(
        application = app_id,
        origination = origination,
        user = user,
        workflow = workflow_row,
    )
    task_row.save()
    cloudmgr_context = {"app_id": app_id, "image_version": origination}
    auto_start_by_id.delay(workflow_row.id, cloudmgr_context)
    msg = ""
    if app_id is None:
        msg = "."
    return (task_row.id, msg)

@login_required
@csrf_exempt
@require_POST
def start_action(request):
    body = request.body.decode("utf-8")
    data = json.loads(body)
    task_id = data.get("task_uuid")
    action = data.get("action")

    task_row = Task.objects.get(pk=task_id)
    workflow_row = task_row.workflow
    if action == "retry":
        wf_type = workflow_row.workflow_type
        wf_state = workflow_row.state
        fsm_def = FsmDefinition(wf_type)
        myfsm = FSM(fsm_def, wf_state)
        actions = myfsm.get_current_actions(group="retry")
        if len(actions) == 0:
            actions = myfsm.get_current_actions(group="proceed")
            if len(actions) == 0:
                return JsonResponse({
                    "success": False,
                    "msg": "no available actions",
                })

        force_continue = False
        start_action_by_id.delay(workflow_row.id, actions[0]["name"], force_continue)
        return JsonResponse({
            "success": True,
            "msg": "",
        })
    elif action == "continue":
        wf_type = workflow_row.workflow_type
        wf_state = workflow_row.state
        fsm_def = FsmDefinition(wf_type)
        myfsm = FSM(fsm_def, wf_state)
        actions = myfsm.get_current_actions(group="proceed")
        if len(actions) == 0:
            return JsonResponse({
                "success": False,
                "msg": "no available actions",
            })

        force_continue = True
        start_action_by_id.delay(workflow_row.id, actions[0]["name"], force_continue)

        return JsonResponse({
            "success": True,
            "msg": "",
        })
    else:
        start_action_by_id.delay(workflow_row.id, action)
        return JsonResponse({
            "success": True,
            "msg": "",
        })


@login_required()
def all_tasks(request):
    kw = request.GET.get("keyword", "")
    status = request.GET.get("status", "")
    task_qs = Task.objects.all()

    if kw:
        task_qs = task_qs.filter(application__startswith=kw)
    if status == "Completed":
        task_qs = task_qs.filter(workflow__state="COMPLETED")
    if status == "Paused":
        task_qs = task_qs.filter(Q(workflow__has_err=True) & ~Q(workflow__state="CANCELLED"))

    task_qs = task_qs.order_by("-id")
    task_count = task_qs.count()
    page_num = math.ceil(task_count/25)
    paginator = Paginator(task_qs, 25)
    page = int(request.GET.get('page', '1'))
    pages = list(range(1, page_num+1, 1))
    tasks = paginator.get_page(page)
    result = []
    for task in tasks:
        fsm_def = FsmDefinition(task.workflow.workflow_type)
        state_uiname = fsm_def.get_state_ui_name(task.workflow.state)
        state = task.workflow.state
        has_err = task.workflow.has_err
        err_msg = task.workflow.err_msg
        result.append({
            "id": task.id,
            "username": task.user.username,
            "application": task.application,
            "type": task.workflow.workflow_type,
            "state_uiname": state_uiname,
            "state": state,
            "has_err": has_err,
            "err_msg": err_msg,
        })
    return render(request, "mainapp/all_tasks.html", {"keyword": kw, "status": status, "curr_page": page, "pages": pages, "applications": result})

@login_required()
def all_task_details(request, application_id):
    task_row = Task.objects.get(pk=application_id)
    application = task_row.application
    origination = task_row.origination
    fsm_def = FsmDefinition(task_row.workflow.workflow_type)
    state_uiname = fsm_def.get_state_ui_name(task_row.workflow.state)
    state = task_row.workflow.state
    workflow_row = task_row.workflow
    has_err = workflow_row.has_err
    err_msg = workflow_row.err_msg
    history_rows = workflow_row.workflow_histories.order_by("timestamp").all()
    flow_done = []
    for history_row in history_rows:
        history = get_history_details(fsm_def, history_row)
        flow_done.append(history)

    flow_todo = fsm_def.get_flow_data_from(workflow_row.state)
    flow_data = {"state": state,
        "flow_done": flow_done,
        "flow_todo": flow_todo,
        "has_err": has_err
    }

    # job_rows = Job.objects.select_related('workflow_history').filter(
    #     workflow_history__workflow=workflow_row)
    # jobs = get_jobs(workflow_row)
    # changes = get_changes(workflow_row)
    return render(request, "mainapp/all_task_details.html", {
        "application": application,
        "origination": origination,
        "state_uiname": state_uiname,
        "has_err": has_err,
        "err_msg": err_msg,
        # "jobs": jobs,
        # "changes": changes,
        "flow_data": json.dumps(flow_data),
    })
# @login_required
# def overview(request):
#     task_rows = Task.objects.select_related('user', 'workflow').filter(
#         workflow__state="COMPLETED").order_by("-workflow__last_update")[:10]
#     recent_tasks = []
#     for task_row in task_rows:
#         username = task_row.user.username
#         application = task_row.application
#         last_update = task_row.workflow.last_update.strftime("%Y-%m-%d %H:%M:%S")
#         recent_tasks.append({
#             "username": username,
#             "application": application,
#             "last_update": last_update,
#         })
#
#     return render(request, "mainapp/overview.html", {"recent_tasks": recent_tasks})


