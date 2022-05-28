var upgrade = {
    timeout: null,
    type: null,
    region: null,
    image: null,
    size: null,
    num: null,
    regions: null,
    app_id: null,
    server: null,
    other_size: false,
    search_app: function(app_id) {
        var $this = this;
        $this.type = "app";
        $.ajax({
            url: "/api/search_app/" + app_id + "/",
            method: "GET",
            contentType: "application/json",
        }).success(function(data) {
            var found = data["result"]["found"];
            if(!found) {
                var err = app_id + " not found";
                $("#apphost-err").html(err);
                $("#apphost-err").show();
            }
            else {
                $("#apphost-err").hide()
                $(".app-param").show();
                $this.type = "app";
                $this.app_id = app_id;
            }
        });
    },
    search_region: function(app_id) {
        var $this = this;
        $.ajax({
            url: "/api/search_region/" + app_id + "/",
            method: "GET",
            contentType: "application/json",
        }).success(function(data) {
            var found = data["result"]["found"];
            if(!found) {
                var err = "server " + ip + " not found";
                $("#apphost-err").html(err);
                $("#apphost-err").show();
            }
            else {
                var regions = data["result"]["regions"];
                $("#apphost-err").hide();
                $(".app-param").show();
                var region;
                var label_region = {"SLC": "region_slc", "LVS": "region_lvs", "PHX": "region_phx", "RNO:RNOAZ01": "region_rno01", "RNO:RNOAZ02": "region_rno02", "RNO:RNOAZ03": "region_rno03"};
                for(region in label_region){
                    if (regions.indexOf(region) == -1){
                        var region_show = "." + label_region[region];
                        console.log(region_show);
                        $(region_show).show();
                    }
                }
            }
        });
    },
    search_server_by_ip: function(ip) {
        var $this = this;
        $.ajax({
            url: "/api/search_server_by_ip/" + ip + "/",
            method: "GET",
            contentType: "application/json",
        }).success(function(data) {
            var found = data["result"]["found"];
            if(!found) {
                var err = "server " + ip + " not found";
                $("#apphost-err").html(err);
                $("#apphost-err").show();
            }
            else {
                $("#apphost-err").hide()
                $(".app-param").hide();
                $this.type = "ip";
                $this.server = ip;
            }
        });
    },
    search_server_by_name: function(hostname) {
        var $this = this;
        $.ajax({
            url: "/api/search_server_by_name/" + hostname + "/",
            method: "GET",
            contentType: "application/json",
        }).success(function(data) {
            var found = data["result"]["found"];
            if(!found) {
                var err = "server " + hostname + " not found";
                $("#apphost-err").html(err);
                $("#apphost-err").show();
            }
            else {
                $("#apphost-err").hide()
                $(".app-param").hide();
                $this.type = "name";
                $this.server = hostname;
            }
        });
    },
    checkInputNotEmpty: function() {
        var $this = this;
        var num = $.trim($("#incr-num").val());
        $this.num = num;
        if($this.type == "app") {
            var app = $.trim($("#app-host").val());
            var has_slc = $("#reg-slc").is(":checked");
            var region = $('input[name="region"]:checked').val();
            if(region != undefined && region.length > 0 && num != "") {
                $("#btn-upgrade-server").prop("disabled", false);
            }
            else {
                $("#btn-upgrade-server").prop("disabled", true);
            }
        }
    },
    onkeyupAppHost: function(event) {
        var $this = this;
        timeout = $this.timeout;
        clearTimeout(timeout);
        $this.timeout = setTimeout(function() {
            var app_host = $.trim($("#app-host").val());
            if(app_host == '') {
                return;
            }
            if(/:ENV/.test(app_host)) {
                $this.search_app(app_host);
                $this.search_region(app_host);
            }
            else if(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(app_host)) {
                $this.search_server_by_ip(app_host);
            }
            else {
                $this.search_server_by_name(app_host);
            }
        }, 500);
    },
    onchangeSize: function(obj) {
        var $this = this;
        var size = obj.value;
        if(size == "other") {
            $this.other_size = true;
            $("#other-size").show();
        }
        else {
            $this.other_size = false;
            $("#other-size").hide();
        }
    },
    confirmUpgrade: function(event) {
        var $this = this;
        var num = $this.num;
        var is_num = /^\d+$/.test(num);
        $this.region = $('input[name="region"]:checked').val();
        $this.image = $.trim($("#image").val());
        $this.size = $.trim($("#size").val());
        console.log($this.size);
        if($this.size == "") {
            $this.size = "";
        }
        else if($this.size == "other") {
            $this.size = $("#other-size-text").val();
        }
        if(!is_num) {
            var msg = "Number must contain digits only";
            $('<p class="text-danger errmsg">' + msg + '</p>').insertAfter('#incr-num');
            return;

        }
        $("#upgrade-cfm-modal").modal("show");
    },
    startUpgrade: function(event) {
        var $this = this;
        $("#upgrade-errmsg").hide();
        if($this.type == "app") {
            var payload = {
                "app_id": $this.app_id,
                "region": $this.region,
                "size": $this.size,
                "num": $this.num,
            };
            $.ajax({
                url: "/workflow/start_upgrade_app/",
                method: "POST",
                dataType: "json",
                data: JSON.stringify(payload)
            }).success(function(data) {
                if(data.success) {
                    var html = '<span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span> Started flexup</span>';
                    $("#flex-resp-info").html(html);
                    $("#flex-resp-modal").modal("show");
                    setTimeout(function() { window.location = "/my_tasks/";}, 2000);
                }
                else {
                    var html = '<span class="glyphicon glyphicon-alert" aria-hidden="true"></span> Flexup failed as ' + data.msg + '</span>';
                    $("#flex-resp-info").html(html);
                    $("#flex-resp-modal").modal("show");
                }
            });
        }
        else {
            var payload = {
                "server": $this.server,
                "image": $this.image,
                "size": $this.size,
                "num": $this.num,
            };
            $.ajax({
                url: "/workflow/start_flexup_host/",
                method: "POST",
                dataType: "json",
                data: JSON.stringify(payload)
            }).success(function(data) {
                if(data.success) {
                    var html = '<span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span> Started flexup</span>';
                    $("#flex-resp-info").html(html);
                    $("#flex-resp-modal").modal("show");
                    setTimeout(function() { window.location = "/my_tasks/";}, 2000);
                }
                else {
                    var html = '<span class="glyphicon glyphicon-alert" aria-hidden="true"></span> Flexup failed as ' + data.msg + '</span>';
                    $("#flex-resp-info").html(html);
                    $("#flex-resp-info").modal("show");
                }
            });
        }
    }
};

var flexdown = {
    servers: null,
    checkInputNotEmpty: function() {
        var $this = this;
        var servers = $("#flexdown-server").val();
        if($.trim(servers) != "") {
            $("#btn-flexdown-server").prop("disabled", false);
        }
        else {
            $("#btn-flexdown-server").prop("disabled", true);
        }
    },
    confirmFlexdown: function(event) {
        var $this = this;
        var form_servers = $("#flexdown-server").val().trim().split("\n");
        var servers = [];
        for(var i=0; i<form_servers.length; i++) {
            server = form_servers[i].trim();
            if(server != "") {
                servers.push(server);
            }
        }
        $this.servers = servers;
        $("#flexdown-cfm-modal").modal("show");
    },
    startFlexdown: function(event) {
        var $this = this;
        $.ajax({
            url: "/workflow/start_flexdown/",
            method: "POST",
            dataType: "json",
            data: JSON.stringify($this.servers)
        }).success(function(data) {
            if(data.success) {
                var html = '<span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span> Started flexdown</span>';
                $("#flex-resp-info").html(html);
                $("#flex-resp-modal").modal("show");
                setTimeout(function() { window.location = "/my_tasks/"; }, 2000);
            }
            else {
                var html = '<span class="glyphicon glyphicon-alert" aria-hidden="true"></span> Flexdown failed as ' + data.msg + '</span>';
                $("#flex-resp-info").html(html);
                $("#flex-resp-modal").modal("show");
            }
        });
    }
};
