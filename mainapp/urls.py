from django.urls import path, re_path
from .views import view_ui

urlpatterns = [
    path('', view_ui.index),
    # login logout
    path('api/login/', view_ui.dologin),
    path('api/logout/', view_ui.dologout),

    # api
    # path('api/search_server_by_name/<str:hostname>/', view_ui.search_server_by_name),
    # path('api/search_server_by_ip/<str:ip>/', view_ui.search_server_by_ip),
    # path('api/search_lb_server_exist/<str:lbserver>/', view_ui.search_lb_server_exist),
    # path('api/search_vip_address_exist/<str:ip>/', view_ui.search_vip_address_exist),
    # path('api/search_app/<str:app_id>/', view_ui.search_app),
    # path('api/search_region/<str:app_id>/', view_ui.search_region),
    # path('api/<str:topo_id>/update/', view_ui.update_lbsync_topo),
    # path('api/get_state/<int:task_id>/', view_ui.get_state),
    # path('api/start_decomm/<str:app_id>/', view_ui.api_start_decomm),

    # workflow
    path('workflow/start_update/', view_ui.start_update),

    # UI
    path('update_version/', view_ui.update_version_html),
    path('my_tasks/', view_ui.my_tasks),
    path('workflow/action/', view_ui.start_action),
    path('my_task_details/<int:application_id>/', view_ui.my_task_details),
    path('all_tasks/', view_ui.all_tasks, name='all_tasks'),
    path('all_task_details/<int:application_id>/', view_ui.all_task_details),
    path('overview/', view_ui.overview),
]
