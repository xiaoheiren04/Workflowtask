from django.db import models

# Create your models here.
class Workflow(models.Model):
    workflow_type = models.CharField(max_length=31)
    state = models.CharField(max_length=31)
    last_update = models.DateTimeField(auto_now=True)
    when_created = models.DateTimeField(auto_now_add=True)
    has_err = models.BooleanField(default=False)
    err_msg = models.TextField(blank=True)

    def __unicode__(self):
        return self.state
class WorkflowHistory(models.Model):
    user = models.CharField(max_length=21)
    action = models.CharField(max_length=31)
    message = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    err_msg = models.TextField(blank=True)
    has_err = models.BooleanField(default=False)
    workflow = models.ForeignKey(Workflow, related_name="workflow_histories", on_delete=models.CASCADE)
    state = models.CharField(max_length=31)

    def __unicode__(self):
        return self.message