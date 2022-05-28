from django.db import models
from django.contrib.auth.models import User
from workflow.models import Workflow, WorkflowHistory
# Create your models here.

class Task(models.Model):
    application = models.CharField(max_length=80,blank=False)
    jira = models.CharField(max_length=31, blank=True)
    origination = models.TextField()
    user = models.ForeignKey(User,null=False,related_name="tasks",on_delete=models.CASCADE)
    workflow = models.ForeignKey(Workflow, null=True,related_name="task",on_delete=models.CASCADE)