# Generated by Django 2.0.3 on 2022-05-28 12:35

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('workflow', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Task',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('application', models.CharField(max_length=80)),
                ('jira', models.CharField(blank=True, max_length=31)),
                ('origination', models.TextField()),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tasks', to=settings.AUTH_USER_MODEL)),
                ('workflow', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='task', to='workflow.Workflow')),
            ],
        ),
    ]