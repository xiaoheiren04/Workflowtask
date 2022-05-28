var decomm = {
    action: undefined,
    task_uuid: undefined,
    onkeyupDecomm: function(event) {
        var app = $("#decomm-topo").val();
        var origination = $("#origination").val();
        if($.trim(app) != '' && $.trim(origination) != '') {
            $("#btn-decomm-topo").prop('disabled', false);
        }
        else {
            $("#btn-decomm-topo").prop('disabled', true);
        }
    },
    onkeyupDecomm_standalone: function(event) {
        var standalone = $("#decomm-standalone").val();
        if($.trim(standalone) != '') {
            $("#btn-decomm-standalone").prop('disabled', false);
        }
        else {
            $("#btn-decomm-standalone").prop('disabled', true);
        }
    },
    onkeyupDowngrade_region: function(event) {
        var downgrade_topo = $("#downgrade_topo").val();
        var downgrade_region = $("#downgrade_region").val();
        var origination = $("#origination").val();
        if($.trim(downgrade_topo) != '' && $.trim(downgrade_region) != '' && $.trim(origination) != '') {
            $("#btn-downgrade_region").prop('disabled', false);
        }
        else {
            $("#btn-downgrade_region").prop('disabled', true);
        }
    },
    onkeyupDecomm_standalone_email: function(event) {
        var standalone = $("#decomm-standalone-email").val();
        if($.trim(standalone) != '') {
            $("#btn-decomm-standalone-email").prop('disabled', false);
        }
        else {
            $("#btn-decomm-standalone-email").prop('disabled', true);
        }
    },
    confirmDecomm: function(event) {
        var app_id = $("#decomm-topo").val();
        $("#cfm-app-id").html(app_id);
        $("#decomm-cfm-modal").modal("show");
    },
    confirmDecomm_standalone: function(event) {
        var standalone_nodes = $("#decomm-standalone").val();
        $("#cfm-standalone-nodes").html(standalone_nodes);
        $("#decomm-standalone-cfm-modal").modal("show");
    },
    confirmDowngrade_region: function(event) {
        var downgrade_topo = $("#downgrade_topo").val();
        var downgrade_region = $("#downgrade_region").val();
        $("#cfm-downgrade_topo").html(downgrade_topo);
        $("#cfm-downgrade_region").html(downgrade_region);
        $("#downgrade_region-cfm-modal").modal("show");
    },
    confirmDecomm_standalone_email: function(event) {
        var email_nodes = $("#decomm-standalone-email").val();
        $("#cfm-email-nodes").html(email_nodes);
        $("#email-cfm-modal").modal("show");
    },
    startDecomm: function(event) {
        var app_id = $("#decomm-topo").val();
        var orig = $("#origination").val();
        var payload = JSON.stringify({"app_id": app_id, "origination": orig});

	    $.blockUI({ css: {
            border: 'none',
            padding: '15px',
            backgroundColor: '#000',
            '-webkit-border-radius': '10px',
            '-moz-border-radius': '10px',
            opacity: .5,
            color: '#fff'
        }} );

        $.ajax({
            url: "/workflow/start_decomm/",
            method: "POST",
            dataType: "json",
            contentType : 'application/json',
            data: payload
        })
        .success(function(data) {
			$.unblockUI();
            if(data.success) {
                var html;
                if(data.msg == "") {
                    html = '<span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span> Started decomming <span id="resp-app-id">' + app_id + '</span>';
                }
                else {
                    html = '<span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span> Started decomming <span id="resp-app-id">' + app_id + '</span><br/>' + '<span class="glyphicon glyphicon-warning-sign" aria-hidden="true"></span> <span class="text-danger">' + data.msg + '</span>';
                }
                $("#decomm-resp-info").html(html);
                $("#decomm-resp-modal").modal("show");
                setTimeout(function() { window.location = "/my_tasks/"; }, 3000);
            }
            else {
                var html = '<span class="glyphicon glyphicon-alert" aria-hidden="true"></span> Decomm failed as ' + data.msg + '</span>';
                $("#decomm-resp-info").html(html);
                $("#decomm-resp-modal").modal("show");
                //setTimeout(function() { window.location.reload();}, 2000);
            }
        });
    },
    startDecomm_standalone: function(event) {
        var standalone_nodes = $("#decomm-standalone").val();
        var payload = JSON.stringify({"standalone_nodes": standalone_nodes});
        $.ajax({
            url: "/workflow/start_decomm_standalone/",
            method: "POST",
            dataType: "json",
            contentType : 'application/json',
            data: payload
        })
        .success(function(data) {
            if(data.success) {
                var html = '<span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span> Started decomming <span id="resp-app-id">' + standalone_nodes + '</span>';
                $("#decomm-resp-info").html(html);
                $("#decomm-resp-modal").modal("show");
                $("#decomm-standalone").val('');
                $("#btn-decomm-standalone").prop('disabled', true)
                if(data.need_check){
                    var need_check_nodes = data.need_check_node.toString();
                    var need_check_nodes = need_check_nodes.replace(/,/g, "<br>");
                    var html1 = '<span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span> These nodes need check manually, maybe it is nwnom vm or have been decommed. <span id="need-check-nodes">' + need_check_nodes + '</span>';
                    $("#decomm-need-check-info").html(html1);
                    $("#decomm-need-check-modal").modal("show");
//                    $("#decomm-standalone").val('');
//                    $("#btn-decomm-standalone").prop('disabled', true);
                }
            }
            else {
                var html = '<span class="glyphicon glyphicon-alert" aria-hidden="true"></span> Decomm failed as ' + data.msg + '</span>';
                $("#decomm-resp-info").html(html);
                $("#decomm-resp-modal").modal("show");
                //setTimeout(function() { window.location.reload();}, 2000);
            }
        });
    },
    startDowngrade_region: function(event) {
        var downgrade_region = $("#downgrade_region").val();
        var downgrade_topo = $("#downgrade_topo").val();
        var origination = $("#origination").val();
        var payload = JSON.stringify({"downgrade_region": downgrade_region, "downgrade_topo": downgrade_topo, "origination": origination});
        $.ajax({
            url: "/workflow/start_downgrade_region/",
            method: "POST",
            dataType: "json",
            contentType : 'application/json',
            data: payload
        })
        .success(function(data) {
            if(data.success) {
                var html = '<span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span> Started downgrading <span id="resp-app-id">' + downgrade_topo + '</span>';
                $("#downgrade_region-resp-info").html(html);
                $("#downgrade_region-resp-modal").modal("show");
                $("#downgrade_region").val('');
                $("#downgrade_topo").val('');
                $("#origination").val('');
                $("#btn-downgrade_region").prop('disabled', true)
                if(data.need_check){
                    var html1 = '<span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span> These nodes need check manually, maybe it is nwnom vm or have been decommed. <span id="need-check-nodes">' + data.need_check_node + '</span>';
                    $("#decomm-need-check-info").html(html1);
                    $("#decomm-need-check-modal").modal("show");
                }
            }
            else {
                var html = '<span class="glyphicon glyphicon-alert" aria-hidden="true"></span> Downgrade failed as ' + data.msg + '</span>';
                $("#downgrade_region-resp-info").html(html);
                $("#downgrade_region-resp-modal").modal("show");
            }
        });
    },
    startDecomm_standalone_email: function(event) {
        var standalone_nodes = $("#decomm-standalone-email").val();
        var payload = JSON.stringify({"standalone_nodes": standalone_nodes});
        $.ajax({
            url: "/workflow/start_send_email/",
            method: "POST",
            dataType: "json",
            contentType : 'application/json',
            data: payload
        })
        .success(function(data) {
            if(data.success) {
                var html = '<span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span> Have send email to all nodes <span id="resp-app-id">' + standalone_nodes + '</span>';
                $("#decomm-resp-info").html(html);
                $("#decomm-resp-modal").modal("show");
                $("#decomm-standalone-email").val('');
                $("#btn-decomm-standalone-email").prop('disabled', true)
            }
            else {
                var html = '<span class="glyphicon glyphicon-alert" aria-hidden="true"></span> Decomm failed as ' + data.msg + '</span>';
                $("#decomm-resp-info").html(html);
                $("#decomm-resp-modal").modal("show");
                //setTimeout(function() { window.location.reload();}, 2000);
            }
        });
    },
    confirmAction: function(event) {
        var action = event.target.getAttribute("task_action");
        var task_uuid = event.target.getAttribute("task_uuid");
        this.action = action;
        this.task_uuid = task_uuid;
        var msg;
        if(action == "retry") {
            msg = "Are you sure you want to retry?";
        }
        else if(action == "continue") {
            msg = "Are you sure you want to continue?";
        }
        else if(action == "turnon_server") {
            msg = "Are you sure you want to turn on computes?";
        }
        else if(action == "adjust_bake") {
            msg = "Are you sure you want to turn on computes?";
        }
        else if(action == "start_restore_zebra") {
            msg = "Are you sure you want to rollback?";
        }
        else if(action == "complete_zebra") {
            msg = "Are you sure you want to complete task?";
        }
        else if(action == "cancel") {
            msg = "Are you sure you want to cancel task?";
        }
        else if(action == "rollback_stage_decom") {
            msg = "Are you sure you want to rollback task?";
        }
        else if(action == "complete_downgrade") {
            msg = "Are you sure you want to complete task?";
        }
        else if(action == "rollback_add_nodes_to_vip") {
            msg = "Are you sure you want to rollback this task?";
        }
        else if(action == "complete_add_nodes_to_vip") {
            msg = "Are you sure you want to complete task?";
        }
        else if(action == "rollback_remove_nodes_from_vip") {
            msg = "Are you sure you want to rollback this task?";
        }
        else if(action == "complete_remove_nodes_from_vip") {
            msg = "Are you sure you want to complete task?";
        }
        else if(action == "rollback_vip_delete") {
            msg = "Are you sure you want to rollback the delete vip task?";
        }
        else if(action == "complete_vip_delete") {
            msg = "Are you sure you want to complete task?";
        }
        else if(action == "rollback_lb_operation") {
            msg = "Are you sure you want to rollback task?";
        }
        else if(action == "complete_lb_operate") {
            msg = "Are you sure you want to complete task?";
        }
        else if(action == "complete_staged_decomm") {
            msg = "Are you sure you want to complete task?";
        }
        else {
            alert("task action not recognized: " + action);
        }
        $("#cnfm-txt").html(msg);
        $("#action-cfm-modal").modal("show");
        $("#btn-tkactn").attr("task_action", action);
    },
    takeAction: function(event) {
        task_uuid = this.task_uuid;
        action = this.action;
        var payload = JSON.stringify({"task_uuid": task_uuid, "action": action});
        $.ajax({
            url: "/workflow/action/",
            method: "POST",
            dataType: "json",
            contentType : 'application/json',
            data: payload
        })
        .success(function(data) {
            if(data.success) {
                var html = '<span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span> submitted';
                $("#action-resp-info").html(html);
                $("#action-resp-modal").modal("show");
                setTimeout(function() { window.location.reload(); }, 2000);
            }
            else {
                var html = '<span class="glyphicon glyphicon-alert" aria-hidden="true"></span> Failed to ' + action + ' due to ' + data.msg + '</span>';
                $("#action-resp-info").html(html);
                $("#action-resp-modal").modal("show");
            }
        });
    },
    updateBakeDays: function(event) {
        task_uuid = this.task_uuid;
        bake_days = $("#bake-days").val();
        var payload = JSON.stringify({"task_uuid": task_uuid, "bake_days": bake_days});
        $.ajax({
            url: "/update_bake_days/",
            method: "POST",
            dataType: "json",
            contentType : 'application/json',
            data: payload
        })
        .success(function(data) {
            if(data.success) {
                var html = '<span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span> updated';
                $("#action-resp-info").html(html);
                $("#action-resp-modal").modal("show");
                setTimeout(function() { window.location.reload(); }, 2000);
            }
            else {
                var html = '<span class="glyphicon glyphicon-alert" aria-hidden="true"></span> Failed to update baking days due to ' + data.msg + '</span>';
                $("#action-resp-info").html(html);
                $("#action-resp-modal").modal("show");
            }
        });
    },
    showAdjustModal: function(event) {
        $("#adjust-bake-modal").on("shown.bs.modal", function() {
            $("#bake-days").select();
        });
        var bake_days = event.target.getAttribute("bake_days");
        var task_uuid = event.target.getAttribute("task_uuid");
        this.task_uuid = task_uuid;
        $("#bake-days").val(bake_days);
        $("#adjust-bake-modal").modal("show");
    },
    showFlexUpInputs: function(event) {
        $("#cmpnt-flexdown").hide();
        $("#cmpnt-flexup").show();
    },
    showFlexDownInputs: function(event) {
        $("#cmpnt-flexup").hide();
        $("#cmpnt-flexdown").show();
    },
    showUpGradeInputs: function(event) {
        $("#cmpnt-downgrade").hide();
        $("#cmpnt-upgrade").show();
    },
    showDownGradeInputs: function(event) {
        $("#cmpnt-upgrade").hide();
        $("#cmpnt-downgrade").show();
    },
};

var all_tasks = {
    search: function() {
        var text = $("#app-keyword").val();
        var loc = window.location.href;
        var regex = /(^http.*\/all_tasks)/;
        var match = regex.exec(loc);
        var new_url = match[1] + "?keyword=" + text;
        window.location.href = new_url;
    },
    visit_page: function(page) {
        var loc = window.location.href;
        var param_regex = /^http.*\/all_tasks[\/]\?(.*)$/i;
        var param_match = param_regex.exec(loc);
        var new_url;
        if(!param_match) {
            new_url = loc + "?page=" + page;
            window.location.href = new_url;
            return;
        }

        var query_str = param_match[1];
        var querys = query_str.split("&");
        var params = {};
        for(var i=0; i < querys.length; i++) {
            var keyvalue = querys[i].split("=");
            if(keyvalue.length < 2){
                continue;
            }
            var key = keyvalue[0];
            var value = keyvalue[1];
            params[key] = value;
        }
        params["page"] = page;
        var uri_regex = /(^http.*\/all_tasks)/;
        var uri_match = uri_regex.exec(loc);
        var new_query_str = "";
        for(var i=0; i<Object.keys(params).length; i++) {
            var key = Object.keys(params)[i];
            var value = params[key];
            if(i==0) {
                new_query_str += key + "=" + value;
            }
            else {
                new_query_str += "&" + key + "=" + value;
            }
        }
        new_url = uri_match[1] + "?" + new_query_str;
        window.location.href = new_url;
    },
    onkeydownSearch: function(event) {
        if(event.keyCode == 13) {
            this.search();
        }
    }
}
