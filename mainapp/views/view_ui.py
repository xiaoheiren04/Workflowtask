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
# from django.contrib import auth
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate,login,logout
from django.views.decorators.http import require_POST, require_http_methods
from django.core.paginator import Paginator
from django.utils import timezone


SUP_ARCH = ["generic", "cal", "v3"]

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


