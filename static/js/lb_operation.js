var lb_operation = {
    showCreateVipInputs: function(event) {
        $("#cmpnt-delete-vip").hide();
        $("#cmpnt-create-vip").show();
    },
    showDeleteVipInputs: function(event) {
        $("#cmpnt-create-vip").hide();
        $("#cmpnt-delete-vip").show();
    },
    showAddNodeToVipInputs: function(event) {
        $("#cmpnt-remove-node-from-vip").hide();
        $("#cmpnt-add-node-to-vip").show();
    },
    showRemoveNodeFromVipInputs: function(event) {
        $("#cmpnt-add-node-to-vip").hide();
        $("#cmpnt-remove-node-from-vip").show();
    },
    checkDisableInputNotEmpty: function() {
        var $this = this;
        var vips = $("#disable-enable-vip").val();
        var operate = $('input[name="lb-operation"]:checked').val();
        if($.trim(vips) != "" && $.trim(operate) != "") {
            $("#btn-disable-enable-vip").prop("disabled", false);
            $("#btn-check-vip").prop("disabled", false);
        }
        else if ($.trim(vips) != "") {
            $("#btn-check-vip").prop("disabled", false);
        }
        else {
            $("#btn-disable-enable-vip").prop("disabled", true);
            $("#btn-check-vip").prop("disabled", true);
        }
    },
    confirmLBOperate: function(event) {
        var $this = this;
        var form_vips = $("#disable-enable-vip").val().trim().split("\n");
        var lb_opertation = $('input[name="lb-operation"]:checked').val();
        var vips = [];
        for(var i=0; i<form_vips.length; i++) {
            vip = form_vips[i].trim();
            if(vip != "") {
                vips.push(vip);
            }
        }
        $this.vips = vips;
        console.log(lb_opertation)
        $this.lb_operation = lb_opertation;
        $("#disable-enable-vip-cfm-modal").modal("show");
    },
    startDisableEnableVip: function(event) {
        var $this = this;
        var payload = {"vips": $this.vips, "lb_operation": $this.lb_operation,};
        $.ajax({
            url: "/workflow/start_LBoperation/",
            method: "POST",
            dataType: "json",
            data: JSON.stringify(payload)
        }).success(function(data) {
            if(data.success) {
                var html = '<span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span> Started LB Opetate</span>';
                $("#disable-enable-vip-resp-info").html(html);
                $("#disable-enable-vip-resp-modal").modal("show");
                setTimeout(function() { window.location = "/my_tasks/"; }, 2000);
            }
            else {
                var html = '<span class="glyphicon glyphicon-alert" aria-hidden="true"></span> LB operate failed as ' + data.msg + '</span>';
                $("#disable-enable-vip-resp-info").html(html);
                $("#disable-enable-vip-resp-modal").modal("show");
            }
        });
    },
    checkVips: function(event) {
        var vips = $("#disable-enable-vip").val().trim().split("\n");
        var payload = {"vips": vips};

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
            url: "/lb_operation/check_vips/",
            method: "POST",
            dataType: "json",
            data: JSON.stringify(payload)
        }).success(function(data) {
            $.unblockUI();
            if(data.success) {
                console.log(data.msg);
                results = JSON.stringify(data.msg, null, 1);
                var html = results +'</span>';
                $("#show-json-resp-info").html(html);
                $("#show-json-resp-modal").modal("show");
            }
            else {
                var html = '<span class="glyphicon glyphicon-alert" aria-hidden="true"></span> Check VIPs failed as ' + data.msg + '</span>';
                $("#show-json-resp-info").html(html);
                $("#show-json-resp-modal").modal("show");
            }
        });
    },
    rowAddButtonOnClick:function (event) {
        var nodeIpInput = $('#RecordNodeIpInput');
        var nodePortInput = $('#RecordNodePortInput');
        var nodeip = nodeIpInput.val();
        var nodeport = nodePortInput.val();
        console.log(nodeip, nodeport);
        dataList.push({nodeip:nodeip.trim().toLowerCase(), nodeport:nodeport.trim().toLowerCase()});
        nodeIpInput.val('');
        nodePortInput.val('');
        $("#btn-add-nodes").prop("disabled", true);
        console.log(dataList);
        var contentHtml = lb_operation.getTableContentHtml();
        $("#addARecordTableBody").html(contentHtml);
    },
    rowAddNodeToVipButtonOnClick:function (event) {
        var nodeIpInput = $('#RecordNodeAddToVipIpInput');
        var nodePortInput = $('#RecordNodeAddToVipPortInput');
        var nodeip = nodeIpInput.val();
        var nodeport = nodePortInput.val();
        console.log(nodeip, nodeport);
        AddNodedataList.push({nodeip:nodeip.trim().toLowerCase(), nodeport:nodeport.trim().toLowerCase()});
        nodeIpInput.val('');
        nodePortInput.val('');
        $("#btn-add-nodes-to-vip").prop("disabled", true);
        console.log(AddNodedataList);
        var contentHtml = lb_operation.getAddNodeToVipTableContentHtml();
        $("#addNodeToVipTableBody").html(contentHtml);
    },
    showrowAddButton:function(event){
        var $this = this;
        var nodeip = $("#RecordNodeIpInput").val();
        var nodeport = $("#RecordNodePortInput").val();
        if($.trim(nodeip) != "" && $.trim(nodeport) != "") {
            $("#btn-add-nodes").prop("disabled", false);
        }
    },
    showrowAddNodeToVipButton:function(event){
        var $this = this;
        var nodeip = $("#RecordNodeAddToVipIpInput").val();
        var nodeport = $("#RecordNodeAddToVipPortInput").val();
        if($.trim(nodeip) != "" && $.trim(nodeport) != "") {
            $("#btn-add-nodes-to-vip").prop("disabled", false);
        }
    },
    showvipCreateButton:function(event){
        var $this = this;
        var lbserver = $("#lb-server").val();
        var vipaddress = $("#vip-address").val();
        var vipport = $("#vip-port").val();
        var nuggetname = $("#nugget-name").val();
        var tiervip = $("#tier-vip").val();
        console.log(dataList.length)
        if($.trim(lbserver) != "" && $.trim(vipaddress) != "" && $.trim(vipport) != "" && $.trim(nuggetname) != "" && $.trim(tiervip) != "" && dataList.length != 0) {
            $("#btn-create-vip").prop("disabled", false);
        }
        else {
            $("#btn-create-vip").prop("disabled", true);
        }
    },
    showAddNodeToVipButton:function(event){
        var vipaddress = $("#add-node-to-vip-address").val();
        var vipport = $("#add-node-to-vip-port").val();
        if($.trim(vipaddress) != "" && $.trim(vipport) != "" && AddNodedataList.length != 0) {
            $("#btn-add-nodes-action").prop("disabled", false);
        }
        else {
            $("#btn-add-nodes-action").prop("disabled", true);
        }
    },
    showRemoveNodeFromVipButton:function(event){
        var vipaddress = $("#remove-nodes-vip-address").val();
        var vipport = $("#remove-nodes-vip-port").val();
        if($.trim(vipaddress) != "" && $.trim(vipport) != "") {
            $("#btn-show-nodes-vip").prop("disabled", false);
        }
        else {
            $("#btn-show-nodes-vip").prop("disabled", true);
            $("#btn-remove-nodes-from-vip").prop("disabled", true);
        }
    },
    showvipDeleteButton:function(event){
        var vipport = $("#delete-vip-port").val();
        var vipaddress = $("#delete-vip-address").val();
        if($.trim(vipport) != "" && $.trim(vipaddress) != "") {
            $("#btn-delete-vip").prop("disabled", false);
        }
        else {
            $("#btn-delete-vip").prop("disabled", true);
        }
    },

    startCreatevip:function() {
        var lbserver = $("#lb-server").val();
        var vipaddress = $("#vip-address").val();
        var vipport = $("#vip-port").val();
        var nuggetname = $("#nugget-name").val();
        var tiervip = $("#tier-vip").val();
        var payload = {"lbserver": lbserver, "vipaddress": vipaddress, "vipport": vipport, "nuggetname": nuggetname, "tiervip": tiervip, "node-lists": dataList};
        $.ajax({
            url: "/workflow/start_create_vip/",
            method: "POST",
            dataType: "json",
            data: JSON.stringify(payload)
        }).success(function(data) {
            if(data.success) {
                var html = '<span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span> Started VIP Create</span>';
                $("#create-delete-vip-resp-info").html(html);
                $("#create-delete-vip-resp-modal").modal("show");
                setTimeout(function() { window.location = "/my_tasks/"; }, 2000);
            }
            else {
                var html = '<span class="glyphicon glyphicon-alert" aria-hidden="true"></span> Vip Create failed as ' + data.msg + '</span>';
                $("#create-delete-vip-resp-info").html(html);
                $("#create-delete-vip-resp-modal").modal("show");
            }
        });
    },
    showVipNodes:function() {
        var vipaddress = $("#remove-nodes-vip-address").val();
        var vipport = $("#remove-nodes-vip-port").val();
        var payload = {"vipaddress": vipaddress, "vipport": vipport};
        $.ajax({
            url: "/lb_operation/show_vips_nodes/",
            method: "POST",
            dataType: "json",
            data: JSON.stringify(payload)
        }).success(function(data) {
            if(data.success) {
                var node_lists = data.msg;
                ShowAllNodesdataList = node_lists;
                console.log(node_lists)
                var contentHtml = lb_operation.getRemoveNodesFromVipTableContentHtml(node_lists);
                $("#removeNodesFromVipTableBody").html(contentHtml);
                $("#btn-remove-nodes-from-vip").prop("disabled", false);
            }
            else {
                var html = '<span class="glyphicon glyphicon-alert" aria-hidden="true"></span> Show vip nodes failed ' + data.msg + '</span>';
                $("#add-remove-node-to-vip-resp-info").html(html);
                $("#add-remove-node-to-vip-resp-modal").modal("show");
            }
        });
    },
    confirmCreatevip: function(event) {
        $("#createvip-cfm-modal").modal("show");
    },
    confirmAddNodeToVip: function(event) {
        $("#add-node-to-vip-cfm-modal").modal("show");
    },
    confirmDeleteVip: function(event) {
        $("#deletevip-cfm-modal").modal("show");
    },
    confirmRemoveNodeFromVip: function(event) {
        for (var index=0; index<ShowAllNodesdataList.length; index++) {
            if($("#checkout-"+index).is(':checked')){
                var checkout_value = $("#checkout-"+index).val();
                ConfirmRemoveNodesdataList.push({nodeaddress:checkout_value.toLowerCase()});
                console.log(ConfirmRemoveNodesdataList);
            }
        }
        if(ConfirmRemoveNodesdataList.length == 0) {
            var html = '<span class="glyphicon glyphicon-alert" aria-hidden="true"></span> Please select at least one node.</span>';
                $("#add-remove-node-to-vip-resp-info").html(html);
                $("#add-remove-node-to-vip-resp-modal").modal("show");
        }
        else {
            var nodestr = ""
            for (var index=0; index<ConfirmRemoveNodesdataList.length; index++) {
                nodestr += ConfirmRemoveNodesdataList[index]["nodeaddress"]
                nodestr += "\n"
            }
            $("#cfm-remove-from-vip-nodes").html(nodestr);
            $("#deletevip-cfm-modal").modal("show");
        }
    },
    cleanRemoveListCache: function(event) {
        ConfirmRemoveNodesdataList.splice(0,ConfirmRemoveNodesdataList.length)
    },
    startRemoveNodesFromVip:function() {
        var vipaddress = $("#remove-nodes-vip-address").val();
        var vipport = $("#remove-nodes-vip-port").val();
        var payload = {"vipaddress": vipaddress, "vipport": vipport, "need_remove_nodes": ConfirmRemoveNodesdataList};
        $.ajax({
            url: "/lb_operation/start_remove_nodes_from_vip/",
            method: "POST",
            dataType: "json",
            data: JSON.stringify(payload)
        }).success(function(data) {
            if(data.success) {
                var html = '<span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span> Started Remove nodes from VIP</span>';
                $("#add-remove-node-to-vip-resp-info").html(html);
                $("#add-remove-node-to-vip-resp-modal").modal("show");
                setTimeout(function() { window.location = "/my_tasks/"; }, 2000);
            }
            else {
                var html = '<span class="glyphicon glyphicon-alert" aria-hidden="true"></span> Remove nodes from vip failed ' + data.msg + '</span>';
                $("#add-remove-node-to-vip-resp-info").html(html);
                $("#add-remove-node-to-vip-resp-modal").modal("show");
            }
        });
    },
    startDeletevip:function() {
        var vipport = $("#delete-vip-port").val();
        var vipaddress = $("#delete-vip-address").val();
        var payload = {"vipaddress": vipaddress, "vipport": vipport};
        $.ajax({
            url: "/workflow/start_delete_vip/",
            method: "POST",
            dataType: "json",
            data: JSON.stringify(payload)
        }).success(function(data) {
            if(data.success) {
                var html = '<span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span> Started VIP Delete</span>';
                $("#create-delete-vip-resp-info").html(html);
                $("#create-delete-vip-resp-modal").modal("show");
                setTimeout(function() { window.location = "/my_tasks/"; }, 2000);
            }
            else {
                var html = '<span class="glyphicon glyphicon-alert" aria-hidden="true"></span> Vip Delete failed as ' + data.msg + '</span>';
                $("#create-delete-vip-resp-info").html(html);
                $("#create-delete-vip-resp-modal").modal("show");
            }
        });
    },
    startAddNodeToVip:function() {
        var vipport = $("#add-node-to-vip-port").val();
        var vipaddress = $("#add-node-to-vip-address").val();
        var payload = {"vipaddress": vipaddress, "vipport": vipport, "node-lists": AddNodedataList};
        $.ajax({
            url: "/workflow/start_add_node_to_vip/",
            method: "POST",
            dataType: "json",
            data: JSON.stringify(payload)
        }).success(function(data) {
            if(data.success) {
                var html = '<span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span> Started Add Nodes to Vip</span>';
                $("#add-remove-node-to-vip-resp-info").html(html);
                $("#add-remove-node-to-vip-resp-modal").modal("show");
                setTimeout(function() { window.location = "/my_tasks/"; }, 2000);
            }
            else {
                var html = '<span class="glyphicon glyphicon-alert" aria-hidden="true"></span> Vip Delete failed as ' + data.msg + '</span>';
                $("#add-remove-node-to-vip-resp-info").html(html);
                $("#add-remove-node-to-vip-resp-modal").modal("show");
            }
        });
    },
    onkeyupVIPAddress: function(event) {
        var $this = this;
        timeout = $this.timeout;
        clearTimeout(timeout);
        $this.timeout = setTimeout(function() {
            var vipaddress = $.trim($("#vip-address").val());
            if(vipaddress == '') {
                return;
            }
            if(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(vipaddress)) {
                $this.search_vip_address_exist(vipaddress);
            }
            else {
                $this.search_server_by_name(vipaddress);
            }
        }, 500);
    },
    search_lb_server_exist: function(lbserver) {
        var $this = this;
        $.ajax({
            url: "/api/search_lb_server_exist/" + lbserver + "/",
            method: "GET",
            contentType: "application/json",
        }).success(function(data) {
            var found = data["result"]["found"];
            if(!found) {
                var err = "lbserver " + lbserver + " not found";
                $("#lbserver-err").html(err);
                $("#lbserver-err").show();
            }
            else {
                $("#lbserver-err").hide()
                $(".app-param").hide();
                $this.type = "lbserver";
                $this.server = lbserver;
            }
        });
    },
    search_vip_address_exist: function(ip) {
        var $this = this;
        $.ajax({
            url: "/api/search_vip_address_exist/" + ip + "/",
            method: "GET",
            contentType: "application/json",
        }).success(function(data) {
            var found = data["result"]["found"];
            if(!found) {
                var err = "the vip address " + ip + " has exists";
                $("#vipaddress-err").html(err);
                $("#vipaddress-err").show();
            }
            else {
                $("#vipaddress-err").hide()
                $(".app-param").hide();
                $this.type = "vipaddress";
                $this.server = ip;
            }
        });
    },
    getTableContentHtml:function () {
        var contentHtml = "";
        for (var index=0; index<dataList.length; index++) {
            var itemDict = dataList[index];
            var rowHtml = '<tr><td>';
            rowHtml += (index+1) +'</td><td>'+ itemDict.nodeip +'</td><td>'+ itemDict.nodeport;
            rowHtml += '</td><td><button class="btn btn-primary" id="btn-add-nodes" type="button" style="padding: 5px 5px; height: 16px; text-align: center" onclick="lb_operation.rowRemoveButtonOnClick('+index+');lb_operation.showvipCreateButton(event)">-</button></td></tr>';
            contentHtml += rowHtml;
        }
        return contentHtml
    },
    getAddNodeToVipTableContentHtml:function () {
        var contentHtml = "";
        for (var index=0; index<AddNodedataList.length; index++) {
            var itemDict = AddNodedataList[index];
            var rowHtml = '<tr><td>';
            rowHtml += (index+1) +'</td><td>'+ itemDict.nodeip +'</td><td>'+ itemDict.nodeport;
            rowHtml += '</td><td><button class="btn btn-primary" id="btn-add-nodes" type="button" style="padding: 5px 5px; height: 16px; text-align: center" onclick="lb_operation.rowAddNodeToVipRemoveButtonOnClick('+index+');lb_operation.showAddNodeToVipButton(event)">-</button></td></tr>';
            contentHtml += rowHtml;
        }
        return contentHtml
    },
    getRemoveNodesFromVipTableContentHtml:function (nodelists) {
        var contentHtml = "";
        for (var index=0; index<nodelists.length; index++) {
            var itemDict = nodelists[index];
            var rowHtml = '<tr><td>';
            rowHtml += (index+1) +'</td><td>'+ itemDict.service_address;
            rowHtml += '</td><td><input type="checkbox" value="'+itemDict.service_address+'" id="checkout-'+index+'">';
            contentHtml += rowHtml;
        }
        return contentHtml
    },
    rowRemoveButtonOnClick:function(index) {
        console.log(index);
        dataList.splice(index, 1);
        var contentHtml = lb_operation.getTableContentHtml();
        $("#addARecordTableBody").html(contentHtml);
    },
    rowAddNodeToVipRemoveButtonOnClick:function(index) {
        console.log(index);
        AddNodedataList.splice(index, 1);
        var contentHtml = lb_operation.getAddNodeToVipTableContentHtml();
        $("#addNodeToVipTableBody").html(contentHtml);
    },
}

var dataList = [];
var AddNodedataList = [];
var ShowAllNodesdataList = [];
var ConfirmRemoveNodesdataList = [];