# Generated by Django 2.0.3 on 2022-05-28 12:35

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Workflow',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('workflow_type', models.CharField(max_length=31)),
                ('state', models.CharField(max_length=31)),
                ('last_update', models.DateTimeField(auto_now=True)),
                ('when_created', models.DateTimeField(auto_now_add=True)),
                ('has_err', models.BooleanField(default=False)),
                ('err_msg', models.TextField(blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='WorkflowHistory',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user', models.CharField(max_length=21)),
                ('action', models.CharField(max_length=31)),
                ('message', models.TextField(blank=True)),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('err_msg', models.TextField(blank=True)),
                ('has_err', models.BooleanField(default=False)),
                ('state', models.CharField(max_length=31)),
                ('workflow', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='workflow_histories', to='workflow.Workflow')),
            ],
        ),
    ]
